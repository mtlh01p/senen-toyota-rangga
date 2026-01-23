"use client";
import React from "react";
import { Station, BRTCorridor, CBRTLine } from "@/types/index";
import StnRoundel from "@/app/components/StnRoundel";
import CorRoundel from "@/app/components/CorRoundel";
import { main_corridors } from "@/lib/sample";

type Props = {
  station: Station;
  line_foc: BRTCorridor | CBRTLine;
};

export default function DestStn({ station, line_foc }: Props) {
  const isBrtFocused = line_foc.lineType === "BRTCorridor";

  /* -------------------------------------------------
     1) Sort BRT corridor IDs by mainBRTC → then string
  --------------------------------------------------*/
  const sortedBrtIds = [...station.brtCorridorIds].sort((a, b) => {
    const aMain = main_corridors.find(c => c.id === a)?.mainBRTC ?? Infinity;
    const bMain = main_corridors.find(c => c.id === b)?.mainBRTC ?? Infinity;

    if (aMain !== bMain) return aMain - bMain;
    return String(a).localeCompare(String(b));
  });

  /* -------------------------------------------------
     2) Focused station code (special BRT logic)
  --------------------------------------------------*/

    const focusedMainBRTC =
      "mainBRTC" in line_foc ? line_foc.mainBRTC : null;

    const focusedCode =
      focusedMainBRTC != null
        ? station.codes.find(c => c.corridorId === focusedMainBRTC)
        : null;

    const focusedCorridor =
      focusedMainBRTC != null
        ? main_corridors.find(c => c.mainBRTC === focusedMainBRTC)
        : null;

  /* -------------------------------------------------
     3) Fallback: first valid BRT corridor
  --------------------------------------------------*/
  const firstValidBrtId = sortedBrtIds.find(id =>
    main_corridors.some(c => c.id === id)
  );

  const fallbackCode =
    station.codes.find(c => c.corridorId ===
      main_corridors.find(mc => mc.id === firstValidBrtId)?.mainBRTC
    ) ?? station.codes[0];

  const fallbackCorridor =
    main_corridors.find(c => c.mainBRTC === fallbackCode?.corridorId) ?? null;

  const showFocused = focusedCode && focusedCorridor;

  return (
    <div className="flex items-center gap-4 p-4 rounded-lg bg-black text-white shadow-sm">
      <div className="flex items-center gap-1 text-lg">
        {showFocused ? (
          <>
            {line_foc.lineType === "CBRTLine" && (
              <CorRoundel brtCorridor={line_foc} scale={1} />
            )}
            <span>to</span>
            <StnRoundel
              scale={0.65}
              stationCode={focusedCode}
              brtCorridor={focusedCorridor}
            />
            <span className="font-semibold">{station.name}</span>
          </>
        ) : (
          <>
            <CorRoundel brtCorridor={line_foc} scale={1} />
            <span>to</span>
            {fallbackCode && fallbackCorridor && (
              <StnRoundel
                scale={0.65}
                stationCode={fallbackCode}
                brtCorridor={fallbackCorridor}
              />
            )}
            <span className="font-semibold">{station.name}</span>
          </>
        )}
      </div>
    </div>
  );
}
