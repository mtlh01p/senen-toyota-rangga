import { useState, useEffect, useMemo } from "react";
import { stations } from "@/lib/sample";
import { Station, BRTCorridor, CBRTLine } from "@/types";
import StationLine from "@/app/components/StationLine";
import { notFound } from "next/navigation";

type Props = {
  doorsSide: "left" | "right";
  thisStn: Station;
  destStn: Station;
  line_foc: BRTCorridor | CBRTLine;
}

export default function MapPage({doorsSide, thisStn, destStn, line_foc} : Props) {
    if (!thisStn || !destStn || !line_foc) return notFound();
  
    const { stationIdsDir1, stationIdsDir2 } = line_foc;
  
    const thisId = thisStn.id;
    const destId = destStn.id;
  
    const inDir1This = stationIdsDir1.includes(thisId);
    const inDir1Dest = stationIdsDir1.includes(destId);
    const inDir2This = stationIdsDir2.includes(thisId);
    const inDir2Dest = stationIdsDir2.includes(destId);
  
    if ((!inDir1This && !inDir2This) || (!inDir1Dest && !inDir2Dest)) {
      return notFound();
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
  
    if (startIndex === -1 || destIndex === -1) return notFound();
  
    const [pointer, setPointer] = useState(startIndex);
    const [subPage, setSubPage] = useState<"next" | "arr">("next");
  
    useEffect(() => {
      setPointer(startIndex);
      setSubPage("next"); // always start with NextPage on reload
    }, [startIndex]);
  
    const currentStation = stations.find(s => s.id === chosenDir[pointer]);
    if (!currentStation) return notFound();
    return (
      <div className="flex min-h-22.5 w-full items-center justify-center font-pt">
        <StationLine
          doorsSide={doorsSide}
          thisStn={thisStn}
          destStn={destStn}
          line_foc={line_foc}
        />
      </div>
    )
}

