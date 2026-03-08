"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui";
import { Check, X, Zap, Crown, Loader2 } from "lucide-react";
import { useDashboard } from "@/lib/dashboard-context";
import { PLAN_LIMITS } from "@/data/admin-mock";
import { useTranslation } from "@/lib/i18n/i18n-context";
import { COMPARISON_FEATURES, PLAN_ORDER, type PlanId } from "@/lib/plan-config";
import { usePlanConfigs } from "@/lib/use-plan-configs";

export default function BillingPage() {
  const { restaurant, usage, loading } = useDashboard();
  const { t } = useTranslation();
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const { plans: plansMap, orderedPlans } = usePlanConfigs();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-gray-400" />
      </div>
    );
  }

  const currentPlanId = (restaurant?.plan ?? "free") as PlanId;
  const currentPlan = plansMap[currentPlanId];
  const limits = PLAN_LIMITS[currentPlanId] ?? PLAN_LIMITS.free;
  const plans = orderedPlans;

  return (
    <>
      <PageHeader title={t("billing.title")} />

      <div className="max-w-5xl space-y-6">
        {/* Current plan overview */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">{t("billing.currentPlan")}</h2>
          </div>
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900">{currentPlan.name}</span>
                  <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    {t("common.active")}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {currentPlan.monthlyPrice === 0 ? t("billing.freeForever") : `${currentPlan.monthlyPrice} DT ${t("billing.perMonth")}`}
                </p>
              </div>
              <a
                href="#plans"
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Zap size={16} />
                {t("billing.upgradePlan")}
              </a>
            </div>
          </div>
        </div>

        {/* Usage & limits */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">{t("billing.usageLimits")}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{t("billing.yourUsageOn")} {currentPlan.name}</p>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <UsageMeter label={t("billing.menus")} current={usage.menus} max={limits.menus} />
            <UsageMeter label={t("billing.dishes")} current={usage.dishes} max={limits.dishes} />
            <UsageMeter label={t("billing.scansThisMonth")} current={usage.scansThisMonth} max={limits.scans} />
          </div>
        </div>

        {/* Plans */}
        <div id="plans" className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-gray-900">{t("billing.plans")}</h2>
                <p className="text-sm text-gray-500 mt-0.5">{t("billing.choosePlan")}</p>
              </div>

              <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
                <button
                  onClick={() => setBilling("monthly")}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    billing === "monthly"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {t("billing.monthly")}
                </button>
                <button
                  onClick={() => setBilling("yearly")}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    billing === "yearly"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {t("billing.yearly")}
                  <span className="ml-1 text-xs text-green-600 font-semibold">{t("billing.save2Months")}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {plans.map((plan) => {
                const isCurrent = plan.id === currentPlanId;
                const price = billing === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;
                const period = billing === "yearly" ? "/ year" : "/ month";
                const currentIdx = PLAN_ORDER.indexOf(currentPlanId);
                const planIdx = PLAN_ORDER.indexOf(plan.id);
                const isUpgrade = planIdx > currentIdx;
                const isDowngrade = planIdx < currentIdx;

                return (
                  <div
                    key={plan.id}
                    className={`relative rounded-xl border p-5 flex flex-col ${
                      plan.popular
                        ? "border-indigo-300 ring-2 ring-indigo-100"
                        : "border-gray-200"
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-indigo-600 text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
                        <Crown size={10} />
                        {t("billing.mostPopular")}
                      </div>
                    )}

                    <h3 className="text-sm font-semibold text-gray-900">{plan.name}</h3>

                    <div className="mt-3 mb-4">
                      {price === 0 ? (
                        <span className="text-2xl font-bold text-gray-900">{t("billing.free")}</span>
                      ) : (
                        <>
                          <span className="text-2xl font-bold text-gray-900">{price} DT</span>
                          <span className="text-sm text-gray-500 ml-1">{period}</span>
                        </>
                      )}
                    </div>

                    <ul className="space-y-2 flex-1 mb-5">
                      <li className="flex items-start gap-2">
                        <Check size={14} className="text-indigo-600 shrink-0 mt-0.5" />
                        <span className="text-xs text-gray-600">
                          {plan.features.maxMenus >= 999 ? "Menus illimites" : `${plan.features.maxMenus} menu${plan.features.maxMenus > 1 ? "s" : ""}`}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check size={14} className="text-indigo-600 shrink-0 mt-0.5" />
                        <span className="text-xs text-gray-600">
                          {plan.features.maxDishes >= 999 ? "Plats illimites" : `Jusqu'a ${plan.features.maxDishes} plats`}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check size={14} className="text-indigo-600 shrink-0 mt-0.5" />
                        <span className="text-xs text-gray-600">
                          {plan.features.maxScansPerMonth >= 999999 ? "Scans illimites" : `${plan.features.maxScansPerMonth.toLocaleString("fr-FR")} scans / mois`}
                        </span>
                      </li>
                      {plan.features.reviewsEnabled && (
                        <li className="flex items-start gap-2">
                          <Check size={14} className="text-indigo-600 shrink-0 mt-0.5" />
                          <span className="text-xs text-gray-600">Avis clients</span>
                        </li>
                      )}
                      {plan.features.searchEnabled && (
                        <li className="flex items-start gap-2">
                          <Check size={14} className="text-indigo-600 shrink-0 mt-0.5" />
                          <span className="text-xs text-gray-600">Recherche</span>
                        </li>
                      )}
                      {plan.features.whiteLabel && (
                        <li className="flex items-start gap-2">
                          <Check size={14} className="text-indigo-600 shrink-0 mt-0.5" />
                          <span className="text-xs text-gray-600">Marque blanche</span>
                        </li>
                      )}
                      {plan.features.supportHours && (
                        <li className="flex items-start gap-2">
                          <Check size={14} className="text-indigo-600 shrink-0 mt-0.5" />
                          <span className="text-xs text-gray-600">Support {plan.features.supportHours}</span>
                        </li>
                      )}
                    </ul>

                    <p className="text-[10px] text-gray-400 mb-3">{plan.description}</p>

                    {isCurrent ? (
                      <button
                        disabled
                        className="w-full text-center text-sm font-medium py-2 rounded-lg bg-gray-100 text-gray-400 cursor-default"
                      >
                        {t("billing.currentPlanBtn")}
                      </button>
                    ) : (
                      <a
                        href={`https://wa.me/32465987804?text=${encodeURIComponent(
                          isUpgrade
                            ? `Bonjour, je souhaite passer au plan ${plan.name} (${billing}). Restaurant: ${restaurant?.name ?? "N/A"}`
                            : `Bonjour, je souhaite passer au plan ${plan.name} (${billing}). Restaurant: ${restaurant?.name ?? "N/A"}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-full block text-center text-sm font-medium py-2 rounded-lg transition-colors ${
                          isUpgrade
                            ? plan.popular
                              ? "bg-indigo-600 text-white hover:bg-indigo-700"
                              : "bg-indigo-600 text-white hover:bg-indigo-700"
                            : "border border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {isUpgrade ? t("common.upgrade") : t("common.downgrade")}
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Comparison table */}
          <div className="px-6 pb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Comparaison detaillee</h3>
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-2.5 px-3 font-medium text-gray-500">Fonctionnalite</th>
                    {plans.map((plan) => (
                      <th key={plan.id} className={`text-center py-2.5 px-3 font-semibold ${plan.id === currentPlanId ? "text-indigo-600" : "text-gray-700"}`}>
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_FEATURES.map((row) => (
                    <tr key={row.key} className="border-b border-gray-100">
                      <td className="py-2 px-3 text-gray-600 font-medium">{row.label}</td>
                      {plans.map((plan) => {
                        const value = plan.features[row.key as keyof typeof plan.features];
                        const formatted = (row.format as (v: any) => string)(value);
                        const isCheck = formatted === "Oui";
                        const isDash = formatted === "\u2014";

                        return (
                          <td key={plan.id} className="text-center py-2 px-3">
                            {isCheck ? (
                              <Check size={14} className="mx-auto text-emerald-500" />
                            ) : isDash ? (
                              <X size={12} className="mx-auto text-gray-300" />
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
      </div>
    </>
  );
}

function UsageMeter({ label, current, max }: { label: string; current: number; max: number }) {
  const { t } = useTranslation();
  const displayMax = max >= 999 ? t("billing.unlimited") : max.toString();
  const pct = max >= 999 ? Math.min((current / 100) * 10, 100) : Math.min((current / max) * 100, 100);
  const overLimit = max < 999 && current > max;

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className={`text-sm font-semibold ${overLimit ? "text-red-600" : "text-gray-900"}`}>
          {current} / {displayMax}
        </span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            overLimit ? "bg-red-500" : pct > 80 ? "bg-amber-500" : "bg-indigo-600"
          }`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
      {overLimit && (
        <p className="text-xs text-red-500 mt-1">{t("billing.overLimit")}</p>
      )}
    </div>
  );
}
