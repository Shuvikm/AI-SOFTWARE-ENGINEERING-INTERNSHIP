"use client";

import { useState, useEffect } from "react";

export function BatmanIntro() {
  const [phase, setPhase] = useState<"intro" | "reveal" | "done">("intro");
  const [typedText, setTypedText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);

  const INTRO_LINE1 = "ONEATLAS // GOTHAM INTELLIGENCE";
  const INTRO_LINE2 = "FRONTIER AI RECON PROTOCOL ACTIVE";

  useEffect(() => {
    const cursorBlink = setInterval(() => setCursorVisible((v) => !v), 450);

    let i = 0;
    const full = INTRO_LINE1 + "   " + INTRO_LINE2;
    const typeInterval = setInterval(() => {
      if (i < full.length) {
        setTypedText(full.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => {
          setPhase("reveal");
          setTimeout(() => {
            setPhase("done");
          }, 2800);
        }, 300);
      }
    }, 38);

    return () => {
      clearInterval(cursorBlink);
      clearInterval(typeInterval);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden select-none batman-scene-container transition-opacity duration-1000 opacity-100"
      style={{
        background: "linear-gradient(315deg, #0cbaba 0%, #380036 74%)",
      }}
    >
      {/* ── AUTHENTIC BATMAN CSS ART SCENE ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="sky">
          <div className="moon" />
        </div>

        <div className="skyline" />

        <div className="light" style={{ opacity: 1 }}>
          <div id="batman-logo">
            <div id="left-white" />
            <div id="right-white" />
            <div id="top-white" />
          </div>
        </div>

        <div className="skyline" />

        <div className="batman">
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
      </div>

      {/* ── TERMINAL HUD OVERLAY DURING TYPEWRITER ── */}
      <div
        className={`relative z-50 flex flex-col items-center w-full max-w-2xl px-6 transition-all duration-700 ${
          phase === "reveal" ? "opacity-0 translate-y-4 pointer-events-none" : "opacity-100 translate-y-0"
        }`}
      >
        {/* Bat Silhouette Logo */}
        <div className="mb-6">
          <svg
            viewBox="0 0 200 80"
            className="w-28 sm:w-36 h-auto"
            fill="#f59e0b"
            style={{ filter: "drop-shadow(0 0 25px rgba(245,158,11,0.9))" }}
          >
            <path d="M100 15 C85 5, 60 0, 40 10 C20 20, 10 35, 5 50 C15 45, 25 42, 35 48 C30 38, 38 28, 50 25 C62 22, 75 30, 80 42 L85 55 C88 60, 92 63, 100 65 C108 63, 112 60, 115 55 L120 42 C125 30, 138 22, 150 25 C162 28, 170 38, 165 48 C175 42, 185 45, 195 50 C190 35, 180 20, 160 10 C140 0, 115 5, 100 15 Z" />
          </svg>
        </div>

        {/* Terminal Window */}
        <div className="w-full bg-black/85 border border-amber-500/40 rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.9)] backdrop-blur-md overflow-hidden font-mono">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-950/40 border-b border-amber-500/30">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
            <span className="ml-2 text-[10px] text-amber-400 font-bold tracking-widest uppercase">
              ONEATLAS RECON SYSTEM // BOOT
            </span>
          </div>

          <div className="p-5 space-y-2">
            <div className="text-[11px] text-amber-500/70 uppercase tracking-widest">
              [SYSTEM] INITIALIZING GOTHAM DEFENSE TELEMETRY...
            </div>
            <div className="text-sm sm:text-base text-amber-300 font-bold tracking-widest leading-relaxed">
              <span className="text-amber-500 mr-2">&gt;</span>
              {typedText.slice(0, INTRO_LINE1.length)}
              {typedText.length > INTRO_LINE1.length && (
                <>
                  <br />
                  <span className="text-amber-500 mr-2">&gt;</span>
                  {typedText.slice(INTRO_LINE1.length + 3)}
                </>
              )}
              <span
                className="inline-block w-2.5 h-4 bg-amber-400 ml-1 align-middle"
                style={{ opacity: cursorVisible ? 1 : 0 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Skip Button */}
      <button
        onClick={() => setPhase("done")}
        className="absolute bottom-6 right-6 z-50 text-[10px] font-mono tracking-widest uppercase text-amber-400/70 hover:text-white px-3 py-1.5 border border-amber-500/30 bg-black/60 backdrop-blur-sm rounded cursor-pointer transition-colors"
      >
        SKIP INTRO →
      </button>
    </div>
  );
}
