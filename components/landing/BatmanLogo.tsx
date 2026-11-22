"use client";

interface BatmanLogoProps {
  className?: string;
  onClick?: () => void;
  active?: boolean;
}

export function BatmanLogo({ className = "", onClick, active = false }: BatmanLogoProps) {
  return (
    <div
      className={`light cursor-pointer select-none transition-transform duration-300 ${active ? "opacity-100 scale-105" : "hover:opacity-95"} ${className}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      aria-label="Toggle Bat-Signal Searchlight"
      title="Click to toggle Bat-Signal"
    >
      <div id="batman-logo">
        <div id="left-white" />
        <div id="right-white" />
        <div id="top-white" />
      </div>
    </div>
  );
}
