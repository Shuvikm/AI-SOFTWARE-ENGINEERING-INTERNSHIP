"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { 
  LayoutDashboard, 
  Cpu, 
  Layers, 
  Building2, 
  Trophy, 
  GitCompare, 
  Terminal,
  Zap,
  Menu,
  X,
  User,
  LogIn
} from "lucide-react";

interface SidebarProps {
  currentUser?: { name: string; email: string } | null;
  onOpenAuth?: () => void;
}

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Model Explorer", href: "/models", icon: Cpu },
  { name: "Compare Models", href: "/compare", icon: GitCompare },
  { name: "Rankings", href: "/rankings", icon: Trophy },
  { name: "Providers", href: "/providers", icon: Layers },
  { name: "Companies", href: "/companies", icon: Building2 },
];

export function Sidebar({ currentUser, onOpenAuth }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Toggle Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#06140b]/90 backdrop-blur-md border-b border-emerald-900/60 sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 bg-emerald-950 border border-emerald-500/80 flex items-center justify-center text-emerald-400 font-bold shadow-[0_0_10px_rgba(16,185,129,0.3)]">
            <Terminal className="w-4 h-4 text-emerald-300" />
          </div>
          <span className="font-mono font-black text-base tracking-widest text-emerald-400">
            ONEATLAS
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-emerald-400 hover:text-emerald-200 bg-emerald-950/80 border border-emerald-800 transition-colors"
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Backdrop for mobile drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 border-r border-emerald-900/70 bg-[#050f08]/95 md:bg-[#050f08]/90 backdrop-blur-xl flex flex-col shrink-0 z-50 transition-transform duration-300 ease-in-out font-mono ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-emerald-900/60 gap-3">
          <div className="h-9 w-9 bg-emerald-950 border border-emerald-500/80 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)] text-emerald-300 font-bold">
            <Terminal className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <span className="font-mono font-black text-lg tracking-wider text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]">
              ONEATLAS
            </span>
            <span className="block text-[10px] tracking-widest font-bold uppercase text-emerald-600">
              STARDUST // MATRIX
            </span>
          </div>
        </div>

        {/* User Status Bar */}
        <div className="px-4 py-3 border-b border-emerald-950 bg-emerald-950/20 flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-300 truncate">
              {currentUser ? currentUser.name : "GUEST OPERATOR"}
            </span>
          </div>
          {!currentUser && (
            <button
              onClick={onOpenAuth}
              className="text-[10px] px-2 py-0.5 border border-emerald-500/60 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 font-bold uppercase"
            >
              AUTH
            </button>
          )}
        </div>

        {/* Navigation items */}
        <div className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
            // PROTOCOL SECTORS
          </div>
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-none text-xs font-mono uppercase tracking-wider transition-all ${
                  isActive
                    ? "bg-emerald-500/15 text-emerald-300 border-l-2 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                    : "text-emerald-500/80 hover:text-emerald-200 hover:bg-emerald-950/40"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? "text-emerald-400" : "text-emerald-600"
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Sidebar Footer info */}
        <div className="p-4 border-t border-emerald-900/60 m-3 bg-[#08170d] border border-emerald-900/50">
          <div className="flex items-center gap-2 mb-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>STAND ACTIVE</span>
          </div>
          <p className="text-[10px] text-emerald-600 leading-relaxed font-mono">
            Stardust Crusaders telemetry online. Verified frontier benchmarks loaded.
          </p>
        </div>
      </aside>
    </>
  );
}
