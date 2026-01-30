"use client";
import React from "react";

type Props = {
  color: string;
  fullOpacity: boolean;
  width?: number;
  side?: "left" | "right";
  focused?: boolean;
};

export default function LineSegment({
  color,
  fullOpacity,
  width,
  side,
  focused,
}: Props) {
  return (
    <div className="relative flex items-center" style={{ width }}>
      {/* Line */}
      <div
        className="h-2 w-full rounded"
        style={{
          backgroundColor: color,
          opacity: fullOpacity ? 1 : 0.3,
        }}
      />

        {focused && side && (
          <span
            className="absolute left-1/2 top-1/2 -translate-x-1/2 font-bold
                      text-white text-md blink pointer-events-none z-10"
          >
            {side === "left" ? "▶" : "◀"}
          </span>
        )}
    </div>
  );
}