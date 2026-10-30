import React, { memo } from "react";
import { X, Command } from "lucide-react";

const SHORTCUTS = [
  { key: "⌘ K", desc: "Open Spotlight Search" },
  { key: "Space", desc: "Play / Pause Music" },
  { key: "← / →", desc: "Previous / Next Track" },
  { key: "Esc", desc: "Close Modals" },
];

function ShortcutsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl bg-zinc-900/90 border border-white/15 p-4 text-white shadow-2xl backdrop-blur-xl"
      >
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10">
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <Command size={13} />
            <span>Keyboard Shortcuts</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-5 h-5 rounded-full hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white"
          >
            <X size={12} />
          </button>
        </div>

        <div className="space-y-2">
          {SHORTCUTS.map((s, i) => (
            <div
              key={i}
              className="flex items-center justify-between text-xs py-1"
            >
              <span className="text-white/60">{s.desc}</span>
              <kbd className="px-2 py-0.5 rounded bg-white/10 border border-white/15 font-mono text-[11px] text-white/90">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default memo(ShortcutsModal);
