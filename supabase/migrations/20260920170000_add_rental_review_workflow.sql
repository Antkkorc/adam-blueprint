create table if not exists public.rental_submissions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  location text not null,
  price numeric not null,
  bedrooms integer not null,
  bathrooms integer not null,
  description text not null,
  images jsonb not null default '[]'::jsonb,
  image_labels jsonb not null default '[]'::jsonb,
  latitude numeric,
  longitude numeric,
  contact_name text not null,
  contact_number text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

alter table public.rental_submissions enable row level security;

drop policy if exists "Authenticated users can submit rentals for review" on public.rental_submissions;
create policy "Authenticated users can submit rentals for review"
  on public.rental_submissions for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can view their rental submissions" on public.rental_submissions;
create policy "Users can view their rental submissions"
  on public.rental_submissions for select
  to authenticated
  using (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('rental-images', 'rental-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Authenticated users can upload rental photos" on storage.objects;
create policy "Authenticated users can upload rental photos"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'rental-images' and (storage.foldername(name))[1] = 'submissions');

drop policy if exists "Users can delete their rental photos" on storage.objects;
create policy "Users can delete their rental photos"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'rental-images' and owner_id = auth.uid()::text);
