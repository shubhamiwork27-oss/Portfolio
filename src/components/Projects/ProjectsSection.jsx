import React, { memo } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CodeFolderIcon,
  Github01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import AnimatedContent from "../Home/AnimatedContent";

const PROJECTS = [
  {
    id: "moodify",
    title: "Moodify",
    category: "Full Stack MERN • AI Music Detection",
    description:
      "End-to-end full-stack web application featuring AI-powered mood detection (happy, sad, excited, neutral), tailored music recommendation playback, custom playlist creation, and interactive Three.js 3D animations.",
    tech: ["React.js", "Node.js", "Express.js", "MongoDB", "Three.js", "REST APIs"],
    github: "https://github.com/shubhamiwork27-oss",
    stats: "4 AI Mood Channels • Custom Playlists • 3D Visualizer",
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
  },
];

function ProjectsSection({ isOpen = true, onNavigateTab }) {
  const handleOpenExternal = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="w-full h-full max-w-6xl mx-auto px-4 sm:px-8 py-6 flex flex-col justify-center overflow-y-auto text-white pointer-events-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 pb-4 border-b border-white/10 shrink-0">
        <div>
          <span className="text-[11px] font-semibold tracking-[0.2em] text-zinc-400 uppercase">
            SELECTED PROJECTS
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
            Featured Work &amp; Case Studies
          </h2>
        </div>
        <p className="text-xs text-zinc-400 max-w-xs font-normal">
          Scalable web applications built with modern frameworks, thoughtful motion and clean architecture.
        </p>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 w-full">
        {PROJECTS.map((project, idx) => (
          <AnimatedContent
            key={project.id}
            delay={idx * 80}
            distance={16}
            direction="vertical"
            className="h-full"
          >
            <div className="group relative flex flex-col justify-between h-full p-5 sm:p-6 rounded-[24px] bg-[#0d0d10]/80 border border-white/10 hover:border-white/30 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:shadow-black/60">
              
              {/* Top Meta */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase">
                    0{idx + 1} // {project.id}
                  </span>
                  <div className="w-2 h-2 rounded-full bg-zinc-600 group-hover:bg-[#0a84ff] transition-colors" />
                </div>

                <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-zinc-100 transition-colors">
                  {project.title}
                </h3>
                <p className="text-[11px] font-medium text-zinc-400 mt-1 mb-3">
                  {project.category}
                </p>

                <p className="text-xs text-zinc-300/80 leading-relaxed line-clamp-4">
                  {project.description}
                </p>
              </div>

              {/* Bottom Tech Tags & Links */}
              <div className="mt-5 pt-4 border-t border-white/[0.08]">
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/[0.04] text-zinc-400 border border-white/[0.06]"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => handleOpenExternal(project.github)}
                    className="inline-flex items-center gap-1.5 text-xs text-white/90 hover:text-white font-medium hover:underline underline-offset-4 cursor-pointer"
                  >
                    <HugeiconsIcon icon={Github01Icon} size={14} />
                    <span>View Repository</span>
                  </button>

                  <span className="text-zinc-600 group-hover:text-white transition-colors duration-200">
                    <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
                  </span>
                </div>
              </div>

            </div>
          </AnimatedContent>
        ))}
      </div>

    </div>
  );
}

export default memo(ProjectsSection);

