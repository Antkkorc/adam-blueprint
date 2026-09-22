insert into storage.buckets (id, name, public)
values ('student-proofs', 'student-proofs', false)
on conflict (id) do update set public = false;

create policy "Authenticated users can upload their own student proof"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'student-proofs'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

create policy "Users can view their own student proof"
on storage.objects for select to authenticated
using (
  bucket_id = 'student-proofs'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);
