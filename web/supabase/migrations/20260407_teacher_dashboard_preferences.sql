create table if not exists public.teacher_dashboard_preferences (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null unique references auth.users(id) on delete cascade,
  layout_json jsonb not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists teacher_dashboard_preferences_teacher_id_idx
  on public.teacher_dashboard_preferences(teacher_id);

alter table public.teacher_dashboard_preferences enable row level security;

drop policy if exists "Teachers manage own dashboard preferences" on public.teacher_dashboard_preferences;
create policy "Teachers manage own dashboard preferences"
on public.teacher_dashboard_preferences
for all
to authenticated
using (auth.uid() = teacher_id)
with check (auth.uid() = teacher_id);

drop trigger if exists set_teacher_dashboard_preferences_updated_at on public.teacher_dashboard_preferences;
create trigger set_teacher_dashboard_preferences_updated_at
before update on public.teacher_dashboard_preferences
for each row execute function public.touch_updated_at();
