"use client";

import { Eye, Star, MessageSquare, UtensilsCrossed } from "lucide-react";

interface KpiCardsProps {
  totalScans: number;
  totalReviews: number;
  avgRating: number;
  totalMenus: number;
  totalDishes: number;
}

export function KpiCards({ totalScans, totalReviews, avgRating, totalMenus, totalDishes }: KpiCardsProps) {
  const cards = [
    {
      label: "Total scans",
      value: totalScans.toLocaleString(),
      icon: Eye,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Reviews",
      value: totalReviews.toLocaleString(),
      icon: MessageSquare,
      color: "text-purple-600 bg-purple-50",
    },
    {
      label: "Avg. rating",
      value: avgRating > 0 ? avgRating.toFixed(1) : "—",
      icon: Star,
      color: "text-yellow-600 bg-yellow-50",
    },
    {
      label: "Menus / Dishes",
      value: `${totalMenus} / ${totalDishes}`,
      icon: UtensilsCrossed,
      color: "text-green-600 bg-green-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${card.color}`}>
              <card.icon size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{card.value}</p>
          <p className="text-sm text-gray-500 mt-0.5">{card.label}</p>
        </div>
      ))}
    </div>
  );
}
