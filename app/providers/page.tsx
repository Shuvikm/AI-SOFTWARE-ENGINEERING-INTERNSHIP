import { AppShell } from "@/components/layout/AppShell";
import { ProviderService } from "@/services/provider.service";
import { Layers, ArrowRight, ExternalLink, Cpu } from "lucide-react";
import Link from "next/link";

export default async function ProvidersPage() {
  const providers = await ProviderService.getAll();

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          {/* Cyber Amber / Yellow Distinct Themed Badge & Title */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#271d05] border border-[#f59e0b]/50 text-[#fbbf24] text-xs font-mono font-bold tracking-widest uppercase mb-3 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
            <Layers className="w-3.5 h-3.5 text-[#fbbf24]" />
            <span>CLOUD HOSTS &amp; INFERENCE APIS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-mono">
            Infrastructure <span className="text-[#f59e0b] drop-shadow-[0_0_25px_rgba(245,158,11,0.8)]">Providers</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#fde68a]/80 font-mono mt-1.5 max-w-2xl leading-relaxed">
            Explore cloud inference engines, enterprise API providers, and managed deployment hosts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {providers.map((provider) => (
            <div
              key={provider.id}
              className="p-5 rounded-2xl bg-[#141005] border border-[#3d300a] hover:border-[#f59e0b] transition-all flex flex-col justify-between shadow-xl group hover:shadow-[0_0_25px_rgba(245,158,11,0.25)] font-mono"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h2 className="text-base font-bold text-white group-hover:text-[#fbbf24] transition-colors">{provider.name}</h2>
                    <span className="text-xs text-[#fbbf24] font-bold">
                      {provider._count?.models || provider.models?.length || 0} Models Hosted
                    </span>
                  </div>
                  {provider.website && (
                    <a
                      href={provider.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#fbbf24] hover:text-white p-1"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>

                <p className="text-xs text-[#fde68a]/70 line-clamp-3 mb-4 leading-relaxed">
                  {provider.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#3d300a] flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-[#fbbf24] font-medium">
                  <Cpu className="w-3.5 h-3.5 text-[#f59e0b]" />
                  <span>Hosted Endpoints</span>
                </div>
                <Link
                  href={`/providers/${provider.slug}`}
                  className="px-3 py-1 bg-[#f59e0b] hover:bg-[#fbbf24] text-[#0d0b04] font-black uppercase text-xs rounded transition-all flex items-center gap-1 shadow-[0_0_12px_rgba(245,158,11,0.4)]"
                >
                  <span>Models</span> <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
