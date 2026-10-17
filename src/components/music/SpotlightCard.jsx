import React, { useRef, useState } from "react";

export default function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(255, 255, 255, 0.1)",
  style = {},
  ...props
}) {
  const divRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current || isFocused) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();

    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      tabIndex={0}
      style={{
        background: "#ffffff35",
        backdropFilter: "blur(20px) saturate(2)",
        WebkitBackdropFilter: "blur(20px) saturate(2)",
        boxShadow:
          "inset 0 0 0 1px #ffffff8c, inset 0 1px 0 rgba(255, 255, 255, 0.95), 0 20px 40px -20px rgba(24, 24, 27, 0.35)",
        ...style,
      }}
      className={`relative rounded-[28px] overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 transition-shadow duration-300 ${className}`}
      {...props}
    >
      {/* Interactive cursor spotlight layer */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 75%)`,
        }}
      />
      {/* Content wrapper */}
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
}
