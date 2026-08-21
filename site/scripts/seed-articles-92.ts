/**
 * Batch 92 — Anthropic announcements: Inference hooks, Enterprise cost controls, MCP 2026-07-28
 *
 * Lookback window Jul 28 – Aug 6, 2026 (last timeline event was Jul 28).
 *
 * 1. claude-inference-hooks — Aug 5, 2026. Enterprise beta. Every governed prompt
 *    is POSTed to your own security server for an allow/deny verdict before
 *    inference runs. Admin + builder article. Cluster: Administration. Angle: update.
 *
 * 2. claude-enterprise-cost-controls — July 2, 2026 launch, re-surfaced by the
 *    Aug 4 cost-visibility guide. Analytics dashboard, Analytics API, model
 *    defaults and entitlements, spend threshold alerts. This one was missed by
 *    prior passes. Cluster: Administration. Angle: update.
 *
 * 3. mcp-spec-2026-07-28 — Jul 28, 2026. Stateless core, OAuth/OIDC authorization,
 *    Apps and Tasks as versioned extensions. Cluster: Features & Updates. Angle: update.
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-92.ts
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
    slug: 'claude-inference-hooks',
    angle: 'update',
    title: 'Inference hooks: how to block a Claude prompt before the model ever sees it',
    excerpt:
      'Anthropic shipped Inference hooks in beta for Claude Enterprise on August 5, 2026. Every governed prompt across claude.ai, Cowork, and Claude Code is sent to a server your organization runs, which returns allow or deny before inference starts. Here is what it inspects, what it cannot see, and how to roll it out without blocking people on day one.',
    readTime: 9,
    cluster: 'Administration',
    termSlug: 'ai-governance',
    body: `Anthropic launched **Inference hooks** in beta for Claude Enterprise on August 5, 2026.

The mechanism is simple. When someone in your organization submits a prompt, Anthropic sends the conversation transcript to an HTTPS endpoint you run — Anthropic calls it your *AI security server* — and waits. Your server replies \`allow\` or \`deny\`. A denied request never reaches the model.

That single sentence is the whole feature, and it closes a gap that has bothered security teams since the first enterprise Claude rollout: until now, every control was either on the user's device (bypassable) or after the fact (too late).

## Where this sits relative to the Compliance API

Anthropic already gives Enterprise admins the [Compliance API](/articles/claude-compliance-api), which retrieves activity, chats, files, and projects for audit and export. Inference hooks are the other half of the clock:

| | Inference hooks | Compliance API |
|---|---|---|
| When it acts | Inline, before inference runs | After the fact |
| What it does | Allows or denies each request in real time | Retrieves what already happened |
| Who calls whom | Anthropic calls your server | You call Anthropic's API |

If your security review asked "can we stop a prompt containing card data from ever reaching a model," the answer changed on August 5.

## What your server actually receives

Anthropic POSTs a JSON object. The important thing for a policy conversation is what is *in* it and what is not.

**In it:** the transcript as the user sees it — text, tool calls and their results, text extracted from attachments, and prior turns. Plus \`actor\` (user id and email address when available), \`source.application\` (\`claude-ai\` or \`claude-code\` today), \`model\`, \`session_id\`, and a \`request_id\` for correlation.

**Not in it:** system prompts, tool definitions, Anthropic-internal context, Claude's hidden reasoning, and raw file or image bytes. Attachments arrive as metadata plus extracted text.

A trimmed example of the request body:

\`\`\`json
{
  "type": "prompt",
  "request_id": "req_abc123",
  "actor": {
    "type": "user",
    "id": "user_01AbCdEfGhIjKlMnOpQrStUv",
    "email_address": "alice@example.com"
  },
  "source": { "application": "claude-ai" },
  "model": "claude-opus-5",
  "messages": [
    {
      "role": "user",
      "content": [
        { "type": "text", "text": "Summarize the attached report." },
        {
          "type": "attachment",
          "file_name": "q2-report.pdf",
          "media_type": "application/pdf",
          "size_bytes": 48213,
          "text": "Q2 revenue grew 14% quarter over quarter..."
        }
      ]
    }
  ]
}
\`\`\`

Your server answers with HTTP 200 and a two-field object:

\`\`\`json
{ "action": "allow" }
\`\`\`

or

\`\`\`json
{
  "action": "deny",
  "deny_reason": "This prompt appears to contain customer payment card data, which your organization's policy does not allow.",
  "reference_id": "scan_01HXPT4R9V"
}
\`\`\`

\`deny_reason\` is shown to the user, truncated at 500 characters, followed by a standing message your admins configure (who to contact, how to request an exception). \`reference_id\` is never shown to the user — it lands on the \`inference_hooks_request_denied\` entry in the compliance Activity Feed so you can join a block back to the scan record in your own system.

## The five details that will bite you

**1. A non-200 response is not a deny.** Anything other than HTTP 200 with a parseable verdict is a *webhook failure*, and failure handling takes over instead. If your scanner errors out and you were relying on "errors mean block," you will get whatever your org's failure-handling setting says — which may be allow.

**2. Bodies go up to 10 MB.** Transcripts are sent untruncated. nginx defaults \`client_max_body_size\` to 1 MB and Express's \`express.json()\` defaults to 100 kB. A rejected body counts as a webhook failure, so under *Allow the request* failure handling, your longest and most sensitive conversations are exactly the ones that sail through uninspected. Raise the limit before you enforce.

**3. Verify the signature over raw bytes.** Requests are signed per the [Standard Webhooks](https://www.standardwebhooks.com/) spec using \`webhook-id\`, \`webhook-timestamp\`, and \`webhook-signature\` headers — an HMAC-SHA256 over \`{webhook-id}.{webhook-timestamp}.{raw body}\`. Two bugs cause most failures: computing the HMAC after JSON round-tripping the body, and decoding the signing secret with a URL-safe base64 decoder. The secret uses the standard alphabet, so \`+\` and \`/\` appear regularly and a URL-safe decoder silently derives the wrong key.

Here is the verification in TypeScript, standard library only:

\`\`\`typescript
import { createHmac, timingSafeEqual } from "node:crypto";

const TOLERANCE_SECONDS = 300;

export function verify(secret: string, headers: Record<string, string>, body: Buffer): boolean {
  const id = headers["webhook-id"];
  const ts = headers["webhook-timestamp"];
  const sigs = headers["webhook-signature"];
  if (!id || !ts || !sigs) return false; // unsigned: not from Anthropic

  const signedAt = Number(ts);
  if (!Number.isFinite(signedAt) || Math.abs(Date.now() / 1000 - signedAt) > TOLERANCE_SECONDS) {
    return false; // replayed, or the clocks disagree
  }

  const key = Buffer.from(secret.replace(/^whsec_/, ""), "base64"); // standard alphabet
  const payload = Buffer.concat([Buffer.from(\`\${id}.\${ts}.\`), body]); // raw bytes
  const expected = Buffer.from("v1," + createHmac("sha256", key).update(payload).digest("base64"));

  return sigs.split(" ").some(candidate => {
    const bytes = Buffer.from(candidate);
    return bytes.length === expected.length && timingSafeEqual(bytes, expected);
  });
}
\`\`\`

**4. Every governed request pays your round trip.** The verdict timeout is configurable from 1 to 10,000 ms and defaults to 5,000 ms, covering connection, TLS handshake, request, and response. Whatever your scanner takes, every person in the organization waits for it on every message. Load-test before a wide rollout.

**5. Sustained failures trip a circuit breaker.** If your server keeps failing, Anthropic stops calling it and failure handling applies to everything. Recovery is manual: fix the server, then have an admin turn **Enforce verdicts** back on. Nobody gets paged automatically.

## How to roll it out without a bad Monday

The configuration has three dials that exist specifically so you do not have to flip enforcement on for everyone at once:

- **Shadow mode** — your server sees live traffic and returns verdicts, and nothing is blocked. Run here until your false-positive rate is boring.
- **Rollout percentage** — inspect a chosen fraction of requests.
- **Role exclusions** — exempt members of chosen roles entirely.

A sane sequence: stand up an always-allow server, run **Test connection**, add signature verification, go to shadow mode for a week and count what *would* have been blocked, tune, then enforce at 10% and climb.

Pick your failure handling deliberately. *Block the request* means an outage in your scanner is an outage in Claude for the whole company. *Allow the request* means an outage in your scanner is a silent hole in your DLP. Most organizations start at allow, in shadow mode, and revisit once the server has a track record.

## What it does not cover

- **Image-only content is not inspected.** Raw bytes are never sent, so a screenshot of a document passes through as metadata and nothing else. If your policy concern is people pasting screenshots of regulated data, this does not solve it.
- **Verdicts are allow or deny only.** There is no rewrite or redact.
- **Voice mode is not covered.**
- **Platform organizations are out of scope** — this governs claude.ai, Cowork, and Claude Code, not raw Claude API access.
- **Not available on Amazon Bedrock or Google Cloud.**

That last set matters for the business case. Inference hooks govern the surfaces where employees type, not the surfaces where your engineers build. If your risk is a developer's application sending customer data to the API, this is the wrong control — you want request-side controls in your own application.

## The other Enterprise security control that shipped this week

On August 6, Anthropic added **skill and plugin security scanning** in beta for Enterprise plans: third-party skills and plugins are automatically checked for malicious content when someone uploads or edits them. Different problem, same theme — the enterprise controls are moving from "audit what happened" toward "check it at the door." If you are writing the security section of a Claude rollout plan, these two now belong in it together.

## Try this today

Write down the one prompt you most do not want an employee to send. Then answer three questions: would the transcript Anthropic sends actually contain the thing you are worried about (remember: no raw bytes, no system prompts)? Would your existing DLP scanner catch it in plain text? And if your scanner were down for an hour, would you rather Claude stop working or that prompt go through? Those three answers are your configuration.

---

**Related reading**

- [Claude Compliance API](/articles/claude-compliance-api) — the after-the-fact half of the same job
- [What's new in Claude admin controls](/articles/claude-admin-controls-2026) — groups, spend limits, managed Code policies
- [Security and privacy for Claude admins](/articles/claude-admin-security-privacy) — the baseline before you add hooks
- [Claude Team vs. Enterprise for IT](/articles/claude-team-vs-enterprise-for-it) — which plan gets which control

---

*Sources: [Inference hooks](https://platform.claude.com/docs/en/manage-claude/inference-hooks) and [Develop an Inference hooks integration](https://platform.claude.com/docs/en/manage-claude/inference-hooks-endpoint), Anthropic, August 5, 2026.*`,
  },

  {
    slug: 'claude-enterprise-cost-controls',
    angle: 'update',
    title: 'Claude Enterprise cost controls: the four instruments that tell you where the money went',
    excerpt:
      'Anthropic shipped per-user and per-group cost analytics, an Analytics API, model defaults and entitlements, and spend threshold alerts for Claude Enterprise. Each answers a different question, and picking the wrong one is why most AI cost reviews stall. Here is which instrument answers which question.',
    readTime: 8,
    cluster: 'Administration',
    termSlug: 'cost-optimization',
    body: `Claude Enterprise got a set of cost controls on July 2, 2026, and Anthropic published a walkthrough of how to use them together on August 4. If your finance partner has asked "what are we actually spending this on," the tooling to answer that now exists in the admin console.

The mistake most teams make is reaching for the dashboard for every question. There are four separate instruments here and they answer four different questions. Match them wrong and you get a number nobody can act on.

## Instrument 1: the analytics dashboard — "who is using this, and on what?"

The admin console now breaks usage and cost down **by group and by individual user**, and it shows output next to cost: artifacts created, files edited, skills and connectors used. You can filter by SCIM groups, so if your identity provider already mirrors the org chart, the cost view mirrors it too.

For Claude Code there is a separate daily-updated view: active developers, session counts, top commands. There is also a **Value tab** that estimates productivity lift, cost per commit, and annualized value.

Treat the Value tab as a conversation starter, not a number to put in a board deck. Cost per commit is a real measurement; "annual value" is a model with assumptions in it. If you are building an actual ROI case, the instrument you want is a system-of-record KPI on a specific workflow — see [how to actually measure the ROI of Claude](/articles/measuring-ai-roi) for how to pick one.

**Question it answers well:** which teams are adopting this, and which are paying for seats they do not touch.

## Instrument 2: Analytics Chat — "why did that number move?"

Analytics Chat lets you ask the data in plain language — "which teams doubled usage this month?" — and export charts.

This is the follow-up instrument, not the primary one. Its value is the second and third question after the dashboard surfaces an anomaly, when clicking through filters would take twenty minutes.

**Question it answers well:** the ad-hoc drill-down you would otherwise ask a data analyst for.

## Instrument 3: the Analytics API — "put this next to the rest of our cloud spend"

Programmatic access to usage and cost, with filters for date range, team, product, and model. Skills report their own usage, and there are endpoints for plugin adoption and artifact creation. Anthropic explicitly names Datadog Cloud Cost Management and CloudZero as destinations.

This is the instrument for finance and FinOps, and it is the one that changes the conversation. Claude spend sitting inside a Claude dashboard is a line item nobody reconciles. Claude spend flowing into the same tool as your AWS bill gets reviewed monthly by people whose job is reviewing it.

**Question it answers well:** what does AI cost as a share of total infrastructure, and is that share moving.

There is also an **Admin API** for the workflow side: reviewing limit-increase requests, finding members near their cap, flagging usage that is changing fast.

## Instrument 4: model defaults, entitlements, and spend alerts — "stop the bleeding"

The first three instruments observe. This one intervenes.

**Model defaults and entitlements.** Admins set which Claude model new conversations start with, separately across chat, Cowork, and Claude Code, and control which models are available to which roles. This is the single highest-leverage cost control in the list, because the default is what most people never change. If routine internal Q&A starts on the most expensive model available, you are paying frontier prices for lookups.

**Spend threshold alerts.** Admins are notified at **75% and 90%** of an org-level spend limit. Users get in-app notifications at **75% and 95%** of their own, and can request an increase from an admin directly rather than discovering the cap by hitting it mid-task.

That user-facing notification is the part worth noticing. The failure mode with per-user spend caps was never the cap — it was somebody's work stopping without warning in the middle of something, and the resulting ticket. A 75% warning plus a request button turns a support escalation into a click.

**Question it answers well:** how do we not get a surprise bill, and how do we not block someone's Tuesday.

## What to actually do this week

1. **Check your model defaults first.** It takes ten minutes and it is the change with the largest effect. Decide what routine work should default to and set it per surface. Reserve the top model for the roles that need it.
2. **Turn on spend threshold alerts** and make sure they route somewhere a human reads — not a shared inbox nobody owns.
3. **Pull one month through the Analytics API** into wherever your cloud spend already lives. Do not build a new dashboard; put it in the existing one.
4. **Look at cost by group, not by total.** The total tells you nothing you can act on. The group breakdown tells you which team to talk to.

## The plan caveat

All of this is **Claude Enterprise**. If you are on Team, you have per-user spend caps and the usage view from the [April admin controls release](/articles/claude-admin-controls-2026), but not the group-level analytics, the Analytics API, model entitlements, or Analytics Chat. That gap is one of the more concrete arguments in a Team-to-Enterprise upgrade conversation — see [Claude Team vs. Enterprise for IT](/articles/claude-team-vs-enterprise-for-it).

## Try this today

Open the analytics dashboard, sort cost by group, and find the group with the highest cost per active user. Then go look at what model their conversations default to. In most organizations those two facts explain each other, and the fix is a settings change rather than a policy conversation.

---

**Related reading**

- [How to actually measure the ROI of Claude](/articles/measuring-ai-roi) — picking the right instrument for the question
- [Showing AI ROI to your CEO](/articles/agent-operator-roi-reporting) — reporting the number upward
- [What's new in Claude admin controls](/articles/claude-admin-controls-2026) — the April release this builds on
- [Keeping your agent costs under control as you scale](/articles/agent-operator-cost-control) — the agent-side version of this problem
- [Cutting Claude API costs without cutting quality](/articles/claude-cost-optimization) — the builder-side version

---

*Sources: [New analytics and cost controls are available for Claude Enterprise](https://claude.com/blog/giving-admins-more-visibility-and-control-over-claude-usage-and-spend), July 2, 2026, and [A guide to cost visibility and control in Claude](https://claude.com/blog/a-guide-to-cost-visibility-and-control-in-claude), August 4, 2026, Anthropic.*`,
  },

  {
    slug: 'mcp-spec-2026-07-28',
    angle: 'update',
    title: 'MCP goes stateless: what the 2026-07-28 spec revision changes for anyone running a server',
    excerpt:
      'The Model Context Protocol revision dated 2026-07-28 landed in Claude on July 28, 2026. The core is now request/response instead of a persistent stateful connection, authorization aligns with standard OAuth 2.0 and OIDC, and MCP Apps and Tasks become versioned extensions. Existing stateful servers need work.',
    readTime: 7,
    cluster: 'Features & Updates',
    termSlug: 'mcp',
    body: `On July 28, 2026, Anthropic shipped support for MCP specification revision **2026-07-28** across Claude products.

MCP — the Model Context Protocol — is the open standard for connecting an AI model to external tools and data. Anthropic released it in November 2024 and [donated it to the Agentic AI Foundation](/articles/mcp-role) in December 2025. There are now 950+ MCP servers reachable from Claude.

This revision is the largest change to the protocol since it became a standard, and it is a breaking one for a specific group: anyone who wrote a server that holds state across a connection.

## Change 1: the core is stateless

The old MCP core assumed a bidirectional, stateful connection. Client connects, session opens, both sides exchange messages over that live link, session closes.

The new core is request/response. Each call carries what it needs; the server does not hold a session between them.

The practical consequence is deployment. A stateful server needs a long-lived process holding connections, which means a container or a VM you keep running. A stateless server is an HTTP handler, which means it runs on serverless and edge infrastructure — Lambda, Cloudflare Workers, Vercel functions — and scales to zero when nobody is calling it.

For a team running an [internal MCP server](/articles/internal-mcp-server-explained) that gets used a few dozen times a day, that is the difference between an always-on box on the infrastructure bill and something that costs nearly nothing when idle.

**What breaks:** if your server keeps per-connection state — an open database cursor, an in-memory cache keyed by session, a partially built query the next call expects to find — that assumption is gone. State has to move somewhere the next request can reach it: a store, a token, or a request parameter. This is a refactor, not a config change.

## Change 2: authorization is standard OAuth 2.0 and OIDC

Authorization in earlier revisions was close enough to OAuth to be recognizable, and different enough that connecting an MCP server to a real enterprise identity provider meant custom work.

The new spec aligns with production OAuth 2.0 and OIDC. An MCP server can now sit behind Entra ID or Okta the same way any other internal service does.

This is the change that matters most in an enterprise setting, and it is mostly good news rather than work. It removes the answer "we wrote a shim" from your security review. If your MCP server currently authenticates with a static shared key — a pattern covered in [connecting Claude agents to production systems](/articles/mcp-production-agents) — this revision is the moment to replace it.

## Change 3: Apps and Tasks are versioned extensions

Two capabilities graduate into formal, separately versioned extensions rather than living in the core:

- **MCP Apps** — interactive UIs served by an MCP server, so a tool can present something to interact with rather than only returning text.
- **MCP Tasks** — long-running operations, with a defined way to start work, report progress, and return a result later.

Versioned extensions mean these can evolve on their own schedule without a core protocol revision, and a server can declare exactly which ones it implements. If you have been hand-rolling a polling pattern for a slow tool, Tasks is the standardized version of what you built.

## What to do, in order

1. **Find out whether your server is stateful.** Grep for anything stored on a connection or session object between calls. If there is nothing, you are close to compliant already.
2. **Move state out.** Redis, a database row, or a signed token in the request — whichever fits. The rule is that any single request must be answerable on its own.
3. **Replace static keys with OAuth/OIDC** against the identity provider you already run. This is the step your security team will actually notice.
4. **Check your SDK version.** The [MCP SDKs](https://modelcontextprotocol.io/specification/2026-07-28/) carry the migration surface; upgrading them is the fastest way to see what your server is relying on that no longer exists.
5. **Only then look at Apps and Tasks.** They are additive. Do not mix a capability upgrade into a protocol migration.

## If you do not run a server

Most people reading this consume MCP servers rather than write them, and nothing about that changes — Claude's connector list works the same way. The one thing worth knowing: servers you depend on, particularly small open-source ones, now have migration work in front of them. If an internal tool built on a third-party MCP server starts failing in the coming months, this revision is a reasonable first suspect.

## Try this today

If your team runs an MCP server, open its code and answer one question: could two consecutive tool calls land on two different machines with no shared memory and still work? If yes, you are stateless already and the migration is small. If no, you have found the work.

---

**Related reading**

- [What MCP actually means for your business](/articles/mcp-role) — the plain-language version
- [What is an internal MCP server](/articles/internal-mcp-server-explained) — why teams build their own
- [Connecting Claude agents to production systems with MCP](/articles/mcp-production-agents) — auth patterns and failure handling
- [MCP for operators](/articles/mcp-for-operators) — when you need one and when you do not

---

*Sources: [Bringing MCP 2026-07-28 to Claude](https://claude.com/blog/bringing-mcp-2026-07-28-to-claude), Anthropic, July 28, 2026, and the [MCP specification 2026-07-28](https://modelcontextprotocol.io/specification/2026-07-28/).*`,
  },
]

async function seed() {
  console.log('Seeding Batch 92 — Inference hooks, Enterprise cost controls, MCP 2026-07-28...\n')

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
