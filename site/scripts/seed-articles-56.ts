/**
 * Batch 56 — Persona gap articles (from Persona Retro 1)
 *
 * Three articles surfaced as missing by specific personas:
 *
 * 1. after-your-manager-approves-claude
 *    Priya's gap. The moment after approval — first 48 hours. Most rollout content
 *    assumes you're still evaluating. Priya is past that. She needs a checklist
 *    for the week when she actually has to make it happen.
 *    Angle: process. Cluster: Team & Org. ~6 min.
 *
 * 2. multi-agent-failure-handling
 *    Marcus's gap. What happens when one agent in a pipeline times out, returns
 *    partial output, or produces garbage. The recovery patterns that make
 *    multi-agent systems actually reliable. Angle: failure. ~8 min.
 *
 * 3. auditing-your-eval-suite
 *    Dara's gap. Most eval advice is "write evals." This is for the developer
 *    who has evals and is now wondering whether they're testing the right things.
 *    Angle: process. Cluster: Evaluation & Safety. ~6 min.
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-56.ts
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

  // ── 1. After your manager approves Claude ─────────────────────────────────
  {
    termSlug: 'claude-projects',
    slug: 'after-your-manager-approves-claude',
    angle: 'process',
    title: "Your manager said yes. Now what? The first 48 hours of a Claude rollout",
    excerpt: "Approval is not adoption. What to do in the window between 'we can use this' and 'we actually use this' — before momentum stalls and inertia wins.",
    readTime: 6,
    cluster: 'Team & Org',
    body: `Approval is the easy part. The hard part is the 48-hour window between "we got sign-off" and actually having your team using Claude in their daily work. Most rollouts stall here — not because of resistance, but because the person who pushed for approval suddenly has no script for what comes next.

This is that script.

## Why the window matters

The same week you announce Claude to your team, three things compete for their attention: their existing workload, their skepticism about whether this will stick, and the vague fear of doing it wrong. If you do not move quickly and concretely, inertia wins. People file it under "interesting thing to try eventually" and never return.

The first 48 hours set the frame. Get one person using it for one real task before the week is out, and it becomes something your team does. Let it sit, and it becomes something your company approved in theory.

## Before you announce: the 30-minute setup

Do not announce until you have these three things in place:

**1. A shared Project with a base system prompt.**
Create a Claude Project for your team with a system prompt that covers: who you are, what the team does, key terminology, and what good output looks like. Even a rough version of this is better than nothing — it means the first time someone uses it, they get an answer calibrated to your context, not a generic one. This takes 20 minutes.

A minimal starting point:
\`\`\`
You are assisting the [team name] team at [company].

Context: [2–3 sentences about what your team does and who your stakeholders are]

Our terminology: [any acronyms or terms that are specific to your company or team]

When helping with written communication, match our company's tone: [professional/casual/direct/etc.]

Do not: make up names, figures, or internal references you don't have.
\`\`\`

**2. One concrete use case for the first session.**
Pick one task your team does regularly that takes 20-40 minutes of writing or thinking. Email drafts, meeting summaries, research briefs, status updates — anything where a first draft exists to react to is better than a blank page. Do not ask people to use Claude for everything at once. One specific thing.

**3. A 30-minute team session on the calendar within 48 hours.**
Not a demo. Not a training. A working session where people actually try it on the real task you identified. If you have more than 6 people, break into smaller groups. The goal is for every person to produce something they actually send or use before the session ends.

## The announcement message

Short. Concrete. Time-bounded. Something like:

> I got approval for us to use Claude, and I've set up a shared Project with our context already loaded. I want to run a 30-minute session [day/time] where we each try it on [specific task]. No prep needed — just show up.

That's it. Do not explain what Claude is. Do not send an article about AI. Do not promise it will change everything. You are asking for 30 minutes to try one thing.

## The working session

Open with one demonstration yourself — show the Project, show the system prompt, run one realistic query. Keep it under 5 minutes.

Then give everyone 15-20 minutes to try it on their own version of the task. Circulate. When someone gets a good result, ask them to share their screen.

Close by asking two questions: "What would you actually use this for in your work?" and "What felt broken?" Capture both. The first builds individual commitment. The second gives you your improvement list.

Do not end the session without a next step. "Try it once on your own this week before we check in on Friday" is sufficient.

## The follow-up

Three days later, send a short message asking who has used it since the session. Ask one person to share what they made — not the whole group, just one person. This creates social proof without pressure. It also tells you who your early adopter is; that person becomes your internal advocate for the next phase.

If fewer than half the team tried it since the session, the task you chose was probably too abstract or too different from their daily work. Ask them what they actually spend time on, pick something from that list, and try again.

## What to resist

**Resist sending a guide.** Written instructions create homework. Homework creates procrastination. A 30-minute working session creates a result.

**Resist covering everything at once.** Claude Code, integrations, advanced prompting — all of that comes later. Right now you need adoption, not sophistication.

**Resist making it optional.** "Try it if you want" means "half the team won't." Frame the session as the thing you're doing, not the thing that's available.

**Resist waiting for the perfect setup.** The system prompt will be wrong. The use case will be suboptimal. That is fine. You improve from there. A rough session that happens beats a polished one planned for next month.

---

*Related: [Setting up Claude for your team](/articles/setting-up-claude-for-your-team) — the two-layer model for team configuration. [Claude for your team's first week](/articles/first-week-with-claude) — individual onboarding for new users.*`,
  },

  // ── 2. Multi-agent failure handling ───────────────────────────────────────
  {
    termSlug: 'ai-agent',
    slug: 'multi-agent-failure-handling',
    angle: 'failure',
    title: "Multi-agent failure handling: timeouts, partial outputs, and recovery patterns",
    excerpt: "Agents fail differently than APIs. When a sub-agent times out halfway through a pipeline, you don't just get an error — you get partial state. The patterns that make multi-agent systems actually recover.",
    readTime: 8,
    cluster: 'AI Agents & Orchestration',
    body: `Single-agent failures are straightforward: the call fails, you retry or surface the error. Multi-agent failures are not. When agent A calls agent B which calls agent C, and agent C times out, you have partial state in B, a hanging call in A, and a user waiting for output that will never arrive cleanly.

Most multi-agent implementations handle the happy path well. The failure handling is where they break in production.

## The failure modes that actually happen

**Timeout mid-pipeline.** Agent B is waiting on agent C, which is doing something expensive (a web search, a large document analysis). After 30 seconds, the caller times out. Agent C may still be running. Now you have a partially completed pipeline with no clean way to resume.

**Partial output from a sub-agent.** Agent C returns, but its output is incomplete — it truncated because of max_tokens, it returned a partial JSON object, or it returned an error message embedded in the output text rather than as a proper error. The orchestrator receives something that looks like a result but is not.

**Cascading failures.** Agent A orchestrates agents B, C, and D in parallel. D fails. A does not know whether to wait for B and C, discard their results, or try to complete the task with partial data.

**Silent degradation.** A sub-agent does not fail hard — it returns a low-quality output that passes validation but produces a bad final result. This is the hardest failure mode to catch.

**State inconsistency.** Agent B writes to a database halfway through its task, then fails. The write committed. The task did not complete. Downstream agents working from that database now have inconsistent state.

## The foundational pattern: checkpoints and idempotency

The most important architectural decision for resilient multi-agent systems is making sub-agent operations idempotent — safe to retry without side effects.

\`\`\`python
import hashlib
import json
from typing import Any, Optional
import anthropic

client = anthropic.Anthropic()

def generate_task_id(task_input: dict) -> str:
    """Deterministic ID from task inputs — same inputs = same ID = safe to retry."""
    serialized = json.dumps(task_input, sort_keys=True)
    return hashlib.sha256(serialized.encode()).hexdigest()[:16]

class AgentTask:
    def __init__(self, task_id: str, task_input: dict):
        self.task_id = task_id
        self.task_input = task_input
        self.result: Optional[str] = None
        self.status: str = "pending"  # pending | running | complete | failed
        self.attempts: int = 0

    def run(self, prompt: str, max_retries: int = 3) -> str:
        for attempt in range(max_retries):
            self.attempts += 1
            self.status = "running"
            try:
                response = client.messages.create(
                    model="claude-sonnet-4-6",
                    max_tokens=2048,
                    messages=[{"role": "user", "content": prompt}]
                )
                self.result = response.content[0].text
                self.status = "complete"
                return self.result
            except anthropic.APITimeoutError:
                if attempt == max_retries - 1:
                    self.status = "failed"
                    raise
                # Exponential backoff before retry
                import time
                time.sleep(2 ** attempt)
            except anthropic.APIStatusError as e:
                if e.status_code == 529:  # Overloaded
                    import time
                    time.sleep(2 ** attempt)
                else:
                    self.status = "failed"
                    raise
        return ""  # unreachable, but satisfies type checker
\`\`\`

## Timeout handling with fallback strategies

For pipelines where one agent is on the critical path, design explicit fallback strategies before you need them.

\`\`\`python
import asyncio
from typing import Callable, TypeVar

T = TypeVar('T')

async def with_timeout(
    coro,
    timeout_seconds: float,
    fallback: Callable[[], T],
    task_name: str = "task"
) -> T:
    """Run a coroutine with timeout; call fallback on expiry."""
    try:
        return await asyncio.wait_for(coro, timeout=timeout_seconds)
    except asyncio.TimeoutError:
        print(f"[{task_name}] timed out after {timeout_seconds}s — using fallback")
        return fallback()

# Three fallback strategies:

# 1. Return a partial result with a flag
async def research_agent_with_fallback(query: str) -> dict:
    async def do_research():
        # ... full research agent call
        return {"result": "...", "complete": True}

    def partial_fallback():
        return {"result": f"Research for '{query}' was incomplete due to timeout. Available context only.", "complete": False}

    return await with_timeout(do_research(), timeout_seconds=30, fallback=partial_fallback, task_name="research")

# 2. Use a cheaper/faster model for the fallback
async def analysis_with_model_fallback(content: str) -> str:
    try:
        # Try Sonnet first (better quality)
        response = await asyncio.wait_for(
            asyncio.to_thread(
                client.messages.create,
                model="claude-sonnet-4-6",
                max_tokens=1024,
                messages=[{"role": "user", "content": content}]
            ),
            timeout=20
        )
        return response.content[0].text
    except asyncio.TimeoutError:
        # Fall back to Haiku (faster)
        response = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=512,
            messages=[{"role": "user", "content": f"Briefly: {content}"}]
        )
        return f"[Abbreviated] {response.content[0].text}"

# 3. Skip the agent and continue with available data
async def optional_enrichment(base_result: dict) -> dict:
    async def enrich():
        # enrichment call that might time out
        return {**base_result, "enriched": True, "extra_data": "..."}

    def skip_enrichment():
        return {**base_result, "enriched": False}

    return await with_timeout(enrich(), timeout_seconds=15, fallback=skip_enrichment, task_name="enrichment")
\`\`\`

## Parsing and validating sub-agent outputs

Partial outputs are harder to catch than failures. A sub-agent that returns truncated JSON looks like a success to the caller.

\`\`\`python
import json
from dataclasses import dataclass

@dataclass
class AgentOutput:
    raw: str
    parsed: Any
    is_valid: bool
    validation_errors: list[str]

def validate_agent_output(raw_output: str, expected_schema: dict) -> AgentOutput:
    """Validate that output matches expected structure before passing downstream."""
    errors = []

    # Check 1: Is it valid JSON if we expected JSON?
    parsed = None
    if expected_schema.get("type") == "json":
        try:
            parsed = json.loads(raw_output)
        except json.JSONDecodeError as e:
            errors.append(f"JSON parse failed: {e}")
            return AgentOutput(raw=raw_output, parsed=None, is_valid=False, validation_errors=errors)

    # Check 2: Required fields present
    required_fields = expected_schema.get("required", [])
    for field in required_fields:
        if field not in parsed:
            errors.append(f"Missing required field: {field}")

    # Check 3: Output not suspiciously short (truncation signal)
    min_length = expected_schema.get("min_length", 0)
    if len(raw_output) < min_length:
        errors.append(f"Output suspiciously short ({len(raw_output)} chars, expected ≥ {min_length})")

    # Check 4: Stop reason was 'end_turn' not 'max_tokens'
    # (Pass stop_reason from the API response, not just the content)
    stop_reason = expected_schema.get("_stop_reason")
    if stop_reason == "max_tokens":
        errors.append("Output was truncated at max_tokens — likely incomplete")

    return AgentOutput(
        raw=raw_output,
        parsed=parsed,
        is_valid=len(errors) == 0,
        validation_errors=errors
    )
\`\`\`

Always check \`stop_reason\` in the API response — \`max_tokens\` is the signal that output was truncated. Pass it alongside the content, don't discard it.

## Parallel agent coordination with partial failure

When multiple agents run in parallel and one fails, you need a policy for the others.

\`\`\`python
import asyncio
from enum import Enum

class FailurePolicy(Enum):
    FAIL_ALL = "fail_all"       # If any agent fails, fail the whole task
    BEST_EFFORT = "best_effort" # Return whatever succeeded, mark what failed
    REQUIRE_QUORUM = "quorum"   # Require N of M agents to succeed

async def run_parallel_agents(
    tasks: list[dict],
    policy: FailurePolicy = FailurePolicy.BEST_EFFORT,
    quorum: int = None
) -> dict:
    """Run agents in parallel with configurable failure policy."""

    async def run_single(task: dict) -> dict:
        try:
            result = await asyncio.to_thread(
                client.messages.create,
                model="claude-sonnet-4-6",
                max_tokens=1024,
                messages=[{"role": "user", "content": task["prompt"]}]
            )
            return {"id": task["id"], "success": True, "output": result.content[0].text}
        except Exception as e:
            return {"id": task["id"], "success": False, "error": str(e)}

    results = await asyncio.gather(*[run_single(t) for t in tasks])

    successes = [r for r in results if r["success"]]
    failures = [r for r in results if not r["success"]]

    if policy == FailurePolicy.FAIL_ALL and failures:
        raise RuntimeError(f"{len(failures)} agents failed: {[f['error'] for f in failures]}")

    if policy == FailurePolicy.REQUIRE_QUORUM:
        required = quorum or (len(tasks) // 2 + 1)
        if len(successes) < required:
            raise RuntimeError(f"Quorum not met: {len(successes)}/{required} agents succeeded")

    return {
        "results": successes,
        "failures": failures,
        "complete": len(failures) == 0
    }
\`\`\`

## State management: write-ahead logging

For pipelines that write to external systems (databases, APIs), use write-ahead logging to track what has committed so that retries do not cause double-writes.

\`\`\`python
from datetime import datetime
import uuid

class PipelineState:
    """Tracks committed side effects so retries are safe."""

    def __init__(self, pipeline_id: str):
        self.pipeline_id = pipeline_id
        self.committed_operations: dict[str, Any] = {}
        self.created_at = datetime.utcnow()

    def has_committed(self, operation_key: str) -> bool:
        return operation_key in self.committed_operations

    def mark_committed(self, operation_key: str, result: Any):
        self.committed_operations[operation_key] = {
            "result": result,
            "committed_at": datetime.utcnow().isoformat()
        }

    def get_committed(self, operation_key: str) -> Any:
        return self.committed_operations.get(operation_key, {}).get("result")

# Usage in a pipeline
async def idempotent_pipeline(input_data: dict) -> dict:
    pipeline_id = generate_task_id(input_data)
    state = PipelineState(pipeline_id)

    # Step 1 — only run if not already committed
    step1_key = f"{pipeline_id}:step1"
    if not state.has_committed(step1_key):
        result1 = await run_agent_step(input_data, step="analyze")
        state.mark_committed(step1_key, result1)
    else:
        result1 = state.get_committed(step1_key)

    # Step 2
    step2_key = f"{pipeline_id}:step2"
    if not state.has_committed(step2_key):
        result2 = await run_agent_step(result1, step="synthesize")
        state.mark_committed(step2_key, result2)
    else:
        result2 = state.get_committed(step2_key)

    return result2
\`\`\`

For production, persist \`PipelineState\` to Redis or Postgres so it survives process restarts.

## The silent degradation problem

The hardest failure mode is an agent that succeeds but produces bad output. No error thrown, but the downstream result is wrong.

The only defense is evaluating outputs before trusting them downstream. For critical pipeline steps, add a lightweight quality check:

\`\`\`python
def is_output_plausibly_correct(output: str, task_context: dict) -> tuple[bool, str]:
    """Quick sanity check before passing output downstream."""

    # Check 1: Contains expected entities
    expected_entities = task_context.get("required_entities", [])
    for entity in expected_entities:
        if entity.lower() not in output.lower():
            return False, f"Expected entity missing: {entity}"

    # Check 2: Not a refusal or error message
    refusal_signals = ["I cannot", "I'm unable to", "I don't have access", "As an AI"]
    for signal in refusal_signals:
        if signal in output:
            return False, f"Output appears to be a refusal: '{signal}'"

    # Check 3: Length within expected range
    min_len = task_context.get("min_output_length", 50)
    if len(output.split()) < min_len:
        return False, f"Output too short: {len(output.split())} words"

    return True, "ok"
\`\`\`

This will not catch subtle quality issues, but it catches the obvious failures that otherwise silently corrupt downstream steps.

---

*Related: [Multi-agent orchestration basics](/articles/multi-agent-orchestration-basics) — the foundational patterns before you get to failure handling. [Evaluating multi-agent systems](/articles/evaluating-multi-agent-systems) — how to measure whether your pipeline is working.*`,
  },

  // ── 3. Auditing your eval suite ───────────────────────────────────────────
  {
    termSlug: 'evals',
    slug: 'auditing-your-eval-suite',
    angle: 'process',
    title: "Auditing your eval suite: are you testing the right things?",
    excerpt: "Most eval suites test what was easy to write, not what matters most. A structured audit finds the gaps before production does — coverage blind spots, flaky assertions, and the failure modes you forgot to cover.",
    readTime: 6,
    cluster: 'Evaluation & Safety',
    body: `Most developers who have an eval suite have the same problem: they wrote evals for the cases they could easily construct, not the cases that matter most. After six months, the suite passes reliably — and still misses the bugs users actually encounter.

An eval audit is a structured process for finding those gaps. It takes two to three hours and usually surfaces three to five cases that should exist but don't.

## Why eval suites develop blind spots

Evals are typically written in two batches: at the start of a project ("let's set up the basics") and after a production incident ("let's make sure that never happens again"). Both batches have coverage problems.

**The initial batch** tests the happy path and a few obvious failure modes. It is written before you know what the real failures are.

**The incident batch** tests the specific bug that just happened. It does not test the adjacent bugs that are also possible but haven't happened yet.

Over time, the eval suite becomes a record of the bugs you have already had, not a prediction of the bugs you are about to have.

The audit process is designed to fix this.

## Step 1: Map your failure surface

Before you look at your existing evals, write down the complete list of ways your AI feature could fail in production. Do this from scratch, without looking at your current tests.

Organize by failure type:

**Output failures:**
- Wrong format (malformed JSON, unexpected structure)
- Truncated output (hit max_tokens before finishing)
- Hallucinated facts or entities
- Correct format, wrong content
- Refusal when it should answer

**Behavior failures:**
- Breaks character or persona
- Ignores instructions in the system prompt
- Leaks confidential information from the system prompt
- Uses a different language than expected
- Changes behavior unpredictably across turns in a conversation

**Edge case failures:**
- Very short input
- Very long input (near context limit)
- Input in an unexpected language
- Input that is adversarial (trying to jailbreak or manipulate)
- Input that is ambiguous

**Integration failures:**
- Downstream parse fails on valid output
- Output contains content that breaks the UI renderer
- Output is too long for the display area

Write these down before checking whether you have tests for them.

## Step 2: Check coverage

Now compare your failure surface to your existing test cases. For each item on your list, ask: "Do I have a test that would catch this if it started happening?"

Be strict. "I have a test that sometimes catches this" is not the same as "I have a test that reliably catches this."

A simple coverage table:

| Failure mode | Test exists? | Reliable? | Priority if missing |
|---|---|---|---|
| Malformed JSON output | ✓ | ✓ | — |
| Truncated output | ✗ | — | High |
| Persona breaks in turn 5+ | ✓ | Flaky | Medium |
| Adversarial input | ✗ | — | High |
| Very short input | ✗ | — | Low |

Anything High priority with no test is the first thing you add after the audit.

## Step 3: Identify flaky assertions

Flaky evals are the worst kind — they create false confidence when they pass and false alarms when they fail. A failing CI job that turns out to be a flaky eval teaches your team to ignore CI failures.

Signs a test is flaky:

- It passes sometimes and fails sometimes with identical input (temperature > 0 in your eval runner)
- It uses LLM-as-judge with a vague criteria ("is this helpful?")
- It relies on exact substring matching for content that could be phrased many ways
- It assumes a specific output length that can legitimately vary

Check each test: would it pass consistently if you ran it ten times? If not, either fix the assertion or mark it as a monitored test (run nightly, not in CI).

\`\`\`python
def run_flakiness_check(case: EvalCase, runs: int = 10) -> dict:
    """Run a case multiple times to detect flakiness."""
    import anthropic
    client = anthropic.Anthropic()

    results = []
    for i in range(runs):
        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=512,
            system=case.system_prompt,
            messages=[{"role": "user", "content": case.user_message}]
        )
        output = response.content[0].text
        passed = case.assert_fn(output)
        results.append(passed)

    pass_rate = sum(results) / len(results)
    return {
        "case": case.name,
        "pass_rate": pass_rate,
        "flaky": pass_rate < 1.0 and pass_rate > 0.0,
        "runs": results
    }
\`\`\`

Run this on your top 10-20 most important cases. Anything with a pass rate below 95% is flaky and needs attention.

## Step 4: Check your golden dataset currency

Most eval suites include a golden dataset: question-answer pairs where you know the right answer. This dataset ages. If your prompt has changed since you wrote the golden answers, the answers may no longer be what your system should produce.

For each item in your golden dataset, ask:
- Is this question still representative of real user input?
- Is this answer still what the current system prompt would produce for a perfect response?
- Has anything about your system (prompt, retrieval, tools) changed in ways that make this answer wrong?

A golden dataset that hasn't been reviewed in six months is almost certainly stale.

## Step 5: Check for missing regression tests

Look at your last three months of production bugs. For each one:

1. Could your eval suite have caught it before it shipped?
2. Did you add a test for it after it happened?

If the answer to (2) is "no," add it now. Every production bug that doesn't become an eval case is a bug waiting to happen again.

If the answer to (1) is "no — not catchable by an eval," ask why. Some failures are genuinely hard to test (emergent behavior across many turns, user-specific edge cases). But often, a more creative assertion could have caught it.

## What a healthy eval suite looks like

- **Deterministic fast path** — format, structure, and key content checks that run in seconds. These block CI on every PR.
- **LLM-judge medium path** — quality checks with specific, calibrated criteria. Run nightly or on main branch.
- **Regression cases** — one test per production bug. Never deleted.
- **Adversarial cases** — at least 5-10 inputs designed to break the system. Reviewed quarterly.
- **Golden dataset** — reviewed every time the system prompt changes significantly.
- **Flakiness budget** — any test with <95% pass rate across 10 runs is fixed or moved to monitored.

The audit is not a one-time process. Run it quarterly, or any time you make a major change to the system prompt or retrieval pipeline.

---

*Related: [Writing evals that catch regressions](/articles/writing-evals-that-catch-regressions) — the foundational implementation guide before auditing. [Evaluating multi-agent systems](/articles/evaluating-multi-agent-systems) — evaluation patterns specific to multi-agent pipelines.*

*Try this today: pick the five failure modes you most dread from Step 1 above. Write them down without looking at your current tests. Then check whether you have tests for each one. If you're missing two or more, start there.*`,
  },

]

async function main() {
  console.log(`Seeding ${ARTICLES.length} articles (batch 56 — persona gap articles)...\n`)

  for (const art of ARTICLES) {
    const term = await getTermId(art.termSlug)
    if (!term) {
      console.error(`  ✗ Term not found: ${art.termSlug}`)
      continue
    }

    const { error } = await sb.from('articles').upsert({
      slug: art.slug,
      term_id: term.id,
      term_name: term.name,
      term_slug: art.termSlug,
      cluster: art.cluster,
      title: art.title,
      angle: art.angle,
      body: art.body.trim(),
      excerpt: art.excerpt,
      read_time: art.readTime,
      tier: 3,
      published: true,
    }, { onConflict: 'slug' })

    if (error) {
      console.error(`  ✗ ${art.slug}:`, error.message)
    } else {
      console.log(`  ✓ ${art.slug}`)
    }
  }

  console.log('\nDone.')
}

main().catch(console.error)
