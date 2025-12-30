"use client";
import { useMemo, useState, useEffect } from "react";
import { stations, main_corridors, cbrt_lines } from "@/lib/sample";
import NextPage from "./pages/nextPage";
import ArrPage from "./pages/arrPage";

export default function Home() {
  const thisStn = stations.find(s => s.name === "Cempaka Mas");
  const destStn = stations.find(s => s.name === "Taman Kota");
  const line_foc = cbrt_lines.find(c => c.id === "2A");
  const doorOpen = "right";

  if (!thisStn || !destStn || !line_foc) return <div>Loading...</div>;

  const { stationIdsDir1, stationIdsDir2 } = line_foc;

  const thisId = thisStn.id;
  const destId = destStn.id;

  const inDir1This = stationIdsDir1.includes(thisId);
  const inDir1Dest = stationIdsDir1.includes(destId);
  const inDir2This = stationIdsDir2.includes(thisId);
  const inDir2Dest = stationIdsDir2.includes(destId);

  if ((!inDir1This && !inDir2This) || (!inDir1Dest && !inDir2Dest)) {
    return <div className="p-6 text-center">Not available</div>;
  }

  const chosenDir = useMemo(() => {
    if (inDir1This && inDir1Dest && !(inDir2This && inDir2Dest)) return stationIdsDir1;
    if (inDir2This && inDir2Dest && !(inDir1This && inDir1Dest)) return stationIdsDir2;

    const idx1This = stationIdsDir1.indexOf(thisId);
    const idx1Dest = stationIdsDir1.indexOf(destId);
    const idx2This = stationIdsDir2.indexOf(thisId);
    const idx2Dest = stationIdsDir2.indexOf(destId);

    if (idx1This !== -1 && idx1Dest !== -1 && idx1This < idx1Dest) return stationIdsDir1;
    return stationIdsDir2;
  }, [inDir1This, inDir1Dest, inDir2This, inDir2Dest, stationIdsDir1, stationIdsDir2, thisId, destId]);

  const startIndex = chosenDir.indexOf(thisId);
  const destIndex = chosenDir.indexOf(destId);

  if (startIndex === -1 || destIndex === -1) return <div className="p-6 text-center">Not available</div>;

  const [pointer, setPointer] = useState(startIndex);
  const [subPage, setSubPage] = useState<"next" | "arr">("next");

  useEffect(() => {
    setPointer(startIndex);
    setSubPage("next"); // always start with NextPage on reload
  }, [startIndex]);

  const currentStation = stations.find(s => s.id === chosenDir[pointer]);
  if (!currentStation) return <div className="p-6 text-center">Not available</div>;

  /** HANDLERS */
  const handleNext = () => {
    if (subPage === "next") {
      // move to ArrPage of current station
      setSubPage("arr");
    } else {
      // move to NextPage of next station
      if (pointer < destIndex) {
        setPointer(p => p + 1);
        setSubPage("next");
      }
    }
  };

  const handlePrev = () => {
    // always go to NextPage of previous station
    if (pointer > startIndex) {
      setPointer(p => p - 1);
      setSubPage("next");
    }
  };

  /** RENDER CURRENT PAGE */
  const PageComponent = subPage === "next" ? NextPage : ArrPage;

  return (
    <div className="flex min-h-screen flex-col">
      {/* TOP PANEL */}
      <div className="flex flex-1 items-center justify-center bg-zinc-50 dark:bg-black">
        <PageComponent
          doorsSide="right"
          isThisSide={doorOpen === "right"}
          thisStn={currentStation}
          destStn={destStn}
          line_foc={line_foc}
        />
      </div>

      {/* BOTTOM PANEL */}
      <div className="flex flex-1 items-center justify-center bg-zinc-50 dark:bg-black">
        <PageComponent
          doorsSide="left"
          isThisSide={doorOpen === "left"}
          thisStn={currentStation}
          destStn={destStn}
          line_foc={line_foc}
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

