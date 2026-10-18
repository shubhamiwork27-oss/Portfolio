import React, { memo } from "react";
import { motion } from "motion/react";

const MAX_H = 22;

function EqualizerComponent({ isPlaying = false, barCount = 4, className = "" }) {
  const bars = [
    { min: 4, max: 18, duration: 0.65 },
    { min: 6, max: 22, duration: 0.5 },
    { min: 4, max: 14, duration: 0.8 },
    { min: 5, max: 20, duration: 0.6 },
  ];

  return (
    <div
      aria-label={isPlaying ? "Audio playing" : "Audio paused"}
      className={`flex items-end gap-[3px] h-5.5 px-1 py-0.5 select-none ${className}`}
    >
      {bars.slice(0, barCount).map((bar, i) => (
        <motion.span
          key={i}
          animate={
            isPlaying
              ? {
                  scaleY: [
                    bar.min / MAX_H,
                    bar.max / MAX_H,
                    (bar.min + 2) / MAX_H,
                    (bar.max - 3) / MAX_H,
                    bar.min / MAX_H,
                  ],
                }
              : {
                  scaleY: 4 / MAX_H,
                }
          }
          transition={
            isPlaying
              ? {
                  duration: bar.duration,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                  delay: i * 0.12,
                }
              : {
                  duration: 0.25,
                }
          }
          style={{
            transformOrigin: "bottom",
            willChange: isPlaying ? "transform" : "auto",
          }}
          className="w-1 h-[22px] bg-white/90 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.4)]"
        />
      ))}
    </div>
  );
}

export default memo(EqualizerComponent);

