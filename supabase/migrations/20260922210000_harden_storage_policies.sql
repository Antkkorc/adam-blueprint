-- Keep public reads for already-published listing media, but prevent anonymous
-- uploads and prevent users from writing outside their own submission folder.
alter table storage.objects enable row level security;

drop policy if exists "Public property submission uploads" on storage.objects;
create policy "Authenticated users can upload property submissions"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'property-submissions'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Public property submission files" on storage.objects;
create policy "Property submission files remain readable"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'property-submissions');

drop policy if exists "Authenticated users can upload rental photos" on storage.objects;
create policy "Users can upload rental photos to their own folder"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'rental-images'
    and (storage.foldername(name))[1] = 'submissions'
    and (storage.foldername(name))[2] = auth.uid()::text
  );

drop policy if exists "Users can delete their rental photos" on storage.objects;
create policy "Users can delete their own rental photos"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'rental-images'
    and (storage.foldername(name))[1] = 'submissions'
    and (storage.foldername(name))[2] = auth.uid()::text
  );
