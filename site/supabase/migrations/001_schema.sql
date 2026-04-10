-- ── AI Codex Schema ────────────────────────────────────────

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── Terms ──────────────────────────────────────────────────

create table if not exists terms (
  id            uuid primary key default uuid_generate_v4(),
  slug          text unique not null,
  name          text not null,
  aliases       text[] default '{}',
  cluster       text not null,
  scope         text not null check (scope in ('conceptual','technical','business','strategic')),
  lifecycle_stage text not null check (lifecycle_stage in ('awareness','evaluation','adoption','scaling','optimization')),
  audience      text[] default '{}',
  tier          int not null check (tier between 1 and 5),
  angles        text[] default '{}',
  related_terms text[] default '{}',  -- array of slugs
  claude_specific boolean default false,
  definition    text not null,
  published     boolean default false,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- Indexes
create index if not exists terms_cluster_idx on terms(cluster);
create index if not exists terms_published_idx on terms(published);
create index if not exists terms_slug_idx on terms(slug);

-- Full text search index
create index if not exists terms_fts_idx on terms
  using gin(to_tsvector('english', name || ' ' || definition));

-- Updated_at trigger
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger terms_updated_at
  before update on terms
  for each row execute function update_updated_at();

-- ── Articles ───────────────────────────────────────────────

create table if not exists articles (
  id          uuid primary key default uuid_generate_v4(),
  slug        text unique not null,
  term_id     uuid references terms(id) on delete set null,
  term_name   text,
  term_slug   text,
  cluster     text,
  title       text not null,
  angle       text not null,  -- def|process|failure|cross|role|absence|history|field-note
  body        text not null,  -- MDX content
  excerpt     text,           -- auto-generated or manual
  read_time   int default 5,
  tier        int default 2,
  published   boolean default false,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create index if not exists articles_term_id_idx on articles(term_id);
create index if not exists articles_published_idx on articles(published);
create index if not exists articles_cluster_idx on articles(cluster);
create index if not exists articles_angle_idx on articles(angle);
create index if not exists articles_tier_idx on articles(tier);

create trigger articles_updated_at
  before update on articles
  for each row execute function update_updated_at();

-- ── Term Relationships ─────────────────────────────────────

create table if not exists term_relationships (
  id                uuid primary key default uuid_generate_v4(),
  from_term_id      uuid not null references terms(id) on delete cascade,
  to_term_id        uuid not null references terms(id) on delete cascade,
  relationship_type text not null,  -- 'related'|'requires'|'contrasts'|'extends'
  description       text,
  created_at        timestamptz default now(),
  unique(from_term_id, to_term_id)
);

create index if not exists rel_from_idx on term_relationships(from_term_id);
create index if not exists rel_to_idx on term_relationships(to_term_id);

-- ── Newsletter ─────────────────────────────────────────────

create table if not exists newsletter_issues (
  id           uuid primary key default uuid_generate_v4(),
  slug         text unique not null,
  subject      text not null,
  body         text not null,
  excerpt      text,
  issue_number int unique not null,
  sent_at      timestamptz,
  created_at   timestamptz default now()
);

create table if not exists newsletter_subscribers (
  id            uuid primary key default uuid_generate_v4(),
  email         text unique not null,
  subscribed_at timestamptz default now(),
  unsubscribed_at timestamptz
);

-- ── RLS Policies ───────────────────────────────────────────

-- Terms: public read of published
alter table terms enable row level security;
create policy "public read published terms"
  on terms for select
  using (published = true);

-- Articles: public read of published
alter table articles enable row level security;
create policy "public read published articles"
  on articles for select
  using (published = true);

-- Term relationships: public read
alter table term_relationships enable row level security;
create policy "public read relationships"
  on term_relationships for select
  using (true);

-- Newsletter issues: public read
alter table newsletter_issues enable row level security;
create policy "public read newsletter issues"
  on newsletter_issues for select
  using (true);

-- Subscribers: insert only (no read — private)
alter table newsletter_subscribers enable row level security;
create policy "anyone can subscribe"
  on newsletter_subscribers for insert
  with check (true);
