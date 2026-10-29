import React, { memo } from "react";
import GlassWidgetCard from "./GlassWidgetCard";
import CountUp from "../reactbits/CountUp";
import { PROFILE_CONFIG } from "../config";
import { Activity } from "lucide-react";

function StatsWidget() {
  const points = PROFILE_CONFIG.sparklineData || [
    24, 38, 30, 45, 52, 40, 68, 55, 74, 60, 85, 92,
  ];

  // Build SVG path coordinates for smooth animated sparkline
  const min = Math.min(...points);
  const max = Math.max(...points);
  const width = 80;
  const height = 18;
  const coords = points.map((p, i) => {
    const x = (i / (points.length - 1)) * width;
    const y = height - ((p - min) / (max - min || 1)) * (height - 4) - 2;
    return `${x},${y}`;
  });
  const pathData = `M ${coords.join(" L ")}`;

  return (
    <GlassWidgetCard className="p-3.5 sm:p-4 flex flex-col justify-between h-full min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between gap-1">
        <span className="text-[10px] font-semibold tracking-wider uppercase text-white/50 whitespace-nowrap">
          METRICS &amp; STATS
        </span>
        <Activity size={11} className="text-[#0A84FF] shrink-0" />
      </div>

      {/* Stats Counter Row */}
      <div className="grid grid-cols-3 gap-1.5 my-auto py-0.5">
        {PROFILE_CONFIG.stats.map((stat, idx) => (
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

      {/* Animated SVG Sparkline & Velocity Bar */}
      <div className="pt-2 border-t border-white/[0.08] flex flex-col gap-1.5 shrink-0">
        <div className="flex items-center justify-between gap-1">
          <span className="text-[9px] text-white/50 tracking-wide uppercase whitespace-nowrap">
            Commit Velocity
          </span>
          <div className="h-4 flex items-center shrink-0">
            <svg
              width="70"
              height="16"
              viewBox={`0 0 ${width} ${height}`}
              className="overflow-visible"
            >
              <defs>
                <linearGradient id="sparkGradient2" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#0A84FF" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#0A84FF" stopOpacity="1" />
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

        {/* Thin progress bar */}
        <div className="w-full h-1 bg-white/[0.08] rounded-full overflow-hidden">
          <div className="w-[84%] h-full bg-gradient-to-r from-[#0A84FF]/60 to-[#0A84FF] rounded-full" />
        </div>
      </div>
    </GlassWidgetCard>
  );
}

export default memo(StatsWidget);
