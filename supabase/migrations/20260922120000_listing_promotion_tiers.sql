alter table public.properties
  add column if not exists promotion_tier text not null default 'standard'
  check (promotion_tier in ('standard', 'featured', 'premium'));

update public.properties
set promotion_tier = 'featured'
where featured = true and promotion_tier = 'standard';

create index if not exists properties_promotion_tier_idx
  on public.properties (promotion_tier);
