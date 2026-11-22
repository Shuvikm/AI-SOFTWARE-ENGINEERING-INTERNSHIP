import { AppShell } from "@/components/layout/AppShell";
import { ModelExplorer } from "@/components/models/ModelExplorer";
import { ModelService } from "@/services/model.service";
import { CompanyService } from "@/services/company.service";
import { ProviderService } from "@/services/provider.service";
import { Cpu, Sparkles } from "lucide-react";

export default async function ModelsPage() {
  const [modelsData, companies, providers] = await Promise.all([
    ModelService.getAll({ limit: 100 }),
    CompanyService.getAll(),
    ProviderService.getAll(),
  ]);

  const categories = Array.from(
    new Set(modelsData.models.map((m) => m.modelType))
  );
  const capabilities = Array.from(
    new Set(modelsData.models.flatMap((m) => m.capabilities))
  );

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          {/* Cyber Amber / Yellow Distinct Themed Badge & Title */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#271d05] border border-[#f59e0b]/50 text-[#fbbf24] text-xs font-mono font-bold tracking-widest uppercase mb-3 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
            <Cpu className="w-3.5 h-3.5 text-[#fbbf24]" />
            <span>FOUNDATION MODEL CATALOG</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-mono">
            AI Model <span className="text-[#f59e0b] drop-shadow-[0_0_25px_rgba(245,158,11,0.8)]">Explorer</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#fde68a]/80 font-mono mt-1.5 max-w-2xl leading-relaxed">
            Search, filter, and inspect verified specifications, pricing, and benchmarks across frontier AI architectures.
          </p>
        </div>

        <ModelExplorer
          initialModels={modelsData.models}
          companies={companies}
          providers={providers}
          categories={categories}
          capabilities={capabilities}
        />
      </div>
    </AppShell>
  );
}
