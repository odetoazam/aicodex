/**
 * Batch 47 — Production monitoring for Claude apps
 * 1. monitoring-your-claude-app — Marcus's open question #2:
 *    What logs to capture, what to alert on, what Anthropic rate limiting
 *    looks like in practice (not the docs numbers — the actual experience).
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-47.ts
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
    termSlug: 'evals',
    slug: 'monitoring-your-claude-app',
    angle: 'process',
    title: 'Monitoring a Claude app in production: what to log and what to alert on',
    excerpt: "Claude API calls are invisible unless you instrument them. Here is the logging structure, the metrics that actually matter, what Anthropic rate limiting looks like in practice, and the alert thresholds worth setting.",
    readTime: 7,
    cluster: 'Developer Patterns',
    body: `A Claude app without instrumentation is a black box. You find out something is wrong when a user reports it, not from a dashboard. Fixing this takes an afternoon — and the information you get back changes how you make decisions about the app.

Here is the full setup: what to log, how to structure it, which metrics to surface, and what to alert on.

## What to log on every Claude call

Log these fields for every request, regardless of whether it succeeds or fails:

\`\`\`python
import time
import logging
import json
from dataclasses import dataclass, asdict
from typing import Optional

@dataclass
class ClaudeCallLog:
    timestamp: str          # ISO 8601
    request_id: str         # UUID you generate, for tracing
    user_id: str            # Authenticated user — never anonymous
    feature: str            # "email_draft", "doc_summary", "chat" — what called Claude
    model: str              # "claude-sonnet-4-6", etc.
    input_tokens: int
    output_tokens: int
    cached_tokens: int      # From usage.cache_read_input_tokens
    latency_ms: int         # Wall clock from request start to response complete
    stop_reason: str        # "end_turn", "max_tokens", "tool_use"
    error: Optional[str]    # None on success, error type on failure
    error_status: Optional[int]  # HTTP status if error

def log_claude_call(log: ClaudeCallLog):
    # Use structured logging — JSON makes this searchable in any log platform
    logging.info(json.dumps(asdict(log)))
\`\`\`

**Why each field matters:**

- \`user_id\` — mandatory. Without it you cannot identify abuse, calculate per-user costs, or debug a specific user's experience.
- \`feature\` — mandatory. "Your app called Claude 50,000 times today" tells you nothing. "Your email_draft feature called Claude 48,000 times — 3x normal" tells you something broke.
- \`cached_tokens\` — track this separately so you can see your actual cache hit rate and whether prompt caching is working.
- \`stop_reason: "max_tokens"\` — this is a silent failure. Claude hit the token limit and stopped mid-response. Your user got a truncated answer. You want to know when this happens.

The implementation wrapper:

\`\`\`python
import anthropic
import uuid
from datetime import datetime, timezone

client = anthropic.Anthropic()

def claude_call(
    messages: list,
    system: str,
    model: str = "claude-sonnet-4-6",
    max_tokens: int = 2048,
    user_id: str = None,
    feature: str = "unknown",
    **kwargs,
) -> anthropic.types.Message:
    request_id = str(uuid.uuid4())
    start = time.perf_counter()
    error = None
    error_status = None
    response = None

    try:
        response = client.messages.create(
            model=model,
            max_tokens=max_tokens,
            system=system,
            messages=messages,
            **kwargs,
        )
        return response
    except anthropic.APIStatusError as e:
        error = type(e).__name__
        error_status = e.status_code
        raise
    except Exception as e:
        error = type(e).__name__
        raise
    finally:
        latency_ms = int((time.perf_counter() - start) * 1000)
        log_claude_call(ClaudeCallLog(
            timestamp=datetime.now(timezone.utc).isoformat(),
            request_id=request_id,
            user_id=user_id or "anonymous",
            feature=feature,
            model=model,
            input_tokens=response.usage.input_tokens if response else 0,
            output_tokens=response.usage.output_tokens if response else 0,
            cached_tokens=getattr(response.usage, 'cache_read_input_tokens', 0) if response else 0,
            latency_ms=latency_ms,
            stop_reason=response.stop_reason if response else "error",
            error=error,
            error_status=error_status,
        ))
\`\`\`

This wrapper is a drop-in replacement for \`client.messages.create\`. Pass it everywhere in your codebase and you have full observability.

## The metrics that matter

From the raw logs, build these five views:

**1. Error rate by feature**
What percentage of calls to each feature are failing? A global 2% error rate that turns out to be 15% errors in one specific feature is a completely different problem than 2% uniformly distributed.

**2. p50 and p95 latency by feature**
Mean latency hides tail latency problems. p95 is the latency your worst 5% of users experience. If your p95 is 12 seconds and your p50 is 2 seconds, you have a problem that most of your users will never see — but some will see frequently enough to churn.

**3. Token cost per request by feature**
Divide (input_tokens * input_price + output_tokens * output_price) per call, grouped by feature. This tells you which features are expensive and whether cost per request is growing over time (often a sign that context is accumulating without pruning).

**4. Cache hit rate**
cached_tokens / input_tokens gives you your cache effectiveness. If you have implemented prompt caching and your cache hit rate is below 30%, your caching setup is probably wrong. See the [prompt caching guide](/articles/prompt-caching-implementation).

**5. max_tokens stop rate**
What percentage of responses have stop_reason = "max_tokens"? Anything above 2-3% means your max_tokens is too low for this feature, or users are sending inputs that generate longer responses than you designed for.

## What Anthropic rate limiting actually looks like

The documentation says you have request-per-minute and token-per-minute limits. In practice:

**You will hit token-per-minute (TPM) before RPM.** On any feature that uses substantial context (RAG, document analysis, multi-turn conversation), a small burst of concurrent users will exhaust your TPM limit quickly. Ten users sending 10K-token requests simultaneously will exhaust a 100K TPM limit in seconds.

**The 429 response is the signal.** When you hit a rate limit, you get an \`anthropic.RateLimitError\` (HTTP 429) with headers \`anthropic-ratelimit-requests-remaining\` and \`anthropic-ratelimit-tokens-remaining\`. Log these headers when you receive 429s — they tell you how close to the limit you were running before the burst.

**Rate limits are per-API-key, not per-user.** All your users share the same limit. A single user running batch processing can exhaust the limit for everyone else.

**Scaling limits:** Anthropic increases rate limits as you demonstrate usage. Usage-based limit increases happen automatically; if you need a specific limit for a launch, contact Anthropic support in advance.

Log the 429 error with the user_id, feature, and timestamp. After a few incidents you will see the pattern — usually one feature or one user type driving the burst.

## Alert thresholds worth setting

These are the four alerts that matter most. The specific thresholds depend on your app, but these are reasonable starting points:

| Alert | Threshold | Why |
|-------|-----------|-----|
| Error rate | > 5% over 10 minutes | Operational problem — investigate |
| 429 rate | > 0 over 5 minutes | Rate limit hit — is this a traffic spike or abuse? |
| p95 latency | > 15s over 10 minutes | UX degradation — users are timing out |
| Daily cost | > 150% of 7-day average | Unexpected usage — check for runaway process or abuse |

The cost alert is the most important one to get right early. A bug that causes Claude to be called in a loop, or an unexpected traffic spike, can run up costs faster than you expect. Set the alert threshold low enough to catch problems the same day they start.

## Quick setup without a full observability stack

If you don't have Datadog or a similar tool yet, structured JSON logs to stdout plus a simple aggregation query is enough to get started:

\`\`\`python
# Daily summary — run this against your logs
import json
from collections import defaultdict
from datetime import datetime, timedelta

def daily_summary(log_lines: list[str]) -> dict:
    today = datetime.utcnow().date()
    features = defaultdict(lambda: {
        'calls': 0, 'errors': 0, 'total_latency': 0,
        'input_tokens': 0, 'output_tokens': 0, 'max_tokens_stops': 0
    })

    for line in log_lines:
        try:
            log = json.loads(line)
            if log['timestamp'][:10] != str(today):
                continue
            f = log['feature']
            features[f]['calls'] += 1
            if log['error']:
                features[f]['errors'] += 1
            features[f]['total_latency'] += log['latency_ms']
            features[f]['input_tokens'] += log['input_tokens']
            features[f]['output_tokens'] += log['output_tokens']
            if log['stop_reason'] == 'max_tokens':
                features[f]['max_tokens_stops'] += 1
        except (json.JSONDecodeError, KeyError):
            continue

    summary = {}
    for feature, stats in features.items():
        calls = stats['calls'] or 1
        summary[feature] = {
            'calls': stats['calls'],
            'error_rate_pct': round(stats['errors'] / calls * 100, 1),
            'avg_latency_ms': round(stats['total_latency'] / calls),
            'max_tokens_rate_pct': round(stats['max_tokens_stops'] / calls * 100, 1),
            'total_input_tokens': stats['input_tokens'],
            'total_output_tokens': stats['output_tokens'],
        }
    return summary
\`\`\`

Once you have a week of data, you will know your baselines. Anything that deviates significantly from baseline is worth investigating.

## The dashboard you want by month one

By the end of your first month in production, you should be able to answer these questions without querying logs:

1. What is today's total API cost vs. yesterday?
2. Which feature has the highest p95 latency right now?
3. Have we hit any 429s in the last 24 hours?
4. Which users are generating the most token usage?

If you cannot answer these without digging into logs, you need better instrumentation. Production incidents are much easier to diagnose when you have this data already collected.

---

*For the pre-launch deployment checklist, [the production deployment guide](/articles/deploying-claude-app-production) covers secrets management, rate limiting, and the full readiness checklist. For application-layer rate limiting to protect against per-user abuse, [see the rate limiting guide](/articles/rate-limiting-claude-api).*`,
  },
]

async function seed() {
  console.log('Seeding batch 47...\n')

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
      tier: 3,
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
