"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Crown } from "lucide-react";

const PLANS = [
  {
    name: "Free",
    price: 0,
    yearlyPrice: 0,
    description: "Perfect to get started",
    features: [
      "1 menu",
      "Up to 15 dishes",
      "200 scans / month",
      "Standard QR Code",
      "Scanini branding",
    ],
    bestFor: "Small cafes testing the product",
    cta: "Get started",
    highlighted: false,
  },
  {
    name: "Starter",
    price: 9,
    yearlyPrice: 90,
    description: "For small restaurants",
    features: [
      "1 menu",
      "Up to 30 dishes",
      "1,500 scans / month",
      "Standard QR Code",
      "Scanini branding",
    ],
    bestFor: "Small restaurants",
    cta: "Start free trial",
    highlighted: false,
  },
  {
    name: "Pro",
    price: 29,
    yearlyPrice: 240,
    description: "For growing restaurants",
    features: [
      "Up to 5 menus",
      "Up to 60 dishes per menu",
      "6,000 scans / month",
      "Custom QR Code",
      "White label (no Scanini logo)",
    ],
    bestFor: "Medium restaurants",
    cta: "Start free trial",
    highlighted: true,
  },
  {
    name: "Business",
    price: 49,
    yearlyPrice: 490,
    description: "For restaurant chains",
    features: [
      "Unlimited menus",
      "Unlimited dishes",
      "20,000 scans / month",
      "Custom QR Code",
      "Full white label",
      "Priority support",
    ],
    bestFor: "Large restaurants and chains",
    cta: "Contact sales",
    highlighted: false,
  },
];

export function LandingPricing() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  return (
    <section id="pricing" className="py-20 sm:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-sm font-semibold text-indigo-600 mb-3">Pricing</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-gray-500 text-lg">
            No hidden fees. No credit card required. Start free and upgrade as you grow.
          </p>
        </div>

        {/* Billing toggle */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                billing === "monthly"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                billing === "yearly"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Yearly
              <span className="ml-1.5 text-xs text-green-600 font-semibold">Save 2 months</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
          {PLANS.map((plan) => {
            const price = billing === "yearly" ? plan.yearlyPrice : plan.price;
            const period = billing === "yearly" ? "/ year" : "/ month";

            return (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-6 ${
                  plan.highlighted
                    ? "bg-indigo-600 text-white ring-4 ring-indigo-200 shadow-xl"
                    : "bg-white border border-gray-200"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-amber-400 text-gray-900 text-xs font-semibold px-3 py-1 rounded-full">
                    <Crown size={12} />
                    Most popular
                  </div>
                )}

                <h3 className={`text-lg font-semibold ${plan.highlighted ? "text-white" : "text-gray-900"}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mt-1 ${plan.highlighted ? "text-indigo-200" : "text-gray-500"}`}>
                  {plan.description}
                </p>

                <div className="mt-5 mb-5">
                  {price === 0 ? (
                    <span className={`text-3xl font-bold ${plan.highlighted ? "text-white" : "text-gray-900"}`}>
                      Free
                    </span>
                  ) : (
                    <>
                      <span className={`text-3xl font-bold ${plan.highlighted ? "text-white" : "text-gray-900"}`}>
                        {price} DT
                      </span>
                      <span className={`text-sm ml-1 ${plan.highlighted ? "text-indigo-200" : "text-gray-500"}`}>
                        {period}
                      </span>
                    </>
                  )}
                </div>

                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check
                        size={15}
                        className={`shrink-0 mt-0.5 ${
                          plan.highlighted ? "text-indigo-200" : "text-indigo-600"
                        }`}
                      />
                      <span className={`text-sm ${plan.highlighted ? "text-indigo-100" : "text-gray-600"}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <p className={`text-[11px] mb-4 ${plan.highlighted ? "text-indigo-300" : "text-gray-400"}`}>
                  Best for: {plan.bestFor}
                </p>

                <Link
                  href="/signup"
                  className={`block w-full text-center text-sm font-semibold py-2.5 rounded-lg transition-colors ${
                    plan.highlighted
                      ? "bg-white text-indigo-600 hover:bg-indigo-50"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
