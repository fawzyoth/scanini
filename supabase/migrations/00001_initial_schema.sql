-- ============================================================
-- Scanini.io — Full Database Schema
-- ============================================================

-- 0. Extensions
create extension if not exists "uuid-ossp";

-- 1. ENUM types
create type public.user_role    as enum ('owner', 'admin');
create type public.plan_type    as enum ('free', 'starter', 'pro', 'business');
create type public.account_status as enum ('pending', 'active', 'trial', 'suspended');

-- ============================================================
-- 2. PROFILES (extends Supabase auth.users)
-- ============================================================
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  first_name  text not null default '',
  last_name   text not null default '',
  email       text not null,
  phone       text,
  avatar_url  text,
  role        public.user_role not null default 'owner',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ============================================================
-- 3. RESTAURANTS
-- ============================================================
create table public.restaurants (
  id            uuid primary key default uuid_generate_v4(),
  owner_id      uuid not null references public.profiles(id) on delete cascade,
  name          text not null,
  cover_image   text,
  phone         text,
  address       text,
  wifi_ssid     text,
  wifi_password text,
  social_instagram text,
  social_facebook  text,
  social_tiktok    text,
  -- plan & billing
  plan          public.plan_type not null default 'free',
  status        public.account_status not null default 'pending',
  billing_cycle text not null default 'monthly' check (billing_cycle in ('monthly', 'yearly')),
  -- appearance
  primary_color   text not null default '#4f46e5',
  extra_info      text,
  reviews_enabled boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ============================================================
-- 4. MENUS
-- ============================================================
create table public.menus (
  id              uuid primary key default uuid_generate_v4(),
  restaurant_id   uuid not null references public.restaurants(id) on delete cascade,
  name            text not null,
  icon            text not null default 'utensils-crossed',
  availability    text not null default 'Every day',
  visible         boolean not null default true,
  sort_order      int not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ============================================================
-- 5. CATEGORIES
-- ============================================================
create table public.categories (
  id          uuid primary key default uuid_generate_v4(),
  menu_id     uuid not null references public.menus(id) on delete cascade,
  name        text not null,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- 6. DISHES
-- ============================================================
create table public.dishes (
  id            uuid primary key default uuid_generate_v4(),
  category_id   uuid not null references public.categories(id) on delete cascade,
  name          text not null,
  description   text not null default '',
  price         numeric(10,2) not null default 0,
  currency      text not null default 'DT',
  image_url     text,
  allergens     text[] not null default '{}',
  available     boolean not null default true,
  sort_order    int not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ============================================================
-- 7. QR SETTINGS (one per restaurant)
-- ============================================================
create table public.qr_settings (
  id                uuid primary key default uuid_generate_v4(),
  restaurant_id     uuid not null unique references public.restaurants(id) on delete cascade,
  frame_type        text not null default 'bottom' check (frame_type in ('bottom', 'top', 'none')),
  background_color  text not null default '#000000',
  text              text not null default 'MENU',
  text_color        text not null default '#FFFFFF',
  font              text not null default 'Roboto',
  font_size         int not null default 24,
  dot_style         text not null default 'square' check (dot_style in ('square', 'rounded', 'dots')),
  dot_color         text not null default '#000000',
  corner_style      text not null default 'square' check (corner_style in ('square', 'rounded')),
  corner_color      text not null default '#000000',
  logo_url          text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- ============================================================
-- 8. SCANS (analytics — each QR scan is a row)
-- ============================================================
create table public.scans (
  id              uuid primary key default uuid_generate_v4(),
  restaurant_id   uuid not null references public.restaurants(id) on delete cascade,
  scanned_at      timestamptz not null default now(),
  period          text not null default 'afternoon' check (period in ('morning', 'afternoon'))
);

-- Index for fast monthly counts
create index idx_scans_restaurant_month on public.scans (restaurant_id, scanned_at);

-- ============================================================
-- 9. REVIEWS
-- ============================================================
create table public.reviews (
  id              uuid primary key default uuid_generate_v4(),
  restaurant_id   uuid not null references public.restaurants(id) on delete cascade,
  rating          smallint not null check (rating between 1 and 5),
  meal            smallint not null check (meal between 1 and 5),
  service         smallint not null check (service between 1 and 5),
  atmosphere      smallint not null check (atmosphere between 1 and 5),
  cleanliness     smallint not null check (cleanliness between 1 and 5),
  comment         text,
  created_at      timestamptz not null default now()
);

-- ============================================================
-- 10. MENU LANGUAGES
-- ============================================================
create table public.menu_languages (
  id              uuid primary key default uuid_generate_v4(),
  restaurant_id   uuid not null references public.restaurants(id) on delete cascade,
  language_code   text not null,  -- e.g. 'fr', 'en', 'ar'
  is_default      boolean not null default false,
  created_at      timestamptz not null default now(),
  unique (restaurant_id, language_code)
);

-- ============================================================
-- 11. HELPER VIEWS
-- ============================================================

-- Restaurant usage stats (menus, dishes, scans this month)
create or replace view public.restaurant_usage as
select
  r.id as restaurant_id,
  r.owner_id,
  r.plan,
  r.status,
  (select count(*) from public.menus m where m.restaurant_id = r.id)::int as menu_count,
  (
    select count(*) from public.dishes d
    join public.categories c on c.id = d.category_id
    join public.menus m on m.id = c.menu_id
    where m.restaurant_id = r.id
  )::int as dish_count,
  (
    select count(*) from public.scans s
    where s.restaurant_id = r.id
      and s.scanned_at >= date_trunc('month', now())
  )::int as scans_this_month
from public.restaurants r;

-- ============================================================
-- 12. AUTO-UPDATED_AT TRIGGER
-- ============================================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at before update on public.profiles      for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.restaurants   for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.menus         for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.dishes        for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.qr_settings   for each row execute function public.handle_updated_at();

-- ============================================================
-- 13. AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, first_name, last_name, phone)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', ''),
    coalesce(new.raw_user_meta_data->>'phone', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- 14. ROW LEVEL SECURITY
-- ============================================================

-- Profiles
alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Admins can view all profiles"
  on public.profiles for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Restaurants
alter table public.restaurants enable row level security;

create policy "Owners can manage own restaurant"
  on public.restaurants for all using (owner_id = auth.uid());

create policy "Admins can manage all restaurants"
  on public.restaurants for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Public read for restaurant info (for QR menu viewers)
create policy "Anyone can view restaurant basics"
  on public.restaurants for select using (true);

-- Menus
alter table public.menus enable row level security;

create policy "Owners can manage own menus"
  on public.menus for all using (
    restaurant_id in (select id from public.restaurants where owner_id = auth.uid())
  );

create policy "Public can view visible menus"
  on public.menus for select using (visible = true);

create policy "Admins can manage all menus"
  on public.menus for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Categories
alter table public.categories enable row level security;

create policy "Owners can manage own categories"
  on public.categories for all using (
    menu_id in (
      select m.id from public.menus m
      join public.restaurants r on r.id = m.restaurant_id
      where r.owner_id = auth.uid()
    )
  );

create policy "Public can view categories"
  on public.categories for select using (true);

-- Dishes
alter table public.dishes enable row level security;

create policy "Owners can manage own dishes"
  on public.dishes for all using (
    category_id in (
      select c.id from public.categories c
      join public.menus m on m.id = c.menu_id
      join public.restaurants r on r.id = m.restaurant_id
      where r.owner_id = auth.uid()
    )
  );

create policy "Public can view available dishes"
  on public.dishes for select using (true);

-- QR Settings
alter table public.qr_settings enable row level security;

create policy "Owners can manage own QR settings"
  on public.qr_settings for all using (
    restaurant_id in (select id from public.restaurants where owner_id = auth.uid())
  );

-- Scans (public insert for anonymous QR scans, owners can read)
alter table public.scans enable row level security;

create policy "Anyone can insert scans"
  on public.scans for insert with check (true);

create policy "Owners can view own scans"
  on public.scans for select using (
    restaurant_id in (select id from public.restaurants where owner_id = auth.uid())
  );

create policy "Admins can view all scans"
  on public.scans for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Reviews (public insert, owners can read)
alter table public.reviews enable row level security;

create policy "Anyone can insert reviews"
  on public.reviews for insert with check (true);

create policy "Owners can view own reviews"
  on public.reviews for select using (
    restaurant_id in (select id from public.restaurants where owner_id = auth.uid())
  );

-- Menu Languages
alter table public.menu_languages enable row level security;

create policy "Owners can manage own languages"
  on public.menu_languages for all using (
    restaurant_id in (select id from public.restaurants where owner_id = auth.uid())
  );

create policy "Public can view languages"
  on public.menu_languages for select using (true);

-- ============================================================
-- 15. SEED ADMIN USER
-- ============================================================
-- The admin account (admin@scanini.io) must be created via
-- Supabase Dashboard > Authentication > Users > Add User
-- with email: admin@scanini.io and password: Fizou@97086903
--
-- After creating the auth user, run this to promote to admin:
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'admin@scanini.io';
