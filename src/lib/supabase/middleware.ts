import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh the session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Route categories
  const isProtectedRoute =
    pathname.startsWith("/menus") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/stats") ||
    pathname.startsWith("/qr-code") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/billing");

  const isAdminRoute = pathname.startsWith("/admin");
  const isPendingPage = pathname === "/pending";

  // ── Not logged in ──
  if (!user && (isProtectedRoute || isAdminRoute)) {
    const url = request.nextUrl.clone();
    url.pathname = "/signin";
    return NextResponse.redirect(url);
  }

  if (!user) return supabaseResponse;

  // ── Fetch user profile (role) ──
  // Try profiles table first, fall back to user metadata
  let isAdmin = false;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile && (profile as any).role === "admin") {
    isAdmin = true;
  } else if (profileError || !profile) {
    // Profile might not exist yet (created before trigger) or RLS blocks it.
    // Check user_metadata as fallback — admin role can be set there too.
    const meta = user.user_metadata;
    if (meta?.role === "admin") {
      isAdmin = true;
    }
  }

  // ── Admin route protection: only admins can access /admin ──
  if (isAdminRoute && !isAdmin) {
    const url = request.nextUrl.clone();
    url.pathname = "/pending";
    return NextResponse.redirect(url);
  }

  // ── Admins skip pending check (they don't have restaurants) ──
  if (isAdmin) return supabaseResponse;

  // ── Owner: ONLY allow dashboard if status is explicitly "active" or "trial" ──
  if (isProtectedRoute || isPendingPage) {
    const { data: restaurant } = await supabase
      .from("restaurants")
      .select("status")
      .eq("owner_id", user.id)
      .single();

    const status = restaurant ? (restaurant as any).status : null;
    const isApproved = status === "active" || status === "trial";

    // Protected route + NOT approved → go to /pending
    if (isProtectedRoute && !isApproved) {
      const url = request.nextUrl.clone();
      url.pathname = "/pending";
      return NextResponse.redirect(url);
    }

    // Pending page + IS approved → go to dashboard
    if (isPendingPage && isApproved) {
      const url = request.nextUrl.clone();
      url.pathname = "/menus";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
