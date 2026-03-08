-- ============================================================
-- Commercial accounts for sales agents
-- ============================================================

-- Add commercial role
alter type public.user_role add value if not exists 'commercial';

-- Add commercial_id to restaurants (which commercial manages this restaurant)
alter table public.restaurants
  add column if not exists commercial_id uuid references public.profiles(id) on delete set null;

-- Add WhatsApp number to profiles (used by commercials for receiving requests)
alter table public.profiles
  add column if not exists whatsapp text;

-- Commercial revenue split config (percentage the commercial keeps)
alter table public.profiles
  add column if not exists commission_rate numeric(5, 2) not null default 65.00;

-- Index for fast lookup of restaurants by commercial
create index if not exists idx_restaurants_commercial
  on public.restaurants(commercial_id);

-- RLS: Commercials can view/manage their assigned restaurants
create policy "Commercials can view assigned restaurants"
  on public.restaurants for select using (
    commercial_id = auth.uid()
  );

create policy "Commercials can update assigned restaurants"
  on public.restaurants for update using (
    commercial_id = auth.uid()
  );

-- Commercials can view profiles of their restaurant owners
create policy "Commercials can view owner profiles"
  on public.profiles for select using (
    id in (
      select owner_id from public.restaurants where commercial_id = auth.uid()
    )
  );

-- Commercials can view payments of their restaurants
create policy "Commercials can view assigned payments"
  on public.payments for select using (
    restaurant_id in (
      select id from public.restaurants where commercial_id = auth.uid()
    )
  );

-- Note: restaurant_usage is a view (not a table), so no RLS policy needed.
-- It derives data from restaurants which already has commercial RLS policies.
-- The commercial API route uses the service-role client to query it directly.
