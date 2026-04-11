/**
 * Batch 21 — Prompt caching, cost optimization, chatbot memory, note-taking
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-21.ts
 *
 * NOTE: inline backticks in body strings are escaped as \` to avoid TS template literal issues.
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

  // ── 1. Prompt caching: implementation guide ──────────────────────────────
  {
    termSlug: 'prompt-caching',
    slug: 'prompt-caching-implementation',
    angle: 'process',
    title: 'Prompt caching with Claude: cut costs 80% on repeated context',
    excerpt: 'One parameter change, measurable results. How cache_control works, what qualifies for caching, the gotchas, and how to verify it is actually working.',
    readTime: 6,
    cluster: 'Infrastructure & Deployment',
    body: `[Prompt caching](/glossary/prompt-caching) is the highest ROI optimization available to most Claude applications. If your requests share a large prefix — a system prompt, a long document, few-shot examples — you can mark that content for caching and pay 90% less on cache hits. The write cost is 25% higher than a normal token, but after the first request, reads are 90% cheaper and 85% faster.

The math is simple. A 10,000-token system prompt costs about $0.03 per request at full price. With caching and a 90% hit rate, that drops to about $0.003. At 10,000 requests per day, that is $270 versus $27. Monthly, $8,100 versus $810.

## What actually gets cached

Caching works on the prefix of your prompt — a contiguous block of content at the beginning that stays the same across requests. The key constraint: the cached block must be at least 1,024 tokens (2,048 for some models). Anything shorter does not qualify.

What qualifies:
- System prompts with detailed instructions, persona definitions, or tool schemas
- Long documents or knowledge bases appended before user messages
- Multi-turn conversation history that accumulates but does not change
- Few-shot examples at the start of a conversation

What does not qualify:
- Short system prompts (under 1,024 tokens)
- Content that changes every request
- Content after the user's variable input

## The implementation

Add \`cache_control\` to the content blocks you want cached:

\`\`\`python
import anthropic

client = anthropic.Anthropic()

system_prompt = """You are a technical support agent for Acme Corp...
[2,000+ tokens of detailed instructions, FAQs, product specs]
"""

response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    system=[
        {
            "type": "text",
            "text": system_prompt,
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[
        {"role": "user", "content": user_question}
    ]
)
\`\`\`

The \`cache_control: {"type": "ephemeral"}\` marker tells Claude to cache this block. Ephemeral caches last 5 minutes and refresh on each hit. If your traffic is sparse enough that caches expire between requests, you will not see the savings.

## Multi-block caching

You can cache multiple blocks, but each must meet the 1,024-token minimum:

\`\`\`python
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    system=[
        {
            "type": "text",
            "text": instructions,       # ~3,000 tokens of instructions
            "cache_control": {"type": "ephemeral"}
        },
        {
            "type": "text",
            "text": product_catalog,    # ~5,000 tokens of product data
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=messages
)
\`\`\`

The second block is only cacheable if the first block is also cached — caching is prefix-based. If block 1 is not cached on a particular request, block 2 will not be either.

## Caching conversation history

For multi-turn applications, cache the accumulated history up to the latest turn:

\`\`\`python
def build_messages_with_cache(history: list[dict], new_user_message: str) -> list[dict]:
    """Build message array with cache_control on the latest assistant turn."""
    messages = list(history)
    
    # Mark the last assistant message for caching
    if messages and messages[-1]["role"] == "assistant":
        last = messages[-1]
        if isinstance(last["content"], str):
            last = {
                "role": "assistant",
                "content": [
                    {
                        "type": "text",
                        "text": last["content"],
                        "cache_control": {"type": "ephemeral"}
                    }
                ]
            }
            messages[-1] = last
    
    messages.append({"role": "user", "content": new_user_message})
    return messages
\`\`\`

This pattern caches everything up to the current turn. On the next request, Claude reads the cached history instead of reprocessing it.

## Verifying it works

Check \`usage\` in the response:

\`\`\`python
print(response.usage)
# CacheUsage(
#   cache_creation_input_tokens=10234,  # first request: cache written
#   cache_read_input_tokens=0,
#   input_tokens=47,
#   output_tokens=312
# )

# Second request:
print(response.usage)
# CacheUsage(
#   cache_creation_input_tokens=0,
#   cache_read_input_tokens=10234,  # cache hit!
#   input_tokens=47,
#   output_tokens=298
# )
\`\`\`

\`cache_creation_input_tokens\` on the first request, \`cache_read_input_tokens\` on subsequent ones. If you are seeing \`cache_creation_input_tokens\` on every request, the cache is expiring before the next call hits — your traffic is too sparse or your TTL assumptions are wrong.

## The gotchas

**Order matters.** Caching is prefix-based. If you reorder your system prompt blocks between requests, Claude cannot match the cached prefix and writes a new one. Keep cached content at the top and stable.

**The 5-minute TTL.** Ephemeral caches expire after 5 minutes of inactivity. For low-traffic routes, you may see more cache misses than expected. If this is a problem, structure your application to send a cheap keep-alive request to refresh the cache, or batch requests to maintain cache temperature.

**Model versions matter.** Cache keys include the model. Switching from \`claude-sonnet-4-6\` to \`claude-opus-4-6\` invalidates the cache. Plan model upgrades with this in mind — traffic might see a temporary cost spike.

**Tool schemas count as tokens.** If you have a large set of tools, their schemas are part of the prompt. You can cache tool definitions by placing them in the system with \`cache_control\`. This is often overlooked.

The implementation is one line of JSON. The savings are real and immediate. Add it.`,
  },

  // ── 2. Cost optimization for Claude applications ─────────────────────────
  {
    termSlug: 'total-cost-of-ownership',
    slug: 'claude-cost-optimization',
    angle: 'process',
    title: 'Cutting Claude API costs without cutting quality',
    excerpt: 'Token budgets, model routing, caching, batching, and the decisions that have the biggest impact on your monthly bill.',
    readTime: 7,
    cluster: 'Infrastructure & Deployment',
    body: `[Claude API](/glossary/api) costs scale with tokens. Every word in, every word out, every system prompt, every document you append — it all adds up. For most applications, a small number of decisions account for the majority of the bill. Here is how to find and fix them.

## Start with measurement

You cannot optimize what you cannot see. Before changing anything, instrument your application:

\`\`\`python
import anthropic
from dataclasses import dataclass, field
from collections import defaultdict

@dataclass
class UsageTracker:
    input_tokens: int = 0
    output_tokens: int = 0
    cache_read_tokens: int = 0
    cache_creation_tokens: int = 0
    request_count: int = 0
    costs_by_route: dict = field(default_factory=lambda: defaultdict(float))
    
    def record(self, usage, route: str, model: str):
        self.input_tokens += usage.input_tokens
        self.output_tokens += usage.output_tokens
        self.cache_read_tokens += getattr(usage, 'cache_read_input_tokens', 0)
        self.cache_creation_tokens += getattr(usage, 'cache_creation_input_tokens', 0)
        self.request_count += 1
        # Calculate cost based on model pricing
        cost = self._calculate_cost(usage, model)
        self.costs_by_route[route] += cost
    
    def _calculate_cost(self, usage, model: str) -> float:
        # Rough pricing for Sonnet 4.6 (check current pricing at anthropic.com)
        input_cost = usage.input_tokens * 3 / 1_000_000
        output_cost = usage.output_tokens * 15 / 1_000_000
        return input_cost + output_cost

tracker = UsageTracker()
\`\`\`

Run this for a week. You will usually find that 20% of your routes generate 80% of the cost.

## The highest-impact changes

### 1. Prompt caching for repeated context

If your system prompt is over 1,024 tokens and you send thousands of requests per day, [prompt caching](/articles/prompt-caching-implementation) is your first fix. One parameter change, 80-90% cost reduction on the cached portion. See the implementation guide for details.

### 2. Right-sizing your model

Not every request needs the most capable model. Most applications have a mix of:
- Simple classification, extraction, formatting → Haiku
- Typical generation, Q&A, summarization → Sonnet
- Complex reasoning, ambiguous problems → Opus

Routing correctly can cut costs 5-10x on simple requests:

\`\`\`python
def choose_model(task_type: str, complexity_score: float) -> str:
    if task_type in ("classify", "extract", "format") or complexity_score < 0.3:
        return "claude-haiku-4-5-20251001"
    elif complexity_score < 0.7:
        return "claude-sonnet-4-6"
    else:
        return "claude-opus-4-6"
\`\`\`

The complexity score can be based on input length, number of constraints, presence of ambiguity signals — whatever correlates with difficulty in your specific domain. Start simple and calibrate with evals.

### 3. Output length control

Output tokens cost 5x more than input tokens on most Claude models. If your application is generating long responses and only using part of them, you are wasting money.

Strategies:
- Set \`max_tokens\` to the minimum you need, not the maximum you might ever need
- Use structured output (JSON mode) which tends to be more concise than prose
- Ask Claude to be concise explicitly in your system prompt — it responds to this
- If you need a short answer, say so: "in one sentence" or "in under 50 words"

\`\`\`python
# Instead of
response = client.messages.create(max_tokens=4096, ...)

# Use the smallest limit that covers your actual outputs
response = client.messages.create(max_tokens=512, ...)
\`\`\`

### 4. Batch API for async workloads

If your use case does not require real-time responses — nightly data processing, document analysis, bulk classification — the [Batch API](https://docs.anthropic.com/en/docs/build-with-claude/batch-processing) offers 50% cost savings with up to 24-hour turnaround.

\`\`\`python
# Create a batch instead of individual requests
batch = client.beta.messages.batches.create(
    requests=[
        {
            "custom_id": f"doc_{i}",
            "params": {
                "model": "claude-sonnet-4-6",
                "max_tokens": 256,
                "messages": [{"role": "user", "content": doc}]
            }
        }
        for i, doc in enumerate(documents)
    ]
)
\`\`\`

For workloads with thousands of documents, this is often the single largest cost lever available.

### 5. Context window management

Long contexts cost proportionally more. If your application accumulates conversation history, cap it:

\`\`\`python
def trim_history(messages: list[dict], max_tokens: int = 4000) -> list[dict]:
    """Keep the most recent messages within a token budget."""
    # Rough estimate: 4 chars ≈ 1 token
    total = 0
    result = []
    for msg in reversed(messages):
        content = msg.get("content", "")
        if isinstance(content, list):
            text = " ".join(b.get("text", "") for b in content if b.get("type") == "text")
        else:
            text = str(content)
        tokens_est = len(text) // 4
        if total + tokens_est > max_tokens:
            break
        result.insert(0, msg)
        total += tokens_est
    return result
\`\`\`

Pair this with prompt caching to preserve as much history as possible while controlling cost.

## The decisions that rarely move the needle

- **Compression and paraphrasing of prompts.** You save maybe 10-15% of input tokens with significant engineering effort, and you often degrade quality enough to need more output tokens to compensate.
- **Switching providers for cost alone.** If quality matters and you have already calibrated for Claude, switching providers introduces re-calibration costs (new evals, new prompt engineering, new failure modes) that are rarely worth the per-token savings.
- **Obsessing over output tokens before fixing system prompts.** A 5,000-token system prompt that runs 10,000 times per day is 50M tokens. A 200-token output that runs 10,000 times is 2M. Fix the system prompt first.

## A practical audit

Run this against your last week of API usage:
1. Which routes have the highest input token counts? Can they use caching?
2. Which routes always use the same model? Could lighter tasks use Haiku?
3. What is your average output token count? Does it match what you actually use?
4. Are any of your workloads async-compatible for batch pricing?

Most applications find 40-60% savings opportunity in the first audit without touching quality. The engineering investment is usually one afternoon.`,
  },

  // ── 3. Building a chatbot with persistent memory ─────────────────────────
  {
    termSlug: 'context-window',
    slug: 'chatbot-with-persistent-memory',
    angle: 'process',
    title: 'Building a Claude chatbot that remembers users across sessions',
    excerpt: 'Persistent memory for chatbots is not a Claude feature — it is an architecture decision. Here is how to build it correctly.',
    readTime: 8,
    cluster: 'Agents & Orchestration',
    body: `The [context window](/glossary/context-window) resets every time a new conversation starts. Claude does not remember previous sessions by default — it has no persistent state. If you want a chatbot that knows a user's name, preferences, history, or past interactions, you have to build that yourself.

This is not a limitation to work around. It is an architecture decision. The right approach depends on what you actually need to remember.

## What kinds of memory matter

Before building anything, identify what you need to persist:

**User facts:** name, job, location, timezone, preferences — things that do not change often and apply to all conversations.

**Conversation summaries:** what was discussed in previous sessions — useful for returning users but does not need to be verbatim.

**Entities and relationships:** things the user has mentioned (projects, people, goals) that might come up again.

**Session history:** the full turn-by-turn record — usually too large to include in every prompt; use summarization instead.

## The architecture

A persistent memory chatbot has three layers:

\`\`\`
User message
     ↓
Memory retrieval (fetch relevant context from DB)
     ↓
Prompt assembly (system + memory summary + recent history + new message)
     ↓
Claude API call
     ↓
Response + memory update (extract and store new facts)
\`\`\`

The memory store can be as simple as a JSON file for single-user applications, or a proper database for multi-user production systems.

## Implementation

### Step 1: User profile store

\`\`\`python
import json
import os
from pathlib import Path
from anthropic import Anthropic

client = Anthropic()

def load_user_memory(user_id: str) -> dict:
    path = Path(f"memory/{user_id}.json")
    if path.exists():
        return json.loads(path.read_text())
    return {"user_id": user_id, "facts": {}, "session_summaries": [], "entity_notes": {}}

def save_user_memory(user_id: str, memory: dict) -> None:
    Path("memory").mkdir(exist_ok=True)
    Path(f"memory/{user_id}.json").write_text(json.dumps(memory, indent=2))
\`\`\`

### Step 2: Memory extraction after each response

After every assistant turn, ask Claude to extract any new facts worth storing:

\`\`\`python
EXTRACT_PROMPT = """Review this conversation and extract any new, persistent facts about the user.
Output a JSON object with a "facts" key containing key-value pairs.
Only include information that would be useful in future conversations.
If nothing new was learned, output {"facts": {}}.

Conversation:
{conversation}"""

def extract_new_facts(conversation: list[dict]) -> dict:
    convo_text = "\n".join(
        f"{m['role'].upper()}: {m['content']}"
        for m in conversation[-4:]  # only look at recent turns
    )
    response = client.messages.create(
        model="claude-haiku-4-5-20251001",  # cheap model for extraction
        max_tokens=256,
        messages=[{
            "role": "user",
            "content": EXTRACT_PROMPT.format(conversation=convo_text)
        }]
    )
    try:
        return json.loads(response.content[0].text)
    except (json.JSONDecodeError, IndexError):
        return {"facts": {}}
\`\`\`

Use a cheap model (Haiku) for extraction — this runs after every turn and does not need Sonnet-level capability.

### Step 3: Session summarization

At the end of a session (or when history gets long), summarize:

\`\`\`python
SUMMARIZE_PROMPT = """Summarize this conversation in 2-3 sentences.
Focus on what was discussed, any decisions made, and anything the user might want to follow up on.

Conversation:
{conversation}"""

def summarize_session(conversation: list[dict]) -> str:
    convo_text = "\n".join(
        f"{m['role'].upper()}: {m['content']}"
        for m in conversation
    )
    response = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=128,
        messages=[{"role": "user", "content": SUMMARIZE_PROMPT.format(conversation=convo_text)}]
    )
    return response.content[0].text
\`\`\`

### Step 4: Assembling the prompt with memory

\`\`\`python
def build_system_prompt(memory: dict) -> str:
    parts = [
        "You are a helpful assistant. You have memory of past conversations with this user."
    ]
    
    if memory.get("facts"):
        facts_str = "\n".join(f"- {k}: {v}" for k, v in memory["facts"].items())
        parts.append(f"\nWhat you know about this user:\n{facts_str}")
    
    if memory.get("session_summaries"):
        recent = memory["session_summaries"][-3:]  # last 3 sessions
        summaries_str = "\n".join(f"- {s}" for s in recent)
        parts.append(f"\nPrevious conversations:\n{summaries_str}")
    
    return "\n".join(parts)

def chat(user_id: str, user_message: str, history: list[dict]) -> tuple[str, list[dict]]:
    memory = load_user_memory(user_id)
    
    history.append({"role": "user", "content": user_message})
    
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        system=build_system_prompt(memory),
        messages=history
    )
    
    assistant_message = response.content[0].text
    history.append({"role": "assistant", "content": assistant_message})
    
    # Extract and store new facts
    extracted = extract_new_facts(history)
    memory["facts"].update(extracted.get("facts", {}))
    save_user_memory(user_id, memory)
    
    return assistant_message, history

def end_session(user_id: str, history: list[dict]) -> None:
    memory = load_user_memory(user_id)
    summary = summarize_session(history)
    memory["session_summaries"].append(summary)
    # Keep last 10 session summaries
    memory["session_summaries"] = memory["session_summaries"][-10:]
    save_user_memory(user_id, memory)
\`\`\`

## What to store, what to skip

**Store:** explicit user statements about themselves ("I work in marketing", "I have two kids", "I prefer bullet points"), decisions made, topics to follow up on.

**Skip:** anything the user mentioned in passing, facts you are uncertain about, anything that might change (current mood, what they had for lunch). Bad memory is worse than no memory — hallucinating facts about a user breaks trust immediately.

**Review before storing:** run an LLM check if you are uncertain: "Is this fact about the user or just something they mentioned incidentally?" This extra call is worth it.

## Production considerations

For multi-user production, replace the JSON file store with a proper database. The memory structure is simple enough for any key-value store (Redis, DynamoDB) or a relational table with a JSONB column (PostgreSQL).

Consider whether to show users their stored memory and let them edit it. For consumer applications, this builds trust. A simple "What do I know about you?" command that returns the facts store is worth adding.

Token budget: a memory summary of 200-400 tokens adds minimal cost but significant continuity. If your memory summaries are growing to 2,000+ tokens, that is a sign you are storing too much. Summarize the summaries.`,
  },

  // ── 4. Note-taking and knowledge management with Claude ─────────────────
  {
    termSlug: 'claude-projects',
    slug: 'note-taking-knowledge-management-claude',
    angle: 'process',
    title: 'Using Claude for note-taking and personal knowledge management',
    excerpt: 'Capture, connect, and retrieve your thinking. How to use Claude Projects, custom instructions, and conversational recall to build a system that works.',
    readTime: 6,
    cluster: 'Tools & Ecosystem',
    body: `Most note-taking systems have the same problem: you put things in, but you do not get them back when you need them. The capture is easy. The retrieval is where things break down.

[Claude Projects](/glossary/claude-projects) changes the equation. A Project maintains a persistent context — documents, notes, instructions — that Claude can draw on across all conversations in that project. It is not a search engine, but it is a thinking partner that knows your material.

## What Claude Projects actually does

A Project is a container with:
- **Project knowledge:** files and documents you upload (PDFs, text files, pasted notes)
- **Custom instructions:** how Claude should behave in this project
- **Conversation history:** all chats within the project are available

Claude can reference any of this material when you ask questions or request synthesis. It does not automatically retrieve; you ask and it searches. The more specific your question, the better the answer.

## Setting up a knowledge base

Start with a clear scope. One Project per domain works better than one giant Project for everything. Examples that work well:
- Research on a specific topic you are investigating over weeks or months
- Notes from a book, course, or conference
- Planning material for a project or product
- Meeting notes and action items for a specific client or team

For a research Project:

**Instructions (set in Project settings):**
\`\`\`
You help me research and synthesize information on [topic].

When I share notes or links, summarize the key points and flag:
- Contradictions with existing material
- Questions I should investigate further
- Connections to other ideas in the project

When I ask questions, answer from the project material first, then from your training. Be clear about which source you are using.
\`\`\`

**Initial knowledge load:** paste your existing notes, upload PDFs of key papers, add a document that lists the main questions you are trying to answer.

## Capture workflows that work

The best capture workflow is the one you actually do. Three patterns that work:

**1. Voice-to-text → Claude cleanup**
Dictate a rough note on your phone, paste it into Claude, ask for a clean structured summary. Faster than typing, cleaner than raw dictation.

**2. End-of-day brain dump**
Spend 5 minutes writing everything you want to remember from the day. Paste it into Claude and ask: "Summarize the key points worth keeping, identify any follow-up actions, and note anything that connects to previous project material."

**3. Article/paper synthesis**
When you read something worth keeping: paste the text or link, ask Claude to "extract the 3-5 most useful ideas from this and explain how they relate to what we have discussed before."

## Retrieval: getting things back

The power is in the questions you ask:

- "What have I noted about [topic]?" — surfaces material on a subject
- "What questions haven't I resolved about [topic]?" — surfaces open threads
- "Summarize what I know about X vs Y" — synthesizes competing ideas
- "What would I need to know to decide between [option A] and [option B]?" — gap analysis
- "What connections exist between [topic 1] and [topic 2]?" — synthesis across areas

The more specific the question, the better the answer. "Tell me what I know" is too vague. "What did I conclude about the tradeoffs between vector databases for this project?" retrieves something useful.

## Writing and thinking with your notes

Claude Projects shine for thinking-through-writing:

**Draft from notes:** "Based on my research notes, write a first draft of a memo explaining [topic] to a non-technical audience."

**Find the argument:** "I have a lot of material here. What is the strongest argument I can make for [position]? What is the strongest counter-argument?"

**Identify gaps:** "I am planning to write about [topic]. What areas are not covered in my existing notes?"

**Connect ideas:** "Is there a through-line connecting [idea A], [idea B], and [idea C]? Try to articulate a unifying framework."

## Limitations to know

**Retrieval is not perfect.** Claude can miss things in long documents or summarize them imprecisely. For critical facts, verify against the source.

**Context size matters.** If you upload very large documents, Claude reads them but may not weight all parts equally. Shorter, more focused documents tend to retrieve better than 50-page PDFs.

**Projects are not databases.** There is no structured query, no tagging system, no guaranteed recall. If you need to find a specific fact reliably, keep a separate structured reference (a spreadsheet, a simple Notion table) and use Claude for synthesis.

**Memory across Projects does not transfer.** Each Project is isolated. If you have three research Projects on related topics, Claude in Project A does not know what is in Projects B and C. Plan your Project structure accordingly.

## The realistic picture

Claude Projects work best as a thinking partner for bounded research or planning efforts, not as a replacement for a full PKM system like Obsidian or Notion. The value is in the conversation — asking questions about your material, getting synthesis, exploring connections — rather than structured storage and retrieval.

If you find yourself wanting to tag, link, or search across notes, you need a proper tool for that layer and Claude as the synthesis and Q&A layer on top. The two are complementary, not competing.`,
  },

]

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`Seeding ${ARTICLES.length} articles (batch 21 — prompt caching, cost optimization, chatbot memory, note-taking)…\n`)

  for (const art of ARTICLES) {
    try {
      const term = await getTermId(art.termSlug)
      if (!term) {
        console.log(`  ✗ Term not found: ${art.termSlug}`)
        continue
      }

      const { error } = await sb.from('articles').upsert({
        term_id: term.id,
        term_slug: art.termSlug,
        slug: art.slug,
        angle: art.angle,
        title: art.title,
        excerpt: art.excerpt,
        read_time: art.readTime,
        cluster: art.cluster,
        body: art.body,
        published: true,
      }, { onConflict: 'slug' })

      if (error) {
        console.error(`  ✗ ${art.slug}:`, error.message)
      } else {
        console.log(`  ✓ ${art.slug}`)
      }
    } catch (error: any) {
      console.error(`  ✗ ${art.slug}:`, error.message)
    }
  }

  console.log('\nDone.')
}

main().catch(console.error)
