/**
 * Batch 51 — Pricing Claude consulting/setup work
 * 1. pricing-claude-consulting-work — Sofia's open question:
 *    "How do I price Claude setup work?" Hourly vs. fixed vs. retainer,
 *    scope definition, and the ongoing maintenance commercial model.
 *    For consultants and agencies building Claude setup as a service.
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-51.ts
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
    termSlug: 'claude-plans',
    slug: 'pricing-claude-consulting-work',
    angle: 'process',
    title: 'How to price Claude setup work as a consultant or agency',
    excerpt: "You are delivering faster with Claude and charging the same. That's a positioning problem, not a delivery problem. Here is how to price Claude setup as a productized service — including the retainer model that creates recurring revenue.",
    readTime: 6,
    cluster: 'Business Strategy & ROI',
    body: `If you use Claude to do consulting or agency work faster, and you are not changing how you price that work, you are effectively giving away the productivity gain. This is the most common mistake consultants and agencies make when they integrate AI into their practice.

There is a better model — but it requires reframing what you are selling.

## The reframing: you are not selling hours, you are selling outcomes

When you use Claude to draft a strategy deck faster, the value is not "how many hours it took" — the value is the outcome: a clear, well-structured strategy your client can act on. The hours are your business. The outcome is theirs.

This is not a new idea in consulting. The problem is that Claude makes the discrepancy more visible: a task that used to take 6 hours now takes 2, and if you are billing hourly, you either bill 2 hours (and earn less) or bill 6 hours (and lie about it). Neither feels good.

The solution is to price outcomes, not hours. Package your work into fixed-price deliverables — "a full brand voice system," "a 90-day content strategy," "a Claude workspace setup for your CS team" — where the fee reflects the value to the client, not your production time.

## What a Claude setup engagement looks like

When you are selling Claude setup as a standalone service, the typical scope includes:

**Discovery (1-2 hours):**
- Understand the client's workflows, existing tools, and team structure
- Identify 2-3 use cases that will have the highest immediate impact
- Understand their data sensitivity constraints (what can and cannot go into Claude)

**Configuration (2-4 hours):**
- Set up one or more Claude Projects with role-specific system prompts
- Upload reference materials (product docs, communication guidelines, sample outputs)
- Configure connectors if applicable (Salesforce, HubSpot, Slack, Google Drive)
- Test and iterate the system prompts against real use cases

**Handoff (1-2 hours):**
- Create a one-page summary: what is set up, what each thing does, how to maintain it
- Train the primary user(s) — live or recorded walkthrough
- Document the system prompt rationale so they can update it themselves

Total delivery time: 4-8 hours. For a specialist who has done this before, the lower end. For a first engagement, the higher end.

## Pricing models

**Fixed project fee:** Charge a flat fee for the setup engagement. This works well when the scope is well-defined and you have done it before. A reasonable range for a single-role, single-team Claude setup (one workspace, 2-4 Projects, one team walkthrough) is £600-1,500 / $800-2,000 depending on your market, your client's size, and how much connector work is involved.

The fixed fee model rewards your efficiency — if you deliver it in 3 hours instead of 6, you earn more per hour, not less.

**Retainer:** Charge a monthly fee for ongoing configuration management and support. This is the model that creates recurring revenue and solves the "setup doesn't survive contact with the client" problem.

What a Claude maintenance retainer includes:
- One monthly check-in call to review what is and is not working
- System prompt updates as the client's business or context changes
- Adding new reference materials as they become available
- Connector configuration updates if tools change
- Answering "how do I do X with Claude?" questions as they come up

A reasonable range for a maintenance retainer: £150-400 / $200-600 per month depending on how actively the client's setup needs updating. A stable client with a mature setup needs less; a fast-growing client adding new tools and use cases needs more.

**Value-based pricing:** For larger engagements (multiple departments, enterprise rollouts, training programs), price based on the business impact rather than the setup work. If you are deploying Claude to a 20-person CS team and the measurable benefit is 2 hours/person/week reclaimed, that is 40 hours per week — price the engagement relative to that value, not relative to your configuration time.

## The "AI makes you faster so why are you charging more?" objection

You will hear this. The answer:

"Yes, I use AI tools to deliver this work faster. That means you get results faster and with fewer back-and-forth iterations. The fee reflects what you are getting — a configured system your team will actually use — not how long it takes me to build it. If I spent twice as many hours manually doing the same thing, it would not be worth more to you."

This is true. Lean into it. The alternative — hiding that you use Claude or apologizing for it — is worse positioning, not better.

## The non-developer client case

If your client does not have developers and never will — the system you set up has to survive without technical support. This changes the scope:

**Simplify the setup.** Avoid connector configurations that require OAuth maintenance or API credentials that can expire. Use the built-in Claude web interface features (Projects, file upload) rather than anything requiring code.

**Document for non-technical maintenance.** Your handoff document should be written for someone who does not know what a system prompt is. "This is the instructions you gave Claude about your company. To update it, click Projects > [project name] > Instructions and change [specific section]." That level of specificity.

**Build the maintenance retainer in from the start.** Non-developer clients have no technical staff to maintain their Claude setup. A maintenance retainer is not optional — it is a necessary part of ensuring the setup remains useful. Price it accordingly, and make it part of your standard proposal rather than an add-on.

**What to charge non-developer maintenance:** Slightly higher than technical clients because the configuration needs more active management (they cannot self-serve updates). £200-500 / $250-650 per month is reasonable.

## The conversation that creates the retainer

In your setup engagement, you will inevitably notice that the client's context changes regularly: they launch new products, update their positioning, shift their focus. Document this explicitly in your handoff:

"The system prompt we've set up reflects your current context — Q2 priorities, your current pricing, your current customer profile. When these change, the system prompt needs to change too. That's what the maintenance retainer covers."

This is not a sales pitch — it is a genuine constraint. Most clients will have noticed during the engagement that the system prompt needed updates every time the context changed. You are naming the pattern they already observed.

---

*For the client handoff document format, [client handoff with Claude](/articles/client-handoff-with-claude) covers what to document and how to structure it. For setting up Claude projects for agency and client work, [the Claude Code client setup guide](/articles/claude-code-client-setup) covers the developer side. For what to tell clients about AI in general, [see the client communications guide](/articles/what-to-tell-clients-about-ai).*`,
  },
]

async function seed() {
  console.log('Seeding batch 51...\n')

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
