/**
 * Tier 2 currency fix — the four highest-exposure product articles.
 *
 * All four were last touched 2026-04-14 and predate a run of changes:
 * Skills went GA with its own API (Aug 19) and is a distinct concept from
 * server tools; the connectors directory passed 950 servers and MCP moved to a
 * stateless core in the 2026-07-28 revision; Artifacts gained inline editing
 * (Jun 12); and Enterprise admin gained custom roles with connector
 * permissions (May 21), admin permissions via roles (Jun 2), model and effort
 * entitlements (Jul 1), Compliance API (May 21, extended Aug 11), Trusted
 * Devices (Jun 25), self-serve HIPAA (Jul 14) and skill/plugin security
 * scanning (Aug 6).
 *
 * skills-setup-guide had the most serious problem: it described Skills as
 * "the capabilities you enable inside Claude.ai — web search, code execution,
 * file creation." Those are tools. Skills are folders of instructions, scripts
 * and resources that Claude loads on demand. Rewritten.
 *
 * Also removes a dead link (support.claude.com/en/articles/claude-skills, 404)
 * and a mislabeled one in claude-admin-zero-to-one.
 *
 * Verified against docs on 2026-08-30:
 *   https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills
 *   https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview
 *   https://claude.com/blog/bringing-mcp-2026-07-28-to-claude
 *   https://support.claude.com/en/articles/12138966-release-notes
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/fix-stale-tier2-high-exposure.ts
 */

import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// ---------------------------------------------------------------------------
// skills-setup-guide — full rewrite. Skills and tools are different things.
// ---------------------------------------------------------------------------

const SKILLS_BODY = `Two different things get called "Skills," and the confusion costs people real time. This guide separates them, because you configure them in different places for different reasons.

**Tools** are capabilities: web search, code execution, file creation. Claude either has access to them or it doesn't.

**[Skills](/glossary/skill)** are folders of instructions, scripts and resources that Claude loads when a task calls for them. A skill teaches Claude *how your organisation does something* — how you format a customer report, what your brief template looks like, which steps your close process runs through. Skills went generally available with their own API in August 2026, and they work the same way across Claude.ai, Claude Code and the API.

The short version: tools are what Claude can reach. Skills are what Claude knows about your way of working.

## The tools that matter most for operators

**Web search.** Claude searches the internet and works current information into its response, with citations. On when you need current information — pricing, recent news, live documentation.

**Code execution.** Claude writes and runs code in a sandbox. This is what makes data analysis real rather than estimated: paste a CSV, ask for the numbers, and Claude computes them rather than predicting them. If your work touches data at all, keep this on.

**File creation.** Claude produces downloadable files rather than text in a chat window. This runs in the same sandbox as code execution.

**[Deep Research](/glossary/deep-research).** Claude spends extended time across multiple sources and returns a cited report. For thorough investigation, not quick questions — slower and more expensive, but a qualitatively different output.

## The Skills that matter most

**The document Skills.** PPTX, XLSX and DOCX are Anthropic-managed Skills that run in the code execution sandbox and produce real Office files — an actual PowerPoint deck, not a text outline of one. This is the clearest example of the distinction: file creation is the tool, and the document Skills are what teach Claude to produce a properly formatted deck with it.

**Your own Skills.** This is where the leverage is, and where most teams have done nothing. A skill is a \`SKILL.md\` file plus whatever scripts and templates it needs. Claude reads it only when the task calls for it, so having twenty skills available costs you nothing in context until one is relevant.

Good first candidates are the things you explain to Claude repeatedly: your report format, your QBR structure, your incident write-up template, the specific way your team scopes a project. If you have found yourself pasting the same instructions three times, that is a skill.

## Where each one is configured

**Tools** are toggled per conversation from the message bar, or set per Project so everyone working in that Project gets the same capabilities. Project-level is better for team consistency — the marketing Project always has web search on, the data Project always has code execution on.

**Skills** are attached to a Project, or provisioned organisation-wide by an admin on Team and Enterprise plans. Organisation-level Skills update centrally, which matters: when your report format changes, you edit one skill rather than asking forty people to update their instructions.

On Enterprise, skills and plugins go through security scanning to detect malicious content before they are made available — worth knowing if you are planning to accept skills built by people outside your team.

## When to turn tools OFF

This is the part most people miss.

**Turn off web search when working with internal documents.** If you have loaded your product documentation into a Project and want answers from it, web search can pull in conflicting or outdated material from the internet. Disable it to keep Claude on your content.

**Turn off connectors you are not using.** Every active [connector](/glossary/connector) is a live surface Claude can reach, and several of them can now write, not just read. Scope them to what this Project actually needs.

**Skills need no equivalent discipline.** Because Claude loads a skill only when the task calls for it, an unused skill costs nothing. Do not prune your skill library the way you prune tools — the tradeoff is different.

## The practical setup for a team admin

1. Create one [Project](/glossary/claude-projects) per team function.
2. Enable the relevant tools per Project — CS gets web search and file creation, the data team gets code execution, marketing gets web search and Deep Research.
3. Write two or three Skills for the formats your organisation produces most, and provision them organisation-wide rather than per Project.
4. Document what is enabled and why, so people don't randomly toggle things.
5. Set a review point. Skills go stale the same way documentation does — if your report template changed in March and the skill still describes the February version, Claude will confidently produce the wrong format.

The goal: each person opens their Project with exactly the capabilities they need, and Claude already knows how your organisation does the work.

## Further reading

- [Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) — what Skills are and how to design them
- [Introducing Skills](https://claude.com/blog/skills) — the announcement, with what ships built in
- [Build production agents with computer use, the Skills API, and the Files API](https://claude.com/blog/computer-use-skills-api-files-api) — the August 2026 GA release
- [Tool use overview](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview) — the tools side, including which run on Anthropic's infrastructure
- [Advanced tool use](https://www.anthropic.com/engineering/advanced-tool-use) — tool search and programmatic tool calling, for when you have too many tools to fit in context`

const SKILLS_EXCERPT =
  "Two different things get called Skills, and the confusion costs real time. Tools are what Claude can reach — web search, code execution, file creation. Skills are folders of instructions that teach Claude how your organisation works. Which to configure where, and why the leverage is in the ones you write yourself."

// ---------------------------------------------------------------------------
// mcp-for-operators — targeted currency edits.
// ---------------------------------------------------------------------------

const MCP_EDITS: [string, string][] = [
  [
    `The practical effect: any tool that builds an MCP server can be connected to Claude, without Anthropic needing to build a custom integration. This is why the ecosystem of Claude integrations has grown quickly — tools can connect themselves rather than waiting for Anthropic to connect them.`,
    `The practical effect: any tool that builds an MCP server can be connected to Claude, without Anthropic needing to build a custom integration. This is why the ecosystem grew as fast as it did — tools connect themselves rather than waiting for Anthropic to connect them. The [connectors directory](https://claude.com/connectors) now lists over 950 MCP servers.

The protocol itself has kept moving. The 2026-07-28 revision moved MCP to a stateless request/response core, which means servers can run on serverless and edge infrastructure rather than holding open a bidirectional session. If you are commissioning integration work, that is the revision to build against.`,
  ],
  [
    `**If you use Claude.ai with Connectors:** You are already using MCP. The Google Drive Connector, the Notion Connector, the Slack Connector — all run on MCP. You do not need to understand MCP to use them.`,
    `**If you use Claude.ai with Connectors:** You are already using MCP. The Google Drive, Notion and Slack connectors all run on it. You do not need to understand MCP to use them.

What has changed and does deserve your attention: many connectors now **write**, not just read. The Microsoft 365 connector can draft and send email, manage calendar events, and create and update files. Airtable can create and update records. Treat authorising a connector as granting an access level, not as switching on a convenience — scope it to the workspaces and bases Claude actually needs.`,
  ],
  [
    `**If you want to connect Claude to an internal tool that doesn't have a built-in Connector:** This is where MCP becomes operational for you. If your company uses a proprietary CRM, a custom knowledge base, or any internal system with an API, you can build an MCP server that lets Claude connect to it. This typically requires a developer — it is not a no-code task — but it is significantly less work than building a custom AI integration from scratch.`,
    `**If you want to connect Claude to an internal tool that doesn't have a built-in Connector:** This is where MCP becomes operational for you. If your company uses a proprietary CRM, a custom knowledge base, or any internal system with an API, you can build an MCP server that lets Claude connect to it. This typically requires a developer — it is not a no-code task — but it is significantly less work than building a custom AI integration from scratch. Custom remote MCP connectors work on every plan, free through Enterprise.`,
  ],
  [
    `The Anthropic documentation and community resources maintain lists of available MCP servers — your developer will know where to find them.`,
    `The [connectors directory](https://claude.com/connectors) is the reviewed list, and anything in it can be added to Claude Code with \`claude mcp add\` as well. Check there before commissioning a build.

**One governance note for anyone on Team or Enterprise:** admins can control connector access through custom roles, down to which individual tools within a connector a given role can use. If you are the person answering "can we let the sales team connect Claude to the CRM," that is now a permissions question with a real answer rather than an all-or-nothing decision.`,
  ],
  [
    `MCP is the reason that conversation is increasingly worth having — the integration path exists and is standardised. Two years ago, connecting a proprietary internal tool to an AI model required significant custom engineering. With MCP, it requires a developer and a few days of work.`,
    `MCP is the reason that conversation is worth having — the integration path exists and is standardised. Connecting a proprietary internal tool to an AI model used to require significant custom engineering. With MCP, it requires a developer and a few days of work, and the result works with the wider ecosystem rather than only with Claude.`,
  ],
  [
    `- [MCP connector documentation](https://platform.claude.com/docs/en/agents-and-tools/mcp-connector) — how MCP works in the Claude API`,
    `- [MCP connector documentation](https://platform.claude.com/docs/en/agents-and-tools/mcp-connector) — how MCP works in the Claude API
- [MCP 2026-07-28: stateless core](https://claude.com/blog/bringing-mcp-2026-07-28-to-claude) — the current spec revision and what changed
- [MCP connectors](https://support.claude.com/en/articles/14503689-mcp-connectors) — adding and managing custom connectors
- [Connectors directory](https://claude.com/connectors) — the reviewed list, 950+ servers`,
  ],
]

// ---------------------------------------------------------------------------
// claude-artifacts-guide — inline editing, sharing, current capability.
// ---------------------------------------------------------------------------

const ARTIFACTS_EDITS: [string, string][] = [
  [
    `**Iterate on the Artifact, not the conversation.** Once an Artifact exists, you can ask Claude to update it directly: "Update the Artifact to add a section on timeline" is cleaner than asking Claude to reproduce the whole document with changes.`,
    `**Edit inline rather than re-prompting.** You can highlight a section of an Artifact and ask for changes to that part directly, without describing where it is or switching to another application. For a document you are iterating on, this is much faster than "update the third paragraph under Risks" — and it stops Claude from quietly rewriting parts you were happy with.

**Iterate on the Artifact, not the conversation.** For larger changes, ask Claude to update it directly: "Update the Artifact to add a section on timeline" is cleaner than asking Claude to reproduce the whole document with changes.`,
  ],
  [
    `## The office document Skills

The PPTX, XLSX, and DOCX Skills (available via Anthropic-managed skills) produce actual Microsoft Office files as Artifacts — not markdown that looks like a document, but real files you can download and open. This is qualitatively different: the PPTX Skill produces a presentation you can open in PowerPoint, not a text outline of one.

If your team needs to produce deliverables in standard business formats, these Skills are worth enabling. The output quality for formatted documents is significantly better than text-based alternatives.`,
    `## The office document Skills

The PPTX, XLSX and DOCX [Skills](/glossary/skill) are Anthropic-managed Skills that produce actual Microsoft Office files — not markdown that looks like a document, but real files you can download and open. This is qualitatively different: the PPTX Skill produces a presentation you can open in PowerPoint, not a text outline of one.

Worth being precise about how this works, because the two concepts get conflated. File creation is the *tool* — the sandbox where Claude writes and runs code. The document Skills are the instructions that teach Claude to produce a properly formatted deck or spreadsheet inside it. You need both, and they are configured in different places. See [the Skills guide](/articles/skills-setup-guide) for the distinction.

If your team produces deliverables in standard business formats, these are worth enabling. The output quality is significantly better than text-based alternatives.`,
  ],
  [
    `## The honest summary

Artifacts matter most when the output is a document you will use. They reduce friction between Claude producing something and you actually using it. For quick conversational exchanges, they add nothing. Know which you are doing, and you will know when to use them.`,
    `## Sharing, and the caution that comes with it

Artifacts can be shared as links rather than copied into another tool, which makes them a genuinely useful way to hand something to a colleague. Two things to hold in mind before you do.

First, sharing publishes. Read the whole Artifact before you send the link, including the parts Claude generated while you were looking elsewhere — anything pulled in from a connector during the conversation may have ended up in it.

Second, an Artifact carries no provenance. A reader sees a clean, finished-looking document with no indication of which parts were verified and which were drafted. If you are sharing analysis rather than a template, say what you checked.

## The honest summary

Artifacts matter most when the output is a document you will use. They reduce friction between Claude producing something and you actually using it. For quick conversational exchanges, they add nothing. Know which you are doing, and you will know when to use them.`,
  ],
]

// ---------------------------------------------------------------------------
// claude-admin-zero-to-one — the governance layer that shipped May-Aug 2026.
// ---------------------------------------------------------------------------

const ADMIN_EDITS: [string, string][] = [
  [
    `## Week two: build the shared infrastructure

Once you know what you are building toward, set up the shared foundation:

- [Connectors](/glossary/connector) that most people will need (Google Drive, Slack, your ticketing system)
- The onboarding plugin if you are going wide
- [Projects](/glossary/claude-projects) if teams need shared context (see below)
- A skills-sharing process — once people build useful skills, how do others find them?`,
    `## Week two: build the shared infrastructure

Once you know what you are building toward, set up the shared foundation:

- [Connectors](/glossary/connector) that most people will need (Google Drive, Slack, your ticketing system)
- The onboarding plugin if you are going wide
- [Projects](/glossary/claude-projects) if teams need shared context (see below)
- A skills-sharing process — once people build useful skills, how do others find them?
- The permission model, covered below — this got substantially more capable in mid-2026 and most guidance predates it`,
  ],
  [
    `## Do you actually need Projects?`,
    `## What you can actually control now

Most admin advice, including earlier versions of this article, was written when the choices were roughly "who has a seat" and "which plan." That is no longer the shape of the job. If you are on Team or Enterprise, here is what is now yours to decide.

**Roles, scoped to what people actually do.** Custom roles let you grant narrow admin permissions — someone can own billing without becoming an Owner of everything. Connector permissions are part of the role, down to which individual tools within a connector a role can use. This is the difference between "sales can connect to the CRM" and "sales can read from the CRM but not write to it."

**Which models people can use, and how hard they think.** Model entitlements let you control both model access and effort level per user. This is a cost lever more than a safety one: an organisation where every user runs the top model at default effort for routine work is paying several times over for output nobody needed. Set it deliberately rather than discovering it in an invoice.

**What gets logged.** The Compliance API gives security teams governance across Claude products, and it now reaches Cowork and Claude Code sessions running on people's own machines. If your security team's objection to Claude was "we have no visibility into what happens in it," that objection has an answer.

**Device trust.** Trusted Devices lets you require device verification before anyone can remotely view or steer a local Claude Code session. Relevant the moment engineers start running Claude Code on machines you do not manage.

**Skill and plugin safety.** On Enterprise, skills and plugins are scanned for malicious content before they become available. Worth turning on before you encourage people to share skills across teams, not after.

**Regulated data.** HIPAA configuration is self-serve for Enterprise and API customers. If a compliance requirement was your blocker, check whether it still is — several of these landed quietly.

You do not need all of this in week two. You do need to know it exists, because the honest answer to "can we control X" is now usually yes, and the version of you that answers "no, the tooling doesn't support it" will get overruled in three months.

## Do you actually need Projects?`,
  ],
  [
    `**4. What is off-limits?**
Before anyone sends a customer email drafted by Claude, decide: what outputs require human review? For most organisations, customer-facing content, anything involving personal data, and legal or financial commitments should have a human in the loop. Write this down. Tell the team before they start, not after someone sends something they should not have.`,
    `**4. What is off-limits?**
Before anyone sends a customer email drafted by Claude, decide: what outputs require human review? For most organisations, customer-facing content, anything involving personal data, and legal or financial commitments should have a human in the loop. Write this down. Tell the team before they start, not after someone sends something they should not have.

Worth pairing this with a connector decision. A growing number of connectors can write as well as read — Microsoft 365 can send email and manage calendars, Airtable can create and update records. "What is Claude allowed to change" is now a separate question from "what is Claude allowed to see," and it is the one people forget to ask.`,
  ],
  [
    `- [Role-based access controls for Enterprise Plans](https://support.claude.com/en/articles/12138966-release-notes) — the April 2026 release adding RBAC`,
    `- [Release notes](https://support.claude.com/en/articles/12138966-release-notes) — the canonical record of admin features, including custom roles, connector permissions, model entitlements and Trusted Devices
- [Use connectors to extend Claude's capabilities](https://support.claude.com/en/articles/11176164-use-connectors-to-extend-claude-s-capabilities) — what connectors reach, and which can write`,
  ],
]

// ---------------------------------------------------------------------------

type P = { slug: string; body?: string; excerpt?: string; edits?: [string, string][] }

const PATCHES: P[] = [
  { slug: 'skills-setup-guide', body: SKILLS_BODY, excerpt: SKILLS_EXCERPT },
  { slug: 'mcp-for-operators', edits: MCP_EDITS },
  { slug: 'claude-artifacts-guide', edits: ARTIFACTS_EDITS },
  { slug: 'claude-admin-zero-to-one', edits: ADMIN_EDITS },
]

async function main() {
  let failures = 0
  for (const p of PATCHES) {
    const { data, error } = await sb.from('articles').select('slug, body').eq('slug', p.slug).single()
    if (error || !data) {
      console.error(`✗ ${p.slug}: could not load — ${error?.message}`)
      failures++
      continue
    }

    let body = data.body as string
    if (p.body) {
      body = p.body
    } else if (p.edits) {
      let ok = true
      for (const [from, to] of p.edits) {
        if (!body.includes(from)) {
          console.error(`✗ ${p.slug}: anchor not found → ${from.slice(0, 70)}...`)
          ok = false
          break
        }
        body = body.replace(from, to)
      }
      if (!ok) { failures++; continue }
    }

    const update: Record<string, unknown> = { body, updated_at: new Date().toISOString() }
    if (p.excerpt) update.excerpt = p.excerpt

    const { error: upErr } = await sb.from('articles').update(update).eq('slug', p.slug)
    if (upErr) {
      console.error(`✗ ${p.slug}: update failed — ${upErr.message}`)
      failures++
    } else {
      console.log(`✓ ${p.slug} — ${p.body ? 'body rewritten' : `${p.edits!.length} sections updated`}`)
    }
  }
  if (failures) { console.error(`\n${failures} article(s) failed.`); process.exit(1) }
  console.log('\nTier 2 high-exposure batch complete.')
}

main().catch((e) => { console.error(e); process.exit(1) })
