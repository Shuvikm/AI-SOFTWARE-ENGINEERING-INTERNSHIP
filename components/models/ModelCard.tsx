import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Model } from "@/types";
import { formatNumber, formatPrice } from "@/lib/utils";

export function ModelCard({
  model,
  showCompareAction = false,
  onCompareToggle,
  isComparing = false,
}: {
  model: Model;
  showCompareAction?: boolean;
  onCompareToggle?: (model: Model) => void;
  isComparing?: boolean;
}) {
  return (
    <div className="group relative rounded-xl bg-[#141005] border border-[#3d300a] p-5 hover:border-[#f59e0b] hover:bg-[#1b1506] transition-all flex flex-col justify-between shadow-xl shadow-black/50 font-mono hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="text-[11px] font-bold text-[#f59e0b] uppercase tracking-widest mb-1 truncate max-w-[170px]">
              {model.company?.name || "AI Lab"}
            </div>
            <Link
              href={`/models/${model.slug}`}
              className="text-base font-bold text-white group-hover:text-[#fbbf24] transition-colors flex items-center gap-1.5"
            >
              <span className="truncate">{model.name}</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#f59e0b] shrink-0" />
            </Link>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#271d05] text-[#fbbf24] border border-[#f59e0b]/40 shrink-0 uppercase tracking-wider">
            {model.modelType}
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-[#fde68a]/80 line-clamp-2 mb-4 leading-relaxed font-medium">
          {model.description || "Frontier AI model designed for advanced reasoning and intelligence."}
        </p>

        {/* Specs Highlights */}
        <div className="grid grid-cols-2 gap-2 py-3 border-y border-[#3d300a] mb-4 text-xs">
          <div>
            <span className="text-[#f59e0b] block text-[11px] uppercase font-bold tracking-wide">Context Window</span>
            <span className="font-bold text-white text-xs">
              {formatNumber(model.contextWindow)} tokens
            </span>
          </div>
          <div>
            <span className="text-[#f59e0b] block text-[11px] uppercase font-bold tracking-wide">Pricing (In / Out)</span>
            <span className="font-bold text-[#fbbf24] text-xs">
              {formatPrice(model.inputPrice)} / {formatPrice(model.outputPrice)}
            </span>
          </div>
        </div>

        {/* Capabilities badges */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {model.capabilities.slice(0, 3).map((cap) => (
            <span
              key={cap}
              className="text-[10px] px-2 py-0.5 rounded bg-[#271d05] text-[#fbbf24] border border-[#f59e0b]/30 font-mono uppercase font-semibold"
            >
              {cap}
            </span>
          ))}
          {model.capabilities.length > 3 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#161205] text-[#f59e0b] font-mono font-bold">
              +{model.capabilities.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-3 flex items-center justify-between gap-2 border-t border-[#3d300a]">
        <span className="text-[11px] text-[#fde68a] font-medium truncate max-w-[130px]">
          Via {model.provider?.name || "Provider"}
        </span>
        <div className="flex items-center gap-2">
          {showCompareAction && onCompareToggle && (
            <button
              onClick={() => onCompareToggle(model)}
              className={`text-xs px-2.5 py-1 rounded border font-bold uppercase transition-colors cursor-pointer ${
                isComparing
                  ? "bg-[#f59e0b] text-[#0d0b04] border-[#f59e0b] shadow-[0_0_10px_rgba(245,158,11,0.4)]"
                  : "bg-[#271d05] text-[#fbbf24] border-[#f59e0b]/50 hover:border-[#f59e0b]"
              }`}
            >
              {isComparing ? "Selected" : "+ Compare"}
            </button>
          )}
          <Link
            href={`/models/${model.slug}`}
            className="text-xs px-3 py-1 bg-[#271d05] hover:bg-[#382a08] text-[#fbbf24] border border-[#f59e0b]/50 font-bold uppercase tracking-wider transition-colors"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}
