import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "portfolio_control_center_prefs";

const DEFAULT_PREFS = {
  performanceMode: false,
  lowDataMode: false,
  soundFx: true,
  brightness: 100,
  volume: 80,
  wifi: true,
  bluetooth: true,
  airDrop: true,
};

const ControlCenterContext = createContext(null);

export function ControlCenterProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [prefs, setPrefs] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return { ...DEFAULT_PREFS, ...JSON.parse(saved) };
      } catch (e) {
        // Fallback to default
      }
    }
    return DEFAULT_PREFS;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
      } catch (e) {
        // Ignore quota
      }
    }
  }, [prefs]);

  const toggleOpen = useCallback(() => setIsOpen((prev) => !prev), []);
  const close = useCallback(() => setIsOpen(false), []);
  const open = useCallback(() => setIsOpen(true), []);

  const updatePref = useCallback((key, value) => {
    setPrefs((prev) => ({
      ...prev,
      [key]: typeof value === "function" ? value(prev[key]) : value,
    }));
  }, []);

  const togglePref = useCallback((key) => {
    setPrefs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }, []);

  const value = {
    isOpen,
    setIsOpen,
    toggleOpen,
    close,
    open,
    prefs,
    updatePref,
    togglePref,
  };

  return (
    <ControlCenterContext.Provider value={value}>
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
      prefs: DEFAULT_PREFS,
      updatePref: () => {},
      togglePref: () => {},
    };
  }
  return context;
}
