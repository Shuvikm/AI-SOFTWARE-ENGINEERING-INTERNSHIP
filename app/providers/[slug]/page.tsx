import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { ProviderService } from "@/services/provider.service";
import { ModelCard } from "@/components/models/ModelCard";
import { Layers, ExternalLink, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function ProviderDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const provider = await ProviderService.getBySlug(slug);

  if (!provider) {
    notFound();
  }

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/providers" className="hover:text-purple-400 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Providers
          </Link>
          <span>/</span>
          <span className="text-slate-300 font-medium">{provider.name}</span>
        </div>

        <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 mb-1">
                <Layers className="w-3.5 h-3.5" /> AI Infrastructure Provider
              </div>
              <h1 className="text-3xl font-black text-white">{provider.name}</h1>
              <p className="mt-2 text-sm text-slate-300 max-w-2xl">{provider.description}</p>
            </div>
            {provider.website && (
              <a
                href={provider.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700"
              >
                Visit Documentation / Cloud <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-100">
            Available Models on {provider.name} ({provider.models?.length || 0})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {provider.models?.map((model) => (
              <ModelCard key={model.id} model={model} />
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
