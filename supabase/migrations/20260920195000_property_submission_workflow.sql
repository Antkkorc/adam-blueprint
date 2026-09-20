create table if not exists public.property_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  name text not null, phone text not null, email text not null,
  intent text not null check (intent in ('sell','rent')),
  title text, location text, price numeric, description text not null,
  images jsonb not null default '[]'::jsonb,
  house_plan_url text,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  reviewed_at timestamptz, reviewed_by uuid references auth.users(id),
  rejection_reason text, property_id text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
alter table public.property_submissions enable row level security;
drop policy if exists "Anyone can submit property requests" on public.property_submissions;
create policy "Anyone can submit property requests" on public.property_submissions for insert to anon, authenticated
  with check (user_id is null or user_id = auth.uid());
drop policy if exists "Users can view own property requests" on public.property_submissions;
create policy "Users can view own property requests" on public.property_submissions for select to authenticated
  using (user_id = auth.uid());

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  type text not null default 'property_submission', title text not null, message text not null,
  read_at timestamptz, created_at timestamptz not null default now()
);
alter table public.notifications enable row level security;
drop policy if exists "Users can read own notifications" on public.notifications;
create policy "Users can read own notifications" on public.notifications for select to authenticated using (user_id = auth.uid());
drop policy if exists "Users can mark own notifications read" on public.notifications;
create policy "Users can mark own notifications read" on public.notifications for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

insert into storage.buckets (id,name,public) values ('property-submissions','property-submissions',true)
on conflict (id) do update set public = true;
drop policy if exists "Public property submission uploads" on storage.objects;
create policy "Public property submission uploads" on storage.objects for insert to anon, authenticated
  with check (bucket_id = 'property-submissions');
drop policy if exists "Public property submission files" on storage.objects;
create policy "Public property submission files" on storage.objects for select to anon, authenticated
  using (bucket_id = 'property-submissions');

alter table public.properties add column if not exists house_plan_url text;
