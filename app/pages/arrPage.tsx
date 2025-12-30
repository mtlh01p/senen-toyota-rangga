"use client";
import MainStnFrame from "@/app/components/MainStnFrame";
import DestStn from "../components/DestStn";
import DoorsOpen from "../components/DoorsOpen";
import { BRTCorridor, CBRTLine, Station } from "@/types";

type Props = {
  doorsSide: "left" | "right";
  isThisSide: boolean;
  thisStn: Station;
  destStn: Station;
  line_foc: BRTCorridor | CBRTLine;
};

export default function ArrPage({ doorsSide, isThisSide, thisStn, destStn, line_foc }: Props) {

  return (
    <div className="flex min-h-17.5 w-full items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      {thisStn && line_foc && destStn && (
        <div className="flex justify-center w-full">
          <div className="w-full max-w-4xl bg-black text-white rounded-lg overflow-hidden">
            
            {/* TOP AREA */}
            <div className="h-17.5 p-4 flex flex-col justify-start">
              <div
          className={`flex items-start justify-between`}
              >
          {doorsSide === "left" ? (
            <>
              <DoorsOpen
                isThisSide={isThisSide}
                display_side="left"
              />
              <DestStn
                station={destStn}
                line_foc={line_foc}
              />
            </>
          ) : (
            <>
              <DestStn
                station={destStn}
                line_foc={line_foc}
              />
              <DoorsOpen
                isThisSide={isThisSide}
                display_side="right"
              />
            </>
          )}
              </div>
            </div>

            {/* BOTTOM AREA */}
              <div className="grid grid-cols-1 items-center">

                {/* Centered MainStnFrame */}
                <div className="flex justify-center">
                  <MainStnFrame
                    station={thisStn}
                    line_foc={line_foc}
                  />
                </div>

              </div>
          </div>
        </div>
      )}
    </div>
  );
}

