import React, { useState, useEffect, useRef, memo } from "react";
import ProfileWindow from "./ProfileWindow";
import TiltedCard from "../../music/TiltedCard";
import SpotlightModal from "./SpotlightModal";
import "./ProfilePanel.css";

const BASE_HEIGHT = 640;
const PORTRAIT_WIDTH = 390;
const GAP = 20;

const ProfilePanel = ({ isOpen = true, onNavigateTab }) => {
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const containerRef = useRef(null);
  const [stageScale, setStageScale] = useState(1);
  const [leftWidth, setLeftWidth] = useState(920);
  const [stageWidth, setStageWidth] = useState(1320);

  // Global Cmd+K / Ctrl+K listener for macOS Spotlight
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSpotlightOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Compute stage width & left div width dynamically according to screen, and scale vertically to fit
  useEffect(() => {
    const updateDimensions = () => {
      if (!containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      if (!clientWidth || !clientHeight) return;

      const availW = Math.max(clientWidth - 32, 600);
      const availH = Math.max(clientHeight - 20, 400);

      // Height scaling to prevent vertical clipping on smaller viewports
      const scaleH = availH / BASE_HEIGHT;
      const effectiveScale = Math.min(Math.max(scaleH, 0.65), 1.0);

      // Available unscaled width inside the stage
      const unscaledAvailW = availW / effectiveScale;

      // Dynamically calculate left div width based on screen width:
      // Minimum 840px (increased from 790px), scaling up to 1180px on wider screens
      const calculatedLeftW = Math.round(
        Math.min(Math.max(unscaledAvailW - PORTRAIT_WIDTH - GAP, 840), 1180)
      );

      const calculatedStageW = calculatedLeftW + GAP + PORTRAIT_WIDTH;
      const scaleW = availW / calculatedStageW;

      const fitted = Math.min(scaleW, scaleH);
      setStageScale(Math.min(Math.max(fitted, 0.55), 1.0));
      setLeftWidth(calculatedLeftW);
      setStageWidth(calculatedStageW);
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    const ro = new ResizeObserver(updateDimensions);
    if (containerRef.current) ro.observe(containerRef.current);

    return () => {
      window.removeEventListener("resize", updateDimensions);
      ro.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden select-none"
    >
      {/* ===================================================================
          STAGE DIV: Absolutely centered, scales to fit without clipping
          =================================================================== */}
      <div
        className="absolute left-1/2 top-1/2 flex items-center justify-between gap-5 pointer-events-auto z-10"
        style={{
          width: `${stageWidth}px`,
          height: `${BASE_HEIGHT}px`,
          transform: `translate(-50%, -50%) scale(${stageScale})`,
          transformOrigin: "center center",
          willChange: "transform",
        }}
      >
        {/* 1. BIG GLASS PANEL (LEFT SIDE: DYNAMIC WIDTH ADJUSTED TO SCREEN) */}
        <div
          className="h-full flex items-center justify-center shrink-0 transition-[width] duration-150 ease-out"
          style={{ width: `${leftWidth}px` }}
        >
          <ProfileWindow
            onNavigateTab={onNavigateTab}
            onOpenSpotlight={() => setIsSpotlightOpen(true)}
          />
        </div>

        {/* 2. BLACK-AND-WHITE PORTRAIT (RIGHT SIDE: 380px x 580px, MATCHED HEIGHT) */}
        <div
          className="h-full flex flex-col items-center justify-center shrink-0 relative"
          style={{ width: `${PORTRAIT_WIDTH}px` }}
        >
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            <TiltedCard
              maxTilt={5}
              glare={true}
              scale={1.01}
              containerClassName="w-full h-full"
              className="w-full h-full rounded-[28px]"
            >
              <div className="profile-portrait-glass w-full h-full relative flex items-center justify-center rounded-[28px] p-2">
                <img
                  src="/profilephoto.png"
                  alt="Shubham Idnani - Black & White Portrait"
                  className="w-full h-full object-cover rounded-[22px] select-none pointer-events-none grayscale contrast-110"
                  draggable={false}
                />
              </div>
            </TiltedCard>

            {/* Faint Floor Reflection Beneath Portrait */}
            <div className="pointer-events-none absolute -bottom-14 w-[90%] h-12 overflow-hidden rounded-[28px] portrait-floor-reflection">
              <img
                src="/profilephoto.png"
                alt=""
                className="w-full h-full object-cover grayscale opacity-20"
                draggable={false}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Spotlight Search Modal (⌘K) */}
      <SpotlightModal
        isOpen={isSpotlightOpen}
        onClose={() => setIsSpotlightOpen(false)}
        onNavigateTab={onNavigateTab}
      />
    </div>
  );
};

export default memo(ProfilePanel);
