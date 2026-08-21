/**
 * Batch 78 — Claude Compliance API + 28 enterprise security integrations
 *
 * 1. claude-compliance-api
 *    On May 21, 2026 Anthropic shipped the Claude Compliance API alongside
 *    28 launch-partner integrations across DLP, SIEM, CASB, identity,
 *    eDiscovery, and AI security posture management. This is the operator
 *    deep-dive — what the API actually returns, what each integration
 *    category routes Claude data into, and how to scope a rollout.
 *    PINNED_OPERATOR candidate. Cluster: Features & Updates. Angle: update.
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-78.ts
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
    slug: 'claude-compliance-api',
    angle: 'update',
    title: 'The Claude Compliance API: route Claude into the security tools you already run',
    excerpt: "On May 21, 2026 Anthropic opened the Claude Compliance API with 28 launch partners — Cloudflare, CrowdStrike, Datadog, Microsoft Purview, Okta, Palo Alto Networks, Wiz, Zscaler, and 20 more. Here's what the API returns, which integrations cover which jobs, and how IT teams should think about rollout.",
    readTime: 7,
    cluster: 'Features & Updates',
    termSlug: 'claude',
    body: `Anthropic shipped the Claude Compliance API on May 21, 2026, alongside 28 launch-partner integrations that route Claude data into the security and compliance tools enterprises already operate.

The April 9 admin release [briefly previewed](/articles/claude-admin-controls-2026) the Compliance API as an Enterprise-only endpoint for usage data and selective deletion. The May 21 release is the full version — broader data coverage, both REST endpoints and ready-built integrations, and a clear answer to the question IT teams kept asking: *"how do I supervise Claude with the tools I already use to supervise everything else?"*

This is the operator deep-dive on what the API actually returns, what each integration category does, and how to scope a rollout.

## What the Compliance API gives you

The API exposes two streams of data:

**1. Conversation content** — chats, uploaded files, and projects from Claude Enterprise. The actual content of what users typed, what they uploaded, and what Claude returned.

**2. Activity events** — login events, admin actions, sharing actions, connector authorizations, and policy changes across Claude Enterprise and the Claude Platform. The "who did what when" stream.

Each stream has its own endpoint and its own access scope. You can subscribe to events only if your compliance scope doesn't require content inspection, or you can pull both for full DLP-style coverage.

Authentication uses an **Admin API key** (\`sk-ant-admin...\`), the same scheme as the [Rate Limits API](/articles/claude-rate-limits-api). Standard API keys are rejected. Only an org owner can mint an Admin key, in **Console → Settings → Admin Keys**.

The streams are pull-based today. Webhooks are on the roadmap but not in the GA release.

## The 28 partner integrations, grouped by job

The launch partners cover eight categories. Each handles a different supervision job, and most enterprise stacks already run a tool from at least three of them.

### Data Loss Prevention (DLP)

**Microsoft Purview, Forcepoint, Proofpoint, Trellix, Varonis, Mimecast**

These tools watch the conversation content stream and apply your existing DLP policies — same regex sets, same classifiers, same workflows. If your Outlook DLP already blocks SSNs in outbound mail, the integration extends that policy to Claude chats and uploads. Findings route into the same triage queue.

### SASE / Secure Web Gateways

**Cloudflare, Zscaler, Netskope, Palo Alto Networks**

SASE vendors get both streams. The pitch: instead of treating Claude as another SaaS app you watch from the outside, you see what's *inside* the sessions — so your tenant-controls (block file uploads, require step-up auth on sensitive prompts) work natively rather than depending on URL pattern matching.

### Data Security Posture Management (DSPM)

**Cyera, Rubrik, Geordie AI**

DSPM tools were built to map where sensitive data lives. With the Compliance API they can see when sensitive data flows *into* Claude — a category they previously couldn't see because LLM sessions weren't enumerable.

### SIEM and Security Operations

**CrowdStrike, Datadog, Sumo Logic, IBM Guardium, ReliaQuest**

Activity events route into your SIEM as a new log source. Same dashboards, same alerting rules, same retention policy. CrowdStrike correlates Claude events with endpoint telemetry; Datadog plots them next to your application traces.

### Identity Governance

**Okta, SailPoint**

These pull admin actions and user-group changes from Claude Enterprise back into your identity governance system, so access reviews and SOX-style attestations include Claude in scope.

### eDiscovery

**Smarsh, Relativity, Theta Lake**

For regulated industries (finance, legal, healthcare) where chat content has to be retained and producible in a litigation hold. Compliance content is captured into the same archive that captures Slack and Teams.

### AI Security Posture Management (AI-SPM)

**Wiz, Snyk**

The newest category — tools that scan AI usage patterns specifically for prompt injection, exfiltration patterns, and shadow-AI risks. The integration gives them access to the prompt-and-response stream they need to actually scan.

### Observability

**Fortinet, Tenable**

Mostly for network-level inspection — pulling enough metadata to confirm Claude traffic patterns match what's been approved.

## What this changes for IT

Three concrete shifts:

**1. Claude stops being a separate audit surface.** Before this release, an IT team that wanted to govern Claude either pulled the Audit Log CSV manually or scraped the Admin API by hand. Now the data lands in the same dashboards as everything else — Microsoft 365, Slack, Salesforce. The same person who runs your weekly DLP triage can include Claude without learning a new tool.

**2. The procurement objection gets easier.** The single biggest blocker for Enterprise sales has been *"we don't have visibility into AI tools the way we do into other SaaS."* Naming Cloudflare or Wiz or Purview as a configured integration shortens that conversation. For James-style IT directors building a business case, this is a checkbox item that moves.

**3. The "personal Claude data shouldn't be visible to my employer" boundary gets clearer.** The Compliance API only covers Claude Enterprise and the Claude Platform — not Pro accounts. If your employees use a personal Pro account on the side, that traffic remains outside the supervisory net. The right answer is the same as before: [keep work and personal accounts separate](/articles/what-to-share-with-claude), but now the lines are enforced by the architecture rather than by trust.

## A rollout pattern that actually works

If your org is mid-sized (Claude Enterprise but no dedicated AI governance team), most rollouts look like this:

**Week 1 — Inventory.** List which of the 28 partners you already pay for. Most orgs have at least one DLP, one SIEM, and one identity tool. Those three are your starting integrations.

**Week 2 — Enable activity events first.** Activity events are the lower-stakes stream. Wire CrowdStrike or Datadog up to ingest events into your existing SOC dashboard. Verify the volume looks sane (you'll see roughly one event per user per session, plus admin actions).

**Week 3 — Enable conversation content into DLP.** Once activity events are clean, add content into Microsoft Purview or Forcepoint. Start with a *log-only* rule for two weeks — see what your existing policies flag — before flipping to *block* on anything.

**Week 4 — Add identity governance and eDiscovery if you need them.** Most teams don't, but regulated industries do. Plan the access-review cadence the same way you'd plan it for Slack.

**Avoid:** turning on all eight categories at once. Each one has a noise profile, and triaging eight new feeds in parallel is the fastest way to alert-fatigue the SOC into ignoring the AI category entirely.

## What's missing

A few honest gaps in the May 21 release:

- **No webhooks yet.** Everything is pull-based. Real-time alerting depends on your SIEM polling frequency.
- **No native Splunk integration in launch partners.** Sumo Logic and Datadog are in; Splunk is conspicuously not. Anthropic hasn't said why. A custom Splunk universal-forwarder ingestion against the raw API is the workaround until that lands.
- **Pricing isn't itemized.** The Compliance API is included with Claude Enterprise, but partner integrations bill separately through each partner. Confirm with each vendor what their per-event or per-seat surcharge looks like — a few of them already had separate AI-feature tiers.

## Related reading

- [Getting IT approval for Claude](/articles/getting-it-approval-for-claude) — the business-case template the Compliance API answers half of
- [Claude admin controls (April 2026)](/articles/claude-admin-controls-2026) — the previous batch of admin controls this release builds on
- [Claude Team vs Enterprise for IT](/articles/claude-team-vs-enterprise-for-it) — the plan-level differences (Compliance API is Enterprise only)
- [Claude admin security and privacy](/articles/claude-admin-security-privacy) — the architectural baseline

---

*Source: [Claude now works with more security and compliance tools](https://claude.com/blog/compliance-api-security-partners), Anthropic blog, May 21, 2026.*`,
  },
]

async function seed() {
  console.log('Seeding Batch 78 — Claude Compliance API...\n')

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
