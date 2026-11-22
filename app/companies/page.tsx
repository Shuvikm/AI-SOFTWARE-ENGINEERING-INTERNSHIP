import { AppShell } from "@/components/layout/AppShell";
import { CompanyService } from "@/services/company.service";
import { Building2, ArrowRight, ExternalLink, Cpu } from "lucide-react";
import Link from "next/link";

export default async function CompaniesPage() {
  const companies = await CompanyService.getAll();

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-2">
            <Building2 className="w-3.5 h-3.5" />
            Frontier AI Organizations
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Companies & Research Labs
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Discover the organizations pioneering foundational research, open weights architectures, and frontier intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <div
              key={company.id}
              className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h2 className="text-lg font-bold text-slate-100">{company.name}</h2>
                    <span className="text-xs text-blue-400 font-medium">
                      {company._count?.models || company.models?.length || 0} Models Developed
                    </span>
                  </div>
                  {company.website && (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-slate-200 p-1"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>

                <p className="text-xs text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                  {company.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Cpu className="w-3.5 h-3.5 text-slate-400" />
                  <span>Research Roster</span>
                </div>
                <Link
                  href={`/companies/${company.slug}`}
                  className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white font-medium transition-colors flex items-center gap-1"
                >
                  View Models <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
