/**
 * Batch 10 — Admin-specific configuration articles
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-10.ts
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

  // ── 1. Choosing your Claude plan ─────────────────────────────────────────
  {
    termSlug: 'claude-plans',
    slug: 'choosing-your-claude-plan',
    angle: 'process',
    title: 'Which Claude plan is right for your organisation?',
    excerpt: "Free, Pro, Team, or Enterprise — here's how to think through the decision, what you actually get at each tier, and when upgrading makes financial sense.",
    readTime: 6,
    cluster: 'Business Strategy & ROI',
    body: `If someone has asked you to "get Claude set up for the team," the first decision is the plan. Most organisations get this wrong in one of two directions: they under-buy (everyone on Free, struggling with limits) or over-buy (jumping straight to Enterprise before they know what they need).

Here is how to think through it clearly.

## The four tiers and what they actually mean

### Free
Individual accounts, usage limits, no admin controls. Fine for personal experimentation. Not suitable for deploying across a team — there is no central management, no billing consolidation, and limits kick in at the worst times.

If anyone on your team is using Claude's Free tier right now, treat it as a trial, not a deployment.

### Pro ($20/month per person)
Higher usage limits, access to all models including Opus, [Projects](/glossary/claude-projects), extended context. Designed for individuals who use Claude heavily. The gap between Free and Pro is significant — most power users will notice it immediately.

Pro is right for: small teams (under 5 people) where everyone manages their own subscription, or individuals who need heavy usage but don't need central management.

The problem with Pro for organisations: there is no admin console. You cannot see who is using what, cannot set policies, cannot manage billing centrally. If someone leaves the company, they take their subscription history with them.

### Team ($30/month per person, minimum 5 seats)
This is where admin capabilities begin. Team gives you:
- A centralised admin console to manage users
- Consolidated billing (one invoice, not 20 separate subscriptions)
- Usage visibility across the organisation
- [Project](/glossary/claude-projects) sharing between team members
- Higher usage limits than Pro

Team is the right default for most organisations rolling out Claude for the first time. It is meaningfully different from Pro — not just higher limits, but actual organisational control.

**When Team is the right choice:** 5–250 people, standard use cases (content, research, writing, analysis), no requirement for SSO or custom data retention policies.

### Enterprise (custom pricing)
Enterprise adds:
- SSO (single sign-on) integration with your identity provider
- Custom data retention and privacy controls
- Expanded context windows (up to 200k tokens)
- Priority support and SLAs
- Custom usage limits and policy controls
- Ability to deploy custom Claude configurations at scale

Enterprise is right when: you have compliance requirements that need custom data handling, you are in a regulated industry (finance, healthcare, legal), SSO is a non-negotiable for your IT policy, or you are deploying to 250+ people and need contractual guarantees.

Enterprise pricing is negotiated directly with Anthropic — budget roughly $40–$60 per person per month as a starting point, though actual pricing depends heavily on volume and use case.

## The decision framework

**Start with Team if you are deploying to 5 or more people and don't have hard compliance requirements.** The admin console alone is worth the step up from Pro. You will want visibility into usage within the first month.

**Upgrade to Enterprise when compliance forces your hand, or when you hit 250+ people and need contractual guarantees.** Do not jump to Enterprise before you have validated what your team actually uses Claude for — Enterprise contracts lock you in for 12 months.

**Never deploy Pro accounts as your team solution.** The lack of centralised management creates operational debt you will have to unwind later.

## What most admins miss

The plan determines your _ceiling_, not your _floor_. Having Team does not mean your team will use Claude well — that requires [setting up Projects](/articles/claude-admin-setup), writing good system prompts, and training your team on what to ask.

Most organisations that report disappointing results from Claude are not on the wrong plan — they are on the right plan with no configuration. The plan is 20% of the job. The setup is 80%.

## Practical advice on timing

Do not wait until you have the perfect rollout plan to upgrade. Start a Team trial with the 5–10 people most likely to benefit. Let them work out the rough edges. Then expand. The learning that comes from real usage is more valuable than any planning document.

Anthropic offers trials — your sales contact can extend these if you need more time before committing.
`,
  },

  // ── 2. Claude Projects org structure ─────────────────────────────────────
  {
    termSlug: 'claude-projects',
    slug: 'claude-projects-org-structure',
    angle: 'process',
    title: 'How to structure Claude Projects across your whole organisation',
    excerpt: 'One Project per team function is the right starting point. Here is the architecture that works at scale — naming, ownership, system prompt governance, and what to avoid.',
    readTime: 7,
    cluster: 'Business Strategy & ROI',
    body: `Most Claude admins start by creating a Project. Then another one. Then three more. Six months later, they have 23 Projects with names like "Marketing v2", "New CS Project", and "Test - ignore", and nobody knows which one to use.

Org-wide Project architecture matters. Here is how to build it right from the start.

## The core principle: one Project per distinct context

A [Project](/glossary/claude-projects) is a shared context — a system prompt, a set of documents, a set of enabled [Skills](/glossary/skill) and [Connectors](/glossary/connector). Create a new Project when the context meaningfully changes.

**Create separate Projects for:**
- Each team function with distinct work (CS, marketing, sales, ops, engineering, HR)
- Use cases with different audiences (internal vs. customer-facing)
- Use cases with different risk profiles (drafting emails vs. reviewing legal documents)

**Do not create separate Projects for:**
- Individual users within the same team
- Slight variations on the same use case ("CS - Tier 1" and "CS - Tier 2" probably don't need separate Projects)
- Experiments — use personal Projects for that, not the org's shared workspace

## The naming convention that actually works

Bad names: "Marketing", "CS Team", "Operations v3", "New Project (Josh)"

Good pattern: **[Function] — [Use Case]**

Examples:
- **Customer Success — Ticket Drafts**
- **Marketing — Content Creation**
- **Sales — Prospect Research**
- **HR — Policy Q&A**
- **Operations — Process Documentation**
- **All Staff — General Assistant**

The function prefix lets people find their Project instantly. The use case suffix signals what it is for. When you have 15 Projects, this structure makes the list readable.

## Ownership: who is responsible for each Project

Every Project needs an owner — one person who owns the [system prompt](/glossary/system-prompt), decides what documents to upload, and is accountable for the quality of outputs.

This is not the Claude admin. The Claude admin manages access, billing, and governance. The Project owner manages the context. These are different jobs.

**Good Project owners:**
- CS Project: CS team lead or senior CS rep
- Marketing Project: content lead or marketing manager
- Sales Project: sales enablement or top-performing AE
- HR Policy Project: HR business partner

**The admin's job with Projects:** create them, enforce the naming convention, set the initial framework for the system prompt, and make sure ownership is assigned. Then get out of the way.

## System prompt governance

The system prompt is the most important decision you make per Project. It determines what Claude knows about your organisation, what tone it uses, and what it will and will not do.

Three rules for org-wide system prompt governance:

**1. The admin writes a template; the owner fills it in.** Do not let owners write system prompts from scratch. Give them a structured template:
\`\`\`
You are a [role] for [Company]. Your job is to [primary function].
Audience: [who you are serving]
Tone: [2-3 tone descriptors]
Always: [2-3 behaviours you always do]
Never: [1-2 hard constraints]
Context: [key facts about the company/team/product]
\`\`\`

**2. System prompts are version-controlled.** Keep the current system prompt for each Project in a shared document (Notion, Google Doc). When it changes, note what changed and why. If a Project starts producing bad outputs, you need to know what changed.

**3. Treat the system prompt like a job description.** Vague job descriptions produce confused employees. Vague system prompts produce inconsistent outputs. A tight 300-word system prompt beats a sprawling 2,000-word one every time.

## What documents to upload per Project

Upload documents Claude needs to give accurate, on-brand answers. Not documents Claude might find useful someday.

**For each Project, identify:**
1. What factual questions will users ask? Upload the source of truth for those facts.
2. What tone or style standards apply? Upload the brand or communications guide.
3. What is off-limits to guess about? Upload the definitive reference.

For a CS Project: product FAQ, known issues list, escalation guide, support tone guidelines.
For a marketing Project: brand voice guide, ICP description, messaging house, product positioning doc.
For an HR Project: employee handbook summary, benefits overview, PTO policy, escalation contacts.

Do not upload everything. Upload what matters. Uploading a 200-page employee handbook to a CS Project creates noise, not value.

## The full org Project map (starting point)

Here is a reasonable starting structure for a company with 20–100 people:

| Project | Owner | Key documents | Skills |
|---|---|---|---|
| Customer Success — Ticket Drafts | CS Lead | Product FAQ, tone guide | File creation |
| Marketing — Content | Content Lead | Brand guide, ICP doc | Web search |
| Sales — Prospect Research | Sales Lead | Product one-pager, ICP | Web search |
| Operations — Process Docs | Ops Lead | Existing SOPs | File creation |
| HR — Policy Q&A | HR BP | Handbook summary, policies | None |
| All Staff — General | Admin | Company overview, org chart | Web search |

Start with the teams that have the clearest use cases and the most to gain. You can always add Projects; it is harder to merge badly designed ones.

## Project sprawl: what to watch for

Signs your Project architecture is breaking down:
- Duplicate Projects with similar names
- Projects whose owners have left the company
- Projects that haven't been used in 60+ days
- System prompts that say "you are a helpful assistant" — no real configuration

Do a quarterly Project audit. Consolidate duplicates, archive unused Projects, reassign orphaned ones. Fifteen well-maintained Projects are worth more than fifty neglected ones.
`,
  },

  // ── 3. The admin's zero-to-one ───────────────────────────────────────────
  {
    termSlug: 'claude-plans',
    slug: 'claude-admin-zero-to-one',
    angle: 'field-note',
    title: "You've been asked to set up Claude for the company. Here's where to start.",
    excerpt: "Someone handed you this job. Maybe you volunteered. Either way, you're now the person responsible for getting Claude working for the whole organisation. This is what the first two weeks look like.",
    readTime: 6,
    cluster: 'Business Strategy & ROI',
    body: `You probably did not apply for the role of "company AI lead." It got handed to you — by a founder who doesn't want to deal with it, a department head who doesn't know where to start, or a CEO who read something about AI and sent you a Slack message at 9pm.

However you got here, you are now the person. Here is what the first two weeks actually look like.

## Week one: understand before you configure

The biggest mistake new admins make is configuring things before they understand what the team actually does. They set up Projects, write system prompts, enable Skills — and then discover three weeks later that the CS team's most common task is not ticket responses, it is internal escalation notes.

Spend week one talking to people. Not asking "what do you want from AI" (you will get fantasy answers). Ask instead:

- "What do you do most of that is repetitive and takes longer than it should?"
- "What kind of writing do you produce in a typical week?"
- "What information do you spend time looking up or gathering?"
- "What have you already tried with AI, and what happened?"

That last question is the most important. Most teams have already experimented informally — some people are using Claude on their personal accounts, others tried it and gave up. Understanding what they tried and why it worked or didn't is the fastest path to knowing what configuration will actually help.

## The four things to figure out in week one

**1. Which teams have the clearest use cases?**
Look for teams with high-volume, repetitive, text-heavy work: customer success, marketing, operations, HR. These are where Claude delivers fastest. Engineering is valuable but complex. Sales is high-value but needs more setup. Start with clarity.

**2. Who will be your Project owners?**
You cannot write every team's [system prompt](/glossary/system-prompt) — you don't know their work well enough. Identify one person per team who understands the work AND cares about quality. That person becomes the Project owner. Your job is to give them a framework and stay out of their way.

**3. What plan do you actually need?**
If you are deploying to 5+ people, you need the [Team plan](/glossary/claude-plans) — not individual Pro accounts. The admin console alone is worth it. See the full plan comparison in [Which Claude plan is right for your organisation?](/articles/choosing-your-claude-plan)

**4. What is off-limits?**
Before anyone sends a customer email drafted by Claude, decide: what outputs require human review? For most organisations, customer-facing content, anything involving personal data, and legal or financial commitments should have a human in the loop. Write this down. Tell the team before they start, not after someone sends something they should not have.

## Week two: build the first Projects

Once you know what the priority teams need, build their [Projects](/glossary/claude-projects). See the [org-wide architecture guide](/articles/claude-projects-org-structure) for the full structure. The short version:

1. Name Projects clearly: **Customer Success — Ticket Drafts**, not "CS Team"
2. Write the system prompt with the Project owner, not for them
3. Upload 3–5 documents per Project, not 50
4. Enable the Skills each team needs; disable the ones they don't
5. Test with 10 representative tasks before anyone else touches it

Roll out to 1–2 early adopters per team first. Let them break things and report back. The edge cases they find in the first week are the most valuable input you will get.

## The thing nobody tells you about this job

Your job is not to make Claude work. Claude already works. Your job is to make Claude useful for your specific team, with your specific context, doing your specific work.

That requires understanding the work. The more time you spend understanding what each team actually does before you configure anything, the better the outputs will be. Admins who skip this step spend the next six months fixing a system that was built on assumptions.

The teams that get the most out of Claude are not the ones with the most technically sophisticated setup. They are the ones where someone took the time to understand the work before writing the first system prompt.

That someone is you.

## What good looks like at 30 days

At one month in, you should have:
- 3–5 active Projects with real owners
- At least one team that has noticeably changed how they work
- A list of what is working, what isn't, and what to fix
- A plan for the next wave of teams to onboard

You should not have: 20 Projects, a comprehensive usage policy nobody has read, or a weekly AI newsletter you are already behind on writing.

Do less, better. That is the job.
`,
  },

]

async function seed() {
  for (const article of ARTICLES) {
    const term = await getTermId(article.termSlug)
    if (!term) {
      console.error(`Term not found: ${article.termSlug}`)
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
      console.error(`Error seeding ${article.slug}:`, error.message)
    } else {
      console.log(`✓ ${article.slug}`)
    }
  }
}

seed().then(() => process.exit(0))
