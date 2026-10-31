import React, { useRef, useState, useCallback, memo } from "react";

/**
 * GlassWidgetCard
 * macOS Liquid Glass bento widget container:
 * - Lighter glass: rgba(255, 255, 255, 0.05) + 1px border rgba(255, 255, 255, 0.1)
 * - 20px radius, inner specular rim highlight
 * - Lift -2px on hover with 200ms ease-out transition
 * - Dynamic cursor-following spotlight glow
 */
function GlassWidgetCard({
  children,
  className = "",
  style = {},
  spotlightColor = "rgba(255, 255, 255, 0.08)",
  ...props
}) {
  const cardRef = useRef(null);
  const glowRef = useRef(null);
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = useCallback(
    (e) => {
      if (!cardRef.current || !glowRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      glowRef.current.style.background = `radial-gradient(220px circle at ${x}px ${y}px, ${spotlightColor}, transparent 70%)`;
    },
    [spotlightColor]
  );

  const handleMouseEnter = useCallback(() => {
    setOpacity(1);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setOpacity(0);
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group relative rounded-[20px] overflow-hidden select-none
        transition-all duration-200 ease-out
        hover:-translate-y-[2px]
        motion-reduce:hover:translate-y-0
        ${className}`}
      style={{
        backgroundColor: "rgba(255, 255, 255, var(--glass-bg-opacity, 0.05))",
        backdropFilter: "blur(var(--glass-blur, 20px))",
        WebkitBackdropFilter: "blur(var(--glass-blur, 20px))",
        border: "1px solid rgba(255, 255, 255, var(--glass-border-opacity, 0.1))",
        boxShadow:
          "inset 0 1px 0 rgba(255, 255, 255, 0.22), 0 10px 24px -6px rgba(0, 0, 0, 0.4)",
        ...style,
      }}
      {...props}
    >
      {/* Dynamic Cursor-follow glow layer */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute inset-0 transition-opacity duration-200 z-0"
        style={{ opacity }}
      />

      {/* Widget Content */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between">
        {children}
      </div>
    </div>
  );
}

export default memo(GlassWidgetCard);
