/**
 * Batch 45 — Multi-agent evaluation
 * 1. evaluating-multi-agent-systems — Marcus's open question: how do you
 *    know if your multi-agent pipeline is actually better than a single call?
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-45.ts
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
    termSlug: 'multi-agent-system',
    slug: 'evaluating-multi-agent-systems',
    angle: 'process',
    title: 'How to evaluate whether your multi-agent pipeline is actually better',
    excerpt: "Most multi-agent systems are shipped without ever measuring if they beat a single well-prompted Claude call. Here is the evaluation methodology: golden datasets, LLM-as-judge scoring, ablation testing, and the cost/latency tradeoff equation.",
    readTime: 8,
    cluster: 'Agents & Orchestration',
    body: `Multi-agent pipelines are easy to build and hard to justify. Decomposing a task into three agents feels like progress. Actually measuring whether those three agents produce better output than one well-prompted call is the work most developers skip.

This is the methodology. It assumes you already have a working multi-agent pipeline and you want to know if it is pulling its weight.

## The baseline you are comparing against

Before running any evaluation, define your baseline: the best single-agent version of the same task. This is usually not the naive version. Take your multi-agent pipeline, understand what it is doing, and write the best single-system-prompt version you can.

If your pipeline has an orchestrator that plans a task, a research agent that gathers information, and a synthesis agent that writes the final output — your single-agent baseline should be a Claude call with a strong system prompt that does all three. Use your most capable model. Give it the same inputs the pipeline receives.

The comparison you want is: multi-agent at its best vs. single-agent at its best. Not multi-agent vs. the first single-prompt you threw together.

## Building a golden dataset

You need a representative set of inputs to evaluate over. Thirty examples is enough to see signal. Fewer than twenty and you will be fooled by noise.

Good golden datasets have two properties:
1. **Representative distribution.** Mix easy cases and hard cases. If your pipeline handles ten different input types, include examples of each. A dataset that is all easy cases will make both systems look equally good.
2. **Ground truth or known-good outputs.** For some tasks (structured extraction, classification), you have ground truth. For generative tasks (writing, summarization, analysis), you need reference outputs or a judgment criteria you can apply consistently.

\`\`\`python
# Example golden dataset structure
golden_dataset = [
    {
        "id": "001",
        "input": "...",           # The task input
        "reference": "...",       # Ground truth or known-good output (if available)
        "difficulty": "easy",     # Your categorization
        "category": "research",   # Input type
    },
    # ...
]
\`\`\`

If you do not have historical examples, generate them. Run your pipeline on a range of real inputs, manually review the outputs, and keep the ones you can make a judgment on. Do not use synthetic test cases that do not match your real distribution.

## Running the comparison

Run every example through both systems. Collect the outputs, latency, and token usage.

\`\`\`python
import anthropic
import time
import json
from concurrent.futures import ThreadPoolExecutor

client = anthropic.Anthropic()

def run_single_agent(input_data: str) -> dict:
    start = time.perf_counter()
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2048,
        system=YOUR_BEST_SINGLE_AGENT_SYSTEM_PROMPT,
        messages=[{"role": "user", "content": input_data}]
    )
    elapsed = time.perf_counter() - start
    return {
        "output": response.content[0].text,
        "latency_s": elapsed,
        "input_tokens": response.usage.input_tokens,
        "output_tokens": response.usage.output_tokens,
    }

def run_multi_agent(input_data: str) -> dict:
    start = time.perf_counter()
    output = your_multi_agent_pipeline(input_data)  # your existing pipeline
    elapsed = time.perf_counter() - start
    # Collect token usage from all agents — add this instrumentation to your pipeline
    return {
        "output": output,
        "latency_s": elapsed,
        "total_input_tokens": ...,   # sum across all agent calls
        "total_output_tokens": ...,  # sum across all agent calls
    }

results = []
for example in golden_dataset:
    single = run_single_agent(example["input"])
    multi = run_multi_agent(example["input"])
    results.append({
        "id": example["id"],
        "single_agent": single,
        "multi_agent": multi,
    })
\`\`\`

Run these in parallel if your pipeline is slow and you have many examples. Keep the raw outputs — you will need them for the quality evaluation step.

## Measuring quality: LLM-as-judge

For generative tasks where there is no ground truth, the fastest path to quality scores is using Claude to evaluate the outputs. Use Haiku — it is fast, cheap, and accurate enough for pairwise comparisons.

The pairwise comparison pattern is more reliable than absolute scoring. Do not ask "rate this response 1-10." Ask "given this input, which response is better and why?"

\`\`\`python
JUDGE_PROMPT = """You are evaluating two AI-generated responses to the same task.

Task input:
{input}

Response A:
{response_a}

Response B:
{response_b}

Evaluate which response better accomplishes the task. Consider: accuracy, completeness,
clarity, and relevance. Do not consider length as a quality signal unless length
affects the other criteria.

Respond with JSON only:
{{"winner": "A" or "B" or "tie", "reasoning": "one sentence"}}"""

def judge_pair(input_data: str, response_a: str, response_b: str) -> dict:
    response = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=256,
        messages=[{
            "role": "user",
            "content": JUDGE_PROMPT.format(
                input=input_data,
                response_a=response_a,
                response_b=response_b,
            )
        }]
    )
    return json.loads(response.content[0].text)

# Run pairwise judgments
judgments = []
for result in results:
    example = next(e for e in golden_dataset if e["id"] == result["id"])

    # Judge A vs B and B vs A to reduce position bias
    ab = judge_pair(example["input"], result["single_agent"]["output"], result["multi_agent"]["output"])
    ba = judge_pair(example["input"], result["multi_agent"]["output"], result["single_agent"]["output"])

    judgments.append({
        "id": result["id"],
        "ab_winner": ab["winner"],  # "A" = single, "B" = multi
        "ba_winner": ba["winner"],  # "A" = multi, "B" = single — flip for comparison
        "ab_reasoning": ab["reasoning"],
        "ba_reasoning": ba["reasoning"],
    })
\`\`\`

Running both orderings and requiring agreement before calling a winner reduces the position bias where LLM judges tend to favor whichever response they see first.

**Interpreting results:**
- Multi-agent wins cleanly: quality improvement is real
- Tie: the pipeline is adding cost and latency for no quality gain — simplify
- Single-agent wins: the orchestration overhead is hurting coherence

If you have ground truth (for extraction or classification tasks), skip the LLM judge and compute accuracy directly against ground truth.

## Ablation: finding the agent that is adding latency

If your pipeline has three agents and you suspect one of them is not contributing, remove it and measure the quality delta.

This is an ablation. You run the full pipeline, then a version with each agent removed, and compare quality scores for each variant.

\`\`\`python
pipeline_variants = {
    "full":              run_full_pipeline,
    "no_research_agent": run_without_research,
    "no_validator":      run_without_validator,
    "single_agent":      run_single_agent,
}

variant_results = {}
for variant_name, runner in pipeline_variants.items():
    variant_results[variant_name] = []
    for example in golden_dataset:
        result = runner(example["input"])
        variant_results[variant_name].append({
            "id": example["id"],
            "output": result["output"],
            "latency_s": result["latency_s"],
        })

# Then judge each variant against the full pipeline
# An agent that can be removed with no quality drop is not earning its cost
\`\`\`

The agent that can be removed with no measurable quality drop is the one adding latency for nothing. This is how you find the dead weight.

## The cost/latency tradeoff equation

Quality is not the only axis. A multi-agent pipeline that is 10% better in quality but 4x slower and 3x more expensive may not be worth it — depending on your use case.

Compute this for your specific context:

\`\`\`python
def analyze_tradeoffs(results):
    single_latency  = [r["single_agent"]["latency_s"] for r in results]
    multi_latency   = [r["multi_agent"]["latency_s"] for r in results]

    # Rough token cost — adjust for your model pricing
    COST_PER_M_INPUT  = 3.00   # claude-sonnet-4-6 pricing, per 1M tokens
    COST_PER_M_OUTPUT = 15.00

    single_cost = sum(
        (r["single_agent"]["input_tokens"] * COST_PER_M_INPUT / 1_000_000) +
        (r["single_agent"]["output_tokens"] * COST_PER_M_OUTPUT / 1_000_000)
        for r in results
    )
    multi_cost = sum(
        (r["multi_agent"]["total_input_tokens"] * COST_PER_M_INPUT / 1_000_000) +
        (r["multi_agent"]["total_output_tokens"] * COST_PER_M_OUTPUT / 1_000_000)
        for r in results
    )

    import statistics
    print(f"Latency p50  — single: {statistics.median(single_latency):.1f}s  multi: {statistics.median(multi_latency):.1f}s")
    print(f"Latency p95  — single: {sorted(single_latency)[int(len(single_latency)*0.95)]:.1f}s  multi: {sorted(multi_latency)[int(len(multi_latency)*0.95)]:.1f}s")
    print(f"Total cost   — single: \${single_cost:.4f}  multi: \${multi_cost:.4f}")
    print(f"Cost multiple: {multi_cost / single_cost:.1f}x")
\`\`\`

The question to answer: is the quality improvement worth the cost and latency multiple? For a real-time user-facing feature, a 3x latency increase may be a dealbreaker regardless of quality. For a background batch job, 3x cost is the number that matters.

## When single-agent wins

Multi-agent pipelines earn their complexity when:
- The task is genuinely too long for a single context window
- Independent subtasks can run in parallel and the parallelism recovery compensates for the orchestration overhead
- Different subtasks require meaningfully different system prompts or models
- You can demonstrate quality improvement in evaluation

Single-agent wins when:
- The task fits comfortably in a context window with room to spare
- The pipeline's sub-tasks are sequential (no parallel benefit)
- The orchestration step adds context switching without adding clarity
- Quality scores are equivalent or worse

The most common finding in an honest ablation: one or two agents in a three-agent pipeline are not contributing measurable quality improvement. The orchestrator plans something that a good system prompt would have directed implicitly. The validator catches nothing that the original agent would not have caught.

If your evaluation shows this, the right move is to collapse the pipeline. A single well-prompted Claude call is easier to debug, cheaper to run, and faster to ship fixes for.

---

*For the implementation patterns behind multi-agent systems, [the orchestration basics article](/articles/multi-agent-orchestration-basics) covers the core patterns. For evaluating simpler Claude integrations (not multi-agent), [the evals guide](/articles/writing-evals-that-catch-regressions) is the starting point.*`,
  },
]

async function seed() {
  console.log('Seeding batch 45...\n')

  for (const article of ARTICLES) {
    const term = await getTermId(article.termSlug)
    if (!term) {
      console.error(`  ✗ Term not found: \${article.termSlug} (for \${article.slug})`)
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
      console.error(`  ✗ \${article.slug}:`, error.message)
    } else {
      console.log(`  ✓ \${article.slug}`)
    }
  }

  console.log('\nDone.')
}

seed().then(() => process.exit(0))
