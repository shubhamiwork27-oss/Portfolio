import React, { useMemo, memo } from "react";
import GlassWidgetCard from "./GlassWidgetCard";
import { PROFILE_CONFIG } from "../config";
import { GitCommit } from "lucide-react";

// Deterministic Pseudo-Random Generator
function getDeterministicGrid(rows = 7, cols = 20) {
  const total = rows * cols;
  const grid = [];
  for (let i = 0; i < total; i++) {
    if (i === total - 1) {
      grid.push(4); // Today's blue cell (#0A84FF)
      continue;
    }
    const val = (Math.sin(i * 12.9898 + 78.233) * 43758.5453) % 1;
    const absVal = Math.abs(val);
    if (absVal > 0.88) grid.push(3);
    else if (absVal > 0.65) grid.push(2);
    else if (absVal > 0.40) grid.push(1);
    else grid.push(0);
  }
  return grid;
}

function GithubWidget() {
  const grid = useMemo(() => getDeterministicGrid(7, 20), []);

  const getCellClass = (level) => {
    switch (level) {
      case 4:
        return "bg-[#0A84FF] shadow-[0_0_5px_#0A84FF]";
      case 3:
        return "bg-zinc-200";
      case 2:
        return "bg-zinc-400";
      case 1:
        return "bg-zinc-600/80";
      default:
        return "bg-white/[0.06]";
    }
  };

  return (
    <GlassWidgetCard className="p-3 sm:p-3.5 flex flex-col justify-between h-full min-h-0">
      {/* Header: Non-wrapping GITHUB ACTIVITY + handle */}
      <div className="flex items-center justify-between gap-1 mb-1">
        <span className="text-[10px] font-semibold tracking-wider uppercase text-white/50 flex items-center gap-1 whitespace-nowrap">
          <GitCommit size={11} className="text-[#0A84FF] shrink-0" />
          GITHUB
        </span>
        <a
          href={`https://github.com/${PROFILE_CONFIG.github.username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[9px] text-white/40 hover:text-[#0A84FF] transition-colors truncate max-w-[100px]"
        >
          @{PROFILE_CONFIG.github.username}
        </a>
      </div>

      {/* 7 x 20 Heatmap Grid */}
      <div className="my-auto py-0.5">
        <div
          className="grid gap-[2px] w-full"
          style={{
            gridTemplateColumns: "repeat(20, minmax(0, 1fr))",
            gridTemplateRows: "repeat(7, minmax(0, 1fr))",
          }}
        >
          {grid.map((level, idx) => (
            <div
              key={idx}
              className={`aspect-square rounded-[2px] transition-transform duration-150 hover:scale-125 ${getCellClass(
                level
              )}`}
              title={`Day ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Footer & Legend (Non-clipped) */}
      <div className="pt-1.5 border-t border-white/[0.08] flex items-center justify-between text-[8.5px] text-white/40 shrink-0">
        <span className="truncate">542 this year</span>
        <div className="flex items-center gap-1 shrink-0">
          <span>Less</span>
          <div className="flex items-center gap-[1.5px]">
            <span className="w-1.5 h-1.5 rounded-[1px] bg-white/[0.06]" />
            <span className="w-1.5 h-1.5 rounded-[1px] bg-zinc-600/80" />
            <span className="w-1.5 h-1.5 rounded-[1px] bg-zinc-400" />
            <span className="w-1.5 h-1.5 rounded-[1px] bg-zinc-200" />
            <span className="w-1.5 h-1.5 rounded-[1px] bg-[#0A84FF]" />
          </div>
          <span>More</span>
        </div>
      </div>
    </GlassWidgetCard>
  );
}

export default memo(GithubWidget);
