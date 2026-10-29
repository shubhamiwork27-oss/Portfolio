import React, { useRef, useEffect, useState } from "react";
import { motion } from "motion/react";

export default function BlurText({
  text = "",
  delay = 50,
  className = "",
  animateBy = "words", // 'words' | 'letters'
  direction = "top", // 'top' | 'bottom'
  onAnimationComplete,
}) {
  const elements = animateBy === "words" ? text.split(" ") : text.split("");
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    setInView(true);
  }, []);

  const defaultFrom = {
    filter: "blur(12px)",
    opacity: 0,
    y: direction === "top" ? -18 : 18,
  };

  const defaultTo = {
    filter: "blur(0px)",
    opacity: 1,
    y: 0,
  };

  return (
    <span ref={ref} className={`inline-flex flex-wrap ${className}`}>
      {elements.map((el, i) => (
        <motion.span
          key={i}
          initial={defaultFrom}
          animate={inView ? defaultTo : defaultFrom}
          transition={{
            duration: 0.5,
            delay: (i * delay) / 1000,
            ease: [0.22, 1, 0.36, 1],
          }}
          onAnimationComplete={
            i === elements.length - 1 ? onAnimationComplete : undefined
          }
          className="inline-block"
          style={{ willChange: "transform, filter, opacity" }}
        >
          {el === " " ? "\u00A0" : el}
          {animateBy === "words" && i < elements.length - 1 && "\u00A0"}
        </motion.span>
      ))}
    </span>
  );
}
