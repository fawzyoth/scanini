import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

async function verifyCommercial(request: NextRequest) {
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
  if (!user) return null;

  const service = getServiceClient();
  const { data: profile } = await service
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profile?.role === "commercial") return { user, profile };
  return null;
}

// GET /api/commercial — get commercial's dashboard data
export async function GET(request: NextRequest) {
  const auth = await verifyCommercial(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const month = parseInt(searchParams.get("month") ?? String(new Date().getMonth() + 1));
  const year = parseInt(searchParams.get("year") ?? String(new Date().getFullYear()));

  const service = getServiceClient();
  const commercialId = auth.user.id;

  // Get all restaurants assigned to this commercial
  const { data: restaurants } = await service
    .from("restaurants")
    .select("*")
    .eq("commercial_id", commercialId);

  const restaurantIds = (restaurants ?? []).map((r: any) => r.id);

  // Get profiles for restaurant owners
  const ownerIds = (restaurants ?? []).map((r: any) => r.owner_id);
  const { data: profiles } = ownerIds.length > 0
    ? await service.from("profiles").select("*").in("id", ownerIds)
    : { data: [] };

  // Get auth users to read phone from metadata (PostgREST may not return phone)
  const authPhoneMap = new Map<string, string>();
  for (const ownerId of ownerIds) {
    const { data: authUser } = await service.auth.admin.getUserById(ownerId);
    const phone = authUser?.user?.user_metadata?.phone;
    if (phone) authPhoneMap.set(ownerId, phone);
  }

  // Get payments for the specified month
  const { data: payments } = restaurantIds.length > 0
    ? await service
        .from("payments")
        .select("*")
        .in("restaurant_id", restaurantIds)
        .eq("period_month", month)
        .eq("period_year", year)
    : { data: [] };

  // Get usage stats
  const { data: usageRows } = restaurantIds.length > 0
    ? await service.from("restaurant_usage").select("*").in("restaurant_id", restaurantIds)
    : { data: [] };

  const profileMap = new Map((profiles ?? []).map((p: any) => [p.id, p]));
  const paymentMap = new Map((payments ?? []).map((p: any) => [p.restaurant_id, p]));
  const usageMap = new Map((usageRows ?? []).map((u: any) => [u.restaurant_id, u]));

  const clients = (restaurants ?? []).map((r: any) => {
    const owner = profileMap.get(r.owner_id);
    // Use auth metadata phone as fallback if profile phone is missing
    if (owner && !owner.phone && authPhoneMap.has(r.owner_id)) {
      owner.phone = authPhoneMap.get(r.owner_id);
    }
    return {
      id: r.id,
      name: r.name,
      plan: r.plan,
      status: r.status,
      created_at: r.created_at,
      owner: owner ?? null,
      payment: paymentMap.get(r.id) ?? null,
      usage: usageMap.get(r.id) ?? null,
    };
  });

  const commissionRate = (auth.profile as any).commission_rate ?? 65;

  return NextResponse.json({
    profile: auth.profile,
    commissionRate,
    clients,
  });
}

// POST /api/commercial — create a new client (user + restaurant, auto-approved)
export async function POST(request: NextRequest) {
  const auth = await verifyCommercial(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await request.json();
  const { first_name, last_name, restaurant_name, email, phone, password, plan } = body;

  if (!first_name || !restaurant_name || !email || !phone || !password) {
    return NextResponse.json(
      { error: "Tous les champs obligatoires doivent etre remplis" },
      { status: 400 }
    );
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: "Le mot de passe doit contenir au moins 6 caracteres" },
      { status: 400 }
    );
  }

  const service = getServiceClient();

  // 1. Create auth user
  const { data: authData, error: authError } = await service.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { first_name, last_name: last_name || "", phone },
  });

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 });
  }

  const userId = authData.user.id;

  // 2. Wait for trigger to create profile
  await new Promise((r) => setTimeout(r, 800));

  // 3. Create restaurant — auto-approved (active), assigned to this commercial
  const { error: restError } = await service.from("restaurants").insert({
    owner_id: userId,
    name: restaurant_name,
    plan: plan || "starter",
    status: "active",
    commercial_id: auth.user.id,
  } as any);

  if (restError) {
    console.error("Restaurant creation error:", restError.message);
    return NextResponse.json({ error: restError.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, id: userId });
}
