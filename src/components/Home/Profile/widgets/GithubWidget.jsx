import React, { useMemo, memo } from "react";
import GlassWidgetCard from "./GlassWidgetCard";
import { PROFILE_CONFIG } from "../config";
import { GitCommit } from "lucide-react";
import { useGitHubStats, getFallbackGrid } from "../useGitHubStats";

// Format date into human-readable label: "Oct 29, 2026"
function formatTooltipDate(dateStr) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function GithubWidget() {
  const { username, isLoading, cells: liveCells, totalCommits } = useGitHubStats();

  // Cells array (140 elements: 20 columns x 7 rows)
  const cells = useMemo(() => {
    if (liveCells?.length === 140) {
      return liveCells;
    }
    return getFallbackGrid(7, 20);
  }, [liveCells]);

  // Today's YYYY-MM-DD string
  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  // Total contributions display
  const totalDisplay = useMemo(() => {
    if (totalCommits != null) {
      return `${totalCommits} this year`;
    }
    return PROFILE_CONFIG.github?.totalContributions || "Activity this year";
  }, [totalCommits]);

  // Authentic GitHub contribution colors with luminous highlight
  const getCellClass = (level, isToday, isFuture) => {
    if (isFuture) {
      return "opacity-0 pointer-events-none";
    }

    let color = "bg-white/[0.06]";
    switch (level) {
      case 4:
        color = "bg-[#39d353] shadow-[0_0_6px_rgba(57,211,83,0.45)]";
        break;
      case 3:
        color = "bg-[#26a641]";
        break;
      case 2:
        color = "bg-[#006d32]";
        break;
      case 1:
        color = "bg-[#0e4429]";
        break;
      default:
        color = "bg-white/[0.06]";
    }

    if (isToday) {
      return `${color} ring-1 ring-[#0A84FF] shadow-[0_0_6px_rgba(10,132,255,0.7)]`;
    }

    return color;
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
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[9px] text-white/40 hover:text-[#0A84FF] transition-colors truncate max-w-[100px]"
          title={`View @${username} on GitHub`}
        >
          @{username}
        </a>
      </div>

      {/* 7 rows x 20 columns Heatmap Grid (flowing vertically by column like GitHub) */}
      <div className="my-auto py-0.5">
        <div
          className="grid gap-[2px] w-full"
          style={{
            gridAutoFlow: "column",
            gridTemplateRows: "repeat(7, minmax(0, 1fr))",
            gridTemplateColumns: "repeat(20, minmax(0, 1fr))",
          }}
        >
          {cells.map((cell, idx) => {
            const isToday = cell.date === todayStr;
            const title = cell.future
              ? ""
              : cell.isFallback
              ? "GitHub Activity"
              : cell.count > 0
              ? `${cell.count} contribution${cell.count === 1 ? "" : "s"} on ${formatTooltipDate(cell.date)}`
              : `No contributions on ${formatTooltipDate(cell.date)}`;

            return (
              <a
                key={cell.date || idx}
                href={
                  cell.date
                    ? `https://github.com/${username}?tab=overview&from=${cell.date}&to=${cell.date}`
                    : `https://github.com/${username}`
                }
                target="_blank"
                rel="noopener noreferrer"
                title={title}
                className={`aspect-square rounded-[2px] transition-all duration-150 hover:scale-125 hover:z-10 block ${getCellClass(
                  cell.level,
                  isToday,
                  cell.future
                )}`}
              />
            );
          })}
        </div>
      </div>

      {/* Footer & Legend (Non-clipped) */}
      <div className="pt-1.5 border-t border-white/[0.08] flex items-center justify-between text-[8.5px] text-white/40 shrink-0">
        <span className="truncate flex items-center gap-1.5">
          {totalDisplay}
          {isLoading && (
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#0A84FF] animate-pulse" />
          )}
        </span>
        <div className="flex items-center gap-1 shrink-0">
          <span>Less</span>
          <div className="flex items-center gap-[1.5px]">
            <span className="w-1.5 h-1.5 rounded-[1px] bg-white/[0.06]" />
            <span className="w-1.5 h-1.5 rounded-[1px] bg-[#0e4429]" />
            <span className="w-1.5 h-1.5 rounded-[1px] bg-[#006d32]" />
            <span className="w-1.5 h-1.5 rounded-[1px] bg-[#26a641]" />
            <span className="w-1.5 h-1.5 rounded-[1px] bg-[#39d353]" />
          </div>
          <span>More</span>
        </div>
      </div>
    </GlassWidgetCard>
  );
}

export default memo(GithubWidget);
