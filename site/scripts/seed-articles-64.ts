/**
 * Batch 64 — Persona-gap fills (April 19, 2026)
 *
 * 1. claude-team-vs-enterprise-for-it
 *    James's gap. Scannable side-by-side comparison: data handling, compliance,
 *    admin controls, identity, retention. Print-friendly, share-with-legal format.
 *    Angle: 'role'. Cluster: Administration. PINNED_OPERATOR candidate.
 *
 * 2. documenting-claude-setup-for-client-handoff
 *    Sofia's gap. How to document a Claude setup (Projects, system prompts,
 *    workflows, connectors) so a client can maintain it after the consultant leaves.
 *    Distinct from client-handoff-with-claude (deliverable handoff).
 *    Angle: 'process'. Cluster: For Agencies. AGENCIES_SLUGS.
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-64.ts
 */

import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const ARTICLES = [

  // ── 1. Claude Team vs. Enterprise for IT ────────────────────────────────
  {
    slug: 'claude-team-vs-enterprise-for-it',
    angle: 'role',
    title: 'Claude Team vs. Enterprise: the actual differences, for IT and legal',
    excerpt: 'Scannable side-by-side: data handling, compliance, identity, admin controls, and retention. Written to be shared with legal without edits.',
    readTime: 6,
    cluster: 'Administration',
    body: `When Priya forwards her Claude business case to her VP, and the VP forwards it to IT, this is the next thing IT needs. Not a sales-page feature grid — a straight read on what actually differs for compliance, identity, and data handling.

The numbers below are accurate as of April 2026. Anthropic publishes current details at [claude.com/pricing](https://claude.com/pricing) and [trust.claude.com](https://trust.claude.com) — verify before signing anything.

## The short version

**Both plans do not train on your data.** That's the single most common question and it has the same answer on both tiers: Anthropic does not train Claude on inputs or outputs from any paid plan, Team or Enterprise.

**Team is built for one department or small company** — shared Projects, basic admin, SSO via Google/Microsoft only, 30-day default retention. Most mid-size teams never need more than this.

**Enterprise adds the controls IT needs at scale** — SAML/SCIM, audit logs, Compliance API, custom retention, role-based access, per-user spend caps, BAA/HIPAA, data residency options, and a real DPA with custom terms.

If you can answer "yes" to any of these, you want Enterprise, not Team:

- We need SSO/SAML with our IdP (Okta, Azure AD, etc.)
- We need automated user provisioning (SCIM)
- We need audit logs for compliance review
- We're in healthcare and need a BAA for HIPAA
- We need data residency outside the US
- We need role-based permissions beyond "admin vs. user"
- We need per-user spend limits or usage analytics by group

Everything else is better at Team's price point.

## Side-by-side: what actually differs

| Dimension | Team | Enterprise |
|-----------|------|------------|
| **Training on customer data** | No | No |
| **Default data retention** | 30 days | Configurable (customer-defined) |
| **SSO** | Google / Microsoft only | SAML / any IdP |
| **User provisioning** | Manual invite | SCIM (automated) |
| **Audit logs** | Basic admin activity | Full audit log + Compliance API |
| **Role-based access** | Admin / user | Granular roles + user groups |
| **Per-user spend caps** | No | Yes |
| **Usage analytics** | Per workspace | Per user, per group, per feature |
| **BAA for HIPAA** | No | Yes (request during contracting) |
| **Data residency** | US | US + other regions on request |
| **DPA / custom terms** | Standard MSA | Negotiable DPA and terms |
| **MCP / connector policy controls** | Per-workspace toggle | Managed policies enforced org-wide |
| **Claude Code usage analytics** | Limited | Full (per-user, per-repo) |
| **Support** | Email / help center | Named account team, SLAs |

## What this means for common compliance questions

**"Is our data used to train future models?"**
No, on either plan. This is a contractual commitment across Team and Enterprise.

**"Where is our data processed and stored?"**
Team: US regions. Enterprise: US by default, with data residency options (EU, other) available on request during contracting. Processing regions are listed in Anthropic's sub-processor documentation.

**"How long is data retained?"**
Team: 30 days by default, then purged. Enterprise: configurable — you can set retention to zero (no retention beyond the request) or extend it for audit purposes.

**"Can we get an audit log of what users did?"**
Team has basic admin activity logs. Enterprise has a full audit log plus a Compliance API that lets you query user activity, conversations, and admin changes programmatically — the same pattern you'd use with any enterprise SaaS auditing tool.

**"Do you sign a BAA for HIPAA?"**
Enterprise only. Request it during the contracting process, not after signing the MSA.

**"What do our users have access to, and can we lock it down?"**
Both plans let admins toggle connectors and Claude Code at the workspace level. Enterprise adds role-based access, user groups (managed via SCIM or manually), and managed policies that enforce MCP / tool permissions across the org — users cannot toggle around them.

**"Can we cap spend per user?"**
Enterprise only. Team does per-workspace billing; per-user caps require Enterprise.

**"Can we integrate with our SIEM?"**
Enterprise — via the Compliance API and the audit log export.

## The pricing question nobody wants to ask

Team is public pricing ($30/user/month). Enterprise is custom, typically starting around $60/user/month for small deployments and scaling down per-seat for larger commitments. Anthropic will usually quote quickly if you already have headcount and a timeline.

The hidden cost nobody flags: an organization on Team that grows past ~200 users usually ends up needing SSO/SCIM for operational reasons (people come and go, manual provisioning breaks). At that point, you're moving to Enterprise anyway. If you know you're going to cross 200 users in the next 12 months, start on Enterprise.

## When Team is the right call (even at scale)

Not every large organization needs Enterprise on day one. Team is the right choice when:

- A single department wants to roll out Claude ahead of the rest of the org
- You want to pilot without a long contracting cycle
- Your IdP isn't SAML-based or SCIM is already handled elsewhere
- You don't yet need audit-grade compliance (no HIPAA, no SOC 2 customer asks, no data residency requirements)

Many companies run Team for a department for 6 months, learn what they actually need, and then move to Enterprise with a clear set of requirements. This is a cleaner path than over-contracting upfront.

## What to bring to your internal review

If IT or legal is reviewing Claude for approval, this is the packet:

1. Anthropic's [trust center](https://trust.claude.com) — SOC 2 Type II, GDPR, ISO 27001 documentation
2. The [Data Processing Agreement](https://www.anthropic.com/legal/commercial-terms) (Team) or a negotiated DPA (Enterprise)
3. The [Acceptable Use Policy](https://www.anthropic.com/legal/aup) — content that's out of bounds
4. This comparison table (save the page and forward it)

## Try this today

If you're the person building the case for your org: copy the "side-by-side" table above into a one-page PDF. Add two columns next to it — one for "our current tool" and one for "our requirement." Fill in what you already use and what you actually need. That document goes to IT, not a sales deck.

---

*The [business case guide](/articles/building-a-business-case-for-claude) covers the pitch. The [IT approval guide](/articles/getting-it-approval-for-claude) covers what IT asks for. This is the reference document that answers their questions once they're engaged.*

## Further reading

- [Trust center](https://trust.claude.com) — current certifications and compliance details
- [Pricing page](https://claude.com/pricing) — current per-seat pricing
- [Support: data handling for Team / Enterprise](https://support.claude.com) — Anthropic's own data handling docs`,
  },

  // ── 2. Documenting Claude setup for client handoff ──────────────────────
  {
    slug: 'documenting-claude-setup-for-client-handoff',
    angle: 'process',
    title: 'Documenting your Claude setup so the client can maintain it',
    excerpt: 'Client handoff is where most consultants lose the long-term value of what they built. The five things to write down, the format that works, and what to test before you leave.',
    readTime: 7,
    cluster: 'For Agencies',
    body: `You set up Claude Projects, wrote the system prompts, configured the connectors, built the workflows. The client paid for the work. Six months later they email you: "Hey, Claude isn't doing the thing you set up. Can you take a look?"

What they actually need is not for you to take a look. They need to be able to maintain what you built. If your handoff didn't include the documentation to do that, the setup will degrade until they turn it off — and the next consultant gets the work.

This is distinct from delivering the client's deliverable (covered in [client-handoff-with-claude](/articles/client-handoff-with-claude)). This is about the *system* you built inside Claude becoming maintainable by someone who didn't build it.

## The five things to document (and the order)

Write these in this order, because each one depends on the previous one being clear.

### 1. The inventory

List every Claude artifact you created for the client, with the name, owner (which Claude user created it), and a one-line purpose.

Minimum inventory:

- **Projects** — name, purpose, who should have access, what the shared system prompt does
- **System prompts** — where used (Project? individual prompts? API?), full text saved to a document the client owns
- **Connectors** — which connectors are enabled, what data sources they point to, which Projects use them
- **Skills** — which Skills are enabled at the workspace or Project level
- **Claude Code setup** (if any) — repos with \`.claude/\` folders, what hooks are configured, what's in CLAUDE.md
- **Hook scripts** (if any) — where they live, what they do, what breaks if they stop running

One person on the client's side should be named as the owner of each item. Without an owner, nothing gets maintained.

### 2. The "why" for each piece

For every artifact in the inventory, write one or two sentences about *why* it exists. Not what it does — the client can read the system prompt to see what it does. Why you chose this approach over alternatives.

Example:

> **Project: Customer Support Drafts**
> Why: We chose a single shared Project instead of individual user prompts because support responses need consistent tone across the team. If one rep writes more formally than another, customers notice. The shared system prompt enforces the tone; individual reps add case-specific context in each chat.

The "why" is what lets the client's next consultant (or the client themselves) decide whether to keep your approach when requirements change.

### 3. The maintenance schedule

Tell them when things need attention. This is the part most consultants skip.

Minimum maintenance schedule:

| Artifact | Check every | What to look for |
|----------|-------------|------------------|
| Project system prompts | Quarterly | Has the team's process changed? Are there examples in the prompt that are now stale? |
| Connectors | Monthly | Are the data sources still current? Did anyone rotate credentials? |
| Skills | Quarterly | Did Anthropic update the Skill? Does a new one replace it? |
| Claude Code hooks | When any script it depends on changes | Does the hook still exit 0 on normal conditions? |
| Usage + cost | Monthly | Are the numbers in the ballpark you set up? Any user spiking unexpectedly? |

This document gets added to the client's existing recurring-task list (calendar, Asana, whatever). If it only lives in your handoff PDF, no one will remember to do it.

### 4. The failure modes

For each artifact, what's the single most likely way it breaks in the first 6 months, and what's the first step to debug?

Example:

> **System prompt for Customer Support Drafts**
> Likely failure: the team's tone guidelines change (e.g., "be more concise" becomes new guidance from leadership). The system prompt still reflects the old guidance, so drafts sound off.
> First step: open the Project, read the system prompt, compare to current tone guidelines. Update the prompt directly — no other files need to change.

You're not writing a full runbook. You're writing the "start here when it breaks" pointer. The single most common failure and the first thing to check.

### 5. The escalation path

When something is beyond the client's ability to maintain, where do they go? Three tiers:

- **Tier 1 (self-service):** the maintenance schedule above
- **Tier 2 (the client's internal team):** who in the client's org can make edits? Name them. Give them edit access to the Projects.
- **Tier 3 (you or a replacement consultant):** what's your retainer rate for this? What triggers bringing you back — "we want to add a new workflow" vs. "something is broken"?

Be explicit about tier 3 pricing. If you don't want to be the long-term maintainer, say so and name someone who is.

## The format that actually works

One document, not five. Nobody reads five separate documents.

The format:

1. **One-pager at the top** — the inventory, one line per artifact
2. **Then a section per artifact** — following the same template each time (purpose, why, maintenance, failure modes, escalation)
3. **Appendix: full text of every system prompt** — copy-pasted, so if Claude changes how Projects work tomorrow, the client still has the prompts

PDF is the wrong format for this. It ages. Markdown in a Google Doc or Notion page that the client owns is right. You transfer the file at handoff and they can edit it.

## Test it before you leave

The one test that separates a good handoff from a bad one: before you finish the engagement, sit down with the person on the client side who will own the setup. Ask them to walk through a "change the tone of the support drafts to be more formal" request, using only your documentation. If they can't do it in 15 minutes, your documentation has a gap.

Run this test twice:

1. **The change request:** can they find the right artifact, make the change, and verify it worked?
2. **The failure case:** hand them a scenario ("imagine the support drafts suddenly sound wrong — too terse"). Can they walk through the failure modes section and identify where to look first?

Both are usable signals. If they can't do one, add an example to that section. If they can't do the other, your failure-modes section is too abstract.

## What you don't document (on purpose)

You don't document:

- **Your prompting choices at the word level.** "I chose 'succinct' over 'concise' because..." Too granular, won't age well. They'll rewrite the prompt eventually anyway.
- **Alternatives you considered and rejected.** Briefly, in the "why," is fine. A full decision log is over-engineering for a client handoff.
- **Your process for building the setup.** This is a handoff, not a postmortem. They care about the current state, not the path you took.

If the client wants the decision log, that's a separate deliverable and a separate line item.

## Try this today

If you're mid-engagement right now: open the Claude workspace you've built for your current client. Open a blank doc. Spend 20 minutes writing the inventory — just the five rows: Projects, system prompts, connectors, skills, any Code setup. Don't write the "why" or maintenance yet. Just name what exists.

If you can't write the inventory from memory in 20 minutes, your setup is more complex than your client realizes. That's the handoff problem in miniature: you know the shape of it, they don't, and that's the gap the documentation has to fill.

---

*For client-facing deliverable handoff (not system setup), see [client-handoff-with-claude](/articles/client-handoff-with-claude). For pricing the work itself — including maintenance retainers — see [pricing-claude-consulting-work](/articles/pricing-claude-consulting-work).*

## Further reading

- [Claude Projects documentation](https://support.claude.com/en/articles/9945497-claude-projects) — for reference when documenting Projects-based setups
- [Claude Code CLAUDE.md reference](https://docs.claude.com/en/docs/claude-code/claude-md) — for Claude Code handoffs`,
  },

]

async function seed() {
  console.log('Seeding Batch 64 — Persona gap fills (James + Sofia)...\n')

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
