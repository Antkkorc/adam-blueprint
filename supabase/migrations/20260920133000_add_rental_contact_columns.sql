alter table public.tenant_rentals
  add column if not exists contact_name text,
  add column if not exists contact_phone text;

comment on column public.tenant_rentals.contact_name is
  'Name shown on community rental listings.';

comment on column public.tenant_rentals.contact_phone is
  'Phone number used for rental enquiries.';
