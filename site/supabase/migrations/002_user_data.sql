-- ── User Progress & Favorites ──────────────────────────────
-- Run this in Supabase Studio SQL editor (or supabase db push)

-- ── User Progress ──────────────────────────────────────────

create table if not exists user_progress (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  article_slug text not null,
  read_at      timestamptz default now(),
  unique(user_id, article_slug)
);

create index if not exists user_progress_user_idx    on user_progress(user_id);
create index if not exists user_progress_article_idx on user_progress(article_slug);

alter table user_progress enable row level security;

create policy "users can read own progress"
  on user_progress for select
  using (auth.uid() = user_id);

create policy "users can insert own progress"
  on user_progress for insert
  with check (auth.uid() = user_id);

create policy "users can delete own progress"
  on user_progress for delete
  using (auth.uid() = user_id);

-- ── User Favorites ─────────────────────────────────────────

create table if not exists user_favorites (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  article_slug text not null,
  favorited_at timestamptz default now(),
  unique(user_id, article_slug)
);

create index if not exists user_favorites_user_idx    on user_favorites(user_id);
create index if not exists user_favorites_article_idx on user_favorites(article_slug);

alter table user_favorites enable row level security;

create policy "users can read own favorites"
  on user_favorites for select
  using (auth.uid() = user_id);

create policy "users can insert own favorites"
  on user_favorites for insert
  with check (auth.uid() = user_id);

create policy "users can delete own favorites"
  on user_favorites for delete
  using (auth.uid() = user_id);
