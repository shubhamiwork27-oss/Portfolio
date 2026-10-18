import React, { useRef, useState, useCallback } from "react";

export default function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(255, 255, 255, 0.1)",
  style = {},
  ...props
}) {
  const divRef = useRef(null);
  const spotlightRef = useRef(null);
  const rectRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [opacity, setOpacity] = useState(0);

  const updateRect = useCallback(() => {
    if (divRef.current) {
      rectRef.current = divRef.current.getBoundingClientRect();
    }
  }, []);

  const handleMouseMove = (e) => {
    if (!divRef.current || isFocused) return;
    if (!rectRef.current) updateRect();
    if (!rectRef.current || !spotlightRef.current) return;

    const x = e.clientX - rectRef.current.left;
    const y = e.clientY - rectRef.current.top;
    spotlightRef.current.style.background = `radial-gradient(400px circle at ${x}px ${y}px, ${spotlightColor}, transparent 75%)`;
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
    updateRect();
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    rectRef.current = null;
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
        ref={spotlightRef}
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(400px circle at 0px 0px, ${spotlightColor}, transparent 75%)`,
        }}
      />
      {/* Content wrapper */}
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
}
