"use client";

import { useState } from "react";
import { BatmanCharacter } from "./BatmanCharacter";
import { BatmanLogo } from "./BatmanLogo";
import { GothamSkyline } from "./GothamSkyline";

interface BatmanSceneProps {
  className?: string;
  lightActive?: boolean;
  onToggleLight?: () => void;
}

export function BatmanScene({
  className = "",
  lightActive = false,
  onToggleLight,
}: BatmanSceneProps) {
  const [internalLight, setInternalLight] = useState(false);
  const isLightOn = onToggleLight !== undefined ? lightActive : internalLight;
  const toggle = onToggleLight || (() => setInternalLight(!internalLight));

  return (
    <div
      className={`relative w-full h-full overflow-hidden select-none bg-[#150e21] ${className}`}
      data-testid="batman-scene"
    >
      {/* Twilight & Starry Sky Layer */}
      <div className="sky pointer-events-none" />

      {/* Atmospheric Moon */}
      <div className="moon pointer-events-none" />

      {/* Atmospheric Fog Particles Overlay */}
      <div
        className="clouds-layer absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/40 via-transparent to-black/80"
        aria-hidden="true"
      />

      {/* Spotlight and Batman Logo Signal */}
      <BatmanLogo active={isLightOn} onClick={toggle} />

      {/* Layered Gotham Skyline with Parallax Support */}
      <GothamSkyline />

      {/* The Dark Knight Silhouette Figure */}
      <BatmanCharacter />
    </div>
  );
}
