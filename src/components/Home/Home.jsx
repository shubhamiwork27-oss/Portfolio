"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "motion/react";
import Grainient from "./tempbg/Grainient";
import Dock from "./Dock";
import MusicPlayer from "../music/MusicPlayer";
import ProfilePanel from "./Profile/ProfilePanel";
import MenuBar from "./Profile/MenuBar";
import Contact from "../Contact/Contact";
import Projects from "../Projects/page";
import Interests from "../Interest/Interests";
import { MusicProvider } from "../../context/MusicContext";
import { ControlCenterProvider, useControlCenter } from "../../context/ControlCenterContext";
import ControlCenter from "./ControlCenter/ControlCenter";
import ReactBitsLoader from "./ReactBitsLoader";
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
     colors: ["black", "black", "black", "black","#011e4d" ,"#0b5ee3"],
    angle: 180,
  },
  Gallery: {
    colors: ["black", "black", "black", "white","#091540","#00054A"],
    angle: 180,
  },
  Projects: {
    colors: ["black","#011e4d", "#315f73", "#ffd069", "#f0992f", "#be185d"],
    angle: 180,
  },
  Contact: {
    colors: ["black", "#091540", "#0446b0", "#0b5ee3", "#4dc1ff"],
    angle: 180,
  },
};

const LIGHT_GRADIENTS = {
  Profile: {
    colors: ["#ffffff", "#f8fafc", "#f1f5f9", "#e2e8f0", "#bfdbfe", "#3b82f6"],
    angle: 180,
  },
  Gallery: {
    colors: ["#ffffff", "#f8fafc", "#f1f5f9", "#e2e8f0", "#cbd5e1", "#64748b"],
    angle: 180,
  },
  Projects: {
    colors: ["#ffffff", "#fffbeb", "#fef3c7", "#fed7aa", "#fbcfe8", "#818cf8"],
    angle: 180,
  },
  Contact: {
    colors: ["#ffffff", "#f0f9ff", "#e0f2fe", "#bae6fd", "#7dd3fc", "#0284c7"],
    angle: 180,
  },
};

const MUSIC_GRADIENT_PALETTES = [
  {colors: ["black", "black", "black", "black ","#d2d2d2","#0446b0"], angle: 180 },
  {colors:  ["black", "black", "black","black ", "#d2d2d2","#315f73"],angle: 180 },
  {colors: ["black", "black", "black", "black ","#d2d2d2","#011e4d"], angle: 180 },
  {colors:  ["black", "black", "black","black ", "#d2d2d2","#0b5ee3"],angle: 180 },
  {colors:  ["black", "black", "black","black ", "#d2d2d2","#4dc1ff"],angle: 180 },
];

const LIGHT_MUSIC_GRADIENT_PALETTES = [
  { colors: ["#ffffff", "#f8fafc", "#e0f2fe", "#bae6fd", "#38bdf8"], angle: 180 },
  { colors: ["#ffffff", "#f8fafc", "#e0e7ff", "#c7d2fe", "#818cf8"], angle: 180 },
  { colors: ["#ffffff", "#f8fafc", "#fce7f3", "#fbcfe8", "#f472b6"], angle: 180 },
  { colors: ["#ffffff", "#f8fafc", "#fef3c7", "#fde68a", "#fbbf24"], angle: 180 },
  { colors: ["#ffffff", "#f8fafc", "#d1fae5", "#a7f3d0", "#34d399"], angle: 180 },
];

const WINDOW_TABS = ["Profile", "Music", "Projects", "Contact", "Gallery", "Interests"];
const EASE = [0.22, 1, 0.36, 1];

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
      initial={{
        opacity: open ? 1 : 0,
        scale: open ? 1 : scale,
        y: open ? 0 : enterY,
        visibility: open ? "visible" : "hidden",
      }}
      animate={
        open
          ? {
              opacity: 1,
              scale: 1,
              y: 0,
              pointerEvents: "auto",
              visibility: "visible",
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
  "absolute inset-0 z-20 flex items-center justify-center pointer-events-none overflow-hidden";

function HomeContent() {
  const { prefs } = useControlCenter();
  const [activeTab, setActiveTab] = useState("Profile");
  const [musicPaletteIndex, setMusicPaletteIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [dockIconSize, setDockIconSize] = useState(48);

  const [mounted, setMounted] = useState({ Profile: true });
  const isMusicOpen = activeTab === "Music";

  // Responsive mobile and dock icon sizing: clamp(44px, 5.6vh, 58px)
  useEffect(() => {
    const handleResize = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      setIsMobile(vw < 640);
      const size = Math.round(Math.min(58, Math.max(44, vh * 0.056)));
      setDockIconSize(size);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (WINDOW_TABS.includes(activeTab) && !mounted[activeTab]) {
      setMounted((m) => ({ ...m, [activeTab]: true }));
    }
  }, [activeTab, mounted]);

  const isLight = prefs?.theme === "light";
  const activePalettes = isLight ? LIGHT_GRADIENTS : GRADIENTS;
  const musicPalettes = isLight ? LIGHT_MUSIC_GRADIENT_PALETTES : MUSIC_GRADIENT_PALETTES;

  useEffect(() => {
    if (!isMusicOpen || prefs?.lowDataMode) return;
    const id = setInterval(() => {
      setMusicPaletteIndex((prev) => (prev + 1) % musicPalettes.length);
    }, 4500);
    return () => clearInterval(id);
  }, [isMusicOpen, musicPaletteIndex, prefs?.lowDataMode, musicPalettes.length]);

  const currentGradient = isMusicOpen
    ? musicPalettes[musicPaletteIndex % musicPalettes.length]
    : activePalettes[activeTab] || activePalettes.Profile;

  const toggleTab = useCallback((tab) => {
    setActiveTab((prev) => (prev === tab ? "Profile" : tab));
  }, []);

  const openExternal = useCallback((url) => {
    setActiveTab((prev) =>
      prev === "Contact" || prev === "Interests" || prev === "Projects" || prev === "Gallery"
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
        // The Profile dock icon stays active (blue dot) and does nothing when clicked
        onClick: () => {
          if (activeTab !== "Profile") setActiveTab("Profile");
        },
      },
      {
        icon: glyph(MountainSnowIcon),
        label: "Gallery",
        active: activeTab === "Gallery" || activeTab === "Interests",
        onClick: () => toggleTab("Gallery"),
      },
      {
        icon: glyph(MusicNote03Icon),
        label: "Music",
        active: isMusicOpen,
        onClick: () => {
          if (isMusicOpen) {
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
        label: "Email",
        active: activeTab === "Contact" || activeTab === "Email",
        onClick: () => toggleTab("Contact"),
      },
    ],
    [activeTab, isMusicOpen, toggleTab, openExternal]
  );

  return (
    <>
      {/* React Bits Initial Website Loader */}
      <ReactBitsLoader minDuration={1800} />

      <div
        style={{
          width: "100vw",
          height: "100dvh",
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#000000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: isMobile ? "0" : "2vh 1.2vw",
          boxSizing: "border-box",
        }}
      >
        {/* ===================================================================
            Inner Desktop Viewport: Exactly 5% gap from the physical screen edges,
            centered, with rounded border radius, 1px border & deep shadow
            =================================================================== */}
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            borderRadius: isMobile ? "0" : "clamp(20px, 2.5vw, 26px)",
            overflow: "hidden",
            isolation: "isolate",
            display: "flex",
            flexDirection: "column",
            border: isMobile ? "none" : "2px solid rgba(255, 255, 255, 0.20)",
          }}
        >
        {/* Full-screen background grain/gradient layer covering entire container including dock */}
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
            softness={prefs.performanceMode ? 4 : 8}
            flow={prefs.performanceMode ? 0.1 : 0.5}
            scale={1}
            speed={prefs.performanceMode ? 0.3 : 2}
            paletteFollow={isMusicOpen ? 2.0 : 1.3}
            silk={prefs.performanceMode ? 0.2 : 0.63}
            grainAmount={prefs.performanceMode ? 0.02 : 0.08}
            grainSize={0.5}
            contrast={1}
            saturation={1.03}
            variation={0}
            stir={prefs.performanceMode ? 0.4 : 1.6}
            grainAnimated={!prefs.performanceMode}
            interactive={!prefs.performanceMode}
            clickSwirl={!prefs.performanceMode}
            intro
            lightMode={false}
          />
        </div>


        {/* a) MenuBar: 28px, full width, not scaled */}
        <MenuBar
          onOpenSpotlight={() => {
            const event = new KeyboardEvent("keydown", {
              key: "k",
              metaKey: true,
              bubbles: true,
            });
            window.dispatchEvent(event);
          }}
          onNavigateTab={(tab) => {
            if (tab === "Music") {
              setActiveTab("Music");
            } else {
              toggleTab(tab);
            }
          }}
        />

        {/* macOS Control Center Drawer / Floating Panel */}
        <ControlCenter />

        {/* b) Main Area: flex 1, min-height 0, position relative */}
        <main className="relative flex-1 min-h-0 w-full overflow-hidden z-20">
          {/* Profile Panel PopWindow */}
          {mounted.Profile && (
            <PopWindow
              open={activeTab === "Profile"}
              className={WINDOW_AREA}
              scale={0.98}
              enterY={12}
              exitY={-10}
            >
              <div className="pointer-events-auto w-full h-full">
                <ProfilePanel
                  isOpen={activeTab === "Profile"}
                  onNavigateTab={(tab) => {
                    if (tab === "Music") {
                      setActiveTab("Music");
                    } else {
                      toggleTab(tab);
                    }
                  }}
                />
              </div>
            </PopWindow>
          )}

          {/* Music Player */}
          {mounted.Music && (
            <PopWindow open={isMusicOpen} className={WINDOW_AREA} scale={0.94} enterY={20}>
              <div className="pointer-events-auto w-full max-w-5xl lg:max-w-6xl xl:max-w-7xl 2xl:max-w-[1440px] flex items-center justify-center p-4">
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

          {/* Gallery / Interests (OrbitImages) */}
          {(mounted.Gallery || mounted.Interests) && (
            <PopWindow
              open={activeTab === "Gallery" || activeTab === "Interests"}
              className={WINDOW_AREA}
              scale={0.96}
              enterY={16}
              exitY={-12}
            >
              <div className="pointer-events-auto w-full h-full flex items-center justify-center">
                <Interests isOpen={activeTab === "Gallery" || activeTab === "Interests"} />
              </div>
            </PopWindow>
          )}
        </main>

        {/* c) Dock Zone */}
        <footer className="h-[clamp(64px,9vh,90px)] shrink-0 w-full relative z-30 flex items-center justify-center">
          <Dock
            className="z-30"
            items={items}
            theme="light"
            baseItemSize={isMobile ? 28 : dockIconSize}
            magnification={isMobile ? 32 : 80}
            panelHeight={isMobile ? 42 : Math.round(dockIconSize * 1.35)}
            accentColor="#fff"
            badgeColor="#fff"
            position="bottom"
            distance={isMobile ? 60 : 160}
            gap={isMobile ? 3 : 10}
            roundness={0.7}
            bounce={!isMobile}
            autoHide={false}
            tiles
            showLabels={!isMobile}
            showIndicators
            showBadges
          />
        </footer>
      </div>
    </div>
    </>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Home caught an unhandled error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full min-h-screen flex flex-col items-center justify-center p-6 text-center text-white bg-[#00012a]">
          <div className="p-6 max-w-md rounded-2xl bg-white/[0.08] border border-white/[0.15] backdrop-blur-xl">
            <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
            <p className="text-sm text-white/70 mb-4">
              {this.state.error?.message || "An unexpected error occurred."}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium text-sm transition-colors cursor-pointer"
            >
              Reload Portfolio
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function Home() {
  return (
    <ErrorBoundary>
      <ControlCenterProvider>
        <MusicProvider>
          <HomeContent />
        </MusicProvider>
      </ControlCenterProvider>
    </ErrorBoundary>
  );
}
