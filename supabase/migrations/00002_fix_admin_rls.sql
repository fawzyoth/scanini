-- ============================================================
-- Fix admin RLS: use a SECURITY DEFINER helper to avoid
-- circular reference when profiles policies query profiles.
-- ============================================================

-- Helper function that bypasses RLS to check admin role
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable;

-- ── Profiles ────────────────────────────────────────────────
-- Drop the old circular policy
drop policy if exists "Admins can view all profiles" on public.profiles;

-- Recreate using the helper function
create policy "Admins can view all profiles"
  on public.profiles for select using (public.is_admin());

-- Also let admins update profiles (for editing user details)
create policy "Admins can update all profiles"
  on public.profiles for update using (public.is_admin());

-- ── Restaurants ─────────────────────────────────────────────
-- Replace the admin restaurant policy to use the helper too
drop policy if exists "Admins can manage all restaurants" on public.restaurants;

create policy "Admins can manage all restaurants"
  on public.restaurants for all using (public.is_admin());

-- ── Menus ───────────────────────────────────────────────────
drop policy if exists "Admins can manage all menus" on public.menus;

create policy "Admins can manage all menus"
  on public.menus for all using (public.is_admin());

-- ── Scans ───────────────────────────────────────────────────
drop policy if exists "Admins can view all scans" on public.scans;

create policy "Admins can view all scans"
  on public.scans for select using (public.is_admin());
