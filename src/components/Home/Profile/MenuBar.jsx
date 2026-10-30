import React, { useState, useEffect, memo } from "react";
import { Wifi, BatteryMedium, Search } from "lucide-react";
import { PROFILE_CONFIG } from "./config";

function MenuBar({ onOpenSpotlight, onNavigateTab }) {
  const [timeStr, setTimeStr] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleDateString("en-US", {
          timeZone: PROFILE_CONFIG.timezone,
          weekday: "short",
          month: "short",
          day: "numeric",
        }) +
          "  " +
          now.toLocaleTimeString("en-US", {
            timeZone: PROFILE_CONFIG.timezone,
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full h-[28px] px-3.5 bg-white/[0.04] backdrop-blur-[30px] border-b border-white/[0.1] flex items-center justify-between text-[12px] text-white/85 select-none z-30 shrink-0">
      {/* Left Menu Items */}
      <div className="flex items-center gap-3.5">
        {/* Logo */}
        <span className=" flex items-center justify-center">
          <img
            src="/S.png"
            alt="Logo"
            className="w-5 h-5 object-contain select-none"
            draggable={false}
            onError={(e) => {
              if (e.currentTarget.src.includes("/S.png")) {
                e.currentTarget.src = "/s.png";
              }
            }}
          />
        </span>

        {/* App Name */}
        <span className="font-bold text-white text-[12px] font-mono">
          Shubham.Portfolio
        </span>

        {/* Menu items */}
        <div className="hidden sm:flex items-center gap-3.5 text-white/70 text-[12px]">
          <span
            onClick={() => onNavigateTab?.("Projects")}
            className="hover:text-white cursor-pointer transition-colors"
          >
            File
          </span>
          <span
            onClick={() => onNavigateTab?.("Contact")}
            className="hover:text-white cursor-pointer transition-colors"
          >
            Edit
          </span>
          <span
            onClick={() => onNavigateTab?.("Gallery")}
            className="hover:text-white cursor-pointer transition-colors"
          >
            View
          </span>
          <span
            onClick={() => onNavigateTab?.("Profile")}
            className="hover:text-white cursor-pointer transition-colors"
          >
            Window
          </span>
          <span
            onClick={onOpenSpotlight}
            className="hover:text-white cursor-pointer transition-colors"
          >
            Help
          </span>
        </div>
      </div>

      {/* Right Clock */}
      <div className="flex items-center gap-3 text-white/75 text-[11px]">
        {/* Spotlight Icon button */}
        <button
          type="button"
          onClick={onOpenSpotlight}
          className="hover:text-white transition-colors cursor-pointer"
          title="Spotlight Search (⌘ K)"
        >
          <Search size={12} />
        </button>

        {/* Wi-Fi Icon */}
        <Wifi size={13} className="text-white/80" />

        {/* Battery with percentage */}
        <div className="flex items-center gap-1">
          <span className="tabular-nums text-[10px]">100%</span>
          <BatteryMedium size={14} className="text-green-400" />
        </div>

        {/* Live Menu Clock */}
        <span className="font-medium text-white/90 tabular-nums">
          {timeStr || "Sun Oct 29  5:00 PM"}
        </span>
      </div>
    </header>
  );
}

export default memo(MenuBar);

