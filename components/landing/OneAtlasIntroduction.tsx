"use client";

import { ArrowRight, ChevronDown, Sparkles, Terminal } from "lucide-react";

interface OneAtlasIntroductionProps {
  onExplore: () => void;
  onOpenAuth?: () => void;
  className?: string;
}

export function OneAtlasIntroduction({
  onExplore,
  onOpenAuth,
  className = "",
}: OneAtlasIntroductionProps) {
  return (
    <div
      className={`w-full max-w-4xl mx-auto px-6 text-center select-none font-mono ${className}`}
      data-testid="oneatlas-intro"
    >
      {/* Category / Signal Protocol Badge with Emerald Halo */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0a1810] border border-[#10b981]/60 text-[#34d399] text-xs font-mono tracking-widest uppercase mb-6 shadow-[0_0_25px_rgba(16,185,129,0.35)] backdrop-blur-md">
        <Terminal className="w-3.5 h-3.5 text-[#34d399]" />
        <span className="font-bold">&gt;_ GOTHAM INTELLIGENCE // STARDUST PROTOCOL</span>
      </div>

      {/* Brand Title: Crisp White ONE with Glowing Emerald ATLAS */}
      <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight text-white uppercase leading-none drop-shadow-[0_10px_40px_rgba(0,0,0,0.95)]">
        ONE<span className="text-[#10b981] drop-shadow-[0_0_45px_rgba(16,185,129,0.9)]">ATLAS</span>
      </h1>

      {/* Subtitle in Glowing Emerald */}
      <p className="mt-4 text-sm sm:text-base md:text-lg font-mono text-[#34d399] font-bold tracking-widest uppercase drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">
        AI MODEL DISCOVERY &amp; INTELLIGENCE
      </p>

      {/* Description */}
      <p className="mt-5 max-w-2xl mx-auto text-sm sm:text-base text-[#ecfdf5]/90 font-mono leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
        Discover, compare and evaluate the world&apos;s leading AI models in one intelligent ecosystem.
      </p>

      {/* Action Buttons: Exact Styling from User Screenshot */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          onClick={onExplore}
          className="group px-7 py-3.5 bg-[#10b981] hover:bg-[#34d399] text-[#051109] font-mono font-black uppercase tracking-wider text-xs sm:text-sm shadow-[0_0_35px_rgba(16,185,129,0.8)] hover:shadow-[0_0_50px_rgba(16,185,129,1)] flex items-center gap-2.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          <span>EXPLORE MODELS</span>
          <ArrowRight className="w-4 h-4 text-[#051109] group-hover:translate-x-1 transition-transform" />
        </button>

        {onOpenAuth && (
          <button
            type="button"
            onClick={onOpenAuth}
            className="px-6 py-3.5 bg-[#0a160f]/90 hover:bg-[#0e2318] border border-[#10b981]/70 text-[#34d399] hover:text-white font-mono font-bold uppercase tracking-wider text-xs sm:text-sm backdrop-blur-md flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.25)] cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#34d399]" />
            <span>OPERATOR ACCESS</span>
          </button>
        )}
      </div>

      {/* Scroll indicator prompt */}
      <div className="mt-12 flex flex-col items-center gap-1.5 text-xs font-mono text-[#10b981] tracking-widest uppercase font-bold drop-shadow-[0_0_10px_rgba(16,185,129,0.6)]">
        <span>SCROLL DOWN FOR DEEP TELEMETRY</span>
        <ChevronDown className="w-4 h-4 animate-bounce text-[#34d399]" />
      </div>
    </div>
  );
}
