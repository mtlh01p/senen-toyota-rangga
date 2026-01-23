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
  const linePriority = {
    BRTCorridor: 0,
    CBRTLine: 1,
    NBRTLine: 2,
  } as const;

  const orderedCodes = React.useMemo(() => {
    const sortedIds = [...station.brtCorridorIds].sort((a, b) => a - b);

    const remainingCodes = station.codes
      .map(c => c.corridorId)
      .filter(id => !sortedIds.includes(id));

    const finalIds = [...sortedIds, ...remainingCodes];

    if (line_foc.lineType === "BRTCorridor") {
      const focusIndex = finalIds.indexOf(line_foc.mainBRTC);
      if (focusIndex !== -1) {
        finalIds.splice(focusIndex, 1);
        finalIds.unshift(line_foc.mainBRTC);
      }
    } else if (line_foc.lineType === "CBRTLine") {
      const cbFocusId = line_foc.mainBRTC;
      const focusIndex = finalIds.indexOf(cbFocusId);
      if (focusIndex !== -1) {
        finalIds.splice(focusIndex, 1);
        finalIds.unshift(cbFocusId);
      }
    }

    return finalIds
      .map(id => station.codes.find(c => c.corridorId === id))
      .filter(Boolean) as StationCode[];
  }, [station.codes, station.brtCorridorIds, line_foc]);

const corRoundels = React.useMemo(() => {
  const allLines: (BRTCorridor | CBRTLine | NBRTLine)[] = [
    ...station.brtCorridorIds
      .map(id => main_corridors.find(c => c.id === id))
      .filter((c): c is BRTCorridor => !!c),
    ...station.cbrtLineIds
      .map(id => cbrt_lines.find(c => c.id === id))
      .filter((c): c is CBRTLine => !!c),
    ...station.nbrtLineIds
      .map(id => nbrt_lines.find(c => c.id === id))
      .filter((c): c is NBRTLine => !!c),
  ];

  // 1️⃣ Deduplicate BRTCorridors by mainBRTC, but keep focused line if it exists
  const seenBRTC = new Map<number, BRTCorridor>();
  allLines.forEach(line => {
    if (line.lineType === "BRTCorridor") {
      const existing = seenBRTC.get(line.mainBRTC);
      if (!existing) {
        seenBRTC.set(line.mainBRTC, line);
      } else if (line.id === line_foc.id) {
        // Focused line replaces existing
        seenBRTC.set(line.mainBRTC, line);
      }
    }
  });

  const dedupedLines: (BRTCorridor | CBRTLine | NBRTLine)[] = [
    ...seenBRTC.values(),
    ...allLines.filter(l => l.lineType !== "BRTCorridor"),
  ];

  // 2️⃣ Sort: BRT → CBRT → NBRT, then mainBRTC, then id
  dedupedLines.sort((a, b) => {
    const typeDiff = linePriority[a.lineType] - linePriority[b.lineType];
    if (typeDiff !== 0) return typeDiff;

    const aMain = Number(a.mainBRTC ?? 0);
    const bMain = Number(b.mainBRTC ?? 0);
    if (aMain !== bMain) return aMain - bMain;

    return Number(a.id) - Number(b.id);
  });

  // 3️⃣ Move focused line to front
  const focusIndex = dedupedLines.findIndex(l => l.id === line_foc.id);
  if (focusIndex !== -1) {
    const [focusLine] = dedupedLines.splice(focusIndex, 1);
    dedupedLines.unshift(focusLine);
  }

  return dedupedLines.slice(0, 15);
}, [
  station.brtCorridorIds,
  station.cbrtLineIds,
  station.nbrtLineIds,
  line_foc,
]);



  return (
    <div className="flex items-center gap-4 p-4 rounded-lg bg-black font-main text-white shadow-sm">
      <div className="flex gap-3">
        {orderedCodes.map(code => {
          const corridor =
            main_corridors.find(c => c.mainBRTC === code.corridorId) || null;

          return corridor ? (
            <StnRoundel
              key={code.corridorId}
              stationCode={code}
              brtCorridor={corridor}
            />
          ) : null;
        })}
      </div>

      <div className="flex flex-col">
        <span className="text-2xl font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
          {station.name}
          {station.accessible ? " ♿" : ""}
        </span>
        <div className="flex gap-2 mt-1">
          {corRoundels.map(c => (
            <CorRoundel
              key={c.id}
              brtCorridor={c}
              visible={VisibilityChecker({ timeType: c.time })}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
