import React, { useRef, useState, useCallback, memo } from "react";
import { motion } from "motion/react";
import { Search, User } from "lucide-react";

// Bento Widgets
import HeroWidget from "./widgets/HeroWidget";
import AvailabilityWidget from "./widgets/AvailabilityWidget";
import NotesWidget from "./widgets/NotesWidget";
import StatsWidget from "./widgets/StatsWidget";
import NowPlayingWidget from "./widgets/NowPlayingWidget";
import TechStackWidget from "./widgets/TechStackWidget";
import GithubWidget from "./widgets/GithubWidget";
import CurrentlyBuildingWidget from "./widgets/CurrentlyBuildingWidget";

function ProfileWindow({ onNavigateTab, onOpenSpotlight }) {
  const panelRef = useRef(null);
  const [reflectionOffset, setReflectionOffset] = useState({ x: 0, y: 0 });

  // Parallax sheen shift with mouse movement (max 12px)
  const handleMouseMove = useCallback((e) => {
    if (!panelRef.current) return;
    const rect = panelRef.current.getBoundingClientRect();
    const xRatio = (e.clientX - rect.left) / rect.width - 0.5;
    const yRatio = (e.clientY - rect.top) / rect.height - 0.5;
    setReflectionOffset({
      x: xRatio * 24,
      y: yRatio * 24,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setReflectionOffset({ x: 0, y: 0 });
  }, []);

  // Entrance animation: 0.96 to 1 scale with fade, widgets stagger 50ms
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.97 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.05,
        delayChildren: 0.04,
      },
    },
  };

  const widgetVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <motion.div
      ref={panelRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative flex flex-col w-full h-full overflow-hidden select-none"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.06)",
        backdropFilter: "blur(40px) saturate(200%) brightness(1.1)",
        WebkitBackdropFilter: "blur(40px) saturate(200%) brightness(1.1)",
        border: "1px solid rgba(255, 255, 255, 0.16)",
        borderRadius: "28px",
        boxShadow: "none",
      }}
    >
      {/* Ambient Blue Light exclusively inside the left profile panel */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[28px] z-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 45% 40%, rgba(10, 132, 255, 0.26) 0%, rgba(11, 42, 91, 0.32) 55%, transparent 95%)",
          }}
        />
        <div
          className="ambient-orb-1 absolute top-[15%] left-[20%] w-[500px] h-[500px] rounded-full blur-[110px]"
          style={{ backgroundColor: "rgba(10, 132, 255, 0.24)", transform: "translate(-50%, -50%)" }}
        />
        <div
          className="ambient-orb-2 absolute bottom-[20%] right-[15%] w-[450px] h-[450px] rounded-full blur-[120px]"
          style={{ backgroundColor: "rgba(11, 42, 91, 0.36)", transform: "translate(50%, 50%)" }}
        />
      </div>

      {/* 1. Diagonal Specular Sheen (linear-gradient 115deg) with 12px max parallax */}
      <div
        className="pointer-events-none absolute -top-1/4 -left-1/4 w-[150%] h-[120%] transition-transform duration-200 ease-out z-0"
        style={{
          transform: `translate3d(${reflectionOffset.x}px, ${reflectionOffset.y}px, 0)`,
          background:
            "linear-gradient(115deg, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.04) 28%, transparent 45%)",
        }}
      />

      {/* 2. Faint 4% Noise Overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay z-0"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255, 255, 255, 0.8) 1px, transparent 1px)",
          backgroundSize: "4px 4px",
        }}
      />

      {/* 3. Panel Header: 40px tall, 1px bottom border rgba(255,255,255,0.08) */}
      <div className="relative z-10 w-full h-[40px] px-4 border-b border-white/[0.08] flex items-center justify-between shrink-0 bg-white/[0.02]">
        
        {/* Left: Small Person Glyph + 'Profile' (13px, semibold) */}
        <div className="flex items-center gap-2 text-white/90">
          <div className="w-5 h-5 rounded-full bg-white/[0.08] flex items-center justify-center text-[#0A84FF]">
            <User size={12} strokeWidth={2.2} />
          </div>
          <span className="text-[13px] font-semibold tracking-wide">
            Profile
          </span>
        </div>

        {/* Right: Spotlight Pill (26px high, with Cmd+K chip) */}
        <button
          type="button"
          onClick={onOpenSpotlight}
          className="h-[26px] px-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.12] text-white/70 shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
          title="Search Spotlight (⌘K)"
        >
          <Search size={11} className="text-[#0A84FF]" />
          <span className="text-[11px] font-medium hidden sm:inline text-white/75">
            Spotlight
          </span>
          <kbd className="text-[9px] font-mono text-white/50 bg-white/[0.08] px-1.5 py-0.5 rounded border border-white/[0.1] leading-none">
            ⌘K
          </kbd>
        </button>

      </div>

      {/* 4. Bento Grid: 12 Columns, 10px Gap, fixed row fractions (1.15fr 1.25fr 1.2fr) without scrolling */}
      <div className="relative z-10 flex-1 p-3 min-h-0 overflow-hidden">
        <div
          className="grid grid-cols-12 gap-2.5 w-full h-full min-h-0"
          style={{
            gridTemplateRows: "1.15fr 1.25fr 1.2fr",
          }}
        >
          {/* Row 1: Hero (8 cols) + Availability (4 cols) */}
          <motion.div variants={widgetVariants} className="col-span-8 h-full min-h-0">
            <HeroWidget onNavigateTab={onNavigateTab} />
          </motion.div>
          <motion.div variants={widgetVariants} className="col-span-4 h-full min-h-0">
            <AvailabilityWidget />
          </motion.div>

          {/* Row 2: Notes (4 cols) + Stats (4 cols) + Now Playing (4 cols) */}
          <motion.div variants={widgetVariants} className="col-span-4 h-full min-h-0">
            <NotesWidget />
          </motion.div>
          <motion.div variants={widgetVariants} className="col-span-4 h-full min-h-0">
            <StatsWidget />
          </motion.div>
          <motion.div variants={widgetVariants} className="col-span-4 h-full min-h-0">
            <NowPlayingWidget onNavigateTab={onNavigateTab} />
          </motion.div>

          {/* Row 3: Tech Stack (4 cols) + GitHub (4 cols) + Currently Building (4 cols) */}
          <motion.div variants={widgetVariants} className="col-span-4 h-full min-h-0">
            <TechStackWidget />
          </motion.div>
          <motion.div variants={widgetVariants} className="col-span-4 h-full min-h-0">
            <GithubWidget />
          </motion.div>
          <motion.div variants={widgetVariants} className="col-span-4 h-full min-h-0">
            <CurrentlyBuildingWidget />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default memo(ProfileWindow);
