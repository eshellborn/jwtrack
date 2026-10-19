-- Public sites cannot distinguish the owner's browser from any other visitor
-- without some form of authentication. This table therefore intentionally stores
-- one shared completion state that every visitor can read and change.

create table if not exists public.shared_progress (
  item_id text primary key references public.content_items(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.shared_progress enable row level security;

revoke all on table public.shared_progress from anon, authenticated;
grant select, insert, update, delete on table public.shared_progress to anon, authenticated;

drop policy if exists "Shared progress is publicly readable" on public.shared_progress;
create policy "Shared progress is publicly readable"
  on public.shared_progress
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Shared progress can be publicly created" on public.shared_progress;
create policy "Shared progress can be publicly created"
  on public.shared_progress
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Shared progress can be publicly updated" on public.shared_progress;
create policy "Shared progress can be publicly updated"
  on public.shared_progress
  for update
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "Shared progress can be publicly deleted" on public.shared_progress;
create policy "Shared progress can be publicly deleted"
  on public.shared_progress
  for delete
  to anon, authenticated
  using (true);

-- Preserve existing completion records when upgrading from the authenticated tracker.
do $$
begin
  if to_regclass('public.user_progress') is not null then
    insert into public.shared_progress (item_id)
    select distinct item_id from public.user_progress
    on conflict (item_id) do nothing;
  end if;
end
$$;
