"use client";

import { MenuHeader, PublicCategorySection, RateButton } from "@/components/public-menu";
import { mockRestaurant, mockMenus, mockReviews } from "@/data/mock";

export default function PublicMenuPage() {
  const restaurant = mockRestaurant;
  const menu = mockMenus[0];
  const reviews = mockReviews;

  return (
    <div className="min-h-screen bg-white pb-24">
      <MenuHeader restaurant={restaurant} reviews={reviews} />

      <div className="max-w-2xl mx-auto px-4 mt-6">
        {menu.categories.map((category) => (
          <PublicCategorySection key={category.id} category={category} />
        ))}
      </div>

      <RateButton />
    </div>
  );
}
