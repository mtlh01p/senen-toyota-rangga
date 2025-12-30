"use client";

type Props = {
  isThisSide: boolean;
  display_side: string;
};

export default function DoorsOpen({ isThisSide, display_side }: Props) {

  const doorEmoji = isThisSide ? "▼" : "❌";

  const doorText =
    display_side === "left"
      ? `Doors open on ${isThisSide ? "this" : "opposite"} side`
      : `Doors open on ${isThisSide ? "this" : "opposite"} side`;

  return (
    <div className="flex items-center gap-4 p-4 rounded-lg bg-black text-white shadow-sm mt-3">
    { (display_side === "left") && (
      <div className="flex items-center gap-1 text-lg text-white">
        <span>{doorEmoji}</span>
        <span>{doorText}</span>
      </div>
    )
    }
    { (display_side === "right") && (
      <div className="flex items-center gap-1 text-lg text-white">
        <span>{doorText}</span>
        <span>{doorEmoji}</span>
      </div>
    )
    }
    </div>
  );
}
