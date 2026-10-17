import React from "react";
import { motion } from "motion/react";

export default function Silk({ className = "", isPlaying = false }) {
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    return (
      <div
        className={`absolute -inset-4 rounded-[48px] bg-gradient-to-tr from-purple-500/20 via-pink-500/20 to-indigo-500/20 blur-2xl pointer-events-none opacity-40 ${className}`}
      />
    );
  }

  return (
    <div
      className={`absolute -inset-6 rounded-[52px] pointer-events-none overflow-hidden blur-2xl opacity-45 transition-opacity duration-1000 ${
        isPlaying ? "opacity-60" : "opacity-30"
      } ${className}`}
    >
      <motion.div
        animate={{
          scale: isPlaying ? [1, 1.15, 1.05, 1.18, 1] : 1,
          rotate: isPlaying ? [0, 90, 180, 270, 360] : 0,
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear",
        }}
        className="w-full h-full bg-gradient-to-r from-violet-600/35 via-fuchsia-500/30 to-pink-500/35 rounded-full filter blur-xl"
      />
    </div>
  );
}

