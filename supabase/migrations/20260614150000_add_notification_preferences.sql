create table if not exists public.notification_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.notification_preferences enable row level security;

revoke all on table public.notification_preferences from anon, authenticated;
grant select, insert, update on table public.notification_preferences to authenticated;

drop policy if exists "Users can read their notification preference" on public.notification_preferences;
create policy "Users can read their notification preference"
  on public.notification_preferences
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can create their notification preference" on public.notification_preferences;
create policy "Users can create their notification preference"
  on public.notification_preferences
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their notification preference" on public.notification_preferences;
create policy "Users can update their notification preference"
  on public.notification_preferences
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create or replace function public.notification_subscribers()
returns table (email text)
language sql
security definer
set search_path = public, auth
as $$
  select users.email::text
  from public.notification_preferences
  join auth.users on users.id = notification_preferences.user_id
  where notification_preferences.enabled = true
    and users.email is not null
    and users.email_confirmed_at is not null;
$$;

revoke all on function public.notification_subscribers() from public, anon, authenticated;
grant execute on function public.notification_subscribers() to service_role;
