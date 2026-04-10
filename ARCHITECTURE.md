# aicodex.to — Site Architecture

## Stack
Next.js 14 (App Router) + Supabase + Vercel — same as AyahGuide and CannabisHub

---

## URL Structure

```
aicodex.to/                          Homepage
aicodex.to/glossary                  Full knowledge graph browser
aicodex.to/glossary/[term-slug]      Individual term page
aicodex.to/articles                  All Tier 2–5 articles
aicodex.to/articles/[slug]           Individual article
aicodex.to/newsletter                Newsletter archive + signup
aicodex.to/courses                   Course listings (Phase 2)
aicodex.to/courses/[slug]            Individual course
aicodex.to/about                     The operator story
```

---

## Pages

### `/` — Homepage

**Sections:**
1. **Hero** — Wordmark + tagline + search bar. No hero image. Typography-forward.
2. **What this is** — 2-3 sentence explanation of the knowledge graph model. Short.
3. **Browse by Cluster** — 8 cluster cards with icon, name, term count
4. **Featured Articles** — 3 Tier 3/5 articles (the differentiating content)
5. **From the Field** — Latest operator dispatch (human-written)
6. **Newsletter CTA** — Inline, minimal. One field, one button.

---

### `/glossary` — Knowledge Graph Browser

The core product page. Three interaction modes:

**Mode 1 — Search**
- Prominent search bar at top
- Real-time filtering as you type
- Searches term name, aliases, definition

**Mode 2 — Browse by Cluster**
- 8 cluster filter pills (Foundation Models, Agents, Retrieval, etc.)
- Each pill shows term count
- Active cluster highlights its color

**Mode 3 — A–Z Index**
- Alphabet strip below cluster filters
- Jump to letter section
- Each letter section lists terms as rows

**Term Row (in browse view):**
```
[CLUSTER TAG]  Term Name                    Short definition preview...  →
```

**Sorting:** Default alphabetical. Toggle: by cluster, by tier (most connected first)

---

### `/glossary/[term-slug]` — Term Page

**Layout (two-column on desktop, stacked mobile):**

**Left column (main):**
- Term name (Instrument Serif, large)
- Cluster badge + audience tags
- Definition (Tier 1 content)
- Article sections for each published angle (process, failure mode, etc.)
- Cross-entity section: "How [term] relates to..."

**Right column (sticky sidebar):**
- Related terms (linked)
- Cluster it belongs to
- Audience tags (who this matters to)
- "Claude-specific" badge if applicable
- Table of contents for long pages

**Bottom:**
- Articles that reference this term
- "What to read next" — 2-3 suggested terms

---

### `/articles` — Article Browser

- Filter by: Cluster, Tier (cross-entity, journey, absence), Audience
- Card grid — term name, article title, cluster tag, read time
- Tier 5 (absence articles) visually differentiated — they're the flagship content

---

### `/articles/[slug]` — Article Page

- Clean reading layout, 65ch max
- Breadcrumb: Cluster → Term → Article angle
- All referenced terms hyperlinked inline (contextual linking system)
- Related terms sidebar
- Newsletter CTA at bottom

---

### `/about` — The Operator Story

Not a bio page. A positioning statement:

- What this site is and why it exists
- The Distru context (building AI in a regulated B2B company)
- The knowledge graph model explained
- What "From the Field" dispatches are

---

## Content Types in the DB

```sql
-- Terms (glossary nodes)
terms (
  id, slug, name, aliases[], cluster, scope,
  lifecycle_stage, audience[], tier,
  angles[], claude_specific, definition,
  published, created_at, updated_at
)

-- Articles (content on terms)
articles (
  id, slug, term_id, title, angle,
  body_mdx, read_time, published,
  created_at, updated_at
)

-- Cross-entity links
term_relationships (
  id, from_term_id, to_term_id,
  relationship_type, description
)

-- Newsletter issues
newsletter_issues (
  id, slug, subject, body_mdx,
  sent_at, issue_number
)
```

---

## Navigation

**Top nav:**
```
[AI Codex]    Glossary    Articles    Newsletter    About
                                                    [Search]
```

**Mobile:** Hamburger → full-screen overlay

**No sidebar nav** — the knowledge graph is navigated through contextual links and the glossary browser, not a tree menu.

---

## SEO Architecture

Every term page targets: "what is [term]", "[term] explained", "[term] for [audience]"
Every cross-entity article targets: "[term A] vs [term B]", "[term A] and [term B]"
Every absence article targets the question nobody else is answering

Sitemap auto-generated from published terms + articles.
OG images auto-generated per term (term name + cluster + aicodex.to wordmark).

---

## Phase Roadmap

**Phase 1 — Knowledge Graph Foundation**
- Glossary browser (all 8 clusters)
- ~150 Tier 1 term pages
- ~20 Tier 3 cross-entity articles
- Newsletter (Beehiiv embedded or built-in)
- About page

**Phase 2 — Content Depth**
- Tier 2 entity hubs (multiple angles per major term)
- ~10 Tier 5 absence articles
- "From the Field" dispatch section
- Search with full-text

**Phase 3 — Learning Layer**
- Courses (structured paths through the knowledge graph)
- "AI for Startup Founders" path
- "Claude in Production" path
- Progress tracking
