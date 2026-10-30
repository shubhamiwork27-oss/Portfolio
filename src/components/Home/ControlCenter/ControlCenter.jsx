import React, { useRef, useEffect, memo } from "react";
import { useControlCenter } from "../../../context/ControlCenterContext";
import {
  Wifi,
  Bluetooth,
  Radio,
  Zap,
  Gauge,
  Volume2,
  Sun,
  X,
} from "lucide-react";
import "./ControlCenter.css";

function ControlCenter() {
  const { isOpen, close, prefs, togglePref, updatePref } = useControlCenter();
  const panelRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        // Check if clicked the toggle in menubar
        if (!e.target.closest("[data-control-center-toggle]")) {
          close();
        }
      }
    };
    window.addEventListener("pointerdown", handlePointerDown);
    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen, close]);

  if (!isOpen) return null;

  return (
    <div
      ref={panelRef}
      className="control-center-panel p-3.5 flex flex-col gap-2.5 text-white"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
        <span className="text-[11px] font-semibold tracking-wide text-white/90">
          Control Center
        </span>
        <button
          type="button"
          onClick={close}
          className="w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer"
        >
          <X size={11} />
        </button>
      </div>

      {/* Top 2x2 Network/Device Grid */}
      <div className="grid grid-cols-2 gap-2">
        {/* Connectivity Tile */}
        <div className="p-2.5 rounded-xl bg-white/[0.06] border border-white/[0.08] flex flex-col gap-2">
          {/* Wi-Fi */}
          <button
            type="button"
            onClick={() => togglePref("wifi")}
            className="flex items-center gap-2 text-left cursor-pointer group"
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                prefs.wifi
                  ? "bg-[#0A84FF] text-white shadow-[0_0_8px_rgba(10,132,255,0.5)]"
                  : "bg-white/10 text-white/50"
              }`}
            >
              <Wifi size={13} />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-medium leading-none text-white">
                Wi-Fi
              </div>
              <div className="text-[9.5px] text-white/45 mt-0.5 truncate">
                {prefs.wifi ? "Connected" : "Off"}
              </div>
            </div>
          </button>

          {/* Bluetooth */}
          <button
            type="button"
            onClick={() => togglePref("bluetooth")}
            className="flex items-center gap-2 text-left cursor-pointer group"
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                prefs.bluetooth
                  ? "bg-[#0A84FF] text-white shadow-[0_0_8px_rgba(10,132,255,0.5)]"
                  : "bg-white/10 text-white/50"
              }`}
            >
              <Bluetooth size={13} />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-medium leading-none text-white">
                Bluetooth
              </div>
              <div className="text-[9.5px] text-white/45 mt-0.5 truncate">
                {prefs.bluetooth ? "On" : "Off"}
              </div>
            </div>
          </button>

          {/* AirDrop */}
          <button
            type="button"
            onClick={() => togglePref("airDrop")}
            className="flex items-center gap-2 text-left cursor-pointer group"
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                prefs.airDrop
                  ? "bg-[#0A84FF] text-white shadow-[0_0_8px_rgba(10,132,255,0.5)]"
                  : "bg-white/10 text-white/50"
              }`}
            >
              <Radio size={13} />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-medium leading-none text-white">
                AirDrop
              </div>
              <div className="text-[9.5px] text-white/45 mt-0.5 truncate">
                {prefs.airDrop ? "Contacts" : "Off"}
              </div>
            </div>
          </button>
        </div>

        {/* System Modes Tile */}
        <div className="flex flex-col gap-2">
          {/* Performance Mode */}
          <button
            type="button"
            onClick={() => togglePref("performanceMode")}
            className={`p-2.5 rounded-xl border flex flex-col justify-between h-[68px] text-left transition-all cursor-pointer ${
              prefs.performanceMode
                ? "bg-amber-500/20 border-amber-500/40 text-amber-200"
                : "bg-white/[0.06] border-white/[0.08] text-white/80 hover:bg-white/[0.10]"
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <Zap
                size={14}
                className={
                  prefs.performanceMode ? "text-amber-400" : "text-white/60"
                }
              />
              <span
                className={`text-[8.5px] font-mono uppercase px-1 rounded ${
                  prefs.performanceMode
                    ? "bg-amber-400/20 text-amber-300"
                    : "text-white/40"
                }`}
              >
                {prefs.performanceMode ? "ECO" : "NORMAL"}
              </span>
            </div>
            <div>
              <div className="text-[11px] font-medium leading-tight">
                Eco Performance
              </div>
              <div className="text-[9px] text-white/45">Low GPU shader load</div>
            </div>
          </button>

          {/* Low Data Mode */}
          <button
            type="button"
            onClick={() => togglePref("lowDataMode")}
            className={`p-2.5 rounded-xl border flex flex-col justify-between h-[68px] text-left transition-all cursor-pointer ${
              prefs.lowDataMode
                ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-200"
                : "bg-white/[0.06] border-white/[0.08] text-white/80 hover:bg-white/[0.10]"
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <Gauge
                size={14}
                className={
                  prefs.lowDataMode ? "text-emerald-400" : "text-white/60"
                }
              />
              <span
                className={`text-[8.5px] font-mono uppercase px-1 rounded ${
                  prefs.lowDataMode
                    ? "bg-emerald-400/20 text-emerald-300"
                    : "text-white/40"
                }`}
              >
                {prefs.lowDataMode ? "ON" : "OFF"}
              </span>
            </div>
            <div>
              <div className="text-[11px] font-medium leading-tight">
                Low Data Mode
              </div>
              <div className="text-[9px] text-white/45">Pause auto-rotations</div>
            </div>
          </button>
        </div>
      </div>

      {/* Sliders: Display & Sound */}
      <div className="p-2.5 rounded-xl bg-white/[0.06] border border-white/[0.08] flex flex-col gap-2.5">
        {/* Brightness */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-[10px] text-white/60">
            <span className="flex items-center gap-1">
              <Sun size={11} />
              <span>Display</span>
            </span>
            <span className="font-mono">{prefs.brightness}%</span>
          </div>
          <input
            type="range"
            min="20"
            max="100"
            value={prefs.brightness}
            onChange={(e) => updatePref("brightness", Number(e.target.value))}
            className="w-full h-1.5 bg-white/20 rounded-full accent-white cursor-pointer"
          />
        </div>

        {/* Sound */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-[10px] text-white/60">
            <span className="flex items-center gap-1">
              <Volume2 size={11} />
              <span>Sound</span>
            </span>
            <span className="font-mono">{prefs.volume}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={prefs.volume}
            onChange={(e) => updatePref("volume", Number(e.target.value))}
            className="w-full h-1.5 bg-white/20 rounded-full accent-white cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}

export default memo(ControlCenter);
