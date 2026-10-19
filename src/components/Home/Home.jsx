import React, { useState, useEffect, useMemo } from "react";
import { motion } from "motion/react";
import Grainient from "./tempbg/Grainient";
import Dock from "./Dock";
import MusicPlayer from "../music/MusicPlayer";
import Contact from "../Contact/Contact";
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
    colors: ["#011e4d","#012d73", "#0446b0", "#0b5ee3", "#4dc1ff"],
    angle: 180,
  },
  Interests: {
    colors: ["#022c22", "#064e3b", "#008f2b", "#10b926", "#83ff91"],
    angle: 180,
  },
  Music: {
    colors: ["#1e0836", "#3b0764", "#7c3aed", "#d946ef", "#f472b6"],
    angle: 180,
  },
  Projects: {
    colors: ["#011e4d", "#315f73", "#ffd069","#f0992f","#be185d"],
    angle: 180,
  },
  Contact: {
    colors: ["black", "#292929", "#424242", "#4d4c4c", "#696868","#c2c2c2"],
    angle: 180,
  },
};

const MUSIC_GRADIENT_PALETTES = [
  // 1. Signature Violet & Fuchsia (The iconic music palette)
  {
    colors: ["#1e0836", "#3b0764", "#7c3aed", "#d946ef", "#f472b6"],
    angle: 180,
  },
  // 2. Electric Orchid & Magenta
  {
    colors: ["#220638", "#581c87", "#9333ea", "#e879f9", "#fbcfe8"],
    angle: 180,
  },
  // 3. Velvet Twilight & Rose Coral
  {
    colors: ["#200524", "#6b21a8", "#a21caf", "#f43f5e", "#fda4af"],
    angle: 180,
  },
  // 4. Sunset Rose & Warm Glow
  {
    colors: ["#1f0528", "#5b0e45", "#be185d", "#fb7185", "#fde68a"],
    angle: 180,
  },
  // 5. Deep Nebula & Electric Iris
  {
    colors: ["#180838", "#43147a", "#6366f1", "#a855f7", "#fbcfe8"],
    angle: 180,
  },
  // 6. Midnight Ultramarine & Soft Lilac
  {
    colors: ["#110838", "#2e1065", "#4338ca", "#818cf8", "#e0e7ff"],
    angle: 180,
  },
  // 7. Cosmic Indigo & Neon Violet
  {
    colors: ["#170836", "#311042", "#4f46e5", "#c084fc", "#f472b6"],
    angle: 180,
  },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("Profile");
  const [isMusicOpen, setIsMusicOpen] = useState(false);
  const [musicPaletteIndex, setMusicPaletteIndex] = useState(0);

  // Lazy-mount flags so windows are mounted on first open and stay mounted (hidden when closed)
  const [hasMountedMusic, setHasMountedMusic] = useState(false);
  const [hasMountedContact, setHasMountedContact] = useState(false);

  // Animation active flags to toggle will-change only while animating
  const [isMusicAnimating, setIsMusicAnimating] = useState(false);
  const [isContactAnimating, setIsContactAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(typeof window !== "undefined" && window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMusicOpen && !hasMountedMusic) setHasMountedMusic(true);
  }, [isMusicOpen, hasMountedMusic]);

  useEffect(() => {
    if (activeTab === "Contact" && !hasMountedContact) setHasMountedContact(true);
  }, [activeTab, hasMountedContact]);

  // Animate and cycle gradient colors smoothly only while in Music mode
  useEffect(() => {
    if (activeTab !== "Music" || !isMusicOpen) return;

    const interval = setInterval(() => {
      setMusicPaletteIndex((prev) => (prev + 1) % MUSIC_GRADIENT_PALETTES.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [activeTab, isMusicOpen, musicPaletteIndex]);

  const currentGradient =
    activeTab === "Music" && isMusicOpen
      ? MUSIC_GRADIENT_PALETTES[musicPaletteIndex]
      : GRADIENTS[activeTab] || GRADIENTS.Profile;

  const items = useMemo(
    () => [
      {
        icon: glyph(User02Icon),
        label: "Profile",
        active: activeTab === "Profile",
        onClick: () => {
          setActiveTab("Profile");
          setIsMusicOpen(false);
        },
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
        onClick: () => {
          setActiveTab("Interests");
          setIsMusicOpen(false);
        },
      },
      {
        icon: glyph(MusicNote03Icon),
        label: "Music",
        active: activeTab === "Music" && isMusicOpen,
        onClick: () => {
          if (activeTab === "Music" && isMusicOpen) {
            // Clicking music button while active advances to next animated gradient color palette immediately
            setMusicPaletteIndex((prev) => (prev + 1) % MUSIC_GRADIENT_PALETTES.length);
          } else {
            setActiveTab("Music");
            setIsMusicOpen(true);
          }
        },
      },
      {
        icon: glyph(CodeFolderIcon),
        label: "Projects",
        active: activeTab === "Projects",
        onClick: () => {
          setActiveTab("Projects");
          setIsMusicOpen(false);
        },
      },
      {
        icon: glyph(Linkedin02Icon),
        label: "LinkedIn",
        onClick: () => {
          if (activeTab === "Contact") setActiveTab("Profile");
          window.open(
            "https://www.linkedin.com/in/shubhamidnani",
            "_blank",
            "noopener,noreferrer"
          );
        },
      },
      {
        icon: glyph(Github01Icon),
        label: "Github",
        onClick: () => {
          if (activeTab === "Contact") setActiveTab("Profile");
          window.open(
            "https://github.com/shubhamiwork27-oss",
            "_blank",
            "noopener,noreferrer"
          );
        },
      },
      {
        icon: glyph(GoogleDocIcon),
        label: "Resume",
        onClick: () => {
          if (activeTab === "Contact") setActiveTab("Profile");
          window.open("/resume", "_blank");
        },
      },
      {
        icon: glyph(AtSignIcon),
        label: "Contact",
        active: activeTab === "Contact",
        onClick: () => {
          setActiveTab((prev) => (prev === "Contact" ? "Profile" : "Contact"));
          setIsMusicOpen(false);
        },
      },
    ],
    [activeTab, isMusicOpen]
  );

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        padding: "clamp(10px, 1.5vw, 20px)",
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "Black",
        display: "flex",
      }}
    >
      {/* Inner container with border-radius and outer white border structure */}
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
        {/* Isolated static background layer */}
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
            paletteFollow={activeTab === "Music" && isMusicOpen ? 2.0 : 1.3}
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

        {/* Custom Hugeicons Music Player Pop-out */}
        {hasMountedMusic && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={
              isMusicOpen
                ? {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    pointerEvents: "auto",
                    transitionEnd: { visibility: "visible" },
                  }
                : {
                    opacity: 0,
                    scale: 0.94,
                    y: 14,
                    pointerEvents: "none",
                    transitionEnd: { visibility: "hidden" },
                  }
            }
            transition={{
              duration: 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
            onAnimationStart={() => setIsMusicAnimating(true)}
            onAnimationComplete={() => setIsMusicAnimating(false)}
            style={{
              willChange: isMusicAnimating ? "transform, opacity" : "auto",
              transform: "translateZ(0)",
              contain: "layout paint style",
            }}
            className="absolute inset-x-0 top-0 bottom-[88px] sm:bottom-[100px] md:bottom-[115px] lg:bottom-[120px] z-20 flex items-center justify-center pointer-events-none px-3 sm:px-6 lg:px-8 py-2 overflow-hidden"
          >
            <div className="pointer-events-auto w-full max-w-5xl lg:max-w-6xl xl:max-w-7xl 2xl:max-w-[1440px] flex items-center justify-center">
              <MusicPlayer isOpen={isMusicOpen} />
            </div>
          </motion.div>
        )}

        {/* Contact Pop-out */}
        {hasMountedContact && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 18 }}
            animate={
              activeTab === "Contact"
                ? {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    pointerEvents: "auto",
                    transitionEnd: { visibility: "visible" },
                  }
                : {
                    opacity: 0,
                    scale: 0.97,
                    y: -12,
                    pointerEvents: "none",
                    transitionEnd: { visibility: "hidden" },
                  }
            }
            transition={{
              duration: 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
            onAnimationStart={() => setIsContactAnimating(true)}
            onAnimationComplete={() => setIsContactAnimating(false)}
            style={{
              willChange: isContactAnimating ? "transform, opacity" : "auto",
              transform: "translateZ(0)",
              contain: "layout paint style",
            }}
            className="absolute inset-0 z-20 flex items-start md:items-center justify-center p-4 sm:p-8 md:p-12 pt-6 sm:pt-10 pb-28 sm:pb-32 pointer-events-none overflow-y-auto contact-scroll-area"
          >
            <div className="pointer-events-auto w-full flex justify-center my-auto">
              <Contact />
            </div>
          </motion.div>
        )}

        {/* Mid Bottom Dock */}
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
          showIndicators={true}
          showBadges
        />
      </div>
    </div>
  );
}
