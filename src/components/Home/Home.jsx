import React from "react";
import Grainient from "./tempbg/Grainient";
import TechText from "./TechText";
import TextType from "./TextType";
import Dock from "./Dock";
import OverlappingCards from "./OverlappingCards";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AtSignIcon ,
  User02Icon ,
  MountainSnowIcon ,
  MusicNote03Icon,
  CodeFolderIcon ,
} from "@hugeicons/core-free-icons";

const glyph = (icon) => (
  <HugeiconsIcon icon={icon} size='1em' strokeWidth={1.8} />
);

const items = [
  {
    icon: glyph(User02Icon),
    label: "Profile",
    active: true,
    onClick: () => console.log("profile"),
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
    icon: glyph(MountainSnowIcon ),
    label: "Interests",
    onClick: () => console.log("Interests"),
  },
  {
    icon: glyph(MusicNote03Icon),
    label: "Music",
    active: true,
    onClick: () => console.log("Music"),
  },
  {
    icon: glyph(CodeFolderIcon ),
    label: "Projects",
    onClick: () => console.log("Projects"),
  },
  {
    icon: glyph(AtSignIcon ),
    label: "Contact",
    onClick: () => console.log("Contact"),
  },
];

export default function Home() {
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
      }}>
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
        }}>

      {/* Temporary Background (Grainient) */}
      <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }}>
        <Grainient
          colors={["#12429a","#00daff","#91f9ff","#001694"]}
          type="linear"
          angle={180}
          bands={1}
          softness={8}
          flow={0.5}
          scale={1}
          speed={2}
          silk={0.63}
          grainAmount={0.08}
          grainSize={0.9}
          contrast={0.85}
          saturation={1.03}
          variation={0}
          stir={1.35}
          grainAnimated
          interactive
          clickSwirl
          intro
          lightMode={false}
        />
      </div>

      


      {/* Top Left TechText & TextType (Temporarily disconnected) */}
      {/*
      <div
        style={{
          position: "absolute",
          top: "32px",
          left: "32px",
          width: "min(90vw, 620px)",
          display: "flex",
          flexDirection: "column",
          zIndex: 10,
          pointerEvents: "auto",
        }}>
        <div style={{ width: "100%", height: "175px", position: "relative" }}>
          <TechText
            text='Shubham'
            align='left'
            fontWeight={800}
            fontSize={240}
            reveal='area'
            dashLength={4}
            dashGap={2}
            specks={15}
            fontFamily='monospace'
            color='#ffffff'
            accentColor='#ffffff'
            letterSpacing={-0.05}
            reach={80}
            softness={0.7}
            strokeWidth={1.5}
            speed={1.2}
            lineStyle='solid'
            selection
            labels
            draggable={false}
            sweep
          />
        </div>
        <div
          style={{
            width: "100%",
            height: "175px",
            position: "relative",
            marginTop: "-38px",
          }}>
          <TechText
            text='Idnani'
            align='left'
            fontWeight={800}
            fontSize={240}
            reveal='area'
            dashLength={4}
            dashGap={2}
            specks={15}
            fontFamily='monospace'
            color='#ffffff'
            accentColor='#ffffff'
            letterSpacing={-0.05}
            reach={80}
            softness={0.7}
            strokeWidth={1.5}
            speed={1.2}
            lineStyle='solid'
            selection
            labels
            draggable={false}
            sweep
          />
        </div>

        <div
          style={{
            width: "fit-content",
            padding: "8px 28px",
            fontSize:70,
            fontWeight: 700,
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            color: "#f8fafc",
            letterSpacing: "-0.04em",
            minHeight: "46px",
            display: "inline-flex",
            alignItems: "center",
            userSelect: "none",
            WebkitUserSelect: "none",
            MozUserSelect: "none",
            msUserSelect: "none",
          }}
        >
          <TextType 
            text={["Developer", "Designer", "Adventurer"]}
            typingSpeed={75}
            pauseDuration={1500}
            showCursor
            cursorCharacter="|"
            deletingSpeed={50}
            variableSpeedEnabled={false}
            cursorBlinkDuration={0.5}
          />
        </div>
      </div>
      */}

      {/* Right Side Overlapping White Cards (Temporarily disconnected) */}
      {/*
      <div
        className="hidden md:flex items-center justify-center pointer-events-auto"
        style={{
          position: "absolute",
          top: "50%",
          right: "clamp(40px, 8vw, 130px)",
          transform: "translateY(-50%)",
          zIndex: 10,
        }}
      >
        <OverlappingCards />
      </div>
      */}

      {/* Mid Bottom Dock */}
      <Dock
        items={items}
        theme="light"
        baseItemSize={46}
        magnification={70}
        panelHeight={62}
        accentColor="#0a84ff"
        badgeColor="#5e5e5e"
        position="bottom"
        distance={230}
        gap={14}
        roundness={0.7}
        bounce
        autoHide={false}
        tiles
        showLabels
        showIndicators={false}
        showBadges
      />
      </div>
    </div>
  );
}
