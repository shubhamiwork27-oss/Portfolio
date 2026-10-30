import React, { useState, useEffect, memo } from "react";
import GlassWidgetCard from "./GlassWidgetCard";
import { PROFILE_CONFIG } from "../config";
import { Clock } from "lucide-react";

function AvailabilityWidget() {
  const [timeStr, setTimeStr] = useState("");
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString("en-US", {
          timeZone: PROFILE_CONFIG.timezone,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
      setDateStr(
        now.toLocaleDateString("en-US", {
          timeZone: PROFILE_CONFIG.timezone,
          weekday: "short",
          month: "short",
          day: "numeric",
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <GlassWidgetCard className="p-3.5 sm:p-4 flex flex-col justify-between h-full min-h-0">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-1">
        <span className="text-[10px] font-semibold tracking-wider uppercase text-white/50 whitespace-nowrap">
          AVAILABILITY
        </span>
        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9.5px] text-emerald-400 font-medium shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Active</span>
        </div>
      </div>

      {/* Live Clock Display (Inter font with tabular-nums) */}
      <div className="my-auto py-0.5">
        <div className="flex items-center gap-1 text-white/45 text-[10px] mb-0.5">
          <Clock size={10} className="text-white" />
          <span>Local Time (IST)</span>
        </div>
        <div className="text-xl sm:text-[22px] font-bold tracking-tight text-white/95 tabular-nums leading-tight">
          {timeStr || "12:00:00 PM"}
        </div>
        <div className="text-[10px] text-white/45 mt-0.5 tabular-nums truncate">
          {dateStr} • Asia/Kolkata
        </div>
      </div>

      {/* Bottom note */}
      <div className="pt-1.5 border-t border-white/[0.08] text-[10px] text-white/55 truncate">
        Available for full-time &amp; contracts
      </div>
    </GlassWidgetCard>
  );
}

export default memo(AvailabilityWidget);
