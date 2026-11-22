import { AppShell } from "@/components/layout/AppShell";
import { BenchmarkService } from "@/services/benchmark.service";
import Link from "next/link";
import { Award, ArrowRight, BarChart2 } from "lucide-react";

export default async function BenchmarksPage() {
  const benchmarks = await BenchmarkService.getAll();

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          {/* Cyber Amber / Yellow Themed Badge & Title */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#271d05] border border-[#f59e0b]/50 text-[#fbbf24] text-xs font-mono font-bold tracking-widest uppercase mb-3 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
            <BarChart2 className="w-3.5 h-3.5 text-[#fbbf24]" />
            <span>SCORING &amp; EVALUATION FRAMEWORKS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-mono">
            Empirical <span className="text-[#f59e0b] drop-shadow-[0_0_25px_rgba(245,158,11,0.8)]">Benchmarks</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#fde68a]/80 font-mono mt-1.5 max-w-2xl leading-relaxed">
            Evaluations measuring general reasoning, competitive mathematics, code synthesis, and agentic workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {benchmarks.map((bm) => (
            <div
              key={bm.id}
              className="p-5 rounded-2xl bg-[#141005] border border-[#3d300a] hover:border-[#f59e0b] transition-all flex flex-col justify-between shadow-xl group hover:shadow-[0_0_25px_rgba(245,158,11,0.25)] font-mono"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#271d05] text-[#fbbf24] border border-[#f59e0b]/40 uppercase">
                    {bm.category || "General"}
                  </span>
                </div>
                <h2 className="text-base font-bold text-white group-hover:text-[#fbbf24] transition-colors">{bm.name}</h2>
                <p className="text-xs text-[#fde68a]/70 mt-2 line-clamp-3 leading-relaxed">
                  {bm.description || "Empirical foundation model benchmark framework."}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#3d300a] flex items-center justify-between text-xs">
                <span className="text-[#fbbf24] font-bold">
                  Scale: {bm.scoringScale || "0-100%"}
                </span>
                <Link
                  href="/rankings"
                  className="px-3 py-1 bg-[#f59e0b] hover:bg-[#fbbf24] text-[#0d0b04] font-black uppercase text-xs rounded transition-all flex items-center gap-1 shadow-[0_0_12px_rgba(245,158,11,0.4)]"
                >
                  <span>Rankings</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
