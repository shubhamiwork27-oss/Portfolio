import React, { useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "motion/react";

/**
 * React Bits - RotatingText
 * Cycles through an array of strings with smooth vertical sliding/fade
 */
function RotatingText({
  texts = [],
  rotationInterval = 2800,
  staggerDuration = 0.02,
  className = "",
  transition = { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (texts.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % texts.length);
    }, rotationInterval);
    return () => clearInterval(interval);
  }, [texts.length, rotationInterval]);

  const currentText = texts[index] || "";

  return (
    <span className={`inline-flex items-center overflow-hidden h-[1.35em] ${className}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={transition}
          className="inline-block whitespace-nowrap"
        >
          {currentText}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default memo(RotatingText);

