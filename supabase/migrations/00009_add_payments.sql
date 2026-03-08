-- ============================================================
-- Payment tracking for subscription management
-- ============================================================

create table public.payments (
  id          uuid primary key default uuid_generate_v4(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  amount      numeric(10, 2) not null default 0,
  period_month integer not null, -- 1-12
  period_year  integer not null,
  plan        public.plan_type not null default 'free',
  status      text not null default 'pending' check (status in ('pending', 'paid', 'overdue')),
  paid_at     timestamptz,
  notes       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Prevent duplicate payments for the same restaurant/month
create unique index payments_restaurant_period_idx
  on public.payments(restaurant_id, period_year, period_month);

-- Auto-update updated_at
create trigger payments_updated_at
  before update on public.payments
  for each row execute function update_updated_at();

-- RLS
alter table public.payments enable row level security;

-- Admins can do everything
create policy "Admins full access on payments"
  on public.payments
  for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  );

-- Owners can read their own payments
create policy "Owners read own payments"
  on public.payments
  for select
  using (
    restaurant_id in (
      select id from public.restaurants where owner_id = auth.uid()
    )
  );
