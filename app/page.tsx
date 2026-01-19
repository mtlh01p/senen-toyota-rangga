"use client";
import { useMemo, useState } from "react";
import { stations, main_corridors, cbrt_lines } from "@/lib/sample";
import CorRoundel from "@/app/components/CorRoundel";
import { BRTCorridor, CBRTLine } from "@/types";
import VisibilityChecker from "@/app/components/VisibilityChecker";

type Line = BRTCorridor | CBRTLine;

export default function Home() {
  const allLines: Line[] = useMemo(
    () => [...main_corridors, ...cbrt_lines],
    []
  );

  const [focusedLine, setFocusedLine] = useState<Line | null>(null);
  const [direction, setDirection] = useState<1 | 2 | null>(null);
  const [firstStationOptions, setFirstStationOptions] = useState<Line["stationIdsDir1"] | Line["stationIdsDir2"] | null>(null);
  const [lastStationOptions, setLastStationOptions] = useState<Line["stationIdsDir1"] | Line["stationIdsDir2"] | null>(null);
  const [firstStation, setFirstStation] = useState<number | null>(null);
  const [lastStation, setLastStation] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center">
      <div className="w-full max-w-5xl mx-auto px-8 md:px-20 lg:px-32 py-12">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-8 flex flex-col gap-8 font-sans">
        {/* Line selection */}
        <div className="flex gap-4 flex-wrap items-center">
        <span className="font-medium text-zinc-700 dark:text-zinc-300">Lines:</span>
        {allLines.map((line) => {
          // Check if this specific line is the one selected
          const isSelected = focusedLine?.id === line.id;
          const isVisible = VisibilityChecker({ timeType: line.time });

          return (
            <button
              key={line.id}
              disabled={!isVisible}
              onClick={() => {
                setFocusedLine(line);
                setDirection(null);
                setFirstStation(null);
                setLastStation(null);
                setFirstStationOptions(null);
                setLastStationOptions(null);
              }}
              style={{ cursor: isVisible ? "pointer" : "not-allowed", opacity: isVisible ? 1 : 0.4 }}
              className={`p-1 rounded-full transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isSelected 
                  ? "ring-4 ring-blue-500 ring-offset-2 dark:ring-offset-zinc-900" 
                  : "ring-0"
              }`}
              aria-label={`Select ${line.id}`}
            >
              <CorRoundel brtCorridor={line} />
            </button>
          );
        })}
        </div>

        {/* Direction */}
        {focusedLine && (
        <div className="flex gap-4 items-center">
          <span className="text-zinc-700 dark:text-zinc-300">Direction:</span>
          <select
          value={direction ?? ""}
          onChange={(e) => {
            setDirection(Number(e.target.value) as 1 | 2);
            setFirstStationOptions(
            Number(e.target.value) === 1
              ? focusedLine.stationIdsDir1
              : focusedLine.stationIdsDir2
            );
            setLastStationOptions(
            Number(e.target.value) === 1
              ? focusedLine.stationIdsDir1
              : focusedLine.stationIdsDir2
            );
            setFirstStation(null);
            setLastStation(null);
          }}
          className="px-3 py-2 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
          <option value="" disabled>
            Select direction
          </option>
          <option value={1}>Direction 1</option>
          <option value={2}>Direction 2</option>
          </select>
        </div>
        )}

        {/* Stations */}
        {firstStationOptions && lastStationOptions && (
        <div className="flex gap-4 items-center flex-wrap">
          <span className="text-zinc-700 dark:text-zinc-300">From:</span>
          <select
          value={firstStation ?? ""}
          onChange={(e) => setFirstStation(Number(e.target.value))}
          className="px-3 py-2 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
          <option value="" disabled>
            Select first station
          </option>
          {firstStationOptions.map((stnId, idx) => (
            <option key={stnId} value={idx}>
            {stations.find((s) => s.id === stnId)?.name ?? stnId}
            </option>
          ))}
          </select>

          <span className="text-zinc-700 dark:text-zinc-300">To:</span>
          <select
          value={lastStation ?? ""}
          onChange={(e) => setLastStation(Number(e.target.value))}
          className="px-3 py-2 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
          <option value="" disabled>
            Select last station
          </option>
          {lastStationOptions.map((stnId, idx) => (
            <option key={stnId} value={idx}>
            {stations.find((s) => s.id === stnId)?.name ?? stnId}
            </option>
          ))}
          </select>
        </div>
        )}

        {/* Go to /display with the props */}
        {focusedLine && direction && firstStation !== null && lastStation !== null && (
        <div className="mt-4">
          <a
          href={`/display?startStn=${
            (direction === 1 ? focusedLine.stationIdsDir1 : focusedLine.stationIdsDir2)[firstStation]
          }&endStn=${
            (direction === 1 ? focusedLine.stationIdsDir1 : focusedLine.stationIdsDir2)[lastStation]
          }&curLine=${focusedLine.id}`}
          className="inline-block px-5 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition"
          >
          Go to Display
          </a>
        </div>
        )}
      </div>
      </div>
    </div>
  );
}

