"use client";

import { useState, useEffect } from "react";
import { Loader2, Smartphone } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { PhoneShell, HomeScreen, MenuScreen, HomeScreenCard, MenuScreenCard, HomeScreenProfile, MenuScreenProfile, DishDetailSheet, ReviewSheet, InfoSheet, SearchOverlay } from "@/components/preview";
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
    logoImage: db.logo_image ?? undefined,
    phone: db.phone ?? "",
    address: db.address ?? "",
    template: db.template ?? "classic",
    currency: db.currency ?? "EUR",
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
  const [searchOpen, setSearchOpen] = useState(false);

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

  const menuUrl = typeof window !== "undefined"
    ? `${window.location.origin}/menu/${restaurant.id}`
    : `/menu/${restaurant.id}`;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10 px-4">
      <div className="flex items-center gap-12">
        {/* Phone mockup */}
        <PhoneShell>
          {screen.type === "home" && (
            restaurant.template === "card" ? (
              <HomeScreenCard
                restaurant={restaurant}
                menus={menus}
                reviews={reviews}
                onMenuClick={(menu) => setScreen({ type: "menu", menu })}
                onDishClick={(dish) => setSelectedDish(dish)}
                onReviewClick={() => setReviewOpen(true)}
                onInfoClick={() => setInfoOpen(true)}
                onSearchClick={() => setSearchOpen(true)}
              />
            ) : restaurant.template === "profile" ? (
              <HomeScreenProfile
                restaurant={restaurant}
                menus={menus}
                reviews={reviews}
                onMenuClick={(menu) => setScreen({ type: "menu", menu })}
                onReviewClick={() => setReviewOpen(true)}
                onInfoClick={() => setInfoOpen(true)}
                onSearchClick={() => setSearchOpen(true)}
              />
            ) : (
              <HomeScreen
                restaurant={restaurant}
                menus={menus}
                reviews={reviews}
                onMenuClick={(menu) => setScreen({ type: "menu", menu })}
                onReviewClick={() => setReviewOpen(true)}
                onInfoClick={() => setInfoOpen(true)}
                onSearchClick={() => setSearchOpen(true)}
              />
            )
          )}

          {screen.type === "menu" && (
            restaurant.template === "card" ? (
              <MenuScreenCard
                menu={screen.menu}
                onBack={() => setScreen({ type: "home" })}
                onDishClick={(dish) => setSelectedDish(dish)}
                onReviewClick={() => setReviewOpen(true)}
                onSearchClick={() => setSearchOpen(true)}
              />
            ) : restaurant.template === "profile" ? (
              <MenuScreenProfile
                menu={screen.menu}
                onBack={() => setScreen({ type: "home" })}
                onDishClick={(dish) => setSelectedDish(dish)}
                onReviewClick={() => setReviewOpen(true)}
                onSearchClick={() => setSearchOpen(true)}
              />
            ) : (
              <MenuScreen
                menu={screen.menu}
                onBack={() => setScreen({ type: "home" })}
                onDishClick={(dish) => setSelectedDish(dish)}
                onReviewClick={() => setReviewOpen(true)}
                onSearchClick={() => setSearchOpen(true)}
              />
            )
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

          <SearchOverlay
            open={searchOpen}
            onClose={() => setSearchOpen(false)}
            menus={menus}
            onDishClick={(dish) => setSelectedDish(dish)}
          />
        </PhoneShell>

        {/* QR Code panel */}
        <div className="hidden lg:flex flex-col items-center gap-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 text-gray-700">
              <Smartphone size={18} />
              <span className="text-sm font-semibold">Try it on your phone</span>
            </div>
            <QRCodeSVG
              value={menuUrl}
              size={180}
              bgColor="#FFFFFF"
              fgColor="#000000"
              level="M"
              style={{ borderRadius: 8 }}
            />
            <p className="text-xs text-gray-400 text-center max-w-[200px]">
              Scan this QR code to see your menu exactly as your customers will
            </p>
          </div>
          <a
            href={menuUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Open in browser &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
