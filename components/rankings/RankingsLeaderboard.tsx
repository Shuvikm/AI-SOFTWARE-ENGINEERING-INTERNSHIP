"use client";

import { useState } from "react";
import { Benchmark, ModelBenchmark } from "@/types";
import { Search, Trophy, ExternalLink, ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { formatNumber, formatPrice } from "@/lib/utils";

interface RankingsLeaderboardProps {
  benchmarks: Benchmark[];
  initialRankings: ModelBenchmark[];
}

const rankingTabs = [
  { id: "all", label: "Most Available" },
  { id: "intelligence", label: "Intelligence" },
  { id: "coding", label: "Coding" },
  { id: "agentic", label: "Agentic" },
  { id: "design", label: "Design Arena" },
  { id: "value", label: "Best Value" },
  { id: "cheapest", label: "Cheapest" },
  { id: "context", label: "Longest Context" },
  { id: "newest", label: "Newest" },
];

export function RankingsLeaderboard({
  benchmarks,
  initialRankings,
}: RankingsLeaderboardProps) {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLab, setSelectedLab] = useState("all");

  // Extract labs from rankings
  const labs = Array.from(
    new Set(
      initialRankings
        .map((r) => r.model?.company?.name)
        .filter((name): name is string => Boolean(name))
    )
  );

  // Filter rankings according to active tab, search query, and lab filter
  const filtered = initialRankings.filter((item) => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const nameMatch = item.model?.name?.toLowerCase().includes(q);
      const labMatch = item.model?.company?.name?.toLowerCase().includes(q);
      if (!nameMatch && !labMatch) return false;
    }

    // Lab filter
    if (selectedLab !== "all" && item.model?.company?.name !== selectedLab) {
      return false;
    }

    // Tab category filter
    if (activeTab === "coding") {
      return (
        item.benchmark?.category?.toLowerCase().includes("coding") ||
        item.model?.capabilities?.includes("code-generation") ||
        item.model?.capabilities?.includes("frontier-coding")
      );
    }
    if (activeTab === "intelligence") {
      return (
        item.benchmark?.category?.toLowerCase().includes("reasoning") ||
        item.model?.capabilities?.includes("complex-reasoning") ||
        item.model?.capabilities?.includes("chain-of-thought")
      );
    }
    if (activeTab === "cheapest") {
      return (item.model?.inputPrice || 0) <= 2.0;
    }
    if (activeTab === "context") {
      return (item.model?.contextWindow || 0) >= 128000;
    }

    return true;
  });

  // Top 3 models for summary cards
  const topThree = filtered.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* 1. Ranking Category Tabs (Inspired by OneAtlas Rankings Screenshot) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-[#373532]">
        {rankingTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 text-xs rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-[#373532] text-[#F5F3EF] font-semibold"
                  : "text-[#A7A39B] hover:text-[#F5F3EF] hover:bg-[#22211F]"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 2. Top-3 Model Summary Cards */}
      {topThree.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topThree.map((item, idx) => {
            const rankLabel = idx === 0 ? "1st Rank" : idx === 1 ? "2nd Rank" : "3rd Rank";
            const borderAccent =
              idx === 0
                ? "border-[#A7A39B]/50"
                : "border-[#373532]";

            return (
              <div
                key={item.id}
                className={`p-4 rounded-lg bg-[#22211F] border ${borderAccent} flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-[#A7A39B] mb-1">
                    <span className="font-semibold text-[#F5F3EF]">{rankLabel}</span>
                    <span>{item.model?.company?.name || "AI Lab"}</span>
                  </div>
                  <h3 className="text-base font-semibold text-[#F5F3EF] truncate">
                    {item.model?.name}
                  </h3>
                  <p className="text-xs text-[#A7A39B] mt-1 line-clamp-2">
                    {item.model?.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#373532] flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[#A7A39B] block text-[11px]">Score</span>
                    <span className="font-bold text-[#F5F3EF] text-sm">{item.score}%</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[#A7A39B] block text-[11px]">Context</span>
                    <span className="font-medium text-[#F5F3EF]">
                      {formatNumber(item.model?.contextWindow || 0)}
                    </span>
                  </div>
                  <Link
                    href={`/models/${item.model?.slug}`}
                    className="px-2.5 py-1 bg-[#373532] hover:bg-[#504D49] text-[#F5F3EF] rounded text-xs transition-colors"
                  >
                    View
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-[#A7A39B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Filter models or labs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#191817] border border-[#373532] rounded-md pl-8 pr-3 py-1.5 text-xs text-[#F5F3EF] placeholder-[#A7A39B] focus:outline-none focus:border-[#504D49] transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#A7A39B]">Lab:</span>
          <select
            value={selectedLab}
            onChange={(e) => setSelectedLab(e.target.value)}
            className="bg-[#191817] border border-[#373532] text-[#F5F3EF] rounded-md px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#504D49]"
          >
            <option value="all">All Labs ({labs.length})</option>
            {labs.map((lab) => (
              <option key={lab} value={lab}>
                {lab}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 4. Dense Data Rankings Table (Matching Screenshot Columns & Layout) */}
      <div className="rounded-lg border border-[#373532] bg-[#22211F] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#201F1D] text-[#A7A39B] uppercase text-[11px] font-semibold tracking-wider border-b border-[#373532]">
              <tr>
                <th className="py-3 px-4 w-14">Rank</th>
                <th className="py-3 px-4">Model</th>
                <th className="py-3 px-4">Providers</th>
                <th className="py-3 px-4">Context</th>
                <th className="py-3 px-4">Input Price</th>
                <th className="py-3 px-4">Output Price</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#373532] text-[#F5F3EF]">
              {filtered.map((item, index) => {
                const rankNum = item.rank || index + 1;
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-[#2A2926] transition-colors group"
                  >
                    {/* Rank */}
                    <td className="py-3 px-4 font-bold text-[#A7A39B]">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-[#191817] text-xs font-semibold">
                        {rankNum}
                      </span>
                    </td>

                    {/* Model & Creator */}
                    <td className="py-3 px-4">
                      <Link
                        href={`/models/${item.model?.slug}`}
                        className="font-medium hover:underline text-[#F5F3EF] flex items-center gap-1"
                      >
                        {item.model?.name}
                        <ExternalLink className="w-3 h-3 text-[#A7A39B] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                      <div className="text-[11px] text-[#A7A39B]">
                        {item.model?.company?.name || "Independent"}
                      </div>
                    </td>

                    {/* Providers Count & Name */}
                    <td className="py-3 px-4 text-[#A7A39B]">
                      {item.model?.provider?.name || "Direct API"}
                    </td>

                    {/* Context Window */}
                    <td className="py-3 px-4 font-mono text-xs">
                      {formatNumber(item.model?.contextWindow || 0)}
                    </td>

                    {/* Input Price */}
                    <td className="py-3 px-4 font-mono text-xs text-[#A7A39B]">
                      {formatPrice(item.model?.inputPrice || 0)} / 1M
                    </td>

                    {/* Output Price */}
                    <td className="py-3 px-4 font-mono text-xs text-[#A7A39B]">
                      {formatPrice(item.model?.outputPrice || 0)} / 1M
                    </td>

                    {/* Score */}
                    <td className="py-3 px-4 font-semibold text-[#F5F3EF]">
                      {item.score}%
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-center">
                      <Link
                        href={`/compare?models=${item.model?.slug}`}
                        className="text-xs px-2.5 py-1 rounded bg-[#373532] hover:bg-[#504D49] text-[#F5F3EF] transition-colors inline-block"
                      >
                        Compare
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
