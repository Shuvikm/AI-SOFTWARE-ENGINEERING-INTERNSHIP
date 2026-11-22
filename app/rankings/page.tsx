import { AppShell } from "@/components/layout/AppShell";
import { RankingsLeaderboard } from "@/components/rankings/RankingsLeaderboard";
import { BenchmarkService } from "@/services/benchmark.service";
import { Trophy } from "lucide-react";

export default async function RankingsPage() {
  const [benchmarks, rankings] = await Promise.all([
    BenchmarkService.getAll(),
    BenchmarkService.getRankings(),
  ]);

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          {/* Amber / Yellow Distinct Themed Badge & Title */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#261d05] border border-[#f59e0b]/50 text-[#fbbf24] text-xs font-mono font-bold tracking-widest uppercase mb-3 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
            <Trophy className="w-3.5 h-3.5 text-[#fbbf24]" />
            <span>VERIFIED FRONTIER LEADERBOARD</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-mono">
            Model <span className="text-[#f59e0b] drop-shadow-[0_0_25px_rgba(245,158,11,0.8)]">Rankings</span> &amp; Benchmarks
          </h1>
          <p className="text-xs sm:text-sm text-[#fde68a]/80 font-mono mt-1.5 max-w-2xl leading-relaxed">
            Empirical evaluations across MMLU, HumanEval coding, GPQA science reasoning, and SWE-bench software engineering.
          </p>
        </div>

        <RankingsLeaderboard
          benchmarks={benchmarks}
          initialRankings={rankings}
        />
      </div>
    </AppShell>
  );
}
