import React, { useEffect, useRef, useState, memo } from "react";

/**
 * React Bits - CountUp
 * Smoothly interpolates a number from 0 to target value on mount/view
 */
function CountUp({
  to = 0,
  from = 0,
  duration = 1.6,
  delay = 0,
  className = "",
  startWhen = true,
  separator = ",",
  suffix = "",
}) {
  const [count, setCount] = useState(from);
  const ref = useRef(null);

  useEffect(() => {
    if (!startWhen) return;
    let startTime = null;
    let animationFrameId = null;

    const timeout = setTimeout(() => {
      const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        // Ease-out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(from + (to - from) * easeOut);
        setCount(currentVal);

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(step);
        } else {
          setCount(to);
        }
      };
      animationFrameId = requestAnimationFrame(step);
    }, delay * 1000);

    return () => {
      clearTimeout(timeout);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [to, from, duration, delay, startWhen]);

  return (
    <span ref={ref} className={className}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export default memo(CountUp);

