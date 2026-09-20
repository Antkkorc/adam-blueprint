alter table public.tenant_rentals
  add column if not exists status text;

update public.tenant_rentals
set status = 'Available'
where status is null or status not in ('Available', 'Rented');

alter table public.tenant_rentals
  alter column status set default 'Available',
  alter column status set not null;

alter table public.tenant_rentals
  drop constraint if exists tenant_rentals_status_check;

alter table public.tenant_rentals
  add constraint tenant_rentals_status_check check (status in ('Available', 'Rented'));

alter table public.tenant_rentals enable row level security;
revoke insert, update, delete on public.tenant_rentals from anon, authenticated;
grant select on public.tenant_rentals to anon, authenticated;

comment on column public.tenant_rentals.status is 'Admin-controlled publication status: Available or Rented.';
