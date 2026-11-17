import React, { useState, useEffect, useRef, memo } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";

/**
 * React Bits - DecryptedText
 * Terminal decoding animation with random characters resolving into the text
 */
function DecryptedText({
  text = "",
  speed = 40,
  maxIterations = 10,
  sequential = true,
  revealDirection = "start",
  useOriginalCharsOnly = false,
  className = "",
  parentClassName = "",
  encryptedClassName = "text-[#0A84FF]/70 font-mono",
  animateOn = "view", // "view" | "hover"
}) {
  const [displayText, setDisplayText] = useState(text);
  const [isDecrypted, setIsDecrypted] = useState(false);
  const containerRef = useRef(null);
  const intervalRef = useRef(null);

  const startDecryption = () => {
    let iteration = 0;
    const length = text.length;
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText(() =>
        text
          .split("")
          .map((char, i) => {
            if (char === " " || char === "\n") return char;
            if (i < iteration) {
              return text[i];
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );

      if (iteration >= length) {
        clearInterval(intervalRef.current);
        setIsDecrypted(true);
      }
      iteration += 1 / (maxIterations / 10);
    }, speed);
  };

  useEffect(() => {
    if (animateOn === "view") {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            startDecryption();
            if (containerRef.current) observer.unobserve(containerRef.current);
          }
        },
        { threshold: 0.1 }
      );

      if (containerRef.current) observer.observe(containerRef.current);
      return () => {
        clearInterval(intervalRef.current);
        observer.disconnect();
      };
    } else {
      setDisplayText(text);
    }
  }, [text]);

  return (
    <span
      ref={containerRef}
      onMouseEnter={animateOn === "hover" ? startDecryption : undefined}
      className={`inline-block font-mono ${parentClassName}`}
    >
      <span className={isDecrypted ? className : encryptedClassName}>
        {displayText}
      </span>
    </span>
  );
}

export default memo(DecryptedText);

