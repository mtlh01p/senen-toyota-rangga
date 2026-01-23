"use client";
import React, { useMemo, useEffect, useRef } from "react";
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

export default function StationLine({ line_foc, thisStn, destStn, doorsSide }: Props) {
  const thisId = thisStn.id;
  const destId = destStn.id;

  const { stationIdsDir1, stationIdsDir2 } = line_foc;

  // Determine direction
  const chosenDir = useMemo(() => {
    const idx = (dir: (number | string)[]) => ({
      this: dir.indexOf(thisId as number | string),
      dest: dir.indexOf(destId as number | string),
    });

    const d1 = idx(stationIdsDir1);
    const d2 = idx(stationIdsDir2);

    const d1Valid = d1.this !== -1 && d1.dest !== -1;
    const d2Valid = d2.this !== -1 && d2.dest !== -1;

    // Only one direction contains both stations
    if (d1Valid && !d2Valid) return stationIdsDir1;
    if (d2Valid && !d1Valid) return stationIdsDir2;

    // Both valid → choose the one where travel goes forward
    if (d1Valid && d1.this <= d1.dest) return stationIdsDir1;
    if (d2Valid && d2.this <= d2.dest) return stationIdsDir2;

    // Fallback (terminal cases)
    return stationIdsDir1;
  }, [stationIdsDir1, stationIdsDir2, thisId, destId]);

  const stationOrder = doorsSide === "right" ? [...chosenDir].reverse() : chosenDir;

  // Compute first & last index of each line along current route, from stations' own brtCorridorIds / cbrtLineIds
  const routeLineExtremes = useMemo(() => {
    const extremes = new Map<string, { firstIdx: number; lastIdx: number }>();
    const focId = String(line_foc.id);

    stationOrder.forEach((stationId, idx) => {
      const station = stations.find(s => String(s.id) === String(stationId));
      if (!station) return;

      const lineIds = [
        ...(station.brtCorridorIds ?? []),
        ...(station.cbrtLineIds ?? []),
        ...(station.nbrtLineIds ?? []),
      ]
        .map(String)
        .filter(id => id !== focId);

      lineIds.forEach(id => {
        const ex = extremes.get(id);
        if (!ex) {
          extremes.set(id, { firstIdx: idx, lastIdx: idx });
        } else {
          ex.lastIdx = idx;
        }
      });
    });

    return extremes;
  }, [stationOrder, line_foc.id]);

  // Determine color of line_foc
  const lineColor = "id" in line_foc
    ? line_foc.lineType === "BRTCorridor"
      ? main_corridors.find(c => c.id === line_foc.id)?.color || "#fff"
      : cbrt_lines.find(c => c.id === line_foc.id)?.color || "#fff"
    : "#fff";

  const containerRef = useRef<HTMLDivElement | null>(null);

  // Scroll animation
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const DURATION_MS = 1200;
    const START_DELAY = 4000;

    const start = doorsSide === "left" ? 0 : el.scrollWidth - el.clientWidth;
    const end = doorsSide === "left" ? el.scrollWidth - el.clientWidth : 0;

    el.scrollLeft = start;

    let startTime: number | null = null;
    let rafId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / DURATION_MS, 1);

      const eased = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      el.scrollLeft = start + (end - start) * eased;

      if (progress < 1) rafId = requestAnimationFrame(animate);
    };

    const timeout = setTimeout(() => { rafId = requestAnimationFrame(animate); }, START_DELAY);
    return () => { clearTimeout(timeout); cancelAnimationFrame(rafId); };
  }, [doorsSide, stationOrder.length]);

  // Disable user scroll
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

  return (
    <div ref={containerRef} className="flex items-center overflow-x-scroll pt-34 px-12 pb-16 w-[70%] no-scrollbar pointer-events-none hide-scrollbar">
      {stationOrder.map((stationId, idx) => {
        const station = stations.find(s => s.id === stationId);
        if (!station) return null;

        const segmentWidthNumber = Math.max(
          (70 / (stationOrder.length - 1)) * (window.innerWidth * 0.7) / 100,
          40
        );
        const thisIndex = stationOrder.indexOf(thisId);
        const destIndexInOrder = stationOrder.indexOf(destId);

        const reached = doorsSide === "right" ? idx > thisIndex : idx < thisIndex;
        const willReach = doorsSide === "right" ? idx < destIndexInOrder : idx > destIndexInOrder;

        const linePriority = {
          BRTCorridor: 0,
          CBRTLine: 1,
          NBRTLine: 2,
        } as const;

        // Determine roundels to show: first or last station for each line along route
        const roundelsToShow = [
          ...(station.brtCorridorIds ?? []),
          ...(station.cbrtLineIds ?? []),
          ...(station.nbrtLineIds ?? []),
        ]
          .map(String)
          .filter(id => id !== String(line_foc.id))
          .filter(id => {
            const ex = routeLineExtremes.get(id);
            return ex && (idx === ex.firstIdx || idx === ex.lastIdx);
          })
          .filter(id => {
            const line =
              main_corridors.find(l => String(l.id) === id) ||
              cbrt_lines.find(l => String(l.id) === id) ||
              nbrt_lines.find(l => String(l.id) === id);

            return !(
              line?.lineType === "BRTCorridor" &&
              line_foc.lineType === "BRTCorridor" &&
              line.mainBRTC === line_foc.mainBRTC
            );
          })
          .map(id =>
            main_corridors.find(l => String(l.id) === id) ||
            cbrt_lines.find(l => String(l.id) === id) ||
            nbrt_lines.find(l => String(l.id) === id)
          )
          .filter(Boolean)
          .filter((line, _, arr) => {
            if (line.lineType !== "BRTCorridor") return true;

            return (
              arr.findIndex(
                l =>
                  l.lineType === "BRTCorridor" &&
                  l.mainBRTC === line.mainBRTC
              ) === arr.indexOf(line)
            );
          })
          .sort((a, b) => {
            const typeDiff =
              linePriority[a!.lineType as keyof typeof linePriority] -
              linePriority[b!.lineType as keyof typeof linePriority];
            if (typeDiff !== 0) return typeDiff;

            const brtcDiff = Number(a!.mainBRTC) - Number(b!.mainBRTC);
            if (brtcDiff !== 0) return brtcDiff;

            // final tie-breaker
            return Number(a!.id) - Number(b!.id);
          })

        return (
            <div key={station.id} className="flex items-end shrink-0">
            <StationDot
              name={station.name}
              accessible={station.accessible}
              reached={reached}
              willReach={willReach}
              side={doorsSide}
              oneWay={!(stationIdsDir1.includes(station.id) && stationIdsDir2.includes(station.id))}
              focused={station.id === thisId}
              roundels={roundelsToShow}
            />
                {idx !== stationOrder.length - 1 && (
                <div className={!(stationIdsDir1.includes(station.id) && stationIdsDir2.includes(station.id))? "pb-0.5": "pb-2"}>
                    <LineSegment
                    color={lineColor}
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
                      (
                        idx >= Math.min(thisIndex - 1, destIndexInOrder) &&
                        idx < Math.max(thisIndex + 1, destIndexInOrder)
                      )
                    }
                    width={segmentWidthNumber}
                    side={doorsSide}
                    focused={doorsSide == "left" ? idx == Math.min(thisIndex-1, destIndexInOrder) : idx == Math.max(thisIndex+1, destIndexInOrder) - 1}
                    />
                </div>
                )}
            </div>
            );
      })}
    </div>
  );
}
