"use client";

import { Dish } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { AllergenBadges } from "./allergen-icons";

interface DishDetailSheetProps {
  dish: Dish | null;
  onClose: () => void;
}

export function DishDetailSheet({ dish, onClose }: DishDetailSheetProps) {
  if (!dish) return null;

  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Sheet */}
      <div className="relative bg-white rounded-t-2xl max-h-[85%] flex flex-col animate-slide-up">
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-2 shrink-0">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-6">
          {/* Dish image */}
          {dish.image && (
            <div className="w-full h-48 rounded-xl bg-gray-200 mb-4 overflow-hidden">
              <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Name */}
          <h3 className="text-xl font-bold text-gray-900">{dish.name}</h3>

          {/* Price */}
          {dish.variants && dish.variants.length > 0 ? (
            <div className="mt-2 space-y-1">
              {dish.variants.map((v, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-gray-600">{v.label}</span>
                  <span className="font-bold text-gray-900">{formatCurrency(v.price, dish.currency)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-lg font-bold text-gray-900 mt-1">
              {formatCurrency(dish.price, dish.currency)}
            </p>
          )}

          {/* Description */}
          {dish.description && (
            <p className="text-sm text-gray-500 mt-2">{dish.description}</p>
          )}

          {/* Allergens */}
          {dish.allergens.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-bold text-gray-900 mb-2">Allergenes</h4>
              <AllergenBadges allergens={dish.allergens} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
