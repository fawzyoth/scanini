"use client";

import Link from "next/link";
import { ArrowRight, Check, Eye } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export function LandingHero() {
  return (
    <section className="relative pt-36 pb-24 sm:pt-44 sm:pb-32 overflow-hidden bg-gray-950">
      {/* Gradient orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/15 rounded-full blur-[100px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px]" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1]">
          Votre menu digital
          <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            prêt plus vite qu&apos;un panini
          </span>
        </h1>

        {/* Subheading */}
        <p className="mt-6 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Créez, gérez et partagez le menu digital de votre restaurant.
          <br className="hidden sm:block" />
          Aucune application à télécharger pour vos clients.
        </p>

        {/* CTA */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/signup"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-gray-100 text-gray-900 text-sm font-semibold rounded-2xl transition-all shadow-lg shadow-white/10"
          >
            Créer mon menu gratuitement
            <ArrowRight size={16} />
          </Link>
          <a
            href="#demo"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold rounded-2xl border border-white/10 transition-all"
          >
            Voir la démo
          </a>
        </div>

        {/* Trust signals */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-500">
          <span className="flex items-center gap-1.5"><Check size={14} className="text-green-400" /> Gratuit pour commencer</span>
          <span className="flex items-center gap-1.5"><Check size={14} className="text-green-400" /> Sans carte bancaire</span>
          <span className="flex items-center gap-1.5"><Check size={14} className="text-green-400" /> Prêt en 5 minutes</span>
        </div>

        {/* QR Code demo */}
        <div className="mt-16 sm:mt-20 flex flex-col items-center gap-6">
          <div className="relative">
            {/* Glow behind QR */}
            <div className="absolute -inset-8 bg-gradient-to-b from-indigo-500/20 via-purple-500/10 to-transparent rounded-3xl blur-2xl" />

            <div className="relative bg-white rounded-3xl p-6 shadow-2xl ring-1 ring-white/10">
              <QRCodeSVG
                value="https://scanini.business/menu/demo"
                size={180}
                level="M"
                bgColor="#ffffff"
                fgColor="#111827"
              />
              <p className="mt-3 text-xs text-gray-500 font-medium text-center">
                Scannez pour voir le menu
              </p>
            </div>
          </div>

          <Link
            href="/menu/demo"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/15 text-white text-sm font-semibold rounded-2xl border border-white/10 transition-all"
          >
            <Eye size={16} />
            Voir un exemple de menu
          </Link>
        </div>
      </div>
    </section>
  );
}
