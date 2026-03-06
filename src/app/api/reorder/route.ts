import { createServerSupabase } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const ALLOWED_TABLES = ["menus", "categories", "dishes"] as const;
type AllowedTable = (typeof ALLOWED_TABLES)[number];

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabase();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { table, items } = body as { table: string; items: { id: string; sort_order: number }[] };

  if (!ALLOWED_TABLES.includes(table as AllowedTable)) {
    return NextResponse.json({ error: "Invalid table" }, { status: 400 });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Invalid items" }, { status: 400 });
  }

  const errors: string[] = [];

  for (const item of items) {
    const { error } = await (supabase.from(table) as any)
      .update({ sort_order: item.sort_order })
      .eq("id", item.id);

    if (error) {
      errors.push(`${item.id}: ${error.message}`);
    }
  }

  if (errors.length > 0) {
    return NextResponse.json({ error: "Some updates failed", details: errors }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
