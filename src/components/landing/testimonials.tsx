import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    quote: "Scanini est très facile à utiliser et s'adapte à tous nos besoins. On peut ajouter des plats au quotidien et masquer un produit en rupture instantanément.",
    name: "Marta B.",
    role: "Propriétaire",
    restaurant: "Sa Cantina, Manacor",
  },
  {
    quote: "Un outil indispensable. On met à jour nos plats quand on veut sans réimprimer les menus. On économise des centaines d'euros par an.",
    name: "David F.",
    role: "Gérant",
    restaurant: "Damon's Grill, Miami",
  },
  {
    quote: "Le menu est beaucoup plus visuel et intuitif. L'application offre un contrôle complet avec de nombreuses options de personnalisation.",
    name: "Joan Q.",
    role: "Propriétaire",
    restaurant: "Sorsi e Morsi, Valencia",
  },
];

export function LandingTestimonials() {
  return (
    <section className="py-24 sm:py-32 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-white text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full mb-4 border border-gray-200">
            Témoignages
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            Ils nous font confiance
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-2xl p-7 border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={14} className="text-amber-400 fill-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                &laquo; {t.quote} &raquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-5 border-t border-gray-100">
                <div className="w-9 h-9 bg-gray-900 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">{t.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}, {t.restaurant}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
