import React, { useEffect, useState } from "react";

const EASE = "cubic-bezier(0.2, 0.95, 0.25, 1)";

/* ---------- glass theme tokens ---------- */

const T = {
  text: "#f8fafc",
  textSoft: "rgba(226, 232, 240, 0.74)",
  textMuted: "rgba(226, 232, 240, 0.5)",
  line: "rgba(255, 255, 255, 0.12)",
  panel: "rgba(255, 255, 255, 0.06)",
  panelLine: "rgba(255, 255, 255, 0.1)",
  chip: "rgba(255, 255, 255, 0.12)",
};

// Frosted tint per state: active cards frost up for legibility, others recede.
const TINT = {
  rest: "rgba(255, 255, 255, 0.09)",
  spread: "rgba(255, 255, 255, 0.11)",
  other: "rgba(255, 255, 255, 0.06)",
  active: "rgba(255, 255, 255, 0.17)",
};

const SHADOWS = {
  rest: "0 28px 50px -20px rgba(2,6,23,0.55)",
  spread: "0 34px 60px -20px rgba(2,6,23,0.6)",
  other: "0 22px 44px -22px rgba(2,6,23,0.5)",
  active: "0 44px 80px -22px rgba(2,6,23,0.75)",
};
// Hairline edge + top highlight sell the "glass" thickness.
const EDGE =
  "inset 0 0 0 1px rgba(255,255,255,0.16), inset 0 1px 0 rgba(255,255,255,0.32)";

/**
 * Poses: rest (fanned), spread (stack hovered), active (this card),
 * other (another card is active). translate -> rotate -> scale keeps
 * offsets in true screen pixels.
 */
const POSES = {
  1: {
    z: 2, delay: 0,
    rest: { x: -36, y: 1, r: -6 },
    spread: { x: -48, y: -8, r: -4 },
    active: { x: -20, y: -24, r: 0, s: 1.04 },
    other: { x: -48, y: 6, r: 0, s: 0.97 },
  },
  2: {
    z: 3, delay: 40,
    rest: { x: 0, y: 0, r: 0 },
    spread: { x: 0, y: -16, r: 0 },
    active: { x: 0, y: -26, r: 0, s: 1.04 },
    other: { x: 0, y: 8, r: 0, s: 0.97 },
  },
  3: {
    z: 1, delay: 80,
    rest: { x: 36, y: 1, r: 6 },
    spread: { x: 48, y: -8, r: 4 },
    active: { x: 20, y: -24, r: 0, s: 1.04 },
    other: { x: 48, y: 6, r: 0, s: 0.97 },
  },
};

const getCardStyle = (id, { activeId, spread }) => {
  const cfg = POSES[id];
  const mode =
    activeId === id ? "active" : activeId !== null ? "other" : spread ? "spread" : "rest";
  const { x = 0, y = 0, r = 0, s = 1 } = cfg[mode];
  return {
    zIndex: mode === "active" ? 10 : cfg.z,
    transform: `translate(${x}px, ${y}px) rotate(${r}deg) scale(${s})`,
    transitionDelay: mode === "active" ? "0ms" : `${cfg.delay}ms`,
    backgroundColor: TINT[mode],
    boxShadow: `${SHADOWS[mode]}, ${EDGE}`,
  };
};

const cardBase = {
  position: "absolute",
  inset: 0,
  boxSizing: "border-box",
  overflow: "hidden",
  borderRadius: 36,
  padding: "36px 28px",
  color: T.text,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  gap: 16,
  // Soft diagonal sheen over the tint
  backgroundImage:
    "linear-gradient(145deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.02) 45%, rgba(255,255,255,0) 100%)",
  backdropFilter: "blur(22px) saturate(170%)",
  WebkitBackdropFilter: "blur(22px) saturate(170%)",
  transformOrigin: "center center",
  transition: `transform 0.55s ${EASE}, box-shadow 0.5s ease, background-color 0.4s ease`,
  pointerEvents: "none", // hit-testing lives on the stationary zones below
  userSelect: "none",
  willChange: "transform, box-shadow",
  WebkitFontSmoothing: "antialiased",
};

/* ---------- small shared pieces ---------- */

const Header = ({ left, index }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
    {left}
    <span style={{ fontSize: 12, color: T.textMuted, fontWeight: 700 }}>{index} / 03</span>
  </div>
);

const Pill = ({ children }) => (
  <span style={{
    fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
    color: T.textSoft, backgroundColor: T.chip, padding: "5px 12px", borderRadius: 999,
    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1)",
  }}>{children}</span>
);

const Title = ({ children, size = 26, mb = 12 }) => (
  <h3 style={{
    fontSize: size, fontWeight: 800, color: T.text, lineHeight: 1.2,
    letterSpacing: "-0.03em", margin: `0 0 ${mb}px`,
  }}>{children}</h3>
);

const Body = ({ children }) => (
  <p style={{ fontSize: 14, lineHeight: 1.65, color: T.textSoft, margin: "0 0 24px" }}>{children}</p>
);

const Footer = ({ children }) => (
  <div style={{
    paddingTop: 18, borderTop: `1px solid ${T.line}`, display: "flex",
    alignItems: "center", justifyContent: "space-between",
  }}>{children}</div>
);

const Panel = ({ children, style }) => (
  <div style={{
    padding: 14, backgroundColor: T.panel, borderRadius: 14,
    border: `1px solid ${T.panelLine}`, ...style,
  }}>
    {children}
  </div>
);

/* ---------- card contents ---------- */

const ExperienceCard = () => (
  <>
    <div>
      <Header left={<Pill>Experience</Pill>} index="01" />
      <Title>Creative Engineering</Title>
      <Body>
        Specialized in crafting responsive architectures, buttery 60fps micro-interactions, and
        high-performance WebGL systems.
      </Body>
      <Panel style={{ display: "flex", flexDirection: "column", gap: 10, padding: 16, borderRadius: 16 }}>
        {["Fluid Shader & Canvas Backgrounds", "Tactile UI & Interaction Design", "Production Web Performance"].map(
          (item) => (
            <div key={item} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, fontWeight: 600, color: T.text }}>
              <span style={{
                width: 6, height: 6, borderRadius: "50%", backgroundColor: T.accentSoft,
                boxShadow: `0 0 8px ${T.accentSoft}`, flexShrink: 0,
              }} />
              {item}
            </div>
          )
        )}
      </Panel>
    </div>
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.textMuted, marginBottom: 10 }}>
        Core Technologies
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {["React 19", "Astro", "TypeScript", "Three.js", "Tailwind"].map((tag) => (
          <span key={tag} style={{
            fontSize: 11, fontWeight: 600, color: T.text, backgroundColor: T.panel,
            border: `1px solid ${T.panelLine}`, padding: "4px 10px", borderRadius: 8,
          }}>{tag}</span>
        ))}
      </div>
    </div>
  </>
);

const ProfileCard = () => (
  <>
    <div>
      <Header
        index="02"
        left={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: T.green, boxShadow: "0 0 0 3px rgba(110,231,183,0.22), 0 0 10px rgba(110,231,183,0.7)" }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.green }}>
              Available for work
            </span>
          </div>
        }
      />
      <Title size={28} mb={6}>Shubham Idnani</Title>
      <div style={{ fontSize: 14, fontWeight: 600, color: T.accent, marginBottom: 16 }}>
        Full Stack Developer & Designer
      </div>
      <Body>
        Merging clean aesthetic sensibility with resilient engineering to deliver immersive,
        high-speed digital products.
      </Body>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {[["60 FPS", "Performance"], ["100%", "Responsive"]].map(([big, small]) => (
          <Panel key={small}>
            <div style={{ fontSize: 20, fontWeight: 800, color: T.text }}>{big}</div>
            <div style={{ fontSize: 11, color: T.textMuted, fontWeight: 600 }}>{small}</div>
          </Panel>
        ))}
      </div>
    </div>
    <Footer>
      <span style={{ fontSize: 13, color: T.textSoft, fontWeight: 600 }}>Featured Portfolio</span>
      <span style={{ fontSize: 13, color: T.accent, fontWeight: 700 }}>Explore Projects →</span>
    </Footer>
  </>
);

const SKILLS = [
  { name: "Frontend Architecture", level: 98 },
  { name: "Micro-interactions & Motion", level: 95 },
  { name: "Performance Optimization", level: 96 },
];

const SkillsCard = ({ mounted }) => (
  <>
    <div>
      <Header left={<Pill>Capabilities</Pill>} index="03" />
      <Title>Skills & Craft</Title>
      <Body>
        End-to-end frontend craftsmanship with precision type systems, fluid animation physics, and
        modern frameworks.
      </Body>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {SKILLS.map((skill, i) => (
          <div key={skill.name}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 600, color: T.text, marginBottom: 6 }}>
              <span>{skill.name}</span>
              <span style={{ color: T.accent }}>{skill.level}%</span>
            </div>
            <div style={{ height: 5, width: "100%", backgroundColor: T.chip, borderRadius: 999, overflow: "hidden" }}>
              <div
                className="oc-bar"
                style={{
                  height: "100%",
                  width: `${skill.level}%`,
                  background: "linear-gradient(90deg, #38bdf8, #818cf8)",
                  borderRadius: 999,
                  transformOrigin: "left center",
                  transform: mounted ? "scaleX(1)" : "scaleX(0)",
                  transition: `transform 0.9s ${EASE} ${300 + i * 120}ms`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
    <Footer>
      <span style={{ fontSize: 12, color: T.textMuted, fontWeight: 500 }}>Precision & Craft</span>
      <span style={{ fontSize: 12, color: T.textSoft, fontWeight: 600 }}>2026 Portfolio</span>
    </Footer>
  </>
);

/* ---------- main component ---------- */

const CARDS = [
  { id: 1, label: "Experience: Creative Engineering", Content: ExperienceCard },
  { id: 2, label: "Profile: Shubham Idnani", Content: ProfileCard },
  { id: 3, label: "Capabilities: Skills and Craft", Content: SkillsCard },
];

export default function OverlappingCards() {
  const [hovered, setHovered] = useState(null); // mouse only
  const [focused, setFocused] = useState(null); // keyboard focus
  const [pinned, setPinned] = useState(null); // click / tap / Enter
  const [stackHovered, setStackHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const activeId = hovered ?? focused ?? pinned;
  const spread = stackHovered || activeId !== null;
  const togglePin = (id) => setPinned((p) => (p === id ? null : id));
  const mouseOnly = (fn) => (e) => {
    if (e.pointerType === "mouse") fn();
  };

  return (
    <>
      <style>{`
        .oc-card:focus-visible { outline: 3px solid ${T.accent}; outline-offset: 4px; }
        @supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
          .oc-card { background-color: rgba(30, 41, 59, 0.88) !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .oc-card, .oc-bar { transition: none !important; }
        }
      `}</style>

      <div
        onKeyDown={(e) => e.key === "Escape" && setPinned(null)}
        style={{
          position: "relative",
          isolation: "isolate",
          display: "flex",
          justifyContent: "flex-end",
          padding: 0,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "clamp(320px, 27vw, 390px)",
            maxWidth: "100%",
            height: "clamp(580px, 75vh, 690px)",
            minHeight: 580,
            margin: "0 clamp(28px, 3.5vw, 56px) 0 auto",
          }}
        >
          {CARDS.map(({ id, label, Content }) => (
            <div
              key={id}
              className="oc-card"
              role="button"
              tabIndex={0}
              aria-label={label}
              aria-pressed={pinned === id}
              onFocus={() => setFocused(id)}
              onBlur={() => setFocused(null)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  togglePin(id);
                }
              }}
              style={{ ...cardBase, ...getCardStyle(id, { activeId, spread }) }}
            >
              <Content mounted={mounted} />
            </div>
          ))}

          {/* Stationary hit zones: cards move, these don't, so no hover flicker. */}
          <div
            aria-hidden="true"
            onPointerEnter={mouseOnly(() => setStackHovered(true))}
            onPointerLeave={mouseOnly(() => {
              setStackHovered(false);
              setHovered(null);
            })}
            style={{ position: "absolute", inset: "-24px -40px", display: "flex", zIndex: 20 }}
          >
            {CARDS.map(({ id }) => (
              <div
                key={id}
                onPointerEnter={mouseOnly(() => setHovered(id))}
                onClick={() => togglePin(id)}
                style={{ flex: 1, cursor: "pointer", touchAction: "manipulation" }}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}