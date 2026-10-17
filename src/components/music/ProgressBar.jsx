import React, { useRef, useState, useCallback, useEffect } from "react";

function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

export default function ProgressBar({
  currentTime = 0,
  duration = 0,
  onSeek,
  className = "",
}) {
  const barRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragProgress, setDragProgress] = useState(0);

  const effectiveProgress = isDragging
    ? dragProgress
    : duration > 0
    ? (currentTime / duration) * 100
    : 0;

  const calculateProgressFromEvent = useCallback((e) => {
    if (!barRef.current) return 0;
    const rect = barRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const offsetX = Math.max(0, Math.min(rect.width, clientX - rect.left));
    return (offsetX / rect.width) * 100;
  }, []);

  const handlePointerDown = (e) => {
    setIsDragging(true);
    const newProgress = calculateProgressFromEvent(e);
    setDragProgress(newProgress);

    const handlePointerMove = (moveEvent) => {
      const p = calculateProgressFromEvent(moveEvent);
      setDragProgress(p);
    };

    const handlePointerUp = (upEvent) => {
      setIsDragging(false);
      const finalProgress = calculateProgressFromEvent(upEvent);
      if (duration > 0 && onSeek) {
        onSeek((finalProgress / 100) * duration);
      }
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("touchend", handlePointerUp);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("touchmove", handlePointerMove);
    window.addEventListener("touchend", handlePointerUp);
  };

  const handleKeyDown = (e) => {
    if (!duration || !onSeek) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      onSeek(Math.min(duration, currentTime + 5));
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      onSeek(Math.max(0, currentTime - 5));
    }
  };

  const displayedCurrentTime = isDragging && duration > 0
    ? (dragProgress / 100) * duration
    : currentTime;

  return (
    <div
      className={`w-full flex items-center gap-2.5 px-3 select-none text-[11px] font-medium tracking-tight text-white/80 tabular-nums ${className}`}
    >
      <span className="w-8 text-right font-mono text-[10px] text-white/70">
        {formatTime(displayedCurrentTime)}
      </span>

      {/* Track bar container */}
      <div
        ref={barRef}
        role="slider"
        tabIndex={0}
        aria-label="Seek track position"
        aria-valuemin={0}
        aria-valuemax={duration || 100}
        aria-valuenow={Math.round(displayedCurrentTime)}
        aria-valuetext={`${formatTime(displayedCurrentTime)} of ${formatTime(duration)}`}
        onPointerDown={handlePointerDown}
        onKeyDown={handleKeyDown}
        className="group relative flex-1 h-3 flex items-center cursor-pointer focus:outline-none"
      >
        {/* Track groove */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.22)",
            boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.15)",
          }}
          className="relative w-full h-1.5 rounded-full overflow-hidden backdrop-blur-sm transition-all duration-200 group-hover:h-2"
        >
          {/* Progress fill */}
          <div
            style={{ width: `${Math.min(100, Math.max(0, effectiveProgress))}%` }}
            className="h-full bg-gradient-to-r from-white/80 to-white rounded-full transition-[width] duration-75"
          />
        </div>

        {/* Draggable thumb */}
        <div
          style={{ left: `${Math.min(100, Math.max(0, effectiveProgress))}%` }}
          className="absolute -translate-x-1/2 w-3 h-3 rounded-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.35)] opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-150 pointer-events-none"
        />
      </div>

      <span className="w-8 text-left font-mono text-[10px] text-white/70">
        {formatTime(duration)}
      </span>
    </div>
  );
}

