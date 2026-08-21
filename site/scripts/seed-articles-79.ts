/**
 * Batch 79 — May 2026 news: FDE ventures + small business + AO jobs + Claude Code
 *
 * 1. why-anthropic-openai-copied-palantir
 *    The week Anthropic ($1.5B JV) and OpenAI ($10B DeployCo) both launched
 *    forward deployment ventures simultaneously. What the Palantir model is,
 *    why both labs copied it in the same week, and what this means for
 *    practitioners building AI careers and for companies evaluating deployment.
 *    DEV_SLUGS + FOUNDER_ALSO_SLUGS. Cluster: Business Strategy & ROI. Angle: update.
 *
 * 2. claude-for-small-business
 *    Anthropic's May 13, 2026 launch: pre-built connectors and ready-to-run
 *    workflows for small businesses. QuickBooks, PayPal, HubSpot, Canva,
 *    DocuSign, Google Workspace, Microsoft 365. What's actually included and
 *    who it's for. Cluster: Features & Updates. Angle: update.
 *
 * 3. agent-operator-job-market-2026
 *    The Agent Operator is now a real job title. 280% YoY growth in agentic
 *    AI job postings, $95K–200K+ salary bands, titles crystallizing (Agent
 *    Supervisor, AI Ops Manager, Conversation Designer). What companies are
 *    actually hiring for — and what Priti's unofficial role now officially
 *    looks like on a job board. Cluster: Business Strategy & ROI. Angle: update.
 *
 * 4. claude-code-may-2026-updates
 *    What changed in Claude Code in the last two weeks: /code-review renamed
 *    from /simplify + --fix flag, /usage cost breakdown, allowAllClaudeAiMcps
 *    enterprise setting, Auto mode without consent prompts, VS Code remote
 *    agents. All practitioner-relevant changes with zero noise.
 *    DEV_SLUGS. Cluster: Claude Code. Angle: update.
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-79.ts
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
  // ─────────────────────────────────────────────────────────────────────────
  // Article 1: why-anthropic-openai-copied-palantir
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: 'why-anthropic-openai-copied-palantir',
    angle: 'update',
    title: 'Why Anthropic and OpenAI both copied Palantir\'s model in the same week',
    excerpt: "In the same week in May 2026, Anthropic launched a $1.5B deployment venture and OpenAI launched a $10B one. Both are built around a model Palantir pioneered 20 years ago: put engineers inside the client. Here's why the two best AI labs in the world decided to copy a defense contractor.",
    readTime: 8,
    cluster: 'Business Strategy & ROI',
    termSlug: 'ai-agent',
    body: `In the same week in May 2026, the two most capable AI companies in the world announced they were copying a defense contractor.

[Anthropic launched a $1.5B joint venture](https://www.anthropic.com/news/enterprise-ai-services-company) with Blackstone, Goldman Sachs, and Hellman & Friedman. [OpenAI launched "The Deployment Company"](https://openai.com/index/openai-launches-the-deployment-company/) — a $10B operation with McKinsey, Bain, and Capgemini — and simultaneously acquired Tomoro, a 150-person forward deployment firm, to staff it immediately.

Both moved within days of each other. The template they are both copying is Palantir's.

---

## What Palantir figured out (and kept quiet for 20 years)

Palantir was founded in 2003 to help intelligence agencies use data they already had. The problem was never the data. The problem was that no one inside the agency had the engineering skills to actually do anything with it — and no outside consultant would stay long enough to build something that lasted.

Palantir's answer: send engineers into the client. Not to consult. Not to deliver a project and leave. To embed — write production code against the client's actual systems, train the people who would maintain it, and build something durable before moving on.

They called these people Forward Deployed Engineers. The model — FDE — was the product as much as the software was.

The result: Palantir built lasting infrastructure inside every major defense agency, several intelligence services, and eventually large commercial enterprises. Their NPS among embedded clients was consistently among the highest in enterprise software. Not because the product was the best, but because someone from Palantir was *in the building*.

The problem is that Palantir's FDE model was expensive, slow to scale, and deeply tied to their specific software stack. You couldn't separate the model from the product. Which meant no one copied it — until AI changed the math.

---

## Why AI changes the math

AI makes the FDE model dramatically cheaper to scale. Here's why:

**The labor cost drops.** A Palantir FDE had to deeply understand Gotham/Foundry and be able to customize it at the infrastructure level. An AI FDE's primary lever is knowing how to get Claude (or GPT, or Gemini) to work against a client's specific data, APIs, and workflows. The technical ceiling is lower.

**The time-to-value compresses.** A Palantir FDE historically needed 6-18 months to build something that changed how a client operated. An AI FDE with access to Managed Agents, MCP servers, and a client's cloud connector stack can ship a working workflow in weeks.

**The client side is more ready.** Palantir spent much of the 2000s convincing enterprises that software-driven operations were worth pursuing. That argument is already won. Most large companies have decided they need to move on AI. What they lack is an engineer who can translate that intent into a working system.

**The compensation is now justified by the value.** Senior FDEs at Anthropic's joint venture and OpenAI's Deployment Company are reportedly being offered $300K–$500K+ packages. Companies can afford to pay this because the workflows these engineers unlock are worth multiples of that in productivity gain.

---

## What the two ventures actually are

### Anthropic's joint venture

Anthropic partnered with three of the most significant capital allocators in the world — Blackstone (the world's largest private equity firm), Goldman Sachs, and Hellman & Friedman. These partners don't just bring money: they bring their portfolio companies as the first set of clients.

The structure is a separate entity from Anthropic, with dedicated engineering teams. The engineers go into Blackstone's portfolio companies, Goldman's banking operations, H&F's investments. They build systems against real enterprise environments using Claude, Cowork, Managed Agents, and the full Anthropic stack.

Anthropic's upstream benefit: every deployment is a production feedback signal. Every system an FDE builds informs what Claude needs to do better in enterprise contexts. This is the same reason Palantir invested so heavily in FDEs — the field teams were also their best product researchers.

### OpenAI's Deployment Company

OpenAI moved even more aggressively. They launched a majority-owned entity with McKinsey, Bain, and Capgemini — the three consulting firms most synonymous with enterprise transformation — and immediately acquired Tomoro to bring 150 FDEs in on day one.

The McKinsey/Bain/Capgemini partnership is notable. These firms have the enterprise relationships and the project management infrastructure. OpenAI has the model. The FDEs are the delivery layer that connects the two. It's vertical integration of the go-to-market stack.

---

## What this means if you're building AI systems for companies

Two conclusions are clear from this:

**1. The Palantir model has been validated at scale.** When the two most valuable AI companies in the world both invest billions in the same go-to-market approach, that's not a trend. That's the playbook. If you're building or managing AI systems for companies — whether you're an aspiring FDE, a working Agent Operator, or an IT director evaluating vendors — this is the structure you'll be operating inside.

**2. Consulting firms are now deployment infrastructure.** McKinsey, Bain, Accenture, Deloitte, KPMG, EY — every major firm has either launched an FDE practice or partnered directly with an AI lab. The gap between "strategy consulting" and "AI implementation" is closing fast. What used to be a 12-month McKinsey engagement to recommend a software architecture is becoming a 6-week FDE sprint to build it.

---

## The honest filter

The simultaneous launch of two multi-billion-dollar deployment ventures in the same week is the clearest possible signal that forward deployment is the commercial model for enterprise AI.

But this is worth saying plainly: neither Anthropic nor OpenAI is building something that will compete with the engineers inside their own companies. The FDE ventures are the delivery channel. The model quality is still what determines whether the systems FDEs build actually work.

If you're considering a career path toward forward deployment — see [How to become a forward deployed engineer](/articles/how-to-become-forward-deployed-engineer) for the actual path.

If you're an IT director evaluating whether to bring in an FDE vs. building internal capacity — the answer depends entirely on your org's technical depth and how specific your AI use cases are. The [Agent Operator vs. FDE distinction](/articles/what-is-an-agent-operator) is the right frame for that decision.

---

## Try this today

If you work at a company that's been slow on AI adoption, forward this article to your CIO or VP of Engineering with one line: "This is the model the market is moving toward. We should have a conversation about how we want to participate — as buyers, builders, or both."

That conversation is happening inside every large company right now. Being the person who starts it is the first move in either the FDE path or the Agent Operator path.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Article 2: claude-for-small-business
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: 'claude-for-small-business',
    angle: 'update',
    title: 'Claude for Small Business — what\'s included and who it\'s actually for',
    excerpt: "On May 13, 2026, Anthropic launched Claude for Small Business: pre-built connectors and ready-to-run workflows for companies that don't have an IT team to set anything up. QuickBooks, PayPal, HubSpot, Canva, DocuSign, Google Workspace, Microsoft 365. Here's what's in it and whether you need it.",
    readTime: 5,
    cluster: 'Features & Updates',
    termSlug: 'claude-projects',
    body: `On May 13, 2026, Anthropic launched [Claude for Small Business](https://www.anthropic.com/news/claude-for-small-business) — a bundle of pre-built connectors and ready-to-run workflows designed for companies without a dedicated IT or AI team.

The core idea: most small businesses have been unable to use Claude's more powerful features because setting them up requires technical knowledge their teams don't have. Claude for Small Business removes that barrier. The connected tools work out of the box.

---

## What's included

Seven integrations ship at launch:

| Tool | What Claude can do with it |
|------|--------------------------|
| **QuickBooks** | Review transactions, draft invoices, summarize financial periods, flag anomalies |
| **PayPal** | Review payment history, summarize revenue by period, identify unusual activity |
| **HubSpot** | Draft follow-ups from CRM notes, summarize deal pipelines, prep for calls |
| **Canva** | Generate design briefs, summarize brand guidelines, draft copy for specific formats |
| **DocuSign** | Review contracts before signing, summarize document terms, flag unusual clauses |
| **Google Workspace** | Search across Drive, summarize Docs, draft replies from Gmail context |
| **Microsoft 365** | Same capabilities across Outlook, Word, Excel, SharePoint |

These are genuine connectors — Claude can read live data, not just answer questions about the tool in general. When you ask "what's my cash flow situation this month?" with QuickBooks connected, it reads your actual QuickBooks data.

---

## Who this is for

Claude for Small Business is for companies with fewer than 50 people where at least one person is doing 3–4 of the following: bookkeeping, invoicing, sales outreach, contract management, and document drafting.

At that profile, the integrations remove the biggest friction in getting Claude to help: the need to manually copy data from one tool into Claude to ask questions about it.

**The most common use case:** a founder or operations manager who has QuickBooks + HubSpot + DocuSign open all day and currently spends 30–60 minutes per day context-switching between them. With Claude for Small Business, those tools are a single conversation.

---

## Who doesn't need it

If you're already on Claude Team or Enterprise and have set up connectors manually, you likely have this already. Claude for Small Business is essentially a simplified version of the connector setup that enterprise teams configure from scratch.

If you only need one of the seven integrations, you may be better off setting it up individually — the connection is the same, but you don't pay for bundled features you won't use.

---

## Plan requirements

Claude for Small Business is available on Claude Pro and higher. The integrations require the respective accounts (QuickBooks subscription, HubSpot account, etc.) — Claude is connecting to them, not replacing them.

If your company is already on Claude Team, you have all of this plus Project sharing, admin controls, and SSO. Claude for Small Business is the step below that — for companies that want the practical connectors without team management overhead.

---

## What to set up first

If you're a small business owner or solo operator who qualifies:

1. **Connect QuickBooks or HubSpot first.** These are the highest-frequency tools for most small businesses and will produce the most immediate value.
2. **Connect DocuSign if contracts are a time sink.** "Review this contract and flag anything unusual" is one of the most immediately valuable things Claude can do for a small business operator.
3. **Hold Google Workspace / M365 for later.** These are broad-surface connectors. Start with the tool where your biggest data-to-decision bottleneck lives.

---

## Try this today

If you have a QuickBooks account and a Claude subscription: connect them today and ask "Summarize my revenue and expenses for the last 30 days, and tell me if anything looks unusual." That's a task that currently takes 15 minutes. With the connector, it takes 30 seconds.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Article 3: agent-operator-job-market-2026
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: 'agent-operator-job-market-2026',
    angle: 'update',
    title: 'The Agent Operator is now a real job title — here\'s what companies are hiring for',
    excerpt: "Agentic AI job postings grew 280% in the last year. The titles are crystallizing: Agent Supervisor, AI Ops Manager, Conversation Designer, Agent QA Lead. Salary bands are running $95K–$200K+. If you've been doing this work unofficially — or trying to get hired for it — here's what the job market actually looks like right now.",
    readTime: 6,
    cluster: 'Business Strategy & ROI',
    termSlug: 'ai-agent',
    body: `For most of 2025, "Agent Operator" was a description without a job posting. People were doing the work — wiring internal systems to Claude, writing evals for their company's agents, managing the change management process when something broke — but it wasn't what their job description said.

That's changing.

Agentic AI job postings grew 280% year-over-year in 2026, according to labor market analysis published in May. The roles are moving from "unofficial side project for the IT manager" to distinct job titles with salary bands, reporting structures, and defined scope.

---

## The titles that are appearing

The market hasn't settled on a single title, but four are appearing consistently across job boards:

**Agent Supervisor** — Oversees a portfolio of deployed agents. Responsible for monitoring agent outputs for accuracy and unexpected behavior, triaging failures, and coordinating remediation. Reports to IT or to the department that owns the agent.

**AI Ops Manager** — The operational layer. Responsible for agent uptime, eval frameworks, cost management, and the internal change management process when an agent workflow changes. Often owns the relationship between IT and the business function.

**Conversation Designer** — Focused on the instruction layer: how agents are prompted, what system prompts look like, what guardrails are in place. Sometimes sits in the AI team, sometimes sits in UX/product.

**Agent QA Lead** — Owns the testing infrastructure. Writes test cases, builds golden datasets, tracks regression rates, and owns the quality bar for whether a new agent is safe to deploy.

These are distinct roles. A company building three or four agents can have one person playing all four. A company with 30+ agents typically needs separate people for each.

---

## Salary ranges (May 2026)

Based on current job board analysis and recruiter-reported compensation:

| Title | Base range | Notes |
|-------|-----------|-------|
| Agent Supervisor | $75K–$120K | Often a step up from CS/ops roles |
| AI Ops Manager | $110K–$160K | Usually requires ML/data background |
| Conversation Designer | $85K–$130K | Often from UX writing or content strategy |
| Agent QA Lead | $95K–$150K | Closer to software QA + AI knowledge |

Senior roles at AI-native companies and well-funded enterprises are running above these ranges. The $200K+ tier is appearing at companies where agents are core infrastructure (financial services, healthcare, logistics).

---

## What companies are actually hiring for

The job descriptions are converging on five core competencies:

**1. Workflow mapping.** Can you take a business process and describe which parts should be automated, which should stay human, and where the handoff points are? This is the foundation. Most companies don't need someone who can code from scratch — they need someone who understands the process deeply enough to design the agent architecture.

**2. Eval design without being a developer.** The most common hiring signal: "Experience building test suites for AI outputs." This doesn't mean writing Python evals. It means understanding what a golden dataset is, what failure modes to test for, and what a pass rate threshold should be before you deploy.

**3. Integration knowledge.** Familiarity with how Claude/API connects to internal systems — through MCP, through webhooks, through Zapier-level connectors. You don't need to build MCP servers from scratch. You need to know what they do and how to configure existing ones.

**4. Change management.** Can you get a resistant team to adopt an agent workflow? The hiring signal: "Demonstrated ability to train non-technical employees on AI tools" or "Experience managing AI change at the department level." Companies have learned that the hardest part of deploying agents is the people layer.

**5. Incident handling.** What do you do when an agent breaks? The question that comes up in interviews: "Walk me through how you would investigate an agent that started giving wrong outputs." There's no standard answer yet — it's a signal of whether you've actually operated agents under pressure.

---

## The honest picture

A few things worth saying plainly:

**This is not primarily a developer role.** The companies looking for these skills are not posting on dev.to or Hacker News jobs. They're on LinkedIn, in HR networks, inside consulting firms. The bar is high professional judgment and domain knowledge, not the ability to write a Kubernetes deployment.

**The title matters less than the work.** Someone who has been running agents at their current company — even if their current title is "IT Manager" or "Ops Lead" — is better positioned for these roles than someone with no AI ops experience and a fresh certification.

**The career path is still being figured out.** There's no standard senior Agent Operator career track yet. Some move toward engineering management. Some move toward consulting. Some stay as internal subject-matter experts. The companies that figure out internal advancement for Agent Operators will retain them. The ones that don't will watch them leave for FDE roles.

---

## If this is your unofficial job right now

If you've been doing this work without the title, the job market has caught up with you. The comp bands above are what the external market looks like. If your current employer isn't recognizing the work, you now have data for that conversation.

The certification path, the specific skills hiring managers look for, and how to build a portfolio are covered in detail in [Agent operator: your first 90 days](/articles/agent-operator-first-90-days).

---

## Try this today

Pull three job descriptions from LinkedIn using the search "agent operator" or "AI ops manager" in your city. Read the requirements sections. For each requirement, rate yourself 0–3. The gaps between your current state and the job requirements are your training roadmap for the next 90 days.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Article 4: claude-code-may-2026-updates
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: 'claude-code-may-2026-updates',
    angle: 'update',
    title: 'Claude Code updates — May 22–27, 2026',
    excerpt: "Five releases in five days: /simplify became /code-review with an --fix flag, /usage shows per-category cost breakdowns, Auto mode no longer needs a consent prompt on each action, VS Code added remote agent sessions that survive laptop disconnect, and a new enterprise setting unlocks all Claude.ai MCP connectors without per-server approval.",
    readTime: 4,
    cluster: 'Claude Code',
    termSlug: 'claude-code-skill',
    body: `Claude Code shipped five releases between May 22 and May 27. Here's what actually changed for practitioners — no version numbers unless they help.

---

## The five changes worth knowing

### 1. /simplify is now /code-review (and can auto-apply fixes)

The correctness-checking command was renamed from \`/simplify\` to \`/code-review\`. The new name is accurate: it reviews the current working tree for logic errors, off-by-one bugs, and inconsistencies — not style simplification.

More importantly: \`/code-review --fix\` now auto-applies findings to the working tree. Previously, /simplify surfaced issues but left you to apply them. With \`--fix\`, it finds a problem and immediately patches it. This closes the loop on the review-to-fix cycle without a manual step.

**If you're using /simplify:** update your muscle memory to \`/code-review\`. Same command, better semantics.

### 2. /usage shows you a per-category cost breakdown

The new \`/usage\` command outputs a breakdown of where tokens are going in your current session — by category (context, tools, output, cache hits vs. misses). 

This is the thing operators and cost-conscious developers have been asking for. Until now, Claude Code sessions were a black box for token attribution. You could see the total at session end, but not whether your cost was coming from context size, tool calls, or output verbosity.

\`/usage\` gives you that in-session. Run it mid-session to diagnose why a particular workflow is more expensive than expected.

### 3. Auto mode no longer requires a consent prompt per action

Claude Code's Auto mode — where it executes actions without asking for approval — previously required a consent confirmation at the start of each session. That prompt is gone.

A background classifier now reviews each action before it executes and flags anything outside the expected pattern for human review. The result: Auto mode sessions run without interruption for routine actions, while genuinely unusual actions still surface.

**Practical note:** If you're configuring Auto mode for other people on your team, the setup is now simpler. The conversation about what Auto mode does and doesn't require is the same — but the friction of the initial consent prompt is removed.

### 4. VS Code remote agents survive laptop disconnect

VS Code 1.121 added Remote Agents: agent sessions run over SSH or dev tunnels on a remote machine. If you close your laptop, the agent keeps running on the remote host.

For practitioners running long-horizon agent tasks (multi-file refactors, extended test generation, overnight batch processing), this eliminates the biggest operational risk: a laptop going to sleep mid-task. The session picks up from where it left off when you reconnect.

**Setup:** Enable remote agent mode in your VS Code settings and point it at a remote host you have SSH access to. The agent runs there; you observe from your local VS Code instance.

### 5. Enterprise setting: allow all Claude.ai MCP connectors at once

The new \`allowAllClaudeAiMcps\` setting in your enterprise configuration unlocks all Claude.ai cloud MCP connectors for your org without requiring admin approval on each individual server.

Previously, every MCP connector needed explicit admin approval before team members could use it. This created a bottleneck at the IT layer. The new setting is an org-wide blanket approval for the official Claude.ai MCP catalog.

**Security note:** This is an opt-in enterprise setting, not a default. It's appropriate for orgs that have already reviewed the catalog and trust Anthropic's cloud connectors. It should not be used as a shortcut to avoid evaluating individual connectors.

---

## One bug fixed that may explain mysterious failures

If your Claude Code setup broke between May 21 and May 23, this is likely why: the May 21 release had a regression where the Bash tool returned exit code 127 on every command regardless of actual result. A hotfix shipped on May 22. If you saw "command not found" errors or unexpected failures in that window, updating to the current version resolves it.

---

## What to do right now

Three quick things:

1. **Update Claude Code** if you're not on the latest version. The Bash exit code regression fix alone is worth it.
2. **Run \`/usage\`** mid-session on your next heavy task. You'll learn something about where your costs are coming from.
3. **Try \`/code-review --fix\`** on a working tree you've been manually patching. The auto-apply is faster than the manual workflow.`,
  },
]

async function seed() {
  console.log('Seeding Batch 79 — May 2026 news...\n')

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
