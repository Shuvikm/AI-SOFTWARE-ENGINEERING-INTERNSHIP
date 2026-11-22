"use client";

import { useState } from "react";
import { Model, Provider, Company } from "@/types";
import { ModelCard } from "@/components/models/ModelCard";
import { 
  Search, 
  Grid3X3, 
  List, 
  ChevronLeft,
  ChevronRight,
  RotateCcw
} from "lucide-react";
import Link from "next/link";
import { formatNumber, formatPrice } from "@/lib/utils";

export function ModelExplorer({
  initialModels,
  companies,
  providers,
  categories,
  capabilities,
}: {
  initialModels: Model[];
  companies: Company[];
  providers: Provider[];
  categories: string[];
  capabilities: string[];
}) {
  const [search, setSearch] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCapability, setSelectedCapability] = useState("");
  const [sortBy, setSortBy] = useState<"popularity" | "releaseDate" | "contextWindow" | "benchmark">("popularity");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter models
  const filteredModels = initialModels.filter((model) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = model.name.toLowerCase().includes(q);
      const matchDesc = model.description?.toLowerCase().includes(q);
      const matchComp = model.company?.name.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchComp) return false;
    }
    if (selectedCompany && model.company?.slug !== selectedCompany && model.companyId !== selectedCompany) {
      return false;
    }
    if (selectedProvider && model.provider?.slug !== selectedProvider && model.providerId !== selectedProvider) {
      return false;
    }
    if (selectedCategory && model.modelType !== selectedCategory) {
      return false;
    }
    if (selectedCapability && !model.capabilities.includes(selectedCapability)) {
      return false;
    }
    return true;
  });

  // Sort models
  const sortedModels = [...filteredModels].sort((a, b) => {
    if (sortBy === "releaseDate") {
      const da = a.releaseDate ? new Date(a.releaseDate).getTime() : 0;
      const db = b.releaseDate ? new Date(b.releaseDate).getTime() : 0;
      return db - da;
    }
    if (sortBy === "contextWindow") {
      return b.contextWindow - a.contextWindow;
    }
    if (sortBy === "benchmark") {
      const maxA = Math.max(...(a.benchmarks?.map((bm) => bm.score) || [0]), 0);
      const maxB = Math.max(...(b.benchmarks?.map((bm) => bm.score) || [0]), 0);
      return maxB - maxA;
    }
    // popularity
    return (b.benchmarks?.length || 0) - (a.benchmarks?.length || 0);
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedModels.length / itemsPerPage));
  const paginatedModels = sortedModels.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const resetFilters = () => {
    setSearch("");
    setSelectedCompany("");
    setSelectedProvider("");
    setSelectedCategory("");
    setSelectedCapability("");
    setSortBy("popularity");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    search || selectedCompany || selectedProvider || selectedCategory || selectedCapability;

  return (
    <div className="space-y-6 font-mono">
      {/* Search and Filters Bar */}
      <div className="rounded-xl bg-[#141005] border border-[#3d300a] p-5 space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="w-4 h-4 text-[#f59e0b] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by model name or keyword..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#1b1506] border border-[#3d300a] rounded-lg pl-10 pr-4 py-2 text-sm text-[#fef3c7] placeholder-[#a88219] focus:outline-none focus:border-[#f59e0b]"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-1 bg-[#1b1506] p-1 rounded-lg border border-[#3d300a]">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-[#f59e0b] text-black"
                    : "text-[#fde68a]/70 hover:text-white"
                }`}
                title="Grid view"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-md cursor-pointer ${
                  viewMode === "list"
                    ? "bg-[#f59e0b] text-black"
                    : "text-[#fde68a]/70 hover:text-white"
                }`}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#1b1506] border border-[#3d300a] rounded-lg px-3 py-2 text-xs text-[#fef3c7] focus:outline-none focus:border-[#f59e0b]"
            >
              <option value="popularity">Sort by Popularity</option>
              <option value="releaseDate">Sort by Release Date</option>
              <option value="contextWindow">Sort by Context Length</option>
              <option value="benchmark">Sort by Benchmark Score</option>
            </select>
          </div>
        </div>

        {/* Filter dropdowns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-[#3d300a]">
          <div>
            <label className="block text-[10px] font-bold text-[#f59e0b] uppercase tracking-wider mb-1">
              AI Lab
            </label>
            <select
              value={selectedCompany}
              onChange={(e) => {
                setSelectedCompany(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#1b1506] border border-[#3d300a] rounded-lg px-2.5 py-1.5 text-xs text-[#fef3c7] focus:outline-none focus:border-[#f59e0b]"
            >
              <option value="">All AI Labs</option>
              {companies.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#f59e0b] uppercase tracking-wider mb-1">
              Serving Provider
            </label>
            <select
              value={selectedProvider}
              onChange={(e) => {
                setSelectedProvider(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#1b1506] border border-[#3d300a] rounded-lg px-2.5 py-1.5 text-xs text-[#fef3c7] focus:outline-none focus:border-[#f59e0b]"
            >
              <option value="">All Providers</option>
              {providers.map((p) => (
                <option key={p.id} value={p.slug}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#f59e0b] uppercase tracking-wider mb-1">
              Architecture / Type
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#1b1506] border border-[#3d300a] rounded-lg px-2.5 py-1.5 text-xs text-[#fef3c7] focus:outline-none focus:border-[#f59e0b]"
            >
              <option value="">All Architectures</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#f59e0b] uppercase tracking-wider mb-1">
              Capability
            </label>
            <select
              value={selectedCapability}
              onChange={(e) => {
                setSelectedCapability(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#1b1506] border border-[#3d300a] rounded-lg px-2.5 py-1.5 text-xs text-[#fef3c7] focus:outline-none focus:border-[#f59e0b]"
            >
              <option value="">All Capabilities</option>
              {capabilities.map((cap) => (
                <option key={cap} value={cap}>
                  {cap.replace(/-/g, " ")}
                </option>
              ))}
            </select>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex items-center justify-between text-xs text-[#fde68a]/70 pt-2 border-t border-[#3d300a]">
            <span>Showing {filteredModels.length} models matching filter criteria</span>
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 text-[#fbbf24] hover:text-white transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset all filters
            </button>
          </div>
        )}
      </div>

      {/* Model Display */}
      {paginatedModels.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-[#141005] border border-[#3d300a]">
          <p className="text-[#fde68a]/70 text-sm">No models found matching your selected filters.</p>
          <button
            onClick={resetFilters}
            className="mt-3 text-xs px-3.5 py-1.5 rounded-lg bg-[#f59e0b] text-black font-bold uppercase cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {paginatedModels.map((model) => (
            <ModelCard key={model.id} model={model} />
          ))}
        </div>
      ) : (
        /* List View */
        <div className="rounded-xl border border-[#3d300a] bg-[#141005] overflow-hidden divide-y divide-[#3d300a]">
          {paginatedModels.map((model) => (
            <div
              key={model.id}
              className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#1b1506] transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#fbbf24]">
                    {model.company?.name}
                  </span>
                  <span className="text-[#3d300a]">•</span>
                  <span className="text-xs text-[#fde68a]/70">{model.modelType}</span>
                </div>
                <Link
                  href={`/models/${model.slug}`}
                  className="text-base font-bold text-white hover:text-[#fbbf24] transition-colors"
                >
                  {model.name}
                </Link>
                <p className="text-xs text-[#fde68a]/80 max-w-xl">{model.description}</p>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-xs">
                <div>
                  <span className="text-[#f59e0b] block text-[10px] font-bold">Context</span>
                  <span className="font-semibold text-white">
                    {formatNumber(model.contextWindow)}
                  </span>
                </div>
                <div>
                  <span className="text-[#f59e0b] block text-[10px] font-bold">In / Out Price</span>
                  <span className="font-semibold text-[#fbbf24]">
                    {formatPrice(model.inputPrice)} / {formatPrice(model.outputPrice)}
                  </span>
                </div>
                <div>
                  <span className="text-[#f59e0b] block text-[10px] font-bold">Top Score</span>
                  <span className="font-semibold text-[#fbbf24]">
                    {Math.max(...(model.benchmarks?.map((b) => b.score) || [0]), 0) || "N/A"}%
                  </span>
                </div>
                <Link
                  href={`/models/${model.slug}`}
                  className="px-3 py-1.5 rounded-lg bg-[#271d05] border border-[#f59e0b]/40 hover:bg-[#382a08] text-[#fbbf24] font-bold text-xs uppercase transition-colors"
                >
                  View Model
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-[#3d300a]">
          <p className="text-xs text-[#fde68a]/70">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-[#141005] border border-[#3d300a] text-[#fbbf24] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#271d05] cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-[#141005] border border-[#3d300a] text-[#fbbf24] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#271d05] cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
