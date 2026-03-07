import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

export function LandingHero() {
  return (
    <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 via-white to-white" />
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-100/40 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
            Stickers QR gratuits pour votre restaurant
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-tight">
            Votre menu digital{" "}
            <span className="text-indigo-600">prêt plus vite qu&apos;un panini</span>
          </h1>

          {/* Subheading */}
          <p className="mt-6 text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Scanini est la solution tout-en-un pour créer, gérer et partager le menu digital de votre restaurant. Aucune application à télécharger.
          </p>

          {/* CTA buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-200 transition-all hover:shadow-xl hover:shadow-indigo-200"
            >
              Créer mon menu
              <ArrowRight size={16} />
            </Link>
            <a
              href="#demo"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-xl border border-gray-200 transition-colors"
            >
              <Play size={14} className="text-indigo-600" />
              Voir un vrai menu
            </a>
          </div>
        </div>

        {/* Phone mockup */}
        <div className="mt-16 sm:mt-20 flex justify-center">
          <div className="relative">
            {/* Glow */}
            <div className="absolute -inset-8 bg-gradient-to-r from-indigo-200/30 via-purple-200/30 to-indigo-200/30 rounded-[3rem] blur-2xl" />

            {/* Phone frame */}
            <div className="relative w-[280px] sm:w-[300px] bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl ring-1 ring-white/10">
              <div className="relative z-20 flex justify-center">
                <div className="w-20 h-5 bg-gray-900 rounded-b-xl" />
              </div>
              <div className="w-full bg-white rounded-[2rem] overflow-hidden -mt-5">
                {/* Status bar */}
                <div className="flex items-center justify-between px-5 pt-2 pb-1 text-[9px] font-semibold">
                  <span>9:41</span>
                  <div className="w-3 h-2 border border-current rounded-sm relative">
                    <div className="absolute inset-[1px] bg-current rounded-[1px]" style={{ width: "70%" }} />
                  </div>
                </div>

                {/* Cover */}
                <div className="relative h-28">
                  <img
                    src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=200&fit=crop&q=80"
                    alt="Restaurant"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-2 left-3">
                    <p className="text-white text-sm font-bold">La Bouffe</p>
                    <p className="text-[8px] text-white/80">Paris, France</p>
                  </div>
                </div>

                {/* Category tabs */}
                <div className="flex gap-1 px-3 py-2">
                  <span className="text-[8px] font-semibold text-white bg-gray-900 rounded-full px-2 py-0.5">Petit-déj</span>
                  <span className="text-[8px] text-gray-500 bg-gray-100 rounded-full px-2 py-0.5">Déjeuner</span>
                  <span className="text-[8px] text-gray-500 bg-gray-100 rounded-full px-2 py-0.5">Boissons</span>
                </div>

                {/* Menu items */}
                {[
                  { name: "Croissant Beurre", price: "2.50", img: "https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=80&h=80&fit=crop&q=80" },
                  { name: "Eggs Benedict", price: "12.00", img: "https://images.unsplash.com/photo-1608039829572-9b0189ea6268?w=80&h=80&fit=crop&q=80" },
                  { name: "Avocado Toast", price: "9.50", img: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=80&h=80&fit=crop&q=80" },
                ].map((item) => (
                  <div key={item.name} className="flex gap-2 items-center mx-3 mb-1.5 bg-gray-50 rounded-xl p-1.5">
                    <img src={item.img} alt={item.name} className="w-9 h-9 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] font-semibold text-gray-900">{item.name}</p>
                    </div>
                    <span className="text-[9px] font-bold text-gray-900 pr-1">{item.price}&euro;</span>
                  </div>
                ))}

                {/* Home indicator */}
                <div className="flex justify-center py-2">
                  <div className="w-16 h-0.5 bg-gray-900 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
