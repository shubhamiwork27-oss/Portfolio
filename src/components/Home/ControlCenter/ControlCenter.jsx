import React, { useRef, useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  SlidersHorizontal,
  Zap,
  WifiOff,
  Sparkles,
  Type,
  Layers,
  Contrast,
  Underline,
  Activity,
  Keyboard,
  Volume2,
  VolumeX,
  RotateCcw,
  SunMedium,
  Command,
  X,
} from "lucide-react";
import { useControlCenter } from "../../../context/ControlCenterContext";
import ElasticSlider from "../../ElasticSlider/ElasticSlider";
import ShortcutsModal from "./ShortcutsModal";
import "./ControlCenter.css";

function ControlCenter() {
  const {
    isOpen,
    close,
    prefs,
    updatePreference,
    resetPreferences,
    isShortcutsOpen,
    setIsShortcutsOpen,
  } = useControlCenter();

  const panelRef = useRef(null);
  const [resetConfirm, setResetConfirm] = useState(false);
  const resetTimerRef = useRef(null);

  // Close when clicking outside the panel
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e) => {
      // Don't close if clicking inside panel or on the menubar control center trigger button
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        !e.target.closest("[data-control-center-trigger]") &&
        !e.target.closest("[data-control-center-toggle]")
      ) {
        close();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        close();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, close]);

  // Reset confirmation timeout handler
  const handleResetClick = () => {
    if (resetConfirm) {
      resetPreferences();
      setResetConfirm(false);
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    } else {
      setResetConfirm(true);
      resetTimerRef.current = setTimeout(() => {
        setResetConfirm(false);
      }, 3500);
    }
  };

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-label="Control Center"
            className="control-center-panel absolute top-9 right-3 sm:right-5 w-[326px] max-w-[calc(100vw-24px)] z-50 text-white select-none overflow-hidden flex flex-col p-2.5 gap-2 max-h-[calc(100vh-80px)]"
          >
            {/* Top Specular Gradient */}
            <div className="control-center-sheen pointer-events-none absolute inset-0 z-0" />

            {/* Header: Title & Close Button */}
            <div className="relative z-10 flex items-center justify-between px-1 shrink-0 pb-1 border-b border-white/[0.08]">
              <div className="flex items-center gap-1.5 text-white/90">
                <div className="w-4 h-4 rounded-full bg-white/[0.1] flex items-center justify-center text-[#007AFF]">
                  <SlidersHorizontal size={10} strokeWidth={2.4} />
                </div>
                <span className="text-[12px] font-semibold tracking-wide">
                  Control Center
                </span>
              </div>
              <button
                type="button"
                onClick={close}
                className="w-4 h-4 rounded-full hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors cursor-pointer"
                aria-label="Close Control Center"
              >
                <X size={11} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="relative z-10 space-y-2 overflow-y-auto pr-0.5 control-center-scroll">
              
              {/* =========================================================
                  TOP ROW: 2-COLUMN SPLIT (macOS Connectivity & Controls)
                  ========================================================= */}
              <div className="grid grid-cols-2 gap-2">
                {/* Left Card: Performance & Low Data (Tall macOS Widget) */}
                <div className="control-center-card p-2.5 flex flex-col justify-between gap-2">
                  {/* Performance Mode */}
                  <div
                    onClick={() => updatePreference("performanceMode", !prefs.performanceMode)}
                    className="flex items-center gap-2 cursor-pointer group"
                    role="button"
                    tabIndex={0}
                  >
                    <div
                      className={`macos-icon-circle ${
                        prefs.performanceMode ? "macos-icon-circle-active" : "macos-icon-circle-inactive"
                      }`}
                    >
                      <Zap size={13} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-semibold text-white/95 leading-tight truncate">
                        Performance
                      </div>
                      <div className="text-[9px] text-white/50 leading-tight">
                        {prefs.performanceMode ? "On" : "Off"}
                      </div>
                    </div>
                  </div>

                  <div className="h-[0.5px] bg-white/[0.08] w-full" />

                  {/* Low Data Mode */}
                  <div
                    onClick={() => updatePreference("lowDataMode", !prefs.lowDataMode)}
                    className="flex items-center gap-2 cursor-pointer group"
                    role="button"
                    tabIndex={0}
                  >
                    <div
                      className={`macos-icon-circle ${
                        prefs.lowDataMode ? "macos-icon-circle-active" : "macos-icon-circle-inactive"
                      }`}
                    >
                      <WifiOff size={12} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-semibold text-white/95 leading-tight truncate">
                        Low Data
                      </div>
                      <div className="text-[9px] text-white/50 leading-tight">
                        {prefs.lowDataMode ? "On" : "Off"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: 2 Stacked Cards (Sound FX & Language) */}
                <div className="flex flex-col gap-2">
                  {/* Sound FX Card */}
                  <button
                    type="button"
                    onClick={() => updatePreference("soundEffects", !prefs.soundEffects)}
                    className="control-center-card p-2 flex items-center gap-2 text-left cursor-pointer transition-all flex-1"
                  >
                    <div
                      className={`macos-icon-circle ${
                        prefs.soundEffects ? "macos-icon-circle-active" : "macos-icon-circle-inactive"
                      }`}
                    >
                      {prefs.soundEffects ? <Volume2 size={13} /> : <VolumeX size={13} />}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-semibold text-white/95 leading-tight truncate">
                        Sound FX
                      </div>
                      <div className="text-[9px] text-white/50 leading-tight">
                        {prefs.soundEffects ? "On" : "Muted"}
                      </div>
                    </div>
                  </button>

                  {/* Ambient Mode Card */}
                  <button
                    type="button"
                    onClick={() =>
                      updatePreference("ambientMode", !prefs.ambientMode)
                    }
                    className="control-center-card p-2 flex items-center gap-2 text-left cursor-pointer transition-all flex-1"
                  >
                    <div
                      className={`macos-icon-circle ${
                        prefs.ambientMode
                          ? "macos-icon-circle-active"
                          : "macos-icon-circle-inactive"
                      }`}
                    >
                      <SunMedium size={13} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-semibold text-white/95 leading-tight truncate">
                        Ambient Mode
                      </div>
                      <div className="text-[9px] text-white/50 leading-tight">
                        {prefs.ambientMode ? "Active" : "Off"}
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* =========================================================
                  DISPLAY / GLASS INTENSITY (macOS Slider Widget)
                  ========================================================= */}
              <div className="control-center-card p-2.5 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-semibold text-white/90">
                  <span className="flex items-center gap-1.5">
                    <Sparkles size={12} className="text-[#007AFF]" />
                    Display Glass
                  </span>
                  <span className="text-[10px] font-mono text-white/50 tabular-nums">
                    {Math.round(prefs.glassIntensity)}%
                  </span>
                </div>
                <div className="pt-0.5">
                  <ElasticSlider
                    value={prefs.glassIntensity}
                    startingValue={0}
                    maxValue={100}
                    onChange={(val) => updatePreference("glassIntensity", Math.round(val))}
                    leftIcon={null}
                    rightIcon={null}
                    activeThickness={10}
                    maxStretch={8}
                    formatValue={(value) => `${Math.round(value)}%`}
                    ariaLabel="Glass intensity"
                  />
                </div>
              </div>

              {/* =========================================================
                  TEXT SCALING (macOS Slider Widget)
                  ========================================================= */}
              <div className="control-center-card p-2.5 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-semibold text-white/90">
                  <span className="flex items-center gap-1.5">
                    <Type size={12} className="text-[#007AFF]" />
                    Text Size
                  </span>
                  <span className="text-[10px] font-mono text-white/50 tabular-nums">
                    {Math.round(prefs.textScaling)}%
                  </span>
                </div>
                <div className="pt-0.5">
                  <ElasticSlider
                    value={prefs.textScaling}
                    startingValue={90}
                    maxValue={120}
                    isStepped={true}
                    stepSize={5}
                    onChange={(val) => updatePreference("textScaling", Math.round(val))}
                    leftIcon={null}
                    rightIcon={null}
                    activeThickness={10}
                    maxStretch={8}
                    formatValue={(value) => `${Math.round(value)}%`}
                    ariaLabel="Text scaling"
                  />
                </div>
              </div>

              {/* =========================================================
                  ACCESSIBILITY & DISPLAY TOGGLES
                  ========================================================= */}
              <div className="control-center-card p-2.5 space-y-2">
                <div className="text-[9.5px] font-semibold uppercase tracking-wider text-white/40 pb-0.5">
                  Accessibility
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  {/* Solid Glass / Reduce Transparency */}
                  <button
                    type="button"
                    onClick={() => updatePreference("reduceTransparency", !prefs.reduceTransparency)}
                    className={`flex items-center gap-2 p-1.5 rounded-xl text-left transition-all cursor-pointer ${
                      prefs.reduceTransparency
                        ? "control-center-pill-active"
                        : "bg-white/[0.04] hover:bg-white/[0.08] text-white/80"
                    }`}
                  >
                    <Layers size={12} className="shrink-0" />
                    <span className="text-[10px] font-medium truncate">Solid Glass</span>
                  </button>

                  {/* High Contrast */}
                  <button
                    type="button"
                    onClick={() => updatePreference("highContrast", !prefs.highContrast)}
                    className={`flex items-center gap-2 p-1.5 rounded-xl text-left transition-all cursor-pointer ${
                      prefs.highContrast
                        ? "control-center-pill-active"
                        : "bg-white/[0.04] hover:bg-white/[0.08] text-white/80"
                    }`}
                  >
                    <Contrast size={12} className="shrink-0" />
                    <span className="text-[10px] font-medium truncate">Contrast</span>
                  </button>

                  {/* Reduce Motion */}
                  <button
                    type="button"
                    onClick={() => updatePreference("reduceMotion", !prefs.reduceMotion)}
                    className={`flex items-center gap-2 p-1.5 rounded-xl text-left transition-all cursor-pointer ${
                      prefs.reduceMotion
                        ? "control-center-pill-active"
                        : "bg-white/[0.04] hover:bg-white/[0.08] text-white/80"
                    }`}
                  >
                    <Activity size={12} className="shrink-0" />
                    <span className="text-[10px] font-medium truncate">Less Motion</span>
                  </button>

                  {/* Focus Ring Indicator */}
                  <button
                    type="button"
                    onClick={() => updatePreference("keyboardNav", !prefs.keyboardNav)}
                    className={`flex items-center gap-2 p-1.5 rounded-xl text-left transition-all cursor-pointer ${
                      prefs.keyboardNav
                        ? "control-center-pill-active"
                        : "bg-white/[0.04] hover:bg-white/[0.08] text-white/80"
                    }`}
                  >
                    <Keyboard size={12} className="shrink-0" />
                    <span className="text-[10px] font-medium truncate">Focus Rings</span>
                  </button>
                </div>
              </div>

              {/* =========================================================
                  BOTTOM UTILITIES
                  ========================================================= */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIsShortcutsOpen(true)}
                  className="control-center-card py-2 px-2.5 flex items-center justify-center gap-1.5 text-white/75 hover:text-white transition-all text-[10.5px] font-medium cursor-pointer"
                >
                  <Command size={11} className="text-[#007AFF]" />
                  <span>Shortcuts</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetClick}
                  className={`control-center-card py-2 px-2.5 flex items-center justify-center gap-1.5 transition-all text-[10.5px] font-medium cursor-pointer ${
                    resetConfirm
                      ? "!bg-rose-500/80 text-white shadow-sm"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  <RotateCcw size={11} />
                  <span>{resetConfirm ? "Confirm?" : "Reset"}</span>
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard Shortcuts Reference Dialog */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </>
  );
}

export default memo(ControlCenter);
