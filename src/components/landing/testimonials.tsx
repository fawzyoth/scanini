"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const TESTIMONIALS = [
  {
    quote:
      "Scanini is very easy to use, practical and adapts to all our needs. It allows us to add dishes daily and if I run out of something, I can hide it instantly. The customer service is attentive and fast.",
    name: "Marta Balada",
    role: "Owner",
    restaurant: "Sa Cantina, Manacor",
  },
  {
    quote:
      "Scanini is an essential tool for managing our menu. We update our dishes whenever we want without printing new menus. And we save hundreds of dollars a year on printing costs.",
    name: "David Ferrer",
    role: "Manager",
    restaurant: "Damon's Grill, Miami",
  },
  {
    quote:
      "Scanini has been a great improvement for our relationship with clients. We make our menu much more visual and intuitive, and the app offers extensive control and a wide variety of configuration options.",
    name: "Joan Quiles",
    role: "Owner",
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
          <p className="text-sm font-semibold text-indigo-600 mb-3">Testimonials</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Loved by restaurants worldwide
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
              &ldquo;{t.quote}&rdquo;
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
