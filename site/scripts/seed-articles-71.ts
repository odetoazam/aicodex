/**
 * Batch 71 — Anthropic announcements: Rate Limits API + Consumer connectors (April 23–24, 2026)
 *
 * 1. claude-rate-limits-api
 *    The Rate Limits API entered availability on April 24, 2026. Lets admins
 *    programmatically read the rate limits configured for their org and workspaces.
 *    DEV_SLUGS (admin/dev). Cluster: Claude API. Angle: update.
 *
 * 2. claude-everyday-connectors
 *    On April 23, 2026 Anthropic shipped 15 consumer-facing connectors
 *    (Spotify, Uber, Booking.com, Audible, Resy, Instacart, AllTrails, Audible,
 *    Credit Karma, TurboTax, StubHub, Taskrabbit, Thumbtack, Tripadvisor, Viator).
 *    First major push of Claude beyond work. Frames what's new and how to think
 *    about it for someone who uses Claude at work.
 *    PRODUCTIVITY_SLUGS. Cluster: Features & Updates. Angle: update.
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-71.ts
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
    slug: 'claude-rate-limits-api',
    angle: 'update',
    title: 'The Rate Limits API: read your org limits in code',
    excerpt: "Anthropic shipped the Rate Limits API on April 24, 2026. It lets admins read the rate limits configured for their organization and workspaces over HTTP, so gateways, alerting, and provisioning automation stop drifting against hardcoded numbers. Here's what it returns, how to call it, and where it fits in an admin stack.",
    readTime: 7,
    cluster: 'Claude API',
    audience: ['developer'],
    termSlug: 'rate-limiting',
    body: `Until April 24, 2026, the only place to read your org's Claude rate limits was the **Limits** page in the Claude Console. If a gateway, proxy, or alerting system needed those numbers, you copied them by hand and re-copied them whenever Anthropic adjusted them.

The new Rate Limits API exposes the same data over HTTP. It returns the limits configured for your organization and any per-workspace overrides, broken out by model group, batch jobs, files, skills, and the web search tool.

It is read-only. You still set workspace overrides in the Console.

## Who this is for

This is an Admin API endpoint. Three concrete use cases the official docs call out:

- **Gateways and proxies** — read your current limits at startup and on a schedule, instead of hardcoding values that drift over time.
- **Internal alerting** — combine these limits with the [Usage and Cost API](https://platform.claude.com/docs/en/build-with-claude/usage-cost-api) to alert when a workspace is approaching its ceiling.
- **Provisioning audits** — verify that the workspace overrides set by your automation match what's actually in place.

If your org runs Claude through a single shared API key with no Console workspaces, you probably don't need this. If you've split usage into workspaces — per team, per environment, per customer — and have anything reading limits today, this replaces a manual step.

## Authentication

The Rate Limits API is part of the Admin API. It requires an **Admin API key** (it starts with \`sk-ant-admin...\`), which is different from a regular API key. Only an org admin can mint one, in **Console → Settings → Admin Keys**.

Standard \`sk-ant-api03-...\` keys will get a 401 on these endpoints.

## Two endpoints

### Organization limits

\`\`\`bash
curl "https://api.anthropic.com/v1/organizations/rate_limits" \\
  --header "anthropic-version: 2023-06-01" \\
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"
\`\`\`

The response is a list of **rate limit groups**. Each group covers a category of resources — for example, all Opus models share one limit group; the Message Batches API has its own; agent skills have their own.

A typical entry:

\`\`\`json
{
  "type": "rate_limit",
  "group_type": "model_group",
  "models": [
    "claude-opus-4-5",
    "claude-opus-4-5-20251101",
    "claude-opus-4-6",
    "claude-opus-4-7"
  ],
  "limits": [
    { "type": "requests_per_minute",       "value": 4000 },
    { "type": "input_tokens_per_minute",   "value": 2000000 },
    { "type": "output_tokens_per_minute",  "value": 400000 }
  ]
}
\`\`\`

The \`models\` field tells you which model strings count against this group. Every model ID and alias you can pass to the Messages API appears in exactly one \`model_group\` entry.

To look up the limits for a specific model, pass it as a query parameter:

\`\`\`bash
curl "https://api.anthropic.com/v1/organizations/rate_limits?model=claude-opus-4-7" \\
  --header "anthropic-version: 2023-06-01" \\
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"
\`\`\`

If the model string doesn't match any group, you get a 404.

### Workspace overrides

\`\`\`bash
curl "https://api.anthropic.com/v1/organizations/workspaces/$WORKSPACE_ID/rate_limits" \\
  --header "anthropic-version: 2023-06-01" \\
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"
\`\`\`

This endpoint returns **only the overrides** set on the workspace. Anything missing is inherited from the organization, not unlimited.

For each overridden limiter, the response includes the workspace value and the org value side by side:

\`\`\`json
{
  "limits": [
    { "type": "requests_per_minute",     "value": 1000,  "org_limit": 4000    },
    { "type": "input_tokens_per_minute", "value": 500000,"org_limit": 2000000 }
  ]
}
\`\`\`

To get the **effective** limits a workspace is operating under, you merge the workspace response on top of the org response. A short helper:

\`\`\`typescript
async function effectiveLimits(workspaceId: string) {
  const [org, ws] = await Promise.all([
    fetch('https://api.anthropic.com/v1/organizations/rate_limits', {
      headers: { 'anthropic-version': '2023-06-01', 'x-api-key': process.env.ANTHROPIC_ADMIN_KEY! },
    }).then(r => r.json()),
    fetch(\`https://api.anthropic.com/v1/organizations/workspaces/\${workspaceId}/rate_limits\`, {
      headers: { 'anthropic-version': '2023-06-01', 'x-api-key': process.env.ANTHROPIC_ADMIN_KEY! },
    }).then(r => r.json()),
  ])

  // Index workspace overrides by group_type + (first model, if any) for merge
  const overrides = new Map<string, Map<string, number>>()
  for (const g of ws.data) {
    const key = g.group_type + ':' + (g.models?.[0] ?? '')
    overrides.set(key, new Map(g.limits.map((l: any) => [l.type, l.value])))
  }

  return org.data.map((g: any) => {
    const key = g.group_type + ':' + (g.models?.[0] ?? '')
    const o = overrides.get(key)
    return {
      ...g,
      limits: g.limits.map((l: any) => ({
        type: l.type,
        value: o?.get(l.type) ?? l.value,
        source: o?.has(l.type) ? 'workspace' : 'org',
      })),
    }
  })
}
\`\`\`

You can also filter either endpoint by \`group_type\`. Valid values are \`model_group\`, \`batch\`, \`token_count\`, \`files\`, \`skills\`, and \`web_search\`.

## What's not in the response

A few things to know up front:

- **Limits for Claude Managed Agents are not included.** That product has its own resource model.
- **You can't update limits with this API.** Workspace overrides are still set in the Console.
- **The default workspace has no entry on the workspace endpoint.** Use the org endpoint to read its limits.
- **Pagination is in place but currently every response is a single page.** \`next_page\` is always \`null\` today. The docs recommend looping on \`next_page\` anyway so your client doesn't break when responses grow.

## Where this fits in an admin stack

Two patterns the API was built for:

**At gateway startup.** A team running an internal Claude gateway can fetch its workspace's effective limits at boot and use them to size local rate limiters. Re-fetch on a schedule (every few hours) so a Console change in limits propagates without a deploy.

**As an alerting input.** Combine this endpoint with the Usage and Cost API. The Usage API tells you tokens consumed in the last interval; this endpoint tells you the ceiling. Compute the ratio per workspace and fire an alert at, say, 80%. This catches workspaces that are about to start failing before users feel it.

The right cadence depends on how often your org changes limits. Most orgs can poll daily. Gateways can re-fetch every few hours.

## Related reading

- [Building a business case for Claude](/articles/building-a-business-case-for-claude) — when admin overhead like this matters
- [Claude admin ongoing maintenance](/articles/claude-admin-ongoing-maintenance) — fits in the regular admin pass
- [Rate limiting Claude API](/articles/rate-limiting-claude-api) — the client-side companion: handling 429s in your app

---

*Source: [Rate Limits API](https://platform.claude.com/docs/en/build-with-claude/rate-limits-api), released April 24, 2026 per the [Claude Platform release notes](https://platform.claude.com/docs/en/release-notes/overview).*`,
  },
  {
    slug: 'claude-everyday-connectors',
    angle: 'update',
    title: 'Claude\'s new everyday connectors: Spotify, Uber, Booking.com, and 12 more',
    excerpt: "On April 23, 2026 Anthropic shipped 15 consumer connectors that have nothing to do with work — Spotify, Uber, Booking.com, Audible, Resy, Instacart, and others. They're available on every plan, including Pro. Here's what's in the set, how it works, and what it changes for someone who already uses Claude for work.",
    readTime: 6,
    cluster: 'Features & Updates',
    audience: ['operator'],
    termSlug: 'connector',
    body: `Anthropic's connector library was a work-tool list until last week. Google Workspace, Slack, Salesforce, Notion, GitHub. The April 23, 2026 release adds 15 connectors that are not work tools at all.

The new set:

- **AllTrails** — search hikes, filter by difficulty, dog-friendliness, season
- **Audible** — pull your library, get listening recommendations
- **Booking.com** — search hotels and accommodations
- **Instacart** — build grocery carts, manage shopping
- **Intuit Credit Karma** — credit and personal-finance lookups
- **Intuit TurboTax** — tax-prep assistance
- **Resy** — restaurant reservations
- **Spotify** — playback control, playlist building
- **StubHub** — event tickets
- **Taskrabbit** — local task help
- **Thumbtack** — local service providers
- **Tripadvisor** — travel reviews and itinerary research
- **Uber** — rides
- **Uber Eats** — food delivery
- **Viator** — tours and activities

Connectors are available on **every plan**, including Pro. Mobile is in beta — expect rough edges in the iOS and Android apps for a few weeks.

## What "connector" means here

A connector is an integration Claude can call mid-conversation. You enable it once, authenticate to the third-party service, and from then on Claude can read or act in that service when the conversation calls for it.

Practically, that means a sentence like *"book a 7pm reservation for two at a Thai place near me on Friday"* now has a path to actually do the reservation, not just suggest one. Claude calls the Resy connector, finds matching restaurants, and surfaces a confirm step.

This is the same plumbing as the work connectors. The difference is which tool sits behind it.

## How to enable one

In the Claude apps:

1. Open **Settings → Connectors**.
2. Find the connector in the directory.
3. Click **Connect** and complete the auth flow with the third party.
4. The connector becomes available in any new chat. You can disable per-chat if you don't want it active.

In Claude Desktop on macOS or Windows, the path is the same.

If you're on a Team or Enterprise plan, your admin controls the directory — they can allowlist or block specific connectors. The everyday connectors are likely off by default in admin-controlled plans because they're not work tools.

## What changes for someone who uses Claude at work

Three honest takes:

**1. Most of these don't belong in your work account.** If your employer pays for Claude Team or Enterprise, the data your work account sees is in scope for IT and audit. Linking Spotify or Uber Eats to that account routes personal data through a work surface. Use a personal Pro account for personal connectors.

**2. The home/work split matters more now.** Before this release, Claude was a work tool that some people also used personally. After this release, it's plausibly an everyday assistant. If you've been using one Claude account for both, that's a good moment to set up a clean split: work account on the org plan, personal account on Pro.

**3. The product is testing the agentic path on low-stakes use cases.** Restaurant reservations, ride bookings, and grocery carts are forgiving. If Claude books the wrong table, you reschedule. This release is partly Anthropic stress-testing the connector + action loop on tasks where the consequences of a wrong tool call are recoverable. Expect lessons learned here to show up in the work connectors over the next few months.

## What's missing (and likely coming)

Several obvious slots aren't filled:

- No **calendar** connector for personal Gmail / iCloud (only Workspace)
- No **banking** beyond Credit Karma
- No **fitness** (Strava, Apple Health, Whoop)
- No **smart home** (HomeKit, Google Home, SmartThings)
- No **OpenTable** alongside Resy
- No **Lyft** alongside Uber

The set looks like a deliberate first batch focused on partners with clean APIs and clear permission models, not a full personal-life suite. The next set will fill obvious gaps; calendar and fitness are the two most-asked across early launch coverage.

## Privacy and data handling

Per Anthropic's standard policy, Pro and Max accounts don't train on your data. Connectors don't change that — but they do change what data Claude sees in a session. A single message can now pull your Spotify listening history, your Uber trip log, and your Resy bookings into the conversation context.

Two practical guardrails:

- **Treat connector-fed data as visible to Claude.** Don't enable a connector you wouldn't be comfortable having Claude read in detail.
- **Disable connectors per chat when you don't need them.** A long conversation about work shouldn't have your personal financial connector silently in scope.

## What to read next

- [Connectors best practices](/articles/connectors-best-practices) — how connectors work in general
- [How to write precise connector instructions](/articles/how-to-write-precise-connector-instructions) — getting consistent output once a connector is in scope
- [What to share with Claude](/articles/what-to-share-with-claude) — the privacy framework

---

*Source: [New connectors in Claude for everyday life](https://claude.com/blog/connectors-for-everyday-life), Anthropic blog, April 23, 2026.*`,
  },
]

async function seed() {
  console.log('Seeding Batch 71 — Rate Limits API + Everyday Connectors...\n')

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
