"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";

const PLANS = [
  {
    name: "Gratuit",
    price: 0,
    yearlyPrice: 0,
    description: "Pour bien démarrer",
    features: ["1 menu", "Jusqu'à 15 plats", "200 scans / mois", "QR Code standard"],
    cta: "Commencer",
    highlighted: false,
  },
  {
    name: "Starter",
    price: 9,
    yearlyPrice: 90,
    description: "Pour les petits restaurants",
    features: ["1 menu", "Jusqu'à 30 plats", "1 500 scans / mois", "QR Code standard"],
    cta: "Essai gratuit",
    highlighted: false,
  },
  {
    name: "Pro",
    price: 29,
    yearlyPrice: 240,
    description: "Pour les restaurants en croissance",
    features: ["Jusqu'à 5 menus", "60 plats par menu", "6 000 scans / mois", "QR personnalisé", "Sans logo Scanini"],
    cta: "Essai gratuit",
    highlighted: true,
  },
  {
    name: "Business",
    price: 49,
    yearlyPrice: 490,
    description: "Pour les chaînes",
    features: ["Menus illimités", "Plats illimités", "20 000 scans / mois", "QR personnalisé", "Support prioritaire"],
    cta: "Nous contacter",
    highlighted: false,
  },
];

export function LandingPricing() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  return (
    <section id="pricing" className="py-24 sm:py-32 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
            Tarifs
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            Simple et transparent
          </h2>
          <p className="mt-3 text-gray-500">
            Aucun frais caché. Commencez gratuitement.
          </p>
        </div>

        {/* Toggle */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all ${
                billing === "monthly" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all ${
                billing === "yearly" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Annuel
              <span className="ml-1.5 text-[10px] text-emerald-600 font-semibold">-2 mois</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PLANS.map((plan) => {
            const price = billing === "yearly" ? plan.yearlyPrice : plan.price;
            const period = billing === "yearly" ? "/an" : "/mois";

            return (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-6 transition-all ${
                  plan.highlighted
                    ? "bg-gray-900 text-white ring-2 ring-gray-900 shadow-2xl shadow-gray-900/20 scale-[1.02]"
                    : "bg-gray-50 hover:bg-white hover:shadow-lg hover:border-gray-200 border border-transparent"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] font-semibold px-3 py-1 rounded-full">
                      Populaire
                    </span>
                  </div>
                )}

                <p className={`text-sm font-medium ${plan.highlighted ? "text-gray-400" : "text-gray-500"}`}>
                  {plan.name}
                </p>

                <div className="mt-3 mb-5">
                  {price === 0 ? (
                    <span className={`text-4xl font-bold tracking-tight ${plan.highlighted ? "text-white" : "text-gray-900"}`}>
                      Gratuit
                    </span>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className={`text-4xl font-bold tracking-tight ${plan.highlighted ? "text-white" : "text-gray-900"}`}>
                        {price}
                      </span>
                      <span className={`text-sm ${plan.highlighted ? "text-gray-400" : "text-gray-500"}`}>
                        DT {period}
                      </span>
                    </div>
                  )}
                </div>

                <Link
                  href="/signup"
                  className={`block w-full text-center text-sm font-semibold py-2.5 rounded-xl transition-colors mb-6 ${
                    plan.highlighted
                      ? "bg-white text-gray-900 hover:bg-gray-100"
                      : "bg-gray-900 text-white hover:bg-gray-800"
                  }`}
                >
                  {plan.cta}
                </Link>

                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <Check size={15} className={`shrink-0 mt-0.5 ${plan.highlighted ? "text-gray-500" : "text-gray-400"}`} />
                      <span className={`text-sm ${plan.highlighted ? "text-gray-300" : "text-gray-600"}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
