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
  Languages,
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
            className="control-center-panel absolute top-9 right-3 sm:right-5 w-[335px] max-w-[calc(100vw-24px)] z-50 text-white select-none overflow-hidden flex flex-col p-3 gap-2.5 max-h-[calc(100vh-80px)]"
          >
            {/* Top Specular Gradient */}
            <div className="control-center-sheen pointer-events-none absolute inset-0 z-0" />

            {/* Header: Title & Close Button */}
            <div className="relative z-10 flex items-center justify-between px-1 shrink-0 pb-1 border-b border-white/[0.08]">
              <div className="flex items-center gap-1.5 text-white/90">
                <div className="w-5 h-5 rounded-full bg-white/[0.08] flex items-center justify-center text-[#0A84FF]">
                  <SlidersHorizontal size={11} strokeWidth={2.4} />
                </div>
                <span className="text-[12.5px] font-semibold tracking-wide">
                  Control Center
                </span>
              </div>
              <button
                type="button"
                onClick={close}
                className="w-5 h-5 rounded-full hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors cursor-pointer"
                aria-label="Close Control Center"
              >
                <X size={12} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="relative z-10 space-y-2.5 overflow-y-auto pr-0.5 control-center-scroll">
              
              {/* =========================================================
                  GROUP 1: PERFORMANCE & DATA (macOS Split Card)
                  ========================================================= */}
              <div className="control-center-card p-2.5 space-y-2">
                {/* Performance Mode */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
                        prefs.performanceMode
                          ? "bg-[#0A84FF] text-white shadow-[0_0_8px_#0A84FF]"
                          : "bg-white/[0.08] text-white/70"
                      }`}
                    >
                      <Zap size={14} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11.5px] font-semibold text-white/95 leading-tight">
                        Performance Mode
                      </div>
                      <div className="text-[9.5px] text-white/45 truncate">
                        {prefs.performanceMode
                          ? "Optimized for 60fps & low GPU"
                          : "High-fidelity effects active"}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={prefs.performanceMode}
                    aria-label="Toggle Performance Mode"
                    onClick={() =>
                      updatePreference("performanceMode", !prefs.performanceMode)
                    }
                    data-checked={prefs.performanceMode}
                    className="macos-switch"
                  >
                    <span className="macos-switch-thumb" />
                  </button>
                </div>

                <div className="h-[1px] bg-white/[0.06] w-full" />

                {/* Low Data Mode */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
                        prefs.lowDataMode
                          ? "bg-[#0A84FF] text-white shadow-[0_0_8px_#0A84FF]"
                          : "bg-white/[0.08] text-white/70"
                      }`}
                    >
                      <WifiOff size={13} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11.5px] font-semibold text-white/95 leading-tight">
                        Low Data Mode
                      </div>
                      <div className="text-[9.5px] text-white/45 truncate">
                        {prefs.lowDataMode
                          ? "Media autoplay disabled"
                          : "Standard media loading"}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={prefs.lowDataMode}
                    aria-label="Toggle Low Data Mode"
                    onClick={() =>
                      updatePreference("lowDataMode", !prefs.lowDataMode)
                    }
                    data-checked={prefs.lowDataMode}
                    className="macos-switch"
                  >
                    <span className="macos-switch-thumb" />
                  </button>
                </div>
              </div>

              {/* =========================================================
                  GROUP 2: DISPLAY & APPEARANCE (ElasticSliders)
                  ========================================================= */}
              <div className="control-center-card p-2.5 space-y-3">
                {/* Glass Intensity ElasticSlider */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1.5 font-medium text-white/80">
                      <Sparkles size={12} className="text-[#0A84FF]" />
                      Glass Intensity
                    </span>
                    <span className="text-[10.5px] font-mono text-white/60 tabular-nums">
                      {Math.round(prefs.glassIntensity)}%
                    </span>
                  </div>
                  <div className="pt-0.5">
                    <ElasticSlider
                      value={prefs.glassIntensity}
                      startingValue={0}
                      maxValue={100}
                      onChange={(val) =>
                        updatePreference("glassIntensity", Math.round(val))
                      }
                      leftIcon={null}
                      rightIcon={null}
                      activeThickness={9}
                      maxStretch={11}
                      formatValue={(value) => `${Math.round(value)}%`}
                      ariaLabel="Glass intensity"
                    />
                  </div>
                </div>

                {/* Text Scaling ElasticSlider */}
                <div className="space-y-1.5 pt-1 border-t border-white/[0.06]">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1.5 font-medium text-white/80">
                      <Type size={12} className="text-[#0A84FF]" />
                      Text Scaling
                    </span>
                    <span className="text-[10.5px] font-mono text-white/60 tabular-nums">
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
                      onChange={(val) =>
                        updatePreference("textScaling", Math.round(val))
                      }
                      leftIcon={null}
                      rightIcon={null}
                      activeThickness={9}
                      maxStretch={11}
                      formatValue={(value) => `${Math.round(value)}%`}
                      ariaLabel="Text scaling"
                    />
                  </div>
                </div>

                {/* Display Toggles: Reduce Transparency & High Contrast */}
                <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-white/[0.06]">
                  <button
                    type="button"
                    onClick={() =>
                      updatePreference(
                        "reduceTransparency",
                        !prefs.reduceTransparency
                      )
                    }
                    className={`flex items-center gap-2 p-2 rounded-xl text-left transition-all cursor-pointer ${
                      prefs.reduceTransparency
                        ? "control-center-pill-active"
                        : "bg-white/[0.04] hover:bg-white/[0.08] text-white/80"
                    }`}
                  >
                    <Layers size={13} className="shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[10px] font-semibold leading-tight">
                        Solid Glass
                      </div>
                      <div className="text-[8.5px] opacity-70 truncate">
                        {prefs.reduceTransparency ? "Opaque" : "Translucent"}
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      updatePreference("highContrast", !prefs.highContrast)
                    }
                    className={`flex items-center gap-2 p-2 rounded-xl text-left transition-all cursor-pointer ${
                      prefs.highContrast
                        ? "control-center-pill-active"
                        : "bg-white/[0.04] hover:bg-white/[0.08] text-white/80"
                    }`}
                  >
                    <Contrast size={13} className="shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[10px] font-semibold leading-tight">
                        High Contrast
                      </div>
                      <div className="text-[8.5px] opacity-70 truncate">
                        {prefs.highContrast ? "Enhanced" : "Standard"}
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* =========================================================
                  GROUP 3: ACCESSIBILITY (Motion, Links & Keyboard)
                  ========================================================= */}
              <div className="control-center-card p-2.5 space-y-2">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-white/40 pb-0.5">
                  Accessibility
                </div>

                {/* Reduce Motion */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Activity size={13} className="text-[#0A84FF] shrink-0" />
                    <span className="text-[11px] font-medium text-white/85">
                      Reduce Motion
                    </span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={prefs.reduceMotion}
                    aria-label="Toggle Reduce Motion"
                    onClick={() =>
                      updatePreference("reduceMotion", !prefs.reduceMotion)
                    }
                    data-checked={prefs.reduceMotion}
                    className="macos-switch"
                  >
                    <span className="macos-switch-thumb" />
                  </button>
                </div>

                {/* Underline Links */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Underline size={13} className="text-[#0A84FF] shrink-0" />
                    <span className="text-[11px] font-medium text-white/85">
                      Underline Links
                    </span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={prefs.underlineLinks}
                    aria-label="Toggle Underline Links"
                    onClick={() =>
                      updatePreference("underlineLinks", !prefs.underlineLinks)
                    }
                    data-checked={prefs.underlineLinks}
                    className="macos-switch"
                  >
                    <span className="macos-switch-thumb" />
                  </button>
                </div>

                {/* Keyboard Navigation Focus Rings */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Keyboard size={13} className="text-[#0A84FF] shrink-0" />
                    <span className="text-[11px] font-medium text-white/85">
                      Focus Indicator
                    </span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={prefs.keyboardNav}
                    aria-label="Toggle Better Keyboard Navigation"
                    onClick={() =>
                      updatePreference("keyboardNav", !prefs.keyboardNav)
                    }
                    data-checked={prefs.keyboardNav}
                    className="macos-switch"
                  >
                    <span className="macos-switch-thumb" />
                  </button>
                </div>
              </div>

              {/* =========================================================
                  GROUP 4: PREFERENCES & UTILITIES
                  ========================================================= */}
              <div className="control-center-card p-2.5 space-y-2">
                <div className="grid grid-cols-2 gap-1.5">
                  {/* Sound Effects Toggle */}
                  <button
                    type="button"
                    onClick={() =>
                      updatePreference("soundEffects", !prefs.soundEffects)
                    }
                    className={`flex items-center gap-2 p-2 rounded-xl text-left transition-all cursor-pointer ${
                      prefs.soundEffects
                        ? "control-center-pill-active"
                        : "bg-white/[0.04] hover:bg-white/[0.08] text-white/80"
                    }`}
                  >
                    {prefs.soundEffects ? (
                      <Volume2 size={13} className="shrink-0" />
                    ) : (
                      <VolumeX size={13} className="shrink-0" />
                    )}
                    <div className="min-w-0">
                      <div className="text-[10px] font-semibold leading-tight">
                        Sound FX
                      </div>
                      <div className="text-[8.5px] opacity-70 truncate">
                        {prefs.soundEffects ? "Enabled" : "Muted"}
                      </div>
                    </div>
                  </button>

                  {/* Language Toggle */}
                  <button
                    type="button"
                    onClick={() =>
                      updatePreference(
                        "language",
                        prefs.language === "en" ? "hi" : "en"
                      )
                    }
                    className="flex items-center gap-2 p-2 rounded-xl text-left bg-white/[0.04] hover:bg-white/[0.08] text-white/80 transition-all cursor-pointer"
                  >
                    <Languages size={13} className="text-[#0A84FF] shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[10px] font-semibold leading-tight">
                        Language
                      </div>
                      <div className="text-[8.5px] opacity-70 truncate">
                        {prefs.language === "en" ? "English" : "हिंदी"}
                      </div>
                    </div>
                  </button>
                </div>

                {/* Bottom Actions Row */}
                <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-white/[0.06]">
                  {/* Keyboard Shortcuts Trigger */}
                  <button
                    type="button"
                    onClick={() => setIsShortcutsOpen(true)}
                    className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white/70 hover:text-white transition-all text-[10px] font-medium cursor-pointer"
                  >
                    <Command size={11} className="text-[#0A84FF]" />
                    <span>Shortcuts</span>
                  </button>

                  {/* Reset Preferences */}
                  <button
                    type="button"
                    onClick={handleResetClick}
                    className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl transition-all text-[10px] font-medium cursor-pointer ${
                      resetConfirm
                        ? "bg-rose-500/80 hover:bg-rose-500 text-white shadow-[0_0_8px_rgba(244,63,94,0.4)]"
                        : "bg-white/[0.04] hover:bg-white/[0.08] text-white/60 hover:text-white"
                    }`}
                  >
                    <RotateCcw size={11} />
                    <span>{resetConfirm ? "Confirm Reset?" : "Reset All"}</span>
                  </button>
                </div>
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
