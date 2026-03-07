"use client";

import { Restaurant, Menu, Review } from "@/types";
import { Star, Info, ChevronRight, Search } from "lucide-react";
import { MenuIcon } from "@/components/menus/menu-icon";

interface HomeScreenProps {
  restaurant: Restaurant;
  menus: Menu[];
  reviews: Review[];
  onMenuClick: (menu: Menu) => void;
  onReviewClick?: () => void;
  onInfoClick: () => void;
  onSearchClick?: () => void;
}

export function HomeScreen({ restaurant, menus, reviews, onMenuClick, onReviewClick, onInfoClick, onSearchClick }: HomeScreenProps) {
  const avgRating = reviews.length > 0
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;

  return (
    <>
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Cover image */}
        <div className="relative h-44 bg-gradient-to-br from-amber-200 via-orange-300 to-red-300 overflow-hidden">
          {restaurant.coverImage && (
            <img src={restaurant.coverImage} alt={restaurant.name} className="absolute inset-0 w-full h-full object-cover" />
          )}
          <button onClick={onSearchClick} className="absolute top-3 right-3 w-9 h-9 bg-white/80 backdrop-blur rounded-full flex items-center justify-center">
            <Search size={16} />
          </button>
        </div>

        {/* Restaurant info */}
        <div className="px-4 py-3">
          <h2 className="text-lg font-bold text-gray-900">{restaurant.name}</h2>

          {reviews.length > 0 && (
            <div className="flex items-center gap-2 mt-2.5 py-2">
              <Star size={16} className="text-gray-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">
                  {avgRating.toFixed(0)} · Tres bon
                </p>
                <p className="text-xs text-gray-500">{reviews.length} avis</p>
              </div>
              <ChevronRight size={16} className="text-gray-400 shrink-0" />
            </div>
          )}

          <button onClick={onInfoClick} className="w-full flex items-center gap-2 py-2 text-left">
            <Info size={16} className="text-gray-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">Info</p>
              <p className="text-xs text-gray-500">
                {[
                  restaurant.wifi && "Wi-Fi",
                  restaurant.phone && "Telephone",
                  restaurant.address && "Adresse",
                ].filter(Boolean).join(" et ")}
              </p>
            </div>
            <ChevronRight size={16} className="text-gray-400 shrink-0" />
          </button>
        </div>

        {/* Menu list */}
        <div className="px-4 pb-6 space-y-2">
          {menus.filter((m) => m.visible !== false).map((menu) => (
            <button
              key={menu.id}
              onClick={() => onMenuClick(menu)}
              className="w-full flex items-center gap-3 px-4 py-3.5 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all text-left"
            >
              <MenuIcon name={menu.icon} size={18} className="text-gray-500 shrink-0" />
              <span className="text-sm font-medium text-gray-900">{menu.name}</span>
            </button>
          ))}
        </div>
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
