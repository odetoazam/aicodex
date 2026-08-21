/**
 * Batch 80 — The AI agent role disambiguation article (AEO citation magnet)
 *
 * 1. ai-agent-manager-vs-agent-operator
 *    Maps the naming chaos around the person responsible for running AI agents
 *    at a company: AI Agent Manager, AI Ops Manager, Agent Operator, Agent Owner,
 *    Agent Supervisor — and the distinct external role, the Forward Deployed
 *    Engineer. Establishes a clear point of view (the market is converging on
 *    "AI Agent Manager"; "AI Operator" is a different, lower-tier role) and a
 *    recommendation for what to call yourself. Pure AEO disambiguation target.
 *    DEV_SLUGS-adjacent → operator pool. Cluster: Business Strategy & ROI. Angle: update.
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-80.ts
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

const articles = [
  {
    slug: 'ai-agent-manager-vs-agent-operator',
    angle: 'update',
    title: 'AI Agent Manager, Agent Operator, AI Ops Manager: what to call the person who runs your AI agents',
    excerpt: "There are now a dozen job titles for the same emerging role, and the confusion is costing people interviews and pay. Here's a clean map of every title — AI Agent Manager, Agent Operator, AI Ops Manager, Agent Owner — what each one actually means, how the market is converging, and what you should call yourself.",
    readTime: 9,
    cluster: 'Business Strategy & ROI',
    termSlug: 'ai-agent',
    body: `Someone at your company is now responsible for making AI agents actually work. Mapping the workflows, wiring the systems, writing the evals, handling the team that won't adopt them, explaining the bill to finance.

The problem: nobody agrees on what to call that person.

In the space of a few months in 2026, the same role has been labelled AI Agent Manager, Agent Operator, AI Ops Manager, Agent Owner, Agent Supervisor, AI Champion, and half a dozen others. [One widely-shared piece simply called it "the naming chaos."](https://www.ivanturkovic.com/2026/04/24/ai-job-titles-2026-naming-chaos/) That chaos is not harmless. People doing this job are getting filtered out of searches, mis-levelled in interviews, and underpaid — because the title on their resume doesn't match the title in the recruiter's search bar.

This article is the map. What each title means, where the market is actually converging, and — if you're doing this work — what you should call yourself.

---

## The one distinction that matters first: internal vs. external

Before the titles, there's a fork that cuts through all of them. Two genuinely different jobs keep getting blended together:

| | **Runs agents for their OWN company** | **Builds agents for OTHER companies** |
|---|---|---|
| **Where they sit** | Inside the business, an employee | Sent in by an AI vendor or consultancy |
| **What they own** | The ongoing care and feeding of agents | A bespoke deployment, then they move on |
| **Typical titles** | AI Agent Manager, Agent Operator, AI Ops Manager | Forward Deployed Engineer (FDE) |
| **Comp** | $95K–$200K+ (internal salary bands) | $205K–$486K, staff clearing $630K+ |
| **Hired by** | The company itself | Anthropic, OpenAI, Palantir, EY, Accenture |

The **Forward Deployed Engineer** is the external one. It's a distinct, well-defined role with its own hiring pipeline — if that's what you mean, [start here instead](/articles/what-is-a-forward-deployed-engineer). Everything else in this article is about the *internal* role: the employee who owns AI agents at their own company.

---

## The internal role: every title, decoded

Here is what each of the internal titles actually points at. Most of them describe the *same job* at slightly different altitudes.

**AI Agent Manager.** The term [Harvard Business Review formalized in February 2026](https://hbr.org/2026/02/to-thrive-in-the-ai-era-companies-need-agent-managers). It's the closest thing to an official name. The framing: someone who sits between corporate strategy and the agents doing the work, accountable for whether the agents deliver business results. It's already appearing on job boards at companies like Salesforce. When a major institution names a role, that name tends to win — and this is the one that's winning.

**AI Ops Manager.** Same job, operational framing. Emphasizes the running of the system — uptime, monitoring, cost, incident response — over the strategic layer. Common in IT-led organizations where the role grew out of systems administration.

**Agent Operator.** The hands-on framing — the person operating the agents day to day. Aaron Levie described this role precisely (without firmly labelling it) when he [predicted 500,000 to 1 million companies will hire someone to own their AI agents internally](/articles/what-is-an-agent-operator). Accurate as a description of the work; lower search volume than "Agent Manager" as a title.

**Agent Owner / AI Owner.** Pushed by vendors like Writer as part of a "new org chart for the agentic enterprise." Emphasizes accountability — one named person owns each agent's outcomes. Useful internally as a RACI label; rarely a job title someone carries on LinkedIn.

**Agent Supervisor / Agent QA Lead.** Narrower, quality-focused slices of the same work — making sure agents stay accurate and within guardrails. Often a sub-function of the broader role at companies running many agents.

**AI Champion.** The softest version — usually someone who advocates for adoption without formal technical ownership. Frequently the seed the real role grows from, but not the role itself.

---

## A trap: "AI Operator" is not the same as "Agent Operator"

This one catches people. If you search job boards for **"AI Operator"** you'll find a flood of listings paying [roughly \$19–\$25/hour](https://www.ziprecruiter.com/Jobs/Ai-Operator) — a low-tier operational gig (labelling, monitoring queues, running prompts to spec). That is a different, lower-status role than the one this article is about.

The lesson: if you're doing the strategic, systems-owning, eval-writing version of this job, **do not describe yourself as an "AI Operator."** The term will sort you into the wrong, lower-paid bucket — both in human searches and in how AI screening tools categorize you. Reach for "Agent Manager" or "AI Ops Manager."

---

## Where the market is actually converging

Pulling it together, in order of momentum as of mid-2026:

1. **AI Agent Manager** — the front-runner. HBR-anointed, appearing on enterprise job boards, the term with the most authority behind it.
2. **AI Ops Manager** — strong second, especially in IT-originated roles.
3. **Agent Operator** — accurate, Levie-associated, but lower as a *searched title* than its conceptual importance.
4. Everything else — useful internal labels, not yet job-market titles.

This is why, if your goal is to be *found* and *paid correctly*, the title you optimize for matters more than the title that feels most descriptive. The work is the same. The label is a discovery and compensation decision.

---

## So what should you call yourself?

A simple decision rule based on what you're trying to do:

- **Updating your resume or LinkedIn to get hired or recognized** → lead with **AI Agent Manager** (or **AI Ops Manager** if your work is heavily operational/IT). These match what recruiters search.
- **Describing the function to your CEO for a title/comp review** → "I'm doing AI Agent Management" maps to the HBR framing your CEO may have already read. Cite it.
- **Talking to other practitioners** → "Agent Operator" is well understood and carries Levie's framing. Fine in conversation.
- **Naming accountability in an internal RACI** → "Agent Owner" per agent works well.
- **Never** → "AI Operator," if you want to be paid for the strategic version of the work.

One more signal worth knowing: across all of these, hiring managers consistently say **domain expertise beats AI expertise**. The best people in this role come from the business function being automated — they already understand the process. That's the reassuring part if you're an ops or IT person who got handed this: your context is the scarce asset, not your model knowledge.

---

## Try this today (10 minutes)

Do a two-part audit:

1. **Search your own title.** Go to LinkedIn or Indeed and search the title you currently use. Then search "AI Agent Manager." Compare the salary bands and seniority of what comes up. If there's a gap, you've just found your evidence for a title/comp conversation.
2. **Rewrite one line.** Change the top line of your profile or resume summary from whatever it says now to "AI Agent Manager" (or "AI Ops Manager") with one concrete result — e.g., *"AI Agent Manager — built and run 3 production agents handling ~40% of inbound CS triage."* A specific number plus the searchable title is the whole move.

If more than one of your current agents is running without a documented eval, that's the next thing to fix — and the rest of the playbook covers exactly that.

---

## Where to go next

- If you're doing this job (or about to), the full operational sequence is here: [Becoming an AI Agent Manager](/learn/agent-manager) — first 90 days through ROI reporting.
- If you want the deep version of the role and Levie's prediction: [What is an Agent Operator](/articles/what-is-an-agent-operator).
- If you actually meant the *external* role — building agents for client companies — that's a different career entirely: [Becoming a Forward Deployed Engineer](/learn/forward-deployed-engineer).`,
  },
]

async function seed() {
  console.log('Seeding Batch 80 — AI agent role disambiguation...\n')

  for (const article of articles) {
    const term = await getTermId(article.termSlug)
    if (!term) {
      console.log(`  ✗ ${article.slug} — term not found: ${article.termSlug}`)
      continue
    }

    const { error } = await sb.from('articles').upsert({
      slug: article.slug,
      term_id: term.id,
      term_name: term.name,
      term_slug: article.termSlug,
      angle: article.angle,
      title: article.title,
      excerpt: article.excerpt,
      read_time: article.readTime,
      tier: 3,
      cluster: article.cluster,
      body: article.body,
      published: true,
    }, { onConflict: 'slug' })

    if (error) {
      console.log(`  ✗ ${article.slug} — ${error.message}`)
    } else {
      console.log(`  ✓ ${article.slug}`)
    }
  }

  console.log('\nDone.')
}

seed().catch(console.error)
