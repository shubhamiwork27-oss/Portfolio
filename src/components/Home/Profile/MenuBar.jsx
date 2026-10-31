import React, { useState, useEffect, memo } from "react";
import { Wifi, BatteryMedium, Search, SlidersHorizontal } from "lucide-react";
import { useControlCenter } from "../../../context/ControlCenterContext";
import { PROFILE_CONFIG } from "./config";

function MenuBar({ onOpenSpotlight, onNavigateTab }) {
  const [timeStr, setTimeStr] = useState("");
  const [shortTimeStr, setShortTimeStr] = useState("");
  const controlCenter = useControlCenter();
  const toggleControlCenter = controlCenter?.toggleOpen;
  const isControlCenterOpen = controlCenter?.isOpen;

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
      setShortTimeStr(
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
    <header
      className="w-full h-[28px] px-2.5 sm:px-3.5 bg-white/[0.04] border-b border-white/[0.1] flex items-center justify-between text-[11px] sm:text-[12px] text-white/85 select-none z-30 shrink-0"
      style={{
        backdropFilter: "blur(var(--glass-blur, 30px))",
        WebkitBackdropFilter: "blur(var(--glass-blur, 30px))",
      }}
    >
      {/* Left Menu Items */}
      <div className="flex items-center gap-2 sm:gap-3.5 min-w-0">
        {/* Logo */}
        <span className="flex items-center justify-center shrink-0">
          <img
            src="/S.png"
            alt="Logo"
            className="w-4 h-4 sm:w-5 sm:h-5 object-contain select-none"
            draggable={false}
            onError={(e) => {
              if (e.currentTarget.src.includes("/S.png")) {
                e.currentTarget.src = "/s.png";
              }
            }}
          />
        </span>

        {/* App Name */}
        <span className="font-bold text-white text-[11px] sm:text-[12px] font-mono truncate">
          <span className="hidden sm:inline">Shubham.Portfolio</span>
          <span className="sm:hidden">Shubham</span>
        </span>

        {/* Menu items */}
        <div className="hidden md:flex items-center gap-3.5 text-white/70 text-[12px]">
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

      {/* Right Clock & Status */}
      <div className="flex items-center gap-2 sm:gap-3 text-white/75 text-[10px] sm:text-[11px] shrink-0">
        {/* Spotlight Icon button */}
        <button
          type="button"
          onClick={onOpenSpotlight}
          className="p-1 rounded hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title="Spotlight Search (⌘ K)"
        >
          <Search size={12} />
        </button>

        {/* Wi-Fi Icon */}
        <Wifi size={13} className="text-white/80 hidden xs:block" />

        {/* Control Center Toggle */}
        <button
          type="button"
          data-control-center-trigger="true"
          data-control-center-toggle="true"
          onClick={toggleControlCenter}
          aria-expanded={isControlCenterOpen}
          aria-label="Control Center"
          className={`h-5 w-5 rounded flex items-center justify-center transition-colors cursor-pointer ${
            isControlCenterOpen
              ? "text-white bg-white/20 shadow-sm"
              : "text-white/80 hover:text-white hover:bg-white/10"
          }`}
          title="Control Center"
        >
          <SlidersHorizontal size={12} />
        </button>

        {/* Battery with percentage */}
        <div className="flex items-center gap-1">
          <span className="tabular-nums text-[10px] hidden sm:inline">100%</span>
          <BatteryMedium size={14} className="text-green-400" />
        </div>

        {/* Live Menu Clock */}
        <span className="font-medium text-white/90 tabular-nums text-[10px] sm:text-[11px]">
          <span className="hidden sm:inline">{timeStr || "Sun Oct 29  5:00 PM"}</span>
          <span className="sm:hidden">{shortTimeStr || "5:00 PM"}</span>
        </span>
      </div>
    </header>
  );
}

export default memo(MenuBar);

