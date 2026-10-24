import React, { memo } from "react";
import TiltedCard from "../../music/TiltedCard";
import "./ProfilePanel.css";

const ProfilePanel = ({ isOpen = true, onNavigateTab }) => {
  return (
    <div className="w-full h-full flex items-center justify-end px-4 sm:px-8 md:px-14 lg:px-20 pointer-events-auto">
      {/* 3D Tilted Card on the Right Side */}
      <div className="relative flex items-center justify-center">
        <TiltedCard
          maxTilt={10}
          glare={true}
          scale={1.02}
          className="rounded-[40px]"
        >
          <div
            className="profile-dock-card relative flex flex-col items-center justify-center
              w-[clamp(310px,36vw,450px)] 
              h-[clamp(450px,66vh,640px)] 
              max-h-[74vh] "
              
          > <img
                src="/profilephoto.png"
                alt="Profile"
                className="w-full h-full object-cover select-none pointer-events-none "
                draggable={false}
              />
          </div>
        </TiltedCard>
      </div>
    </div>
  );
};

export default memo(ProfilePanel);
