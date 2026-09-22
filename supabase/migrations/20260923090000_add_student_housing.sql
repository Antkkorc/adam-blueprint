alter table public.tenant_rentals
  add column if not exists student_friendly boolean not null default false,
  add column if not exists student_proof_required boolean not null default false;

alter table public.rental_submissions
  add column if not exists student_friendly boolean not null default false,
  add column if not exists student_proof_type text,
  add column if not exists student_proof_path text,
  add column if not exists student_verification_status text not null default 'not_required'
    check (student_verification_status in ('not_required', 'pending', 'verified', 'rejected'));

create index if not exists tenant_rentals_student_friendly_idx
  on public.tenant_rentals (student_friendly) where student_friendly = true;

comment on column public.rental_submissions.student_proof_path is
  'Private storage path; never expose publicly. Admin review only.';
