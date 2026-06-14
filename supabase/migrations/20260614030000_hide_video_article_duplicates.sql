update public.content_items as article
set published = false, updated_at = now()
where article.type = 'article'
  and article.published = true
  and exists (
    select 1
    from public.content_items as video
    where video.type = 'video'
      and video.published = true
      and lower(video.title) = lower(article.title)
  );
