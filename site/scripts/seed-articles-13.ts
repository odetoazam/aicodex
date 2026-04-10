/**
 * Batch 13 — Final overnight batch: artifacts, MCP, Claude Code, operator habits, security
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-13.ts
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

  // ── 1. Artifacts practical guide ─────────────────────────────────────────
  {
    termSlug: 'artifact',
    slug: 'claude-artifacts-guide',
    angle: 'process',
    title: 'Claude Artifacts: what they are and when to use them',
    excerpt: 'Artifacts let Claude produce standalone outputs — documents, code, charts — outside the chat. Here is when they matter and how to get the most from them.',
    readTime: 4,
    cluster: 'Tools & Ecosystem',
    body: `An [Artifact](/glossary/artifact) is a standalone output Claude produces alongside a conversation — a document, a code file, a spreadsheet, a chart — rather than as text embedded in the chat. You can view, edit, copy, and download Artifacts independently, without having to extract them from the conversation.

Most people underuse Artifacts because they don't notice when they're relevant. Here is when they matter.

## When Artifacts make a meaningful difference

**Documents you will reuse or edit.** A research brief, a project plan, a policy document, a report. When Claude produces these as an Artifact, you get a clean document you can edit directly — not text you have to copy, paste into Google Docs, and reformat. The difference is small for a single draft; significant when you are iterating across multiple versions.

**Code you will actually run.** When Claude writes a Python function, a SQL query, or a script, having it as a separate Artifact makes it easy to copy into your editor without digging through conversation text. For anything you are going to use, Artifacts keep things cleaner.

**Deliverables you will share.** If the output is going to someone else — a deck structure, a formatted report, a template — producing it as an Artifact keeps it separate from the conversation context and makes sharing cleaner.

**Multiple versions of the same thing.** When you are asking Claude to produce three versions of an email, or five variations on a headline, Artifacts let you keep each version separate and review them side by side rather than scrolling through conversation history.

## When Artifacts don't matter

Quick answers, short responses, conversational back-and-forth. When Claude explains something or answers a question, an Artifact would just be an unnecessary container. Artifacts are for outputs you will use as documents — not for every response.

## The office document Skills

The PPTX, XLSX, and DOCX Skills (available via Anthropic-managed skills) produce actual Microsoft Office files as Artifacts — not markdown that looks like a document, but real files you can download and open. This is qualitatively different: the PPTX Skill produces a presentation you can open in PowerPoint, not a text outline of one.

If your team needs to produce deliverables in standard business formats, these Skills are worth enabling. The output quality for formatted documents is significantly better than text-based alternatives.

## Working with Artifacts effectively

**Ask explicitly when it matters.** Claude does not always choose to produce an Artifact. If you want the output as a standalone document, say so: "Produce this as a document I can edit" or "Create this as an Artifact."

**Iterate on the Artifact, not the conversation.** Once an Artifact exists, you can ask Claude to update it directly: "Update the Artifact to add a section on timeline" is cleaner than asking Claude to reproduce the whole document with changes.

**Use Artifacts as shared reference points.** In a long conversation where you are developing a document, referring back to "the Artifact" keeps the conversation and the output separate — Claude updates the document, the conversation explains the reasoning.

## The honest summary

Artifacts matter most when the output is a document you will use. They reduce friction between Claude producing something and you actually using it. For quick conversational exchanges, they add nothing. Know which you are doing, and you will know when to use them.
`,
  },

  // ── 2. MCP practical ─────────────────────────────────────────────────────
  {
    termSlug: 'mcp',
    slug: 'mcp-for-operators',
    angle: 'process',
    title: 'MCP for operators: what it means and when you need it',
    excerpt: 'MCP is the plumbing that lets Claude connect to anything. Here is what operators need to understand — and when it becomes relevant for your organisation.',
    readTime: 5,
    cluster: 'Tools & Ecosystem',
    body: `[MCP](/glossary/mcp) — the Model Context Protocol — is an open standard that defines how Claude (and other AI models) connect to external tools and data sources. If you have used [Connectors](/glossary/connector) to link Claude to Notion or Google Drive, you have used MCP infrastructure, even if the word never appeared in the interface.

For most operators using Claude.ai, MCP is invisible — it is the plumbing behind features you use without thinking about them. For operators building custom integrations or using Claude via the API, understanding MCP becomes relevant.

## What MCP actually does

Before MCP, connecting an AI model to an external tool required custom engineering for every integration — a different approach for every data source, every tool, every company. MCP standardises this: it defines a common format for how Claude requests data from external systems and how those systems respond.

The practical effect: any tool that builds an MCP server can be connected to Claude, without Anthropic needing to build a custom integration. This is why the ecosystem of Claude integrations has grown quickly — tools can connect themselves rather than waiting for Anthropic to connect them.

## What this means for operators

**If you use Claude.ai with Connectors:** You are already using MCP. The Google Drive Connector, the Notion Connector, the Slack Connector — all run on MCP. You do not need to understand MCP to use them.

**If you want to connect Claude to an internal tool that doesn't have a built-in Connector:** This is where MCP becomes operational for you. If your company uses a proprietary CRM, a custom knowledge base, or any internal system with an API, you can build an MCP server that lets Claude connect to it. This typically requires a developer — it is not a no-code task — but it is significantly less work than building a custom AI integration from scratch.

**If you are building AI-powered tools for your organisation:** MCP is the standard your developers should use for any integration work. Building to MCP means your integrations work with the broader ecosystem, not just with Claude.

## The ecosystem implication

Because MCP is an open standard, there is a growing library of pre-built MCP servers for common tools. Before having your developer build a custom integration, check whether an MCP server already exists for your tool. Many common development tools (GitHub, Linear, Jira, databases) have community or official MCP servers.

The Anthropic documentation and community resources maintain lists of available MCP servers — your developer will know where to find them.

## What operators don't need to worry about

If you are a non-technical operator using Claude.ai with standard Connectors, MCP is background infrastructure. The relevant question for you is: "Is the tool I want to connect available as a Connector in Claude.ai?" If yes, use it. If no, and it is a tool your whole organisation depends on, that is a conversation to have with your IT team about building an integration.

MCP is the reason that conversation is increasingly worth having — the integration path exists and is standardised. Two years ago, connecting a proprietary internal tool to an AI model required significant custom engineering. With MCP, it requires a developer and a few days of work.

## The honest summary

MCP is the infrastructure layer that makes Claude extensible beyond what Anthropic has built directly. For most operators, it is invisible. For organisations with proprietary tools they want Claude to access, it is the path from "Claude can't connect to our internal systems" to "Claude can connect to anything with an API." The technical barrier is real but much lower than it used to be.
`,
  },

  // ── 3. Admin security and privacy ─────────────────────────────────────────
  {
    termSlug: 'claude-plans',
    slug: 'claude-admin-security-privacy',
    angle: 'process',
    title: 'Security and privacy for Claude admins: what you need to know',
    excerpt: "Before you roll Claude out to your team, you need to understand what Anthropic does with your data — and what your responsibilities are. Here is the non-alarmist version.",
    readTime: 6,
    cluster: 'Business Strategy & ROI',
    body: `Security and privacy are the questions every IT admin gets asked before they can roll out any new tool. With AI, the questions are more loaded than usual — there are genuine uncertainties, a lot of vendor marketing about "enterprise-grade security," and real variation in what different plans actually offer.

Here is what you actually need to know as a Claude admin.

## What Anthropic does with your data

On Claude.ai Team and Enterprise plans, Anthropic does not use your conversations to train its models. This is a contractual commitment, not just a policy statement. The data you and your team send to Claude through these plans is not training data.

On Free and Pro plans, the default is different — Anthropic may use conversations to improve Claude, though you can opt out in settings. This is standard for consumer AI products. If you are rolling out to a team, you should be on Team or Enterprise — which resolves this concern.

What Anthropic does do: process your messages to provide the service, store conversation history per your plan's data retention settings, and log usage for safety monitoring. This is standard for any cloud software service.

## Data residency and retention

On Team plans, data is processed in Anthropic's infrastructure with standard retention periods. On Enterprise, you can negotiate custom data retention policies and, depending on agreement terms, specific infrastructure options.

If your organisation has data residency requirements — your data must stay within a specific geographic region — this is an Enterprise-level conversation. Standard Team plans do not offer geographic data isolation guarantees. Raise this with your Anthropic account contact before committing.

## What your team should not put into Claude

Regardless of plan, there is a category of data that should not go into Claude or any third-party AI tool without explicit review:

- **Personal data about customers or employees** (names, email addresses, health information, financial records) — check your obligations under GDPR, CCPA, or relevant regulations before processing personal data through a third-party AI
- **Credentials and passwords** — obvious, but worth stating explicitly
- **Legally privileged communications** — attorney-client privilege may not survive processing through a third-party system without careful controls
- **Regulated financial or health data** — HIPAA, PCI, and similar regulations have specific requirements about where data can be processed

This is not a reason not to use Claude. It is a reason to be thoughtful about what data enters conversations. Your [usage policy](/articles/ai-usage-policy-for-teams) should make this explicit.

## SSO and access control

Single sign-on (SSO) is an Enterprise feature. It lets you manage Claude access through your existing identity provider (Okta, Azure AD, Google Workspace, etc.) — so users log into Claude with their company credentials, and you can provision and deprovision access through your standard IT processes.

On Team plans, you manage access through Anthropic's admin console: you invite users by email, remove them when they leave, and manage their roles. This is adequate for most organisations but requires you to actively maintain the list. SSO automates this via your IdP.

If your IT policy requires SSO for all cloud tools, you need Enterprise. If it is a preference rather than a requirement, Team's manual management is workable for organisations under ~100 people.

## Practical security steps for Team plan admins

1. **Audit who has access quarterly.** Remove departed employees. Check that roles are appropriate.

2. **Review the Connector permissions you have enabled.** Each active Connector has access to read from an external service using someone's credentials. Periodically check which Connectors are active and whether the access level is appropriate.

3. **Set a clear policy on what data goes into Claude.** Write it down, communicate it, and include it in onboarding for new team members. "Use judgment" is not a data policy.

4. **Know Anthropic's current terms.** Anthropic's data practices evolve. The authoritative source is Anthropic's privacy policy and your plan's DPA (Data Processing Agreement), not this article. Review these when you sign up and when Anthropic announces significant changes.

## The proportionate response

Claude is a cloud software tool. The security and privacy considerations are similar in kind to Google Workspace, Salesforce, or any other SaaS product your company uses. The questions to ask are the same: what data goes in, who can access it, what does the vendor do with it, and how do you manage access.

For most organisations using Team plan for standard knowledge work tasks, the risk profile is manageable with straightforward controls. For organisations with regulated data, healthcare, or specific compliance requirements, the Enterprise conversation is worth having before rolling out — not after.
`,
  },

  // ── 4. Claude Code intro for operators ────────────────────────────────────
  {
    termSlug: 'claude-code',
    slug: 'claude-code-for-operators',
    angle: 'role',
    title: 'Claude Code: what it is and whether your engineering team should use it',
    excerpt: 'Claude Code is a different product from Claude.ai — it is an agentic coding tool that runs in the terminal. Here is what it does and when it makes sense.',
    readTime: 5,
    cluster: 'Tools & Ecosystem',
    body: `[Claude Code](/glossary/claude-code) is not Claude.ai for developers. It is a fundamentally different kind of tool — an agentic system that runs in the terminal, operates directly within a codebase, and can read, write, run, and debug code autonomously within a defined scope.

If your organisation has an engineering team, Claude Code is worth understanding. If your organisation does not have engineers, this is probably not relevant to you.

## What Claude Code actually does

Where Claude.ai is a conversation interface, Claude Code is an agent that operates within a repository. You give it a task — "implement the user authentication flow," "debug this failing test," "refactor this module to improve performance" — and it reads the relevant code, writes changes, runs tests, reviews the output, and iterates until the task is done or it needs input.

This is qualitatively different from asking Claude in a chat window to write code. Claude Code:
- Reads your actual codebase and understands the context
- Makes changes directly to files
- Runs commands, tests, and build processes
- Operates across multiple files and modules simultaneously
- Iterates based on the results of running code — not just on text

For an engineer, the experience is closer to working with a capable pair programmer who can do the mechanical parts of coding autonomously, leaving the engineer to focus on architecture, judgment, and review.

## What it changes about engineering work

The engineering tasks that Claude Code handles well are the ones engineers often find most tedious: implementing well-defined features from a clear spec, writing tests for existing code, refactoring code that follows a clear pattern, updating documentation, making consistent changes across a codebase.

These are often the tasks that slow down senior engineers the most — not because they are hard, but because they are time-consuming and mechanical. Claude Code handles the implementation; the engineer reviews the result and handles the cases where judgment is required.

For junior engineers, Claude Code functions as an accelerant — they can tackle tasks that would previously have required significant senior guidance, because Claude Code can navigate the codebase and handle the implementation details while they focus on understanding what the code should do.

## What it does not change

Architecture decisions require human judgment. Security-sensitive code requires careful review — Claude Code can implement what you spec, but you are responsible for the spec being correct and the implementation being safe. Complex algorithmic work where the approach itself is the hard part still requires engineering expertise to define.

Claude Code is not a replacement for engineers. It is a tool that makes engineers significantly more productive at the mechanical parts of their work.

## Practical considerations for operators

**Access model:** Claude Code is available as a CLI tool, not through the Claude.ai interface. It requires an Anthropic API key (or a Claude Max subscription). Your engineering team manages access, not your central Claude admin.

**Cost model:** Claude Code uses API tokens, billed per usage. Complex coding tasks with large codebases can consume significant tokens. Establish usage expectations and monitoring before rolling out broadly.

**Security:** Claude Code operates within the scope you give it and will ask before taking actions outside that scope. It does not have internet access by default. Review Anthropic's documentation on Claude Code permissions before deployment.

**Rollout:** Unlike Claude.ai, Claude Code has a steeper setup curve — it requires command-line comfort, an API key, and understanding of how to structure tasks for an agentic system. Roll out to your most experienced engineers first, let them develop best practices, then expand.

## The bottom line for operators

If you have an engineering team and have been focused only on Claude.ai, Claude Code is worth putting on your evaluation list. The productivity improvements for engineering work are among the most concrete and measurable of any Claude use case. The rollout is more technical than Claude.ai, but the capability is qualitatively different.

If you have been thinking about AI as something your non-technical teams use, Claude Code is the equivalent for your engineering team — and the leverage it provides is at least as significant.
`,
  },

  // ── 5. Multi-team rollout sequencing ──────────────────────────────────────
  {
    termSlug: 'claude-plans',
    slug: 'rolling-out-claude-across-teams',
    angle: 'process',
    title: 'How to sequence a Claude rollout across multiple teams',
    excerpt: 'Rolling out to 10 teams at once is a recipe for chaos. Here is the sequencing strategy that works — who to start with, how to expand, and what to do when a team is struggling.',
    readTime: 5,
    cluster: 'Business Strategy & ROI',
    body: `If you have been asked to roll out Claude company-wide, the instinct is often to do it all at once — provision everyone's accounts, set up all the Projects, send the announcement, and call it done. This approach reliably produces mediocre results: some teams get meaningful value, most don't change how they work, and after three months someone asks why adoption is low.

The alternative is sequenced rollout. It takes longer up front and produces much better results.

## Why sequencing works

Every team's Claude [Project](/glossary/claude-projects) needs a [system prompt](/glossary/system-prompt), uploaded documents, and configured [Skills](/glossary/skill) and [Connectors](/glossary/connector). Writing good system prompts requires understanding what the team actually does. That understanding takes time to develop.

If you roll out to all teams simultaneously, you have to write all the system prompts at once — which means writing them quickly, before you understand the work, based on assumptions rather than observation. The result is Projects that kind of work for everyone and really work for no one.

Sequential rollout lets you go deep with one or two teams, get their Projects right, learn what actually works, and carry those learnings into the next wave.

## The sequencing framework

**Wave 1: Your highest-value, clearest use cases (weeks 1–3)**

Start with the teams that have:
- High-volume, repetitive text work (CS, marketing, or operations typically)
- A clear, specific use case (not "use Claude for everything" — "use Claude to draft ticket responses")
- A team lead who is genuinely interested, not just compliant

Go deep with 1–2 teams. Set up their Projects properly. Run the first use case well. Measure the time savings. Get testimonials.

**Wave 2: Adjacent teams with similar patterns (weeks 4–8)**

Once wave 1 teams are using Claude consistently and producing results, expand to similar teams. If CS worked, HR and operations typically have similar patterns (high-volume, document-based). If marketing worked, sales and comms usually follow.

Critically: use wave 1 learnings. The system prompt pattern you developed for CS probably applies to HR with minor modifications. The documents structure that worked in marketing applies in sales. You are not starting from scratch.

**Wave 3: Complex or specialised teams (weeks 9–16)**

Engineering, legal, finance — teams where Claude use cases are real but require more careful configuration and stronger guardrails. Use the credibility from waves 1 and 2 to have those conversations from a position of demonstrated results, not theoretical promise.

## Who to start with in wave 1

The three questions to evaluate each team:
1. What specific task would take meaningfully less time with Claude? (Can they name one?)
2. Does the team lead believe it will work? (Skeptical leads will undermine adoption)
3. Can you measure the impact? (Even roughly — time per task, volume handled, revision rounds)

Teams that score well on all three are your wave 1 candidates. Teams that can't name a specific task are not ready yet — spend the time helping them identify one, then return.

## What to do when a team is struggling

At 30 days, if a team is not using Claude or reporting poor outputs, diagnose before making changes:

**Low adoption** usually means the workflow is unclear. Talk to users, not the manager. Ask: "Show me the last time you tried to use Claude and it didn't work." The answer will tell you what to fix — usually the system prompt, the onboarding, or the use case definition.

**Poor output quality** usually means the system prompt is wrong or the Project is missing key documents. Compare what Claude is producing to what you would want. The gap between those is the gap in your configuration.

**Abandonment after one bad experience** needs individual follow-up. Find the person who tried it, got a bad result, and stopped. Walk through it with them. Show them what the right approach looks like. One successful session after a bad one often recovers the relationship.

## The measure that matters most

At 90 days, the question is not "how many people have used Claude?" It is "which teams have meaningfully changed how they work, and what did that change deliver?"

Aim for two or three teams with clear, measurable before-and-after stories. Those become the internal case studies that drive the next wave of adoption better than any company-wide announcement.
`,
  },

]

async function seed() {
  console.log('Seeding batch 13...\n')

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
