"use client";

import { ReactNode, useState, useEffect } from "react";
import { TopNavbar } from "@/components/layout/TopNavbar";
import { ValorantAuthModal } from "@/components/auth/ValorantAuthModal";
import { MatrixRainBackground } from "@/components/effects/MatrixRainBackground";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("oneatlas_user");
    if (stored) {
      try {
        setCurrentUser(JSON.parse(stored));
      } catch {
        // invalid stored user
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("oneatlas_user");
    setCurrentUser(null);
  };

  return (
    <div className="min-h-screen bg-[#0d0b04] text-[#fffbeb] flex flex-col font-mono antialiased relative">
      {/* Subtle Matrix Ambient Background */}
      <MatrixRainBackground />

      <ValorantAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(user) => setCurrentUser(user)}
      />

      {/* Top Navbar */}
      <div className="relative z-30">
        <TopNavbar
          currentUser={currentUser}
          onOpenAuth={() => setAuthModalOpen(true)}
          onLogout={handleLogout}
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#3d300a] bg-[#141005] py-6 text-center text-xs text-[#fbbf24] relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[#fde68a]/80">&copy; {new Date().getFullYear()} OneAtlas Intelligence Platform. Verified Telemetry.</div>
          <div className="flex items-center gap-4 text-[11px] text-[#f59e0b]">
            <span>PostgreSQL &amp; Prisma 7</span>
            <span>&bull;</span>
            <span>Cyber Amber Intelligence Active</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
