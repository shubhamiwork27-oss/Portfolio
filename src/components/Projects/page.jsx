import React, { memo } from "react";
import GradientASCII from "./GradientASCII";

const ProjectsPage = () => {
  return (
    <div className="w-full h-full relative overflow-hidden pointer-events-auto">
      <GradientASCII
        colors={["#ffffff", "#ffffff"]}
        characters={'.,<>`~+_-'}
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
  );
};

export default memo(ProjectsPage);
