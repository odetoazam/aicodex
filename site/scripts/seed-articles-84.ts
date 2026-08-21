/**
 * Batch 84 — Business continuity: what to do when a hosted AI model disappears
 *
 * 1. when-your-ai-model-disappears
 *    The Fable 5 suspension (Jun 12, 2026) was a 3-day-old model disabled globally
 *    overnight. For builders and operators: what causes sudden model loss, how to
 *    design for it, and the concrete fallback pattern. Dual audience: builder + operator.
 *    PINNED_ALL (position 5, replaces why-anthropic-openai-copied-palantir).
 *    Cluster: Models & Pricing. Angle: process.
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-84.ts
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
    slug: 'when-your-ai-model-disappears',
    angle: 'process',
    title: 'When your AI model disappears overnight',
    excerpt: "On June 12, 2026, every Claude Fable 5 and Mythos 5 API call started failing — three days after the model launched. A US government directive disabled both models worldwide in hours. If your app had no fallback, it was just down. Here's how model loss happens, and how to build so it doesn't take you with it.",
    readTime: 8,
    cluster: 'Models & Pricing',
    audience: ['developer', 'operator'],
    termSlug: 'large-language-model',
    body: `On June 9, 2026, Anthropic launched Claude Fable 5 as its most capable model. On June 12 — seventy-two hours later — the US government issued an export-control directive and Anthropic disabled it for all customers, worldwide, immediately.

If your production app was calling \`claude-fable-5\`, it was now broken. Not degraded — broken. Requests returned nothing usable. And it wasn't a bug you could fix.

This is a new category of production risk that the cloud-AI era introduced. It's worth taking seriously, because Fable 5 wasn't the first case and won't be the last.

## How model loss actually happens

There are five patterns, and the Fable 5 case is just the most dramatic recent example.

**1. Government or regulatory action.**
What happened to Fable 5: a regulatory body issues a directive — export controls, content safety, national security — and the provider must comply, sometimes within hours. The provider has no discretion on timeline. You have no notice.

**2. Model deprecation.**
Every model gets retired eventually. Anthropic publishes deprecation timelines in its [model deprecations](https://platform.claude.com/docs/en/about-claude/model-deprecations) page, but apps pinned to an old model ID eventually start receiving errors — sometimes after drifting off the rotation schedule without anyone noticing.

**3. Provider incident.**
The model itself is fine but the inference infrastructure goes down. Happens at every cloud provider. Different from deprecation because it resolves, but the timeline is out of your hands.

**4. Rate limit exhaustion.**
Your model isn't gone, but you've hit your org's rate ceiling. Practically identical from the app's perspective: requests fail until limits reset or an admin intervenes.

**5. Silent quality degradation.**
The model keeps responding but its output changes — a safety policy update, a fine-tuning change, a tokenizer switch. Not outright failure, but your evals start failing and your users notice before you do.

The Fable 5 case was pattern 1 — the hardest to anticipate and the one with the shortest possible notice window.

## The single rule: never let one model string own your critical path

If the model ID is hardcoded in your main request handler with no fallback logic, a model loss event is a full outage. The fix is to design so that model loss degrades you to a slower or slightly less capable path, not to zero.

That looks different for builders and operators.

## For builders: the fallback pattern

The minimum viable fallback is a check on \`stop_reason\` plus a retry on a secondary model:

\`\`\`typescript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();
const PRIMARY   = "claude-fable-5";
const SECONDARY = "claude-opus-4-8";  // unaffected by the Fable 5 directive

async function callWithFallback(prompt: string, systemPrompt?: string) {
  try {
    const res = await client.messages.create({
      model: PRIMARY,
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: "user", content: prompt }],
    });

    // Fable 5-specific: classifier refusal comes back as a 200, not an error
    if (res.stop_reason === "refusal") {
      return callOnSecondary(prompt, systemPrompt);
    }

    return res;
  } catch (err: any) {
    // HTTP 404 (model not found), 503 (unavailable), or rate limit errors
    if (err.status === 404 || err.status === 503 || err.status === 429) {
      return callOnSecondary(prompt, systemPrompt);
    }
    throw err;
  }
}

async function callOnSecondary(prompt: string, systemPrompt?: string) {
  return client.messages.create({
    model: SECONDARY,
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: "user", content: prompt }],
  });
}
\`\`\`

A few things this pattern handles:
- **Fable 5 refusals** — \`stop_reason: "refusal"\` comes back as HTTP 200, so you can't rely on catching an exception.
- **Model not found** — HTTP 404 when the model ID is no longer valid.
- **Infrastructure outage** — HTTP 503 or connection errors.
- **Rate limits** — HTTP 429; you might want a brief backoff before the secondary rather than an immediate retry.

Anthropic also ships a managed server-side fallback: pass a \`fallbacks\` parameter listing secondary model IDs, and the API retries automatically on its side. It includes **fallback credit** that refunds the prompt-cache cost of switching models. That's the easiest path if you're building new — see [Refusals and fallback](https://platform.claude.com/docs/en/build-with-claude/refusals-and-fallback) for the shape.

### Choose a secondary model that can actually do the job

"Fall back to Opus 4.8" only works if Opus 4.8 can handle what Fable 5 was doing. For most workloads — drafting, summarizing, classification, tool calling — it can. For the specific high-end tasks you'd route to Fable 5 (deep reasoning, long-horizon agent work), the fallback quality will be lower. That's a tradeoff: a degraded answer is better than an outage for most use cases, but not all. Know your critical path and make an explicit decision.

### Monitor your primary model's health separately

Don't wait for user complaints. Add a synthetic check — a short probe prompt sent on a schedule — to your primary model. If it stops responding or starts returning unexpected stop reasons, your alerting fires before real traffic breaks. This catches both outages and silent quality changes.

\`\`\`typescript
// Simple probe: send every 5 minutes, alert if it fails 2 in a row
async function probeModel(modelId: string): Promise<boolean> {
  try {
    const res = await client.messages.create({
      model: modelId,
      max_tokens: 10,
      messages: [{ role: "user", content: "Reply with OK" }],
    });
    return res.stop_reason === "end_turn";
  } catch {
    return false;
  }
}
\`\`\`

## For operators: what to tell your team right now

If you manage Claude for your organization and Fable 5 was part of workflows your team relied on, two things matter:

**1. The other models still work.** Claude Opus 4.8, Sonnet 4.6, and Haiku are unaffected. Any workflow that doesn't specifically require Fable 5's capabilities can keep running today on Opus 4.8. For most day-to-day knowledge work — writing, research, analysis — Opus 4.8 is indistinguishable in practice.

**2. Treat this as a process signal, not a crisis.** The Fable 5 suspension is unusual — a government directive, not a routine deprecation — but the broader lesson applies to every AI tool you rely on: model access is a dependency that can change. The same resilience principle that applies to any SaaS tool (have a backup, don't block core work on one vendor's feature) applies here.

If your team has any workflows blocked on Fable 5 specifically, now is a good time to audit which ones genuinely require it versus which ones landed there by default.

## The broader pattern

Fable 5 is an extreme case, but every version of model loss follows the same playbook:
- Something outside your control removes or changes the model.
- Your fallback path (or lack of one) determines whether it's an incident or just a notification.

The economics of building on hosted AI models include this risk. The cost of a fallback — some extra code, a slightly higher token bill when the secondary fires — is small compared to the cost of an outage. Build it while things are stable, not after the next event.

## Related reading

- [Claude Fable 5: the new flagship, the new price, and the first model that can refuse you](/articles/claude-fable-5) — full Fable 5 specs and the refusal handling pattern
- [Claude Opus 4.8](/articles/claude-opus-4-8) — the current usable flagship and the right default fallback target
- [Choosing the right Claude model](/articles/choosing-the-right-claude-model) — the routing framework: when to use which model
- [Claude cost optimization](/articles/claude-cost-optimization) — managing cost when your primary model route changes unexpectedly

---

*Prompted by the [US government directive suspending Fable 5 and Mythos 5](https://www.anthropic.com/news/fable-mythos-access), June 12, 2026.*`,
  },
]

async function seed() {
  console.log('Seeding Batch 84 — When your AI model disappears overnight...\n')

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
