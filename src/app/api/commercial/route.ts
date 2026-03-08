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

  const clients = (restaurants ?? []).map((r: any) => ({
    id: r.id,
    name: r.name,
    plan: r.plan,
    status: r.status,
    created_at: r.created_at,
    owner: profileMap.get(r.owner_id) ?? null,
    payment: paymentMap.get(r.id) ?? null,
    usage: usageMap.get(r.id) ?? null,
  }));

  const commissionRate = (auth.profile as any).commission_rate ?? 65;

  return NextResponse.json({
    profile: auth.profile,
    commissionRate,
    clients,
  });
}
