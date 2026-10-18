import React, { useRef, useState, useCallback } from "react";
import { motion } from "motion/react";

export default function StarBorder({
  as: Component = "button",
  className = "",
  color = "rgba(255, 255, 255, 0.9)",
  speed = "5s",
  children,
  onClick,
  ...props
}) {
  const [isHovered, setIsHovered] = useState(false);
  const btnRef = useRef(null);
  const glareRef = useRef(null);
  const rectRef = useRef(null);

  const updateRect = useCallback(() => {
    if (btnRef.current) {
      rectRef.current = btnRef.current.getBoundingClientRect();
    }
  }, []);

  const handleMouseMove = (e) => {
    if (!btnRef.current) return;
    if (!rectRef.current) updateRect();
    if (!rectRef.current || !glareRef.current) return;

    const x = ((e.clientX - rectRef.current.left) / rectRef.current.width) * 100;
    const y = ((e.clientY - rectRef.current.top) / rectRef.current.height) * 100;
    glareRef.current.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(255, 255, 255, 0.8) 0%, transparent 60%)`;
  };

  const handleMouseEnter = () => {
    updateRect();
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    rectRef.current = null;
    setIsHovered(false);
  };

  return (
    <Component
      ref={btnRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(246,246,248,0.85) 100%)",
        boxShadow:
          "inset 0 0 0 1px rgba(24, 24, 27, 0.08), inset 0 1px 0 rgba(255, 255, 255, 1), 0 8px 20px -6px rgba(24, 24, 27, 0.25)",
      }}
      className={`relative inline-flex items-center justify-center overflow-hidden rounded-full font-medium text-zinc-900 transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/80 ${className}`}
      {...props}
    >
      {/* Glare hover overlay */}
      <div
        ref={glareRef}
        className="pointer-events-none absolute inset-0 rounded-full transition-opacity duration-300"
        style={{
          opacity: isHovered ? 0.6 : 0,
          background: `radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.8) 0%, transparent 60%)`,
        }}
      />

      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </Component>
  );
}

