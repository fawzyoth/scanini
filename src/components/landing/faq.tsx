"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "Is Scanini an app?",
    a: "Scanini is not a native app — your customers don't need to download anything. The moment they scan your QR code, they're redirected to a web page with your restaurant menu. It works on any smartphone with a camera.",
  },
  {
    q: "Is it easy to create a menu with QR?",
    a: "Absolutely. Scanini is designed to be easy to use with no programming or design knowledge. In the editor you can drag and drop dishes and categories. Once you save, the menu is instantly updated and synced with the QR code at your tables.",
  },
  {
    q: "Can I change prices or dishes?",
    a: "Yes! You can change all menu details whenever you want. Run out of a dish? Access the control panel and hide it so customers can't order it. Changes are reflected instantly.",
  },
  {
    q: "Can I manage multiple restaurants?",
    a: "Yes, you can associate all your restaurants to the same account. From the control panel you can quickly switch between restaurants without logging out.",
  },
  {
    q: "Can I use Scanini for free?",
    a: "Of course! You can use Scanini free with the Basic plan. If you'd like more dishes, menus, or features like multi-language or reviews integration, you can upgrade to a paid plan at any time.",
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
            Frequently asked questions
          </h2>
          <p className="mt-4 text-gray-500">
            Have other questions?{" "}
            <a href="#contact" className="text-indigo-600 hover:underline font-medium">
              Get in touch
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
