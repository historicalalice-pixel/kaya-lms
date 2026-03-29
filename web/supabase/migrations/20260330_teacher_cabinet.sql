create extension if not exists pgcrypto;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.teacher_courses (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  topic text not null default '',
  status text not null default 'draft' check (status in ('draft', 'scheduled', 'published', 'hidden', 'archived')),
  publish_at timestamptz,
  lessons_count integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.teacher_lessons (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid references public.teacher_courses(id) on delete set null,
  title text not null,
  group_name text not null default 'Без групи',
  status text not null default 'draft' check (status in ('draft', 'scheduled', 'published', 'hidden', 'archived')),
  publish_at timestamptz,
  zoom_link text,
  content_summary text not null default '',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.teacher_groups (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  invite_code text not null,
  invite_url text not null,
  archived boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (teacher_id, invite_code)
);

create table if not exists public.teacher_students (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references auth.users(id) on delete cascade,
  group_id uuid references public.teacher_groups(id) on delete set null,
  full_name text not null,
  phone text,
  email text not null,
  login text,
  password_mask text not null default '••••••••',
  telegram text,
  note text not null default '',
  status text not null default 'active' check (status in ('active', 'inactive', 'blocked')),
  last_login_at timestamptz,
  progress integer not null default 0 check (progress >= 0 and progress <= 100),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists teacher_courses_teacher_id_idx on public.teacher_courses(teacher_id);
create index if not exists teacher_lessons_teacher_id_idx on public.teacher_lessons(teacher_id);
create index if not exists teacher_lessons_course_id_idx on public.teacher_lessons(course_id);
create index if not exists teacher_groups_teacher_id_idx on public.teacher_groups(teacher_id);
create index if not exists teacher_students_teacher_id_idx on public.teacher_students(teacher_id);
create index if not exists teacher_students_group_id_idx on public.teacher_students(group_id);
create index if not exists teacher_students_email_idx on public.teacher_students(lower(email));

alter table public.teacher_courses enable row level security;
alter table public.teacher_lessons enable row level security;
alter table public.teacher_groups enable row level security;
alter table public.teacher_students enable row level security;

drop policy if exists "Teachers manage own courses" on public.teacher_courses;
create policy "Teachers manage own courses"
on public.teacher_courses
for all
to authenticated
using (auth.uid() = teacher_id)
with check (auth.uid() = teacher_id);

drop policy if exists "Teachers manage own lessons" on public.teacher_lessons;
create policy "Teachers manage own lessons"
on public.teacher_lessons
for all
to authenticated
using (auth.uid() = teacher_id)
with check (auth.uid() = teacher_id);

drop policy if exists "Teachers manage own groups" on public.teacher_groups;
create policy "Teachers manage own groups"
on public.teacher_groups
for all
to authenticated
using (auth.uid() = teacher_id)
with check (auth.uid() = teacher_id);

drop policy if exists "Teachers manage own students" on public.teacher_students;
create policy "Teachers manage own students"
on public.teacher_students
for all
to authenticated
using (auth.uid() = teacher_id)
with check (auth.uid() = teacher_id);

drop policy if exists "Students can read own blocked status" on public.teacher_students;
create policy "Students can read own blocked status"
on public.teacher_students
for select
to authenticated
using (
  lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
);

drop trigger if exists set_teacher_courses_updated_at on public.teacher_courses;
create trigger set_teacher_courses_updated_at
before update on public.teacher_courses
for each row execute function public.touch_updated_at();

drop trigger if exists set_teacher_lessons_updated_at on public.teacher_lessons;
create trigger set_teacher_lessons_updated_at
before update on public.teacher_lessons
for each row execute function public.touch_updated_at();

drop trigger if exists set_teacher_groups_updated_at on public.teacher_groups;
create trigger set_teacher_groups_updated_at
before update on public.teacher_groups
for each row execute function public.touch_updated_at();

drop trigger if exists set_teacher_students_updated_at on public.teacher_students;
create trigger set_teacher_students_updated_at
before update on public.teacher_students
for each row execute function public.touch_updated_at();
