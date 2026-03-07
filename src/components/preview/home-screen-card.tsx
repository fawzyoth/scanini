"use client";

import { useState } from "react";
import { Restaurant, Menu, Review, Dish } from "@/types";
import { Star, Info, ChevronRight, Search, ShoppingCart } from "lucide-react";
import { MenuIcon } from "@/components/menus/menu-icon";
import { formatCurrency } from "@/lib/utils";
import { AllergenIcons } from "./allergen-icons";

interface HomeScreenCardProps {
  restaurant: Restaurant;
  menus: Menu[];
  reviews: Review[];
  onMenuClick: (menu: Menu) => void;
  onDishClick: (dish: Dish) => void;
  onReviewClick?: () => void;
  onInfoClick: () => void;
  onSearchClick?: () => void;
}

export function HomeScreenCard({
  restaurant,
  menus,
  reviews,
  onMenuClick,
  onDishClick,
  onReviewClick,
  onInfoClick,
  onSearchClick,
}: HomeScreenCardProps) {
  const visibleMenus = menus.filter((m) => m.visible !== false);
  const [activeMenuId, setActiveMenuId] = useState<string>(visibleMenus[0]?.id ?? "");

  const activeMenu = visibleMenus.find((m) => m.id === activeMenuId);

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : 0;

  return (
    <>
      <div className="flex-1 overflow-y-auto">
        {/* Cover image */}
        <div className="relative h-44 bg-gradient-to-br from-amber-200 via-orange-300 to-red-300 overflow-hidden">
          {restaurant.coverImage && (
            <img
              src={restaurant.coverImage}
              alt={restaurant.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <button onClick={onSearchClick} className="absolute top-3 left-3 w-9 h-9 bg-white/80 backdrop-blur rounded-full flex items-center justify-center">
            <Search size={16} />
          </button>
          <button
            onClick={onInfoClick}
            className="absolute top-3 right-3 w-9 h-9 bg-white/80 backdrop-blur rounded-full flex items-center justify-center"
          >
            <Info size={16} />
          </button>
        </div>

        {/* Restaurant name */}
        <div className="px-4 py-3">
          <h2 className="text-lg font-bold text-gray-900">{restaurant.name}</h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-1 mt-1">
              <Star size={14} className="text-amber-400 fill-amber-400" />
              <span className="text-sm font-medium text-gray-700">
                {avgRating.toFixed(1)}
              </span>
              <span className="text-xs text-gray-400">({reviews.length})</span>
            </div>
          )}
        </div>

        {/* Category tabs */}
        {visibleMenus.length > 0 && (
          <div className="px-4 pb-2">
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {visibleMenus.map((menu) => (
                <button
                  key={menu.id}
                  onClick={() => setActiveMenuId(menu.id)}
                  className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    menu.id === activeMenuId
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {menu.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Active menu dishes */}
        {activeMenu && (
          <div className="px-4 pb-6">
            {activeMenu.categories.map((category) => {
              const availableDishes = category.dishes.filter((d) => d.available);
              if (availableDishes.length === 0) return null;

              const hideHeader = activeMenu.categories.length === 1 && !category.name;
              return (
                <div key={category.id} className="mb-4">
                  {!hideHeader && (
                  <h3 className="text-base font-bold text-gray-900 mb-3">
                    {category.name}
                  </h3>
                  )}
                  <div className="space-y-3">
                    {availableDishes.map((dish) => (
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
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating cart button */}
      {onReviewClick && (
        <button
          onClick={onReviewClick}
          className="absolute bottom-12 right-4 w-12 h-12 bg-orange-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-orange-600 transition-colors"
        >
          <ShoppingCart size={20} />
        </button>
      )}

      {/* Get your menu CTA */}
      <a
        href={`https://wa.me/32465987804?text=${encodeURIComponent("Bonjour, je souhaite créer mon menu digital avec Scanini!")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-1.5 py-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
      >
        <span>Obtenez votre Menu Digital</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/></svg>
      </a>
    </>
  );
}
