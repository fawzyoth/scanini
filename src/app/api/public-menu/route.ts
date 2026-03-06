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

  // Find restaurant by slug
  const { data: restaurants } = await supabase
    .from("restaurants")
    .select("*");

  const dbRestaurant = (restaurants ?? []).find((r: any) => {
    const rSlug = r.name?.toLowerCase().replace(/\s+/g, "-");
    return rSlug === slug;
  });

  if (!dbRestaurant) {
    return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
  }

  // Fetch all menus for this restaurant
  const { data: allMenus } = await supabase
    .from("menus")
    .select("*")
    .eq("restaurant_id", dbRestaurant.id)
    .order("sort_order");

  // Filter out explicitly hidden menus (visible=false), keep null and true
  const dbMenus = (allMenus ?? []).filter((m: any) => m.visible !== false);

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
