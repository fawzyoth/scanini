"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Search } from "lucide-react";
import { Menu, Dish } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { AllergenIcons } from "./allergen-icons";

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
  menus: Menu[];
  onDishClick: (dish: Dish) => void;
}

export function SearchOverlay({ open, onClose, menus, onDishClick }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  if (!open) return null;

  const allDishes = menus.flatMap((m) =>
    m.categories.flatMap((c) =>
      c.dishes.filter((d) => d.available)
    )
  );

  const filtered = query.trim()
    ? allDishes.filter(
        (d) =>
          d.name.toLowerCase().includes(query.toLowerCase()) ||
          d.description?.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="absolute inset-0 z-20 bg-white flex flex-col">
      {/* Search header */}
      <div className="shrink-0 flex items-center gap-3 px-4 py-3 border-b border-gray-100">
        <button onClick={onClose} className="p-1 -ml-1 text-gray-700 hover:text-gray-900">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un plat..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {query.trim() && filtered.length === 0 && (
          <p className="text-sm text-gray-400 text-center mt-8">Aucun resultat</p>
        )}

        {!query.trim() && (
          <p className="text-sm text-gray-400 text-center mt-8">Tapez pour rechercher</p>
        )}

        {filtered.length > 0 && (
          <div className="space-y-2">
            {filtered.map((dish) => (
              <button
                key={dish.id}
                onClick={() => {
                  onDishClick(dish);
                  onClose();
                }}
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
                  <div className="mt-1">
                    {dish.variants && dish.variants.length > 0 ? (
                      <span className="text-sm font-semibold text-gray-900">
                        {formatCurrency(dish.variants[0].price, dish.currency)}
                      </span>
                    ) : (
                      <span className="text-sm font-semibold text-gray-900">
                        {formatCurrency(dish.price, dish.currency)}
                      </span>
                    )}
                  </div>
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
        )}
      </div>
    </div>
  );
}
