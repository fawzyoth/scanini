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
      caption="Your menu, on every phone"
      subcaption="Customers scan a QR code and instantly browse your dishes with photos, prices, and allergens."
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mb-8">
        <div className="w-9 h-9 bg-black rounded-lg flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <circle cx="12" cy="12" r="3" />
            <circle cx="5" cy="5" r="2" />
            <circle cx="19" cy="5" r="2" />
            <circle cx="5" cy="19" r="2" />
            <circle cx="19" cy="19" r="2" />
          </svg>
        </div>
        <span className="text-xl font-bold text-gray-900">Scanini</span>
      </Link>

      {/* Heading */}
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Welcome back</h1>
      <p className="text-sm text-gray-500 mt-1.5 mb-8">
        Sign in to manage your restaurant menus
      </p>

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
            Email
          </label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@restaurant.com"
              required
              className="block w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <Link href="#" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="block w-full rounded-lg border border-gray-300 pl-10 pr-10 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center py-2.5 px-4 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none transition-colors"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            "Sign in"
          )}
        </button>
      </form>

      {/* Footer */}
      <p className="mt-8 text-center text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-indigo-600 hover:text-indigo-700 font-medium">
          Sign up free
        </Link>
      </p>
    </AuthSplitLayout>
  );
}
