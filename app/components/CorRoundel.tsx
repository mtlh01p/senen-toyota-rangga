import React from "react";
import { BRTCorridor, CBRTLine } from "@/types/index";

type Props = {
  brtCorridor: BRTCorridor | CBRTLine;
  scale?: number;
};

export default function CorRoundel({ brtCorridor, scale }: Props) {
  return (
    <div
      className="w-8 h-8 rounded-full font-main flex flex-col items-center justify-center text-white font-bold font-pt"
      style={{ backgroundColor: brtCorridor.color, transform: `scale(${scale})` }}
    >
      {typeof brtCorridor.id === "number" ? (
        <span className="text-lg leading-none -mb-0.1">
          {brtCorridor.id}
          </span>
          ) : (<span className="text-sm leading-none -mb-0.1">
            {brtCorridor.id}
          </span>
        )}
    </div>
  );
}

