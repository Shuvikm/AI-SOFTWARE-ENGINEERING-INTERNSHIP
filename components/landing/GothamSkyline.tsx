"use client";

interface GothamSkylineProps {
  className?: string;
}

export function GothamSkyline({ className = "" }: GothamSkylineProps) {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {/* Background Skyline */}
      <div className="skyline pointer-events-none" />

      {/* Foreground Highlight Skyline */}
      <div className="light-skyline pointer-events-none" />
    </div>
  );
}
