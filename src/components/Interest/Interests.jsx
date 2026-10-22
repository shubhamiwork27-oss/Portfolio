import React, { memo, useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import CircularGallery from "./CircularGallery";

export const INTEREST_ITEMS = [
  {
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    text: "Mountain Trekking",
    description: "High altitude expeditions, alpine sunsets, and finding quiet above the clouds.",
    alt: "Majestic snow-capped mountain peaks at sunrise",
    tags: ["Alpine Trails", "Altitude", "Outdoors"],
    fascinates: "The rare quiet and mental clarity that only exists above the tree line at sunrise.",
    currentlyExploring: "High-pass Himalayan trekking routes"
  },
  {
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    text: "Generative Art",
    description: "Algorithmic geometry, shader experiments, and computational aesthetics in real-time.",
    alt: "Abstract 3D fluid generative graphics in neon violet and blue",
    tags: ["Procedural Art", "Shaders", "WebGL"],
    fascinates: "Creating simple mathematical rules that blossom into infinitely complex, unpredictable beauty.",
    currentlyExploring: "Raymarching techniques & signed distance fields"
  },
  {
    image:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80",
    text: "Sound Design",
    description: "Warm analog synthesizers, cinematic soundscapes, and expressive musical texture.",
    alt: "Audio equipment and synthesizer keyboard in dim studio lighting",
    tags: ["Analog Synths", "Soundscapes", "Audio Production"],
    fascinates: "How a single sub-bass frequency or filtered reverb can instantly trigger vivid nostalgic memories.",
    currentlyExploring: "Granular synthesis & binaural spatial audio"
  },
  {
    image:
      "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1200&q=80",
    text: "Custom Keyboards",
    description: "Tuning mechanical switches, lubing stabilizers, and crafting the perfect tactile acoustic profile.",
    alt: "Custom aesthetic mechanical keyboard on desk",
    tags: ["Mechanical Keyboards", "Acoustics", "Hardware Mods"],
    fascinates: "The tactile connection between human fingertips and machined aluminium switches during deep work.",
    currentlyExploring: "Lubed linear switch stems & brass plate acoustics"
  },
  {
    image:
      "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80",
    text: "Astrophotography",
    description: "Long-exposure night skies, capturing ancient galactic light and cosmic stillness.",
    alt: "Milky way core rising over dark mountain silhouettes",
    tags: ["Long Exposure", "Nebulae", "Milky Way"],
    fascinates: "Stacking hundreds of long-exposure frames to pull faint ancient photons out of pitch darkness."
  },
  {
    image:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
    text: "Minimalist Spaces",
    description: "Intentional architecture, clean lines, and light-filled spaces designed for deep focus.",
    alt: "Modern architectural interior with geometric shadows and sunlight",
    tags: ["Architecture", "Natural Light", "Intentional Living"],
    fascinates: "How spaces stripped of visual noise create an immediate sense of mental calm and focus."
  },
  {
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
    text: "Specialty Coffee",
    description: "Dialing in pour-overs, single-origin flavor profiles, and meditative morning brewing rituals.",
    alt: "Barista pouring hot water over fresh coffee grounds in a ceramic dripper",
    tags: ["Pour Over", "Single Origin", "Brew Rituals"],
    fascinates: "The meticulous chemistry of water temperature, grind distribution, and extraction time.",
    currentlyExploring: "Ethiopian washed process light roasts"
  },
  {
    image:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
    text: "Sci-Fi & Cyberpunk",
    description: "Dystopian worlds, futuristic interfaces, and visionary speculative storytelling.",
    alt: "Futuristic neon city skyline reflecting on wet pavement at night",
    tags: ["Speculative Fiction", "Worldbuilding", "Futurism"],
    fascinates: "How visionary fiction anticipates ethical questions and technological breakthroughs decades early."
  },
  {
    image:
      "https://images.unsplash.com/photo-1682687220063-4742bd7fd538?auto=format&fit=crop&w=1200&q=80",
    text: "Ocean Exploration",
    description: "Descending into underwater silence, coral biomes, and the mystery of the deep sea.",
    alt: "Sunbeams piercing crystal clear deep ocean waters",
    tags: ["Marine Life", "Deep Blue", "Conservation"],
    fascinates: "The alien otherworldly silence and bioluminescent ecosystems thriving under immense pressure."
  },
  {
    image:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
    text: "Retro Tech & Gaming",
    description: "8-bit nostalgia, CRT aesthetics, arcade culture, and game feel mechanics.",
    alt: "Classic gaming setup with retro tech and subtle neon illumination",
    tags: ["Vintage Hardware", "CRT Displays", "Pixel Craft"],
    fascinates: "How early engineers achieved astonishing creativity and game depth under strict 64KB memory limits.",
    currentlyExploring: "Early 90s sound chips & low-poly rendering pipelines"
  },
  {
    image:
      "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80",
    text: "Urban Photography",
    description: "Chasing geometry, twilight reflections, and ephemeral human stories in bustling metropolises.",
    alt: "Moody dusk street scene with illuminated city lights and motion blur",
    tags: ["Street Photography", "Geometry", "Night Light"],
    fascinates: "Freezing split-second human serendipity framed by towering architectural reflections."
  },
  {
    image:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80",
    text: "Forest Escapes",
    description: "Wandering misty evergreen trails, damp moss scents, and reconnecting with natural rhythms.",
    alt: "Sunlight filtering through dense misty pine tree canopy",
    tags: ["Evergreen Trails", "Solitude", "Biophilia"],
    fascinates: "The calming olfactory science and restorative atmosphere of dense damp pine canopies."
  },
  // Newly appended personal interests
  {
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
    text: "Creative Coding & Motion",
    description: "Building immersive interfaces, experimenting with motion, GSAP, React, and interactive web experiences.",
    alt: "Futuristic digital interface with geometric light choreography",
    tags: ["Creative Coding", "Motion Design", "Interactive Web"],
    fascinates: "How mathematical algorithms and easing curves can breathe fluid organic life into digital software.",
    currentlyExploring: "WebGL shaders and procedural animation in React"
  },
  {
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80",
    text: "AI & Future Tech",
    description: "Exploring AI-powered products, generative AI, and how emerging technology can solve real-world problems.",
    alt: "Abstract neural intelligence network illuminated with data nodes",
    tags: ["Generative AI", "Neural Systems", "Product Innovation"],
    fascinates: "The shift from rigid deterministic scripts to probabilistic models that learn and reason.",
    currentlyExploring: "Autonomous agent workflows and local LLM pipelines"
  },
  {
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    text: "Space & The Cosmos",
    description: "Curiosity about galaxies, the universe, astrophotography, and the infinite mysteries of space.",
    alt: "Stunning view of Earth and celestial stars glowing in deep space",
    tags: ["Cosmology", "Deep Sky", "Astrophysics"],
    fascinates: "Looking out into the cosmos is peering billions of years back into the dawn of time.",
    currentlyExploring: "James Webb Space Telescope discoveries"
  },
  {
    image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80",
    text: "Visual Design & Typography",
    description: "Exploring typography, color theory, graphic design, creative layouts, and digital storytelling.",
    alt: "Vibrant abstract graphic design composition with clean typography and forms",
    tags: ["Typography", "Color Theory", "Graphic Design"],
    fascinates: "How subtle adjustments in whitespace and hierarchy completely change how a message is felt.",
    currentlyExploring: "Modernist Swiss grid layouts & expressive variable fonts"
  }
];

function Interests({ items = INTEREST_ITEMS }) {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, {
    damping: 28,
    stiffness: 450,
    mass: 0.15,
  });
  const springY = useSpring(cursorY, {
    damping: 28,
    stiffness: 450,
    mass: 0.15,
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onPointerMove = (e) => {
      if (e.pointerType === "touch") return;
      setIsVisible(true);
      cursorX.set(e.clientX + 14);
      cursorY.set(e.clientY + 14);
    };

    const onPointerLeave = () => {
      setIsVisible(false);
    };

    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerleave", onPointerLeave);
    return () => {
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [cursorX, cursorY]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex flex-col justify-between items-center relative select-none"
    >
      {/* Restrained Cyan & Violet Ambient Radial Glows */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden z-0"
        aria-hidden="true"
      >
        <div className="absolute top-[35%] left-1/4 -translate-y-1/2 -translate-x-1/2 w-[340px] h-[340px] sm:w-[520px] sm:h-[520px] rounded-full bg-[#00E5FF]/[0.07] blur-[100px] sm:blur-[130px]" />
        <div className="absolute top-[45%] right-1/4 -translate-y-1/2 translate-x-1/2 w-[360px] h-[360px] sm:w-[540px] sm:h-[540px] rounded-full bg-[#8B5CF6]/[0.09] blur-[110px] sm:blur-[140px]" />
      </div>

      {/* Beyond the Code - Personal Introduction */}
      <div className="z-10 pt-1 sm:pt-3 px-4 flex flex-col items-center text-center pointer-events-auto max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] backdrop-blur-md border border-white/10 text-white/75 text-[11px] sm:text-xs font-medium tracking-wider uppercase mb-1.5 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]" />
          <span>Curiosity & Perspectives</span>
        </div>
        <h2 className="text-base sm:text-xl font-bold tracking-tight text-white mb-1 font-heading">
          Beyond the Code
        </h2>
        <p className="text-[11px] sm:text-[13px] text-slate-300/80 leading-relaxed font-normal max-w-xl">
          I'm drawn to things that spark curiosity, blend creativity with technology, and make ordinary experiences feel extraordinary. From interactive digital worlds to music, nature, and the mysteries of the cosmos, I enjoy exploring ideas that let me see things differently.
        </p>

        {/* Small Curiosity Collection - visual markers across core pillars */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-2.5">
          {[
            { label: "Technology & AI", dot: "#00E5FF" },
            { label: "Creative Coding", dot: "#8B5CF6" },
            { label: "Sound & Music", dot: "#00E5FF" },
            { label: "Nature & Wilderness", dot: "#8B5CF6" },
            { label: "Cosmic Exploration", dot: "#00E5FF" },
          ].map((tag, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:py-1 rounded-full bg-white/[0.03] backdrop-blur-md border border-white/10 hover:border-[#00E5FF]/40 text-slate-300 text-[10px] sm:text-[11px] tracking-wide transition-colors duration-200"
            >
              <span
                className="w-1 h-1 rounded-full"
                style={{ backgroundColor: tag.dot, boxShadow: `0 0 6px ${tag.dot}` }}
              />
              {tag.label}
            </span>
          ))}
        </div>
      </div>

      {/* Cursor Follower in Interest Tab */}
      <motion.div
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          x: springX,
          y: springY,
          pointerEvents: "none",
          zIndex: 50,
        }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: isVisible ? 1 : 0.75,
        }}
        transition={{ duration: 0.15 }}
        className='hidden sm:inline-flex items-center px-3 py-1 rounded-full bg-white/90 backdrop-blur-md shadow-lg border border-black/10 select-none'>
        <span className='text-black font-semibold text-xs tracking-wider uppercase'>
          scroll or drag
        </span>
      </motion.div>

      {/* Main Gallery Area */}
      <div
        className="w-full relative pointer-events-auto z-10 flex-1 flex items-center justify-center min-h-[340px]"
        style={{ maxHeight: "560px", position: "relative" }}
      >
        <CircularGallery
          items={items}
          bend={2}
          textColor="#ffffff"
          borderRadius={0.14}
          scrollEase={0.16}
          onItemClick={(item, index) => console.log(item?.text, index)}
          itemSize={1.16}
          itemAspect={1.24}
          gap={0.26}
          wave={2.1}
          fadeEdges={0.11}
          shadow={0.17}
          scrollSpeed={1.2}
          autoScroll={1.9}
          snap
          grayscale={false}
          showTitles
          openOnClick
          intro
          fontUrl='https://fonts.googleapis.com/css2?family=Orbitron:wght@700&display=swap'
        />
      </div>

      {/* Bottom hint for mobile */}
      <div className='pb-1 sm:pb-2 text-[11px] text-white/50 tracking-wider uppercase sm:hidden pointer-events-none'>
        Swipe to rotate • Tap to expand
      </div>
    </div>
  );
}

export default memo(Interests);

