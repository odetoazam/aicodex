/**
 * Batch 38 — Day in the life: ops manager
 * ops-manager-ai-workflow
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-38.ts
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
    slug: 'ops-manager-ai-workflow',
    angle: 'field-note',
    title: "What using Claude actually looks like for an ops manager",
    excerpt: "Operations work is mostly translation: turning messy reality into clear documentation, turning vendor conversations into decisions, turning incidents into processes. Here is where Claude actually fits.",
    readTime: 7,
    cluster: 'Role Workflows',
    body: `Operations work is mostly translation. You take messy reality — a process nobody documented, a vendor who keeps dropping the ball, an incident that happened twice in three months — and turn it into something clear, actionable, and written down.

That is exactly the kind of work Claude compresses. Not by thinking for you, but by getting the documentation onto the page faster, the vendor email written before you talk yourself out of sending it, and the post-mortem finished before everyone forgets what actually happened.

Here is where it shows up in a real ops week.

## SOPs: closing the documentation gap

Every ops team has a documentation gap. The processes that actually run the business are in people's heads, in Slack threads, or in a Google Doc that was last updated eighteen months ago. Everyone knows the gap exists. Nobody has time to close it.

This is the most consistent use case for ops managers using Claude: turning a 20-minute conversation into a clean SOP draft the same day.

The workflow: after any process walkthrough, take your notes (or even a rough voice memo transcript) and paste them with a simple request — *"Here are notes from a walkthrough of our vendor onboarding process. Turn this into a step-by-step SOP with clear owner roles for each step."* What comes back is not perfect, but it is 80% of the way there. Fifteen minutes of editing beats two hours of writing from scratch.

The key habit: do this immediately after the conversation, while the context is fresh. The longer you wait, the more time the draft will take to write because you will have to reconstruct what was said.

## Vendor communications: the email you kept not sending

Ops managers carry a persistent queue of vendor conversations they need to have but keep putting off. A contract renewal that needs to be renegotiated. A performance issue that needs to be documented before it escalates. A follow-up to a meeting where nothing was agreed and something needs to be.

The friction is not knowing what to say. It is that writing the email feels like a bigger task than the message itself deserves — so it stays in the queue.

The workflow: describe the situation in plain terms and ask Claude to draft the email. *"Our fulfillment vendor missed four delivery SLAs last month. I need to send them a formal notice that documents this and requests a remediation plan within two weeks."* The draft gives you something to react to, which is faster than writing from nothing. You edit it into your voice, add the specifics, and send it the same day instead of the same week.

This is not about getting Claude to write your communications for you. It is about removing the blank-page friction from messages you were already going to write.

## Incident response: turning chaos into process

When something breaks — a process failure, a vendor incident, a compliance near-miss — the ops response is to document what happened, figure out why, and build a fix. In practice, the incident gets handled, a rough Slack thread exists, and the post-mortem never quite gets written.

Claude is most useful here in the 48-hour window after an incident, while memory is fresh.

The workflow: paste the Slack thread, the timeline of events, and any notes into a conversation and ask: *"Here is what happened during our warehouse receiving system outage on Tuesday. Draft a post-mortem with: what happened, root cause, what we did to fix it, and what process change would prevent it."* The structure forces completeness. What you produce in 30 minutes would otherwise take a week and a half meeting to produce.

One note before you do this: if your incident involves sensitive data, customer PII, or confidential vendor details, check your organization's Claude data policy first. For most companies on a paid Claude plan, conversations are not used for training and are handled under enterprise data terms — but it's worth knowing what your firm's policy says before pasting internal communications.

The secondary use: before you close out an incident response, ask Claude whether there are standard post-mortem sections you have not covered. Root cause without contributing factors. Fix without monitoring change. Next step without someone's name on it. It catches the gaps before your head of ops asks about them.

## Process improvement: the analysis you kept deferring

Operations work generates data — ticket volumes, cycle times, error rates, vendor SLAs — but analysis is the thing that keeps getting pushed to next quarter. Not because it is hard, but because getting from raw data to a useful recommendation requires a clear head and uninterrupted time, both of which are rare.

The workflow: export the relevant data (a table of vendor SLA performance, a ticket resolution time summary, a backlog of incident counts by category) and paste it with a specific question. *"Here is our vendor SLA performance for the last six months. Which vendors are trending worse, not just low overall? What would you flag for the next contract review?"* You get a starting point for the analysis conversation instead of having to build the frame from scratch.

What Claude does not do is know your context: which vendor relationships are strategically important, what the actual switching costs are, what you know about why the numbers are what they are. That judgment is yours. Claude gets you to the analysis faster, not to the decision.

## The context problem: why one Project changes everything

The thing that makes Claude genuinely useful for ops work — rather than occasionally useful — is having it know your context without being told every time.

A Project with a system prompt covering: what the company does, what your team owns, the key vendors and internal stakeholders, and any standing constraints (regulatory, budget, tone) — this is the difference between a tool you use when you remember to and a tool that is actually part of your workflow.

For ops managers specifically, useful context to include: the business model in one sentence (so Claude understands what "operations" means for your company), the systems you own (which directly affects what advice is relevant), and any compliance context that changes how you communicate externally.

You spend five minutes setting this up once and it compounds across every conversation.

## The two things it does not replace

Claude does not replace the trust that makes ops work possible. Your ability to get things done depends on relationships — with the vendor who picks up your call, the department head who flags problems early, the direct report who tells you what is actually going wrong. None of that compresses.

And Claude does not replace judgment about what to prioritize. The documentation gap is real, but not all documentation is equally important. The vendor email needs to go out, but not all vendor friction needs to be escalated. Deciding what matters is your job, and it is the job Claude cannot do.

The ops managers getting the most from it are clear about this: Claude handles the translation work — notes into SOPs, situations into communications, incidents into processes — and they handle the judgment. That is the right split.

---

*If your day is less about process and more about managing a customer-facing team, the pattern looks different. The [CS manager workflow](/articles/cs-manager-ai-workflow) covers the same week-in-the-life angle for customer success specifically.*`,
  },

]

async function seed() {
  console.log('Seeding batch 38...\n')

  for (const article of ARTICLES) {
    const term = await getTermId(article.termSlug)
    if (!term) {
      console.error(`  ✗ Term not found: ${article.termSlug} (for ${article.slug})`)
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
      console.error(`  ✗ ${article.slug}:`, error.message)
    } else {
      console.log(`  ✓ ${article.slug}`)
    }
  }

  console.log('\nDone.')
}

seed().then(() => process.exit(0))
