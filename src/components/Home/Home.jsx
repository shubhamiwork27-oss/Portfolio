"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "motion/react";
import Grainient from "./tempbg/Grainient";
import Dock from "./Dock";
import MusicPlayer from "../music/MusicPlayer";
import Contact from "../Contact/Contact";
import Interests from "../Interest/Interests";
import Projects from "../Projects/page";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AtSignIcon,
  User02Icon,
  MountainSnowIcon,
  MusicNote03Icon,
  CodeFolderIcon,
  Linkedin02Icon,
  Github01Icon,
  GoogleDocIcon,
} from "@hugeicons/core-free-icons";

const glyph = (icon) => (
  <HugeiconsIcon icon={icon} size="1em" strokeWidth={1.8} />
);

const GRADIENTS = {
  Profile: {
    colors: ["#011e4d", "#012d73", "#0446b0", "#0b5ee3", "#4dc1ff"],
    angle: 180,
  },
  Interests: {
    colors: ["#00054A", "#3D137D", "#6A27D6", "#BB6DF2", "#EBD9FF"],
    angle: 180,
  },
  Projects: {
    colors: ["#011e4d", "#315f73", "#ffd069", "#f0992f", "#be185d"],
    angle: 180,
  },
  Contact: {
    colors: ["black", "#292929", "#424242", "#4d4c4c", "#696868", "#c2c2c2"],
    angle: 180,
  },
};

const MUSIC_GRADIENT_PALETTES = [
  // 1. Signature Violet & Fuchsia
  { colors: ["#1e0836", "#3b0764", "#7c3aed", "#d946ef", "#f472b6"], angle: 180 },
  // 2. Electric Orchid & Magenta
  { colors: ["#220638", "#581c87", "#9333ea", "#e879f9", "#fbcfe8"], angle: 180 },
  // 3. Velvet Twilight & Rose Coral
  { colors: ["#200524", "#6b21a8", "#a21caf", "#f43f5e", "#fda4af"], angle: 180 },
  // 4. Sunset Rose & Warm Glow
  { colors: ["#1f0528", "#5b0e45", "#be185d", "#fb7185", "#fde68a"], angle: 180 },
  // 5. Deep Nebula & Electric Iris
  { colors: ["#180838", "#43147a", "#6366f1", "#a855f7", "#fbcfe8"], angle: 180 },
  // 6. Midnight Ultramarine & Soft Lilac
  { colors: ["#110838", "#2e1065", "#4338ca", "#818cf8", "#e0e7ff"], angle: 180 },
  // 7. Cosmic Indigo & Neon Violet
  { colors: ["#170836", "#311042", "#4f46e5", "#c084fc", "#f472b6"], angle: 180 },
];

// Tabs that render a pop-out window (Profile is the empty home state)
const WINDOW_TABS = ["Music", "Interests", "Projects", "Contact"];

const EASE = [0.22, 1, 0.36, 1];

/**
 * Reusable animated pop-out window.
 * The "animating" state lives here, so toggling will-change no longer
 * re-renders the whole Home component (and the WebGL background with it).
 */
function PopWindow({
  open,
  className,
  scale = 0.95,
  enterY = 18,
  exitY = 14,
  children,
}) {
  const [animating, setAnimating] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale, y: enterY }}
      animate={
        open
          ? {
              opacity: 1,
              scale: 1,
              y: 0,
              pointerEvents: "auto",
              transitionEnd: { visibility: "visible" },
            }
          : {
              opacity: 0,
              scale,
              y: exitY,
              pointerEvents: "none",
              transitionEnd: { visibility: "hidden" },
            }
      }
      transition={{ duration: 0.45, ease: EASE }}
      onAnimationStart={() => setAnimating(true)}
      onAnimationComplete={() => setAnimating(false)}
      // NOTE: no static `transform: translateZ(0)` here — motion owns the
      // transform property (scale/y) and would overwrite it anyway.
      style={{
        willChange: animating ? "transform, opacity" : "auto",
        contain: "layout paint style",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const WINDOW_AREA =
  "absolute inset-x-0 top-0 bottom-[88px] sm:bottom-[100px] md:bottom-[115px] lg:bottom-[120px] z-20 flex items-center justify-center pointer-events-none px-3 sm:px-6 lg:px-8 py-2 overflow-hidden";

export default function Home() {
  const [activeTab, setActiveTab] = useState("Profile");
  const [musicPaletteIndex, setMusicPaletteIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Lazy-mount: a window mounts on first open and then stays mounted (hidden)
  const [mounted, setMounted] = useState({});

  // Derived — previously a separate state that always mirrored activeTab
  const isMusicOpen = activeTab === "Music";

  // Mobile detection via matchMedia (fires only when the breakpoint changes)
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (WINDOW_TABS.includes(activeTab) && !mounted[activeTab]) {
      setMounted((m) => ({ ...m, [activeTab]: true }));
    }
  }, [activeTab, mounted]);

  // Cycle the gradient palette only while Music is open.
  // musicPaletteIndex is a dependency on purpose: a manual click on the Music
  // dock icon restarts the timer so the palette doesn't change twice in a row.
  useEffect(() => {
    if (!isMusicOpen) return;
    const id = setInterval(() => {
      setMusicPaletteIndex((prev) => (prev + 1) % MUSIC_GRADIENT_PALETTES.length);
    }, 4500);
    return () => clearInterval(id);
  }, [isMusicOpen, musicPaletteIndex]);

  const currentGradient = isMusicOpen
    ? MUSIC_GRADIENT_PALETTES[musicPaletteIndex]
    : GRADIENTS[activeTab] || GRADIENTS.Profile;

  // Toggle a window tab on/off (back to Profile)
  const toggleTab = useCallback((tab) => {
    setActiveTab((prev) => (prev === tab ? "Profile" : tab));
  }, []);

  // Open an external link; close any non-music window first (original behaviour)
  const openExternal = useCallback((url) => {
    setActiveTab((prev) =>
      prev === "Contact" || prev === "Interests" || prev === "Projects"
        ? "Profile"
        : prev
    );
    window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  const items = useMemo(
    () => [
      {
        icon: glyph(User02Icon),
        label: "Profile",
        active: activeTab === "Profile",
        onClick: () => setActiveTab("Profile"),
        menu: [
          { label: "New Window" },
          { separator: true },
          {
            label: "Options",
            items: [
              { label: "Open at Login", checked: true },
              { label: "Show in Finder" },
            ],
          },
          { separator: true },
          { label: "Quit" },
        ],
      },
      {
        icon: glyph(MountainSnowIcon),
        label: "Interests",
        active: activeTab === "Interests",
        onClick: () => toggleTab("Interests"),
      },
      {
        icon: glyph(MusicNote03Icon),
        label: "Music",
        active: isMusicOpen,
        onClick: () => {
          if (isMusicOpen) {
            // Already open: jump to the next palette
            setMusicPaletteIndex((prev) => (prev + 1) % MUSIC_GRADIENT_PALETTES.length);
          } else {
            setActiveTab("Music");
          }
        },
      },
      {
        icon: glyph(CodeFolderIcon),
        label: "Projects",
        active: activeTab === "Projects",
        onClick: () => toggleTab("Projects"),
      },
      {
        icon: glyph(Linkedin02Icon),
        label: "LinkedIn",
        onClick: () => openExternal("https://www.linkedin.com/in/shubhamidnani"),
      },
      {
        icon: glyph(Github01Icon),
        label: "Github",
        onClick: () => openExternal("https://github.com/shubhamiwork27-oss"),
      },
      {
        icon: glyph(GoogleDocIcon),
        label: "Resume",
        onClick: () => openExternal("/resume"),
      },
      {
        icon: glyph(AtSignIcon),
        label: "Contact",
        active: activeTab === "Contact",
        onClick: () => toggleTab("Contact"),
      },
    ],
    [activeTab, isMusicOpen, toggleTab, openExternal]
  );

  return (
    <div
      style={{
        width: "100%",
        height: "100dvh", // 100vh is taller than the visible area on mobile browsers
        padding: "clamp(10px, 1.5vw, 20px)",
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "black",
        display: "flex",
      }}
    >
      {/* Inner container with rounded corners */}
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          borderRadius: "clamp(20px, 4.5vw, 45px)",
          overflow: "hidden",
          isolation: "isolate",
          transform: "translateZ(0)",
        }}
      >
        {/* Background layer */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            zIndex: 0,
            pointerEvents: "none",
            transform: "translateZ(0)",
            contain: "strict",
          }}
        >
          <Grainient
            colors={currentGradient.colors}
            type="linear"
            angle={currentGradient.angle}
            bands={1}
            softness={8}
            flow={0.5}
            scale={1}
            speed={2}
            paletteFollow={isMusicOpen ? 2.0 : 1.3}
            silk={0.63}
            grainAmount={0.08}
            grainSize={0.5}
            contrast={1}
            saturation={1.03}
            variation={0}
            stir={1.6}
            grainAnimated
            interactive
            clickSwirl
            intro
            lightMode={false}
          />
        </div>

        {/* Music Player */}
        {mounted.Music && (
          <PopWindow open={isMusicOpen} className={WINDOW_AREA} scale={0.94} enterY={20}>
            <div className="pointer-events-auto w-full max-w-5xl lg:max-w-6xl xl:max-w-7xl 2xl:max-w-[1440px] flex items-center justify-center">
              <MusicPlayer isOpen={isMusicOpen} />
            </div>
          </PopWindow>
        )}

        {/* Contact */}
        {mounted.Contact && (
          <PopWindow
            open={activeTab === "Contact"}
            className="absolute inset-0 z-20 flex items-start md:items-center justify-center p-4 sm:p-8 md:p-12 pt-6 sm:pt-10 pb-28 sm:pb-32 pointer-events-none overflow-y-auto contact-scroll-area"
            scale={0.97}
            exitY={-12}
          >
            <div className="pointer-events-auto w-full flex justify-center my-auto">
              <Contact />
            </div>
          </PopWindow>
        )}

        {/* Interests */}
        {mounted.Interests && (
          <PopWindow open={activeTab === "Interests"} className={WINDOW_AREA}>
            <div className="pointer-events-auto w-full h-full max-w-6xl xl:max-w-7xl 2xl:max-w-[1440px] flex items-center justify-center">
              <Interests isOpen={activeTab === "Interests"} />
            </div>
          </PopWindow>
        )}

        {/* Projects */}
        {mounted.Projects && (
          <PopWindow
            open={activeTab === "Projects"}
            className="absolute inset-0 z-10 pointer-events-none overflow-hidden"
            scale={1}
            enterY={0}
            exitY={0}
          >
            <div className="pointer-events-auto w-full h-full">
              <Projects isOpen={activeTab === "Projects"} />
            </div>
          </PopWindow>
        )}

        {/* Bottom dock */}
        <Dock
          className="z-30"
          items={items}
          theme="light"
          baseItemSize={isMobile ? 38 : 50}
          magnification={isMobile ? 50 : 80}
          panelHeight={isMobile ? 56 : 70}
          accentColor="#0a84ff"
          badgeColor="#fff"
          position="bottom"
          distance={isMobile ? 110 : 160}
          gap={isMobile ? 6 : 10}
          roundness={0.7}
          bounce
          autoHide={false}
          tiles
          showLabels
          showIndicators
          showBadges
        />
      </div>
    </div>
  );
}