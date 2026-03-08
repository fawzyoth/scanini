"use client";

import Link from "next/link";
import { Phone, Clock, CheckCircle2, LogOut, MessageCircle, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PendingApprovalPage() {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/signin");
  }

  return (
    <div className="flex-1 bg-gray-950 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[100px]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative max-w-lg w-full">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5">
                <circle cx="12" cy="12" r="3" />
                <circle cx="5" cy="5" r="2" />
                <circle cx="19" cy="5" r="2" />
                <circle cx="5" cy="19" r="2" />
                <circle cx="19" cy="19" r="2" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white">Scanini</span>
          </Link>
        </div>

        {/* Main card */}
        <div className="bg-gray-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-gradient-to-br from-indigo-600/30 to-purple-600/20 px-8 py-8 text-center border-b border-white/5">
            <div className="mx-auto w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4">
              <ShieldCheck size={32} className="text-indigo-400" />
            </div>
            <h1 className="text-xl font-bold text-white">
              Compte en cours de verification
            </h1>
            <p className="text-gray-400 text-sm mt-2 leading-relaxed">
              Votre compte a ete cree avec succes. Notre equipe va le verifier et vous contacter rapidement.
            </p>
          </div>

          {/* Steps */}
          <div className="px-8 py-6">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-5">Prochaines etapes</h2>

            <div className="space-y-0">
              {/* Step 1 - Done */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-9 h-9 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 size={18} className="text-green-400" />
                  </div>
                  <div className="w-px h-full bg-green-500/20 my-1" />
                </div>
                <div className="pb-6">
                  <p className="text-sm font-semibold text-white">Compte cree</p>
                  <p className="text-xs text-gray-500 mt-0.5">Vos informations ont ete recues avec succes</p>
                </div>
              </div>

              {/* Step 2 - In progress */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-9 h-9 rounded-full bg-indigo-500/10 flex items-center justify-center flex-shrink-0 ring-2 ring-indigo-500/30 ring-offset-2 ring-offset-gray-900">
                    <Phone size={18} className="text-indigo-400" />
                  </div>
                  <div className="w-px h-full bg-white/10 my-1" />
                </div>
                <div className="pb-6">
                  <p className="text-sm font-semibold text-white">Appel de verification</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Nous vous contacterons par telephone ou WhatsApp pour verifier les details de votre restaurant
                  </p>
                </div>
              </div>

              {/* Step 3 - Pending */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 size={18} className="text-gray-600" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Compte active</p>
                  <p className="text-xs text-gray-600 mt-0.5">Acces complet pour creer votre menu digital</p>
                </div>
              </div>
            </div>
          </div>

          {/* Time estimate */}
          <div className="mx-8 mb-6 bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 flex items-start gap-3">
            <Clock size={18} className="text-indigo-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-white">
                Reponse sous 24 heures
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Assurez-vous que votre telephone est joignable. Nous repondons generalement bien plus vite.
              </p>
            </div>
          </div>

          {/* Contact info */}
          <div className="mx-8 mb-6 border border-white/10 rounded-xl p-4 flex items-start gap-3">
            <MessageCircle size={18} className="text-gray-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-300">Besoin d&apos;aide ?</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Contactez-nous sur WhatsApp si vous avez des questions sur le processus d&apos;activation.
              </p>
            </div>
          </div>

          {/* Sign out */}
          <div className="px-8 py-4 bg-white/[0.02] border-t border-white/5 flex justify-center">
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition-colors disabled:opacity-50"
            >
              <LogOut size={16} />
              Se deconnecter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
