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

// POST /api/admin/commercials — create a new commercial user
export async function POST(request: NextRequest) {
  if (!(await verifyAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await request.json();
  const { first_name, last_name, email, phone, address, password } = body;

  if (!first_name || !last_name || !email || !password) {
    return NextResponse.json(
      { error: "Nom, prenom, email et mot de passe sont requis" },
      { status: 400 }
    );
  }

  const service = getServiceClient();

  // Create auth user — the updated trigger will set role/whatsapp/address from metadata
  const { data: authData, error: authError } = await service.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      first_name,
      last_name,
      phone: phone || "",
      role: "commercial",
      whatsapp: phone || "",
      address: address || "",
    },
  });

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 });
  }

  const userId = authData.user.id;

  // Wait for the trigger to create the profile
  await new Promise((r) => setTimeout(r, 500));

  // Update profile via the SQL function (bypasses PostgREST schema cache entirely)
  const { error: rpcError } = await service.rpc("update_commercial_profile" as any, {
    p_user_id: userId,
    p_first_name: first_name,
    p_last_name: last_name,
    p_email: email,
    p_phone: phone || null,
    p_whatsapp: phone || null,
    p_address: address || null,
  });

  if (rpcError) {
    // The trigger should have already set the correct data from user_metadata
    console.error("RPC update failed (trigger fallback used):", rpcError.message);
  }

  return NextResponse.json({ success: true, id: userId });
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
