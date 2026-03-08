"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui";
import { Check, X, Zap, Crown, Loader2, AlertTriangle, MessageCircle } from "lucide-react";
import { useDashboard } from "@/lib/dashboard-context";
import { PLAN_LIMITS } from "@/data/admin-mock";
import { useTranslation } from "@/lib/i18n/i18n-context";
import { COMPARISON_FEATURES, PLAN_ORDER, type PlanId } from "@/lib/plan-config";
import { usePlanConfigs } from "@/lib/use-plan-configs";

const WHATSAPP_NUMBER = "32465987804";

export default function BillingPage() {
  const { restaurant, usage, loading } = useDashboard();
  const { t } = useTranslation();
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const { plans: plansMap, orderedPlans } = usePlanConfigs();
  const [downgradeWarning, setDowngradeWarning] = useState<{ planId: PlanId; issues: string[] } | null>(null);

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

  // Check if current usage allows downgrade to a target plan
  function checkDowngrade(targetPlanId: PlanId): string[] {
    const targetLimits = PLAN_LIMITS[targetPlanId] ?? PLAN_LIMITS.free;
    const issues: string[] = [];

    if (usage.menus > targetLimits.menus) {
      const excess = usage.menus - targetLimits.menus;
      issues.push(`Supprimez ${excess} menu${excess > 1 ? "s" : ""} (vous en avez ${usage.menus}, limite: ${targetLimits.menus})`);
    }
    if (usage.dishes > targetLimits.dishes) {
      const excess = usage.dishes - targetLimits.dishes;
      issues.push(`Supprimez ${excess} plat${excess > 1 ? "s" : ""} (vous en avez ${usage.dishes}, limite: ${targetLimits.dishes})`);
    }

    return issues;
  }

  function handleDowngradeClick(planId: PlanId, planName: string) {
    const issues = checkDowngrade(planId);
    if (issues.length > 0) {
      setDowngradeWarning({ planId, issues });
    } else {
      // Can downgrade — open WhatsApp
      const msg = encodeURIComponent(
        `Bonjour, je souhaite passer au plan ${planName} (${billing}). Restaurant: ${restaurant?.name ?? "N/A"}`
      );
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
    }
  }

  // Usage warning thresholds
  const menuPct = limits.menus >= 999 ? 0 : (usage.menus / limits.menus) * 100;
  const dishPct = limits.dishes >= 999 ? 0 : (usage.dishes / limits.dishes) * 100;
  const scanPct = limits.scans >= 999999 ? 0 : (usage.scansThisMonth / limits.scans) * 100;
  const showUsageWarning = menuPct >= 80 || dishPct >= 80 || scanPct >= 80;
  const isOverLimit = menuPct > 100 || dishPct > 100 || scanPct > 100;

  return (
    <>
      <PageHeader title={t("billing.title")} />

      <div className="max-w-5xl space-y-6">
        {/* Usage warning banner */}
        {showUsageWarning && (
          <div className={`rounded-xl border p-5 flex flex-col sm:flex-row sm:items-center gap-4 ${
            isOverLimit
              ? "bg-red-50 border-red-200"
              : "bg-amber-50 border-amber-200"
          }`}>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
              isOverLimit ? "bg-red-100" : "bg-amber-100"
            }`}>
              <AlertTriangle size={20} className={isOverLimit ? "text-red-600" : "text-amber-600"} />
            </div>
            <div className="flex-1">
              <p className={`text-sm font-semibold ${isOverLimit ? "text-red-900" : "text-amber-900"}`}>
                {isOverLimit
                  ? "Vous avez depasse les limites de votre plan"
                  : "Vous approchez des limites de votre plan"
                }
              </p>
              <p className={`text-xs mt-0.5 ${isOverLimit ? "text-red-700" : "text-amber-700"}`}>
                {isOverLimit
                  ? "Certaines fonctionnalites peuvent etre limitees. Passez a un plan superieur pour continuer."
                  : "Pensez a passer a un plan superieur pour eviter les interruptions."
                }
              </p>
            </div>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                `Bonjour, je souhaite mettre a niveau mon plan. Restaurant: ${restaurant?.name ?? "N/A"}. Plan actuel: ${currentPlan.name}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors shrink-0"
            >
              <MessageCircle size={16} />
              Nous contacter
            </a>
          </div>
        )}

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

        {/* Downgrade warning modal */}
        {downgradeWarning && (
          <div className="bg-white rounded-xl border-2 border-amber-300 shadow-sm p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
                <AlertTriangle size={20} className="text-amber-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Impossible de changer de plan pour le moment
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Votre utilisation actuelle depasse les limites du plan {plansMap[downgradeWarning.planId]?.name}. Veuillez d&apos;abord effectuer les modifications suivantes :
                </p>
              </div>
            </div>
            <ul className="space-y-2 mb-5">
              {downgradeWarning.issues.map((issue, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-amber-800 bg-amber-50 rounded-lg px-4 py-2.5">
                  <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                  {issue}
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDowngradeWarning(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Compris
              </button>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                  `Bonjour, j'ai besoin d'aide pour changer mon plan. Restaurant: ${restaurant?.name ?? "N/A"}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                <MessageCircle size={14} />
                Besoin d&apos;aide ?
              </a>
            </div>
          </div>
        )}

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
                    ) : isUpgrade ? (
                      <a
                        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                          `Bonjour, je souhaite passer au plan ${plan.name} (${billing}). Restaurant: ${restaurant?.name ?? "N/A"}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full block text-center text-sm font-medium py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                      >
                        {t("common.upgrade")}
                      </a>
                    ) : (
                      <button
                        onClick={() => handleDowngradeClick(plan.id, plan.name)}
                        className="w-full text-center text-sm font-medium py-2 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50 transition-colors"
                      >
                        {t("common.downgrade")}
                      </button>
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
  const nearLimit = max < 999 && !overLimit && pct >= 80;

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className={`text-sm font-semibold ${overLimit ? "text-red-600" : nearLimit ? "text-amber-600" : "text-gray-900"}`}>
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
      {nearLimit && (
        <p className="text-xs text-amber-500 mt-1">Presque atteint</p>
      )}
    </div>
  );
}
