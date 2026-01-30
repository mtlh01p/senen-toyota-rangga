"use client";
import React, { useMemo, useEffect, useRef, useCallback } from "react";
import StationDot from "@/app/components/StationDot";
import LineSegment from "@/app/components/LineSegment";
import { stations, main_corridors, cbrt_lines, nbrt_lines } from "@/lib/sample";
import { Station, BRTCorridor, CBRTLine } from "@/types";

type Props = {
  line_foc: BRTCorridor | CBRTLine;
  thisStn: Station;
  destStn: Station;
  doorsSide: "left" | "right";
};

/* =========================
   Station ID parsing helper
   ========================= */
function parseStationId(id: string | number) {
  const str = String(id);
  const match = str.match(/^(\d+-\d+)([A-Z])?$/);
  return {
    base: match?.[1] ?? str,
    suffix: match?.[2] ?? null, // A / B / null
  };
}

export default function StationLine({
  line_foc,
  thisStn,
  destStn,
  doorsSide,
}: Props) {
  const thisId = thisStn.id;
  const destId = destStn.id;

  const { stationIdsDir1, stationIdsDir2 } = line_foc;

  /* =========================
     Direction selection
     ========================= */
  const chosenDir = useMemo(() => {
    const idx = (dir: (number | string)[]) => ({
      this: dir.indexOf(thisId),
      dest: dir.indexOf(destId),
    });

    const d1 = idx(stationIdsDir1);
    const d2 = idx(stationIdsDir2);

    const d1Valid = d1.this !== -1 && d1.dest !== -1;
    const d2Valid = d2.this !== -1 && d2.dest !== -1;

    if (d1Valid && !d2Valid) return stationIdsDir1;
    if (d2Valid && !d1Valid) return stationIdsDir2;

    if (d1Valid && d1.this <= d1.dest) return stationIdsDir1;
    if (d2Valid && d2.this <= d2.dest) return stationIdsDir2;

    return stationIdsDir1;
  }, [stationIdsDir1, stationIdsDir2, thisId, destId]);

  const stationOrder =
    doorsSide === "right" ? [...chosenDir].reverse() : chosenDir;

  /* =========================
     One-way logic (NEW)
     ========================= */
  const isStationOneWayOnLine = useCallback(
    (stationId: string | number) => {
      const { base } = parseStationId(stationId);

      const dir1Matches = stationIdsDir1
        .map(parseStationId)
        .filter(s => s.base === base);

      const dir2Matches = stationIdsDir2
        .map(parseStationId)
        .filter(s => s.base === base);

      // Appears in both directions → NOT one-way
      if (dir1Matches.length > 0 && dir2Matches.length > 0) {
        const d1 = new Set(dir1Matches.map(s => s.suffix));
        const d2 = new Set(dir2Matches.map(s => s.suffix));

        // Same platform in both
        for (const s of d1) {
          if (d2.has(s)) return false;
        }

        // A/B split across directions
        if (
          (d1.has("A") && d2.has("B")) ||
          (d1.has("B") && d2.has("A"))
        ) {
          return false;
        }

        return false;
      }

      // Appears in only one direction → one-way
      return dir1Matches.length > 0 || dir2Matches.length > 0;
    },
    [stationIdsDir1, stationIdsDir2]
  );

  /* =========================
     Route line extremes
     ========================= */
  const routeLineExtremes = useMemo(() => {
    const extremes = new Map<
      number | string,
      { firstIdx: number; lastIdx: number }
    >();

    stationOrder.forEach((stationId, idx) => {
      const station = stations.find(s => s.id === stationId);
      if (!station) return;

      const lineIds = [
        ...(station.brtCorridorIds ?? []),
        ...(station.cbrtLineIds ?? []),
        ...(station.nbrtLineIds ?? []),
      ].filter(id => id !== line_foc.id);

      lineIds.forEach(id => {
        if (!extremes.has(id)) {
          extremes.set(id, { firstIdx: idx, lastIdx: idx });
        } else {
          extremes.get(id)!.lastIdx = idx;
        }
      });
    });

    return extremes;
  }, [stationOrder, line_foc.id]);

  /* =========================
     Line color
     ========================= */
  const lineColor =
    typeof line_foc.id === "number"
      ? main_corridors.find(c => c.id === line_foc.id)?.color ?? "#fff"
      : cbrt_lines.find(c => c.id === line_foc.id)?.color ?? "#fff";

  const containerRef = useRef<HTMLDivElement | null>(null);

  /* =========================
     Scroll animation
     ========================= */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const DURATION_MS = 1200;
    const START_DELAY = 4000;

    const start =
      doorsSide === "left" ? 0 : el.scrollWidth - el.clientWidth;
    const end =
      doorsSide === "left" ? el.scrollWidth - el.clientWidth : 0;

    el.scrollLeft = start;

    let startTime: number | null = null;
    let rafId: number;

    const animate = (ts: number) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / DURATION_MS, 1);
      const eased =
        p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;

      el.scrollLeft = start + (end - start) * eased;
      if (p < 1) rafId = requestAnimationFrame(animate);
    };

    const t = setTimeout(() => {
      rafId = requestAnimationFrame(animate);
    }, START_DELAY);

    return () => {
      clearTimeout(t);
      cancelAnimationFrame(rafId);
    };
  }, [doorsSide, stationOrder.length]);

  /* =========================
     Disable user scroll
     ========================= */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const prevent = (e: Event) => e.preventDefault();
    el.addEventListener("wheel", prevent, { passive: false });
    el.addEventListener("touchmove", prevent, { passive: false });
    el.addEventListener("keydown", prevent, { passive: false });
    return () => {
      el.removeEventListener("wheel", prevent);
      el.removeEventListener("touchmove", prevent);
      el.removeEventListener("keydown", prevent);
    };
  }, []);

  /* =========================
     Render
     ========================= */
  return (
    <div
      ref={containerRef}
      className="flex items-center overflow-x-scroll pt-34 px-12 pb-16 w-[70%] no-scrollbar pointer-events-none hide-scrollbar"
    >
      {stationOrder.map((stationId, idx) => {
        const station = stations.find(s => s.id === stationId);
        if (!station) return null;

        const thisIndex = stationOrder.indexOf(thisId);
        const destIndex = stationOrder.indexOf(destId);

        const reached =
          doorsSide === "right" ? idx > thisIndex : idx < thisIndex;
        const willReach =
          doorsSide === "right" ? idx < destIndex : idx > destIndex;

        const segmentWidth = Math.max(
          (70 / (stationOrder.length - 1)) *
            (window.innerWidth * 0.7) /
            100,
          40
        );

        const roundelsToShow = [
          ...(station.brtCorridorIds ?? []).map(id => ({ id, type: 1 })),
          ...(station.cbrtLineIds ?? []).map(id => ({ id, type: 2 })),
          ...(station.nbrtLineIds ?? []).map(id => ({ id, type: 3 })),
        ]
          .filter(i => i.id !== line_foc.id)
          .filter(i => {
            const ex = routeLineExtremes.get(i.id);
            return ex && (idx === ex.firstIdx || idx === ex.lastIdx);
          })
          .map(i => {
            const obj =
              main_corridors.find(l => l.id === i.id) ||
              cbrt_lines.find(l => l.id === i.id) ||
              nbrt_lines.find(l => l.id === i.id);
            return obj ? { ...obj, _typeWeight: i.type } : null;
          })
          .filter(Boolean)
          .sort((a: any, b: any) => {
            if (a._typeWeight !== b._typeWeight)
              return a._typeWeight - b._typeWeight;
            if ((a.mainBRTC ?? 0) !== (b.mainBRTC ?? 0))
              return (a.mainBRTC ?? 0) - (b.mainBRTC ?? 0);
            return String(a.id).localeCompare(String(b.id), undefined, {
              numeric: true,
            });
          });

        const isOneWay = isStationOneWayOnLine(station.id);

        return (
          <div key={station.id} className="flex items-end shrink-0">
            <StationDot
              name={station.name}
              reached={reached}
              willReach={willReach}
              side={doorsSide}
              oneWay={isOneWay}
              stnItselfOneWay={station.oneWay}
              twoWayPay={station.payTransfer ?? false}
              focused={station.id === thisId}
              roundels={roundelsToShow}
              accessible={station.accessible}
            />

            {idx !== stationOrder.length - 1 && (
              <div className={isOneWay ? "pb-0.5" : "pb-2"}>
                <LineSegment
                  color={lineColor}
                  width={segmentWidth}
                  side={doorsSide}
                  focused={
                    doorsSide === "left"
                      ? idx === Math.min(thisIndex - 1, destIndex)
                      : idx === Math.max(thisIndex + 1, destIndex) - 1
                  }
                  fullOpacity={
                    !(
                      doorsSide === "right" &&
                      thisId === destId &&
                      thisIndex > 0 &&
                      idx === thisIndex - 1
                    ) &&
                    !(
                      doorsSide === "left" &&
                      thisId === destId &&
                      thisIndex < stationOrder.length - 1 &&
                      idx === thisIndex
                    ) &&
                    idx >= Math.min(thisIndex - 1, destIndex) &&
                    idx < Math.max(thisIndex + 1, destIndex)
                  }
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
