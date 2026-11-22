import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { ModelService } from "@/services/model.service";
import { 
  Building2, 
  Layers, 
  Cpu, 
  Trophy, 
  GitCompare, 
  ArrowLeft,
  CheckCircle,
  Sparkles,
  ShieldCheck,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import { formatNumber, formatPrice, formatDate } from "@/lib/utils";

export default async function ModelDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const model = await ModelService.getBySlug(slug);

  if (!model) {
    notFound();
  }

  // Fetch related models from same company or category
  const allModels = await ModelService.getAll({ limit: 10 });
  const relatedModels = allModels.models
    .filter((m) => m.id !== model.id && (m.companyId === model.companyId || m.modelType === model.modelType))
    .slice(0, 3);

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/models" className="hover:text-purple-400 flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Models
          </Link>
          <span>/</span>
          <span className="text-slate-300 font-medium">{model.name}</span>
        </div>

        {/* Hero Header */}
        <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-6 md:p-8 relative overflow-hidden shadow-xl">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-purple-950/60 text-purple-300 border border-purple-800/40">
                  {model.modelType}
                </span>
                <span className="text-xs text-slate-400">
                  Released: {formatDate(model.releaseDate)}
                </span>
                <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Architecture
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {model.name}
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed">
                {model.description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
              <Link
                href={`/compare?model=${model.slug}`}
                className="px-4 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all"
              >
                <GitCompare className="w-4 h-4" />
                Compare this Model
              </Link>
              {model.sourceUrl && (
                <a
                  href={model.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white text-xs font-medium flex items-center justify-center gap-1.5 border border-slate-700/80 transition-colors"
                >
                  Official Paper / Source <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Info bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px] mb-0.5">Lab / Creator</span>
              <Link
                href={`/companies/${model.company?.slug || ""}`}
                className="font-semibold text-slate-200 hover:text-purple-300 flex items-center gap-1"
              >
                <Building2 className="w-3.5 h-3.5 text-blue-400" />
                {model.company?.name || "Independent"}
              </Link>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px] mb-0.5">Primary Provider</span>
              <Link
                href={`/providers/${model.provider?.slug || ""}`}
                className="font-semibold text-slate-200 hover:text-purple-300 flex items-center gap-1"
              >
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                {model.provider?.name || "Direct API"}
              </Link>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px] mb-0.5">Context Window</span>
              <span className="font-semibold text-purple-300">
                {formatNumber(model.contextWindow)} tokens
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px] mb-0.5">Input / Output Price (1M)</span>
              <span className="font-semibold text-slate-200">
                {formatPrice(model.inputPrice)} / {formatPrice(model.outputPrice)}
              </span>
            </div>
          </div>
        </div>

        {/* Multi-Provider Hosting Grid */}
        <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" /> Multi-Provider Hosting & Endpoints
            </h2>
            <span className="text-xs text-slate-400">
              Available via {model.hostedProviders?.length ? model.hostedProviders.length + 1 : 1} hosting providers
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Primary creator endpoint */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-purple-500/30 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Primary / Creator API
                </span>
                <div className="font-bold text-slate-100 mt-2">{model.provider?.name || "Primary Host"}</div>
                <div className="text-xs text-slate-400 mt-1">Direct endpoint with native feature support.</div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-300 flex justify-between">
                <span>1M Tokens:</span>
                <span className="font-bold text-emerald-400">{formatPrice(model.inputPrice)} in / {formatPrice(model.outputPrice)} out</span>
              </div>
            </div>

            {/* Alternative providers */}
            {model.hostedProviders?.map((hp) => (
              <div key={hp.id} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    Third-Party Cloud
                  </span>
                  <div className="font-bold text-slate-100 mt-2">{hp.provider?.name || "Hosting Platform"}</div>
                  <div className="text-xs text-slate-400 mt-1 line-clamp-1">{hp.endpointUrl || "API Access Available"}</div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-300 flex justify-between">
                  <span>Status:</span>
                  <span className="font-semibold text-emerald-400 capitalize">{hp.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Specifications & Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Technical Specifications */}
          <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-400" /> Technical Specifications
            </h2>
            <div className="space-y-3 text-sm divide-y divide-slate-800/80">
              <div className="flex justify-between py-2">
                <span className="text-slate-400 text-xs">Architecture Category</span>
                <span className="font-medium text-slate-200 text-xs">{model.modelType}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-400 text-xs">Maximum Context</span>
                <span className="font-medium text-slate-200 text-xs">{formatNumber(model.contextWindow)} tokens</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-400 text-xs">Input Modalities</span>
                <span className="font-medium text-slate-200 text-xs capitalize">
                  {model.modalities.join(", ") || "Text"}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-400 text-xs">Input Token Pricing</span>
                <span className="font-medium text-slate-200 text-xs">{formatPrice(model.inputPrice)} / 1M tokens</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-400 text-xs">Output Token Pricing</span>
                <span className="font-medium text-slate-200 text-xs">{formatPrice(model.outputPrice)} / 1M tokens</span>
              </div>
            </div>
          </div>

          {/* Capabilities */}
          <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" /> Supported Capabilities
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {model.capabilities.map((cap) => (
                <div
                  key={cap}
                  className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-200"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="capitalize">{cap.replace(/-/g, " ")}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Verified Benchmark Results */}
        <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <h2 className="text-base font-bold text-slate-100">Verified Benchmark Results</h2>
            </div>
            <Link href="/rankings" className="text-xs text-purple-400 hover:text-purple-300">
              View Global Leaderboard
            </Link>
          </div>

          {(!model.benchmarks || model.benchmarks.length === 0) ? (
            <p className="text-xs text-slate-400">No verified benchmark records available yet for this model.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {model.benchmarks.map((mb) => (
                <div
                  key={mb.id}
                  className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-purple-400 uppercase font-semibold">
                        {mb.benchmark?.category || "Evaluation"}
                      </span>
                      {mb.methodology && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                          {mb.methodology}
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-slate-100 mt-1">
                      {mb.benchmark?.name || "Benchmark"}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                      {mb.benchmark?.description}
                    </p>
                    {mb.scoringScale && (
                      <div className="text-[10px] text-slate-400 mt-1">
                        Scale: {mb.scoringScale}
                      </div>
                    )}
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-xs text-slate-400">Score:</span>
                    <span className="text-lg font-black text-emerald-400">
                      {mb.score}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Related Models */}
        {relatedModels.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-100">Related Models</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedModels.map((rm) => (
                <Link
                  key={rm.id}
                  href={`/models/${rm.slug}`}
                  className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/40 transition-all block group"
                >
                  <div className="text-[10px] font-semibold text-purple-400 uppercase">{rm.company?.name}</div>
                  <div className="font-bold text-slate-100 group-hover:text-purple-300 transition-colors mt-0.5">
                    {rm.name}
                  </div>
                  <div className="text-xs text-slate-400 mt-1 line-clamp-1">{rm.modelType}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
