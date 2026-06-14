update public.content_items
set
  type = 'article',
  category = 'News Releases',
  description = 'In this update, we share encouraging reports about recent branch and shepherding visits. We also consider legal developments affecting our freedom of worship in Norway and Sweden.',
  url = 'https://www.jw.org/en/news/region/global/2026-Governing-Body-Update-4/',
  published = true,
  sort_order = 0,
  updated_at = now()
where id = '2026-06-12-governing-body-update-4';

update public.content_items
set published = false, updated_at = now()
where type = 'video';

insert into public.content_items
  (id, publication_date, category, title, description, type, url, published, sort_order)
values
  ('docid-1112024061-1-video', '2026-06-12', 'Governing Body Updates', '2026 Governing Body Update #4', '15:35', 'video', 'https://www.jw.org/finder?locale=en&lank=docid-1112024061_1_VIDEO&docid=1011214&applanguage=E', true, 0),
  ('docid-502200156-1-video', '2026-06-11', 'Was It Designed?', 'Was It Designed? Echolocation', '2:57', 'video', 'https://www.jw.org/finder?locale=en&lank=docid-502200156_1_VIDEO&docid=1011214&applanguage=E', true, 0),
  ('pub-jwb-138-1-video', '2026-06-01', 'JW Broadcasting', 'JW Broadcasting—June 2026: 159th Gilead Graduation', '1:32:23', 'video', 'https://www.jw.org/finder?locale=en&lank=pub-jwb-138_1_VIDEO&docid=1011214&applanguage=E', true, 0),
  ('pub-jwbvod26-21-video', '2026-05-29', 'Morning Worship', 'David H. Splane: Faith Without Works Is Dead (Jas. 2:17)', '8:45', 'video', 'https://www.jw.org/finder?locale=en&lank=pub-jwbvod26_21_VIDEO&docid=1011214&applanguage=E', true, 0),
  ('pub-jwbvod26-23-video', '2026-05-29', 'Morning Worship', 'Harold Corkern: Jehovah Provides True Wisdom (Ps. 19:7)', '10:32', 'video', 'https://www.jw.org/finder?locale=en&lank=pub-jwbvod26_23_VIDEO&docid=1011214&applanguage=E', true, 1),
  ('pub-jwbvod26-19-video', '2026-05-22', 'Morning Worship', 'Joel Dellinger: Be a True Friend Like Jonathan (1 Sam. 18:1)', '10:17', 'video', 'https://www.jw.org/finder?locale=en&lank=pub-jwbvod26_19_VIDEO&docid=1011214&applanguage=E', true, 0),
  ('pub-jwbvod26-20-video', '2026-05-22', 'Morning Worship', 'Izak Marais: Jehovah Gives Us the Desire and Power to Act (Phil. 2:13)', '10:12', 'video', 'https://www.jw.org/finder?locale=en&lank=pub-jwbvod26_20_VIDEO&docid=1011214&applanguage=E', true, 1)
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
