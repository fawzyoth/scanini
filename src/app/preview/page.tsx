"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { PhoneShell, HomeScreen, MenuScreen, DishDetailSheet, ReviewSheet, InfoSheet } from "@/components/preview";
import { createClient } from "@/lib/supabase/client";
import type { Menu, Category, Dish, Restaurant, Review } from "@/types";

type Screen = { type: "home" } | { type: "menu"; menu: Menu };

function toFrontendMenu(dbMenu: any, categories: any[], dishes: any[]): Menu {
  const menuCats = categories
    .filter((c: any) => c.menu_id === dbMenu.id)
    .sort((a: any, b: any) => a.sort_order - b.sort_order)
    .map((c: any): Category => ({
      id: c.id,
      name: c.name,
      dishes: dishes
        .filter((d: any) => d.category_id === c.id)
        .sort((a: any, b: any) => a.sort_order - b.sort_order)
        .map((d: any): Dish => ({
          id: d.id,
          name: d.name,
          description: d.description ?? "",
          price: Number(d.price),
          currency: d.currency ?? "EUR",
          image: d.image_url ?? undefined,
          allergens: d.allergens ?? [],
          available: d.available ?? true,
          variants: d.variants ?? undefined,
        })),
    }));

  return {
    id: dbMenu.id,
    name: dbMenu.name,
    icon: dbMenu.icon ?? "utensils-crossed",
    dishCount: menuCats.reduce((sum, c) => sum + c.dishes.length, 0),
    availability: dbMenu.availability ?? "Every day",
    visible: dbMenu.visible ?? true,
    categories: menuCats,
  };
}

function toFrontendRestaurant(db: any): Restaurant {
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

export default function PreviewPage() {
  const [screen, setScreen] = useState<Screen>({ type: "home" });
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data: rest } = await supabase
        .from("restaurants")
        .select("*")
        .eq("owner_id", user.id)
        .single();

      if (!rest) { setLoading(false); return; }
      setRestaurant(toFrontendRestaurant(rest));

      const { data: dbMenus } = await supabase
        .from("menus")
        .select("*")
        .eq("restaurant_id", (rest as any).id)
        .order("sort_order");

      const menuIds = (dbMenus ?? []).map((m: any) => m.id);

      const { data: dbCategories } = menuIds.length > 0
        ? await supabase.from("categories").select("*").in("menu_id", menuIds).order("sort_order")
        : { data: [] };

      const catIds = (dbCategories ?? []).map((c: any) => c.id);

      const { data: dbDishes } = catIds.length > 0
        ? await supabase.from("dishes").select("*").in("category_id", catIds).order("sort_order")
        : { data: [] };

      setMenus((dbMenus ?? []).map((m: any) =>
        toFrontendMenu(m, dbCategories ?? [], dbDishes ?? [])
      ));

      const { data: dbReviews } = await supabase
        .from("reviews")
        .select("*")
        .eq("restaurant_id", (rest as any).id)
        .order("created_at", { ascending: false });

      setReviews(
        (dbReviews ?? []).map((rev: any): Review => ({
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

      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-gray-400" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">No restaurant found. Please sign in first.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10 px-4">
      <PhoneShell>
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
        />

        <InfoSheet
          open={infoOpen}
          onClose={() => setInfoOpen(false)}
          restaurant={restaurant}
        />
      </PhoneShell>
    </div>
  );
}
