"use client";
import { useMemo, useState, useEffect, useRef, use } from "react";
import { stations, main_corridors, cbrt_lines } from "@/lib/sample";
import { notFound } from "next/navigation";
import NextPage from "@/app/subpages/nextPage";
import ArrPage from "@/app/subpages/arrPage";
import MapPage from "@/app/subpages/mapPage";

type Props = {
  searchParams: Promise<{
    startStn?: string;
    endStn?: string;
    curLine?: string;
    dirSel?: number;
  }>;
};

export default function Display({searchParams}: Props) {
  if(!searchParams) return notFound();

  const { startStn, endStn, curLine, dirSel } = use(searchParams);
  if (!startStn || !endStn || !curLine || dirSel === undefined) return notFound();

  const thisStn = stations.find(s => s.id === startStn);
  const destStn = stations.find(s => s.id === endStn);
  const line_foc = [...main_corridors, ...cbrt_lines].find(l => l.id.toString() === curLine);
  if (!thisStn || !destStn || !line_foc) return notFound();

  const { stationIdsDir1, stationIdsDir2 } = line_foc;
  const thisId = thisStn.id;
  const destId = destStn.id;

  const inDir1This = stationIdsDir1.includes(thisId);
  const inDir1Dest = stationIdsDir1.includes(destId);
  const inDir2This = stationIdsDir2.includes(thisId);
  const inDir2Dest = stationIdsDir2.includes(destId);

  if ((!inDir1This && !inDir2This) || (!inDir1Dest && !inDir2Dest)) {
    return notFound
  }

  const chosenDir = useMemo(() => {
    if (inDir1This && inDir1Dest && !(inDir2This && inDir2Dest)) return stationIdsDir1;
    if (inDir2This && inDir2Dest && !(inDir1This && inDir1Dest)) return stationIdsDir2;

    const idx1This = stationIdsDir1.indexOf(thisId);
    const idx1Dest = stationIdsDir1.indexOf(destId);

    if (idx1This !== -1 && idx1Dest !== -1 && idx1This < idx1Dest) return stationIdsDir1;
    return stationIdsDir2;
  }, [inDir1This, inDir1Dest, inDir2This, inDir2Dest, stationIdsDir1, stationIdsDir2, thisId, destId]);

  const startIndex = chosenDir.indexOf(thisId);
  const destIndex = chosenDir.indexOf(destId);

  if (startIndex === -1 || destIndex === -1) return notFound

  const [pointer, setPointer] = useState(startIndex);
  const [subPage, setSubPage] = useState<"next" | "map" | "arr">("next");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  /** Auto-cycle between NextPage and MapPage */
  useEffect(() => {
    if (subPage === "arr") return; // no auto-cycle for ArrPage

    timerRef.current = setTimeout(() => {
      setSubPage(prev => (prev === "next" ? "map" : "next"));
    }, 10000); // 10s cycle

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [subPage, pointer]);

  const currentStation = stations.find(s => s.id === chosenDir[pointer]);
  if (!currentStation) return notFound

  /** HANDLERS */
  const handleNext = () => {
    if (subPage === "next" || subPage === "map") {
      // go to ArrPage manually
      setSubPage("arr");
      if (timerRef.current) clearTimeout(timerRef.current);
    } else {
      // move to NextPage of next station
      if (pointer < destIndex) {
        setPointer(p => p + 1);
        setSubPage("next");
      }
    }
  };

  const handlePrev = () => {
    if (pointer > startIndex) {
      setPointer(p => p - 1);
      setSubPage("next");
    }
  };

  /** Render correct component */
  const PageComponent =
    subPage === "next" ? NextPage : subPage === "map" ? MapPage : ArrPage;

  return (
    <div className="flex min-h-screen flex-col">
      {/* TOP PANEL */}
      <div className="flex flex-1 items-center justify-center bg-zinc-50 dark:bg-black">
        <PageComponent
          doorsSide="right"
          thisStn={currentStation}
          destStn={destStn}
          line_foc={line_foc}
          dirSel={dirSel}
        />
      </div>

      {/* BOTTOM PANEL */}
      <div className="flex flex-1 items-center justify-center bg-zinc-50 dark:bg-black">
        <PageComponent
          doorsSide="left"
          thisStn={currentStation}
          destStn={destStn}
          line_foc={line_foc}
          dirSel={dirSel}
        />
      </div>

      {/* CONTROLS */}
      <div className="flex items-center justify-between px-6 py-4 bg-zinc-200 dark:bg-zinc-900">
        <button
          className="rounded px-4 py-2 bg-zinc-700 text-white disabled:opacity-40"
          disabled={pointer <= startIndex}
          onClick={handlePrev}
        >
          Prev
        </button>

        <button
          className="rounded px-4 py-2 bg-blue-600 text-white disabled:opacity-40"
          disabled={pointer >= destIndex && subPage === "arr"}
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </div>
  );
}

