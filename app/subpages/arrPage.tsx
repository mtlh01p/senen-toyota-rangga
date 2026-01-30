"use client";
import MainStnFrame from "@/app/components/MainStnFrame";
import DestStn from "@/app/components/DestStn";
import DoorsOpen from "@/app/components/DoorsOpen";
import { BRTCorridor, CBRTLine, Station } from "@/types";
import VisibilityChecker from "@/app/components/VisibilityChecker";
import { notFound } from "next/navigation";

type Props = {
  doorsSide: "left" | "right";
  thisStn: Station;
  destStn: Station;
  line_foc: BRTCorridor | CBRTLine;
};

export default function ArrPage({ doorsSide, thisStn, destStn, line_foc }: Props) {
  if (!thisStn || !destStn || !line_foc) return notFound();
  if (!VisibilityChecker({ timeType: line_foc.time })) return notFound();

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
                isThisSide={thisStn.doorside}
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
                isThisSide={thisStn.doorside}
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
                    doorfocus={doorsSide}
                  />
                </div>

              </div>
          </div>
        </div>
      )}
    </div>
  );
}

