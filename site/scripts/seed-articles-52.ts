/**
 * Batch 52 — Org dynamics articles (Priya–James arc + enterprise adoption)
 *
 * 1. getting-it-approval-for-claude — For the CS manager, team lead, or department head
 *    trying to get IT/security to sign off on Claude. Written from Priya's perspective;
 *    gives her what James (IT Director) actually needs to say yes.
 *
 * 2. claude-adoption-plateau — The month-4 problem. Why AI adoption falls off 90 days
 *    in, what causes it, and how to restart it. The article every enterprise operator
 *    needs and nobody has written.
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-52.ts
 */

import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function getTermId(slug: string): Promise<{ id: string; name: string } | null> {
  const { data } = await sb.from('terms').select('id, name').eq('slug', slug).single()
  return data ?? null
}

const ARTICLES = [
  {
    termSlug: 'claude-plans',
    slug: 'getting-it-approval-for-claude',
    cluster: 'Business Strategy & ROI',
    angle: 'process',
    title: 'How to get IT to approve your Claude rollout',
    excerpt: "IT isn't the enemy of your Claude rollout — they're the ally you haven't briefed yet. Here's exactly what IT needs to see before they can say yes, and how to give it to them without triggering a six-month procurement cycle.",
    readTime: 8,
    body: `
You want to roll out Claude to your team. You know it would save time, improve quality, and make your team more capable. You've already used it yourself. It works.

Then IT gets involved — and the timeline stretches, the questions multiply, and the rollout that should have taken two weeks is now in a review cycle with no clear end date.

This is not an IT failure. It's a briefing failure. IT directors like James aren't trying to slow you down. They're trying not to be the person who approved the tool that caused a data incident six months later. Give them what they need to say yes, and they'll say yes.

Here's exactly how to do that.

## What IT is actually worried about

IT's concerns aren't about AI in general — they're about three specific risks:

**1. Data handling.** Where does the data go? Does Anthropic train on your company's inputs? Can employees accidentally upload confidential customer data, and if so, what happens to it?

**2. Access and authentication.** Who in the organization has access? How are accounts provisioned and deprovisioned? If an employee leaves, does their Claude access get revoked automatically through your SSO, or does someone have to remember to manually disable it?

**3. Policy and governance.** Is there a usage policy? Who's responsible for it? What happens when someone misuses it?

These are reasonable concerns. The mistake most people make is trying to answer them in a hallway conversation. Answer them in writing, in advance, in a format IT can file.

## The security answers IT needs

Before you send anything to IT, know these answers cold.

**On data training:** Anthropic does not use inputs and outputs from Claude API or Claude for Work (formerly Team/Enterprise plans) to train models. This is documented in Anthropic's data usage policy. Usage from free or Pro personal plans may be used for training if opted in, but those are personal accounts — not what you're deploying.

**On data retention:** By default, Anthropic retains conversation data for a period defined in their privacy policy (check the current policy for exact windows, which have changed). Enterprise contracts can negotiate zero retention.

**On data residency:** Anthropic processes data in the US. If your organization has EU data residency requirements, this needs to be addressed in the contract, not in the tool evaluation.

**On confidential data:** If employees are uploading customer contracts, internal financials, or regulated health data, your usage policy needs to address what's permitted. The tool itself doesn't know what's sensitive — that's a governance question, not a product question.

**On SSO:** Claude for Work supports SSO through SAML/OIDC. Admin-provisioned accounts can be managed centrally. Deprovisioning flows with your IdP (Okta, Azure AD, etc.) can be configured.

Print these answers out before your IT conversation. James will have heard most of these questions before and will be relieved you came prepared.

## The one-page IT brief

IT responds to documents, not conversations. Write a one-page brief — no more — with these five sections:

**1. What you're deploying**
"Claude for Work — Anthropic's business tier. Team plan for initial pilot with [N] users in [department]."

**2. Use cases**
"[Your team] will use Claude for [specific tasks: drafting customer communications, summarizing call notes, preparing quarterly reviews]. We will not use Claude to process [excluded data types]."

**3. Data handling**
Copy the relevant answers from the section above. Two to three bullet points.

**4. Access and governance**
"[Name] will administer the account. Provisioning/deprovisioning via [your IdP]. [Department] will operate under [usage policy link or attachment]."

**5. What you're asking for**
"Approval to deploy Claude for Work to [N] users in [department] for a 60-day pilot. We'll report back on [date] with usage data and any issues."

One page. If it's longer than one page, you're including things IT didn't ask for. Keep it short.

## The conversation you'll have

Most IT reviews have a standard path:

**They'll ask about security certification.** Anthropic holds SOC 2 Type II certification. If James asks, the answer is "yes, SOC 2 Type II, available on request."

**They'll ask about the vendor review process.** If your company has a formal vendor review (security questionnaire, privacy review), complete it. Don't try to skip it. Attempting to work around the process will create more friction than the process itself.

**They'll ask who's responsible.** Have a named person ready. "I'm the business owner. [IT contact] will be the technical point of contact for the account." Shared ownership makes IT feel better because there's a clear escalation path.

**They'll ask about the timeline.** Don't push for a 48-hour turnaround. Ask for a decision within two weeks, and offer to answer any outstanding questions within 24 hours. Giving IT room to do their job properly gets you a faster yes than pressuring them.

## The thing not to say

Don't say "it's just the web app, everyone can already use it personally." That's technically true but it signals to IT that you're trying to avoid governance, not work with it. The moment IT feels like someone is trying to route around them, the review gets harder.

What to say instead: "We want to do this the right way, under a managed account with proper governance. That's why I'm here."

## What to do before they say yes

Two things to prepare while the review is in progress:

**Draft the usage policy.** Even a simple one. "Employees may use Claude for [permitted uses]. Employees should not upload [restricted data types]. Questions go to [name]." This shows IT the governance piece is handled, not assumed.

**Identify your early adopters.** The people who will actually use the tool in the first month, who will troubleshoot it when it's confusing, and who will generate the usage data you'll bring back to IT at the 60-day mark. You need 3-5 people who are genuinely motivated, not 20 people who were told to try it.

## After IT says yes

When approval comes through, do three things:

1. Set up the admin account and provision your early adopters through SSO.
2. Send the usage policy to your team before they start — not after.
3. Schedule the 60-day check-in on James's calendar now. The check-in is what converts a pilot into a permanent deployment. Without it, approvals expire quietly.

The organizations that get fast IT approval and build lasting AI programs don't have more permissive IT teams — they come to the conversation better prepared.

---

*For the usage policy template, [see the AI usage policy template](/articles/ai-usage-policy-template). For what the full admin rollout looks like after approval, [the Claude admin zero-to-one guide](/articles/claude-admin-zero-to-one) covers the next steps.*`,
  },

  {
    termSlug: 'hallucination',
    slug: 'claude-adoption-plateau',
    cluster: 'Business Strategy & ROI',
    angle: 'failure',
    title: 'The month-4 problem: when Claude adoption quietly stops',
    excerpt: "Most teams who roll out Claude see strong early results and a quiet decline by month 4. It's not that Claude stopped working — it's that the rollout stopped. Here's what actually happened, and what to do about it.",
    readTime: 9,
    body: `
The rollout went well. Usage was up in the first month. People said positive things in the retrospective. Then, somewhere around month 3 or 4, you notice that the people who were enthusiastic at the start are now using it occasionally — and the people who were skeptical at the start have mostly gone back to their old workflows.

Nothing broke. Nobody complained. Claude is still available. The platform is still running. But the adoption curve peaked and is now declining.

This is the month-4 problem, and it is more common than almost any AI rollout article acknowledges. Vendors don't write about it. Consultants get paid for the launch, not the plateau. The people running the rollout often don't notice until the quarterly usage data comes in.

Understanding why it happens is the first step to preventing it — or reversing it if you're already there.

## Why it happens: the three causes

Every adoption plateau has one or more of these three root causes. They usually appear together.

**1. The use cases stopped expanding.**

In month 1, people tried Claude for the things they already knew they needed help with. Meeting notes, draft emails, quick summaries. These use cases worked well, delivered obvious value, and got adopted quickly.

By month 3, those workflows are habits. The people using them are still using them. But nobody is finding new use cases. The team hasn't discovered that Claude can help with QBRs, or with synthesizing customer feedback themes, or with drafting the FAQ for a new product launch.

New use cases don't emerge on their own. They emerge when someone deliberately looks for them, tries them, and shares the result. Without that deliberate process, use cases stagnate at "what we tried first."

**2. There's no community of practice.**

The early adopters got good at Claude and then got on with their work. They didn't document what they learned, share their best prompts, or run informal sessions with the people who were still figuring it out.

This matters because Claude has a learning curve that isn't obvious from the outside. The person who's been using it for 90 days is 3-4x more effective than the person who started 30 days ago — not because the newer person is less capable, but because they haven't had the same accumulation of small discoveries. "If you add context about who you're writing to, the output is much better." "If you give it the previous email thread, it doesn't make up tone." These things spread through conversation, not documentation.

When there's no community of practice, every new user has to rediscover everything from scratch. And the experienced users don't see it as their job to help.

**3. Nobody measured what changed.**

The rollout had a goal (usually: "improve productivity" or "save time"). But nobody defined what that would look like measured, and nobody tracked it.

At month 4, the IT Director asks "is this worth renewing?" and the honest answer is "we think so, but we can't show you numbers." That's a hard conversation. In the absence of evidence, decisions about renewal get made on intuition — and intuition favors the status quo.

This also affects the team itself. When people don't see evidence that the tool is making a difference, they underestimate its value. The habit weakens. Usage drops.

## What the plateau looks like

You're in a plateau when:

- **Usage is dominated by 20% of your team.** A small group of enthusiasts is responsible for most of the usage, while the rest of the team has quiet-quit the rollout.
- **Prompts are short and transactional.** People are using Claude for quick tasks, not longer-form work where it provides more leverage. The ceiling on what they ask it to do is getting lower, not higher.
- **Nobody has shared a "this saved me an hour" story in two months.** In the first month, these come up in conversation naturally. When they stop, it usually means usage has plateaued.
- **The early skeptics have drifted back.** They tried it, it didn't immediately solve their specific workflow problem, and they've returned to whatever they were doing before.

## What to do if you're already at the plateau

**Restart with a specific use case, not a general push.** A "please remember to use Claude more" message doesn't work because it's not actionable. A "we're going to spend the next 30 days using Claude specifically for [customer renewal prep / weekly reporting / onboarding new hires]" is actionable. Pick one use case, do it properly, measure it, share the result.

**Run a use case discovery session.** 60-minute meeting. Bring your early adopters and your non-users into the same room. Have the adopters demo their actual workflows. Ask the non-users: "what takes you the most time that you haven't figured out how to fix?" This surfaces new use cases from real problems and creates social proof simultaneously.

**Assign someone to surface prompts.** One person, whose informal job is to collect the prompts that worked well, write them up in plain English, and share them in your team's Slack every week. Not a full-time role — 30 minutes a week. The people who benefit most from this are the newer users who haven't built up the intuition yet.

**Create the evidence you should have been collecting.** It's not too late to define a baseline and start measuring from now. "This is what our renewal prep process looks like today. In 60 days we'll compare it." Even retrospective evidence ("I estimated we saved X hours in the past month on Y task") is better than no evidence.

## What to do before you hit the plateau (if you haven't yet)

Month 3 is the time to act. You've had enough time to see what's working. The early adopters have learned things the rest of the team hasn't. Do these three things before the plateau arrives:

**Run a "what we've learned so far" session at 6 weeks.** Bring everyone together, share what's working, identify what isn't, and ask "what's the next thing we want to try?" This creates a natural continuity that prevents the momentum loss between "launch excitement" and "settled routine."

**Pick a metric and start tracking it now.** Something simple. Time to first draft on [task type]. Volume of [document type] completed per week. Doesn't have to be perfect — has to be trackable.

**Create a shared prompt library.** Even a simple Notion doc or Slack channel where people post the prompts that worked. The act of sharing creates social reinforcement for continued use. The library itself becomes a resource for onboarding.

## The signal to watch for

The most reliable early indicator of an impending plateau: the frequency of "Claude did something surprising" stories drops.

In the first month, people notice things Claude can do that they didn't expect — and they share them. When those stories stop appearing naturally in team conversation, it means discovery has stalled. People have stopped exploring. They're only using what they already know works.

That's the moment to intervene — not three months later when usage data shows the decline.

---

*For the rollout itself, [rolling out Claude across teams](/articles/rolling-out-claude-across-teams) covers the launch phase. For measuring whether it's working, [measuring AI ROI](/articles/measuring-ai-roi) has the framework. For the IT approval that should come before any of this, [getting IT approval for Claude](/articles/getting-it-approval-for-claude) covers that conversation.*`,
  },
]

async function seed() {
  console.log('Seeding batch 52...\n')

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
      console.log(`  ✓ ${article.slug}`)
    }
  }

  console.log('\nDone.')
}

seed().then(() => process.exit(0))
