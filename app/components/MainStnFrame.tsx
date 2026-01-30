"use client";
import React from "react";
import { Station, BRTCorridor, CBRTLine, NBRTLine, StationCode } from "@/types/index";
import StnRoundel from "@/app/components/StnRoundel";
import CorRoundel from "@/app/components/CorRoundel";
import { main_corridors, cbrt_lines, nbrt_lines } from "@/lib/sample";
import VisibilityChecker from "@/app/components/VisibilityChecker";

type Props = {
  station: Station;
  line_foc: BRTCorridor | CBRTLine;
  doorfocus: string;
};

export default function MainStnFrame({ station, line_foc, doorfocus }: Props) {
  // 1️⃣ Ordered StationCodes for StnRoundel
  const orderedCodes = React.useMemo(() => {
    // Sort by brtCorridorIds first, then any remaining codes not in brtCorridorIds
    const sortedIds = [...station.brtCorridorIds].sort((a, b) => a - b);

    // Add any codes that are not in brtCorridorIds
    const remainingCodes = station.codes
      .map(c => c.corridorId)
      .filter(id => !sortedIds.includes(id));
    const finalIds = [...sortedIds, ...remainingCodes];

    // Move focused line to front if exists
      const focusIndex = finalIds.indexOf(line_foc.mainBRTC);
      if (focusIndex !== -1) {
        finalIds.splice(focusIndex, 1);
        finalIds.unshift(line_foc.mainBRTC);
      }

    return finalIds
      .map(id => station.codes.find(c => c.corridorId === id))
      .filter(Boolean) as StationCode[];
  }, [station.codes, station.brtCorridorIds, line_foc]);

  // 2️⃣ Ordered CorRoundels
const corRoundels = React.useMemo(() => {
  // 1. Map and tag with weights (Tier 1)
  const brt = (station.brtCorridorIds || [])
    .map(id => main_corridors.find(c => c.id === id))
    .filter(Boolean)
    .map(item => ({ ...item, _weight: 1 })); // Top Priority

  const cbrt = (station.cbrtLineIds || [])
    .map(id => cbrt_lines.find(c => c.id === id))
    .filter(Boolean)
    .map(item => ({ ...item, _weight: 2 })); // Medium Priority

  const nbrt = (station.nbrtLineIds || [])
    .map(id => nbrt_lines.find(c => c.id === id))
    .filter(Boolean)
    .map(item => ({ ...item, _weight: 3 })); // Low Priority

  // 2. Combine
  const ordered = [...brt, ...cbrt, ...nbrt];

  // 3. Perform the Tiered Sort
  ordered.sort((a, b) => {
    // TIER 1: Type Weight (BRT > CBRT > NBRT)
    if (a._weight !== b._weight) {
      return a._weight - b._weight;
    }

    // TIER 2: mainBRTC (numerical)
    const numA = (a as any).mainBRTC || 0;
    const numB = (b as any).mainBRTC || 0;
    if (numA !== numB) {
      return numA - numB;
    }

    // TIER 3: ID (lexicographical/string)
    return String(a.id).localeCompare(String(b.id), undefined, { numeric: true });
  });

  // 4. Move focused line to front (overrides everything else)
  if (line_foc) {
    const index = ordered.findIndex(c => c.id === line_foc.id);
    if (index !== -1) {
      const [foc] = ordered.splice(index, 1);
      ordered.unshift(foc);
    }
  }

  return ordered.slice(0, 14);
}, [station.brtCorridorIds, station.cbrtLineIds, station.nbrtLineIds, line_foc]);

function parseStationId(id: string) {
  const match = id.match(/^(\d+-\d+)([A-Z])?$/);
  return {
    base: match?.[1] ?? id,
    suffix: match?.[2] ?? null, // "A", "B", or null
  };
}

const stationOneWayThisLine = React.useMemo(() => {
  const { base, suffix } = parseStationId(station.id);

  const dir1Matches = line_foc.stationIdsDir1
    .map(parseStationId)
    .filter(s => s.base === base);

  const dir2Matches = line_foc.stationIdsDir2
    .map(parseStationId)
    .filter(s => s.base === base);

  // Not present in either direction (shouldn't happen, but safe)
  if (dir1Matches.length === 0 && dir2Matches.length === 0) {
    return false;
  }

  // Present in BOTH directions
  if (dir1Matches.length > 0 && dir2Matches.length > 0) {
    const dir1Suffixes = new Set(dir1Matches.map(s => s.suffix));
    const dir2Suffixes = new Set(dir2Matches.map(s => s.suffix));

    // Case 1: Same exact platform appears in both → NOT one-way
    for (const s of dir1Suffixes) {
      if (dir2Suffixes.has(s)) return false;
    }

    // Case 2: A vs B split across directions → NOT one-way
    if (
      (dir1Suffixes.has("A") && dir2Suffixes.has("B")) ||
      (dir1Suffixes.has("B") && dir2Suffixes.has("A"))
    ) {
      return false;
    }

    // Otherwise it's some weird mismatch → treat as not one-way
    return false;
  }

  // Present in ONLY ONE direction → ONE-WAY
  return true;
}, [station.id, line_foc]);


const firstRoundelIsFocus = React.useMemo(() => {
  if (!line_foc || corRoundels.length === 0) return false;
  return corRoundels[0].id === line_foc.id;
}, [corRoundels, line_foc]);

  return (
    <div className="flex items-center gap-4 p-4 rounded-lg bg-black font-main text-white shadow-sm">
      {/* StationCode Roundels */}
      <div className="flex gap-3">
        {orderedCodes.map(code => {
          // Try to find BRT corridor first, fallback to main_corridors if missing
          const corridor =
            main_corridors.find(c => c.id === code.corridorId) || null;
          return (
            <StnRoundel
              key={code.corridorId}
              stationCode={code}
              brtCorridor={corridor!}
            />
          );
        })}
      </div>

      <div className="flex flex-col">
        <span className="text-2xl font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
          {station.name} {station.accessible? "♿": ""} {station.oneWay? (doorfocus === "left" ? "→" : "←") : "↔"} {station.payTransfer? "💵" : ""} 
        </span>
        <div className="flex gap-2 mt-1 items-center">
          {corRoundels.map((c, index) => {
            const isFirst = index === 0;
            const isFocusFirst = isFirst && firstRoundelIsFocus;
            const showArrow = isFocusFirst && stationOneWayThisLine;

            const roundel = (
              <CorRoundel
                brtCorridor={c}
                visible={VisibilityChecker({ timeType: c.time })}
              />
            );

            // Not the focused first roundel → render normally
            if (!isFocusFirst) {
              return <React.Fragment key={c.id}>{roundel}</React.Fragment>;
            }

            // Focused first roundel WITHOUT arrow → circular wrap
            if (!showArrow) {
              return (
                <div
                  key={c.id}
                  className="flex items-center justify-center p-1 rounded-full border border-white/80 bg-white/5 backdrop-blur-sm"
                >
                  {roundel}
                </div>
              );
            }

            // Focused first roundel WITH arrow → obround pill
            return (
              <div
                key={c.id}
                className="flex items-center gap-2 px-1 py-1 rounded-full border border-white/80 bg-white/5 backdrop-blur-sm"
              >
                {doorfocus === "right" && <span className="text-lg">◀</span>}
                {roundel}
                {doorfocus === "left" && <span className="text-lg">▶</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
