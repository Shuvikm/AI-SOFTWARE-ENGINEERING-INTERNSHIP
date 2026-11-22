"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { 
  Search, 
  Loader2, 
  Cpu, 
  Building2, 
  Layers, 
  ArrowRight, 
  X, 
  LogIn, 
  LogOut,
  Menu,
  Terminal
} from "lucide-react";
import { Model, Company, Provider } from "@/types";

interface TopNavbarProps {
  currentUser?: { name: string; email: string } | null;
  onOpenAuth?: () => void;
  onLogout?: () => void;
}

const navLinks = [
  { name: "Models", href: "/models" },
  { name: "Rankings", href: "/rankings" },
  { name: "Benchmarks", href: "/benchmarks" },
  { name: "Labs", href: "/labs" },
  { name: "Providers", href: "/providers" },
  { name: "Compare", href: "/compare" },
];

export function TopNavbar({ currentUser, onOpenAuth, onLogout }: TopNavbarProps) {
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [results, setResults] = useState<{
    models: Model[];
    companies: Company[];
    providers: Provider[];
  }>({ models: [], companies: [], providers: [] });

  useEffect(() => {
    if (!query.trim()) return;

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
          setIsOpen(true);
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#120e04]/95 backdrop-blur-md border-b border-[#3d300a] text-[#fef3c7] font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        {/* Brand / Logo (matching user screenshot with 1 OneAtlas) */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 font-bold tracking-tight">
            <div className="h-6 w-6 rounded bg-[#271d05] border border-[#f59e0b]/50 flex items-center justify-center text-xs font-black text-[#fbbf24] shadow-[0_0_10px_rgba(245,158,11,0.3)]">
              1
            </div>
            <span className="text-base tracking-wider font-bold text-white">OneAtlas</span>
          </Link>

          {/* Primary Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded transition-all ${
                    isActive
                      ? "bg-[#271d05] text-[#fbbf24] border-b-2 border-[#f59e0b] shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                      : "text-[#d4af37]/80 hover:text-white hover:bg-[#201805]"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-3">
          {/* Global Search Bar */}
          <div className="relative w-44 sm:w-64">
            <Search className="w-3.5 h-3.5 text-[#f59e0b] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search models..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => query.trim() && setIsOpen(true)}
              className="w-full bg-[#1b1506] border border-[#3d300a] rounded pl-8 pr-7 py-1.5 text-xs text-[#fef3c7] placeholder-[#a88219] focus:outline-none focus:border-[#f59e0b] focus:ring-1 focus:ring-[#f59e0b]/50 transition-all font-mono"
            />
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 text-[#f59e0b] animate-spin absolute right-2.5 top-1/2 -translate-y-1/2" />
            ) : query ? (
              <button
                onClick={() => {
                  setQuery("");
                  setIsOpen(false);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#f59e0b] hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : null}

            {/* Flyout Search Results */}
            {isOpen && (
              <div className="absolute top-10 right-0 w-80 bg-[#141005] border border-[#f59e0b]/60 rounded shadow-[0_0_30px_rgba(245,158,11,0.3)] overflow-hidden z-50 max-h-96 overflow-y-auto">
                {results.models.length > 0 && (
                  <div className="p-2 border-b border-[#3d300a]">
                    <div className="text-[10px] font-bold text-[#f59e0b] px-2 py-1 uppercase tracking-wider flex items-center gap-1.5">
                      <Cpu className="w-3 h-3 text-[#f59e0b]" /> Models
                    </div>
                    {results.models.map((m) => (
                      <Link
                        key={m.id}
                        href={`/models/${m.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-between px-2 py-1.5 hover:bg-[#271d05] text-xs text-[#fef3c7] rounded transition-colors"
                      >
                        <div>
                          <div className="font-semibold text-white">{m.name}</div>
                          <div className="text-[10px] text-[#fbbf24]">{m.modelType}</div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-[#f59e0b]" />
                      </Link>
                    ))}
                  </div>
                )}

                {results.companies.length > 0 && (
                  <div className="p-2 border-b border-[#3d300a]">
                    <div className="text-[10px] font-bold text-[#f59e0b] px-2 py-1 uppercase tracking-wider flex items-center gap-1.5">
                      <Building2 className="w-3 h-3 text-[#f59e0b]" /> Labs
                    </div>
                    {results.companies.map((c) => (
                      <Link
                        key={c.id}
                        href={`/labs/${c.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-between px-2 py-1.5 hover:bg-[#271d05] text-xs text-[#fef3c7] rounded transition-colors"
                      >
                        <span className="font-semibold text-white">{c.name}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#f59e0b]" />
                      </Link>
                    ))}
                  </div>
                )}

                {results.providers.length > 0 && (
                  <div className="p-2">
                    <div className="text-[10px] font-bold text-[#f59e0b] px-2 py-1 uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="w-3 h-3 text-[#f59e0b]" /> Providers
                    </div>
                    {results.providers.map((p) => (
                      <Link
                        key={p.id}
                        href={`/providers/${p.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-between px-2 py-1.5 hover:bg-[#271d05] text-xs text-[#fef3c7] rounded transition-colors"
                      >
                        <span className="font-semibold text-white">{p.name}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#f59e0b]" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Sign In / Status */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#fbbf24] font-bold hidden sm:inline">
                {currentUser.name}
              </span>
              <button
                onClick={onLogout}
                className="text-xs px-2.5 py-1 border border-[#3d300a] text-[#fbbf24] hover:text-white hover:bg-[#271d05] rounded transition-all flex items-center gap-1"
              >
                <LogOut className="w-3 h-3" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="text-xs px-3.5 py-1.5 bg-[#f59e0b] hover:bg-[#fbbf24] text-[#0d0b04] font-bold uppercase tracking-wider rounded transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.4)] cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-[#fbbf24] hover:text-white border border-[#3d300a] rounded"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-3 border-t border-[#3d300a] bg-[#141005] space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded text-[#fde68a] hover:text-white hover:bg-[#271d05]"
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
