alter table public.tenant_rentals
  add column if not exists title text,
  add column if not exists location text,
  add column if not exists price numeric,
  add column if not exists description text,
  add column if not exists images jsonb not null default '[]'::jsonb,
  add column if not exists user_id uuid,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists tenant_name text,
  add column if not exists contact_number text,
  add column if not exists tenant_phone text,
  add column if not exists contact_name text,
  add column if not exists contact_phone text;
