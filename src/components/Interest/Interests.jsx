import React, { memo, useState, useEffect } from "react";
import OrbitImages from "./OrbitImages";
import { Sparkles, Compass } from "lucide-react";

import image1 from "./data/image1.png";
import image2 from "./data/image2.png";
import image3 from "./data/image3.png";
import image4 from "./data/image4.png";
import image5 from "./data/image5.png";
import image6 from "./data/image6.png";
import image7 from "./data/image7.png";
import image8 from "./data/image8.png";


const resolveImageSrc = (img) => (typeof img === "string" ? img : img?.src || img);

// Dynamically glob all images in ./data/ with direct import fallback
const localImageModules = import.meta.glob("./data/*.{png,jpg,jpeg,webp,svg,avif}", {
  eager: true,
});

const globbedImages = Object.keys(localImageModules)
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  .map((key) => {
    const mod = localImageModules[key];
    const val = mod?.default || mod;
    return resolveImageSrc(val);
  });

export const DEFAULT_IMAGES =
  globbedImages.length > 0
    ? globbedImages
    : [
        resolveImageSrc(image1),
        resolveImageSrc(image2),
        resolveImageSrc(image3),
        resolveImageSrc(image4),
        resolveImageSrc(image5),
      ];

export const GALLERY_MOMENTS = DEFAULT_IMAGES.map((src, i) => ({
  id: `moment-${i + 1}`,
  src,
  title: `Moment ${i + 1}`,
  alt: `Orbiting moment ${i + 1}`,
}));

function Interests({ isOpen = true, images = DEFAULT_IMAGES }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isOpen) return null;


  const radiusX = isMobile ? 240 : 360;
  const radiusY = isMobile ? 80 : 85;
  const itemSize = isMobile ? 68 : 88;
  const itemRadius = isMobile ? 65 : 80;
  const hoverRadius = isMobile ? 16 : 20;
  const hoverScale = isMobile ? 1.2 : 1.25;
  const rotation = isMobile ? -6 : -8;

  return (
    <section
      className="relative w-full h-full flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden select-none"
      aria-label="Interests and inspirations"
      tabIndex={0}
    >
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[340px] sm:w-[700px] h-[220px] sm:h-[320px] rounded-full bg-indigo-500/[0.10] blur-3xl" />
      </div>

      {/* Main glass container */}
      <div
        className="
          relative w-full max-w-[96vw] sm:max-w-6xl lg:max-w-7xl 2xl:max-w-[1380px]
          h-[min(68vh,560px)]
          min-h-[360px] sm:min-h-[420px]
          max-h-[calc(100%-12px)] sm:max-h-[calc(100%-20px)]
          rounded-[20px] sm:rounded-[32px]
          flex flex-col overflow-hidden
          border border-white/[0.14]
          shadow-2xl backdrop-blur-xl
        "
        style={{
          background: "rgba(255,255,255,0.035)",
        }}
      >
        {/* HEADER */}
        <header className="h-9 sm:h-10 px-3.5 sm:px-6 shrink-0 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/[0.08] flex items-center justify-center text-white shrink-0">
              <Compass size={12} className="sm:w-[13px] sm:h-[13px]" />
            </div>
            <span className="text-[11px] sm:text-[13px] font-semibold tracking-wide text-white/90 truncate">
              Things That Keep Me Curious
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] text-white/40 font-mono shrink-0">
            <Sparkles size={11} />
            <span>{images.length.toString().padStart(2, "0")}</span>
          </div>
        </header>

        {/* ORBIT CANVAS */}
        <div className="relative flex-1 min-h-0 w-full flex items-center justify-center overflow-hidden px-2 sm:px-6 py-2 sm:py-3 z-10 touch-pan-y">
          <OrbitImages
            images={images}
            shape="ellipse"
            radiusX={radiusX}
            radiusY={radiusY}
            rotation={rotation}
            duration={30}
            itemSize={itemSize}
            depth={0.5}
            showPath
            width="100%"
            height="100%"
            centerContent={
              <h2 className="text-xl sm:text-3xl md:text-4xl font-mono font-bold tracking-tight text-white drop-shadow-md select-none">
                Interests
              </h2>
            }
            itemRadius={itemRadius}
            hoverRadius={hoverRadius}
            hoverScale={hoverScale}
            hoverSpeed={0.8}
            clickToFront={false}
          />
        </div>
      </div>
    </section>
  );
}

export default memo(Interests);
