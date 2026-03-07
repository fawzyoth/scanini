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
  onSearchClick?: () => void;
}

export function MenuScreen({ menu, onBack, onDishClick, onReviewClick, onSearchClick }: MenuScreenProps) {
  return (
    <>
      {/* Header */}
      <div className="shrink-0 flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-white">
        <button onClick={onBack} className="p-1 -ml-1 text-gray-700 hover:text-gray-900">
          <ArrowLeft size={20} />
        </button>
        <h2 className="flex-1 text-base font-bold text-gray-900">{menu.name}</h2>
        <button onClick={onSearchClick} className="p-1 text-gray-500">
          <Search size={18} />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {menu.categories.map((category) => {
          const hideHeader = menu.categories.length === 1 && !category.name;
          return (
          <div key={category.id} className="mb-1">
            {/* Category header */}
            {!hideHeader && (
            <div className="px-4 py-3 bg-gray-50">
              <h3 className="text-base font-bold text-gray-900">{category.name}</h3>
            </div>
            )}

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
                      <span className="text-sm font-semibold text-gray-900">{dish.name}</span>
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
                      <AllergenIcons allergens={dish.allergens} />
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
          );
        })}
      </div>

      {/* Rate button + Get your menu CTA */}
      <div className="shrink-0 px-4 pb-3 pt-2 bg-white border-t border-gray-100 space-y-2">
        {onReviewClick && (
          <button
            onClick={onReviewClick}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-900 text-white rounded-full text-sm font-medium"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
            </svg>
            Evaluez votre experience
          </button>
        )}
        <a
          href={`https://wa.me/32465987804?text=${encodeURIComponent("Bonjour, je souhaite créer mon menu digital avec Scanini!")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 py-2 text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          <span>Obtenez votre Menu Digital</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/></svg>
        </a>
      </div>
    </>
  );
}
