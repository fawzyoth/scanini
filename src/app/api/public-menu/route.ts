import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing restaurant id" }, { status: 400 });
  }

  const supabase = getServiceClient();

  // Fetch restaurant by ID
  const { data: dbRestaurant } = await supabase
    .from("restaurants")
    .select("*")
    .eq("id", id)
    .single();

  if (!dbRestaurant) {
    return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
  }

  // Fetch all menus
  const { data: allMenus } = await supabase
    .from("menus")
    .select("*")
    .eq("restaurant_id", dbRestaurant.id)
    .order("sort_order");

  const dbMenus = (allMenus ?? []).filter((m: any) => m.visible !== false);
  const menuIds = dbMenus.map((m: any) => m.id);

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
    menus: dbMenus,
    categories: dbCategories ?? [],
    dishes: dbDishes ?? [],
    reviews: dbReviews ?? [],
  });
}
