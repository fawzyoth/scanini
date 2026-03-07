"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "Scanini est-il une application ?",
    a: "Non, Scanini n'est pas une application native. Vos clients n'ont rien à télécharger. Quand ils scannent votre QR code, ils sont redirigés vers une page web avec votre menu. Ça fonctionne sur n'importe quel smartphone avec un appareil photo.",
  },
  {
    q: "Est-ce facile de créer un menu avec QR code ?",
    a: "Absolument. Scanini est conçu pour être simple, sans aucune compétence technique. Dans l'éditeur, vous pouvez ajouter des plats et catégories facilement. Une fois enregistré, le menu est instantanément mis à jour et synchronisé avec votre QR code.",
  },
  {
    q: "Puis-je modifier les prix ou les plats ?",
    a: "Oui ! Vous pouvez modifier tous les détails de votre menu quand vous le souhaitez. Un plat est en rupture ? Accédez au panneau de contrôle et masquez-le pour que les clients ne le voient plus. Les changements sont reflétés instantanément.",
  },
  {
    q: "Puis-je utiliser Scanini gratuitement ?",
    a: "Bien sûr ! Vous pouvez utiliser Scanini gratuitement avec le plan Gratuit. Si vous souhaitez plus de plats, de menus ou de scans, vous pouvez passer à un plan payant à tout moment.",
  },
  {
    q: "Comment fonctionne le système d'avis ?",
    a: "Vos clients peuvent évaluer leur expérience directement depuis le menu digital. Vous consultez tous les avis depuis votre tableau de bord pour améliorer votre service en continu.",
  },
];

export function LandingFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 sm:py-28 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-indigo-600 mb-3">FAQ</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Questions fréquentes
          </h2>
          <p className="mt-4 text-gray-500">
            D&apos;autres questions ?{" "}
            <a href="#contact" className="text-indigo-600 hover:underline font-medium">
              Contactez-nous
            </a>
          </p>
        </div>

        <div className="space-y-2">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="border border-gray-100 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-900">
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-gray-400 shrink-0 ml-4 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4">
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {faq.a}
                    </p>
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
