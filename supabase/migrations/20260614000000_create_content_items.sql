create table if not exists public.content_items (
  id text primary key,
  publication_date date not null,
  category text not null,
  title text not null,
  description text not null default '',
  type text not null check (type in ('article', 'video')),
  url text not null,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.content_items enable row level security;

revoke all on table public.content_items from anon, authenticated;
grant select on table public.content_items to anon, authenticated;

drop policy if exists "Content items are publicly readable" on public.content_items;
create policy "Content items are publicly readable"
  on public.content_items
  for select
  to anon, authenticated
  using (published = true);

insert into public.content_items
  (id, publication_date, category, title, description, type, url, sort_order)
values
  ('pub-jwb-138-1-video', '2026-06-01', 'JW Broadcasting', 'JW Broadcasting—June 2026: 159th Gilead Graduation', '1h 32m 23s', 'video', 'https://www.jw.org/en/library/videos/#en/mediaitems/StudioMonthlyPrograms/pub-jwb-138_1_VIDEO', 0),
  ('pub-jwbvod26-21-video', '2026-05-29', 'Morning Worship', 'David H. Splane: Faith Without Works Is Dead (Jas. 2:17)', '8m 45s', 'video', 'https://www.jw.org/en/library/videos/#en/mediaitems/VODPgmEvtMorningWorship/pub-jwbvod26_21_VIDEO', 0),
  ('pub-jwbvod26-23-video', '2026-05-29', 'Morning Worship', 'Harold Corkern: Jehovah Provides True Wisdom (Ps. 19:7)', '10m 32s', 'video', 'https://www.jw.org/en/library/videos/#en/mediaitems/VODPgmEvtMorningWorship/pub-jwbvod26_23_VIDEO', 1),
  ('pub-jwbvod26-19-video', '2026-05-22', 'Morning Worship', 'Joel Dellinger: Be a True Friend Like Jonathan (1 Sam. 18:1)', '10m 17s', 'video', 'https://www.jw.org/en/library/videos/#en/mediaitems/VODPgmEvtMorningWorship/pub-jwbvod26_19_VIDEO', 0),
  ('pub-jwbvod26-20-video', '2026-05-22', 'Morning Worship', 'Izak Marais: Jehovah Gives Us the Desire and Power to Act (Phil. 2:13)', '10m 12s', 'video', 'https://www.jw.org/en/library/videos/#en/mediaitems/VODPgmEvtMorningWorship/pub-jwbvod26_20_VIDEO', 1),
  ('pub-mwbv-202605-1-video', '2026-05-11', 'Relief Work', 'Disaster Preparedness—Expect the Unexpected', '4m 51s', 'video', 'https://www.jw.org/en/library/videos/#en/mediaitems/VODActivitiesReliefWork/pub-mwbv_202605_1_VIDEO', 0),
  ('2026-06-09-convinced-love-support', '2026-06-09', 'News Releases', 'UPDATE - BROTHER FINED | Convinced of Jehovah''s Love and Support', '', 'article', 'https://www.jw.org/en/whats-new/', 0),
  ('2026-06-09-pray-unbreakable', '2026-06-09', 'News Releases', 'BROTHER IMPRISONED | ''I Pray to Be Unbreakable''', '', 'article', 'https://www.jw.org/en/whats-new/', 1),
  ('2026-06-08-seven-brothers-ukraine', '2026-06-08', 'News Releases', 'Seven More Brothers Imprisoned as Conscientious Objectors in Ukraine', '', 'article', 'https://www.jw.org/en/whats-new/', 0),
  ('2026-06-04-after-each-trial', '2026-06-04', 'News Releases', 'After Each Trial, Blessings Have Come', '', 'article', 'https://www.jw.org/en/whats-new/', 0),
  ('2026-06-03-bible-books-may', '2026-06-03', 'News Releases', 'Bible Books Released in Three Languages During May 2026', '', 'article', 'https://www.jw.org/en/whats-new/', 0),
  ('2026-06-02-four-brothers-russia', '2026-06-02', 'News Releases', 'Four Brothers Released in Russia', '', 'article', 'https://www.jw.org/en/whats-new/', 0),
  ('2026-06-01-world-peace', '2026-06-01', 'The Watchtower', 'Is World Peace Possible?', 'World peace is assured, and the Bible''s solution will surprise you!', 'article', 'https://www.jw.org/en/whats-new/', 1),
  ('2026-05-27-oleg-postnikov', '2026-05-27', 'News Releases', 'UPDATE - CONVICTION OVERTURNED | Oleg Postnikov Convicted for a Second Time - Sentenced to Over Six Years in Prison', '', 'article', 'https://www.jw.org/en/whats-new/', 0),
  ('2026-05-25-ebola-congo', '2026-05-25', 'News Releases', 'Ebola Outbreak Threatens Millions in the Democratic Republic of the Congo', '', 'article', 'https://www.jw.org/en/whats-new/', 0),
  ('2026-05-22-he-will-answer', '2026-05-22', 'News Releases', 'BROTHERS IMPRISONED | He Will Answer', '', 'article', 'https://www.jw.org/en/whats-new/', 2),
  ('2026-05-19-serving-gives-meaning', '2026-05-19', 'News Releases', 'BROTHER IMPRISONED | Serving Jehovah Gives Meaning to Life', '', 'article', 'https://www.jw.org/en/whats-new/', 0),
  ('2026-05-19-stephane-landeroin', '2026-05-19', 'The Watchtower - Study Edition', 'Stephane Landeroin: My Grand Creator Noticed Me', 'Find out what Stephane and his wife, Claudine, have learned through their life experiences.', 'article', 'https://www.jw.org/en/whats-new/', 1),
  ('2026-05-19-city-gates', '2026-05-19', 'The Watchtower - Study Edition', 'City Gates in Bible Times', 'What activities took place at city gates in Bible times?', 'article', 'https://www.jw.org/en/whats-new/', 2),
  ('2026-05-19-almond-tree', '2026-05-19', 'The Watchtower - Study Edition', 'Bible Fact - The Tree That Wakes Up Early', 'Consider some facts about the almond tree and its use in the Bible.', 'article', 'https://www.jw.org/en/whats-new/', 3),
  ('2026-05-19-august-2026', '2026-05-19', 'The Watchtower - Study Edition', 'August 2026', 'This issue contains the study articles for October 5-November 1, 2026.', 'article', 'https://www.jw.org/en/whats-new/', 4),
  ('2026-05-15-temporary-resident', '2026-05-15', 'News Releases', 'BROTHER IMPRISONED | I Am a Temporary Resident in This World', '', 'article', 'https://www.jw.org/en/whats-new/', 0),
  ('2026-05-14-oscar-cisano', '2026-05-14', 'Life Stories', 'Oscar Cisano: I Have Gazed Upon the Pleasantness of Jehovah', 'Learn how Oscar experienced support while serving full-time despite having a visual impairment.', 'article', 'https://www.jw.org/en/whats-new/', 0),
  ('2026-05-13-jehovahs-side', '2026-05-13', 'News Releases', 'I Will Stay on Jehovah''s Side', '', 'article', 'https://www.jw.org/en/whats-new/', 0),
  ('2026-05-13-kenya-tanzania', '2026-05-13', 'News Releases', 'Over 11,000 Bible Studies Requested During Preaching Campaign in Kenya and Tanzania', '', 'article', 'https://www.jw.org/en/whats-new/', 1),
  ('2026-05-11-convinced-loved', '2026-05-11', 'News Releases', 'I Am Convinced That Jehovah Loves Me Deeply', '', 'article', 'https://www.jw.org/en/whats-new/', 1)
on conflict (id) do update set
  publication_date = excluded.publication_date,
  category = excluded.category,
  title = excluded.title,
  description = excluded.description,
  type = excluded.type,
  url = excluded.url,
  published = excluded.published,
  sort_order = excluded.sort_order,
  updated_at = now();
