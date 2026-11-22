import { LucideIcon } from "lucide-react";

export function StatCard({
  title,
  value,
  subtext,
  icon: Icon,
  color = "amber",
}: {
  title: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  color?: "purple" | "blue" | "emerald" | "amber";
}) {
  return (
    <div className="rounded-2xl bg-[#141005] border border-[#3d300a] p-5 shadow-xl shadow-black/60 flex items-center justify-between font-mono hover:border-[#f59e0b] transition-all hover:shadow-[0_0_25px_rgba(245,158,11,0.25)] group">
      <div>
        <p className="text-[11px] font-bold text-[#f59e0b] uppercase tracking-widest mb-1.5">
          {title}
        </p>
        <p className="text-3xl font-black text-white tracking-tight font-mono">{value}</p>
        {subtext && (
          <p className="text-[10px] text-[#fde68a]/80 mt-1 uppercase tracking-tight font-semibold">
            {subtext}
          </p>
        )}
      </div>
      <div className="p-3.5 rounded-xl border border-[#f59e0b]/40 bg-[#271d05] text-[#fbbf24] shadow-[0_0_20px_rgba(245,158,11,0.3)] group-hover:scale-105 transition-transform">
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
}
