"use client";

import { useState } from "react";
import { Shield, User, Lock, Mail, ArrowRight, X, Loader2 } from "lucide-react";

interface ValorantAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: { name: string; email: string }) => void;
}

export function ValorantAuthModal({ isOpen, onClose, onSuccess }: ValorantAuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password || (!isLogin && !username)) {
      setError("Please fill out all operational fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: isLogin ? "login" : "register",
          email,
          username,
          password,
          name: username || email.split("@")[0],
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed.");
      }

      const user = data.user;
      localStorage.setItem("oneatlas_user", JSON.stringify(user));
      onSuccess({ name: user.name || user.username, email: user.email });
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Network or database connection error.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl font-mono">
      {/* Amber Tactical Auth Container */}
      <div className="relative w-full max-w-md bg-[#0d0b04] border-2 border-amber-500/80 shadow-[0_0_50px_rgba(245,158,11,0.35)] overflow-hidden">
        {/* Tactical Corner Accents */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-400" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-400" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-amber-400" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-400" />

        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-amber-950/40 border-b border-amber-500/40">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-400" />
            <span className="font-mono text-xs uppercase tracking-widest text-amber-300 font-bold">
              GOTHAM PROTOCOL // OPERATOR AUTH
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-amber-500/80 hover:text-amber-300 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-black uppercase tracking-wider text-amber-400 font-mono">
              {isLogin ? "INITIATE SESSION" : "REGISTER OPERATOR"}
            </h2>
            <p className="text-xs text-amber-600 font-mono uppercase tracking-widest">
              Verified Neon Database Record Storage
            </p>
          </div>

          {error && (
            <div className="p-3 bg-amber-950/60 border border-amber-500/60 text-amber-300 text-xs font-mono">
              ⚠ ERROR: {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase text-amber-400/90 font-bold flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> Call-Sign / Username
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Operator_01"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#1a1203] border border-amber-500/50 rounded-none px-3.5 py-2.5 text-sm font-mono text-amber-200 placeholder-amber-800 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 transition-all"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase text-amber-400/90 font-bold flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> Access Vector / Email
              </label>
              <input
                type="email"
                required
                placeholder="operator@oneatlas.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1a1203] border border-amber-500/50 rounded-none px-3.5 py-2.5 text-sm font-mono text-amber-200 placeholder-amber-800 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase text-amber-400/90 font-bold flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" /> Security Cipher / Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#1a1203] border border-amber-500/50 rounded-none px-3.5 py-2.5 text-sm font-mono text-amber-200 placeholder-amber-800 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full group mt-4 relative py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-mono font-bold uppercase tracking-wider text-sm transition-all duration-200 shadow-[0_0_20px_rgba(245,158,11,0.5)] hover:shadow-[0_0_30px_rgba(245,158,11,0.8)] flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-black" />
              ) : (
                <>
                  <span>{isLogin ? "ENGAGE INTERFACE" : "REGISTER ON NEON DB"}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-amber-900/60 font-mono text-xs text-amber-600">
            {isLogin ? "NEW OPERATOR? " : "REGISTERED ALREADY? "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="text-amber-400 hover:text-amber-300 font-bold uppercase underline underline-offset-4 cursor-pointer"
            >
              {isLogin ? "CREATE DOSSIER" : "OPERATOR SIGN IN"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
