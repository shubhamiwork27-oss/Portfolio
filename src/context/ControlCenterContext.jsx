import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";

const STORAGE_KEY = "portfolio_control_center_prefs";

// Default settings as specified in requirements
const DEFAULT_PREFERENCES = {
  theme: "dark",
  ambientMode: false,
  performanceMode: false,
  lowDataMode: false,
  glassIntensity: 70, // 0 to 100
  textScaling: 100, // 90 to 120, steps of 5
  reduceTransparency: false,
  highContrast: false,
  underlineLinks: false,
  reduceMotion: false,
  keyboardNav: false,
  soundEffects: true,
};

const ControlCenterContext = createContext(null);

/**
 * Synthesizes soft, native-feeling macOS UI audio feedback via Web Audio API.
 * Instantaneous, offline-safe, and requires zero external audio asset downloads.
 */
export function playUISound(type = "click", enabled = true) {
  if (!enabled || typeof window === "undefined") return;
  try {
    const AudioContextClass =
      window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === "toggle-on") {
      // Pleasant macOS rising blip
      osc.type = "sine";
      osc.frequency.setValueAtTime(540, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.055);
    } else if (type === "toggle-off") {
      // Pleasant macOS falling blip
      osc.type = "sine";
      osc.frequency.setValueAtTime(740, now);
      osc.frequency.exponentialRampToValueAtTime(420, now + 0.05);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.055);
    } else if (type === "reset") {
      // Chime reset chord
      osc.type = "triangle";
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(660, now + 0.12);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc.start(now);
      osc.stop(now + 0.15);
    } else {
      // Subtle crisp click
      osc.type = "sine";
      osc.frequency.setValueAtTime(480, now);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
      osc.start(now);
      osc.stop(now + 0.03);
    }
  } catch (e) {
    // Ignore audio autoplay restrictions before first user interaction
  }
}

export function ControlCenterProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  // Initialize preferences from localStorage (or fallback to defaults + OS motion preference)
  const [prefs, setPrefs] = useState(() => {
    let initial = { ...DEFAULT_PREFERENCES };

    if (typeof window !== "undefined") {
      // Respect OS reduced-motion preference on initial load
      try {
        const prefersReducedMotion = window.matchMedia?.(
          "(prefers-reduced-motion: reduce)"
        ).matches;
        if (prefersReducedMotion) {
          initial.reduceMotion = true;
        }
      } catch (e) {}

      // Load saved preferences from localStorage
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          initial = { ...initial, ...parsed };
        }
      } catch (e) {}
    }

    return initial;
  });

  // Keep a ref for sound feedback
  const soundEnabledRef = useRef(prefs.soundEffects);
  useEffect(() => {
    soundEnabledRef.current = prefs.soundEffects;
  }, [prefs.soundEffects]);

  // Persist preferences to localStorage whenever changed
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
      } catch (e) {}
    }
  }, [prefs]);

  // Apply preferences dynamically to DOM root and CSS variables in real time
  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;

    // 1. Glass Intensity & Blur
    const baseBlur = 32;
    const effectiveBlur = prefs.reduceTransparency
      ? 0
      : Math.round((prefs.glassIntensity / 100) * baseBlur);

    const effectiveBgOpacity = prefs.reduceTransparency
      ? 0.94
      : Math.min(
          0.22,
          Math.max(0.02, 0.02 + (prefs.glassIntensity / 100) * 0.09)
        );

    const effectiveBorderOpacity = prefs.highContrast
      ? 0.35
      : 0.1 + (prefs.glassIntensity / 100) * 0.08;

    root.style.setProperty("--glass-intensity", `${prefs.glassIntensity}%`);
    root.style.setProperty("--glass-blur", `${effectiveBlur}px`);
    root.style.setProperty("--glass-bg-opacity", `${effectiveBgOpacity}`);
    root.style.setProperty("--glass-border-opacity", `${effectiveBorderOpacity}`);

    // 2. Text Scaling
    root.style.setProperty("--font-scale", `${prefs.textScaling}%`);
    root.style.fontSize = `${prefs.textScaling}%`;

    // 3. Class toggles on root for instantaneous styling
    root.classList.toggle("light", prefs?.theme === "light");
    root.classList.toggle("dark", prefs?.theme !== "light");
    root.classList.toggle("ambient-mode", Boolean(prefs.ambientMode));
    root.classList.toggle("perf-mode", Boolean(prefs.performanceMode));
    root.classList.toggle("low-data-mode", Boolean(prefs.lowDataMode));
    root.classList.toggle("reduce-transparency", Boolean(prefs.reduceTransparency));
    root.classList.toggle("high-contrast", Boolean(prefs.highContrast));
    root.classList.toggle("underline-links", Boolean(prefs.underlineLinks));
    root.classList.toggle("reduce-motion", Boolean(prefs.reduceMotion));
    root.classList.toggle("keyboard-nav", Boolean(prefs.keyboardNav));
  }, [prefs]);

  // Update a single preference
  const updatePreference = useCallback((key, value) => {
    setPrefs((prev) => {
      const updated = {
        ...prev,
        [key]: typeof value === "function" ? value(prev[key]) : value,
      };
      return updated;
    });

    if (typeof value === "boolean") {
      playUISound(value ? "toggle-on" : "toggle-off", soundEnabledRef.current);
    } else {
      playUISound("click", soundEnabledRef.current);
    }
  }, []);

  // Toggle boolean preference
  const togglePreference = useCallback((key) => {
    setPrefs((prev) => {
      const nextVal = !prev[key];
      playUISound(nextVal ? "toggle-on" : "toggle-off", soundEnabledRef.current);
      return {
        ...prev,
        [key]: nextVal,
      };
    });
  }, []);

  // Reset all preferences to default
  const resetPreferences = useCallback(() => {
    setPrefs(DEFAULT_PREFERENCES);
    playUISound("reset", soundEnabledRef.current);
  }, []);

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev;
      playUISound(next ? "toggle-on" : "toggle-off", soundEnabledRef.current);
      return next;
    });
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  return (
    <ControlCenterContext.Provider
      value={{
        isOpen,
        setIsOpen,
        toggleOpen,
        close,
        open,
        prefs,
        updatePreference,
        togglePreference,
        updatePref: updatePreference,
        togglePref: togglePreference,
        resetPreferences,
        isShortcutsOpen,
        setIsShortcutsOpen,
        playUISound: (type) => playUISound(type, soundEnabledRef.current),
      }}
    >
      {children}
    </ControlCenterContext.Provider>
  );
}

export function useControlCenter() {
  const context = useContext(ControlCenterContext);
  if (!context) {
    return {
      isOpen: false,
      setIsOpen: () => {},
      toggleOpen: () => {},
      close: () => {},
      open: () => {},
      prefs: DEFAULT_PREFERENCES,
      updatePreference: () => {},
      togglePreference: () => {},
      updatePref: () => {},
      togglePref: () => {},
      resetPreferences: () => {},
      isShortcutsOpen: false,
      setIsShortcutsOpen: () => {},
      playUISound: () => {},
    };
  }
  return context;
}
