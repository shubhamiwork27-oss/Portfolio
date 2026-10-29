import React, { memo } from "react";
import GlassWidgetCard from "./GlassWidgetCard";
import { Sliders } from "lucide-react";

// Authentic Brand SVG Icons
const BRAND_ICONS = {
  React: {
    color: "#61DAFB",
    svg: (
      <svg viewBox="-11.5 -10.23174 23 20.46348" className="w-3.5 h-3.5 fill-current">
        <circle cx="0" cy="0" r="2.05" />
        <g stroke="currentColor" strokeWidth="1" fill="none">
          <ellipse rx="11" ry="4.2" />
          <ellipse rx="11" ry="4.2" transform="rotate(60)" />
          <ellipse rx="11" ry="4.2" transform="rotate(120)" />
        </g>
      </svg>
    ),
  },
  Node: {
    color: "#5FA04E",
    svg: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
        <path d="M12 2L3.5 6.9v9.8L12 21.6l8.5-4.9V6.9L12 2zm6.7 13.7L12 19.6l-6.7-3.9V8.3L12 4.4l6.7 3.9v7.4z" />
      </svg>
    ),
  },
  TS: {
    color: "#3178C6",
    svg: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
        <path d="M1.5 0h21A1.5 1.5 0 0 1 24 1.5v21a1.5 1.5 0 0 1-1.5 1.5h-21A1.5 1.5 0 0 1 0 22.5v-21A1.5 1.5 0 0 1 1.5 0zm10.7 13.9H9.4v6.8H7.1v-6.8H4.3V12h7.9v1.9zm3.8 6.9c1.9 0 3.2-.9 3.2-2.4 0-1.6-1.1-2.1-2.6-2.6-.9-.3-1.4-.6-1.4-1.1 0-.5.4-.9 1.2-.9.8 0 1.5.3 2 .8l1.2-1.4c-.8-.8-1.9-1.2-3.2-1.2-1.9 0-3.1 1-3.1 2.4 0 1.5 1 2.1 2.4 2.6.9.3 1.6.6 1.6 1.2 0 .5-.5.9-1.3.9-.9 0-1.8-.4-2.3-1.1L14 19.3c.7 1 1.8 1.5 2 1.5z" />
      </svg>
    ),
  },
  Tailwind: {
    color: "#06B6D4",
    svg: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
        <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" />
      </svg>
    ),
  },
  Mongo: {
    color: "#47A248",
    svg: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
        <path d="M17.193 9.555c-1.264-5.028-4.577-7.805-4.821-8.007a.62.62 0 0 0-.745 0c-.243.202-3.556 2.979-4.82 8.007-1.42 5.643.513 10.638 4.793 13.342.115.073.249.103.373.103.125 0 .258-.03.373-.103 4.28-2.704 6.213-7.699 4.847-13.342zm-5.193 11.75V2.834c1.884 1.77 4.148 5.485 3.518 9.99-.54 3.864-2.584 7.241-3.518 8.481z" />
      </svg>
    ),
  },
  Git: {
    color: "#F05032",
    svg: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
        <path d="M23.546 10.93L13.067.452a1.5 1.5 0 0 0-2.126 0L8.808 2.585l3.256 3.256a2.25 2.25 0 0 1 2.827 2.827l3.133 3.133a2.25 2.25 0 1 1-1.07 1.07l-2.92-2.92v4.83a2.25 2.25 0 1 1-1.5 0V9.897a2.25 2.25 0 0 1-1.22-2.956L7.058 3.685.454 10.29a1.5 1.5 0 0 0 0 2.126l10.479 10.478a1.5 1.5 0 0 0 2.126 0l10.487-10.486a1.5 1.5 0 0 0 0-2.126z" />
      </svg>
    ),
  },
  Figma: {
    color: "#F24E1E",
    svg: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
        <path d="M15.5 0H8.5C6.01 0 4 2.01 4 4.5S6.01 9 8.5 9h7c2.49 0 4.5-2.01 4.5-4.5S17.99 0 15.5 0zm0 9H8.5C6.01 9 4 11.01 4 13.5S6.01 18 8.5 18h7c2.49 0 4.5-2.01 4.5-4.5S17.99 9 15.5 9zm-7 9C6.01 18 4 20.01 4 22.5S6.01 27 8.5 27s4.5-2.01 4.5-4.5V18H8.5z" transform="scale(0.85) translate(2, 0)" />
      </svg>
    ),
  },
  "Next.js": {
    color: "#FFFFFF",
    svg: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
        <path d="M18.665 21.978a12 12 0 1 1 3.313-3.314l-9.043-11.66h-2.18v10h1.8v-7.23l7.61 9.204zm-1.865-9.978h1.8v-2h-1.8v2z" />
      </svg>
    ),
  },
};

const TECH_ITEMS = [
  { name: "React", label: "React" },
  { name: "Node", label: "Node" },
  { name: "TS", label: "TS" },
  { name: "Tailwind", label: "Tailwind" },
  { name: "Mongo", label: "Mongo" },
  { name: "Git", label: "Git" },
  { name: "Figma", label: "Figma" },
  { name: "Next.js", label: "Next.js" },
];

function TechStackWidget() {
  return (
    <GlassWidgetCard className="p-3 sm:p-3.5 flex flex-col justify-between h-full min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5 text-[10px] font-semibold tracking-wider uppercase text-white/50 whitespace-nowrap">
          <Sliders size={11} className="text-[#0A84FF]" />
          <span>TECH STACK</span>
        </div>
        <span className="text-[9px] text-white/40">8 Modules</span>
      </div>

      {/* 2 Rows x 4 Compact Tiles Grid (fits cleanly without 2nd row clipping) */}
      <div className="grid grid-cols-4 gap-1.5 my-auto">
        {TECH_ITEMS.map((item) => {
          const brand = BRAND_ICONS[item.name] || BRAND_ICONS.React;
          return (
            <div
              key={item.name}
              className="group/tile relative flex flex-col items-center justify-center p-1 py-1.5 rounded-lg
                bg-white/[0.04] hover:bg-white/[0.1]
                border border-white/[0.08] hover:border-white/[0.22]
                transition-all duration-200 cursor-default"
            >
              <div
                className="w-4 h-4 flex items-center justify-center text-white/80 transition-colors duration-200"
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = brand.color;
                  e.currentTarget.style.filter = `drop-shadow(0 0 5px ${brand.color}88)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "";
                  e.currentTarget.style.filter = "";
                }}
              >
                {brand.svg}
              </div>
              <span className="text-[8.5px] font-medium text-white/80 text-center leading-none mt-1 whitespace-nowrap">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="pt-1.5 border-t border-white/[0.08] flex items-center justify-between text-[9px] text-white/40 shrink-0">
        <span>Frameworks &amp; Tools</span>
        <span className="text-[#0A84FF]">Production Ready</span>
      </div>
    </GlassWidgetCard>
  );
}

export default memo(TechStackWidget);
