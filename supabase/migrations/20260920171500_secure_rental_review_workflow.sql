-- Admin review requests use the server-only service role after requireAdmin()
-- validates ADMIN_EMAIL or ADMIN_USER_ID. Never expose that key to the browser.

alter table public.rental_submissions enable row level security;
alter table public.tenant_rentals enable row level security;

drop policy if exists "Users can view their rental submissions" on public.rental_submissions;
create policy "Users can view their rental submissions"
  on public.rental_submissions for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Authenticated users can submit rentals for review" on public.rental_submissions;
create policy "Authenticated users can submit rentals for review"
  on public.rental_submissions for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Listing publication is performed only by the service role in the protected API.
revoke insert, update, delete on public.tenant_rentals from anon, authenticated;
drop policy if exists "Anyone can view tenant rentals" on public.tenant_rentals;
create policy "Anyone can view tenant rentals"
  on public.tenant_rentals for select
  to anon, authenticated
  using (true);

comment on table public.rental_submissions is
  'User-submitted rental listings; review mutations run through the requireAdmin() service-role API.';
