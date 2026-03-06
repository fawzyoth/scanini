import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

// Service-role client bypasses RLS
function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// Verify the caller is an admin using request cookies directly
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

// GET /api/admin/users — fetch ALL users (profiles-based, not restaurant-based)
export async function GET(request: NextRequest) {
  if (!(await verifyAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const service = getServiceClient();

  const [{ data: profiles }, { data: restaurants }, { data: usageRows }] =
    await Promise.all([
      service.from("profiles").select("*").order("created_at", { ascending: false }),
      service.from("restaurants").select("*"),
      service.from("restaurant_usage").select("*"),
    ]);

  // Map restaurants by owner_id
  const restMap = new Map(
    (restaurants ?? []).map((r: any) => [r.owner_id, r])
  );
  const usageMap = new Map(
    (usageRows ?? []).map((u: any) => [u.restaurant_id, u])
  );

  // Build user list from profiles (skip admin profiles)
  const users = (profiles ?? [])
    .filter((p: any) => p.role !== "admin")
    .map((p: any) => {
      const restaurant = restMap.get(p.id) ?? null;
      const usage = restaurant ? usageMap.get(restaurant.id) : null;
      return {
        // Use restaurant id if exists, otherwise profile id
        id: restaurant?.id ?? p.id,
        profile_id: p.id,
        name: restaurant?.name ?? "No restaurant",
        owner_id: p.id,
        status: restaurant?.status ?? "pending",
        plan: restaurant?.plan ?? "free",
        created_at: restaurant?.created_at ?? p.created_at,
        profile: p,
        restaurant,
        scans_this_month: usage?.scans_this_month ?? 0,
        has_restaurant: !!restaurant,
      };
    });

  return NextResponse.json(users);
}

// PATCH /api/admin/users — update restaurant status or create restaurant
export async function PATCH(request: NextRequest) {
  if (!(await verifyAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await request.json();
  const { id, profile_id, status } = body;

  if (!status) {
    return NextResponse.json({ error: "Missing status" }, { status: 400 });
  }

  const service = getServiceClient();

  // If the user has a restaurant, update it
  if (id && id !== profile_id) {
    const { error } = await service.from("restaurants").update({ status }).eq("id", id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } else if (profile_id) {
    // User has no restaurant — try to update by owner_id
    const { data: existing } = await service
      .from("restaurants")
      .select("id")
      .eq("owner_id", profile_id)
      .single();

    if (existing) {
      await service.from("restaurants").update({ status }).eq("id", existing.id);
    } else {
      // Create a restaurant for this user
      const { data: profile } = await service
        .from("profiles")
        .select("first_name, last_name")
        .eq("id", profile_id)
        .single();

      await service.from("restaurants").insert({
        owner_id: profile_id,
        name: `${profile?.first_name ?? ""} ${profile?.last_name ?? ""}`.trim() || "My Restaurant",
        status,
      });
    }
  }

  return NextResponse.json({ success: true });
}

// DELETE /api/admin/users — delete a restaurant (and optionally the user)
export async function DELETE(request: NextRequest) {
  if (!(await verifyAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const profileId = searchParams.get("profile_id");

  const service = getServiceClient();

  // Delete restaurant if it exists
  if (id && id !== profileId) {
    await service.from("restaurants").delete().eq("id", id);
  } else if (profileId) {
    // Delete restaurant by owner_id
    await service.from("restaurants").delete().eq("owner_id", profileId);
  }

  return NextResponse.json({ success: true });
}
