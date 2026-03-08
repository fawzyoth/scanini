import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

async function verifyAdmin(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {},
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const service = getServiceClient();
  const { data: profile } = await service
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role === "admin") return true;
  if (user.user_metadata?.role === "admin") return true;
  return false;
}

// GET /api/admin/payments?month=3&year=2026
// or GET /api/admin/payments?restaurant_id=xxx (all payments for a restaurant)
export async function GET(request: NextRequest) {
  if (!(await verifyAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const restaurantId = searchParams.get("restaurant_id");
  const month = searchParams.get("month");
  const year = searchParams.get("year");

  const service = getServiceClient();

  if (restaurantId) {
    // Get all payments for a specific restaurant
    const { data, error } = await service
      .from("payments")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .order("period_year", { ascending: false })
      .order("period_month", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data ?? []);
  }

  if (month && year) {
    // Get all payments for a specific month
    const { data, error } = await service
      .from("payments")
      .select("*")
      .eq("period_month", parseInt(month))
      .eq("period_year", parseInt(year));

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data ?? []);
  }

  return NextResponse.json({ error: "Provide month+year or restaurant_id" }, { status: 400 });
}

// POST /api/admin/payments — create or update a payment record
export async function POST(request: NextRequest) {
  if (!(await verifyAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await request.json();
  const { restaurant_id, period_month, period_year, amount, plan, status, notes } = body;

  if (!restaurant_id || !period_month || !period_year) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const service = getServiceClient();

  // Upsert: create or update payment for this restaurant/month
  const { data, error } = await service
    .from("payments")
    .upsert(
      {
        restaurant_id,
        period_month,
        period_year,
        amount: amount ?? 0,
        plan: plan ?? "free",
        status: status ?? "pending",
        paid_at: status === "paid" ? new Date().toISOString() : null,
        notes: notes ?? null,
      },
      { onConflict: "restaurant_id,period_year,period_month" }
    )
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// PATCH /api/admin/payments — update payment status
export async function PATCH(request: NextRequest) {
  if (!(await verifyAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await request.json();
  const { id, status, notes } = body;

  if (!id || !status) {
    return NextResponse.json({ error: "Missing id or status" }, { status: 400 });
  }

  const service = getServiceClient();

  const update: Record<string, any> = { status };
  if (status === "paid") update.paid_at = new Date().toISOString();
  if (notes !== undefined) update.notes = notes;

  const { data, error } = await service
    .from("payments")
    .update(update)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
