"use client";

import Link from "next/link";
import { ShieldOff, MessageCircle, LogOut, AlertTriangle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const WHATSAPP_NUMBER = "32465987804";

export default function SuspendedPage() {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/signin");
  }

  const whatsappMessage = encodeURIComponent(
    "Bonjour, mon compte Scanini a ete suspendu. Je souhaite en savoir plus et reactiver mon acces."
  );

  return (
    <div className="flex-1 bg-gray-950 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-red-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-orange-500/10 rounded-full blur-[100px]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative max-w-lg w-full">
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

        <div className="bg-gray-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-br from-red-600/30 to-orange-600/20 px-8 py-8 text-center border-b border-white/5">
            <div className="mx-auto w-16 h-16 bg-red-500/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4">
              <ShieldOff size={32} className="text-red-400" />
            </div>
            <h1 className="text-xl font-bold text-white">
              Compte suspendu
            </h1>
            <p className="text-gray-400 text-sm mt-2 leading-relaxed">
              Votre compte a ete temporairement suspendu. L&apos;acces a votre tableau de bord et a vos menus est desactive.
            </p>
          </div>

          <div className="px-8 py-6">
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3 mb-6">
              <AlertTriangle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-white">Pourquoi mon compte est suspendu ?</p>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  Cela peut etre du a un retard de paiement, une violation des conditions d&apos;utilisation, ou une demande de verification supplementaire. Contactez-nous pour en savoir plus.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                <MessageCircle size={18} />
                Nous contacter sur WhatsApp
              </a>

              <a
                href="mailto:support@scanini.io"
                className="flex items-center justify-center gap-2 w-full py-3 bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-medium rounded-xl border border-white/10 transition-colors"
              >
                Envoyer un email
              </a>
            </div>
          </div>

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
