import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

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
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/80 text-xs font-medium px-4 py-2 rounded-full mb-8 border border-white/10">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          Stickers QR gratuits pour votre restaurant
        </div>

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

        {/* Phone mockup */}
        <div className="mt-16 sm:mt-20 flex justify-center">
          <div className="relative">
            {/* Glow behind phone */}
            <div className="absolute -inset-8 bg-gradient-to-b from-indigo-500/20 via-purple-500/10 to-transparent rounded-[3rem] blur-2xl" />

            <div className="relative w-[260px] sm:w-[280px] bg-gray-800 rounded-[2.5rem] p-2 shadow-2xl ring-1 ring-white/10">
              <div className="relative z-20 flex justify-center">
                <div className="w-20 h-5 bg-gray-800 rounded-b-xl" />
              </div>
              <div className="w-full bg-white rounded-[2rem] overflow-hidden -mt-5">
                {/* Status bar */}
                <div className="flex items-center justify-between px-5 pt-2 pb-1 text-[9px] font-semibold text-gray-900">
                  <span>9:41</span>
                  <div className="w-3 h-2 border border-current rounded-sm relative">
                    <div className="absolute inset-[1px] bg-current rounded-[1px]" style={{ width: "70%" }} />
                  </div>
                </div>

                {/* Cover */}
                <div className="relative h-24">
                  <img
                    src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=200&fit=crop&q=80"
                    alt="Restaurant"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-2 left-3">
                    <p className="text-white text-xs font-bold">La Bouffe</p>
                    <p className="text-[7px] text-white/80">Paris, France</p>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 px-3 py-1.5">
                  <span className="text-[7px] font-semibold text-white bg-gray-900 rounded-full px-2 py-0.5">Petit-déj</span>
                  <span className="text-[7px] text-gray-500 bg-gray-100 rounded-full px-2 py-0.5">Déjeuner</span>
                  <span className="text-[7px] text-gray-500 bg-gray-100 rounded-full px-2 py-0.5">Boissons</span>
                </div>

                {/* Items */}
                {[
                  { name: "Croissant Beurre", price: "2.50", img: "https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=80&h=80&fit=crop&q=80" },
                  { name: "Eggs Benedict", price: "12.00", img: "https://images.unsplash.com/photo-1608039829572-9b0189ea6268?w=80&h=80&fit=crop&q=80" },
                  { name: "Avocado Toast", price: "9.50", img: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=80&h=80&fit=crop&q=80" },
                ].map((item) => (
                  <div key={item.name} className="flex gap-2 items-center mx-2.5 mb-1 bg-gray-50 rounded-lg p-1.5">
                    <img src={item.img} alt={item.name} className="w-8 h-8 rounded-md object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[8px] font-semibold text-gray-900">{item.name}</p>
                    </div>
                    <span className="text-[8px] font-bold text-gray-900 pr-1">{item.price}&euro;</span>
                  </div>
                ))}

                <div className="flex justify-center py-1.5">
                  <div className="w-14 h-0.5 bg-gray-900 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
