import React, { memo } from "react";
import GradientASCII from "./GradientASCII";
import ProjectsSection from "./ProjectsSection";

const ProjectsPage = ({ isOpen = true }) => {
  return (
    <div className="w-full h-full relative overflow-hidden pointer-events-auto flex items-center justify-center select-none">
      {/* Interactive Horizon Background */}
      <div className="absolute inset-0 pointer-events-auto z-0">
        <GradientASCII
          colors={["#ffffff", "#ffffff"]}
          characters={".,<>`~+_-"}
          randomize={true}
          shape="horizon"
          cellSize={16}
          density={0.78}
          glyphOpacity={0.9}
          glow={0.3}
          gradientOpacity={0}
          flow={0.6}
          speed={0.8}
          mouseInteraction={true}
          clickEffect="wave"
        />
      </div>

      {/* Foreground Projects Section Integrated with Carousel */}
      <div className="relative z-10 w-full h-full flex items-center justify-center pointer-events-auto">
        <ProjectsSection isOpen={isOpen} />
      </div>
    </div>
  );
};

export default memo(ProjectsPage);
