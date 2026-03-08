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

// GET /api/admin/commercials — list all commercials with their stats
export async function GET(request: NextRequest) {
  if (!(await verifyAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const month = parseInt(searchParams.get("month") ?? String(new Date().getMonth() + 1));
  const year = parseInt(searchParams.get("year") ?? String(new Date().getFullYear()));

  const service = getServiceClient();

  // Get all commercial profiles
  const { data: commercials } = await service
    .from("profiles")
    .select("*")
    .eq("role", "commercial")
    .order("created_at", { ascending: false });

  if (!commercials || commercials.length === 0) {
    return NextResponse.json([]);
  }

  // Get all restaurants with commercial_id
  const { data: restaurants } = await service
    .from("restaurants")
    .select("*");

  // Get payments for the month
  const { data: payments } = await service
    .from("payments")
    .select("*")
    .eq("period_month", month)
    .eq("period_year", year);

  const paymentMap = new Map((payments ?? []).map((p: any) => [p.restaurant_id, p]));

  const result = commercials.map((c: any) => {
    const myRestaurants = (restaurants ?? []).filter((r: any) => r.commercial_id === c.id);
    const paidRestaurants = myRestaurants.filter((r: any) => paymentMap.get(r.id)?.status === "paid");
    const totalRevenue = paidRestaurants.reduce((sum: number, r: any) => {
      const payment = paymentMap.get(r.id);
      return sum + (payment?.amount ?? 0);
    }, 0);
    const commissionRate = c.commission_rate ?? 65;
    const commission = Math.round(totalRevenue * (commissionRate / 100) * 100) / 100;

    return {
      id: c.id,
      first_name: c.first_name,
      last_name: c.last_name,
      email: c.email,
      phone: c.phone,
      whatsapp: c.whatsapp,
      commission_rate: commissionRate,
      created_at: c.created_at,
      total_clients: myRestaurants.length,
      active_clients: myRestaurants.filter((r: any) => r.status === "active").length,
      paid_clients: paidRestaurants.length,
      total_revenue: totalRevenue,
      commission,
      platform_share: totalRevenue - commission,
    };
  });

  return NextResponse.json(result);
}

// PATCH /api/admin/commercials — update commission rate or assign restaurant
export async function PATCH(request: NextRequest) {
  if (!(await verifyAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await request.json();
  const { commercial_id, commission_rate, restaurant_id } = body;

  const service = getServiceClient();

  if (commission_rate !== undefined && commercial_id) {
    await service
      .from("profiles")
      .update({ commission_rate })
      .eq("id", commercial_id);
  }

  if (restaurant_id && commercial_id) {
    await service
      .from("restaurants")
      .update({ commercial_id })
      .eq("id", restaurant_id);
  }

  return NextResponse.json({ success: true });
}
