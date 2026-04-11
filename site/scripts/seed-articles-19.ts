/**
 * Batch 19 — Developer implementation guides
 * Assumes the reader can code. No hand-holding. Gets to implementation fast.
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-19.ts
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

  // ── 1. Your first Claude API call ────────────────────────────────────────
  {
    termSlug: 'api',
    slug: 'your-first-claude-api-call',
    angle: 'process',
    title: 'Your first Claude API call: what you actually need to know',
    excerpt: 'Auth, the messages array, streaming, token limits, and the errors you will hit in the first week. Everything else you can look up later.',
    readTime: 7,
    cluster: 'Infrastructure & Deployment',
    body: `This is not a rehash of the docs. The docs are fine. This is the stuff that trips people up in the first week — the mental models that make the API click, the errors you will hit, and the patterns worth getting right from the start.

**Prerequisites:** You have an Anthropic API key. You know how to make HTTP requests. Everything else is covered here.

## The request structure

Every Claude API request is a POST to \`https://api.anthropic.com/v1/messages\`. The payload has three required fields: \`model\`, \`max_tokens\`, and \`messages\`.

\`\`\`python
import anthropic

client = anthropic.Anthropic()  # reads ANTHROPIC_API_KEY from env

message = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Explain what a transformer is in two sentences."}
    ]
)

print(message.content[0].text)
\`\`\`

\`\`\`typescript
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic() // reads ANTHROPIC_API_KEY from env

const message = await client.messages.create({
  model: 'claude-sonnet-4-6',
  max_tokens: 1024,
  messages: [
    { role: 'user', content: 'Explain what a transformer is in two sentences.' }
  ]
})

console.log(message.content[0].text)
\`\`\`

## The messages array

The messages array is a conversation history. Each entry is a turn: \`user\` or \`assistant\`. You build up the array yourself — the API is stateless and has no memory between requests.

\`\`\`python
messages = [
    {"role": "user", "content": "What is the capital of France?"},
    {"role": "assistant", "content": "Paris."},
    {"role": "user", "content": "And the population?"},
]
\`\`\`

The array must always start with a \`user\` turn and alternate \`user\`/\`assistant\`. The API will error if you send two consecutive turns from the same role. If you are maintaining a chat history in your app, you are responsible for ensuring this alternation is correct.

## The system prompt

The system prompt sets context and instructions that apply to the whole conversation. It goes in a separate top-level \`system\` parameter — not in the messages array.

\`\`\`python
message = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    system="You are a technical writer. Be precise and concise. Use code examples when relevant.",
    messages=[
        {"role": "user", "content": "Explain embeddings."}
    ]
)
\`\`\`

The system prompt is not charged differently from message content — it consumes input tokens just like everything else.

## Streaming

For anything user-facing, stream. Waiting for the full response before rendering is a bad user experience, and for long outputs it is a long wait.

\`\`\`python
with client.messages.stream(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Write a haiku about APIs."}]
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
\`\`\`

\`\`\`typescript
const stream = await client.messages.stream({
  model: 'claude-sonnet-4-6',
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'Write a haiku about APIs.' }]
})

for await (const chunk of stream) {
  if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
    process.stdout.write(chunk.delta.text)
  }
}
\`\`\`

## Tokens and max_tokens

\`max_tokens\` caps the output, not the total context. If your input is 2000 tokens and \`max_tokens\` is 1024, the model will stop generating at 1024 output tokens — but your total context can be much larger.

Each model has a context window limit (the combined input + output). Claude Sonnet 4.6 supports 200k input tokens. If your input exceeds the limit you get a \`context_window_exceeded\` error. If the model reaches \`max_tokens\` before finishing its response, the \`stop_reason\` in the response will be \`max_tokens\` rather than \`end_turn\` — worth checking if truncated responses are a problem in your app.

A rough guide to token counts: 1 token ≈ 4 characters in English. 1000 tokens ≈ 750 words.

## Errors you will hit

**401 Unauthorized** — your API key is wrong or missing. Check \`ANTHROPIC_API_KEY\` in your environment. Do not hardcode the key.

**429 Too Many Requests** — you have hit a rate limit. The response includes \`Retry-After\` header. Implement exponential backoff: wait, retry, wait longer, retry. The SDK has built-in retry logic you can configure:

\`\`\`python
client = anthropic.Anthropic(max_retries=3)
\`\`\`

**529 Overloaded** — Anthropic's servers are under load. Treat like a 429 — wait and retry.

**InvalidRequestError** — you sent a malformed request. Common causes: messages array starts with \`assistant\`, consecutive same-role messages, \`max_tokens\` set to 0, or a model name that does not exist. Read the error message — it is usually specific.

## Structured output

Claude does not have a native structured output mode, but it follows instructions reliably. Ask for JSON explicitly and tell it the shape:

\`\`\`python
message = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=512,
    system="Always respond with valid JSON. No explanation, no markdown — raw JSON only.",
    messages=[{
        "role": "user",
        "content": 'Extract: {"name": string, "email": string, "company": string} from: "Hi, I\'m Alex Chen from Vercel, alex@vercel.com"'
    }]
)

import json
data = json.loads(message.content[0].text)
\`\`\`

For production use, wrap the parse in a try/except and consider asking Claude to double-check its output before responding. Alternatively, use a library like Instructor that wraps the API and handles retries on parse failure.

## Cost awareness from day one

Track tokens in every response:

\`\`\`python
print(message.usage.input_tokens, message.usage.output_tokens)
\`\`\`

Input and output tokens are priced separately — output is more expensive. Long system prompts that repeat across every request add up fast. If you are sending the same multi-paragraph system prompt with every call, look at [prompt caching](/glossary/prompt-caching) early. It is a single parameter change and can cut costs significantly for stateless workloads with repeated context.

## What to set up before you build anything larger

Before your API usage grows:

1. **Separate API keys per environment** — development, staging, production. Revoke them independently if compromised.
2. **Log input/output tokens per request** — you want this data when usage spikes unexpectedly.
3. **Set a spending limit** in the Anthropic console — stops runaway costs during testing bugs.
4. **Handle errors with retries** — any network-facing code needs backoff logic. The SDK does this if you configure it.

The rest — batching, caching, routing between models — you can add when you have a reason to. Get the basics right first.`,
  },

  // ── 2. Building a RAG pipeline from scratch ───────────────────────────────
  {
    termSlug: 'rag',
    slug: 'building-a-rag-pipeline-from-scratch',
    angle: 'process',
    title: 'Building a RAG pipeline from scratch: the decisions that actually matter',
    excerpt: 'Chunking strategy, embedding model choice, retrieval logic, and how to evaluate whether the thing is actually working. The implementation decisions that determine quality.',
    readTime: 9,
    cluster: 'Retrieval & Knowledge',
    body: `[Retrieval-Augmented Generation](/glossary/rag) is the pattern for giving a language model access to your data without fine-tuning. The concept is straightforward: retrieve relevant chunks from your knowledge base, stuff them into the context window, let Claude answer. The implementation has enough decisions to make it non-trivial.

This covers the full pipeline: ingestion, chunking, embedding, retrieval, generation, and evaluation. Focus is on the decisions that affect quality, not on getting something running in ten minutes.

## The full pipeline

\`\`\`
Document → Chunk → Embed → Store in vector DB
                              ↓
Query → Embed → Vector search → Top-K chunks → Claude → Answer
\`\`\`

Each step has levers. Here is what matters at each one.

## Step 1: Ingestion and chunking

Chunking is the most underrated decision in RAG. Bad chunking means bad retrieval, which means bad answers, regardless of how good your model is.

**Fixed-size chunking** (split every N tokens): simple, predictable, fast. Works poorly when your documents have structure — it splits mid-sentence, mid-table, mid-code-block. Good as a baseline, bad in production.

**Recursive character splitting**: split on paragraph breaks first, then sentences, then words, then characters. Tries to preserve natural text boundaries. This is what most libraries default to and it is reasonable for prose-heavy documents.

**Semantic chunking**: use an embedding model to identify where topic shifts occur, and chunk at those boundaries. More expensive, more accurate, worth it for documents where paragraph breaks do not cleanly align with topic changes.

**Document-aware chunking**: respect the document's actual structure — split markdown on headers, split code files on function boundaries, split PDFs on page breaks with header detection. This is the right approach for structured documents, and it is not that complicated:

\`\`\`python
import re

def chunk_markdown(text: str, max_tokens: int = 500) -> list[str]:
    # Split on h2 headers first
    sections = re.split(r'(?=^## )', text, flags=re.MULTILINE)
    chunks = []
    for section in sections:
        if len(section.split()) > max_tokens:
            # Further split long sections on paragraphs
            paragraphs = section.split('\\n\\n')
            current = []
            current_len = 0
            for p in paragraphs:
                p_len = len(p.split())
                if current_len + p_len > max_tokens and current:
                    chunks.append('\\n\\n'.join(current))
                    current = [p]
                    current_len = p_len
                else:
                    current.append(p)
                    current_len += p_len
            if current:
                chunks.append('\\n\\n'.join(current))
        else:
            chunks.append(section)
    return [c.strip() for c in chunks if c.strip()]
\`\`\`

**Chunk overlap**: add 10-20% overlap between chunks so that context at the boundary of one chunk is not lost. Easy to implement, meaningfully reduces retrieval gaps.

**Chunk size**: 200-500 tokens is the common range. Smaller chunks are more precise but lose context; larger chunks include more context but dilute relevance. Test both ends on your specific documents and queries.

## Step 2: Embedding

The embedding model turns text into a vector that captures meaning. Similar meaning → similar vectors → found by vector search.

For most use cases, \`text-embedding-3-small\` (OpenAI) or \`embed-english-v3.0\` (Cohere) are solid choices. They are fast, cheap, and good. You do not need the largest model unless you have measured a quality gap with the smaller one.

Critical: **embed your chunks and your queries with the same model**. Mixing models produces nonsense distances.

\`\`\`python
from openai import OpenAI

embed_client = OpenAI()

def embed(text: str) -> list[float]:
    response = embed_client.embeddings.create(
        model="text-embedding-3-small",
        input=text
    )
    return response.data[0].embedding
\`\`\`

Store the embedding alongside the chunk text and any metadata (source document, page number, section header) that will help at generation time.

## Step 3: Vector storage and retrieval

For development, \`numpy\` with cosine similarity is fine. For production, use a real vector database — pgvector (Postgres extension), Pinecone, Weaviate, Qdrant, or Chroma. They handle indexing, approximate nearest-neighbor search, and filtering at scale.

\`\`\`python
import numpy as np

def cosine_similarity(a: list[float], b: list[float]) -> float:
    a, b = np.array(a), np.array(b)
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))

def retrieve(query: str, chunks: list[dict], top_k: int = 5) -> list[dict]:
    query_embedding = embed(query)
    scored = [
        {**chunk, "score": cosine_similarity(query_embedding, chunk["embedding"])}
        for chunk in chunks
    ]
    return sorted(scored, key=lambda x: x["score"], reverse=True)[:top_k]
\`\`\`

**Hybrid search**: vector search finds semantically similar content but misses exact keyword matches. BM25 (keyword search) finds exact matches but misses paraphrases. Combining both — hybrid search — consistently outperforms either alone. Most production RAG systems use hybrid retrieval with a reranker.

**Reranking**: take your top-20 retrieved chunks, run them through a cross-encoder reranker (Cohere Rerank, or a local model), and keep the top 5. Cross-encoders are more accurate than embedding similarity because they process query and document together rather than independently. This step meaningfully improves precision.

## Step 4: Generation

Construct the prompt carefully. The retrieval context should be clearly separated from the question, and Claude should be instructed on how to handle cases where the retrieved context does not contain the answer.

\`\`\`python
import anthropic

client = anthropic.Anthropic()

def answer(query: str, retrieved_chunks: list[dict]) -> str:
    context = "\\n\\n---\\n\\n".join([
        f"Source: {c['source']}\\n{c['text']}"
        for c in retrieved_chunks
    ])

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        system="""You are a helpful assistant. Answer questions using only the provided context.
If the context does not contain enough information to answer, say so directly.
Do not make up information. Cite the source when relevant.""",
        messages=[{
            "role": "user",
            "content": f"Context:\\n{context}\\n\\nQuestion: {query}"
        }]
    )

    return message.content[0].text
\`\`\`

**Context window management**: if your retrieved chunks are large, you can overflow the context. Track token counts. \`anthropic.count_tokens()\` or tiktoken for estimation. Drop lower-scoring chunks before you hit the limit.

## Step 5: Evaluation

This is where most RAG implementations fall apart. You cannot improve what you do not measure.

The minimum viable eval set: 20-50 question-answer pairs grounded in your documents. For each question, you know the correct answer and which source it should come from.

Measure:
- **Retrieval recall**: does the correct source appear in the top-K results?
- **Answer correctness**: is the generated answer correct? (Manual for now, LLM-as-judge at scale)
- **Faithfulness**: does the answer only use information from the retrieved context? (Important for hallucination detection)

\`\`\`python
def evaluate_retrieval(eval_set: list[dict], chunks: list[dict]) -> dict:
    hits = 0
    for item in eval_set:
        retrieved = retrieve(item["question"], chunks, top_k=5)
        retrieved_sources = {r["source"] for r in retrieved}
        if item["expected_source"] in retrieved_sources:
            hits += 1
    return {
        "recall@5": hits / len(eval_set),
        "total": len(eval_set)
    }
\`\`\`

Run this eval every time you change chunking strategy, embedding model, or retrieval parameters. It gives you a number. Numbers let you make decisions.

## The things that actually move quality

In rough order of impact:

1. **Chunking strategy** — document-aware chunking beats fixed-size meaningfully
2. **Reranking** — cross-encoder after vector retrieval is a consistent win
3. **Hybrid search** — catches the exact-match cases embedding misses
4. **Evaluation** — the only way to know if anything is working

Embedding model choice, vector database choice, and chunk size matter less than people think. Get the eval working first, then optimize.`,
  },

  // ── 3. Writing evals that catch regressions ───────────────────────────────
  {
    termSlug: 'evals',
    slug: 'writing-evals-that-catch-regressions',
    angle: 'process',
    title: 'Writing evals that catch regressions before your users do',
    excerpt: 'What to measure, how to structure test cases, and how to run evals in CI so that prompt changes and model updates don\'t silently break your product.',
    readTime: 7,
    cluster: 'Evaluation & Safety',
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

You do not need a dashboard for this. A log file with \`{date, model, pass_rate, commit}\` is enough to see trends.`,
  },

  // ── 4. Streaming responses ────────────────────────────────────────────────
  {
    termSlug: 'streaming',
    slug: 'streaming-claude-responses-implementation',
    angle: 'process',
    title: 'Streaming Claude responses: implementation patterns and the tradeoffs',
    excerpt: 'When to stream, how to implement it properly in Python and TypeScript, error handling mid-stream, and the UX patterns that actually work.',
    readTime: 6,
    cluster: 'Infrastructure & Deployment',
    body: `Streaming matters for anything user-facing. A five-second blank wait followed by a full response feels broken. A response that appears word-by-word feels alive, even if the total generation time is the same.

Beyond UX, streaming lets you process output incrementally — detect early termination, pipe to downstream systems, or display partial results before generation finishes. Here is how to implement it correctly across different contexts.

## When to stream

Stream when:
- A human is waiting and watching
- Response length is unpredictable and could be long
- You want to pipe output to another process as it arrives
- You need to detect certain tokens early and react (e.g., stop generation when a sentinel appears)

Do not stream when:
- You need the complete response before doing anything with it (JSON parsing, database writes)
- You are running batch jobs where throughput matters more than latency
- The response is short (under ~100 tokens) — streaming overhead is not worth it

## Basic streaming in Python

\`\`\`python
import anthropic

client = anthropic.Anthropic()

# Using the context manager
with client.messages.stream(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Explain async/await in Python."}]
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)

# Get the final message object after streaming completes
final_message = stream.get_final_message()
print(f"\\n\\nInput tokens: {final_message.usage.input_tokens}")
print(f"Output tokens: {final_message.usage.output_tokens}")
\`\`\`

The context manager handles connection cleanup and gives you access to the final message (with usage stats) after the stream closes. If you need raw events:

\`\`\`python
with client.messages.stream(...) as stream:
    for event in stream:
        if event.type == "content_block_delta":
            print(event.delta.text, end="", flush=True)
        elif event.type == "message_stop":
            print("\\n[done]")
\`\`\`

## Streaming in TypeScript

\`\`\`typescript
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

const stream = await client.messages.stream({
  model: 'claude-sonnet-4-6',
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'Explain async/await in Python.' }]
})

// Stream text as it arrives
for await (const chunk of stream) {
  if (
    chunk.type === 'content_block_delta' &&
    chunk.delta.type === 'text_delta'
  ) {
    process.stdout.write(chunk.delta.text)
  }
}

// Or use the convenience method
stream.on('text', (text) => process.stdout.write(text))
const finalMessage = await stream.finalMessage()
\`\`\`

## Streaming to a browser via Server-Sent Events

The common pattern: your backend calls Claude, streams the response, forwards it to the browser via SSE.

\`\`\`typescript
// Next.js API route (App Router)
import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

const client = new Anthropic()

export async function POST(req: NextRequest) {
  const { message } = await req.json()

  const stream = client.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [{ role: 'user', content: message }]
  })

  const encoder = new TextEncoder()

  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (
          chunk.type === 'content_block_delta' &&
          chunk.delta.type === 'text_delta'
        ) {
          controller.enqueue(encoder.encode(\`data: \${JSON.stringify({ text: chunk.delta.text })}\n\n\`))
        }
      }
      controller.enqueue(encoder.encode('data: [DONE]\n\n'))
      controller.close()
    }
  })

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    }
  })
}
\`\`\`

\`\`\`typescript
// Browser client
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: userInput })
})

const reader = response.body!.getReader()
const decoder = new TextDecoder()

while (true) {
  const { done, value } = await reader.read()
  if (done) break

  const chunk = decoder.decode(value)
  const lines = chunk.split('\\n').filter(line => line.startsWith('data: '))

  for (const line of lines) {
    const data = line.slice(6)
    if (data === '[DONE]') break
    const { text } = JSON.parse(data)
    appendToUI(text)  // your function to update the DOM
  }
}
\`\`\`

## Error handling mid-stream

Errors can occur after the stream has started — the connection can drop, the server can 529. Handle this at the stream level:

\`\`\`python
try:
    with client.messages.stream(...) as stream:
        accumulated = ""
        for text in stream.text_stream:
            accumulated += text
            print(text, end="", flush=True)
except anthropic.APIStatusError as e:
    print(f"\\nStream error: {e.status_code} — {e.message}")
    # accumulated contains whatever was received before the error
    # decide: retry from scratch, or surface partial output
except anthropic.APIConnectionError:
    print("\\nConnection dropped mid-stream")
\`\`\`

For TypeScript:
\`\`\`typescript
try {
  for await (const chunk of stream) {
    // process chunks
  }
} catch (error) {
  if (error instanceof Anthropic.APIError) {
    console.error(\`Stream failed: \${error.status} \${error.message}\`)
  }
}
\`\`\`

## Accumulating a full response from a stream

If you need to process the complete output (parse JSON, run validation) but still want the UX of streaming:

\`\`\`python
buffer = ""
with client.messages.stream(...) as stream:
    for text in stream.text_stream:
        buffer += text
        # optionally show progress without showing partial JSON
        print(".", end="", flush=True)

print()  # newline after dots
data = json.loads(buffer)  # now parse the complete output
\`\`\`

## UX patterns worth knowing

**Show a cursor or typing indicator** while the stream opens but before the first token arrives. There is a ~300-500ms delay between the request and the first token. Without a visual signal, the interface looks frozen.

**Do not render markdown mid-stream.** If you convert markdown to HTML as tokens arrive, you get broken rendering — partial bold tags, half-rendered lists. Buffer until you have a complete "block" (paragraph break or two newlines), then render the completed block.

**Abort on user action.** If the user navigates away or cancels, close the stream:

\`\`\`typescript
const controller = new AbortController()

const stream = await client.messages.stream(
  { model: 'claude-sonnet-4-6', max_tokens: 1024, messages },
  { signal: controller.signal }
)

// Call this on user cancel / component unmount
controller.abort()
\`\`\`

**Do not re-render on every token.** React state updates on every character means hundreds of re-renders per response. Batch updates with \`requestAnimationFrame\` or accumulate into a ref and flush periodically.`,
  },

]

async function main() {
  console.log(`Seeding ${ARTICLES.length} articles (batch 19 — developer implementation guides)…\n`)

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
