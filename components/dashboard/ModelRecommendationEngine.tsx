"use client";

import { useState } from "react";
import { Model } from "@/types";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatNumber, formatPrice } from "@/lib/utils";

const useCases = [
  { id: "coding", label: "Software Engineering & Coding", desc: "Code generation, debugging, SWE-bench." },
  { id: "reasoning", label: "Reasoning & STEM", desc: "Chain-of-thought, Olympiad math, science." },
  { id: "multimodal", label: "Multimodal Vision & Video", desc: "Image captioning, video comprehension." },
  { id: "fast-inference", label: "Low Latency & Throughput", desc: "Sub-second streaming, real-time inference." },
];

export function ModelRecommendationEngine({ allModels }: { allModels: Model[] }) {
  const [selectedUseCase, setSelectedUseCase] = useState("coding");
  const [budgetTier, setBudgetTier] = useState<"all" | "low" | "medium">("all");

  const recommendedModels = allModels.filter((m) => {
    if (selectedUseCase === "coding") {
      if (!m.capabilities.includes("frontier-coding") && !m.capabilities.includes("code-generation") && !m.capabilities.includes("fill-in-the-middle")) return false;
    } else if (selectedUseCase === "reasoning") {
      if (!m.capabilities.includes("chain-of-thought") && !m.capabilities.includes("complex-reasoning")) return false;
    } else if (selectedUseCase === "multimodal") {
      if (m.modalities.length <= 1 && !m.capabilities.includes("multimodal-reasoning")) return false;
    } else if (selectedUseCase === "fast-inference") {
      if (!m.capabilities.includes("fast-inference") && !m.capabilities.includes("ultra-fast") && !m.capabilities.includes("low-latency")) return false;
    }
    if (budgetTier === "low" && m.inputPrice > 1.0) return false;
    if (budgetTier === "medium" && m.inputPrice > 4.0) return false;
    return true;
  }).slice(0, 3);

  return (
    <div className="rounded-2xl bg-[#141005] border border-[#3d300a] p-4 sm:p-6 space-y-4 sm:space-y-5 font-mono shadow-xl flex flex-col hover:border-[#f59e0b]/60 transition-all w-full">
      <div>
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#f59e0b] mb-1 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#fbbf24] shrink-0" />
              <span>AI Recommendation Engine</span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-tight">
              Optimal Models For Workload
            </h2>
            <p className="text-xs text-[#fde68a]/70 mt-1 font-medium">
              Verified recommendations matched against benchmark evidence.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-[#f59e0b] uppercase font-bold whitespace-nowrap">Budget:</span>
            <select
              value={budgetTier}
              onChange={(e) => setBudgetTier(e.target.value as "all" | "low" | "medium")}
              className="bg-[#1b1506] border border-[#3d300a] text-[#fef3c7] rounded px-2 py-1 text-xs focus:outline-none focus:border-[#f59e0b] uppercase tracking-wide font-mono cursor-pointer w-full sm:w-auto"
            >
              <option value="all">Any Budget</option>
              <option value="medium">Balanced (≤ $4/1M)</option>
              <option value="low">Economy (≤ $1/1M)</option>
            </select>
          </div>
        </div>

        {/* Use Case Grid — 1 col mobile, 2 col sm+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
          {useCases.map((uc) => (
            <button
              key={uc.id}
              onClick={() => setSelectedUseCase(uc.id)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                selectedUseCase === uc.id
                  ? "bg-[#271d05] border-[#f59e0b] text-white shadow-[0_0_20px_rgba(245,158,11,0.25)]"
                  : "bg-[#161205] border-[#3d300a] text-[#fde68a]/60 hover:text-white hover:border-[#f59e0b]/50"
              }`}
            >
              <div className="text-xs font-bold uppercase tracking-tight truncate">
                {uc.label}
              </div>
              <div className="text-[11px] text-[#f59e0b]/70 mt-1 line-clamp-1 leading-relaxed">
                {uc.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Results — stack on mobile, 3-col on sm+ */}
      {recommendedModels.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {recommendedModels.map((m, idx) => (
            <div
              key={m.id}
              className="p-3.5 rounded-xl bg-[#1b1506] border border-[#3d300a] flex flex-col justify-between relative overflow-hidden hover:border-[#f59e0b] transition-all group"
            >
              {idx === 0 && (
                <span className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#f59e0b]/20 text-[#fbbf24] border border-[#f59e0b]/50 uppercase">
                  Top Pick
                </span>
              )}
              <div>
                <div className="text-[10px] uppercase font-bold text-[#f59e0b] truncate tracking-wider">{m.company?.name}</div>
                <h3 className="text-sm font-bold text-white mt-1 truncate group-hover:text-[#fbbf24] transition-colors">{m.name}</h3>
                <p className="text-xs text-[#fde68a]/70 mt-1.5 line-clamp-2 leading-relaxed">{m.description}</p>

                <div className="mt-3 pt-2 border-t border-[#3d300a] space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#f59e0b] text-[11px] uppercase font-semibold">Context:</span>
                    <span className="font-bold text-white">{formatNumber(m.contextWindow)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#f59e0b] text-[11px] uppercase font-semibold">Rate:</span>
                    <span className="font-bold text-[#fbbf24]">{formatPrice(m.inputPrice)}/{formatPrice(m.outputPrice)}</span>
                  </div>
                </div>
              </div>

              <Link
                href={`/models/${m.slug}`}
                className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#f59e0b] hover:text-white transition-colors"
              >
                <span>Specs</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center text-xs text-[#fde68a]/50 font-mono border border-[#3d300a] rounded-xl bg-[#161205]">
          No models match the selected filters. Try adjusting budget or use case.
        </div>
      )}
    </div>
  );
}
