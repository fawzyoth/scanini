"use client";

import { Menu, Dish } from "@/types";
import { ArrowLeft, Search } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { AllergenIcons } from "./allergen-icons";

interface MenuScreenProps {
  menu: Menu;
  onBack: () => void;
  onDishClick: (dish: Dish) => void;
  onReviewClick?: () => void;
}

export function MenuScreen({ menu, onBack, onDishClick, onReviewClick }: MenuScreenProps) {
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

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {menu.categories.map((category) => (
          <div key={category.id} className="mb-1">
            {/* Category header */}
            <div className="px-4 py-3 bg-gray-50">
              <h3 className="text-base font-bold text-gray-900">{category.name}</h3>
            </div>

            {/* Dishes */}
            <div className="bg-white">
              {category.dishes
                .filter((d) => d.available)
                .map((dish, i, arr) => (
                  <button
                    key={dish.id}
                    onClick={() => onDishClick(dish)}
                    className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold text-gray-900">{dish.name}</span>
                        <AllergenIcons allergens={dish.allergens} />
                      </div>
                      {dish.description && (
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{dish.description}</p>
                      )}
                      {dish.variants && dish.variants.length > 0 ? (
                        <div className="mt-1 space-y-0.5">
                          {dish.variants.map((v, vi) => (
                            <div key={vi} className="flex gap-2 text-xs">
                              <span className="text-gray-500">{v.label}</span>
                              <span className="font-semibold text-gray-900">{formatCurrency(v.price, dish.currency)}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm font-semibold text-gray-900 mt-1">
                          {formatCurrency(dish.price, dish.currency)}
                        </p>
                      )}
                    </div>
                    {dish.image && (
                      <div className="w-16 h-16 rounded-xl bg-gray-200 shrink-0 overflow-hidden">
                        <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
                      </div>
                    )}
                  </button>
                ))}
            </div>
          </div>
        ))}
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
