import React, { memo, useMemo, useState, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Github01Icon,
  ArrowRight01Icon,
  SparklesIcon,
  LiveStreaming01Icon,
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

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
          <div className="flex flex-col justify-between h-full gap-1.5 sm:gap-3 pointer-events-auto">
            {/* Top Meta */}
            <div>
              <h3 className="text-base sm:text-2xl lg:text-3xl font-bold text-white tracking-tight leading-tight">
                {project.title}
              </h3>
              <p className="text-[10px] sm:text-[11px] font-semibold text-blue-200/90 mt-0.5 mb-1.5 sm:mb-2 tracking-wide">
                {project.category}
              </p>

              <p className="text-[11px] sm:text-[13px] text-white/80 leading-relaxed line-clamp-2 sm:line-clamp-4">
                {project.description}
              </p>
            </div>

            {/* Middle Stats — hidden on mobile */}
            {project.stats && (
              <div className="text-[11px] font-mono text-white/60 py-1.5 border-y border-white/[0.08] hidden sm:block">
                {project.stats}
              </div>
            )}

            {/* Bottom Tech Pills & Buttons */}
            <div>
              <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-2 sm:mb-3">
                {project.tech.slice(0, isMobile ? 3 : project.tech.length).map((t) => (
                  <span
                    key={t}
                    className="px-1.5 sm:px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-medium bg-white/[0.08] text-zinc-200 border border-white/[0.12]"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => handleOpenExternal(project.github, e)}
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl bg-white/12 hover:bg-white/22 border border-white/18 text-[10px] sm:text-xs text-white font-medium transition-all cursor-pointer"
                >
                  <HugeiconsIcon icon={Github01Icon} size={12} />
                  <span className="hidden sm:inline">View </span>
                  <span>Repo</span>
                  <HugeiconsIcon icon={ArrowRight01Icon} size={11} className="text-white/60" />
                </button>

                <button
                  type="button"
                  onClick={(e) => handleOpenExternal(project.github, e)}
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl bg-white/20 hover:bg-green-900 border border-green-500 text-[10px] sm:text-xs text-white font-medium transition-all cursor-pointer"
                >
                  <HugeiconsIcon icon={LiveStreaming01Icon} size={12} />
                  <span>Live</span>
                  <HugeiconsIcon icon={ArrowRight01Icon} size={11} className="text-white/60" />
                </button>
              </div>
            </div>
          </div>
        ),
      })),
    [isMobile]
  );

  return (
    <div className="w-full h-full max-w-[96vw] sm:max-w-5xl xl:max-w-6xl 2xl:max-w-[1240px] mx-auto px-2 sm:px-6 py-2 sm:py-6 flex flex-col justify-center text-white pointer-events-auto select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1.5 sm:gap-2 mb-2 sm:mb-5 pb-2 sm:pb-3 border-b border-white/10 shrink-0">
        <div>
          <h2 className="text-lg sm:text-2xl font-mono lg:text-3xl font-bold tracking-tight text-white mt-2 m-2">
            Featured Projects
          </h2>
        </div>
      </div>

      {/* Integrated Carousel */}
      <div
        className="w-full flex items-center justify-center min-h-0 flex-1"
        style={{ position: "relative" }}
      >
        <Carousel
          items={carouselItems}
          baseWidth={isMobile ? 380 : 1040}
          aspectRatio={isMobile ? 0.76 : 2.15}
          effect="fade"
          indicator="dots"
          frame={true}
          arrows={!isMobile}
          loop={false}
          autoplay={false}
          autoplayDelay={3000}
          pauseOnHover={false}
          theme="dark"
          radius={isMobile ? 20 : 32}
        />
      </div>
    </div>
  );
}

export default memo(ProjectsSection);
