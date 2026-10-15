import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Grainient from "./tempbg/Grainient";
import TechText from "./TechText";
import TextType from "./TextType";
import Dock from "./Dock";
import MusicPlayer from "../music/MusicPlayer";
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
    colors: ["#001694", "#12429a", "#0094ff", "#00daff", "#91f9ff"],
    angle: 180,
  },
  Interests: {
    colors: ["#022c22", "#064e3b", "#0d9488", "#10b981", "#6ee7b7"],
    angle: 180,
  },
  Music: {
    colors: ["#1e0836", "#3b0764", "#7c3aed", "#d946ef", "#f472b6"],
    angle: 180,
  },
  Projects: {
    colors: ["#2a0d00", "#7c2d12", "#c2410c", "#f97316", "#fbbf24"],
    angle: 180,
  },
  Contact: {
    colors: ["black", "black", "grey", "grey", "white"],
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

  const items = [
    {
      icon: glyph(User02Icon),
      label: "Profile",
      active: activeTab === "Profile",
      onClick: () => {
        setActiveTab("Profile");
        setIsMusicOpen(false);
      },
      menu: [
        { label: "New Window", onClick: () => console.log("New Window") },
        { separator: true },
        {
          label: "Options",
          items: [
            { label: "Open at Login", checked: true },
            { label: "Show in Finder" },
          ],
        },
        { separator: true },
        { label: "Quit", onClick: () => console.log("Quit") },
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
        window.open("/resume", "_blank");
      },
    },
    {
      icon: glyph(AtSignIcon),
      label: "Contact",
      active: activeTab === "Contact",
      onClick: () => {
        setActiveTab("Contact");
        setIsMusicOpen(false);
      },
    },
  ];

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
        {/* Temporary Background (Grainient) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            zIndex: 0,
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
            paletteFollow={activeTab === "Music" && isMusicOpen ? 2.2 : 0.9}
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
        <AnimatePresence>
          {isMusicOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 30, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.88, y: 20, filter: "blur(8px)" }}
              transition={{
                type: "spring",
                stiffness: 380,
                damping: 26,
                mass: 0.7,
              }}
              className="absolute bottom-[147px] left-1/2 -translate-x-1/2 z-20 pointer-events-auto"
            >
              <MusicPlayer />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mid Bottom Dock */}
        <Dock
          items={items}
          theme="light"
          baseItemSize={50}
          magnification={80}
          panelHeight={70}
          accentColor="#0a84ff"
          badgeColor="#fff"
          position="bottom"
          distance={230}
          gap={10}
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
