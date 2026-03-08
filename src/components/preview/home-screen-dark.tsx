"use client";

import { useRef, useState } from "react";
import { Restaurant, Menu, Review } from "@/types";
import { Instagram, Phone, User, ChevronRight } from "lucide-react";

interface HomeScreenDarkProps {
  restaurant: Restaurant;
  menus: Menu[];
  reviews: Review[];
  onMenuClick: (menu: Menu) => void;
  onReviewClick?: () => void;
  onInfoClick: () => void;
  onSearchClick?: () => void;
  onSwipeToMenu?: () => void;
}

export function HomeScreenDark({
  restaurant,
  menus,
  reviews,
  onMenuClick,
  onReviewClick,
  onInfoClick,
  onSearchClick,
  onSwipeToMenu,
}: HomeScreenDarkProps) {
  const touchStartX = useRef(0);
  const [swiping, setSwiping] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0);

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
    setSwiping(true);
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (!swiping) return;
    const diff = touchStartX.current - e.touches[0].clientX;
    if (diff > 0) {
      setSwipeOffset(Math.min(diff, 120));
    }
  }

  function handleTouchEnd() {
    if (swipeOffset > 60) {
      const visibleMenus = menus.filter((m) => m.visible !== false);
      if (onSwipeToMenu) {
        onSwipeToMenu();
      } else if (visibleMenus[0]) {
        onMenuClick(visibleMenus[0]);
      }
    }
    setSwiping(false);
    setSwipeOffset(0);
  }

  const darkBg = "#1a1a1a";
  const textureStyle = {
    backgroundColor: darkBg,
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23333333' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
  };

  return (
    <>
      <div
        className="flex-1 overflow-y-auto flex flex-col"
        style={{
          ...textureStyle,
          transform: `translateX(-${swipeOffset}px)`,
          transition: swiping ? "none" : "transform 0.3s ease-out",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Cover image with rounded corners */}
        <div className="px-3 pt-3">
          <div className="relative h-52 rounded-2xl overflow-hidden bg-gray-800">
            {restaurant.coverImage && (
              <img
                src={restaurant.coverImage}
                alt={restaurant.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
          </div>
        </div>

        {/* Restaurant name + subtitle */}
        <div className="px-4 pt-8 pb-3 text-center flex-1 flex flex-col justify-center">
          <p className="text-xs text-gray-400 uppercase tracking-[0.2em] mb-2">
            welcome to
          </p>
          <h2 className="text-2xl font-bold text-white uppercase tracking-wide">
            {restaurant.name}
          </h2>
          {restaurant.address && (
            <p className="text-sm text-gray-400 mt-2">{restaurant.address}</p>
          )}
        </div>

        {/* Swipe CTA button */}
        <div className="px-6 pb-5">
          <button
            onClick={() => {
              const visibleMenus = menus.filter((m) => m.visible !== false);
              if (onSwipeToMenu) {
                onSwipeToMenu();
              } else if (visibleMenus[0]) {
                onMenuClick(visibleMenus[0]);
              }
            }}
            className="w-full flex items-center justify-center gap-3 py-3.5 rounded-full text-sm font-semibold transition-all group"
            style={{ backgroundColor: "#D4A853", color: "#1a1a1a" }}
          >
            <span
              className="w-7 h-7 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-1"
              style={{ backgroundColor: "rgba(0,0,0,0.15)" }}
            >
              <ChevronRight size={16} />
            </span>
            Slide to see menu
          </button>
        </div>

        {/* Contact us section */}
        <div className="px-4 pb-5 text-center">
          <p className="text-xs text-gray-500 uppercase tracking-[0.2em] mb-3">
            Contact us
          </p>
          <div className="flex items-center justify-center gap-4">
            {restaurant.socialMedia?.instagram && (
              <a
                href={`https://instagram.com/${restaurant.socialMedia.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full flex items-center justify-center transition-colors"
                style={{ backgroundColor: "rgba(239,68,68,0.15)", color: "#ef4444" }}
              >
                <Instagram size={18} />
              </a>
            )}
            <button
              onClick={onInfoClick}
              className="w-11 h-11 rounded-full flex items-center justify-center transition-colors"
              style={{ backgroundColor: "rgba(239,68,68,0.15)", color: "#ef4444" }}
            >
              <User size={18} />
            </button>
            {restaurant.phone && (
              <a
                href={`tel:${restaurant.phone}`}
                className="w-11 h-11 rounded-full flex items-center justify-center transition-colors"
                style={{ backgroundColor: "rgba(239,68,68,0.15)", color: "#ef4444" }}
              >
                <Phone size={18} />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="shrink-0 px-4 pb-3 pt-2 border-t space-y-2"
        style={{ backgroundColor: darkBg, borderColor: "#333" }}
      >
        {onReviewClick && (
          <button
            onClick={onReviewClick}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-medium"
            style={{ backgroundColor: "#D4A853", color: "#1a1a1a" }}
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
          className="w-full flex items-center justify-center gap-2 py-2 text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          <span>Obtenez votre Menu Digital</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/></svg>
        </a>
      </div>
    </>
  );
}
