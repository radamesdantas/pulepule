-- ============================================
-- Migration 009 — Reunioes Familiares
-- ============================================
create table public.family_meetings (
  id uuid default gen_random_uuid() primary key,
  teen_id uuid references public.profiles(id) on delete cascade not null,
  recorded_by uuid references public.profiles(id) not null,
  meeting_type text not null check (meeting_type in ('weekly', 'monthly')),
  meeting_date date not null,
  duration_minutes int not null check (duration_minutes > 0),
  topic text,
  notes text,
  created_at timestamptz default now() not null
);

alter table public.family_meetings enable row level security;

create policy "Teen ve suas reunioes"
  on public.family_meetings for select
  using (auth.uid() = teen_id);

create policy "Teen registra reunioes"
  on public.family_meetings for insert
  with check (auth.uid() = recorded_by);

create policy "Pai ve reunioes dos teens vinculados"
  on public.family_meetings for select
  using (
    exists (
      select 1 from public.parent_teen
      where parent_id = auth.uid() and teen_id = family_meetings.teen_id
    )
  );

create policy "Pai registra reunioes de teens vinculados"
  on public.family_meetings for insert
  with check (
    exists (
      select 1 from public.parent_teen
      where parent_id = auth.uid() and teen_id = family_meetings.teen_id
    )
  );

create policy "Mentor ve reunioes de todos os teens"
  on public.family_meetings for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'mentor'
    )
  );
