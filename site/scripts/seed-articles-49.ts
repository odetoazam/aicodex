/**
 * Batch 49 — Setting up Claude for your team (team lead perspective)
 * 1. setting-up-claude-for-your-team — Priya's new gap:
 *    "Should I set up a shared Project template for my team, or have each rep
 *    build their own?" The team lead view — not admin, not individual.
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-49.ts
 */

import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function getTermId(slug: string): Promise<{ id: string; name: string } | null> {
  const { data } = await sb.from('terms').select('id, name').eq('slug', slug).single()
  return data
}

const ARTICLES = [
  {
    termSlug: 'claude-projects',
    slug: 'setting-up-claude-for-your-team',
    angle: 'process',
    title: 'Setting up Claude for your team: the team lead guide',
    excerpt: "If every person on your team sets up Claude from scratch, they will each get different results and most will give up. Here is how to give your team a consistent starting point — whether you have admin access or not.",
    readTime: 6,
    cluster: 'Business Strategy & ROI',
    body: `If you are a team lead rolling out Claude to your direct reports, the individual setup guides tell you what each person should do. This article is about the layer above that: how to give your team a consistent, well-configured starting point rather than leaving each person to figure it out alone.

The difference matters. A team where everyone set up Claude from scratch will have four people using Claude in four different ways, getting four different quality levels of output, and reaching four different conclusions about whether it is worth using. A team where everyone starts from the same base prompt and company context will get consistent results from day one.

## The two-layer model

There is company/team context that everyone on your team shares, and there is individual context that belongs to each person.

**Shared layer (you set this up once):**
- What your company does and who your customers are
- Your team's specific context (role, responsibilities, the problems you solve)
- Communication guidelines (tone, format, what to include in customer-facing output)
- Common scenarios your team handles (the five most frequent things they ask Claude)

**Individual layer (each person adds their own):**
- Their specific focus this quarter
- Their own communication style tweaks
- Their current projects or accounts

When people set up Claude from scratch, they typically get the individual layer right (they know about themselves) and skip the shared layer entirely (they don't know the right way to describe company context). The result is a Claude that responds generically rather than one that understands the business.

Your job as team lead is to write the shared layer once and hand it to everyone.

## Writing the shared system prompt

Create a document — a shared Google Doc or Notion page works fine — with this structure:

---

**Company context:**
[Company name] sells [product/service] to [customer type]. We typically work with [company size/industry]. Our customers use us to [main use case — 1-2 sentences]. The main problems we help them solve are [problem 1], [problem 2], [problem 3].

**Team context:**
This is the [team name] team. We handle [what your team does]. In a typical week, we [describe the main work — customer interactions, internal tasks, whatever is true].

**Communication guidelines:**
When writing customer-facing communications:
- Tone: [professional/friendly/formal — whatever your company standard is]
- [Any specific do/don't — "always use first name", "avoid jargon", "include a clear next step"]
- [Any format rules — "keep emails under 150 words", "use bullet points for lists of more than 3 items"]

**Most common tasks:**
We frequently use Claude to help with:
1. [Task 1 — e.g., "drafting follow-up emails after customer calls"]
2. [Task 2 — e.g., "summarising account history before QBR calls"]
3. [Task 3 — e.g., "preparing responses to common objections"]
4. [Task 4]
5. [Task 5]

---

This document becomes the shared starting point. Everyone on your team sets up a Claude Project with this as the basis of their system prompt, then adds their own name, role, and current focus on top of it.

## Sharing it with your team

**The basic approach (any Claude tier):** Share the document and ask each team member to:
1. Create a new Claude Project named for their role (e.g. "CS Work")
2. Copy the shared system prompt text into their Project instructions
3. Add a personal section at the end: their name, their specific accounts or focus, anything individual

This takes each person about 10 minutes. It is faster and more reliable than asking them to write their own from scratch.

**The Teams/Enterprise approach:** In Claude Teams and Enterprise, you can create Projects that other workspace members can access directly. If your org is on one of these plans, you can create a shared Project and add your team members — they get immediate access to the context without any individual setup. Talk to your admin about whether your plan supports shared Projects.

## What to add beyond the system prompt

Once people have the base configured, three additions make it significantly more useful:

**1. Your product documentation.** If you have a product one-pager, a feature list, or a FAQ your customers ask, upload it to the Project. Claude will reference it when helping with customer questions — instead of giving generic answers, it will give answers specific to your product.

**2. Sample communications.** Upload 5-10 examples of good emails, messages, or responses your team has sent. Claude learns your team's voice from examples far better than from descriptions.

**3. FAQ or objection handling.** If your team deals with the same 10 customer questions regularly, document them with your preferred responses. Claude will use these as a starting point rather than generating something from scratch.

## Running a team setup session

The fastest way to get everyone configured is a 30-minute team session:

**Before the session:**
- Finalize the shared system prompt document
- Set up your own Project so you can demo it live

**During the session (30 min):**
- 5 min: Show the problem — demo Claude giving a generic response without context
- 5 min: Show the solution — demo Claude with the shared system prompt giving a good response
- 10 min: Each person sets up their own Project with your template
- 10 min: Each person tests it on a real task they have right now

The live test at the end matters. If someone gets a useful result in the session, they will keep using it. If they leave the session with a configured Project they have never actually tested, most will not remember to try it later.

## Tracking whether it is working

Two weeks after setup, do a quick check-in. For each team member, ask:
- How often have you opened your Claude Project this week?
- What has worked well?
- What has given you bad results?

The bad results are more useful than the good ones. Bad results are usually a signal that the shared system prompt is missing context or has a wrong assumption. Collect the patterns and update the template. After one round of updates based on real usage, the system prompt will be significantly more accurate.

This is how you turn a template into a tool the team actually uses.

---

*For the individual setup process, [the new employee guide](/articles/first-week-with-claude) walks through setting up a personal Project from scratch. For org-wide admin configuration (managing users, setting policies, deploying connectors), [the admin setup guide](/articles/claude-admin-setup) is the right starting point. For measuring whether the rollout is working, [the ROI measurement guide](/articles/measuring-ai-roi) covers the metrics that matter.*`,
  },
]

async function seed() {
  console.log('Seeding batch 49...\n')

  for (const article of ARTICLES) {
    const term = await getTermId(article.termSlug)
    if (!term) {
      console.error(`  Term not found: ${article.termSlug} (for ${article.slug})`)
      continue
    }

    const { error } = await sb.from('articles').upsert({
      slug: article.slug,
      term_id: term.id,
      term_name: term.name,
      term_slug: article.termSlug,
      cluster: article.cluster,
      title: article.title,
      angle: article.angle,
      body: article.body.trim(),
      excerpt: article.excerpt,
      read_time: article.readTime,
      tier: 2,
      published: true,
    }, { onConflict: 'slug' })

    if (error) {
      console.error(`  ${article.slug}:`, error.message)
    } else {
      console.log(`  ${article.slug} — seeded`)
    }
  }

  console.log('\nDone.')
}

seed().then(() => process.exit(0))
