"use client";
import React from "react";
import { Station, BRTCorridor, CBRTLine } from "@/types/index";
import StnRoundel from "@/app/components/StnRoundel";
import CorRoundel from "@/app/components/CorRoundel";
import { main_corridors, cbrt_lines } from "@/lib/sample";

type Props = {
  station: Station;
  line_foc: BRTCorridor | CBRTLine;
};

export default function DestStn({ station, line_foc }: Props) {
  const isFocusedBrt =
    typeof line_foc.id === "number" &&
    station.brtCorridorIds.includes(line_foc.id);

    const sortedBrtIds = [...station.brtCorridorIds].sort((a, b) => a - b);

    const firstValid = sortedBrtIds.find(id =>
      station.codes.some(c => c.corridorId === id) &&
      main_corridors.some(c => c.id === id)
    );

    const firstBrtCode = firstValid
      ? station.codes.find(c => c.corridorId === firstValid)
      : null;

    const firstCorridor = firstValid
      ? main_corridors.find(c => c.id === firstValid)
      : null;

  const focusedCode = isFocusedBrt
    ? station.codes.find(c => c.corridorId === line_foc.id)
    : null;

  const focusedCorridor =
    typeof line_foc.id === "number"
      ? main_corridors.find(c => c.id === line_foc.id)
      : null;

  return (
    <div className="flex items-center gap-4 p-4 rounded-lg bg-black text-white shadow-sm">
      
      <div className="flex items-center gap-1 text-lg font-semibold">
        {isFocusedBrt && focusedCode && focusedCorridor ? (
          <>
            <span>to</span>
            <StnRoundel 
              scale={0.65}
              stationCode={focusedCode}
              brtCorridor={focusedCorridor}
            />
            <span>{station.name}</span>
          </>
        ) : (
          <>
            <CorRoundel brtCorridor={line_foc} scale={1} />
            <span>to</span>
            {firstBrtCode && firstCorridor && (
              <StnRoundel
                scale={0.65}
                stationCode={firstBrtCode}
                brtCorridor={firstCorridor}
              />
            )}
            <span>{station.name}</span>
          </>
        )}
      </div>

    </div>
  );
}
