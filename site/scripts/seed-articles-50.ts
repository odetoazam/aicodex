/**
 * Batch 50 — Claude admin ongoing maintenance
 * 1. claude-admin-ongoing-maintenance — James's open question #4:
 *    "At 600 people, what does admin overhead actually look like after month 3?"
 *    For IT admins and Claude owners at mid-size companies post-deployment.
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-50.ts
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
  {
    termSlug: 'claude-plans',
    slug: 'claude-admin-ongoing-maintenance',
    angle: 'process',
    title: 'Running Claude after the rollout: the ongoing admin workload',
    excerpt: "Most admin guides cover getting Claude set up. This one covers what happens after: the recurring work, the common incidents, the governance tasks, and what a realistic monthly admin time commitment looks like for a 100-600 person company.",
    readTime: 6,
    cluster: 'Business Strategy & ROI',
    body: `The initial Claude rollout — setting up the admin console, configuring SSO, running a pilot, communicating policies — is a defined project with a beginning and an end. What comes after is less well defined. Most organisations discover the ongoing work through incidents rather than planning.

Here is what the ongoing work actually looks like, so you can plan for it.

## The recurring admin tasks

After the initial deployment, the recurring admin work falls into four categories:

**User management.** Adding new employees, removing departed employees, managing access. In a fast-growing company, this can be weekly. In a stable company, monthly. If your org uses SSO/SCIM provisioning, this is mostly automated — deprovisioning happens when someone leaves the identity provider. If you're managing users manually, budget 30-60 minutes per month.

**Policy and guidance updates.** Your AI usage policy will need updating. The trigger is usually one of three things: Claude adds a new feature that your policy doesn't address, your company expands into a new use case (customer-facing automation, for example), or a team lead asks a question your current policy doesn't answer. Budget one policy review every 6 months at minimum — and set a calendar reminder when you publish the policy rather than waiting for something to break.

**Connector and tool management.** If your organisation uses connectors (Salesforce, Slack, Google Drive, etc.), someone needs to monitor what's connected and whether access is still appropriate. Permissions drift: people who change roles keep connector access they no longer need. A semi-annual review of which connectors are active and who has access to what is enough to catch the worst of this. For a 100-600 person company, this is typically a 1-2 hour exercise twice a year.

**Billing and spend monitoring.** On Teams and Enterprise, usage data is available in the admin console. Someone should be checking spend trends monthly — especially in the first six months, when usage patterns are still forming. The risk: a team deploys an automated Claude workflow that runs thousands of times and nobody notices until the invoice arrives. Set up spend alerts in the admin console (if available on your plan) and schedule a monthly cost review.

## The common incidents (and how much time they take)

These are the issues that will come up with some regularity:

**"Claude gave a wrong answer"** — The most frequent complaint. Someone got incorrect information and is upset about it, or used it before verifying. Response: review the conversation, clarify whether this was a hallucination (Claude stated something false with confidence) or a misuse pattern (the user didn't verify before relying on it). Update guidance if there is a pattern. Time: 30-60 minutes per incident when you first start seeing them; becomes faster as you build a response playbook.

**"My access isn't working"** — Access issues: SSO misconfiguration, user not provisioned, account locked. These are usually IT issues, not Claude-specific, but they land with the Claude admin. Time: 15-45 minutes depending on your identity management setup.

**"Is this use case allowed?"** — A team lead wants to do something new with Claude and wants sign-off before proceeding. Common examples: using Claude to draft external client communications, using Claude with customer data for analysis, integrating Claude into an automated workflow. Time: 30-60 minutes to evaluate and document the decision.

**Data concern from legal/compliance** — Occasionally legal or compliance will flag something — a question about what data Anthropic retains, a request to audit Claude usage for a specific employee, a question about GDPR compliance for a specific use case. These are the highest-stakes incidents. Time: variable, 2-8 hours depending on complexity. Having your data processing documentation ready (Anthropic's DPA, your internal policy) in advance cuts this time significantly.

## What a realistic monthly time commitment looks like

For a company of 100-600 people, once you are past the initial rollout:

| Task | Frequency | Time |
|------|-----------|------|
| User provisioning/deprovisioning | Monthly | 30-60 min |
| Spend review | Monthly | 30 min |
| Incident response | As needed (1-3/month typical) | 30-90 min each |
| Ad hoc "is this allowed?" questions | As needed (2-4/month typical) | 20-30 min each |
| Policy review | Every 6 months | 2-4 hours |
| Connector access review | Every 6 months | 1-2 hours |
| Training and internal comms | Quarterly | 1-2 hours |

A realistic steady-state is **3-6 hours per month** of ongoing Claude administration for a 100-600 person deployment, assuming you have SSO/SCIM provisioning set up and the initial rollout is complete. This is significantly less than most IT managers estimate before they start — the majority of deployments do not require dedicated Claude admin headcount.

The figure goes higher if you have complex connector setups, automated workflows that need monitoring, or a high volume of "is this allowed?" questions (which typically signals your policy guidance needs improvement).

## The thing that grows over time

Usage does not stay flat. In the first six months after a deployment, usage typically grows as more employees find use cases that work for them. The growth is gradual at first, then accelerates when a few teams start getting consistent value and word spreads.

Prepare for this in two ways:

**Plan capacity before you need it.** If you are on Claude Teams and approaching the seat limit, plan the expansion conversation before you hit the ceiling. Same for rate limits if you have automated workflows — you want to raise limits before you experience failures, not after.

**Build internal champions.** The teams that get the most value from Claude earliest become your internal advocates. These are the people who will answer "how should I use this?" questions from colleagues, reducing the admin support burden. Identify them in month two or three and make sure they are equipped with good guidance to share.

---

*For the initial deployment: [Claude admin zero to one](/articles/claude-admin-zero-to-one) covers the setup sequence. For security and data handling specifics relevant to GDPR and enterprise compliance: [the admin security guide](/articles/claude-admin-security-privacy). For the policy framework: [AI usage policy for teams](/articles/ai-usage-policy-for-teams) and the [template](/articles/ai-usage-policy-template).*`,
  },
]

async function seed() {
  console.log('Seeding batch 50...\n')

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
      console.log(`  ${article.slug} — seeded`)
    }
  }

  console.log('\nDone.')
}

seed().then(() => process.exit(0))
