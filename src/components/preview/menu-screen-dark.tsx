"use client";

import { useState, useMemo, useRef } from "react";
import { Menu, Dish } from "@/types";
import { ArrowLeft, Search } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { AllergenIcons } from "./allergen-icons";

interface MenuScreenDarkProps {
  menus: Menu[];
  restaurant?: { logoImage?: string; name?: string };
  animationsEnabled?: boolean;
  onBack: () => void;
  onDishClick: (dish: Dish) => void;
  onReviewClick?: () => void;
  onSearchClick?: () => void;
}

export function MenuScreenDark({
  menus,
  restaurant,
  animationsEnabled = true,
  onBack,
  onDishClick,
  onReviewClick,
  onSearchClick,
}: MenuScreenDarkProps) {
  const visibleMenus = useMemo(
    () => menus.filter((m) => m.visible !== false),
    [menus]
  );

  const [activeMenuId, setActiveMenuId] = useState<string>(
    visibleMenus[0]?.id ?? ""
  );
  const activeMenu = visibleMenus.find((m) => m.id === activeMenuId);

  // All available dishes from all categories in the active menu
  const activeDishes = useMemo(() => {
    if (!activeMenu) return [];
    return activeMenu.categories.flatMap((cat) =>
      cat.dishes.filter((d) => d.available)
    );
  }, [activeMenu]);

  const contentRef = useRef<HTMLDivElement>(null);
  const [animKey, setAnimKey] = useState(0);

  function selectMenu(id: string) {
    setActiveMenuId(id);
    setAnimKey((k) => k + 1);
    contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="flex flex-col h-full dark-menu-screen overflow-hidden">
      {/* Inline animation styles */}
      {animationsEnabled && (
        <style>{`
          @keyframes darkLiquidIn {
            0% { opacity: 0; transform: translateY(30px) scale(0.85); filter: blur(6px); }
            50% { opacity: 0.7; transform: translateY(-4px) scale(1.02); filter: blur(0px); }
            70% { transform: translateY(2px) scale(0.99); }
            100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0px); }
          }
          @keyframes darkPulseGlow {
            0%, 100% { box-shadow: 0 0 0 0 rgba(212,168,83,0); }
            50% { box-shadow: 0 0 12px 2px rgba(212,168,83,0.25); }
          }
          @keyframes darkContentFade {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .dark-dish-enter {
            animation: darkLiquidIn 0.6s cubic-bezier(0.22,1,0.36,1) both;
          }
          .dark-dish-enter:hover {
            animation: darkPulseGlow 2s ease-in-out infinite;
          }
          .dark-content-transition {
            animation: darkContentFade 0.35s ease-out both;
          }
          .dark-menu-screen ::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      )}

      {/* Main content: sidebar + dishes */}
      <div className="flex-1 flex overflow-hidden" style={{ backgroundColor: "#1a1a1a" }}>
        {/* Left sidebar — dark: back button + menu names */}
        <div
          className="shrink-0 w-[120px] flex flex-col"
          style={{ backgroundColor: "#1a1a1a" }}
        >
          {/* Back button in sidebar — extra bottom padding for first item's inverse corner */}
          <div className="px-3 pt-3 pb-5">
            <button
              onClick={onBack}
              className="flex items-center gap-1 text-xs px-2 py-1.5 rounded-full border"
              style={{ color: "#D4A853", borderColor: "rgba(212,168,83,0.3)" }}
            >
              <ArrowLeft size={12} />
              <span>Back</span>
            </button>
          </div>

          {/* Menu list — hidden scrollbar */}
          <div
            className="flex-1 overflow-y-auto py-1 flex flex-col"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
          {visibleMenus.map((menu) => {
            const isActive = menu.id === activeMenuId;
            return (
              <button
                key={menu.id}
                onClick={() => selectMenu(menu.id)}
                className="relative py-3 px-2 text-center transition-colors"
                style={{
                  backgroundColor: isActive ? "#fff" : "transparent",
                  borderTopLeftRadius: isActive ? 20 : 0,
                  borderBottomLeftRadius: isActive ? 20 : 0,
                  zIndex: isActive ? 1 : 0,
                }}
              >
                {/* Inverse rounded corners on the right side */}
                {isActive && (
                  <>
                    <div style={{ position: "absolute", top: -16, right: 0, width: 16, height: 16, background: "#fff", overflow: "hidden" }}>
                      <div style={{ width: "100%", height: "100%", background: "#1a1a1a", borderBottomRightRadius: 16 }} />
                    </div>
                    <div style={{ position: "absolute", bottom: -16, right: 0, width: 16, height: 16, background: "#fff", overflow: "hidden" }}>
                      <div style={{ width: "100%", height: "100%", background: "#1a1a1a", borderTopRightRadius: 16 }} />
                    </div>
                  </>
                )}
                <span
                  className="text-[11px] font-bold uppercase tracking-wider leading-tight"
                  style={{ color: isActive ? "#D4A853" : "#aaa" }}
                >
                  {menu.name}
                </span>
              </button>
            );
          })}
          </div>
        </div>

        {/* Right content area — full height white, hidden scrollbar */}
        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto bg-white relative"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/* Sticky header: logo + name + search */}
          <div className="sticky top-0 z-10 bg-white flex items-center px-3 pt-3 pb-2 gap-2">
            {restaurant?.logoImage && (
              <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 bg-white shrink-0">
                <img
                  src={restaurant.logoImage}
                  alt={restaurant.name ?? ""}
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            <h3 className="flex-1 text-sm font-bold text-gray-900 truncate">
              {restaurant?.name ?? ""}
            </h3>
            <button
              onClick={onSearchClick}
              className="p-1.5 text-gray-500 hover:text-gray-700 shrink-0"
            >
              <Search size={16} />
            </button>
          </div>

          {/* Dishes as circular image cards */}
          {activeDishes.length > 0 && (
            <div key={animKey} className={`px-4 py-3 space-y-5 ${animationsEnabled ? "dark-content-transition" : ""}`}>
              {activeDishes.map((dish, i) => (
                <button
                  key={dish.id}
                  onClick={() => onDishClick(dish)}
                  className={`w-full flex flex-col items-center text-center group ${
                    animationsEnabled ? "dark-dish-enter" : ""
                  }`}
                  style={
                    animationsEnabled
                      ? { animationDelay: `${i * 120}ms` }
                      : undefined
                  }
                >
                  {dish.image ? (
                    <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm group-hover:shadow-md transition-shadow bg-gray-100">
                      <img
                        src={dish.image}
                        alt={dish.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-28 h-28 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
                      <span className="text-2xl text-gray-300">
                        {dish.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <h4 className="text-sm font-bold text-gray-900 mt-2">
                    {dish.name}
                  </h4>
                  {dish.variants && dish.variants.length > 0 ? (
                    <span
                      className="text-sm font-semibold mt-0.5"
                      style={{ color: "#D4A853" }}
                    >
                      {formatCurrency(dish.variants[0].price, dish.currency)}
                    </span>
                  ) : (
                    <span
                      className="text-sm font-semibold mt-0.5"
                      style={{ color: "#D4A853" }}
                    >
                      {formatCurrency(dish.price, dish.currency)}
                    </span>
                  )}
                  <AllergenIcons allergens={dish.allergens} />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating review button */}
      {onReviewClick && (
        <button
          onClick={onReviewClick}
          className="absolute bottom-12 right-4 w-11 h-11 rounded-full shadow-lg flex items-center justify-center hover:opacity-90 transition-opacity"
          style={{ backgroundColor: "#D4A853", color: "#1a1a1a" }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
          </svg>
        </button>
      )}

      {/* Bottom CTA */}
      <a
        href={`https://wa.me/32465987804?text=${encodeURIComponent("Bonjour, je souhaite créer mon menu digital avec Scanini!")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 flex items-center justify-center gap-1.5 py-2 text-xs text-gray-400 hover:text-gray-600 transition-colors bg-white border-t border-gray-100"
      >
        <span>Obtenez votre Menu Digital</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/></svg>
      </a>
    </div>
  );
}
