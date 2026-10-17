import React, { useRef, useState } from "react";
import { motion, useSpring } from "motion/react";

export default function TiltedCard({
  children,
  className = "",
  maxTilt = 12,
  glare = true,
  scale = 1.02,
  style = {},
  ...props
}) {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const springConfig = { stiffness: 260, damping: 20 };
  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);
  const cardScale = useSpring(1, springConfig);

  const handleMouseMove = (e) => {
    if (!cardRef.current || prefersReducedMotion) return;

    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = (mouseX / width - 0.5) * 2; // -1 to 1
    const yPct = (mouseY / height - 0.5) * 2; // -1 to 1

    rotateX.set(-yPct * maxTilt);
    rotateY.set(xPct * maxTilt);
    cardScale.set(scale);

    setGlarePosition({
      x: (mouseX / width) * 100,
      y: (mouseY / height) * 100,
    });
  };

  const handleMouseEnter = () => {
    if (prefersReducedMotion) return;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
    cardScale.set(1);
  };

  return (
    <div
      style={{
        perspective: 900,
        transformStyle: "preserve-3d",
      }}
      className="inline-block"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        ref={cardRef}
        style={{
          rotateX,
          rotateY,
          scale: cardScale,
          transformStyle: "preserve-3d",
          ...style,
        }}
        className={`relative ${className}`}
        {...props}
      >
        {children}

        {glare && (
          <div
            className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300 z-30"
            style={{
              opacity: isHovered ? 0.35 : 0,
              background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 65%)`,
            }}
          />
        )}
      </motion.div>
    </div>
  );
}

