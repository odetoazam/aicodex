/**
 * Batch 73 — Anthropic announcement: Claude Security public beta (April 30, 2026)
 *
 * 1. claude-security
 *    Claude Security entered public beta for Claude Enterprise customers on
 *    April 30, 2026. Built on Opus 4.7. Scans codebases for vulnerabilities,
 *    generates patches. Started as research preview "Claude Code Security" in Feb.
 *    Audience: dev + admin (security teams). Cluster: Features & Updates.
 *    Angle: update.
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-73.ts
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
    slug: 'claude-security',
    angle: 'update',
    title: 'Claude Security: vulnerability scanning and patches for your codebase',
    excerpt: "On April 30, 2026 Anthropic moved Claude Security from research preview into public beta for Claude Enterprise. It scans repositories for vulnerabilities, traces data flows across files, and writes patches you can review and apply. Here's what it does, who it's for, and where it fits next to existing security tools.",
    readTime: 7,
    cluster: 'Features & Updates',
    audience: ['developer'],
    termSlug: 'claude-code',
    body: `Claude Security started life as **Claude Code Security**, a research preview Anthropic shipped in February 2026. As of April 30, 2026, it's a standalone product in public beta — accessible from the Claude.ai sidebar or directly at \`claude.ai/security\`.

It is built on **Opus 4.7**. Anthropic's framing for the launch: AI tools have lowered the cost of finding and exploiting vulnerabilities, and the defender side of that equation needs the same kind of automation.

## What it actually does

You point Claude Security at a repository (or a directory and branch within one). It runs a scan, traces data flows across files and modules, and produces a list of findings.

Each finding includes:

- A **confidence level** (so you can filter low-confidence noise out of triage)
- A **severity assessment**
- The **likely impact** if exploited
- **Reproduction steps** for the vulnerability
- A **proposed patch** for review

The patches aren't auto-applied. They show up as suggestions you read, edit, and either commit or reject — same review loop as a human pull request.

Three scan modes:

1. **Scheduled scans** — re-run on a cadence against a chosen branch
2. **Targeted scans** — directory or branch scoped, on-demand
3. **Ad-hoc scans** — fire from the UI when you want to check a specific change

## Who can use it

Public beta is **Claude Enterprise only** today. Team and Max access is on the roadmap, no firm date.

Setup is in the **admin console** — an Enterprise admin enables the feature for the workspace, and users with access then see Claude Security in the Claude.ai sidebar. No API integration required for the core product.

If you're not on Enterprise yet, this is an enterprise-only capability in beta — keep an eye on the release notes for the Team rollout.

## How findings flow into your existing tools

Three exit paths the docs call out:

- **Webhook to Slack or Jira.** Findings post into a channel or create tickets, so triage stays in the queue your team already watches.
- **CSV export.** For audit trails and compliance reports.
- **Markdown export.** For RFC-style writeups or postmortems.

There's also in-product triaging: dismiss a finding with a documented reason, and the dismissal travels with the codebase so future scans don't re-surface the same noise.

## Where it sits next to existing security tools

Most teams already run **SAST** (static analysis), **dependency scanners** (Dependabot, Snyk), and **secret scanners**. Claude Security doesn't replace those — it covers a different surface.

- **SAST tools** look for known patterns in code (e.g. SQL string concatenation). They produce a lot of findings, most of which are false positives, and they don't reason about how data flows in your specific app.
- **Dependency scanners** catch known CVEs in packages you depend on. They don't read your code at all.
- **Claude Security** reasons about your codebase's actual data flow — what untrusted input reaches what sink, across files. It can also write the fix.

The honest comparison: SAST gives you a high-recall, low-precision list. Claude Security gives you a smaller list with patches attached. Most security teams will keep both.

## What it doesn't do (today)

A few things to know up front:

- **It doesn't run continuously inside CI.** Scans are triggered from the UI or a schedule, not on every PR. (Expect this to change as the product matures.)
- **It doesn't replace a pen test.** Black-box probing of a deployed application is out of scope; Claude Security reads source.
- **It doesn't audit infrastructure.** Cloud config, IAM policies, container images — different problem space.
- **It doesn't auto-merge patches.** Every patch is a review item.

## A reasonable first 30 days

If you're an Enterprise customer turning this on for the first time, three checkpoints:

**Week 1 — Baseline scan.** Pick one moderately important repository (not your highest-stakes service, not a toy). Run a full scan. Triage every finding manually so you understand what false positives look like in your codebase.

**Week 2 — Wire it up.** Send findings to your existing Slack or Jira channel. Decide who owns triage. Set up a dismissal convention so signal stays high.

**Week 3 — Schedule it.** Set up scheduled scans on the branches you actually care about (\`main\`, release branches, anything with active customer traffic). Aim for weekly to start.

**Week 4 — Decide where to expand.** Look at the distribution of findings across the repo you've scanned. If patches are landing without too much noise, expand to one more repo. If triage is heavy, tune dismissals first.

## Quick FAQ

**Does it train on our code?**
Same Enterprise data terms as the rest of the Claude product — code submitted to Claude Security inherits the Enterprise data handling commitments. Confirm specifics with Anthropic before turning it on if you're under a strict DPA.

**What languages does it cover?**
The marketing material doesn't enumerate. Treat this as something to verify on your stack — open a small repo in each major language, run a scan, see what it returns.

**How does pricing work?**
Bundled with Claude Enterprise during the public beta. Standalone pricing for Team and Max is not yet announced.

**What about open source?**
Public beta is Enterprise-only and tied to Claude.ai. There's no self-hosted or open-source path today.

## Related reading

- [Securing your Claude app](/articles/securing-your-claude-app) — the developer side: writing secure Claude integrations
- [Claude admin security and privacy](/articles/claude-admin-security-privacy) — what an admin needs to know about Claude's data handling
- [Claude admin controls 2026](/articles/claude-admin-controls-2026) — the broader admin control plane Claude Security plugs into

---

*Source: [Claude Security announcement](https://www.anthropic.com/news/claude-security), Anthropic, April 30, 2026.*`,
  },
]

async function seed() {
  console.log('Seeding Batch 73 — Claude Security...\n')

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
