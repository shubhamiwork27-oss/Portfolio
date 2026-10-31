"use client";

import React, { useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "motion/react";

/**
 * React Bits - 9-Dot Lattice Animation
 * Micro-interaction 3x3 matrix of 9 glowing cells animating in a phased diagonal wave pattern
 */
const NineDotLoader = ({
  rows = 3,
  cols = 3,
  dotSize = 11,
  gap = 6,
  color = "#60a5fa",
  glowColor = "rgba(96, 165, 250, 0.85)",
  idleOpacity = 0.2,
  speed = 90,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const maxDist = rows + cols - 2;

  // Diagonal wave index calculation for 3x3 grid
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % (maxDist + 3));
    }, speed);
    return () => clearInterval(timer);
  }, [maxDist, speed]);

  const dots = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const dist = r + c;
      const isLit = activeStep === dist || activeStep === dist + 1;
      dots.push({ r, c, isLit, id: `${r}-${c}` });
    }
  }

  return (
    <div
      className="inline-grid items-center justify-center"
      style={{
        gridTemplateColumns: `repeat(${cols}, ${dotSize}px)`,
        gap: `${gap}px`,
      }}
      aria-hidden="true"
    >
      {dots.map(({ id, isLit }) => (
        <span
          key={id}
          style={{
            width: `${dotSize}px`,
            height: `${dotSize}px`,
            borderRadius: "50%",
            backgroundColor: color,
            opacity: isLit ? 1 : idleOpacity,
            transform: isLit ? "scale(1.2)" : "scale(0.85)",
            boxShadow: isLit ? `0 0 12px ${glowColor}` : "none",
            transition: "all 0.18s cubic-bezier(0.2, 0.8, 0.2, 1)",
          }}
        />
      ))}
    </div>
  );
};

/**
 * React Bits - Minimal Website Loader
 * Clean full-screen preloader displaying purely the 9-dot React Bits wave animation.
 */
function ReactBitsLoader({ minDuration = 1400, onComplete }) {
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDone(true);
      onComplete?.();
    }, minDuration);

    return () => clearTimeout(timer);
  }, [minDuration, onComplete]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          key="reactbits-preloader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 0.97,
            transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#00012a] select-none pointer-events-auto"
        >
          {/* Ambient background glow */}
          <div
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(11, 94, 227, 0.22) 0%, rgba(0, 1, 42, 0.95) 70%)",
            }}
          />

          {/* 9-dot React Bits animation */}
          <div className="relative z-10 flex items-center justify-center">
            <NineDotLoader
              rows={3}
              cols={3}
              dotSize={11}
              gap={6}
              color="#60a5fa"
              glowColor="rgba(96, 165, 250, 0.85)"
              idleOpacity={0.2}
              speed={90}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default memo(ReactBitsLoader);
