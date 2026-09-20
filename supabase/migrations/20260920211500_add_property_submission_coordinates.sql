alter table public.property_submissions
  add column if not exists latitude numeric,
  add column if not exists longitude numeric;
