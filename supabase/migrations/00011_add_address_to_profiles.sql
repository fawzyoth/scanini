-- Add address field to profiles (used by commercials)
alter table public.profiles
  add column if not exists address text;
