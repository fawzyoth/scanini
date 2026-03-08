-- Update the handle_new_user trigger to also set role and whatsapp from metadata
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, first_name, last_name, phone, role, whatsapp, address)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', ''),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    coalesce(new.raw_user_meta_data->>'role', 'owner')::public.user_role,
    coalesce(new.raw_user_meta_data->>'whatsapp', null),
    coalesce(new.raw_user_meta_data->>'address', null)
  );
  return new;
end;
$$ language plpgsql security definer;

-- Create a helper function to update commercial profiles (bypasses PostgREST schema cache)
create or replace function public.update_commercial_profile(
  p_user_id uuid,
  p_first_name text,
  p_last_name text,
  p_email text,
  p_phone text default null,
  p_whatsapp text default null,
  p_address text default null
)
returns void as $$
begin
  update public.profiles
  set
    first_name = p_first_name,
    last_name = p_last_name,
    email = p_email,
    role = 'commercial',
    phone = p_phone,
    whatsapp = p_whatsapp,
    address = p_address,
    updated_at = now()
  where id = p_user_id;
end;
$$ language plpgsql security definer;
