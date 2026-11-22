"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { BatmanScene } from "./BatmanScene";
import { OneAtlasIntroduction } from "./OneAtlasIntroduction";
import { ValorantAuthModal } from "@/components/auth/ValorantAuthModal";
import { ChevronDown, SkipForward, Radio } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export function CinematicLanding() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pinSectionRef = useRef<HTMLDivElement | null>(null);
  const batmanSceneWrapperRef = useRef<HTMLDivElement | null>(null);
  const introRevealRef = useRef<HTMLDivElement | null>(null);
  const gothamBackdropRef = useRef<HTMLDivElement | null>(null);

  const [lightActive, setLightActive] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("oneatlas_user");
    if (stored) {
      try {
        setCurrentUser(JSON.parse(stored));
      } catch {
        // ignore
      }
    }
  }, []);

  const scrollToPlatform = () => {
    const el = document.getElementById("platform-content");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  useGSAP(
    () => {
      const pinEl = pinSectionRef.current;
      const sceneWrapper = batmanSceneWrapperRef.current;
      const introEl = introRevealRef.current;
      const backdrop = gothamBackdropRef.current;

      if (!pinEl || !sceneWrapper || !introEl || !backdrop) return;

      const mm = gsap.matchMedia();

      // Desktop & Laptop Viewports (Full 100vw, no gap)
      mm.add("(min-width: 768px)", () => {
        // Ambient idle breathing animations
        const idleMoon = gsap.to(".moon", {
          scale: 1.05,
          filter: "drop-shadow(0 0 35px rgba(100, 147, 169, 0.8))",
          duration: 4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        const idleLight = gsap.to(".light", {
          opacity: 0.95,
          rotation: -42,
          duration: 3.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        // Main Pinned Cinematic Scroll Timeline with Full Sequence
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pinEl,
            start: "top top",
            end: "+=1600",
            pin: true,
            scrub: 1.0,
            anticipatePin: 1,
          },
        });

        // SCENE 1 -> 2: Parallax Movement
        tl.to(
          ".moon",
          {
            y: -140,
            scale: 0.8,
            opacity: 0.6,
            ease: "power1.out",
          },
          0
        )
          .to(
            ".skyline",
            {
              y: 100,
              ease: "none",
            },
            0
          )
          .to(
            ".light-skyline",
            {
              y: 50,
              ease: "none",
            },
            0
          )
          .to(
            ".batman",
            {
              x: 80,
              y: 60,
              scale: 0.55,
              ease: "power1.inOut",
            },
            0
          )
          .to(
            ".light",
            {
              scale: 1.25,
              opacity: 0.5,
              y: -90,
              ease: "none",
            },
            0
          );

        // SCENE 3: Batman Exits, Scene Blurs into OneAtlas
        tl.to(
          ".batman",
          {
            x: 600,
            y: 200,
            opacity: 0,
            duration: 1.0,
            ease: "power2.in",
          },
          0.6
        )
          .to(
            [".skyline", ".light-skyline", ".light", ".moon"],
            {
              opacity: 0.1,
              filter: "blur(10px)",
              duration: 0.9,
              ease: "power2.out",
            },
            0.7
          )
          .to(
            backdrop,
            {
              backgroundColor: "rgba(4, 9, 5, 0.96)",
              backdropFilter: "blur(20px)",
              duration: 1.0,
              ease: "power2.inOut",
            },
            0.8
          );

        // SCENE 4: ONEATLAS Brand Reveal
        tl.fromTo(
          introEl,
          {
            opacity: 0,
            scale: 0.85,
            y: 50,
          },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
          },
          1.0
        );

        return () => {
          idleMoon.kill();
          idleLight.kill();
        };
      });

      // Mobile / Tablet Viewports (< 768px)
      mm.add("(max-width: 767px)", () => {
        const tlMobile = gsap.timeline({
          scrollTrigger: {
            trigger: pinEl,
            start: "top top",
            end: "+=1000",
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
          },
        });

        tlMobile
          .to(
            ".batman",
            {
              x: 220,
              opacity: 0,
              duration: 0.7,
              ease: "power2.in",
            },
            0
          )
          .to(
            [".skyline", ".light-skyline", ".moon", ".light"],
            {
              opacity: 0.15,
              duration: 0.7,
            },
            0.2
          )
          .to(
            backdrop,
            {
              backgroundColor: "rgba(4, 9, 5, 0.96)",
              duration: 0.7,
            },
            0.3
          )
          .fromTo(
            introEl,
            {
              opacity: 0,
              y: 35,
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.9,
            },
            0.5
          );
      });

      return () => mm.revert();
    },
    { scope: containerRef }
  );

  return (
    <>
      <ValorantAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(user) => setCurrentUser(user)}
      />

      {/* Outer Viewport Wrapper — Guarantees 100vw edge-to-edge, zero left margins */}
      <div ref={containerRef} className="relative w-screen max-w-full overflow-x-hidden">
        {/* Pinned Viewport Hero Section */}
        <div
          ref={pinSectionRef}
          className="relative w-full h-screen min-h-[600px] overflow-hidden select-none bg-[#09080c]"
        >
          {/* Base Batman Scene Canvas */}
          <div ref={batmanSceneWrapperRef} className="absolute inset-0 z-0">
            <BatmanScene
              lightActive={lightActive}
              onToggleLight={() => setLightActive(!lightActive)}
            />
          </div>

          {/* Darkening / Blurring Transition Backdrop */}
          <div
            ref={gothamBackdropRef}
            className="absolute inset-0 z-10 pointer-events-none transition-colors duration-300"
            style={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
          />

          {/* Top HUD Overlay Header (Scene 1) */}
          <header className="absolute top-6 left-6 right-6 z-20 flex items-center justify-between text-xs font-mono text-emerald-400">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="font-bold tracking-widest uppercase text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                ONEATLAS // GOTHAM INTELLIGENCE
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 bg-black/60 border border-emerald-500/30 text-[11px] text-emerald-300">
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                SIGNAL: {lightActive ? "ACTIVE" : "STANDBY"}
              </span>

              {/* Restored Skip Intro button */}
              <button
                type="button"
                onClick={scrollToPlatform}
                className="px-3.5 py-1.5 bg-black/70 hover:bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 hover:text-emerald-200 text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer"
                aria-label="Skip cinematic introduction and proceed to models"
              >
                <span>Skip Intro</span>
                <SkipForward className="w-3.5 h-3.5 text-emerald-400" />
              </button>
            </div>
          </header>

          {/* Scene 1 Initial Scroll Hint */}
          <div className="absolute bottom-8 left-8 z-20 hidden sm:flex items-center gap-2 text-xs font-mono text-emerald-400/90 tracking-widest uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>SCROLL TO ENGAGE RECON</span>
            <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
          </div>

          {/* Scene 4: ONEATLAS Brand Reveal Layer */}
          <div
            ref={introRevealRef}
            className="absolute inset-0 z-20 flex items-center justify-center pointer-events-auto"
            style={{ opacity: 0 }}
          >
            <OneAtlasIntroduction
              onExplore={scrollToPlatform}
              onOpenAuth={() => setAuthModalOpen(true)}
            />
          </div>
        </div>
      </div>
    </>
  );
}
