"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { AuthPhoneMockup } from "@/components/auth/auth-phone-mockup";
import { createClient } from "@/lib/supabase/client";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    // Check user role and restaurant status
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // Check if admin — from profiles table or user_metadata
      let isAdmin = false;

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile && (profile as any).role === "admin") {
        isAdmin = true;
      } else if (user.user_metadata?.role === "admin") {
        isAdmin = true;
      }

      if (isAdmin) {
        router.push("/admin");
        return;
      }

      // Check restaurant status — ONLY allow access if explicitly active/trial
      const { data: restaurant } = await supabase
        .from("restaurants")
        .select("status")
        .eq("owner_id", user.id)
        .single();

      const status = restaurant ? (restaurant as any).status : null;

      // Only allow dashboard access if status is explicitly "active" or "trial"
      if (status === "active" || status === "trial") {
        router.push("/menus");
        return;
      }

      // Everything else (pending, suspended, null, no restaurant) → pending page
      router.push("/pending");
      return;
    }

    router.push("/pending");
  }

  return (
    <AuthSplitLayout
      showcase={<AuthPhoneMockup />}
      caption="Votre menu, sur chaque telephone"
      subcaption="Vos clients scannent un QR code et consultent vos plats avec photos, prix et allergenes."
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mb-8">
        <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5">
            <circle cx="12" cy="12" r="3" />
            <circle cx="5" cy="5" r="2" />
            <circle cx="19" cy="5" r="2" />
            <circle cx="5" cy="19" r="2" />
            <circle cx="19" cy="19" r="2" />
          </svg>
        </div>
        <span className="text-xl font-bold text-white">Scanini</span>
      </Link>

      {/* Heading */}
      <h1 className="text-2xl sm:text-3xl font-bold text-white">Bon retour parmi nous</h1>
      <p className="text-sm text-gray-400 mt-1.5 mb-8">
        Connectez-vous pour gerer vos menus
      </p>

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5">
            Email
          </label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@restaurant.com"
              required
              className="block w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Mot de passe
            </label>
            <Link href="#" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">
              Mot de passe oublie ?
            </Link>
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Entrez votre mot de passe"
              required
              className="block w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-10 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center py-2.5 px-4 bg-white text-gray-900 text-sm font-semibold rounded-xl hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-gray-950 disabled:opacity-50 disabled:pointer-events-none transition-colors"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
          ) : (
            "Se connecter"
          )}
        </button>
      </form>

      {/* Footer */}
      <p className="mt-8 text-center text-sm text-gray-500">
        Pas encore de compte ?{" "}
        <Link href="/signup" className="text-indigo-400 hover:text-indigo-300 font-medium">
          Creer un compte
        </Link>
      </p>
    </AuthSplitLayout>
  );
}
