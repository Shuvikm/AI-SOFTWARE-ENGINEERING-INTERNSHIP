import { AppShell } from "@/components/layout/AppShell";
import { CompanyService } from "@/services/company.service";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Building2, ArrowLeft } from "lucide-react";
import { formatNumber, formatPrice } from "@/lib/utils";

export default async function LabDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const company = await CompanyService.getBySlug(slug);

  if (!company) {
    notFound();
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <Link
            href="/labs"
            className="inline-flex items-center gap-1 text-xs text-[#A7A39B] hover:text-[#F5F3EF] transition-colors mb-3"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Labs</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded bg-[#373532] border border-[#504D49] flex items-center justify-center text-[#F5F3EF]">
              <Building2 className="w-5 h-5 text-[#A7A39B]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#F5F3EF]">
                {company.name}
              </h1>
              <p className="text-xs text-[#A7A39B]">
                {company.website || "Official AI Laboratory"}
              </p>
            </div>
          </div>
          <p className="text-sm text-[#A7A39B] mt-3 max-w-3xl leading-relaxed">
            {company.description}
          </p>
        </div>

        {/* Models list */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-[#F5F3EF]">
            Models Developed by {company.name}
          </h2>

          <div className="rounded-lg border border-[#373532] bg-[#22211F] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#201F1D] text-[#A7A39B] uppercase text-[11px] font-semibold tracking-wider border-b border-[#373532]">
                  <tr>
                    <th className="py-3 px-4">Model</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Context</th>
                    <th className="py-3 px-4">Input Price</th>
                    <th className="py-3 px-4">Output Price</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#373532] text-[#F5F3EF]">
                  {company.models?.map((model) => (
                    <tr key={model.id} className="hover:bg-[#2A2926] transition-colors">
                      <td className="py-3 px-4 font-medium">{model.name}</td>
                      <td className="py-3 px-4 text-[#A7A39B]">{model.modelType}</td>
                      <td className="py-3 px-4 font-mono">{formatNumber(model.contextWindow)}</td>
                      <td className="py-3 px-4 font-mono text-[#A7A39B]">{formatPrice(model.inputPrice)} / 1M</td>
                      <td className="py-3 px-4 font-mono text-[#A7A39B]">{formatPrice(model.outputPrice)} / 1M</td>
                      <td className="py-3 px-4 text-center">
                        <Link
                          href={`/models/${model.slug}`}
                          className="px-2.5 py-1 bg-[#373532] hover:bg-[#504D49] text-[#F5F3EF] rounded text-xs transition-colors"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
