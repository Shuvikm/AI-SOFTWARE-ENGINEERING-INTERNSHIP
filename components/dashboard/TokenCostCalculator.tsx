"use client";

import { useState } from "react";
import { Model } from "@/types";
import { Calculator } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

export function TokenCostCalculator({ models }: { models: Model[] }) {
  const [inputTokens, setInputTokens] = useState<number>(1000000);
  const [outputTokens, setOutputTokens] = useState<number>(200000);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredModels = selectedCategory === "all"
    ? models
    : models.filter((m) => m.modelType === selectedCategory);

  const calculated = filteredModels.map((m) => {
    const inputCost = (inputTokens / 1000000) * m.inputPrice;
    const outputCost = (outputTokens / 1000000) * m.outputPrice;
    const totalCost = inputCost + outputCost;
    return { ...m, inputCost, outputCost, totalCost };
  }).sort((a, b) => a.totalCost - b.totalCost).slice(0, 8);

  const categories = Array.from(new Set(models.map((m) => m.modelType)));

  return (
    <div className="rounded-2xl bg-[#141005] border border-[#3d300a] p-4 sm:p-6 space-y-4 sm:space-y-5 font-mono shadow-xl flex flex-col hover:border-[#f59e0b]/60 transition-all w-full">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
              <Calculator className="w-4 h-4 text-[#fbbf24] shrink-0" />
              Frontier Token Cost Calculator
            </h2>
            <p className="text-xs text-[#fde68a]/70 mt-1 font-medium">
              Simulate monthly API token costs across frontier models.
            </p>
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#1b1506] border border-[#3d300a] text-[#fef3c7] rounded px-2.5 py-1 text-xs focus:outline-none focus:border-[#f59e0b] uppercase tracking-wide font-mono cursor-pointer shrink-0 w-full sm:w-auto"
          >
            <option value="all">All Architectures</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Sliders — stack vertically on mobile, 2-col on sm */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[#1b1506] border border-[#3d300a]">
          {/* Input tokens */}
          <div>
            <div className="flex justify-between items-center text-xs font-bold text-[#f59e0b] mb-2 uppercase">
              <span>Input Tokens:</span>
              <span className="text-white font-bold bg-[#271d05] px-2.5 py-0.5 border border-[#f59e0b]/40 rounded tabular-nums">
                {(inputTokens / 1000).toLocaleString()}k
              </span>
            </div>
            <input
              type="range"
              min="100000"
              max="10000000"
              step="100000"
              value={inputTokens}
              onChange={(e) => setInputTokens(Number(e.target.value))}
              className="w-full accent-[#f59e0b] cursor-pointer h-2 bg-[#271d05] rounded"
            />
            <div className="flex justify-between text-[10px] text-[#f59e0b]/70 font-bold mt-1.5">
              <span>100K</span><span>10M</span>
            </div>
          </div>

          {/* Output tokens */}
          <div>
            <div className="flex justify-between items-center text-xs font-bold text-[#f59e0b] mb-2 uppercase">
              <span>Output Tokens:</span>
              <span className="text-white font-bold bg-[#271d05] px-2.5 py-0.5 border border-[#f59e0b]/40 rounded tabular-nums">
                {(outputTokens / 1000).toLocaleString()}k
              </span>
            </div>
            <input
              type="range"
              min="50000"
              max="5000000"
              step="50000"
              value={outputTokens}
              onChange={(e) => setOutputTokens(Number(e.target.value))}
              className="w-full accent-[#f59e0b] cursor-pointer h-2 bg-[#271d05] rounded"
            />
            <div className="flex justify-between text-[10px] text-[#f59e0b]/70 font-bold mt-1.5">
              <span>50K</span><span>5M</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cost Table — horizontally scrollable on mobile */}
      <div className="border border-[#3d300a] rounded-xl overflow-hidden">
        <div className="overflow-x-auto max-h-56 overflow-y-auto">
          <table className="w-full text-left text-xs font-mono min-w-[380px]">
            <thead className="bg-[#1b1506] text-[11px] text-[#f59e0b] uppercase tracking-wider border-b border-[#3d300a] sticky top-0 font-bold">
              <tr>
                <th className="py-2.5 px-3">Model</th>
                <th className="py-2.5 px-3 hidden sm:table-cell">Rate (In/Out)</th>
                <th className="py-2.5 px-3 text-right">Est. Cost</th>
                <th className="py-2.5 px-3 text-center">Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3d300a]/60 bg-[#141005]">
              {calculated.map((m) => (
                <tr key={m.id} className="hover:bg-[#271d05]/50 transition-colors">
                  <td className="py-2.5 px-3">
                    <div className="font-bold text-white truncate max-w-[120px] sm:max-w-[180px]">{m.name}</div>
                    <div className="text-[10px] text-[#f59e0b] font-semibold truncate">{m.company?.name}</div>
                  </td>
                  <td className="py-2.5 px-3 text-xs text-[#fde68a]/80 font-medium hidden sm:table-cell">
                    {formatPrice(m.inputPrice)} / {formatPrice(m.outputPrice)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-[#fbbf24] text-sm tabular-nums">
                    {formatPrice(m.totalCost)}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <Link
                      href={`/models/${m.slug}`}
                      className="text-xs font-bold text-[#f59e0b] hover:text-white underline underline-offset-2"
                    >
                      Specs
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
