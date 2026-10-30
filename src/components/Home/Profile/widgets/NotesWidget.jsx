import React, { useState, useEffect, memo } from "react";
import GlassWidgetCard from "./GlassWidgetCard";
import { PROFILE_CONFIG } from "../config";
import { FileText } from "lucide-react";

function NotesWidget() {
  const [liveTimestamp, setLiveTimestamp] = useState("Today at 10:42 AM");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const time = now.toLocaleTimeString("en-US", {
        timeZone: PROFILE_CONFIG.timezone,
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      setLiveTimestamp(`Today at ${time}`);
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <GlassWidgetCard className="p-0 flex flex-col justify-between h-full min-h-0 overflow-hidden">
      {/* Apple Notes Header Strip: Muted Apple-Notes yellow (#E8C547 at 90%) */}
      <div className="w-full bg-[#E8C547]/90 px-3.5 py-1 flex items-center justify-between text-[#1c1917] font-medium text-[10.5px] tracking-wide shrink-0">
        <div className="flex items-center gap-1.5 font-semibold">
          <FileText size={10} className="text-[#634a00]" />
          <span>{PROFILE_CONFIG.bioTitle}</span>
        </div>
      </div>

      {/* Notes Body: 3 short lines */}
      <div className="px-3.5 py-2 flex flex-col justify-center flex-1 text-[10.5px] leading-relaxed text-white/80 space-y-1.5">
        {PROFILE_CONFIG.bio.slice(0, 3).map((line, idx) => (
          <p key={idx} className="line-clamp-2">
            {line}
          </p>
        ))}
      </div>

      {/* Apple Notes Bottom Bar */}
      <div className="px-3.5 py-1.5 border-t border-white/[0.08] text-[9.5px] text-white/45 flex justify-between items-center shrink-0">
        <span>Who am i</span>
        <span>Currently</span>
      </div>
    </GlassWidgetCard>
  );
}

export default memo(NotesWidget);
