"use client";

import { useState } from "react";
import { Model, Benchmark } from "@/types";
import { 
  Plus, 
  X, 
  GitCompare, 
  Check, 
  Minus, 
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import { formatNumber, formatPrice, formatDate } from "@/lib/utils";

export function ModelComparisonView({
  allModels,
  benchmarks,
  preselectedSlug,
}: {
  allModels: Model[];
  benchmarks: Benchmark[];
  preselectedSlug?: string;
}) {
  const initialSelected = allModels.filter((m) =>
    preselectedSlug ? m.slug === preselectedSlug : ["claude-3-5-sonnet", "openai-o1", "gemini-1-5-pro"].includes(m.slug)
  );

  const [selectedModels, setSelectedModels] = useState<Model[]>(
    initialSelected.length > 0 ? initialSelected : allModels.slice(0, 3)
  );
  const [modelToAdd, setModelToAdd] = useState("");

  const handleAddModel = (slug: string) => {
    if (!slug) return;
    const model = allModels.find((m) => m.slug === slug);
    if (model && !selectedModels.some((m) => m.id === model.id)) {
      if (selectedModels.length >= 4) {
        alert("You can compare up to 4 models simultaneously.");
        return;
      }
      setSelectedModels([...selectedModels, model]);
    }
    setModelToAdd("");
  };

  const handleRemoveModel = (id: string) => {
    setSelectedModels(selectedModels.filter((m) => m.id !== id));
  };

  // Collect all unique capabilities across selected models
  const allCapabilities = Array.from(
    new Set(selectedModels.flatMap((m) => m.capabilities))
  );

  const availableModelsToAdd = allModels.filter(
    (m) => !selectedModels.some((sm) => sm.id === m.id)
  );

  return (
    <div className="space-y-6 font-mono">
      {/* Control bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-[#141005] border border-[#3d300a]">
        <div className="flex items-center gap-2 text-xs text-[#fde68a]">
          <GitCompare className="w-4 h-4 text-[#f59e0b]" />
          <span>Comparing <strong className="text-white">{selectedModels.length}</strong> models (max 4)</span>
        </div>

        {availableModelsToAdd.length > 0 && selectedModels.length < 4 && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={modelToAdd}
              onChange={(e) => setModelToAdd(e.target.value)}
              className="bg-[#1b1506] border border-[#3d300a] rounded-lg px-3 py-1.5 text-xs text-[#fef3c7] focus:outline-none focus:border-[#f59e0b]"
            >
              <option value="">Select a model to add...</option>
              {availableModelsToAdd.map((m) => (
                <option key={m.id} value={m.slug}>
                  {m.name} ({m.company?.name || "AI Lab"})
                </option>
              ))}
            </select>
            <button
              onClick={() => handleAddModel(modelToAdd)}
              disabled={!modelToAdd}
              className="px-3 py-1.5 rounded-lg bg-[#f59e0b] hover:bg-[#fbbf24] disabled:opacity-50 text-black text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all shadow-[0_0_10px_rgba(245,158,11,0.3)]"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
        )}
      </div>

      {selectedModels.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-[#141005] border border-[#3d300a]">
          <p className="text-sm text-[#fde68a]/70">No models selected for comparison.</p>
          <button
            onClick={() => setSelectedModels(allModels.slice(0, 3))}
            className="mt-3 px-4 py-2 rounded-lg bg-[#f59e0b] hover:bg-[#fbbf24] text-black text-xs font-bold uppercase cursor-pointer"
          >
            Load Recommended Comparison
          </button>
        </div>
      ) : (
        /* Side by Side Comparison Table */
        <div className="overflow-x-auto rounded-xl border border-[#3d300a] bg-[#141005]">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#3d300a] bg-[#1b1506]">
                <th className="p-4 w-48 text-[#f59e0b] font-bold uppercase tracking-wider text-[11px]">
                  Attributes
                </th>
                {selectedModels.map((model) => (
                  <th key={model.id} className="p-4 min-w-[220px] max-w-[280px]">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] text-[#fbbf24] uppercase font-bold tracking-wider">
                          {model.company?.name}
                        </span>
                        <div className="text-base font-bold text-white mt-0.5">
                          {model.name}
                        </div>
                        <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded bg-[#271d05] text-[#fbbf24] border border-[#f59e0b]/30">
                          {model.modelType}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveModel(model.id)}
                        className="text-[#f59e0b]/60 hover:text-white p-1 rounded hover:bg-[#271d05] cursor-pointer"
                        title="Remove model"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3d300a]">
              {/* Provider Info */}
              <tr>
                <td className="p-4 font-semibold text-[#fde68a]/80 bg-[#141005]">Serving Provider</td>
                {selectedModels.map((m) => (
                  <td key={m.id} className="p-4 text-white">
                    {m.provider?.name || "Cloud API"}
                  </td>
                ))}
              </tr>

              {/* Context Window */}
              <tr>
                <td className="p-4 font-semibold text-[#fde68a]/80 bg-[#141005]">Context Window</td>
                {selectedModels.map((m) => (
                  <td key={m.id} className="p-4 text-white font-bold">
                    {formatNumber(m.contextWindow)} tokens
                  </td>
                ))}
              </tr>

              {/* Pricing */}
              <tr>
                <td className="p-4 font-semibold text-[#fde68a]/80 bg-[#141005]">Input Price (1M tokens)</td>
                {selectedModels.map((m) => (
                  <td key={m.id} className="p-4 text-[#fbbf24] font-bold">
                    {formatPrice(m.inputPrice)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-[#fde68a]/80 bg-[#141005]">Output Price (1M tokens)</td>
                {selectedModels.map((m) => (
                  <td key={m.id} className="p-4 text-[#fbbf24] font-bold">
                    {formatPrice(m.outputPrice)}
                  </td>
                ))}
              </tr>

              {/* Release Date */}
              <tr>
                <td className="p-4 font-semibold text-[#fde68a]/80 bg-[#141005]">Release Date</td>
                {selectedModels.map((m) => (
                  <td key={m.id} className="p-4 text-[#fde68a]/90">
                    {formatDate(m.releaseDate)}
                  </td>
                ))}
              </tr>

              {/* Modalities */}
              <tr>
                <td className="p-4 font-semibold text-[#fde68a]/80 bg-[#141005]">Modalities</td>
                {selectedModels.map((m) => (
                  <td key={m.id} className="p-4 text-white capitalize">
                    {m.modalities.join(", ") || "Text"}
                  </td>
                ))}
              </tr>

              {/* Benchmark Results */}
              <tr className="bg-[#271d05]">
                <td colSpan={selectedModels.length + 1} className="p-3 font-bold text-[#fbbf24] text-xs uppercase tracking-wider">
                  Frontier Benchmark Evaluations
                </td>
              </tr>
              {benchmarks.map((bm) => (
                <tr key={bm.id}>
                  <td className="p-4 font-semibold text-[#fde68a]/80 bg-[#141005]">
                    <div className="text-white">{bm.name.split(" ")[0]}</div>
                    <span className="text-[10px] text-[#f59e0b] block">{bm.category}</span>
                  </td>
                  {selectedModels.map((m) => {
                    const scoreObj = m.benchmarks?.find((b) => b.benchmarkId === bm.id);
                    return (
                      <td key={m.id} className="p-4">
                        {scoreObj ? (
                          <div className="font-extrabold text-sm text-[#fbbf24]">
                            {scoreObj.score}%
                          </div>
                        ) : (
                          <span className="text-[#3d300a] text-xs font-bold">N/A</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}

              {/* Capabilities checklist */}
              <tr className="bg-[#271d05]">
                <td colSpan={selectedModels.length + 1} className="p-3 font-bold text-[#fbbf24] text-xs uppercase tracking-wider">
                  Capabilities & Features
                </td>
              </tr>
              {allCapabilities.map((cap) => (
                <tr key={cap}>
                  <td className="p-4 font-semibold text-[#fde68a]/80 bg-[#141005] capitalize">
                    {cap.replace(/-/g, " ")}
                  </td>
                  {selectedModels.map((m) => {
                    const hasCap = m.capabilities.includes(cap);
                    return (
                      <td key={m.id} className="p-4">
                        {hasCap ? (
                          <span className="inline-flex items-center gap-1 text-[#fbbf24] font-semibold text-xs">
                            <Check className="w-4 h-4 text-[#f59e0b]" /> Supported
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[#3d300a] text-xs">
                            <Minus className="w-4 h-4" /> No
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
