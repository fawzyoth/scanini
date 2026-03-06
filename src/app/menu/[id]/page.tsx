"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { HomeScreen, MenuScreen, DishDetailSheet, ReviewSheet, InfoSheet } from "@/components/preview";
import type { Restaurant, Menu, Category, Dish, Review } from "@/types";

type Screen = { type: "home" } | { type: "menu"; menu: Menu };

function toRestaurant(db: any): Restaurant {
  return {
    id: db.id,
    name: db.name,
    coverImage: db.cover_image ?? "",
    phone: db.phone ?? "",
    address: db.address ?? "",
    wifi: db.wifi_ssid ? { ssid: db.wifi_ssid, password: db.wifi_password ?? "" } : undefined,
    socialMedia: {
      instagram: db.social_instagram ?? undefined,
      facebook: db.social_facebook ?? undefined,
      tiktok: db.social_tiktok ?? undefined,
    },
  };
}

function buildMenus(dbMenus: any[], dbCategories: any[], dbDishes: any[]): Menu[] {
  return dbMenus.map((m: any): Menu => {
    const menuCats = dbCategories
      .filter((c: any) => c.menu_id === m.id)
      .sort((a: any, b: any) => a.sort_order - b.sort_order)
      .map((c: any): Category => ({
        id: c.id,
        name: c.name,
        dishes: dbDishes
          .filter((d: any) => d.category_id === c.id)
          .sort((a: any, b: any) => a.sort_order - b.sort_order)
          .map((d: any): Dish => ({
            id: d.id,
            name: d.name,
            description: d.description ?? "",
            price: Number(d.price),
            currency: d.currency ?? "DT",
            image: d.image_url ?? undefined,
            allergens: d.allergens ?? [],
            available: d.available ?? true,
            variants: d.variants ?? undefined,
          })),
      }));

    return {
      id: m.id,
      name: m.name,
      icon: m.icon ?? "utensils-crossed",
      dishCount: menuCats.reduce((sum, c) => sum + c.dishes.length, 0),
      availability: m.availability ?? "Every day",
      visible: m.visible ?? true,
      categories: menuCats,
    };
  });
}

export default function PublicMenuPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  const [screen, setScreen] = useState<Screen>({ type: "home" });
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/public-menu?id=${encodeURIComponent(id as string)}`);
        if (!res.ok) {
          setLoading(false);
          return;
        }

        const data = await res.json();

        setRestaurant(toRestaurant(data.restaurant));
        setMenus(buildMenus(data.menus, data.categories, data.dishes));
        setReviews(
          (data.reviews ?? []).map((rev: any): Review => ({
            id: rev.id,
            rating: rev.rating,
            meal: rev.meal,
            service: rev.service,
            atmosphere: rev.atmosphere,
            cleanliness: rev.cleanliness,
            comment: rev.comment ?? undefined,
            date: rev.created_at,
          }))
        );
      } catch {
        // fetch failed
      }
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-gray-400" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500">Restaurant not found.</p>
      </div>
    );
  }

  return (
    <div className="h-dvh bg-white flex flex-col relative max-w-lg mx-auto overflow-hidden">
      {screen.type === "home" && (
        <HomeScreen
          restaurant={restaurant}
          menus={menus}
          reviews={reviews}
          onMenuClick={(menu) => setScreen({ type: "menu", menu })}
          onReviewClick={() => setReviewOpen(true)}
          onInfoClick={() => setInfoOpen(true)}
        />
      )}

      {screen.type === "menu" && (
        <MenuScreen
          menu={screen.menu}
          onBack={() => setScreen({ type: "home" })}
          onDishClick={(dish) => setSelectedDish(dish)}
          onReviewClick={() => setReviewOpen(true)}
        />
      )}

      <DishDetailSheet
        dish={selectedDish}
        onClose={() => setSelectedDish(null)}
      />

      <ReviewSheet
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        restaurantId={restaurant.id}
      />

      <InfoSheet
        open={infoOpen}
        onClose={() => setInfoOpen(false)}
        restaurant={restaurant}
      />
    </div>
  );
}
