-- ── Timeline Events ────────────────────────────────────────

create table if not exists timeline_events (
  id            uuid primary key default uuid_generate_v4(),
  event_date    date not null,
  org           text not null check (org in ('Anthropic','OpenAI','Google','Meta','Microsoft','Industry')),
  title         text not null,
  description   text not null,
  significance  text not null check (significance in ('major','notable','context')),
  glossary_slug text,
  href          text,
  article_slug  text,
  audience      text[] default '{}',
  published     boolean default true,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now(),
  unique (event_date, org, title)
);

create index if not exists timeline_events_date_idx on timeline_events(event_date desc);
create index if not exists timeline_events_org_idx on timeline_events(org);
create index if not exists timeline_events_published_idx on timeline_events(published);

create trigger timeline_events_updated_at
  before update on timeline_events
  for each row execute function update_updated_at();

-- RLS: public read of published events
alter table timeline_events enable row level security;
create policy "public read published timeline events"
  on timeline_events for select
  using (published = true);
