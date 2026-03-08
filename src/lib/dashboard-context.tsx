"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Profile, Restaurant } from "@/types/database";
import type { Menu, Category, Dish, Review, QRSettings } from "@/types";

interface DashboardData {
  loading: boolean;
  profile: Profile | null;
  restaurant: Restaurant | null;
  menus: Menu[];
  reviews: Review[];
  qrSettings: QRSettings | null;
  usage: { menus: number; dishes: number; scansThisMonth: number };
  reload: () => Promise<void>;
  updateRestaurant: (updates: Partial<Restaurant>) => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
}

const DashboardContext = createContext<DashboardData | null>(null);

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used within DashboardProvider");
  return ctx;
}

// Convert DB menu rows + categories + dishes into the frontend Menu type
function toFrontendMenu(
  dbMenu: any,
  categories: any[],
  dishes: any[]
): Menu {
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
    dishCount: menuCats.reduce((sum: number, c: Category) => sum + c.dishes.length, 0),
    availability: dbMenu.availability ?? "Every day",
    visible: dbMenu.visible ?? true,
    categories: menuCats,
  };
}

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [qrSettings, setQrSettings] = useState<QRSettings | null>(null);
  const [usage, setUsage] = useState({ menus: 0, dishes: 0, scansThisMonth: 0 });

  const reload = useCallback(async () => {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    // Profile
    const { data: prof } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    if (prof) setProfile(prof as Profile);

    // Restaurant
    const { data: rest } = await supabase
      .from("restaurants")
      .select("*")
      .eq("owner_id", user.id)
      .single();

    if (!rest || (rest as any).status === "pending") {
      setLoading(false);
      router.replace("/pending");
      return;
    }
    if ((rest as any).status === "suspended") {
      setLoading(false);
      router.replace("/suspended");
      return;
    }
    const r = rest as Restaurant;
    setRestaurant(r);

    // Menus + Categories + Dishes
    const { data: dbMenus } = await supabase
      .from("menus")
      .select("*")
      .eq("restaurant_id", r.id)
      .order("sort_order");

    const { data: dbCategories } = await supabase
      .from("categories")
      .select("*")
      .in(
        "menu_id",
        (dbMenus ?? []).map((m: any) => m.id)
      )
      .order("sort_order");

    const { data: dbDishes } = await supabase
      .from("dishes")
      .select("*")
      .in(
        "category_id",
        (dbCategories ?? []).map((c: any) => c.id)
      )
      .order("sort_order");

    const frontendMenus = (dbMenus ?? []).map((m: any) =>
      toFrontendMenu(m, dbCategories ?? [], dbDishes ?? [])
    );
    setMenus(frontendMenus);

    // Usage
    const { data: usageRow } = await supabase
      .from("restaurant_usage")
      .select("*")
      .eq("restaurant_id", r.id)
      .single();

    if (usageRow) {
      setUsage({
        menus: (usageRow as any).menu_count ?? 0,
        dishes: (usageRow as any).dish_count ?? 0,
        scansThisMonth: (usageRow as any).scans_this_month ?? 0,
      });
    }

    // Reviews
    const { data: dbReviews } = await supabase
      .from("reviews")
      .select("*")
      .eq("restaurant_id", r.id)
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

    // QR Settings
    const { data: qr } = await supabase
      .from("qr_settings")
      .select("*")
      .eq("restaurant_id", r.id)
      .single();

    if (qr) {
      const q = qr as any;
      setQrSettings({
        frameType: q.frame_type ?? "bottom",
        backgroundColor: q.background_color ?? "#000000",
        text: q.text ?? "MENU",
        textColor: q.text_color ?? "#FFFFFF",
        font: q.font ?? "Roboto",
        fontSize: q.font_size ?? 24,
        dotStyle: q.dot_style ?? "square",
        dotColor: q.dot_color ?? "#000000",
        cornerStyle: q.corner_style ?? "square",
        cornerColor: q.corner_color ?? "#000000",
        logo: q.logo_url ?? undefined,
      });
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const updateRestaurant = useCallback(async (updates: Partial<Restaurant>) => {
    if (!restaurant) return;
    const supabase = createClient();
    const { error } = await (supabase.from("restaurants") as any)
      .update(updates)
      .eq("id", restaurant.id);
    if (error) {
      console.error("Failed to update restaurant:", error);
      return;
    }
    setRestaurant((prev) => prev ? { ...prev, ...updates } : prev);
    await reload();
  }, [restaurant, reload]);

  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    if (!profile) return;
    const supabase = createClient();
    await (supabase.from("profiles") as any)
      .update(updates)
      .eq("id", profile.id);
    setProfile((prev) => prev ? { ...prev, ...updates } : prev);
  }, [profile]);

  // While loading, show a centered spinner — never flash dashboard content
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900" />
      </div>
    );
  }

  return (
    <DashboardContext.Provider
      value={{
        loading,
        profile,
        restaurant,
        menus,
        reviews,
        qrSettings,
        usage,
        reload,
        updateRestaurant,
        updateProfile,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}
