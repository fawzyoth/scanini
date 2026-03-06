import { createClient } from "./client";
import type {
  Profile,
  Restaurant,
  DbMenu,
  DbCategory,
  DbDish,
  QrSettings,
  DbReview,
  RestaurantUsage,
} from "@/types/database";

// ── Auth helpers ──────────────────────────────────────────────

export async function getUser(supabase: ReturnType<typeof createClient>) {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getProfile(supabase: ReturnType<typeof createClient>) {
  const user = await getUser(supabase);
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return data as Profile | null;
}

// ── Restaurant ────────────────────────────────────────────────

export async function getMyRestaurant(supabase: ReturnType<typeof createClient>) {
  const user = await getUser(supabase);
  if (!user) return null;

  const { data } = await supabase
    .from("restaurants")
    .select("*")
    .eq("owner_id", user.id)
    .single();

  return data as Restaurant | null;
}

export async function getRestaurantUsage(
  supabase: ReturnType<typeof createClient>,
  restaurantId: string
) {
  const { data } = await supabase
    .from("restaurant_usage")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .single();

  return data as RestaurantUsage | null;
}

// ── Menus ─────────────────────────────────────────────────────

export async function getMenus(
  supabase: ReturnType<typeof createClient>,
  restaurantId: string
) {
  const { data } = await supabase
    .from("menus")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .order("sort_order");

  return (data ?? []) as DbMenu[];
}

export type MenuWithCategories = DbMenu & {
  categories: (DbCategory & { dishes: DbDish[] })[];
};

export async function getMenuWithDishes(
  supabase: ReturnType<typeof createClient>,
  menuId: string
): Promise<MenuWithCategories | null> {
  const { data: menu } = await supabase
    .from("menus")
    .select("*")
    .eq("id", menuId)
    .single();

  if (!menu) return null;

  const { data: categories } = await supabase
    .from("categories")
    .select("*, dishes(*)")
    .eq("menu_id", menuId)
    .order("sort_order");

  const m = menu as DbMenu;
  return {
    ...m,
    categories: (categories ?? []) as (DbCategory & { dishes: DbDish[] })[],
  };
}

// ── Scans ─────────────────────────────────────────────────────

export async function recordScan(
  supabase: ReturnType<typeof createClient>,
  restaurantId: string
) {
  const hour = new Date().getHours();
  const period: "morning" | "afternoon" = hour < 12 ? "morning" : "afternoon";

  await (supabase.from("scans") as any).insert({
    restaurant_id: restaurantId,
    period,
  });
}

export async function getScansForPeriod(
  supabase: ReturnType<typeof createClient>,
  restaurantId: string,
  days: number
) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data } = await supabase
    .from("scans")
    .select("scanned_at, period")
    .eq("restaurant_id", restaurantId)
    .gte("scanned_at", since.toISOString())
    .order("scanned_at");

  return (data ?? []) as { scanned_at: string; period: string }[];
}

// ── Reviews ───────────────────────────────────────────────────

export async function getReviews(
  supabase: ReturnType<typeof createClient>,
  restaurantId: string
) {
  const { data } = await supabase
    .from("reviews")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .order("created_at", { ascending: false });

  return (data ?? []) as DbReview[];
}

// ── QR Settings ───────────────────────────────────────────────

export async function getQrSettings(
  supabase: ReturnType<typeof createClient>,
  restaurantId: string
) {
  const { data } = await supabase
    .from("qr_settings")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .single();

  return data as QrSettings | null;
}

// ── Admin ─────────────────────────────────────────────────────

export type RestaurantWithUsage = Restaurant & {
  profile: Profile | null;
  usage: RestaurantUsage;
};

export async function getAllRestaurantsWithUsage(
  supabase: ReturnType<typeof createClient>
): Promise<RestaurantWithUsage[]> {
  const { data: restaurants } = await supabase
    .from("restaurants")
    .select("*")
    .order("created_at", { ascending: false });

  if (!restaurants) return [];

  const { data: profiles } = await supabase.from("profiles").select("*");
  const profileMap = new Map(
    ((profiles ?? []) as Profile[]).map((p) => [p.id, p])
  );

  const { data: usageRows } = await supabase
    .from("restaurant_usage")
    .select("*");
  const usage = (usageRows ?? []) as RestaurantUsage[];
  const usageMap = new Map(usage.map((u) => [u.restaurant_id, u]));

  return (restaurants as Restaurant[]).map((r) => ({
    ...r,
    profile: profileMap.get(r.owner_id) ?? null,
    usage: usageMap.get(r.id) ?? {
      restaurant_id: r.id,
      owner_id: r.owner_id,
      plan: r.plan,
      status: r.status,
      menu_count: 0,
      dish_count: 0,
      scans_this_month: 0,
    },
  }));
}
