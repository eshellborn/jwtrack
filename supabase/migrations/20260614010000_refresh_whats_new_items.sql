update public.content_items
set published = false, updated_at = now()
where published = true;

insert into public.content_items
  (id, publication_date, category, title, description, type, url, published, sort_order)
values
  ('2026-06-12-governing-body-update-4', '2026-06-12', 'News Releases', '2026 Governing Body Update #4', 'In this update, we share encouraging reports about recent branch and shepherding visits. We also consider legal developments affecting our freedom of worship in Norway and Sweden.', 'video', 'https://www.jw.org/en/news/region/global/2026-Governing-Body-Update-4/', true, 0),
  ('2026-06-11-philippines-earthquake', '2026-06-11', 'News Releases', 'Destructive Earthquake Shakes the Southern Philippines', '', 'article', 'https://www.jw.org/en/news/region/philippines/Destructive-Earthquake-Shakes-the-Southern-Philippines/', true, 0),
  ('2026-06-11-south-africa-campaign', '2026-06-11', 'News Releases', 'Preaching Campaign Reaches Sesotho- and Zulu-Speaking People in Isolated Parts of South Africa', '', 'article', 'https://www.jw.org/en/news/region/south-africa/Preaching-Campaign-Reaches-Sesotho-and-Zulu-Speaking-People-in-Isolated-Parts-of-South-Africa/', true, 1),
  ('2026-06-10-ibaloi-campaign', '2026-06-10', 'News Releases', 'Good News Reaches Remote Parts of the Philippines During Ibaloi-Language Preaching Campaign', '', 'article', 'https://www.jw.org/en/news/region/philippines/Good-News-Reaches-Remote-Parts-of-the-Philippines-During-Ibaloi-Language-Preaching-Campaign/', true, 0),
  ('2026-06-09-convinced-love-support', '2026-06-09', 'News Releases', 'UPDATE—BROTHER FINED | Convinced of Jehovah’s Love and Support', '', 'article', 'https://www.jw.org/en/news/region/russia/UPDATE-BROTHER-FINED-Convinced-of-Jehovahs-Love-and-Support/', true, 0),
  ('2026-06-09-pray-unbreakable', '2026-06-09', 'News Releases', 'BROTHER IMPRISONED | ‘I Pray to Be Unbreakable’', '', 'article', 'https://www.jw.org/en/news/region/russia/BROTHER-IMPRISONED-I-Pray-to-Be-Unbreakable/', true, 1),
  ('2026-06-08-seven-brothers-ukraine', '2026-06-08', 'News Releases', 'Seven More Brothers Imprisoned as Conscientious Objectors in Ukraine', '', 'article', 'https://www.jw.org/en/news/region/ukraine/Seven-More-Brothers-Imprisoned-as-Conscientious-Objectors-in-Ukraine/', true, 0),
  ('2026-06-04-after-each-trial', '2026-06-04', 'News Releases', '“After Each Trial, Blessings Have Come”', '', 'article', 'https://www.jw.org/en/news/region/russia/After-Each-Trial-Blessings-Have-Come/', true, 0),
  ('2026-06-03-bible-books-may', '2026-06-03', 'News Releases', 'Bible Books Released in Three Languages During May 2026', '', 'article', 'https://www.jw.org/en/news/region/global/Bible-Books-Released-in-Three-Languages-During-May-2026/', true, 0),
  ('2026-06-02-four-brothers-russia', '2026-06-02', 'News Releases', 'Four Brothers Released in Russia', '', 'article', 'https://www.jw.org/en/news/region/russia/Four-Brothers-Released-in-Russia/', true, 0),
  ('2026-06-01-world-peace', '2026-06-01', 'The Watchtower', 'Is World Peace Possible?', 'World peace is assured, and the Bible’s solution will surprise you!', 'article', 'https://www.jw.org/en/library/magazines/watchtower-no1-2026/', true, 0),
  ('2026-05-27-oleg-postnikov', '2026-05-27', 'News Releases', 'UPDATE—CONVICTION OVERTURNED | Oleg Postnikov Convicted for a Second Time—Sentenced to Over Six Years in Prison', '', 'article', 'https://www.jw.org/en/news/region/russia/UPDATE-CONVICTION-OVERTURNED-Oleg-Postnikov-Convicted-for-a-Second-Time-Sentenced-to-Over-Six-Years-in-Prison/', true, 0),
  ('2026-05-25-ebola-congo', '2026-05-25', 'News Releases', 'Ebola Outbreak Threatens Millions in the Democratic Republic of the Congo', '', 'article', 'https://www.jw.org/en/news/region/democratic-republic-congo/Ebola-Outbreak-Threatens-Millions-in-the-Democratic-Republic-of-the-Congo/', true, 0),
  ('2026-05-22-he-will-answer', '2026-05-22', 'News Releases', 'BROTHERS IMPRISONED | “He Will Answer”', '', 'article', 'https://www.jw.org/en/news/region/russia/BROTHERS-IMPRISONED-He-Will-Answer/', true, 0),
  ('2026-05-19-serving-gives-meaning', '2026-05-19', 'News Releases', 'BROTHER IMPRISONED | ‘Serving Jehovah Gives Meaning to Life’', '', 'article', 'https://www.jw.org/en/news/region/russia/BROTHER-IMPRISONED-Serving-Jehovah-Gives-Meaning-to-Life/', true, 0),
  ('2026-05-19-stephane-landeroin', '2026-05-19', 'The Watchtower—Study Edition', 'Stéphane Landeroin: My Grand Creator Noticed Me', 'Find out what Stéphane and his wife, Claudine, have learned through their life experiences while in missionary service, Bethel service, and circuit work.', 'article', 'https://www.jw.org/en/library/magazines/watchtower-study-august-2026/St%C3%A9phane-Landeroin-My-Grand-Creator-Noticed-Me/', true, 1),
  ('2026-05-19-city-gates', '2026-05-19', 'The Watchtower—Study Edition', 'City Gates in Bible Times', 'What activities took place at city gates in Bible times?', 'article', 'https://www.jw.org/en/library/magazines/watchtower-study-august-2026/did-you-know/', true, 2),
  ('2026-05-19-almond-tree', '2026-05-19', 'The Watchtower—Study Edition', 'Bible Fact—The Tree That Wakes Up Early', 'Consider some facts about the almond tree and its use in the Bible.', 'article', 'https://www.jw.org/en/library/magazines/watchtower-study-august-2026/Bible-Fact%E2%80%8B-The-Tree-That-Wakes-Up-Early/', true, 3),
  ('2026-05-19-august-2026', '2026-05-19', 'The Watchtower—Study Edition', 'August 2026', 'This issue contains the study articles for October 5–November 1, 2026.', 'article', 'https://www.jw.org/en/library/magazines/watchtower-study-august-2026/', true, 4),
  ('2026-05-15-temporary-resident', '2026-05-15', 'News Releases', 'BROTHER IMPRISONED | “I Am a ‘Temporary Resident’ in This World”', '', 'article', 'https://www.jw.org/en/news/region/russia/BROTHER-IMPRISONED-I-Am-a-Temporary-Resident-in-This-World/', true, 0),
  ('2026-05-14-oscar-cisano', '2026-05-14', 'Life Stories', 'Oscar Cisano: I Have ‘Gazed Upon the Pleasantness of Jehovah’', 'Learn how Oscar experienced Jehovah’s support while serving him full-time despite having a visual impairment. With Jehovah’s help, he changed his perspective and learned that Jehovah never deserts his friends.', 'article', 'https://www.jw.org/en/library/series/life-stories-jehovahs-witnesses/Oscar-Cisano-I-Have-Gazed-Upon-the-Pleasantness-of-Jehovah/', true, 0)
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
