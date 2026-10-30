import React, { memo, useMemo } from "react";
import GlassWidgetCard from "./GlassWidgetCard";
import CountUp from "../reactbits/CountUp";
import { PROFILE_CONFIG } from "../config";
import { Activity } from "lucide-react";
import { useGitHubStats } from "../useGitHubStats";

function StatsWidget() {
  const {
    totalCommits,
    sparklineData,
    velocityPercent,
    publicRepos,
    recentWeekCommits,
    isLoading,
  } = useGitHubStats();

  // Use live sparkline points from actual GitHub contribution history or fallback
  const points = sparklineData || PROFILE_CONFIG.sparklineData || [
    4, 7, 3, 9, 6, 12, 8, 14, 7, 11, 9, 13,
  ];

  // Build SVG path coordinates for smooth animated sparkline
  const min = Math.min(...points);
  const max = Math.max(...points);
  const width = 70;
  const height = 16;
  const coords = points.map((p, i) => {
    const x = (i / (points.length - 1)) * width;
    const y = height - ((p - min) / (max - min || 1)) * (height - 4) - 2;
    return `${x},${y}`;
  });
  const pathData = `M ${coords.join(" L ")}`;

  // Synchronized stats: Years Exp, Projects, Commits
  const statsList = useMemo(() => [
    {
      label: "Years Exp",
      value: PROFILE_CONFIG.stats[0]?.value ?? 2,
      suffix: PROFILE_CONFIG.stats[0]?.suffix ?? "+",
    },
    {
      label: "Projects",
      value: publicRepos ?? PROFILE_CONFIG.stats[1]?.value ?? 14,
      suffix: PROFILE_CONFIG.stats[1]?.suffix ?? "",
    },
    {
      label: "Commits",
      value: totalCommits ?? PROFILE_CONFIG.stats[2]?.value ?? 115,
      suffix: "+",
    },
  ], [publicRepos, totalCommits]);

  return (
    <GlassWidgetCard className="p-3.5 sm:p-4 flex flex-col justify-between h-full min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between gap-1">
        <span className="text-[10px] font-semibold tracking-wider uppercase text-white/50 whitespace-nowrap">
          METRICS &amp; STATS
        </span>
        <div className="flex items-center gap-1.5">
          {isLoading && (
            <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" />
          )}
          <Activity size={11} className="text-white shrink-0" />
        </div>
      </div>

      {/* Stats Counter Row */}
      <div className="grid grid-cols-3 gap-1.5 my-auto py-0.5">
        {statsList.map((stat, idx) => (
          <div key={idx} className="flex flex-col items-center text-center">
            <div className="text-xl sm:text-[22px] font-bold tracking-tight text-white/95 tabular-nums leading-tight">
              <CountUp
                to={stat.value}
                duration={1.6}
                delay={idx * 0.1}
                suffix={stat.suffix}
              />
            </div>
            <span className="text-[8.5px] text-white/50 uppercase tracking-tight mt-0.5 font-medium whitespace-nowrap">
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* Animated SVG Sparkline & Dynamic Velocity Bar */}
      <div className="pt-2 border-t border-white/[0.08] flex flex-col gap-1.5 shrink-0">
        <div className="flex items-center justify-between gap-1">
          <span className="text-[9px] text-white/50 tracking-wide uppercase whitespace-nowrap">
            Commit Velocity
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            {recentWeekCommits > 0 && (
              <span className="text-[8.5px] font-mono text-white/45 tabular-nums">
                +{recentWeekCommits} this wk
              </span>
            )}
            <div className="h-4 flex items-center">
              <svg
                width="70"
                height="16"
                viewBox={`0 0 ${width} ${height}`}
                className="overflow-visible"
              >
                <defs>
                  <linearGradient id="sparkGradient2" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
                  </linearGradient>
                </defs>
                <path
                  d={pathData}
                  fill="none"
                  stroke="url(#sparkGradient2)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="animate-[pulse_3s_ease-in-out_infinite]"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Dynamic progress bar tracking actual velocity percentage */}
        <div className="w-full h-1 bg-white/[0.08] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-white/40 to-white rounded-full shadow-[0_0_6px_rgba(255,255,255,0.6)] transition-all duration-700 ease-out"
            style={{ width: `${velocityPercent}%` }}
          />
        </div>
      </div>
    </GlassWidgetCard>
  );
}

export default memo(StatsWidget);
