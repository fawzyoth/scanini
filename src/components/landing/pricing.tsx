"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, X, Crown } from "lucide-react";
import { COMPARISON_FEATURES } from "@/lib/plan-config";
import { usePlanConfigs } from "@/lib/use-plan-configs";

export function LandingPricing() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const { orderedPlans: plans } = usePlanConfigs();

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
            Aucun frais cache. Commencez gratuitement.
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

        {/* Plan cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {plans.map((plan) => {
            const price = billing === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;
            const period = billing === "yearly" ? "/an" : "/mois";

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-6 transition-all ${
                  plan.popular
                    ? "bg-gray-900 text-white ring-2 ring-gray-900 shadow-2xl shadow-gray-900/20 scale-[1.02]"
                    : "bg-gray-50 hover:bg-white hover:shadow-lg hover:border-gray-200 border border-transparent"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] font-semibold px-3 py-1 rounded-full">
                      <Crown size={10} />
                      Populaire
                    </span>
                  </div>
                )}

                <p className={`text-sm font-medium ${plan.popular ? "text-gray-400" : "text-gray-500"}`}>
                  {plan.name}
                </p>

                <div className="mt-3 mb-5">
                  {price === 0 ? (
                    <span className={`text-4xl font-bold tracking-tight ${plan.popular ? "text-white" : "text-gray-900"}`}>
                      Gratuit
                    </span>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className={`text-4xl font-bold tracking-tight ${plan.popular ? "text-white" : "text-gray-900"}`}>
                        {price}
                      </span>
                      <span className={`text-sm ${plan.popular ? "text-gray-400" : "text-gray-500"}`}>
                        DT {period}
                      </span>
                    </div>
                  )}
                </div>

                <p className={`text-xs mb-5 ${plan.popular ? "text-gray-400" : "text-gray-500"}`}>
                  {plan.description}
                </p>

                <Link
                  href="/signup"
                  className={`block w-full text-center text-sm font-semibold py-2.5 rounded-xl transition-colors mb-6 ${
                    plan.popular
                      ? "bg-white text-gray-900 hover:bg-gray-100"
                      : "bg-gray-900 text-white hover:bg-gray-800"
                  }`}
                >
                  {price === 0 ? "Commencer" : "Essai gratuit"}
                </Link>

                <ul className="space-y-3">
                  <PlanFeatureItem highlighted={plan.popular}>
                    {plan.features.maxMenus >= 999 ? "Menus illimites" : `${plan.features.maxMenus} menu${plan.features.maxMenus > 1 ? "s" : ""}`}
                  </PlanFeatureItem>
                  <PlanFeatureItem highlighted={plan.popular}>
                    {plan.features.maxDishes >= 999 ? "Plats illimites" : `Jusqu'a ${plan.features.maxDishes} plats`}
                  </PlanFeatureItem>
                  <PlanFeatureItem highlighted={plan.popular}>
                    {plan.features.maxScansPerMonth >= 999999 ? "Scans illimites" : `${plan.features.maxScansPerMonth.toLocaleString("fr-FR")} scans / mois`}
                  </PlanFeatureItem>
                  {plan.features.reviewsEnabled && (
                    <PlanFeatureItem highlighted={plan.popular}>Avis clients</PlanFeatureItem>
                  )}
                  {plan.features.searchEnabled && (
                    <PlanFeatureItem highlighted={plan.popular}>Recherche</PlanFeatureItem>
                  )}
                  {plan.features.customQr && (
                    <PlanFeatureItem highlighted={plan.popular}>QR personnalise</PlanFeatureItem>
                  )}
                  {plan.features.whiteLabel && (
                    <PlanFeatureItem highlighted={plan.popular}>Marque blanche</PlanFeatureItem>
                  )}
                  {plan.features.supportHours && (
                    <PlanFeatureItem highlighted={plan.popular}>Support {plan.features.supportHours}</PlanFeatureItem>
                  )}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Full comparison table */}
        <div className="mt-16">
          <h3 className="text-xl font-bold text-gray-900 text-center mb-8">
            Comparaison detaillee
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-500 w-[200px]">Fonctionnalite</th>
                  {plans.map((plan) => (
                    <th
                      key={plan.id}
                      className={`text-center py-3 px-4 font-semibold ${
                        plan.popular ? "text-indigo-600" : "text-gray-900"
                      }`}
                    >
                      {plan.name}
                      {plan.popular && (
                        <span className="ml-1.5 inline-flex items-center gap-0.5 text-[9px] font-semibold text-white bg-indigo-600 px-1.5 py-0.5 rounded-full align-middle">
                          <Crown size={8} />
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON_FEATURES.map((row) => (
                  <tr key={row.key} className="border-b border-gray-100 hover:bg-gray-50/50">
                    <td className="py-3 px-4 text-gray-600 font-medium">{row.label}</td>
                    {plans.map((plan) => {
                      const value = plan.features[row.key as keyof typeof plan.features];
                      const formatted = (row.format as (v: any) => string)(value);
                      const isCheck = formatted === "Oui";
                      const isDash = formatted === "\u2014";

                      return (
                        <td key={plan.id} className="text-center py-3 px-4">
                          {isCheck ? (
                            <Check size={16} className="mx-auto text-emerald-500" />
                          ) : isDash ? (
                            <X size={14} className="mx-auto text-gray-300" />
                          ) : (
                            <span className="text-gray-700">{formatted}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

function PlanFeatureItem({ highlighted, children }: { highlighted?: boolean; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <Check size={15} className={`shrink-0 mt-0.5 ${highlighted ? "text-gray-500" : "text-gray-400"}`} />
      <span className={`text-sm ${highlighted ? "text-gray-300" : "text-gray-600"}`}>
        {children}
      </span>
    </li>
  );
}
