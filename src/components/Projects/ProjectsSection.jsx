import React, { memo, useMemo } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Github01Icon,
  ArrowRight01Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";
import Carousel from "./Carousel";

export const PROJECTS = [
  {
    id: "moodify",
    title: "Moodify",
    category: "Full Stack MERN • AI Music Detection",
    description:
      "End-to-end full-stack web application featuring AI-powered mood detection (happy, sad, excited, neutral), tailored music recommendation playback, custom playlist creation, and interactive Three.js 3D animations.",
    tech: ["React.js", "Node.js", "Express.js", "MongoDB", "Three.js", "REST APIs"],
    github: "https://github.com/shubhamiwork27-oss",
    stats: "4 AI Mood Channels • Custom Playlists • 3D Visualizer",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "cineverse",
    title: "CineVerse",
    category: "Cinematic Media Portal • Frontend Architecture",
    description:
      "Curated cinematic exploration and streaming web experience offering dynamic film discovery, detailed media cataloguing, responsive interface design, and fluid filtering workflows.",
    tech: ["React.js", "JavaScript", "Tailwind CSS", "RESTful APIs", "Motion"],
    github: "https://github.com/shubhamiwork27-oss",
    stats: "Dynamic Media Catalog • Fluid Search • Responsive Layout",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "rajasthan-tourism",
    title: "Rajasthan Tourism",
    category: "Interactive Heritage Showcase",
    description:
      "Immersive cultural travel portal designed to showcase regional heritage, historical monuments, curated travel itineraries, and responsive visual galleries.",
    tech: ["React.js", "HTML5 & CSS3", "JavaScript", "UI/UX Design"],
    github: "https://github.com/shubhamiwork27-oss",
    stats: "Scenic Visual Galleries • Heritage Guides • Interactive Itinerary",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80",
  },
];

function ProjectsSection({ isOpen = true, onNavigateTab }) {
  const handleOpenExternal = (url, e) => {
    e?.stopPropagation();
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const carouselItems = useMemo(
    () =>
      PROJECTS.map((project, idx) => ({
        id: project.id,
        image: project.image,
        title: project.title,
        description: project.description,
        rightContent: (
          <div className="flex flex-col justify-between h-full gap-2 sm:gap-3 pointer-events-auto">
            {/* Top Meta */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider text-blue-300 bg-blue-500/15 border border-blue-400/25 uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                  0{idx + 1} // {project.id}
                </span>
                <span className="text-[10px] font-mono text-white/40">
                  {idx + 1} / {PROJECTS.length}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">
                {project.title}
              </h3>
              <p className="text-[11px] font-semibold text-blue-200/90 mt-0.5 mb-2 tracking-wide">
                {project.category}
              </p>

              <p className="text-xs sm:text-[13px] text-white/80 leading-relaxed line-clamp-3 sm:line-clamp-4">
                {project.description}
              </p>
            </div>

            {/* Middle Stats */}
            {project.stats && (
              <div className="text-[11px] font-mono text-white/60 py-1.5 border-y border-white/[0.08] hidden sm:block">
                {project.stats}
              </div>
            )}

            {/* Bottom Tech Pills & GitHub link */}
            <div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/[0.08] text-zinc-200 border border-white/[0.12]"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <button
                type="button"
                onClick={(e) => handleOpenExternal(project.github, e)}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/12 hover:bg-white/22 border border-white/18 text-xs text-white font-medium transition-all cursor-pointer hover:translate-x-0.5"
              >
                <HugeiconsIcon icon={Github01Icon} size={14} />
                <span>View Repository</span>
                <HugeiconsIcon icon={ArrowRight01Icon} size={12} className="text-white/60" />
              </button>
            </div>
          </div>
        ),
      })),
    []
  );

  return (
    <div className="w-full h-full max-w-[96vw] sm:max-w-5xl xl:max-w-6xl 2xl:max-w-[1240px] mx-auto px-2 sm:px-6 py-3 sm:py-6 flex flex-col justify-center text-white pointer-events-auto select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-3 sm:mb-5 pb-2.5 sm:pb-3 border-b border-white/10 shrink-0">
        <div>
          <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] text-zinc-400 uppercase flex items-center gap-1.5">
            <HugeiconsIcon icon={SparklesIcon} size={12} className="text-blue-400" />
            SELECTED PROJECTS
          </span>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white mt-0.5">
            Featured Work &amp; Case Studies
          </h2>
        </div>
        <p className="text-[11px] sm:text-xs text-zinc-400 max-w-xs font-normal hidden sm:block">
          Scalable web applications built with modern frameworks, thoughtful motion and clean architecture.
        </p>
      </div>

      {/* Integrated Carousel */}
      <div
        className="w-full flex items-center justify-center min-h-0"
        style={{ height: "min(540px, 68vh)", position: "relative" }}
      >
        <Carousel
          items={carouselItems}
          baseWidth={1040}
          aspectRatio={2.15}
          effect="fade"
          indicator="none"
          frame={true}
          arrows
          loop={false}
          autoplay={false}
          autoplayDelay={3000}
          pauseOnHover={false}
          theme="dark"
          radius={32}
        />
      </div>
    </div>
  );
}

export default memo(ProjectsSection);
