/**
 * Batch 61 — Feature Briefs: Ask Your Org + new admin controls
 *
 * 1. ask-your-org-guide
 *    What "Ask Your Org" (Enterprise Search) is, how it works,
 *    and what it means for admins vs. individual users vs. builders.
 *    Team + Enterprise only. Angle: 'update'.
 *
 * 2. claude-admin-controls-2026
 *    New admin controls shipped April 2026: user groups (SCIM), role-based
 *    access, per-user spend caps, managed Claude Code policies, Compliance API.
 *    Written for IT admins and team owners. Angle: 'update'.
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-61.ts
 */

import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const ARTICLES = [

  // ── 1. Ask Your Org ──────────────────────────────────────────────────────
  {
    slug: 'ask-your-org-guide',
    angle: 'update',
    title: 'Ask Your Org: how to use Claude\'s built-in company knowledge search',
    excerpt: 'Anthropic added a pre-configured project that searches across your company\'s Slack, email, Google Drive, and SharePoint in one place. Here\'s what it does, whether it applies to you, and how to get started.',
    readTime: 5,
    cluster: 'Features & Updates',
    body: `Anthropic added a feature to Claude called Ask Your Org. It's a pre-configured project that lets you ask questions in plain English — and Claude searches across your connected company tools simultaneously, then gives you a single synthesized answer with sources.

Instead of searching Slack, checking Google Drive, scanning email, and opening SharePoint separately to find something, you ask one question and get one answer that pulls from all of them.

## What changed

When you open Claude on a Team or Enterprise plan, you'll see a project called "Ask Your Org" in your sidebar. Once an admin completes the setup, it connects to your company's data sources and becomes searchable by everyone in the org.

Claude searches across:
- Slack conversations
- Microsoft 365 (SharePoint documents and email)
- Google Workspace (Gmail and Google Drive)
- Any custom data sources added via MCP connectors

The search is permission-aware: Claude only shows you information you could already access in the original tool. If you don't have access to a Slack channel, Ask Your Org won't surface conversations from it.

Your searches count against your normal usage limits. Anthropic doesn't index or store your data — queries go directly to the connected source systems.

## If you're managing Claude for your org

Ask Your Org is off by default until an Owner completes setup. Here's what that looks like:

1. Open Ask Your Org in the Claude sidebar and click "Set up for your org"
2. Connect your data sources — you'll need to add at least a Documents connector and a Chat connector (email is optional)
3. Add any additional tools or MCP connectors for internal systems
4. Name the project and save

Once active, it's available to everyone in your organization automatically.

To turn it off org-wide: Organization Settings → Capabilities → Disable.

The key compliance point: no data is indexed or stored by Anthropic. Each query hits the source system directly. You only see what you already have permission to access. This is the answer most IT/legal teams will ask about first.

## If you're using Claude in your daily work

The practical shift: questions that used to require switching between 4–5 tools can now start with a single Ask Your Org query.

Useful for:
- "What did we decide about [topic] in Slack last month?" — searches channels you have access to
- "What's our policy on [X]?" — searches SharePoint and Drive for relevant docs
- "What were the action items from the [client] call?" — searches email threads and meeting notes
- "Summarize everything we know about [prospect] before the call" — pulls from email, docs, and Slack in one go

The answers come with source citations — you can click through to the original document or message.

One limit to know: responses count against your usage limits the same as any other Claude conversation. Long multi-source queries on large data sets take more time than simple questions.

## If you're building with Claude

Custom connectors via MCP let you add internal data sources that aren't Slack/M365/Google — a proprietary database, a ticketing system, a wiki. The standard MCP connector interface applies.

If your organization has internal tools that would be useful to query alongside standard data sources, this is the route. The [MCP documentation](https://platform.claude.com/docs/en/build-with-claude/mcp) covers how to build and register connectors.

## What to do right now

**On Team or Enterprise:** Check if Ask Your Org is already set up by looking for it in your Claude project sidebar. If it's there and connected, you can start using it immediately.

**If you're an Owner and it's not set up yet:** The setup takes about 15 minutes. The main step is authenticating with your connected tools (Google Workspace or Microsoft 365 requires OAuth authorization). Once done, it's available org-wide.

**On Pro or Max:** Ask Your Org requires a Team or Enterprise plan. It's not available on individual plans.

**Related:** [Setting up Claude for your team](/articles/setting-up-claude-for-your-team) · [Getting IT approval for Claude](/articles/getting-it-approval-for-claude)`,
  },

  // ── 2. New admin controls 2026 ───────────────────────────────────────────
  {
    slug: 'claude-admin-controls-2026',
    angle: 'update',
    title: 'What\'s new in Claude admin controls: groups, spend limits, and compliance',
    excerpt: 'Anthropic added a significant set of admin capabilities in April 2026: user groups with custom roles, per-user spend caps, managed Claude Code policies, and a new Compliance API for Enterprise. Here\'s what each control does and which plan it requires.',
    readTime: 6,
    cluster: 'Features & Updates',
    body: `Anthropic shipped a meaningful batch of admin controls in April 2026, alongside the launch of Claude Code on Team and Enterprise plans. If you manage Claude for your organization, several of these change what you can actually do in the admin panel.

This covers what's new, what each control does, and which plan it applies to.

## User groups and role-based access

You can now organize users into groups and assign each group a custom role that defines which Claude capabilities they can access.

Groups can be created manually in the admin panel, or synced automatically from your identity provider via SCIM (System for Cross-domain Identity Management). If your company uses Okta, Azure AD, or a similar IdP, SCIM sync means group membership updates automatically when someone joins or leaves a team — you don't manage it manually.

Each group gets a role that controls:
- Which Claude products (Chat, Cowork, Code) the group can use
- Which tools and MCP servers are available
- File access permissions
- Any restrictions specific to the department or role

**What this solves:** Previously, all users in an org had the same capabilities. If you wanted to give your engineering team access to Claude Code but not expose it to everyone, you had no way to do that. Now you can.

**Available on:** Team and Enterprise plans.

## Per-user spend controls

Admins can now set spending limits at two levels:
- **Organization-wide** — a monthly ceiling for the whole org
- **Per-user** — a limit for individual accounts

This matters most for orgs using Claude Code or extra usage beyond the base plan. When a user hits their limit, they can continue with standard usage but the overage stops. Admins set the caps; users see their current usage and remaining budget.

**Available on:** Team and Enterprise plans.

## Managed Claude Code policies

If your org is on Team or Enterprise with Claude Code enabled, admins can now push and enforce Claude Code configurations across all developer accounts.

Manageable settings include:
- Which tools Claude Code is allowed to use
- File access restrictions (which directories or repos Claude Code can touch)
- Which MCP servers are permitted
- Usage policies aligned to your internal security guidelines

This means a developer on your team doesn't have to manually configure these — and can't override them. The settings deploy centrally and apply to the desktop app and terminal sessions.

**What this solves:** Teams running Claude Code were previously relying on individual developers to configure CLAUDE.md files and personal settings correctly. Managed policies let ops/security teams enforce a consistent baseline without depending on each developer to get it right.

**Available on:** Team and Enterprise plans.

## Claude Code usage analytics

The admin panel now includes Claude Code usage metrics across your org:
- Lines of code accepted
- Suggestion accept rate
- Usage patterns by user and team
- Session volume over time

These integrate with the Analytics API, so you can pull them into your existing dashboards. OpenTelemetry is supported for teams running observability infrastructure.

**Available on:** Team and Enterprise plans.

## Compliance API (Enterprise only)

Enterprise plans now have programmatic access to usage data and customer content via a new Compliance API.

What this enables:
- Real-time access to Claude usage logs and conversation content
- Integration with existing compliance dashboards (Splunk, Datadog, etc.)
- Automated policy enforcement — flag conversations matching criteria, trigger alerts
- Selective deletion — remove specific conversations or user data via API for data retention management

This is primarily for legal, compliance, and security teams who need to monitor AI usage for regulatory or policy reasons, or who need to demonstrate compliance in audits.

**Available on:** Enterprise plans only.

## Self-serve seat management

Team and Enterprise admins can now purchase seats, adjust seat count, and provision users directly from the admin panel — without going through account management. This covers:
- Adding seats as the team grows
- Removing seats when people leave
- Provisioning new users directly

**Available on:** Team and Enterprise plans.

## Summary table

| Control | What it does | Plan |
|---|---|---|
| User groups + SCIM | Organize users into teams; sync from IdP | Team + Enterprise |
| Custom roles | Define which Claude features each group can access | Team + Enterprise |
| Per-user spend caps | Set monthly usage ceilings by user or org | Team + Enterprise |
| Managed Claude Code policies | Push tool/file/MCP settings to all developers | Team + Enterprise |
| Usage analytics | Lines accepted, accept rate, session volume | Team + Enterprise |
| Compliance API | Programmatic access to logs + selective deletion | Enterprise only |
| Self-serve seat management | Buy seats, provision users from admin panel | Team + Enterprise |

## What to do right now

**If you're an IT admin or org Owner:** Check your admin panel at [claude.com/settings/organization](https://claude.com/settings/organization). The new controls are live — you don't need to request access.

**If you use an IdP like Okta or Azure AD:** SCIM sync is the highest-leverage thing to set up first. It keeps group membership current automatically and saves ongoing manual work.

**If you have Claude Code on your plan:** Review the managed policies before rolling them out — the default settings are permissive. Setting tool restrictions and file access limits now is easier than unwinding an incident later.

**Related:** [Getting IT approval for Claude](/articles/getting-it-approval-for-claude) · [Ask Your Org guide](/articles/ask-your-org-guide) · [Setting up Claude for your team](/articles/setting-up-claude-for-your-team)`,
  },

]

async function seed() {
  console.log('Seeding Batch 61 — Ask Your Org + Admin Controls 2026...\n')

  for (const a of ARTICLES) {
    const payload = {
      slug:      a.slug,
      angle:     a.angle,
      title:     a.title,
      excerpt:   a.excerpt,
      body:      a.body,
      read_time: a.readTime,
      cluster:   a.cluster,
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
