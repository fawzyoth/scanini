"use client";

import { formatCurrency } from "@/lib/utils";
import { Star, Info, Search, MessageCircle, ChevronRight } from "lucide-react";
import { useDashboard } from "@/lib/dashboard-context";
import { MenuIcon } from "@/components/menus/menu-icon";

export function PhonePreview() {
  const { restaurant, menus, reviews } = useDashboard();
  const avgRating = reviews.length > 0
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;

  const restaurantName = restaurant?.name ?? "My Restaurant";
  const coverImage = (restaurant as any)?.cover_image ?? "";

  const infoItems = [
    (restaurant as any)?.wifi_ssid && "Wi-Fi",
    (restaurant as any)?.phone && "Telephone",
    (restaurant as any)?.address && "Adresse",
  ].filter(Boolean);

  const visibleMenus = menus.filter((m) => m.visible);

  return (
    <div className="w-[280px] h-[560px] bg-black rounded-[2.5rem] p-2 shadow-2xl mx-auto">
      <div className="w-full h-full bg-white rounded-[2rem] overflow-hidden overflow-y-auto">
        {/* Status bar */}
        <div className="flex items-center justify-between px-4 py-1 text-xs font-medium">
          <span>23:27</span>
          <div className="flex gap-1">
            <span>...</span>
          </div>
        </div>

        {/* Cover image */}
        <div className="relative h-32 bg-gradient-to-br from-amber-200 via-orange-300 to-red-300 overflow-hidden">
          {coverImage && (
            <img src={coverImage} alt={restaurantName} className="absolute inset-0 w-full h-full object-cover" />
          )}
          <button className="absolute top-2 right-2 w-7 h-7 bg-white/80 rounded-full flex items-center justify-center">
            <Search size={14} />
          </button>
        </div>

        {/* Restaurant info */}
        <div className="px-4 py-3">
          <h2 className="text-base font-bold text-gray-900">{restaurantName}</h2>

          <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
            <Star size={12} className="text-gray-400" />
            <span className="font-medium">{avgRating > 0 ? `${avgRating.toFixed(0)} - Tres bon` : "No reviews yet"}</span>
            {reviews.length > 0 && <span className="text-gray-400">{reviews.length} avis</span>}
            <ChevronRight size={12} className="ml-auto text-gray-400" />
          </div>

          {infoItems.length > 0 && (
            <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-600">
              <Info size={12} className="text-gray-400" />
              <span>{infoItems.join(", ")}</span>
              <ChevronRight size={12} className="ml-auto text-gray-400" />
            </div>
          )}
        </div>

        {/* Menu list */}
        {visibleMenus.length > 0 ? (
          <div className="px-4 pb-3 space-y-1.5">
            {visibleMenus.map((menu) => (
              <div
                key={menu.id}
                className="flex items-center gap-2.5 px-3 py-2.5 bg-white rounded-xl border border-gray-200 text-left"
              >
                <MenuIcon name={menu.icon} size={14} className="text-gray-500 shrink-0" />
                <span className="text-xs font-medium text-gray-900">{menu.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-4 pb-3 text-center text-xs text-gray-400 py-8">
            No menus yet
          </div>
        )}

        {/* Rate button */}
        <div className="px-4 pb-4">
          <button className="w-full flex items-center justify-center gap-1.5 py-2 bg-gray-900 text-white rounded-full text-xs font-medium">
            <MessageCircle size={12} />
            Evaluez votre experience
          </button>
        </div>
      </div>
    </div>
  );
}
