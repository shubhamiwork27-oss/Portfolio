import React from 'react';
import Grainient from './Grainient';

export default function TempBg() {
  return (
    <div style={{ position: 'absolute', inset: 0, width: '130%', height: '130%', zIndex: 0, overflow: 'hidden' }}>
      <Grainient
        colors={["#00010b", "#000443", "#12429a", "#169af9", "#00daff", "#91f9ff"]}
        type="linear"
        angle={47}
        bands={1}
        softness={1}
        flow={0.45}
        scale={1.4}
        speed={1}
        silk={0.63}
        grainAmount={0.08}
        grainSize={0.9}
        contrast={0.85}
        saturation={1.3}
        variation={0}
        stir={1.35}
        grainAnimated
        interactive
        clickSwirl
        intro
        lightMode={false}
      />
    </div>
  );
}

export { Grainient };

