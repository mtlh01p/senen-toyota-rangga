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
};

export default function MainStnFrame({ station, line_foc }: Props) {
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

  return ordered.slice(0, 15);
}, [station.brtCorridorIds, station.cbrtLineIds, station.nbrtLineIds, line_foc]);

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
          {station.name} {station.accessible? "♿": ""}
        </span>
        <div className="flex gap-2 mt-1">
          {corRoundels.map(c => (
            <CorRoundel key={c.id} brtCorridor={c} visible={VisibilityChecker({ timeType: c.time })}/>
          ))}
        </div>
      </div>
    </div>
  );
}
