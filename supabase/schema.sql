-- Run in Supabase SQL Editor. Requires Anonymous Sign-ins to be enabled.
create table if not exists public.roadfit_user_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.roadfit_user_data enable row level security;

drop policy if exists "Users can read own RoadFit data" on public.roadfit_user_data;
create policy "Users can read own RoadFit data"
  on public.roadfit_user_data for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own RoadFit data" on public.roadfit_user_data;
create policy "Users can insert own RoadFit data"
  on public.roadfit_user_data for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own RoadFit data" on public.roadfit_user_data;
create policy "Users can update own RoadFit data"
  on public.roadfit_user_data for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

grant select, insert, update on public.roadfit_user_data to authenticated;
