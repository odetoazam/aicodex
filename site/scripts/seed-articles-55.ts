/**
 * Batch 55 — Accuracy fixes (Yuki's technical blockers)
 *
 * 1. writing-evals-that-catch-regressions
 *    Added LLM-as-judge calibration section: position bias, verbosity bias,
 *    model self-preference. Practitioners building production eval suites need
 *    this or they end up with systematically wrong quality scores.
 *
 * 2. rate-limiting-claude-api
 *    Added "Anthropic's rate limits" section near the top. The article was
 *    teaching application-layer rate limiting without telling readers where to
 *    find the actual limits they're guarding against — making the code examples
 *    unanchored.
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-55.ts
 */

import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const UPDATES = [

  // ── 1. writing-evals-that-catch-regressions ───────────────────────────────
  {
    slug: 'writing-evals-that-catch-regressions',
    body: `If you change a prompt and have no eval, you are flying blind. If you update the model version and have no eval, same problem. Evals are the test suite for your AI product — and unlike unit tests, they do not write themselves.

This covers the minimal eval structure that actually catches real regressions, how to run them automatically, and when to use LLM-as-judge versus deterministic checks.

## What you are actually testing

AI outputs are not deterministic. You cannot assert \`output == expected_string\`. What you can assert:

- **Format**: the output is valid JSON / has the expected keys / is under N characters
- **Content**: the output contains required information / does not contain prohibited content
- **Quality**: a judge model scores the output above a threshold on specific criteria
- **Behavior**: given input X, the model does not do Y (refusal, hallucination, wrong persona)

Different assertions for different problems. Most evals use a mix.

## The test case structure

A test case has three parts: input, expected behavior (not expected output), and an assertion function.

\`\`\`python
from dataclasses import dataclass
from typing import Callable

@dataclass
class EvalCase:
    name: str
    system_prompt: str
    user_message: str
    assert_fn: Callable[[str], bool]
    description: str  # what this case is checking

# Example cases
CASES = [
    EvalCase(
        name="returns_valid_json",
        system_prompt="Extract entities as JSON: {name, email, company}",
        user_message="Hi, I'm Sarah at Stripe. Reach me at sarah@stripe.com",
        assert_fn=lambda output: (
            __import__('json').loads(output) is not None
            and "email" in __import__('json').loads(output)
        ),
        description="Output must be parseable JSON with email field"
    ),
    EvalCase(
        name="no_made_up_data",
        system_prompt="Extract entities as JSON: {name, email, company}",
        user_message="Hi, I'm Sarah. No email provided.",
        assert_fn=lambda output: (
            "null" in output or "none" in output.lower()
            or __import__('json').loads(output).get("email") is None
        ),
        description="Missing email should be null, not fabricated"
    ),
    EvalCase(
        name="stays_in_character",
        system_prompt="You are a customer support agent for Acme Corp. Never mention competitors.",
        user_message="How does your product compare to CompetitorX?",
        assert_fn=lambda output: "competitorx" not in output.lower(),
        description="Should not name the competitor"
    ),
]
\`\`\`

## The runner

\`\`\`python
import anthropic
import json
from dataclasses import dataclass, field

client = anthropic.Anthropic()

@dataclass
class EvalResult:
    case_name: str
    passed: bool
    output: str
    error: str = ""

def run_eval(cases: list[EvalCase], model: str = "claude-sonnet-4-6") -> list[EvalResult]:
    results = []
    for case in cases:
        try:
            response = client.messages.create(
                model=model,
                max_tokens=512,
                system=case.system_prompt,
                messages=[{"role": "user", "content": case.user_message}]
            )
            output = response.content[0].text
            passed = case.assert_fn(output)
        except Exception as e:
            output = ""
            passed = False
            error = str(e)

        results.append(EvalResult(
            case_name=case.name,
            passed=passed,
            output=output,
        ))

    return results

def print_results(results: list[EvalResult]):
    passed = sum(1 for r in results if r.passed)
    total = len(results)
    print(f"\\n{'='*50}")
    print(f"Results: {passed}/{total} passed")
    print(f"{'='*50}")
    for r in results:
        status = "✓" if r.passed else "✗"
        print(f"{status} {r.case_name}")
        if not r.passed:
            print(f"  Output: {r.output[:100]}...")
\`\`\`

## LLM-as-judge

For quality assertions that cannot be expressed as deterministic functions — "is this response helpful?", "does this avoid a condescending tone?", "is this explanation accurate?" — use a second Claude call as the judge.

\`\`\`python
def llm_judge(
    output: str,
    criteria: str,
    model: str = "claude-haiku-4-5-20251001"  # cheap model for judging
) -> tuple[bool, str]:
    """Returns (passed, reasoning)"""
    response = client.messages.create(
        model=model,
        max_tokens=256,
        system="""You are an evaluator. Assess the given output against the criteria.
Respond with JSON: {"passed": true/false, "reasoning": "one sentence"}""",
        messages=[{
            "role": "user",
            "content": f"Output to evaluate:\\n{output}\\n\\nCriteria: {criteria}"
        }]
    )
    result = json.loads(response.content[0].text)
    return result["passed"], result["reasoning"]

# Usage
passed, reason = llm_judge(
    output=some_response,
    criteria="The response should be empathetic and not blame the user"
)
\`\`\`

Use Haiku for judging — it is fast and cheap. Reserve Sonnet for cases where nuance matters. The judge prompt matters a lot: be specific about the criteria, and ask for reasoning (it makes the judgment more reliable, not just more readable).

## LLM-as-judge calibration: what the research shows

LLM judges are not neutral. Before you trust your quality scores, you need to know about three systematic biases documented in evaluation research:

**Position bias.** When a judge evaluates two responses side by side (A vs B), it tends to prefer whichever response appears first, regardless of quality. In a [2023 study on GPT-4 as a judge](https://arxiv.org/abs/2306.05685), this effect was strong enough to flip the outcome roughly 20% of the time. Mitigation: if you are doing pairwise comparisons, run each pair twice with the order reversed and only count it as a win if the same response wins both times.

**Verbosity bias.** LLM judges reliably prefer longer responses, even when shorter responses are more accurate or more useful. A three-paragraph answer to a yes/no question will often score higher than the correct one-sentence answer. Mitigation: explicitly instruct the judge to evaluate correctness and relevance, not length. Include a negative example in the judge prompt: "Do not give higher scores simply because a response is longer."

**Model self-preference.** Claude judges rate Claude-generated text higher than equivalent text from other models; GPT-4 judges do the same for GPT-4 output. This is not necessarily bias in a harmful sense — the models may share stylistic patterns that look "correct" to each other — but it means your Claude-judged evals have a ceiling on how well they can detect quality regressions if you switch providers or use fine-tuned outputs. Mitigation: periodically validate a sample of LLM judgments against human labels to keep the scores calibrated.

None of this means LLM-as-judge is not useful. It is useful — the alternative is no quality measurement at all. But treat LLM judge scores as directional, not ground truth. High absolute scores are less meaningful than stable scores over time: a pass rate that was 87% last week and is 82% this week is a signal, regardless of whether 87% is "good."

## Running evals in CI

The goal is to catch regressions before they reach production. That means running evals on every PR that touches a prompt or changes a model version.

\`\`\`yaml
# .github/workflows/evals.yml
name: AI Evals

on:
  pull_request:
    paths:
      - 'prompts/**'
      - 'src/ai/**'
      - 'evals/**'

jobs:
  evals:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - run: pip install anthropic
      - run: python evals/run.py --fail-under 0.9
        env:
          ANTHROPIC_API_KEY: \${{ secrets.ANTHROPIC_API_KEY }}
\`\`\`

\`\`\`python
# evals/run.py
import sys
import argparse
from cases import CASES
from runner import run_eval, print_results

parser = argparse.ArgumentParser()
parser.add_argument('--fail-under', type=float, default=1.0)
args = parser.parse_args()

results = run_eval(CASES)
print_results(results)

pass_rate = sum(1 for r in results if r.passed) / len(results)
if pass_rate < args.fail_under:
    print(f"\\nFailed: pass rate {pass_rate:.0%} below threshold {args.fail_under:.0%}")
    sys.exit(1)
\`\`\`

This blocks merges when the pass rate drops below your threshold. Set the threshold based on your tolerance — 90% is a reasonable starting point; 100% is only realistic if your cases are all deterministic.

## What makes a good eval suite

**Cover the cases that would be catastrophic if they broke.** Your eval suite is not a comprehensive test of everything — it is insurance against the specific failures that would damage users or your product reputation. Start with those.

**Include regression cases for bugs you have already fixed.** Every time you fix a real bug, add a case that would have caught it. Eval suites grow from production incidents.

**Keep cases fast.** An eval that takes fifteen minutes will not get run. Under five minutes for the full suite means it fits in a CI job without friction.

**Separate slow evals from fast ones.** Deterministic format checks run in every PR. Quality checks with LLM judges can run nightly or on main branch merges. Not everything needs to block a PR.

## The number that matters

Track your pass rate over time. When you update a model, change a prompt, or ship a new feature, you want to see whether it moved the number. A pass rate that goes from 94% to 88% after a prompt change is a signal. A rate that stays stable while you ship is confidence.

You do not need a dashboard for this. A log file with \`{date, model, pass_rate, commit}\` is enough to see trends.

---

*Try this today: look at your most important eval case — the one that would catch the failure you most dread. Run it five times in a row and check whether it passes consistently. Flaky evals are worse than no evals: they create false confidence and get ignored.*`,
  },

  // ── 2. rate-limiting-claude-api ───────────────────────────────────────────
  {
    slug: 'rate-limiting-claude-api',
    body: `A single-user app hitting rate limits is annoying. A multi-user app hitting rate limits is a product failure. The difference is not just retry logic — it is designing your application to distribute usage correctly and degrade gracefully when limits are approached.

## Anthropic's rate limits: what you are actually working around

Anthropic enforces limits at two levels: **requests per minute (RPM)** and **tokens per minute (TPM)**. These limits vary by model, account tier, and change over time as Anthropic updates its capacity. Always check the current values in the [Anthropic console](https://console.anthropic.com) under "Limits" or in the [Anthropic rate limits documentation](https://docs.anthropic.com/en/api/rate-limits) before hardcoding any numbers.

As of early 2026, tiers range from the default (limited RPM/TPM for new accounts) to higher production tiers granted after a usage and payment history is established. New accounts are restricted until Anthropic has established trust. If you are building a multi-user application and hitting limits in testing, the first step is usually requesting a tier increase through the console, not redesigning your architecture.

The limits that matter most in practice:

- **TPM (tokens per minute)** — the one most apps hit first. Long system prompts × many concurrent users = TPM exhaustion.
- **RPM (requests per minute)** — less commonly the bottleneck, but relevant if your app makes many short calls rather than fewer long ones.

Design your application knowing that these limits are per API key. If you need more headroom without a tier upgrade, you can use multiple keys on separate accounts — but Anthropic's terms require each to belong to a separate legal entity, so this is not a general workaround.

## Why application-layer rate limiting is still required

Even after a tier upgrade, you still need application-layer rate limiting. Anthropic's limits protect Anthropic's infrastructure. Your application needs limits to protect your own budget and to ensure fair access across users. These are different problems.

When you have 500 users hitting your app simultaneously, exponential backoff does not help. You cannot tell 400 users to wait 16 seconds. You need to:

1. Prevent rate limit exhaustion in the first place
2. Queue requests intelligently when limits are approached
3. Give users informative feedback, not spinner timeouts

## Token budgeting

The most effective preventive measure is setting token budgets per request.

\`\`\`typescript
const MAX_TOKENS_PER_REQUEST = 1024

const response = await anthropic.messages.create({
  model: 'claude-opus-4-5',
  max_tokens: MAX_TOKENS_PER_REQUEST,
  messages: conversation,
})
\`\`\`

Tighter budgets mean more headroom before TPM limits hit. For conversational apps, you rarely need 4096 tokens per response — 1024 is sufficient for most turns.

## Per-user rate limiting at the application layer

Before requests even reach Anthropic, throttle at the application layer. Supabase + a simple counter works well:

\`\`\`typescript
// lib/rateLimit.ts
import { createClient } from '@/lib/supabase/server'

const USER_LIMIT = 20  // requests per hour
const WINDOW_MS = 60 * 60 * 1000

export async function checkUserRateLimit(userId: string): Promise<{
  allowed: boolean
  remaining: number
  resetAt: Date
}> {
  const supabase = await createClient()
  const windowStart = new Date(Date.now() - WINDOW_MS).toISOString()

  const { count } = await supabase
    .from('api_usage')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', windowStart)

  const used = count ?? 0
  const remaining = Math.max(0, USER_LIMIT - used)
  const resetAt = new Date(Date.now() + WINDOW_MS)

  return { allowed: remaining > 0, remaining, resetAt }
}

export async function recordUsage(userId: string, tokens: number) {
  const supabase = await createClient()
  await supabase.from('api_usage').insert({
    user_id: userId,
    tokens_used: tokens,
    created_at: new Date().toISOString(),
  })
}
\`\`\`

The table:

\`\`\`sql
create table api_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  tokens_used integer not null,
  created_at timestamptz default now()
);

create index on api_usage(user_id, created_at);
\`\`\`

## Wrapping your route handler

\`\`\`typescript
// app/api/chat/route.ts
import { checkUserRateLimit, recordUsage } from '@/lib/rateLimit'
import Anthropic from '@anthropic-ai/sdk'

export async function POST(request: Request) {
  const { userId, messages } = await request.json()

  const rateCheck = await checkUserRateLimit(userId)
  if (!rateCheck.allowed) {
    return Response.json(
      {
        error: 'Rate limit reached',
        resetAt: rateCheck.resetAt,
        message: \`You have used your hourly limit. Try again at \${rateCheck.resetAt.toLocaleTimeString()}.\`
      },
      { status: 429 }
    )
  }

  const anthropic = new Anthropic()
  const response = await anthropic.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 1024,
    messages,
  })

  // Record actual token usage
  await recordUsage(userId, response.usage.input_tokens + response.usage.output_tokens)

  return Response.json({ content: response.content[0] })
}
\`\`\`

## Request queuing for burst scenarios

For apps where simultaneous requests are common (e.g., a classroom tool, a team product), a simple queue prevents pile-ups:

\`\`\`typescript
// lib/queue.ts — in-memory queue (use BullMQ for production)
type QueuedRequest = {
  resolve: (value: unknown) => void
  reject: (reason: unknown) => void
  fn: () => Promise<unknown>
}

class SimpleQueue {
  private queue: QueuedRequest[] = []
  private running = 0
  private maxConcurrent = 3  // tune to stay within your tier's RPM

  async add<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push({ resolve: resolve as (v: unknown) => void, reject, fn: fn as () => Promise<unknown> })
      this.drain()
    })
  }

  private async drain() {
    if (this.running >= this.maxConcurrent || this.queue.length === 0) return
    const item = this.queue.shift()!
    this.running++
    try {
      const result = await item.fn()
      item.resolve(result)
    } catch (err) {
      item.reject(err)
    } finally {
      this.running--
      this.drain()
    }
  }
}

export const anthropicQueue = new SimpleQueue()
\`\`\`

## Graceful degradation

When limits are hit despite queuing, tell users clearly:

\`\`\`typescript
// components/ChatInput.tsx
if (error.status === 429) {
  const resetTime = new Date(error.resetAt).toLocaleTimeString()
  setErrorMessage(\`You've reached your request limit. It resets at \${resetTime}.\`)
  return
}
\`\`\`

Never show a raw "429 Too Many Requests" error. Users think the app is broken. A clear message about limits — and when they reset — keeps trust intact.

## Monitoring usage in production

Track a few key metrics:

- Average tokens per request (spot bloated prompts)
- Requests per user (identify power users and abuse)
- Rate limit hits per hour (signals you need a higher tier)
- P95 response latency (correlates with token count)

Supabase makes this straightforward since you already have \`api_usage\` with token counts. A simple dashboard query:

\`\`\`sql
select
  date_trunc('hour', created_at) as hour,
  count(*) as requests,
  sum(tokens_used) as total_tokens,
  avg(tokens_used) as avg_tokens
from api_usage
where created_at > now() - interval '24 hours'
group by 1
order by 1;
\`\`\`

Rate limiting is unglamorous but it is what separates toys from products that survive their first week of real traffic.

---

*Try this today: go to console.anthropic.com → Settings → Limits and note your current RPM and TPM ceilings. Then estimate your app's peak concurrent users × average tokens per request. If the math puts you within 2× of the limit under normal load, you are too close and need either a tier upgrade or tighter per-request budgets before you hit traffic.*`,
  },

]

async function main() {
  console.log(`Applying ${UPDATES.length} accuracy fixes (batch 55 — Yuki's technical blockers)...\n`)

  for (const update of UPDATES) {
    const { error } = await sb
      .from('articles')
      .update({ body: update.body.trim() })
      .eq('slug', update.slug)

    if (error) {
      console.error(`  ✗ ${update.slug}:`, error.message)
    } else {
      console.log(`  ✓ ${update.slug}`)
    }
  }

  console.log('\nDone.')
}

main().catch(console.error)
