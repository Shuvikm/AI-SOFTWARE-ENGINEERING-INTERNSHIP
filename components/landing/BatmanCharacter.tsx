"use client";

interface BatmanCharacterProps {
  className?: string;
}

export function BatmanCharacter({ className = "" }: BatmanCharacterProps) {
  return (
    <div className={`batman pointer-events-none select-none ${className}`}>
      <div className="head">
        <div className="ears">
          <span />
          <span />
        </div>
        <div className="nose" />
        <div className="mouth" />
      </div>
      <div className="body">
        <span />
        <span />
        <span />
      </div>
      <div className="leg">
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="leg">
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="foot" />
      <div className="foot" />
      <div className="cape">
        <div className="cape-shape" />
      </div>
      <div className="watchtower">
        <span />
        <span />
      </div>
    </div>
  );
}
