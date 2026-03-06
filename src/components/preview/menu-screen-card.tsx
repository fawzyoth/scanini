"use client";

import { useState } from "react";
import { Menu, Dish } from "@/types";
import { ArrowLeft, Search } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { AllergenIcons } from "./allergen-icons";

interface MenuScreenCardProps {
  menu: Menu;
  onBack: () => void;
  onDishClick: (dish: Dish) => void;
  onReviewClick?: () => void;
}

export function MenuScreenCard({ menu, onBack, onDishClick, onReviewClick }: MenuScreenCardProps) {
  const [activeCatId, setActiveCatId] = useState<string>(menu.categories[0]?.id ?? "");
  const activeCategory = menu.categories.find((c) => c.id === activeCatId);

  return (
    <>
      {/* Header */}
      <div className="shrink-0 flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-white">
        <button onClick={onBack} className="p-1 -ml-1 text-gray-700 hover:text-gray-900">
          <ArrowLeft size={20} />
        </button>
        <h2 className="flex-1 text-base font-bold text-gray-900">{menu.name}</h2>
        <button className="p-1 text-gray-500">
          <Search size={18} />
        </button>
      </div>

      {/* Category tabs */}
      {menu.categories.length > 1 && (
        <div className="shrink-0 px-4 py-2 bg-white border-b border-gray-100">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {menu.categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCatId(cat.id)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  cat.id === activeCatId
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto bg-gray-50 px-4 py-4">
        {activeCategory && (
          <div className="space-y-3">
            {activeCategory.dishes
              .filter((d) => d.available)
              .map((dish) => (
                <button
                  key={dish.id}
                  onClick={() => onDishClick(dish)}
                  className="w-full flex items-start gap-3 p-3 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all text-left"
                >
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-semibold text-gray-900 line-clamp-1">
                      {dish.name}
                    </span>
                    {dish.description && (
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                        {dish.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      {dish.variants && dish.variants.length > 0 ? (
                        <span className="text-sm font-semibold text-gray-900">
                          {formatCurrency(dish.variants[0].price, dish.currency)}
                        </span>
                      ) : (
                        <span className="text-sm font-semibold text-gray-900">
                          {formatCurrency(dish.price, dish.currency)}
                        </span>
                      )}
                      <span className="text-xs text-orange-500 font-medium underline">
                        Add to Cart
                      </span>
                    </div>
                    <AllergenIcons allergens={dish.allergens} />
                  </div>
                  {dish.image && (
                    <div className="w-20 h-20 rounded-xl bg-gray-200 shrink-0 overflow-hidden">
                      <img
                        src={dish.image}
                        alt={dish.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </button>
              ))}
          </div>
        )}
      </div>

      {/* Rate button */}
      {onReviewClick && (
        <div className="shrink-0 px-4 pb-3 pt-2 bg-white border-t border-gray-100">
          <button
            onClick={onReviewClick}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-900 text-white rounded-full text-sm font-medium"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
            </svg>
            Evaluez votre experience
          </button>
        </div>
      )}
    </>
  );
}
