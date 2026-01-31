"use client";
import React from "react";

type Props = {
  color: string;
  fullOpacity: boolean;
  width?: number;
  side?: "left" | "right";
  focused?: boolean;
};

export default function FarLineSegment({
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
  className="h-2 w-full rounded-full overflow-hidden"
  style={{ opacity: fullOpacity ? 1 : 0.3 }}
>
  <div
    className="h-full w-full"
    style={{
      backgroundImage: `repeating-linear-gradient(
        to right,
        ${color} 0px,
        ${color} 12px,
        transparent 12px,
        transparent 20px
      )`,
      WebkitMaskImage: `radial-gradient(circle at left, black 99%, transparent 100%),
                        radial-gradient(circle at right, black 99%, transparent 100%)`,
      WebkitMaskComposite: "destination-in",
      maskImage: `radial-gradient(circle at left, black 99%, transparent 100%),
                  radial-gradient(circle at right, black 99%, transparent 100%)`,
      maskComposite: "intersect",
    }}
  />
</div>
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