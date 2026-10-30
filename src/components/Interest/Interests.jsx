
import React, {
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import OrbitImages from "./OrbitImages";

import {
  Sparkles,
  Compass,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// ============================================
// INTEREST DATA
// ============================================

export const GALLERY_MOMENTS = [
  {
    id: "frontend",
    src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
    title: "Creative Development",
    tag: "React • JavaScript • Tailwind",
    alt: "Modern developer workspace with laptop",
    description: "Building scalable and interactive digital experiences.",
    category: "Development",
  },
  {
    id: "backend",
    src: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=900&q=80",
    title: "Full-Stack Systems",
    tag: "Node • Express • MongoDB",
    alt: "Programming code on a screen",
    description: "Exploring backend architecture, APIs and databases.",
    category: "Development",
  },
  {
    id: "java-dsa",
    src: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80",
    title: "Code & Logic",
    tag: "Java • DSA",
    alt: "Code displayed on a computer",
    description: "Understanding algorithms, problem solving and software engineering.",
    category: "Development",
  },
  {
    id: "generative-art",
    src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=80",
    title: "Shader Geometry",
    tag: "Generative Art",
    alt: "Abstract violet generative digital artwork",
    description: "Experimenting with procedural visuals and digital art.",
    category: "Creative Coding",
  },
  {
    id: "webgl",
    src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    title: "Beyond Dimensions",
    tag: "Three.js • WebGL",
    alt: "Immersive natural landscape",
    description: "Exploring immersive 3D worlds and real-time graphics.",
    category: "Creative Coding",
  },
  {
    id: "motion",
    src: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=900&q=80",
    title: "Motion Language",
    tag: "GSAP • Lenis",
    alt: "Colourful retro digital visual",
    description: "Creating meaningful animations and expressive interactions.",
    category: "Creative Coding",
  },
  {
    id: "ai",
    src: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=80",
    title: "Intelligent Interfaces",
    tag: "GenAI • RAG",
    alt: "Artificial intelligence visual",
    description: "Exploring AI-powered applications and intelligent user experiences.",
    category: "Technology",
  },
  {
    id: "music",
    src: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=900&q=80",
    title: "Analog Harmonics",
    tag: "Music Technology",
    alt: "Music production equipment",
    description: "Exploring sound design, music production and audio experiences.",
    category: "Music",
  },
  {
    id: "audio",
    src: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=900&q=80",
    title: "Frequency & Rhythm",
    tag: "Audio Visualisation",
    alt: "Live music performance with lighting",
    description: "Connecting music, emotions and interactive visualisation.",
    category: "Music",
  },
  {
    id: "hardware",
    src: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=900&q=80",
    title: "Tactile Keyboards",
    tag: "Hardware Craft",
    alt: "Mechanical keyboard on a desk",
    description: "Appreciating thoughtful hardware and functional design.",
    category: "Technology",
  },
  {
    id: "design",
    src: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80",
    title: "Intentional Spaces",
    tag: "UI • UX Design",
    alt: "Minimalist interior with natural lighting",
    description: "Finding inspiration in minimalism and visual hierarchy.",
    category: "Design",
  },
  {
    id: "nature",
    src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80",
    title: "Alpine Horizons",
    tag: "Nature • Exploration",
    alt: "High altitude mountain peaks",
    description: "Inspired by mountains, peaceful landscapes and exploration.",
    category: "Lifestyle",
  },
  {
    id: "cosmos",
    src: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=900&q=80",
    title: "Deep Cosmos",
    tag: "Astrophotography",
    alt: "Milky Way over a landscape",
    description: "Fascinated by space, astronomy and the unknown.",
    category: "Exploration",
  },
  {
    id: "bhakti",
    src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=80",
    title: "A Spiritual Journey",
    tag: "Bhakti • Radha Krishna",
    alt: "Peaceful mountain landscape beneath a starry sky",
    description: "Finding peace, purpose and inspiration through spirituality.",
    category: "Personal",
  },
];

// ============================================
// MAIN COMPONENT
// ============================================

function Interests({ isOpen = true }) {
  const stageRef = useRef(null);

  const [selectedIdx, setSelectedIdx] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [stageSize, setStageSize] = useState({
    width: 0,
    height: 0,
  });

  // ------------------------------------------
  // RESPONSIVE STAGE DIMENSIONS
  // ------------------------------------------

  useEffect(() => {
    const stage = stageRef.current;

    if (!stage) return;

    const updateSize = (width, height) => {
      setStageSize({
        width: Math.round(width),
        height: Math.round(height),
      });
    };

    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(([entry]) => {
        updateSize(
          entry.contentRect.width,
          entry.contentRect.height
        );
      });

      observer.observe(stage);

      return () => observer.disconnect();
    }

    const fallback = () => {
      updateSize(stage.clientWidth, stage.clientHeight);
    };

    fallback();

    window.addEventListener("resize", fallback);

    return () => window.removeEventListener("resize", fallback);
  }, []);

  // ------------------------------------------
  // CATEGORY FILTERING
  // ------------------------------------------

  const categories = useMemo(
    () => [
      "All",
      ...new Set(GALLERY_MOMENTS.map((item) => item.category)),
    ],
    []
  );

  const filteredMoments = useMemo(
    () =>
      selectedCategory === "All"
        ? GALLERY_MOMENTS
        : GALLERY_MOMENTS.filter(
            (item) => item.category === selectedCategory
          ),
    [selectedCategory]
  );

  const currentItem =
    filteredMoments[selectedIdx] || filteredMoments[0];

  // ------------------------------------------
  // RESPONSIVE ORBIT CALCULATIONS
  // ------------------------------------------

  const itemSize = stageSize.width
    ? Math.max(68, Math.min(stageSize.width * 0.115, 126))
    : 88;

  const radiusX = stageSize.width
    ? Math.max(
        72,
        Math.min((stageSize.width - itemSize) * 0.46, 520)
      )
    : 280;

  const radiusY = stageSize.height
    ? Math.max(55, Math.min(stageSize.height * 0.27, 160))
    : 100;

  const itemRadius = Math.round(itemSize * 0.24);

  // ------------------------------------------
  // NAVIGATION
  // ------------------------------------------

  const navigate = (direction) => {
    setSelectedIdx((previous) => {
      const total = filteredMoments.length;

      return (previous + direction + total) % total;
    });
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSelectedIdx(0);
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      navigate(1);
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      navigate(-1);
    }
  };

  if (!isOpen) return null;

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <section
      className="relative w-full h-full min-h-[500px] flex items-center justify-center p-2 sm:p-5 overflow-hidden select-none"
      aria-label="Interests and inspirations"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Ambient background */}

      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[400px] h-[260px] rounded-full bg-indigo-500/[0.09] blur-3xl" />
      </div>

      {/* Main glass container */}

      <div
        className="
          relative w-full max-w-6xl
          h-[82vh] min-h-[480px] max-h-[820px]
          rounded-[24px] sm:rounded-[32px]
          flex flex-col overflow-hidden
          border border-white/[0.14]
          shadow-2xl backdrop-blur-xl
        "
        style={{
          background: "rgba(255,255,255,0.035)",
        }}
      >

        {/* HEADER */}

        <header className="h-12 px-4 sm:px-6 shrink-0 border-b border-white/[0.08] flex items-center justify-between">

          <div className="flex items-center gap-2">

            <div className="w-6 h-6 rounded-full bg-white/[0.08] flex items-center justify-center text-white">
              <Compass size={13} />
            </div>

            <span className="text-[12px] sm:text-[13px] font-semibold tracking-wide text-white/90">
              Things That Keep Me Curious
            </span>

          </div>

          <div className="flex items-center gap-2 text-[10px] text-white/40 font-mono">
            <Sparkles size={11} />
            {filteredMoments.length.toString().padStart(2, "0")} /{" "}
            {GALLERY_MOMENTS.length.toString().padStart(2, "0")}
          </div>

        </header>

        {/* CATEGORY FILTER */}

        <nav
          className="flex gap-2 px-4 sm:px-6 py-3 border-b border-white/[0.06] overflow-x-auto shrink-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Filter interests by category"
        >

          {categories.map((category) => (

            <button
              key={category}
              type="button"
              onClick={() => handleCategoryChange(category)}
              aria-pressed={selectedCategory === category}
              className={`
                px-3 py-1.5 rounded-full text-[10px]
                whitespace-nowrap border transition-colors duration-200
                ${
                  selectedCategory === category
                    ? "bg-white text-black border-white"
                    : "bg-white/[0.04] text-white/50 border-white/[0.08] hover:bg-white/[0.10] hover:text-white"
                }
              `}
            >
              {category}

            </button>

          ))}

        </nav>

        {/* ORBIT CANVAS */}

        <div
          ref={stageRef}
          className="relative flex-1 min-h-0 w-full flex items-center justify-center overflow-hidden px-2 z-10"
        >

          <OrbitImages
            images={filteredMoments.map((item) => ({
              src: item.src,
              alt: item.alt,
            }))}

            shape="ellipse"

            radiusX={radiusX}
            radiusY={radiusY}

            rotation={-4}
            duration={22}

            itemSize={itemSize}
            itemRadius={itemRadius}

            depth={0.5}

            showPath
            pathColor="rgba(255,255,255,0.16)"
            pathWidth={1}
            pathDash={6}

            shadow={0.35}

            hoverScale={1.3}
            hoverSpeed={0.5}

            easing="easeInOut"

            alignToPath
            draggable={true}
            clickToFront={true}

            onItemClick={(index) => setSelectedIdx(index)}

            centerContent={

              <div
                className="
                  flex flex-col items-center
                  justify-center text-center
                  max-w-[260px] px-3
                  pointer-events-none
                "
                aria-live="polite"
              >

                <span className="mb-2 px-3 py-1 rounded-full bg-white/[0.08] border border-white/[0.12] text-[9px] text-white/75 font-mono uppercase tracking-wider">
                  {currentItem.tag}
                </span>

                <h2 className="text-xl sm:text-3xl font-bold tracking-tight text-white drop-shadow-md">
                  {currentItem.title}
                </h2>

                <p className="text-[10px] sm:text-[11px] leading-relaxed text-white/50 mt-2 max-w-[230px]">
                  {currentItem.description}
                </p>

                <span className="mt-3 text-[9px] text-white/30 uppercase tracking-[0.2em]">
                  {currentItem.category}
                </span>

              </div>
            }
          />

        </div>

        {/* FOOTER NAVIGATION */}

        <footer className="min-h-[58px] px-3 sm:px-5 py-2.5 border-t border-white/[0.08] bg-white/[0.02] flex items-center gap-3 shrink-0">

          {/* Previous */}

          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Previous interest"
            className="w-8 h-8 shrink-0 rounded-full border border-white/[0.12] text-white/60 hover:text-white hover:bg-white/[0.08] flex items-center justify-center transition-colors"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Thumbnails */}

          <div className="flex-1 min-w-0 flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

            {filteredMoments.map((item, index) => (

              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedIdx(index)}
                title={item.title}
                aria-label={`View ${item.title}`}
                aria-current={selectedIdx === index ? "true" : undefined}
                className={`
                  w-7 h-7 sm:w-8 sm:h-8
                  shrink-0 rounded-full overflow-hidden
                  border transition-all duration-200
                  ${
                    selectedIdx === index
                      ? "border-white scale-110 opacity-100"
                      : "border-white/15 opacity-40 hover:opacity-100"
                  }
                `}
              >

                <img
                  src={item.src}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />

              </button>

            ))}

          </div>

          {/* Next */}

          <button
            type="button"
            onClick={() => navigate(1)}
            aria-label="Next interest"
            className="w-8 h-8 shrink-0 rounded-full border border-white/[0.12] text-white/60 hover:text-white hover:bg-white/[0.08] flex items-center justify-center transition-colors"
          >
            <ChevronRight size={16} />
          </button>

        </footer>

      </div>

    </section>
  );
}

export default memo(Interests);
