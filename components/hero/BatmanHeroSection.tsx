"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LogIn, ShieldCheck, Terminal, ChevronDown, Radio, Zap } from "lucide-react";
import { ValorantAuthModal } from "@/components/auth/ValorantAuthModal";
import Link from "next/link";

export function BatmanHeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);
  const [lightActive, setLightActive] = useState(true);
  const [signalPhase, setSignalPhase] = useState(0);

  const signalLabels = ["SCANNING", "LOCKED ON", "TRANSMITTING", "ACTIVE"];

  useEffect(() => {
    // Check logged in user
    const stored = localStorage.getItem("oneatlas_user");
    if (stored) {
      try {
        setCurrentUser(JSON.parse(stored));
      } catch {
        /* ignore */
      }
    }

    const phaseInterval = setInterval(() => setSignalPhase((p) => (p + 1) % 4), 900);

    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Set initial positions for the pure white cloud elements
      gsap.set(["#cloudStart-L", "#cloudStart-R"], { x: 0, opacity: 0.9 });

      // ── BUTTERY SMOOTH WHITE CLOUDS SCROLL ANIMATION ──
      const cloudsTL = gsap.timeline();
      ScrollTrigger.create({
        animation: cloudsTL,
        trigger: ".parallaxScrollElement",
        start: "top top",
        end: "100% 100%",
        scrub: 1.2,
      });

      // Floating white clouds diverge smoothly as you scroll down
      cloudsTL.to("#cloud1", { x: 450, ease: "none", force3D: true }, 0);
      cloudsTL.to("#cloud2", { x: 800, ease: "none", force3D: true }, 0);
      cloudsTL.to("#cloud3", { x: -800, ease: "none", force3D: true }, 0);
      cloudsTL.to("#cloud4", { x: -550, y: 35, ease: "none", force3D: true }, 0);
      cloudsTL.to("#cloudsBig-L", { x: -350, y: 150, opacity: 0.1, ease: "none", force3D: true }, 0);
      cloudsTL.to("#cloudsBig-R", { x: 350, y: 150, opacity: 0.1, ease: "none", force3D: true }, 0);
      cloudsTL.to("#cloudStart-L", { x: -280, opacity: 0, ease: "none", force3D: true }, 0);
      cloudsTL.to("#cloudStart-R", { x: 280, opacity: 0, ease: "none", force3D: true }, 0);

      // Hero Center text badge parallax
      gsap.to(".center-hero-badge", {
        y: -140,
        opacity: 0,
        scale: 0.94,
        ease: "power1.out",
        force3D: true,
        scrollTrigger: {
          trigger: ".parallaxScrollElement",
          start: "5% top",
          end: "35% top",
          scrub: 0.8,
        },
      });

      // Immediate Scroll-Gate: trigger authentication modal right when starting to scroll
      ScrollTrigger.create({
        trigger: ".parallaxScrollElement",
        start: "8% top",
        onEnter: () => {
          const user = localStorage.getItem("oneatlas_user");
          if (!user) {
            setAuthModalOpen(true);
          }
        },
      });
    }, containerRef);

    return () => {
      clearInterval(phaseInterval);
      ctx.revert();
    };
  }, []);

  const handleExploreClick = () => {
    if (!currentUser) {
      setAuthModalOpen(true);
    }
    document.getElementById("platform-content")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden select-none font-mono">
      {/* Auth Modal */}
      <ValorantAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
          localStorage.setItem("oneatlas_user", JSON.stringify(user));
        }}
      />

      {/* ── STICKY VIEWPORT CONTAINER (Holds Pure CSS Batman background + White Clouds overlay) ── */}
      <div className="fixed top-0 left-0 w-full h-screen z-10 pointer-events-none overflow-hidden">
        {/* 1. ORIGINAL PURE CSS BATMAN BACKGROUND SCENE */}
        <div className="batman-pure-scene absolute inset-0 z-10">
          <div className="sky">
            <div className="moon" />
          </div>

          <div className="skyline" />

          {/* Bat-Signal */}
          <div className={`light transition-opacity duration-700 ${lightActive ? "opacity-90" : "opacity-30"}`}>
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

        {/* 2. PURE WHITE CLOUDS SVG PARALLAX (Only crisp white clouds — Hardware accelerated, zero lag) */}
        <svg
          className="parallax absolute inset-0 w-full h-full z-20 pointer-events-none transform-gpu will-change-transform"
          viewBox="0 0 750 500"
          preserveAspectRatio="xMidYMax slice"
        >
          {/* Upper drifting white clouds */}
          <g id="clouds" fill="#ffffff" opacity="0.85">
            <path
              id="cloud4"
              transform="translate(600 0)"
              d="M402.34,341.68c9.9-10.24,23.76-7.43,36.05-5.48C448,332,458.88,329,468.9,334c-.95-7.91,8.65-14.92,15.9-11.61-3.34-11.77,13-13.9,20.53-8.34A13.53,13.53,0,0,1,522,310.16c2.64-18.11,27.85-24.13,38.38-9.17,3.54-5.51,12.12-6.88,17.2-2.74,6.59-43.22,70.78-27.93,65.83,12.62,14.7-4.43,32,6.72,34.08,21.93,5.76-2.23,29.28,1,21.76,9.26"
            />
            <path
              id="cloud3"
              transform="translate(600 0)"
              d="M382.94,363.16c-7-10.5-18.72-9.06-28.19-4.53-12.19-6.71-26.73-11.74-39.62-3.13,1-15.45-18-25.51-28-12.41-14.59-29.67-56.68-34.41-72-3.09-1.41,4-4.73,6.07-8.1,2.88-23.13-25.66-57.12-30.25-67.73,8.21-13.05-1.88-33.42-9.15-37.47,10.07a38.08,38.08,0,0,0-36.36,2.11"
            />
            <path
              id="cloud2"
              transform="translate(-600 0)"
              d="M506.86,233.56c9.62-3.21,23.27-4,33.88-2.17,0-5.7,10.4-6.68,14-3.58,10.32-12.45,29.93-5.12,40.08,0,10.06-6.52,27.67-9.72,33.93,2.42,5.53-.13,15.88-3.23,18.8,2.94a31.53,31.53,0,0,1,18.21.64"
            />
            <path
              id="cloud1"
              transform="translate(-600 0)"
              d="M402.18,271.3c-7.57-7.46-18.46-7.52-28.05-5.3-6.75-8.79-20.54-13.18-27.24-1.45-10.4-11.06-30.66-24.2-37.74-2.24a13.1,13.1,0,0,0-17.76,1.47c-11.23-25.69-58.46-41.29-64.24-4.06-9-8.26-20.15-2.62-27.47,4.4-11-2.87-22.18-7.58-31.72,2.7-8.44-.75-18.1-2.8-24.71,4.57"
            />
          </g>

          {/* Foreground sweeping white clouds */}
          <g fill="#ffffff">
            <path
              id="cloudStart-L"
              d="m71.1,92.9c-.1,0-.3.2-.4.3-1.9-8.3-13.5-3.3-13.9,2.6.2,1.8,1.2,6.2-2.3,6.3-5.6-2.6-5.5.3-9.8,2.7-2.6-2.5-10-.6-9.9,3.4,49.8-1.3,91.9-1.8,126.3-1.6,1.4-6.6-5.5-5.8-9.2-4.5,1.5-3.2-4.1-2.8-5.5-2,.1-2.1.2-3.4-2.1-2.6,2.8-9.8-13.1-10.3-14.1-3-.6,3.2-1.2,4.8-1.8,4.8-4.5-1.5-3.8-.3-7.8.9-2.3-1.1-2.3-5.2-6.4-3.1.2.3-.3.4-.4.6,3.1-5.3,4.2-10.3-2.3-10.4-.2-23.2-37.4-15.3-30.4,6-1.9-3.8-6.7-2.5-9.8-.3"
              opacity="0.8"
            />
            <path
              id="cloudStart-R"
              d="m710.3,103c0,1,1.2,1.6,2.2,1.2,17.9,1.7,6.4-8.6-2.2-1.2m-33.1-20.8c1.3-14.4-17.6-14.4-23.3-4-3.9-3.6-10.3-3-15.1.2-3.2-19-36.9-14.1-38.2,3.4-7-3.1-14.1,3.4-16.9,9.7-4.5-8.1-12.7,1.8-11.6,7.7-2.5-.5-11.8,1.6-11,6.1,42.2-1.2,102.5.2,144.8-.8,3.3-4.7-5.7-6.8-7.6-5.1-.2-4.8-4.9-8.8-9.5-5.3-.6-6.1-5.4-9.8-11.8-8.9.1-.8.2-1.8.2-2.9m53,21.7c2-2.8-6-3.4-4.2-.1.5.8,3.6.8,4.2.1Z"
              opacity="0.8"
            />
            <path
              id="cloudsBig-L"
              d="m286.9,293.2c-94.4,24-191.8,46.4-288.9,41.9v-162.1c13.2,4.6,24.7,14.5,30.1,27.5,10.1-3.4,21,1.7,28.5,9.2,19.1-13,49.9-6.4,61.2,14.2,5.8-1.7,14.9,3.6,16.4,9.5,22-21,63.1-11.5,73,17.7,10.1-4.8,22.4,4.3,20.8,15.3,21.5-7.9,51.8,3.9,58.8,26.9Z"
              opacity="0.35"
            />
            <path
              id="cloudsBig-R"
              d="m797.3,100.5l26.8,179.4c-163.5,24.8-334,76.2-497.6,41.2,8.7-15.6,30.8-21.9,46.5-13.3,1.3-7.7,12.5-13,19.2-8.8,2.5-36.5,49.1-57.4,76.5-31.8,6.3-8.4,19.2-12.4,29.1-8.9,5.1-12.3,18.3-19.2,29.7-12.4.7-39.5,48.9-63.5,80.9-40.4,5.1-4.6,15.4-4.4,21.2-.8,9.8-19.9,38.8-31.3,59.6-23.7,2.5-30.2,39.5-54,67.9-40.6,3.5-18.2,22.4-34.5,40.1-39.7Z"
              opacity="0.35"
            />
          </g>
        </svg>

        {/* ── AMBIENT VIGNETTE OVERLAYS ── */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30 pointer-events-none z-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent pointer-events-none z-20" />
        <div className="absolute inset-0 scanlines pointer-events-none z-20" />

        {/* ── TOP HUD HEADER ── */}
        <header className="relative z-40 px-6 sm:px-12 pt-6 flex items-center justify-between text-xs text-amber-400 pointer-events-auto">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-500" />
            </span>
            <span className="font-black tracking-widest uppercase text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] text-xs sm:text-sm">
              ONEATLAS <span className="text-amber-400">//</span> GOTHAM PROTOCOL
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-amber-400/80">
            <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-black/80 border border-amber-500/40 backdrop-blur-md rounded-sm">
              <Radio className="w-3 h-3 text-amber-400 animate-pulse" />
              <span className="text-amber-300 font-bold">{signalLabels[signalPhase]}</span>
            </span>
            <button
              onClick={() => setLightActive((l) => !l)}
              className="px-2.5 py-1 bg-black/80 border border-amber-500/40 backdrop-blur-md rounded-sm hover:border-amber-400 hover:text-amber-200 transition-all cursor-pointer"
            >
              {lightActive ? "◉ SIGNAL ON" : "○ SIGNAL OFF"}
            </button>
          </div>
        </header>

        {/* ── EXACT CENTER HERO HEADLINE (DISCOVER. COMPARE. INTELLIGENCE.) ── */}
        <div className="center-hero-badge absolute inset-0 z-30 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-black/90 border border-amber-500/60 text-amber-400 text-[10px] sm:text-xs font-black tracking-[0.3em] uppercase mb-4 shadow-[0_0_25px_rgba(245,158,11,0.3)] backdrop-blur-md rounded-sm">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
            AI MODEL INTELLIGENCE PLATFORM
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tight text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)] leading-[0.92]">
            DISCOVER.<br />
            <span className="text-amber-400 drop-shadow-[0_0_40px_rgba(245,158,11,0.95)]">
              COMPARE.
            </span>
            <br />
            <span className="text-white/60 text-4xl sm:text-6xl md:text-7xl">INTELLIGENCE.</span>
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-amber-100/90 max-w-xl mt-6 leading-relaxed drop-shadow-[0_2px_15px_rgba(0,0,0,0.95)]">
            Explore state-of-the-art foundation models — benchmark scores, token pricing,
            context windows, and capabilities from the world&apos;s leading research labs.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-8 pointer-events-auto">
            {!currentUser ? (
              <button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                className="px-5 py-3 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-wider text-xs sm:text-sm shadow-[0_0_30px_rgba(245,158,11,0.7)] hover:shadow-[0_0_40px_rgba(245,158,11,0.9)] flex items-center gap-2 transition-all active:scale-95 cursor-pointer rounded-sm"
              >
                <LogIn className="w-4 h-4" />
                OPERATOR ACCESS / SIGN IN
              </button>
            ) : (
              <div className="px-4 py-3 bg-amber-950/90 border border-amber-400 text-amber-300 font-bold uppercase text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.4)] rounded-sm">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                OPERATOR: {currentUser.name}
              </div>
            )}

            <button
              type="button"
              onClick={handleExploreClick}
              className="px-5 py-3 border border-amber-500/60 bg-black/80 hover:bg-amber-950/80 text-amber-300 hover:text-amber-100 font-bold uppercase tracking-wider text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer backdrop-blur-md rounded-sm hover:border-amber-400"
            >
              <Terminal className="w-3.5 h-3.5 shrink-0" />
              &gt;_ EXPLORE MODELS
            </button>

            <Link
              href="/rankings"
              className="px-4 py-3 border border-amber-500/40 bg-black/70 hover:bg-amber-950/60 text-amber-400/90 hover:text-amber-300 font-bold uppercase tracking-wider text-xs flex items-center gap-2 transition-all backdrop-blur-md rounded-sm"
            >
              LEADERBOARD →
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-8 text-[10px] sm:text-xs text-amber-500/80 font-mono tracking-widest uppercase">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              FRONTIER MODELS
            </span>
            <span className="text-amber-800">|</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
              LIVE BENCHMARKS
            </span>
            <span className="text-amber-800">|</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-700" />
              REAL-TIME PRICING
            </span>
          </div>
        </div>

        {/* ── FOOTER PROMPT ── */}
        <footer className="absolute bottom-6 left-6 right-6 z-40 flex items-center justify-between text-xs text-amber-500/80 pointer-events-auto">
          <button
            type="button"
            onClick={handleExploreClick}
            className="group flex items-center gap-2 font-bold uppercase tracking-[0.25em] text-amber-400 hover:text-amber-300 cursor-pointer transition-colors"
          >
            <ChevronDown className="w-4 h-4 animate-bounce" />
            SCROLL TO DISCOVER &amp; ENGAGE
          </button>

          <div className="hidden sm:flex items-center gap-4 text-[10px] text-amber-600/70 tracking-widest">
            <span>NEON POSTGRESQL ✦ PERSISTED</span>
            <span className="w-1 h-1 rounded-full bg-amber-600 animate-pulse" />
            <span>GOTHAM INTELLIGENCE</span>
          </div>
        </footer>
      </div>

      {/* ── LIGHTWEIGHT SMOOTH SCROLL TRACK (No heavy layers, no lag) ── */}
      <div className="parallaxScrollElement relative w-full h-[1200px] pointer-events-none" />
    </div>
  );
}
