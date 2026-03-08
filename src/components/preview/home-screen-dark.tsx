"use client";

import { useRef, useState } from "react";
import { Restaurant, Menu, Review } from "@/types";
import { Instagram, Phone, Wifi, ChevronRight } from "lucide-react";

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
  const sliderRef = useRef<HTMLDivElement>(null);
  const [sliderX, setSliderX] = useState(0);
  const [dragging, setDragging] = useState(false);

  function triggerMenu() {
    const visibleMenus = menus.filter((m) => m.visible !== false);
    if (onSwipeToMenu) {
      onSwipeToMenu();
    } else if (visibleMenus[0]) {
      onMenuClick(visibleMenus[0]);
    }
  }

  function handleSliderStart(clientX: number) {
    setDragging(true);
  }

  function handleSliderMove(clientX: number) {
    if (!dragging || !sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const maxX = rect.width - 48; // handle width
    const x = Math.max(0, Math.min(clientX - rect.left - 24, maxX));
    setSliderX(x);
  }

  function handleSliderEnd() {
    if (!sliderRef.current) { setDragging(false); setSliderX(0); return; }
    const rect = sliderRef.current.getBoundingClientRect();
    const maxX = rect.width - 48;
    if (sliderX > maxX * 0.65) {
      triggerMenu();
    }
    setDragging(false);
    setSliderX(0);
  }

  const darkBg = "#1a1a1a";
  const textureStyle = {
    backgroundColor: darkBg,
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23333333' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
  };

  return (
    <>
      <style>{`
        @keyframes sliderShimmer {
          0%, 100% { box-shadow: 0 0 0 0 rgba(212,168,83,0.3); }
          50% { box-shadow: 0 0 16px 4px rgba(212,168,83,0.5); }
        }
        @keyframes sliderArrowBounce {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(4px); }
        }
      `}</style>
      <div
        className="flex-1 overflow-y-auto flex flex-col"
        style={textureStyle}
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

        {/* Swipe-to-unlock slider */}
        <div className="px-6 pb-5">
          <div
            ref={sliderRef}
            className="relative h-14 rounded-full overflow-hidden select-none"
            style={{ backgroundColor: "rgba(212,168,83,0.2)", border: "1px solid rgba(212,168,83,0.3)" }}
            onTouchStart={(e) => {
              const touch = e.touches[0];
              if (!sliderRef.current) return;
              const rect = sliderRef.current.getBoundingClientRect();
              const handleEnd = sliderX + 48;
              if (touch.clientX - rect.left <= handleEnd + 10) {
                handleSliderStart(touch.clientX);
              }
            }}
            onTouchMove={(e) => handleSliderMove(e.touches[0].clientX)}
            onTouchEnd={handleSliderEnd}
            onMouseDown={(e) => {
              if (!sliderRef.current) return;
              const rect = sliderRef.current.getBoundingClientRect();
              const handleEnd = sliderX + 48;
              if (e.clientX - rect.left <= handleEnd + 10) {
                handleSliderStart(e.clientX);
              }
            }}
            onMouseMove={(e) => { if (dragging) handleSliderMove(e.clientX); }}
            onMouseUp={handleSliderEnd}
            onMouseLeave={() => { if (dragging) handleSliderEnd(); }}
          >
            {/* Track text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span
                className="text-sm font-semibold tracking-wide"
                style={{ color: "rgba(212,168,83,0.6)", opacity: sliderX > 40 ? 0 : 1, transition: "opacity 0.2s" }}
              >
                Slide to see menu
              </span>
            </div>
            {/* Draggable handle */}
            <div
              className="absolute top-1 left-1 w-12 h-12 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: "#D4A853",
                transform: `translateX(${sliderX}px)`,
                transition: dragging ? "none" : "transform 0.4s cubic-bezier(0.32, 1.2, 0.5, 1)",
                animation: !dragging && sliderX === 0 ? "sliderShimmer 2.5s ease-in-out infinite" : "none",
                cursor: "grab",
              }}
            >
              <div style={{ animation: !dragging && sliderX === 0 ? "sliderArrowBounce 1.5s ease-in-out infinite" : "none" }}>
                <ChevronRight size={20} color="#1a1a1a" />
              </div>
            </div>
          </div>
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
              <Wifi size={18} />
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
