import { AppShell } from "@/components/layout/AppShell";
import { CompanyService } from "@/services/company.service";
import Link from "next/link";
import { Building2, ArrowRight } from "lucide-react";

export default async function LabsPage() {
  const companies = await CompanyService.getAll();

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          {/* Cyber Amber / Yellow Distinct Themed Badge & Title */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#271d05] border border-[#f59e0b]/50 text-[#fbbf24] text-xs font-mono font-bold tracking-widest uppercase mb-3 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
            <Building2 className="w-3.5 h-3.5 text-[#fbbf24]" />
            <span>AI RESEARCH LABS DIRECTORY</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-mono">
            Research <span className="text-[#f59e0b] drop-shadow-[0_0_25px_rgba(245,158,11,0.8)]">Labs</span> &amp; Creators
          </h1>
          <p className="text-xs sm:text-sm text-[#fde68a]/80 font-mono mt-1.5 max-w-2xl leading-relaxed">
            Explore frontier labs shaping artificial general intelligence, foundational architectures, and open weights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {companies.map((company) => (
            <div
              key={company.id}
              className="p-5 rounded-2xl bg-[#141005] border border-[#3d300a] hover:border-[#f59e0b] transition-all flex flex-col justify-between shadow-xl group hover:shadow-[0_0_25px_rgba(245,158,11,0.25)] font-mono"
            >
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="h-8 w-8 rounded-lg bg-[#271d05] border border-[#f59e0b]/40 flex items-center justify-center text-[#fbbf24] shadow-[0_0_12px_rgba(245,158,11,0.3)]">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <h2 className="text-base font-bold text-white group-hover:text-[#fbbf24] transition-colors">{company.name}</h2>
                </div>
                <p className="text-xs text-[#fde68a]/70 line-clamp-2 leading-relaxed mt-1">
                  {company.description || "Leading AI research and engineering laboratory."}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#3d300a] flex items-center justify-between text-xs">
                <span className="text-[#fbbf24] font-bold">
                  {company.models?.length || 0} Models
                </span>
                <Link
                  href={`/labs/${company.slug}`}
                  className="px-3 py-1 bg-[#f59e0b] hover:bg-[#fbbf24] text-[#0d0b04] font-black uppercase text-xs rounded transition-all flex items-center gap-1 shadow-[0_0_12px_rgba(245,158,11,0.4)]"
                >
                  <span>Lab Profile</span>
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
