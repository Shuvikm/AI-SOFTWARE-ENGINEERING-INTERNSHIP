import { AppShell } from "@/components/layout/AppShell";
import { StatCard } from "@/components/dashboard/StatCard";
import { ModelCard } from "@/components/models/ModelCard";
import { TokenCostCalculator } from "@/components/dashboard/TokenCostCalculator";
import { ModelRecommendationEngine } from "@/components/dashboard/ModelRecommendationEngine";
import { BatmanHeroSection } from "@/components/hero/BatmanHeroSection";
import { BatmanIntro } from "@/components/intro/BatmanIntro";
import { ModelService } from "@/services/model.service";
import {
  Cpu,
  Layers,
  Building2,
  Trophy,
  ArrowRight,
  TrendingUp,
  Clock,
  Award
} from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const stats = await ModelService.getDashboardStats();
  const allModelsData = await ModelService.getAll({ limit: 100 });

  return (
    <>
      {/* ── CINEMATIC BATMAN INTRO (Full-screen overlay, auto-dismisses after ~4s) ── */}
      <BatmanIntro />

      {/* ── BATMAN HERO SCENE (Full-viewport static scene after intro) ── */}
      <BatmanHeroSection />

      {/* 2. MAIN PLATFORM (Accessible by smooth scroll or clicking Explore) */}
      <div id="platform-content">
        <AppShell>
          <div className="space-y-12">
            {/* SCENE 5 — MAIN PLATFORM INTELLIGENCE TELEMETRY */}
            <div id="intelligence-grid" className="pt-4 scroll-mt-20">
              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  title="Total AI Models"
                  value={stats.totalModels}
                  subtext="Frontier & Open Weights"
                  icon={Cpu}
                  color="amber"
                />
                <StatCard
                  title="Active Providers"
                  value={stats.totalProviders}
                  subtext="Cloud & direct APIs"
                  icon={Layers}
                  color="amber"
                />
                <StatCard
                  title="AI Research Labs"
                  value={stats.totalCompanies}
                  subtext="Anthropic, OpenAI, Meta, Google"
                  icon={Building2}
                  color="amber"
                />
                <StatCard
                  title="Evaluated Benchmarks"
                  value={stats.totalBenchmarks}
                  subtext="MMLU, GPQA, SWE-bench"
                  icon={Trophy}
                  color="amber"
                />
              </div>
            </div>

            {/* Interactive Modules: Recommendation & Token Pricing Calculator */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ModelRecommendationEngine allModels={allModelsData.models} />
              <TokenCostCalculator models={allModelsData.models} />
            </div>

            {/* Model Showcases */}
            <div className="space-y-8">
              {/* Top Reasoning Models */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    <h2 className="text-xl font-bold text-white font-mono uppercase tracking-wider">
                      Top-Performing Frontier Models
                    </h2>
                  </div>
                  <Link
                    href="/rankings"
                    className="text-xs font-mono uppercase font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                  >
                    Full Leaderboard
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {stats.topPerformingModels.map((model) => (
                    <ModelCard key={model.id} model={model} />
                  ))}
                </div>
              </section>

              {/* Trending & High Adoption Models */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-amber-400" />
                    <h2 className="text-xl font-bold text-white font-mono uppercase tracking-wider">
                      Trending Community Models
                    </h2>
                  </div>
                  <Link
                    href="/models?sortBy=popularity"
                    className="text-xs font-mono uppercase font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                  >
                    View Trending
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {stats.popularModels.map((model) => (
                    <ModelCard key={model.id} model={model} />
                  ))}
                </div>
              </section>

              {/* Recently Added Frontier Models */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-amber-400" />
                    <h2 className="text-xl font-bold text-white font-mono uppercase tracking-wider">
                      Recently Released AI Models
                    </h2>
                  </div>
                  <Link
                    href="/models?sortBy=releaseDate"
                    className="text-xs font-mono uppercase font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                  >
                    View All Releases
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {stats.recentlyAddedModels.map((model) => (
                    <ModelCard key={model.id} model={model} />
                  ))}
                </div>
              </section>
            </div>
          </div>
        </AppShell>
      </div>
    </>
  );
}
