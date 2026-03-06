import { createServerSupabase } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabase();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { menuId } = await request.json();
  if (!menuId) {
    return NextResponse.json({ error: "Missing menuId" }, { status: 400 });
  }

  // Fetch original menu
  const { data: origMenu, error: menuErr } = await (supabase.from("menus") as any)
    .select("*")
    .eq("id", menuId)
    .single();

  if (menuErr || !origMenu) {
    return NextResponse.json({ error: "Menu not found" }, { status: 404 });
  }

  // Count existing menus for sort_order
  const { count } = await (supabase.from("menus") as any)
    .select("id", { count: "exact", head: true })
    .eq("restaurant_id", origMenu.restaurant_id);

  // 1. Create new menu
  const { data: newMenu, error: insertErr } = await (supabase.from("menus") as any)
    .insert({
      restaurant_id: origMenu.restaurant_id,
      name: `${origMenu.name} (copy)`,
      icon: origMenu.icon,
      availability: origMenu.availability,
      visible: origMenu.visible,
      sort_order: count ?? 0,
    })
    .select()
    .single();

  if (insertErr || !newMenu) {
    return NextResponse.json({ error: insertErr?.message ?? "Failed to create menu" }, { status: 500 });
  }

  // 2. Fetch original categories
  const { data: origCats } = await (supabase.from("categories") as any)
    .select("*")
    .eq("menu_id", menuId)
    .order("sort_order");

  for (let ci = 0; ci < (origCats ?? []).length; ci++) {
    const origCat = origCats[ci];

    const { data: newCat } = await (supabase.from("categories") as any)
      .insert({ menu_id: newMenu.id, name: origCat.name, sort_order: ci })
      .select()
      .single();

    if (!newCat) continue;

    // 3. Fetch and duplicate dishes
    const { data: origDishes } = await (supabase.from("dishes") as any)
      .select("*")
      .eq("category_id", origCat.id)
      .order("sort_order");

    if (origDishes && origDishes.length > 0) {
      await (supabase.from("dishes") as any).insert(
        origDishes.map((d: any, i: number) => ({
          category_id: newCat.id,
          name: d.name,
          description: d.description ?? "",
          price: d.price,
          currency: d.currency ?? "DT",
          image_url: d.image_url,
          allergens: d.allergens ?? [],
          available: d.available ?? true,
          variants: d.variants,
          sort_order: i,
        }))
      );
    }
  }

  return NextResponse.json({ ok: true, menuId: newMenu.id });
}
