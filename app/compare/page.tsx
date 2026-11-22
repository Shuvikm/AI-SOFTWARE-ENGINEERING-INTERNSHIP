import { AppShell } from "@/components/layout/AppShell";
import { ModelComparisonView } from "@/components/comparison/ModelComparisonView";
import { ModelService } from "@/services/model.service";
import { BenchmarkService } from "@/services/benchmark.service";
import { GitCompare } from "lucide-react";

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ model?: string }>;
}) {
  const { model: preselectedSlug } = await searchParams;
  const [modelsData, benchmarks] = await Promise.all([
    ModelService.getAll({ limit: 100 }),
    BenchmarkService.getAll(),
  ]);

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#271d05] border border-[#f59e0b]/40 text-[#fbbf24] text-xs font-semibold mb-2 font-mono">
            <GitCompare className="w-3.5 h-3.5 text-[#f59e0b]" />
            Side-by-Side Evaluation
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
            AI Model Comparison
          </h1>
          <p className="text-sm text-[#fde68a]/70 mt-1 font-mono">
            Compare capabilities, context windows, verified benchmark accuracy, token pricing, and modalities.
          </p>
        </div>

        <ModelComparisonView
          allModels={modelsData.models}
          benchmarks={benchmarks}
          preselectedSlug={preselectedSlug}
        />
      </div>
    </AppShell>
  );
}
