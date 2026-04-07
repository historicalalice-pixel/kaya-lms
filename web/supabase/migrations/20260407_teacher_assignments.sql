create table if not exists public.teacher_assignments (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid references public.teacher_lessons(id) on delete set null,
  title text not null,
  target text not null default 'Група без назви',
  deadline_at timestamptz,
  status text not null default 'submitted' check (status in ('missing', 'submitted', 'checked')),
  comment text not null default '',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists teacher_assignments_teacher_id_idx on public.teacher_assignments(teacher_id);
create index if not exists teacher_assignments_lesson_id_idx on public.teacher_assignments(lesson_id);

alter table public.teacher_assignments enable row level security;

drop policy if exists "Teachers manage own assignments" on public.teacher_assignments;
create policy "Teachers manage own assignments"
on public.teacher_assignments
for all
to authenticated
using (auth.uid() = teacher_id)
with check (auth.uid() = teacher_id);

drop trigger if exists set_teacher_assignments_updated_at on public.teacher_assignments;
create trigger set_teacher_assignments_updated_at
before update on public.teacher_assignments
for each row execute function public.touch_updated_at();
