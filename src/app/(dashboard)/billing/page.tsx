"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui";
import { Check, Zap, Crown, Loader2 } from "lucide-react";
import { useDashboard } from "@/lib/dashboard-context";
import { PLAN_LIMITS } from "@/data/admin-mock";
import { useTranslation } from "@/lib/i18n/i18n-context";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    yearlyPrice: 0,
    features: [
      "1 menu",
      "Up to 15 dishes",
      "200 scans / month",
      "Standard QR Code",
      "Scanini branding",
    ],
    bestFor: "Small cafes testing the product",
  },
  {
    id: "starter",
    name: "Starter",
    price: 9,
    yearlyPrice: 90,
    features: [
      "1 menu",
      "Up to 30 dishes",
      "1,500 scans / month",
      "Standard QR Code",
      "Scanini branding",
    ],
    bestFor: "Small restaurants",
  },
  {
    id: "pro",
    name: "Pro",
    price: 29,
    yearlyPrice: 240,
    popular: true,
    features: [
      "Up to 5 menus",
      "Up to 60 dishes per menu",
      "6,000 scans / month",
      "Custom QR Code",
      "White label (no Scanini logo)",
    ],
    bestFor: "Medium restaurants",
  },
  {
    id: "business",
    name: "Business",
    price: 49,
    yearlyPrice: 490,
    features: [
      "Unlimited menus",
      "Unlimited dishes",
      "20,000 scans / month",
      "Custom QR Code",
      "Full white label",
      "Priority support",
    ],
    bestFor: "Large restaurants and chains",
  },
];

export default function BillingPage() {
  const { restaurant, usage, loading } = useDashboard();
  const { t } = useTranslation();
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-gray-400" />
      </div>
    );
  }

  const currentPlanId = restaurant?.plan ?? "free";
  const currentPlan = PLANS.find((p) => p.id === currentPlanId)!;
  const limits = PLAN_LIMITS[currentPlanId] ?? PLAN_LIMITS.free;

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
                  {currentPlan.price === 0 ? t("billing.freeForever") : `${currentPlan.price} DT ${t("billing.perMonth")}`}
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
              {PLANS.map((plan) => {
                const isCurrent = plan.id === currentPlanId;
                const price = billing === "yearly" ? plan.yearlyPrice : plan.price;
                const period = billing === "yearly" ? "/ year" : "/ month";

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
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2">
                          <Check size={14} className="text-indigo-600 shrink-0 mt-0.5" />
                          <span className="text-xs text-gray-600">{f}</span>
                        </li>
                      ))}
                    </ul>

                    <p className="text-[10px] text-gray-400 mb-3">{t("billing.bestFor")} {plan.bestFor}</p>

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
                          `Hi, I'd like to upgrade my Scanini plan to ${plan.name} (${billing}). Restaurant: ${restaurant?.name ?? "N/A"}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-full block text-center text-sm font-medium py-2 rounded-lg transition-colors ${
                          plan.popular
                            ? "bg-indigo-600 text-white hover:bg-indigo-700"
                            : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {t("common.upgrade")}
                      </a>
                    )}
                  </div>
                );
              })}
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
