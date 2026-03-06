import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  const supabase = getServiceClient();

  // Find restaurant by slug — if multiple match, pick the one with menus
  const { data: restaurants } = await supabase
    .from("restaurants")
    .select("*");

  const matches = (restaurants ?? []).filter((r: any) => {
    const rSlug = r.name?.toLowerCase().replace(/\s+/g, "-");
    return rSlug === slug;
  });

  if (matches.length === 0) {
    return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
  }

  // For each match, check which has menus
  let dbRestaurant = matches[0];
  let dbMenus: any[] = [];

  for (const candidate of matches) {
    const { data: menus } = await supabase
      .from("menus")
      .select("*")
      .eq("restaurant_id", candidate.id)
      .order("sort_order");

    const filtered = (menus ?? []).filter((m: any) => m.visible !== false);
    if (filtered.length > 0) {
      dbRestaurant = candidate;
      dbMenus = filtered;
      break;
    }
  }

  // If no match had menus, use first match and empty menus
  if (dbMenus.length === 0 && matches.length === 1) {
    dbRestaurant = matches[0];
  }

  const menuIds = (dbMenus ?? []).map((m: any) => m.id);

  const { data: dbCategories } = menuIds.length > 0
    ? await supabase.from("categories").select("*").in("menu_id", menuIds).order("sort_order")
    : { data: [] };

  const catIds = (dbCategories ?? []).map((c: any) => c.id);

  const { data: dbDishes } = catIds.length > 0
    ? await supabase.from("dishes").select("*").in("category_id", catIds).order("sort_order")
    : { data: [] };

  // Fetch reviews
  const { data: dbReviews } = await supabase
    .from("reviews")
    .select("*")
    .eq("restaurant_id", dbRestaurant.id)
    .order("created_at", { ascending: false });

  return NextResponse.json({
    restaurant: dbRestaurant,
    menus: dbMenus ?? [],
    categories: dbCategories ?? [],
    dishes: dbDishes ?? [],
    reviews: dbReviews ?? [],
  });
}
