"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const TESTIMONIALS = [
  {
    quote:
      "Scanini est très facile à utiliser, pratique et s'adapte à tous nos besoins. On peut ajouter des plats au quotidien et si un produit est en rupture, on le masque instantanément. Le service client est attentif et rapide.",
    name: "Marta B.",
    role: "Propriétaire",
    restaurant: "Sa Cantina, Manacor",
  },
  {
    quote:
      "Scanini est un outil indispensable pour gérer notre carte. On met à jour nos plats quand on veut sans réimprimer les menus. Et on économise des centaines d'euros par an en frais d'impression.",
    name: "David F.",
    role: "Gérant",
    restaurant: "Damon's Grill, Miami",
  },
  {
    quote:
      "Scanini a été une vraie amélioration pour notre relation avec les clients. Le menu est beaucoup plus visuel et intuitif, et l'application offre un contrôle complet avec de nombreuses options de personnalisation.",
    name: "Joan Q.",
    role: "Propriétaire",
    restaurant: "Sorsi e Morsi, Valencia",
  },
];

export function LandingTestimonials() {
  const [current, setCurrent] = useState(0);

  function prev() {
    setCurrent((c) => (c === 0 ? TESTIMONIALS.length - 1 : c - 1));
  }

  function next() {
    setCurrent((c) => (c === TESTIMONIALS.length - 1 ? 0 : c + 1));
  }

  const t = TESTIMONIALS[current];

  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-sm font-semibold text-indigo-600 mb-3">Témoignages</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Adopté par des restaurants partout dans le monde
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-50 rounded-2xl p-8 sm:p-10 text-center relative">
            {/* Stars */}
            <div className="flex items-center justify-center gap-1 mb-6">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={16} className="text-amber-400 fill-amber-400" />
              ))}
            </div>

            {/* Quote */}
            <blockquote className="text-lg sm:text-xl text-gray-700 leading-relaxed">
              &laquo; {t.quote} &raquo;
            </blockquote>

            {/* Author */}
            <div className="mt-6">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-sm font-bold text-indigo-600">
                  {t.name.charAt(0)}
                </span>
              </div>
              <p className="font-semibold text-gray-900">{t.name}</p>
              <p className="text-sm text-gray-500">
                {t.role}, {t.restaurant}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex items-center gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === current ? "bg-indigo-600" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
