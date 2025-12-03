// src/components/ChristmasGarland.jsx
import React from "react";

const bulbs = [
  { colorClass: "bg-red-500", glowClass: "shadow-[0_0_15px_rgba(239,68,68,0.9)]" },
  { colorClass: "bg-green-500", glowClass: "shadow-[0_0_15px_rgba(34,197,94,0.9)]" },
  { colorClass: "bg-yellow-400", glowClass: "shadow-[0_0_15px_rgba(250,204,21,0.9)]" },
  { colorClass: "bg-blue-500", glowClass: "shadow-[0_0_15px_rgba(59,130,246,0.9)]" },
  { colorClass: "bg-pink-500", glowClass: "shadow-[0_0_15px_rgba(236,72,153,0.9)]" },
  { colorClass: "bg-emerald-400", glowClass: "shadow-[0_0_15px_rgba(52,211,153,0.9)]" },
  { colorClass: "bg-orange-500", glowClass: "shadow-[0_0_15px_rgba(249,115,22,0.9)]" },
  { colorClass: "bg-purple-500", glowClass: "shadow-[0_0_15px_rgba(168,85,247,0.9)]" },
  { colorClass: "bg-cyan-400", glowClass: "shadow-[0_0_15px_rgba(34,211,238,0.9)]" },

];

export default function ChristmasGarland() {
  return (
    <div className="fixed top-0 left-0 right-0 z-100 pointer-events-none">
      <div className="relative max-w-full mx-auto mt-2">
        {/* String */}
        <div className="h-2 w-full rounded-full bg-green-800/80" />

        {/* Bulbs */}
        <div className="absolute left-0 top-1 w-full flex justify-between px-4 sm:px-8">
          {bulbs.map((b, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-1 garland-swing"
              style={{ animationDelay: `${index * 0.20}s` }}
            >
              {/* Little wire */}
              <div className="w-px h-4 bg-green-900" />

              {/* Socket */}
              <div className="w-4 h-2 rounded-t-md bg-slate-800" />

              {/* Bulb */}
              <div
                className={`w-5 h-7 rounded-full ${b.colorClass} ${b.glowClass} garland-glow`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
