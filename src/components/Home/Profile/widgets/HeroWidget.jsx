import React, { memo } from "react";
import GlassWidgetCard from "./GlassWidgetCard";
import BlurText from "../BlurText";
import RotatingText from "../reactbits/RotatingText";
import { PROFILE_CONFIG } from "../config";
import { MapPin, ArrowUpRight, FileDown } from "lucide-react";

function HeroWidget({ onNavigateTab }) {
  return (
    <GlassWidgetCard className="p-3.5 sm:p-4 flex flex-col justify-between h-full min-h-0">
      <div>
        {/* Top Eyebrow */}
        <div className="flex items-center gap-1.5 text-[10px] font-semibold tracking-wider uppercase text-white/50 mb-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.7)]" />
          <span>{PROFILE_CONFIG.eyebrow}</span>
        </div>

        {/* Name with BlurText */}
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white/95 leading-tight">
          <BlurText text={PROFILE_CONFIG.name} delay={30} />
        </h1>

        {/* Rotating Roles */}
        <div className="mt-0.5 text-xs sm:text-[13px] font-medium text-white/85 flex items-center gap-1.5">
          <span className="text-white text-xs">✦</span>
          <RotatingText
            texts={PROFILE_CONFIG.roles}
            className="text-white/90 font-medium"
            rotationInterval={2800}
          />
        </div>

        {/* Tagline: visible and legible without line-clamp clipping */}
        <p className="mt-1 text-[11px] text-white/65 leading-snug">
          {PROFILE_CONFIG.tagline}
        </p>
      </div>

      {/* Bottom controls & status */}
      <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between gap-2 mt-auto shrink-0">
        {/* Location & Status pills */}
        <div className="flex items-center gap-1.5">
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.1] text-[10px] text-white/70 whitespace-nowrap">
            <MapPin size={10} className="text-white/50" />
            <span>{PROFILE_CONFIG.location}</span>
          </div>

          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[10px] text-emerald-400 font-medium whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{PROFILE_CONFIG.status}</span>
          </div>
        </div>

        {/* Two macOS-style Action Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => onNavigateTab?.("Projects")}
            className="px-2.5 py-1 rounded-md bg-white hover:bg-white/90 active:scale-[0.97] text-zinc-950 text-[10.5px] font-semibold shadow-[0_2px_6px_rgba(255,255,255,0.25)] flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap"
          >
            <span>Projects</span>
            <ArrowUpRight size={11} />
          </button>

          <a
            href="/resume"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 rounded-md bg-white/[0.07] hover:bg-white/[0.14] active:scale-[0.97] border border-white/[0.12] text-white/85 text-[10.5px] font-medium flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap"
          >
            <span>Resume</span>
            <FileDown size={11} className="text-white/70" />
          </a>
        </div>
      </div>
    </GlassWidgetCard>
  );
}

export default memo(HeroWidget);
