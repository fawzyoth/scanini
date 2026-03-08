"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const FAQS = [
  {
    q: "Scanini est-il une application ?",
    a: "Non. Vos clients n'ont rien à télécharger. Quand ils scannent votre QR code, ils voient votre menu directement dans leur navigateur. Ça fonctionne sur n'importe quel smartphone.",
  },
  {
    q: "Est-ce facile de créer un menu ?",
    a: "Absolument. Aucune compétence technique requise. Ajoutez vos plats et catégories facilement. Une fois enregistré, le menu est instantanément synchronisé avec votre QR code.",
  },
  {
    q: "Puis-je modifier les prix ou les plats ?",
    a: "Oui ! Modifiez tout quand vous le souhaitez. Un plat en rupture ? Masquez-le en un clic. Les changements sont reflétés instantanément.",
  },
  {
    q: "Puis-je utiliser Scanini gratuitement ?",
    a: "Bien sûr ! Le plan gratuit inclut 1 menu, 15 plats et 200 scans par mois. Vous pouvez passer à un plan payant à tout moment.",
  },
  {
    q: "Comment fonctionne le système d'avis ?",
    a: "Vos clients évaluent leur expérience directement depuis le menu digital. Vous consultez tous les avis depuis votre tableau de bord.",
  },
];

export function LandingFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 sm:py-32 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-white text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full mb-4 border border-gray-200">
            FAQ
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            Questions fréquentes
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className={`rounded-2xl transition-all duration-200 ${
                  isOpen ? "bg-white shadow-lg shadow-gray-100/50 border border-gray-200" : "bg-white border border-gray-100 hover:border-gray-200"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                >
                  <span className="text-sm font-semibold text-gray-900 pr-4">{faq.q}</span>
                  <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                    isOpen ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500"
                  }`}>
                    {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                  </div>
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 -mt-1">
                    <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
