/**
 * Batch 68 — AI Adoption Phases (foundational mental model)
 *
 * 1. ai-adoption-phases
 *    The six phases every company moves through as AI goes from individual tool
 *    to networked system. Phase 1: individuals. Phase 2: shared context (Team OS).
 *    Phase 3: connected knowledge (semantic layer). Phase 4: autonomous execution.
 *    Phase 5: self-optimizing. Phase 6: networked systems.
 *
 *    Foundational mental model article. Concrete examples throughout (sales, CS,
 *    support). Simple language. PINNED_OPERATOR candidate.
 *    Cluster: Business Strategy & ROI. Angle: process.
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-68.ts
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
    slug: 'ai-adoption-phases',
    angle: 'process',
    title: 'How Companies Actually Adopt AI: The Six Phases',
    excerpt: "Most companies think AI adoption is a switch you flip. It isn't. It's a progression — six distinct phases, each unlocking capabilities the last one couldn't. Here's what they are, what separates them, and which phase you're probably in.",
    readTime: 10,
    cluster: 'Business Strategy & ROI',
    audience: ['operator', 'leader'],
    termSlug: 'ai-adoption',
    body: `Most companies think of AI adoption as a binary: you're using it or you're not. But there's a reason some teams get dramatically more value from the same tools. AI adoption is a progression, not a switch. Each phase unlocks something the previous one couldn't.

Here are the six phases — what's happening in each, what changes from the one before, and why it matters.

---

## Phase 1: Individuals Using AI

Your team starts here. Someone tries Claude, drafts an email, gets a better result than expected. Someone else discovers it independently a week later. Word spreads through Slack. Enthusiasm runs ahead of structure.

**What's happening:** AI is a personal productivity tool. One person uses it for writing. Another uses it for research. Another for code. Each person figures out what works for them on their own.

**What changes:** Before this phase, you had only human cognitive capacity at the desk. Now you've added a thought partner that can scale one person's thinking — but there's no shared approach. Each person rediscovers what works independently.

**Why it matters:** This is where intuition forms. People learn by doing, not by being told about it. Your team builds confidence and surface-level patterns that will matter later.

The trap: best practices stay private. Three people independently figure out the same technique on three different days. You're buying speed for individuals without compounding it for the team.

---

## Phase 2: Structured Context Layer (Building a Team OS)

Someone notices a pattern: asking Claude the same question works much better with context. The sales team writes down how they think about deals. Support documents their decision trees. A product manager creates a template for feature briefs.

This is the transition from "AI as tool" to "AI as team member." You're building what some people call a Team OS — a shared set of frameworks that give AI the context it needs to do *your* work, not generic work.

**What's happening:** Your team starts capturing how you actually think — customer segments, deal stages, escalation criteria, what "a good answer" looks like in your context. The AI gets access to your institutional knowledge, not just general knowledge about the world.

Think of it this way: Claude is capable, but it doesn't know your business. It doesn't know that your enterprise deals take four times longer to close, or that your support team escalates any ticket mentioning "downtime," or that your product team treats competitive mentions as signals to investigate. When you give it that context explicitly, its advice shifts from helpful to specifically useful.

**What changes:** Tool use becomes collective. Instead of each person improvising from scratch, the team operates from shared frameworks. The AI starts serving the team, not just the individual.

**Why it matters:** This is where AI moves from "nice shortcut" to "competitive advantage." Your team executes faster and more consistently because the AI understands your actual business logic — not just general knowledge.

**Example:** A sales rep no longer explains their deal structure to Claude every time. The context is already there: "This is an enterprise deal with a 90-day cycle, two competing vendors, and a legal review gate before sign-off." The rep asks a specific question and gets advice that fits their situation — not advice from first principles.

---

## Phase 3: Knowledge Graph (Connected Meaning)

At some point, your captured context becomes dense enough that you notice something: ideas connect to each other.

You don't just have "customer segments" — you understand how those segments relate to sales velocity, which relates to deal structure, which relates to support load. You don't just have "common objections" — you see how product gaps surface in specific customer profiles, which surfaces in support tickets, which surfaces in renewal risk.

Phase 2 is a well-organized filing cabinet. Phase 3 is realizing those files reference each other — and you start tracking those references.

**What's happening:** Your structured context becomes relational. Concepts link to other concepts. A question like "how do we accelerate deal closure?" doesn't just trigger a lookup — it walks a path: longer cycles require executive buy-in, executive buy-in requires different messaging, different messaging changes the timeline. The system synthesizes across connections.

**What changes:** From lookup to reasoning. A question now triggers a path through connected ideas, not just a retrieval. Your operations become more *legible* — you can see how decisions in one area ripple into others.

**Why it matters:** Non-obvious insights start emerging. You spot patterns that span multiple domains you didn't realize were connected. The system can answer questions that didn't have clean answers before because the answer was spread across your business.

**Example:** You ask: "Why do some customers renew and others churn?" The system walks the connections: retention correlates with early onboarding completion, which correlates with product adoption in the first 30 days, which correlates with which features the customer discovered first. The insight — adjust your default settings to surface retention-critical features early — came from connections, not from static data.

---

## Phase 4: System of Action (AI Executes)

Now your system doesn't just inform. It acts.

An inbound support ticket arrives. The system knows this customer's history from Phase 3's connected knowledge. It knows your support process from Phase 2's structure. It decides: escalate to a specialist, draft a response, or create a follow-up task. And it does it — without a human in the middle.

**What's happening:** AI moves from "here's my advice" to "I'm handling this." Workflows start executing autonomously, guided by the context and connections you've built.

**What changes:** You've removed the human-as-intermediary step. Before this phase, AI could inform your decision. Now it makes and executes the decision. Your team's time shifts from routine execution to judgment calls — the ones that actually require a human.

**Why it matters:** This is where AI adoption moves from productivity tool to process multiplier. You're not adding hours to people's days — you're adding capacity. Your customer success manager doesn't manually review every renewal. The system handles the ones where the decision is clear. The manager focuses on accounts where judgment actually matters.

**Example:** A customer approaching their renewal date triggers the system. It checks their usage (down 30% over the past two months — a risk signal). It cross-references their open support tickets (two unresolved). It routes a high-priority flag to the CSM with a pre-drafted note: "Risk signals present. Recommend proactive call before the renewal window." The CSM didn't initiate this. The system did — and it was right.

---

## Phase 5: Self-Optimizing System (Learning from Outcomes)

Your system starts to learn from what it does.

It executes actions in Phase 4. Some work. Some don't. It measures outcomes: did the support escalation resolve the issue faster? Did the proactive renewal call prevent churn? It notices patterns. The playbook isn't static anymore — it improves based on what actually works.

**What's happening:** You've built a feedback loop. Action → measurement → learning → refinement. Your processes improve based on real outcomes, not based on quarterly planning meetings where people debate what should work.

**What changes:** From executing fixed logic to refining it. Your sales playbook doesn't permanently say "always emphasize ROI" — it learns that ROI messaging works for mid-market but enterprise buyers care more about reducing organizational risk. It learns by observing outcomes, not by being manually updated.

**Why it matters:** Advantages start compounding. The system improves itself. You stop needing to manually update your playbooks because the system does it. The longer you run it, the better it gets — which means your competitors who started later stay behind, not just at the same distance.

**Example:** Your support system learns that Friday tickets in certain categories take 40% longer to resolve — a staffing pattern signal. It learns that customers who complete two onboarding videos in week one renew at twice the rate. It adjusts its behavior automatically: video completion becomes a tracked health signal, follow-up triggers shift accordingly. No one had to spot this pattern manually. The system did.

---

## Phase 6: Networked Systems (Coordination Across Boundaries)

Your system now coordinates with other systems — inside and eventually outside your company.

Within your company first: your sales system shares signals with your support system, which shares signals with your product system. A pattern your CS team discovers about a customer segment automatically informs how sales approaches that same segment. One team's learning benefits the whole organization.

At the ecosystem level — which is still early but the direction is clear — industry systems start coordinating. Supply chains where one manufacturer's demand signal updates a supplier's production schedule automatically. Fraud detection networks where a pattern identified by one financial institution is shared anonymously across others. Compliance systems that learn from every member of a regulatory consortium.

**What's happening:** Individual systems become nodes in a larger network. Learning doesn't stay local. Decisions made by one part of the system trigger coordinated responses across many.

**What changes:** From optimizing within your company to optimizing across boundaries. The unit of improvement is no longer the team or the department — it's the network.

**Why it matters:** This is where AI adoption becomes structural. The advantages stop being about individual tools or even individual companies. They're about which networks you're part of and how much accumulated learning those networks hold.

**Example:** Three fintech companies in the same investor portfolio — each running similar fraud detection systems — begin pooling fraud signal patterns anonymously. No customer data is shared. But the pattern library compounds. A fraud vector that Company A detects on Monday is flagged for B and C by Tuesday. Each company's system gets smarter faster than it could alone.

---

## Why This Matters

Most companies are stuck between Phases 1 and 2. People are using AI, but there's no structural context. The AI is capable but blind — it doesn't know your business. That gap is where most of the value is being left on the table.

But here's what matters more than the phases themselves: each one requires not just better tools, but clearer thinking about your work. Phase 2 requires you to actually articulate your decision logic — which most teams have never done explicitly. Phase 3 requires you to see how your business connects. Phase 4 requires you to trust systems with real decisions. Phase 5 requires you to measure what actually matters. Phase 6 requires coordination across competitive boundaries.

Companies that move through these phases do it by building better frameworks for how they work — and then giving those frameworks to their systems. The AI follows the structure you create. The question isn't whether your tools are good enough. The question is whether your thinking is structured enough.

You also can't skip phases. You can't have a self-optimizing system without first building one that executes autonomously. You can't execute autonomously without structured context. Each phase enables the next one. The progression is sequential.

---

## The Six Phases at a Glance

\`\`\`
Phase 1 — Individuals discover what AI can do        (personal)
    ↓
Phase 2 — Context gets captured and shared           (collective)
    ↓
Phase 3 — Captured knowledge connects across domains (relational)
    ↓
Phase 4 — The system takes action, not just advice   (autonomous)
    ↓
Phase 5 — The system learns from outcomes            (adaptive)
    ↓
Phase 6 — Systems coordinate across the network      (networked)
\`\`\`

Each phase multiplies the value of the previous one. Most companies are at Phase 1. A few disciplined ones are at Phase 2. Phase 3 and beyond is where compounding begins.

The first question worth asking: what phase is your team actually in right now? And what's specifically blocking the next one?

---

## Further reading

- [Running your first AI pilot](/articles/running-your-first-ai-pilot) — practical guide for moving from Phase 1 to Phase 2
- [Rolling out Claude across teams](/articles/rolling-out-claude-across-teams) — how to structure the Phase 2 context layer at team scale
- [The adoption plateau](/articles/claude-adoption-plateau) — why teams get stuck between phases and how to get unstuck
- [Building a business case for Claude](/articles/building-a-business-case-for-claude) — making the case for investing in structured adoption`,
  },
]

async function seed() {
  console.log('Seeding Batch 68 — AI Adoption Phases...\n')

  for (const a of articles) {
    const term = await getTermId(a.termSlug)
    if (!term) {
      console.error(`  ✗ Term not found: ${a.termSlug}`)
      continue
    }

    const payload = {
      slug:      a.slug,
      angle:     a.angle,
      title:     a.title,
      excerpt:   a.excerpt,
      body:      a.body,
      read_time: a.readTime,
      cluster:   a.cluster,
      term_id:   term.id,
      term_name: term.name,
      term_slug: a.termSlug,
      published: true,
    }

    const { error } = await sb.from('articles').upsert(payload, { onConflict: 'slug' })

    if (error) {
      console.error(`  ✗ ${a.slug}: ${error.message}`)
    } else {
      console.log(`  ✓ ${a.slug}`)
    }
  }

  console.log('\nDone.')
}

seed().catch(console.error)
