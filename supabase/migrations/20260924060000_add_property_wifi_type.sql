alter table public.properties
  add column if not exists wifi_type text;

alter table public.properties
  drop constraint if exists properties_wifi_type_check;

alter table public.properties
  add constraint properties_wifi_type_check
  check (wifi_type is null or wifi_type in ('fibre', 'router'));

create index if not exists properties_wifi_type_idx
  on public.properties (wifi_type)
  where wifi_type is not null;
