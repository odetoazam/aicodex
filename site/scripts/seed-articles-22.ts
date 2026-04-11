/**
 * Batch 22 — Deploying Claude apps, production error handling, end-to-end chatbot
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-22.ts
 *
 * NOTE: inline backticks in body strings are escaped as \` to avoid TS template literal issues.
 * Dollar-brace expressions use \${ to avoid template expression parsing.
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

  // ── 1. Deploying a Claude application to production ───────────────────────
  {
    termSlug: 'api',
    slug: 'deploying-claude-app-production',
    angle: 'process',
    title: 'Deploying a Claude application: from localhost to production',
    excerpt: 'Environment variables, rate limits, error handling, costs, and the things that bite you on your first production deploy. A practical checklist.',
    readTime: 7,
    cluster: 'Infrastructure & Deployment',
    body: `Getting Claude working locally is one thing. Shipping it to real users is another. The gap is not about code — it is about secrets management, rate limits, cost controls, error handling, and observability. Here is what to sort out before you deploy.

## Secrets and environment variables

Never hardcode your API key. This seems obvious, but it is the most common mistake in Claude apps shipped by first-time builders.

The right pattern:

\`\`\`python
import os
import anthropic

# Load from environment — never hardcode
client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])
\`\`\`

For deployment platforms:
- **Vercel:** Settings → Environment Variables → add \`ANTHROPIC_API_KEY\`
- **Railway:** Variables tab in your service settings
- **Fly.io:** \`fly secrets set ANTHROPIC_API_KEY=sk-...\`
- **AWS/GCP/Azure:** Use their secrets manager services, not env vars directly for production

Never commit \`.env\` files. Add \`.env\`, \`.env.local\`, \`.env.production\` to \`.gitignore\` before your first commit, not after.

## Rate limits and what happens when you hit them

The Anthropic API has rate limits: requests per minute (RPM), tokens per minute (TPM), and tokens per day (TPD). Your tier determines the limits. When you exceed them, you get a \`429 RateLimitError\`.

Retry with exponential backoff:

\`\`\`python
import anthropic
import time

def call_with_retry(client, max_retries=5, **kwargs):
    for attempt in range(max_retries):
        try:
            return client.messages.create(**kwargs)
        except anthropic.RateLimitError as e:
            if attempt == max_retries - 1:
                raise
            wait = 2 ** attempt  # 1, 2, 4, 8, 16 seconds
            print(f"Rate limited. Waiting {wait}s...")
            time.sleep(wait)
        except anthropic.APIStatusError as e:
            if e.status_code >= 500:
                # Server error — retry
                if attempt == max_retries - 1:
                    raise
                time.sleep(2 ** attempt)
            else:
                raise  # 4xx errors: don't retry
\`\`\`

For TypeScript:

\`\`\`typescript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

async function callWithRetry(params: Anthropic.MessageCreateParamsNonStreaming, maxRetries = 5) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await client.messages.create(params);
    } catch (err) {
      if (err instanceof Anthropic.RateLimitError) {
        if (attempt === maxRetries - 1) throw err;
        const wait = Math.pow(2, attempt) * 1000;
        await new Promise(r => setTimeout(r, wait));
        continue;
      }
      if (err instanceof Anthropic.APIError && err.status >= 500) {
        if (attempt === maxRetries - 1) throw err;
        await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 1000));
        continue;
      }
      throw err; // don't retry 4xx
    }
  }
}
\`\`\`

## Cost controls

Without controls, a single runaway request or an attacker hammering your endpoint can generate a large unexpected bill.

Controls to put in place before launch:

**1. Set \`max_tokens\` tightly.** Default to the smallest value that covers your actual outputs. If your app generates summaries under 300 words, use \`max_tokens=512\`, not \`max_tokens=4096\`.

**2. Rate-limit your own users.** Implement per-user request throttling before Claude calls. Use Redis or an in-memory counter:

\`\`\`python
import redis
import time

r = redis.Redis()

def check_rate_limit(user_id: str, limit: int = 20, window_seconds: int = 60) -> bool:
    key = f"ratelimit:{user_id}"
    pipe = r.pipeline()
    pipe.incr(key)
    pipe.expire(key, window_seconds)
    count, _ = pipe.execute()
    return count <= limit
\`\`\`

**3. Set Anthropic spend limits.** In the Anthropic console, set a monthly spend limit. This is a hard stop — requests fail once you hit it, but you won't get a surprise bill.

**4. Log token usage per request.** Capture \`response.usage.input_tokens\` and \`response.usage.output_tokens\` and store them. You need this data to understand costs by user, by route, and over time.

## Observability: what to log

Log enough to debug problems without logging sensitive user data:

\`\`\`python
import logging
import time

logger = logging.getLogger(__name__)

def logged_claude_call(user_id: str, route: str, **kwargs):
    start = time.time()
    try:
        response = client.messages.create(**kwargs)
        duration_ms = int((time.time() - start) * 1000)
        logger.info({
            "event": "claude_call_success",
            "user_id": user_id,
            "route": route,
            "model": kwargs.get("model"),
            "input_tokens": response.usage.input_tokens,
            "output_tokens": response.usage.output_tokens,
            "duration_ms": duration_ms,
        })
        return response
    except Exception as e:
        logger.error({
            "event": "claude_call_error",
            "user_id": user_id,
            "route": route,
            "error_type": type(e).__name__,
            "error_message": str(e),
        })
        raise
\`\`\`

Do not log user message content unless you have a clear business reason and appropriate user consent. Log metadata instead.

## The pre-launch checklist

Before your first real users:

- [ ] API key in environment variable, not code
- [ ] API key never committed to git (check your history)
- [ ] Retry logic with exponential backoff in place
- [ ] Per-user rate limiting implemented
- [ ] \`max_tokens\` set to realistic values
- [ ] Spend limit set in Anthropic console
- [ ] Token usage logged per request
- [ ] Error responses to users are friendly, not raw API errors
- [ ] Tested what happens when the API is down (graceful degradation)
- [ ] Tested with your actual production environment variables

The Claude API is reliable, but building on any external API means planning for the moments it is not.`,
  },

  // ── 2. Production error handling patterns for Claude apps ─────────────────
  {
    termSlug: 'hallucination',
    slug: 'claude-production-error-handling',
    angle: 'process',
    title: 'Production error handling for Claude applications',
    excerpt: 'The errors you will definitely hit, the ones that will surprise you, and the patterns that make your app resilient when Claude or the API behaves unexpectedly.',
    readTime: 6,
    cluster: 'Infrastructure & Deployment',
    body: `Production Claude applications fail in predictable ways. The API goes down. You get rate limited. Claude generates output in an unexpected format. Users send inputs that break your prompts. Here is how to handle each category cleanly.

## API error taxonomy

The Anthropic Python SDK raises specific exception types. Know them:

\`\`\`python
import anthropic

try:
    response = client.messages.create(...)
except anthropic.AuthenticationError:
    # Invalid API key. Fix immediately — this is a config error.
    pass
except anthropic.PermissionDeniedError:
    # Key doesn't have access to this model or feature.
    pass
except anthropic.NotFoundError:
    # Model doesn't exist or was deprecated.
    pass
except anthropic.RateLimitError:
    # Too many requests or too many tokens. Retry with backoff.
    pass
except anthropic.UnprocessableEntityError:
    # Request was malformed — message structure invalid.
    pass
except anthropic.APIStatusError as e:
    if e.status_code >= 500:
        # Server-side error. Retry.
        pass
    else:
        # Other 4xx — don't retry.
        pass
except anthropic.APIConnectionError:
    # Network issue. Retry.
    pass
except anthropic.APITimeoutError:
    # Request timed out. Retry.
    pass
\`\`\`

In TypeScript:

\`\`\`typescript
import Anthropic from '@anthropic-ai/sdk';

try {
  const response = await client.messages.create(params);
} catch (err) {
  if (err instanceof Anthropic.AuthenticationError) { /* config error */ }
  else if (err instanceof Anthropic.RateLimitError)  { /* retry */      }
  else if (err instanceof Anthropic.APIError) {
    console.error(err.status, err.message);
  }
}
\`\`\`

## Output format errors

If you ask Claude to return JSON and it returns something else, your \`JSON.parse()\` call fails. This is common when:
- The system prompt is ambiguous about format
- The input is long enough to push format instructions out of context
- Claude includes explanation text around the JSON

The robust pattern:

\`\`\`python
import json
import re

def parse_json_response(text: str) -> dict:
    """Extract JSON from Claude's response, even if surrounded by text."""
    # Try direct parse first
    try:
        return json.loads(text.strip())
    except json.JSONDecodeError:
        pass

    # Try extracting from markdown code block
    match = re.search(r'\`\`\`(?:json)?\s*([\s\S]*?)\`\`\`', text)
    if match:
        try:
            return json.loads(match.group(1).strip())
        except json.JSONDecodeError:
            pass

    # Try finding first { ... } block
    match = re.search(r'\{[\s\S]*\}', text)
    if match:
        try:
            return json.loads(match.group(0))
        except json.JSONDecodeError:
            pass

    raise ValueError(f"Could not parse JSON from response: {text[:200]}")
\`\`\`

Better long-term: use structured output properly with a schema in your system prompt, and validate with Pydantic:

\`\`\`python
from pydantic import BaseModel, ValidationError

class SummaryOutput(BaseModel):
    title: str
    key_points: list[str]
    sentiment: str

def get_summary(text: str) -> SummaryOutput:
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=512,
        system="Return a JSON object with keys: title (string), key_points (list of strings), sentiment (positive/negative/neutral). No other text.",
        messages=[{"role": "user", "content": text}]
    )
    raw = response.content[0].text
    data = parse_json_response(raw)
    try:
        return SummaryOutput(**data)
    except ValidationError as e:
        raise ValueError(f"Claude returned unexpected schema: {e}")
\`\`\`

## [Hallucination](/glossary/hallucination) detection

For applications where accuracy matters, do not trust Claude blindly. Implement a verification step:

\`\`\`python
def verify_claim(claim: str, source_text: str) -> bool:
    """Ask a second Claude call to verify a claim against source text."""
    verification = client.messages.create(
        model="claude-haiku-4-5-20251001",  # cheap for verification
        max_tokens=16,
        messages=[{
            "role": "user",
            "content": f"Does this source text support this claim? Answer only YES or NO.\n\nSource: {source_text}\n\nClaim: {claim}"
        }]
    )
    return verification.content[0].text.strip().upper().startswith("YES")
\`\`\`

Use this for:
- Factual claims extracted from documents (RAG applications)
- Data pulled from tools (is this what the API actually returned?)
- Customer-facing content where errors are costly

## Handling toxic or out-of-scope user input

Claude refuses some requests automatically. Your app should handle refusals gracefully:

\`\`\`python
def is_refusal(response_text: str) -> bool:
    """Heuristic check for Claude refusals."""
    refusal_signals = [
        "i cannot", "i can't", "i'm unable", "i won't", "i will not",
        "as an ai", "i don't have the ability"
    ]
    lower = response_text.lower()
    return any(signal in lower for signal in refusal_signals)

def safe_call(user_message: str) -> str:
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        messages=[{"role": "user", "content": user_message}]
    )
    text = response.content[0].text
    if is_refusal(text):
        return "I can't help with that in this context. Try rephrasing, or contact support."
    return text
\`\`\`

## Context window overflow

If your input exceeds the context window, you get an error. Guard against it:

\`\`\`python
def estimate_tokens(text: str) -> int:
    """Rough estimate: 4 characters ≈ 1 token."""
    return len(text) // 4

MAX_INPUT_TOKENS = 180_000  # leave room for output

def safe_messages(messages: list[dict], system: str = "") -> list[dict]:
    """Trim message history if approaching context limit."""
    system_tokens = estimate_tokens(system)
    budget = MAX_INPUT_TOKENS - system_tokens - 1000  # safety margin

    result = []
    total = 0
    for msg in reversed(messages):
        content = msg.get("content", "")
        tokens = estimate_tokens(str(content))
        if total + tokens > budget:
            break
        result.insert(0, msg)
        total += tokens

    return result
\`\`\`

## User-facing error messages

Never surface raw API errors to users. Map them to friendly messages:

\`\`\`python
def user_friendly_error(error: Exception) -> str:
    if isinstance(error, anthropic.RateLimitError):
        return "We're getting a lot of requests right now. Please try again in a moment."
    if isinstance(error, anthropic.APIConnectionError):
        return "Connection issue. Please check your internet and try again."
    if isinstance(error, anthropic.APITimeoutError):
        return "This is taking longer than expected. Please try again."
    if isinstance(error, anthropic.APIStatusError) and error.status_code >= 500:
        return "Something went wrong on our end. We've been notified and are looking into it."
    return "Something went wrong. Please try again."
\`\`\`

Robustness is not exciting to build. It is what separates a demo from a product.`,
  },

  // ── 3. Building a full chatbot with Next.js and Claude ────────────────────
  {
    termSlug: 'streaming',
    slug: 'nextjs-chatbot-claude-full-tutorial',
    angle: 'process',
    title: 'Building a streaming chatbot with Next.js and Claude',
    excerpt: 'End to end: API route, streaming SSE to the browser, React state, conversation history, and deployment. The complete working pattern.',
    readTime: 10,
    cluster: 'Infrastructure & Deployment',
    body: `This is the complete pattern for a [streaming](/glossary/streaming) Claude chatbot in Next.js. Not a simplified demo — the actual architecture you would use in production.

Stack: Next.js 14+ (App Router), TypeScript, Claude API. No UI library dependencies.

## Project structure

\`\`\`
src/
  app/
    api/
      chat/
        route.ts          # Claude API call + SSE streaming
    page.tsx              # Chat UI (client component)
  types.ts                # Message type definitions
\`\`\`

## Types

\`\`\`typescript
// src/types.ts
export type Message = {
  role: 'user' | 'assistant'
  content: string
}
\`\`\`

## The API route

\`\`\`typescript
// src/app/api/chat/route.ts
import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(req: NextRequest) {
  const { messages, systemPrompt } = await req.json()

  // Basic input validation
  if (!messages || !Array.isArray(messages)) {
    return new Response('Invalid request', { status: 400 })
  }

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const anthropicStream = await client.messages.stream({
          model: 'claude-sonnet-4-6',
          max_tokens: 1024,
          system: systemPrompt ?? 'You are a helpful assistant.',
          messages: messages.slice(-20), // Keep last 20 turns max
        })

        for await (const chunk of anthropicStream) {
          if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
            const data = JSON.stringify({ text: chunk.delta.text })
            controller.enqueue(encoder.encode(\`data: \${data}\n\n\`))
          }
        }

        // Signal completion
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      } catch (error) {
        const errMsg = error instanceof Error ? error.message : 'Unknown error'
        controller.enqueue(encoder.encode(\`data: \${JSON.stringify({ error: errMsg })}\n\n\`))
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
\`\`\`

## The chat UI

\`\`\`typescript
// src/app/page.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import type { Message } from '@/types'

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom as new tokens arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage() {
    if (!input.trim() || isStreaming) return

    const userMessage: Message = { role: 'user', content: input }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setIsStreaming(true)

    // Add empty assistant message that we'll fill in as tokens arrive
    setMessages(prev => [...prev, { role: 'assistant', content: '' }])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      })

      if (!response.ok) throw new Error('API request failed')
      if (!response.body) throw new Error('No response body')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6)
          if (data === '[DONE]') break

          try {
            const parsed = JSON.parse(data)
            if (parsed.error) throw new Error(parsed.error)
            if (parsed.text) {
              setMessages(prev => {
                const updated = [...prev]
                updated[updated.length - 1] = {
                  role: 'assistant',
                  content: updated[updated.length - 1].content + parsed.text,
                }
                return updated
              })
            }
          } catch {
            // Skip malformed chunks
          }
        }
      }
    } catch (error) {
      console.error('Streaming error:', error)
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          role: 'assistant',
          content: 'Something went wrong. Please try again.',
        }
        return updated
      })
    } finally {
      setIsStreaming(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', maxWidth: '720px', margin: '0 auto', padding: '0 16px' }}>
      {/* Message list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 0' }}>
        {messages.length === 0 && (
          <p style={{ color: '#888', textAlign: 'center', marginTop: '40px' }}>Start a conversation.</p>
        )}
        {messages.map((msg, i) => (
          <div key={i} style={{
            marginBottom: '16px',
            textAlign: msg.role === 'user' ? 'right' : 'left',
          }}>
            <div style={{
              display: 'inline-block',
              maxWidth: '80%',
              padding: '12px 16px',
              borderRadius: '12px',
              background: msg.role === 'user' ? '#D4845A' : '#f0f0f0',
              color: msg.role === 'user' ? '#fff' : '#1a1a1a',
              fontSize: '15px',
              lineHeight: 1.55,
              whiteSpace: 'pre-wrap',
            }}>
              {msg.content}
              {isStreaming && i === messages.length - 1 && msg.role === 'assistant' && (
                <span style={{ opacity: 0.4 }}>▋</span>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '16px 0', borderTop: '1px solid #e5e5e5', display: 'flex', gap: '8px' }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              sendMessage()
            }
          }}
          placeholder="Type a message... (Enter to send, Shift+Enter for newline)"
          disabled={isStreaming}
          rows={1}
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: '8px',
            border: '1px solid #d5d5d5',
            fontSize: '15px',
            resize: 'none',
            outline: 'none',
            fontFamily: 'inherit',
          }}
        />
        <button
          onClick={sendMessage}
          disabled={isStreaming || !input.trim()}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            background: '#D4845A',
            color: '#fff',
            border: 'none',
            fontSize: '15px',
            cursor: isStreaming ? 'not-allowed' : 'pointer',
            opacity: isStreaming || !input.trim() ? 0.6 : 1,
          }}
        >
          {isStreaming ? '...' : 'Send'}
        </button>
      </div>
    </div>
  )
}
\`\`\`

## Deploying to Vercel

\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy (it will ask you to log in on first run)
vercel

# Set your API key in production
vercel env add ANTHROPIC_API_KEY production
\`\`\`

Or via the Vercel dashboard: Project Settings → Environment Variables → add \`ANTHROPIC_API_KEY\`.

After setting the env var, redeploy: \`vercel --prod\`.

## What this gives you

This pattern handles:
- Real-time streaming — tokens appear as they are generated
- Conversation history — full multi-turn context up to 20 turns
- Error recovery — streaming errors surface a friendly message, not a crash
- Auto-scroll — follows the response as it generates
- Keyboard shortcut — Enter to send, Shift+Enter for newlines
- Loading state — button disabled and input shows \`...\` during streaming

What it does not handle (next steps):
- Persistence — conversations reset on page reload. Add a database for history.
- Auth — all users share the same session. Add authentication before exposing to the public.
- Rate limiting — all requests go to Claude with no user throttling. Add per-user rate limits before launch.
- Markdown rendering — assistant responses render as plain text. Add a markdown renderer for code blocks and formatting.

The architecture scales. Add persistence by saving messages to a database after each response. Add auth by checking session tokens in the API route. Add [prompt caching](/articles/prompt-caching-implementation) by marking your system prompt with \`cache_control\`.`,
  },

  // ── 4. How to think about AI for your first product ───────────────────────
  {
    termSlug: 'ai-use-case-discovery',
    slug: 'what-to-build-with-claude',
    angle: 'process',
    title: 'What to actually build with Claude as a first product',
    excerpt: 'Not every idea that works with AI makes a good business. How to filter the options, spot the structural advantages, and choose the problem worth building for.',
    readTime: 6,
    cluster: 'Business Strategy & ROI',
    body: `Most first AI products fail for the same reason: the founder built something Claude is good at, not something customers urgently need. The capability is not the business. The problem is the business.

Here is a framework for thinking about what to build — and a filter for ideas that sound good but are not.

## The four quadrants

Draw a 2x2. X-axis: how painful is the problem (low pain → high pain). Y-axis: how well does Claude solve it (poorly → well).

You want the top-right: high pain, Claude solves it well. Everything else is a trap.

**Top-left (high pain, Claude solves poorly):** You spend all your time on prompt engineering and the output still is not good enough. Customer acquisition is hard because the product does not work reliably. Stay away until the models improve.

**Bottom-right (low pain, Claude solves well):** Claude is impressive but users do not actually need this. No urgency, no retention, no willingness to pay. The demo is more compelling than the product.

**Bottom-left (low pain, Claude solves poorly):** Do not build this.

**Top-right (high pain, Claude solves well):** This is your target. Someone is doing this manually right now and it is costing them time, money, or quality they cannot afford to lose.

## What Claude is actually good at

Be specific. "Claude can write" is not useful. "Claude can draft first-call summaries from transcript + CRM data faster than an SDR" is useful.

Claude is genuinely good at:
- Synthesizing unstructured text (transcripts, emails, documents, notes)
- Drafting high-variability content (responses, reports, personalized outreach)
- Classification and routing at volume
- Extracting structured data from unstructured input
- Answering questions about a specific knowledge base
- First-pass research and summarization

Claude is unreliable at:
- Anything requiring precise numeric calculation
- Real-time data (Claude has a knowledge cutoff)
- Tasks requiring perfect recall of specific facts
- Anything where being 95% right is worse than being 0% right (medical diagnosis, legal advice, financial calculation)

## The "10x better or 10x cheaper" test

Your product needs to be either dramatically better than the current solution or dramatically cheaper. Usually not both.

For AI products, "10x cheaper" is often achievable: if a task costs $50 in human labor and you can do it for $0.50 in API costs, you have a structural advantage. "10x better" is harder — the question is whether better output actually changes the customer's outcome, or whether "good enough" was always fine.

Ask: what does the customer do differently because the output is better? If the answer is "not much, they just appreciate the quality," the quality advantage does not convert to willingness to pay.

## Structural advantages worth looking for

**Vertical specificity:** A generic AI tool competes with Claude.ai directly. A tool that knows the specific vocabulary, templates, workflows, and context of one industry (property management, clinical trial coordination, franchise operations) is defensible. The moat is domain data and workflow integration, not the underlying model.

**Workflow integration:** Products that embed in where the work already happens (Gmail, Slack, Notion, Salesforce) have lower activation energy than products that require a behavior change. If you have to convince someone to open a new tab, you are fighting the status quo. If Claude appears where they already are, adoption is a technical problem, not a sales problem.

**Volume and repetition:** The ROI of AI compounds with volume. A task done 10 times per year does not justify a subscription. A task done 200 times per month, at 5 minutes each, at $50/hour labor cost — that is $8,000/month in labor. A $200/month product paying for itself 40x over is an easy sell.

**Proprietary context:** Products that get better with customer data (their tone, their terminology, their historical patterns) become stickier over time. A generic summary tool is replaceable. A tool trained on three years of a company's support tickets and outcomes is not.

## The test before you build

Before writing any code:
1. Find three people who have this problem badly enough to talk to you about it for 45 minutes
2. Ask them to show you how they currently solve it — watch, do not describe
3. Identify the specific moment where the current solution fails them
4. Describe your solution in one sentence and ask if they would pay for it

If you cannot find three people willing to have the conversation, the pain is not real enough. If you find them but they would not pay, the pain is real but the solution does not fit. If you find them, they talk, and they ask how to sign up — you have something.

The AI part is not the hard part. Finding the right problem is.`,
  },

]

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`Seeding ${ARTICLES.length} articles (batch 22 — deploy, error handling, chatbot tutorial, what to build)…\n`)

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
