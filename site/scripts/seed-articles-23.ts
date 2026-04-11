/**
 * Batch 23 — Rate limiting, auth, conversation persistence, Claude vs custom model
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-23.ts
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

  // ── 1. Rate limiting patterns for multi-user Claude apps ─────────────────
  {
    termSlug: 'api',
    slug: 'rate-limiting-claude-api',
    angle: 'process',
    title: 'Rate limiting patterns for multi-user Claude apps',
    excerpt: 'When your app has more than one user, naive retry logic is not enough. Token budgeting, per-user quotas, request queuing, and graceful degradation — in code.',
    readTime: 8,
    cluster: 'Infrastructure & Deployment',
    body: `A single-user app hitting rate limits is annoying. A multi-user app hitting rate limits is a product failure. The difference is not just retry logic — it is designing your application to distribute usage correctly and degrade gracefully when limits are approached.

## Why this is different from single-user retry logic

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

Tighter budgets mean more headroom before TPM (tokens per minute) limits hit. For conversational apps, you rarely need 4096 tokens per response — 1024 is sufficient for most turns.

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
  private maxConcurrent = 3  // tune based on your rate tier

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

Rate limiting is unglamorous but it is what separates toys from products that survive their first week of real traffic.`,
  },

  // ── 2. Adding auth to your Claude app with NextAuth ──────────────────────
  {
    termSlug: 'api',
    slug: 'nextauth-claude-integration',
    angle: 'process',
    title: 'Adding authentication to your Claude app with NextAuth',
    excerpt: 'Protect your API routes, tie conversations to users, and track per-user costs. The full integration from NextAuth setup to authenticated Claude calls.',
    readTime: 9,
    cluster: 'Infrastructure & Deployment',
    body: `Without authentication, anyone who finds your Claude app can use your API key. Adding auth is not optional once you move past localhost — it protects your budget, enables per-user features, and is the foundation for conversation history, rate limiting, and billing.

This guide covers: NextAuth setup, protecting your API routes, passing user identity to Supabase, and tying Claude conversations to authenticated users.

## 1. Install and configure NextAuth

\`\`\`bash
npm install next-auth @auth/supabase-adapter
\`\`\`

Create \`app/api/auth/[...nextauth]/route.ts\`:

\`\`\`typescript
import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { SupabaseAdapter } from '@auth/supabase-adapter'

const handler = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
  callbacks: {
    session({ session, user }) {
      // Add user ID to session so we can use it in API routes
      session.user.id = user.id
      return session
    },
  },
})

export { handler as GET, handler as POST }
\`\`\`

Add to \`.env.local\`:

\`\`\`
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32
NEXTAUTH_URL=http://localhost:3000
\`\`\`

## 2. Extend the session type

NextAuth's default session type does not include \`id\`. Extend it:

\`\`\`typescript
// types/next-auth.d.ts
import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}
\`\`\`

## 3. Protect your Claude API route

\`\`\`typescript
// app/api/chat/route.ts
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Anthropic from '@anthropic-ai/sdk'

export async function POST(request: Request) {
  // Check authentication first
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { messages } = await request.json()
  const userId = session.user.id

  const anthropic = new Anthropic()

  try {
    const response = await anthropic.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 1024,
      messages,
    })

    return Response.json({
      content: response.content[0],
      usage: response.usage,
    })
  } catch (err) {
    console.error('Claude API error:', err)
    return Response.json({ error: 'Claude call failed' }, { status: 500 })
  }
}
\`\`\`

## 4. Middleware to protect entire route groups

Rather than checking auth in every route handler, use Next.js middleware:

\`\`\`typescript
// middleware.ts
import { withAuth } from 'next-auth/middleware'

export default withAuth({
  callbacks: {
    authorized({ token }) {
      return !!token
    },
  },
})

export const config = {
  matcher: [
    '/chat/:path*',
    '/api/chat/:path*',
    '/dashboard/:path*',
  ],
}
\`\`\`

This redirects unauthenticated users to the sign-in page automatically.

## 5. Accessing user ID in client components

\`\`\`typescript
// components/Chat.tsx
'use client'
import { useSession } from 'next-auth/react'

export default function Chat() {
  const { data: session, status } = useSession()

  if (status === 'loading') return <p>Loading...</p>
  if (!session) return <p>Please sign in</p>

  return (
    <div>
      <p>Welcome, {session.user.name}</p>
      {/* chat UI */}
    </div>
  )
}
\`\`\`

## 6. Wrap your app with the session provider

\`\`\`typescript
// app/layout.tsx
import { getServerSession } from 'next-auth'
import { SessionProvider } from '@/components/SessionProvider'
import { authOptions } from '@/lib/auth'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  return (
    <html>
      <body>
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
\`\`\`

\`\`\`typescript
// components/SessionProvider.tsx
'use client'
import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react'
import type { Session } from 'next-auth'

export function SessionProvider({ session, children }: { session: Session | null; children: React.ReactNode }) {
  return <NextAuthSessionProvider session={session}>{children}</NextAuthSessionProvider>
}
\`\`\`

## 7. Sign in / sign out UI

\`\`\`typescript
// components/AuthButton.tsx
'use client'
import { signIn, signOut, useSession } from 'next-auth/react'

export default function AuthButton() {
  const { data: session } = useSession()

  if (session) {
    return (
      <button onClick={() => signOut()}>
        Sign out ({session.user?.email})
      </button>
    )
  }

  return (
    <button onClick={() => signIn('google')}>
      Sign in with Google
    </button>
  )
}
\`\`\`

## What comes after auth

Once you have user IDs flowing, you can build:

- **Per-user conversation history** — store messages in Supabase with \`user_id\` foreign key
- **Per-user rate limiting** — track usage by \`user_id\` (see the rate limiting guide)
- **Cost attribution** — know exactly how many tokens each user is consuming
- **Billing** — gate features by plan, track usage against billing periods

Authentication is infrastructure. It feels like overhead until you need to refund a user's bill, debug a specific user's conversation, or block an abusive account. Do it early.`,
  },

  // ── 3. Database-backed conversation history with Supabase ─────────────────
  {
    termSlug: 'context-window',
    slug: 'supabase-conversation-history',
    angle: 'process',
    title: 'Database-backed conversation history with Supabase and Claude',
    excerpt: 'In-memory arrays disappear on page reload. How to persist conversation history to Supabase, load it back on session resume, and prune context intelligently.',
    readTime: 8,
    cluster: 'Infrastructure & Deployment',
    body: `Every Claude integration starts with an in-memory array of messages. This works for demos. It breaks the moment a user refreshes the page, closes a tab, or comes back the next day.

Proper conversation persistence means:
- Messages survive page reloads and deployments
- Users can resume where they left off
- You can inspect conversations for debugging
- You can build features like conversation search, sharing, or branching

Here is the complete implementation with Supabase.

## Schema design

Two tables: conversations (the session) and messages (the turns).

\`\`\`sql
-- Conversations table
create table conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Messages table
create table messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references conversations(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  tokens_used integer,
  created_at timestamptz default now()
);

-- Indexes for fast lookups
create index on conversations(user_id, updated_at desc);
create index on messages(conversation_id, created_at asc);

-- Row-level security
alter table conversations enable row level security;
alter table messages enable row level security;

create policy "Users see own conversations"
  on conversations for all using (auth.uid() = user_id);

create policy "Users see own messages"
  on messages for all
  using (
    exists (
      select 1 from conversations
      where conversations.id = messages.conversation_id
      and conversations.user_id = auth.uid()
    )
  );
\`\`\`

## Loading a conversation

\`\`\`typescript
// lib/conversations.ts
import { createClient } from '@/lib/supabase/server'

export type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

export async function getConversation(conversationId: string): Promise<Message[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('messages')
    .select('id, role, content, created_at')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('getConversation error:', error)
    return []
  }

  return data ?? []
}

export async function getUserConversations(userId: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from('conversations')
    .select('id, title, created_at, updated_at')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .limit(20)

  return data ?? []
}
\`\`\`

## Saving messages

\`\`\`typescript
export async function saveMessage(
  conversationId: string,
  role: 'user' | 'assistant',
  content: string,
  tokensUsed?: number
) {
  const supabase = await createClient()

  const [_, updateResult] = await Promise.all([
    supabase.from('messages').insert({
      conversation_id: conversationId,
      role,
      content,
      tokens_used: tokensUsed ?? null,
    }),
    supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId),
  ])

  return updateResult
}

export async function createConversation(userId: string, firstMessage: string) {
  const supabase = await createClient()

  // Auto-generate title from first message (truncated)
  const title = firstMessage.length > 60
    ? firstMessage.slice(0, 57) + '...'
    : firstMessage

  const { data } = await supabase
    .from('conversations')
    .insert({ user_id: userId, title })
    .select('id')
    .single()

  return data?.id ?? null
}
\`\`\`

## Wiring it into your API route

\`\`\`typescript
// app/api/chat/route.ts
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getConversation, saveMessage, createConversation } from '@/lib/conversations'
import Anthropic from '@anthropic-ai/sdk'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { userMessage, conversationId: existingId } = await request.json()
  const userId = session.user.id

  // Get or create conversation
  let conversationId = existingId
  if (!conversationId) {
    conversationId = await createConversation(userId, userMessage)
    if (!conversationId) {
      return Response.json({ error: 'Failed to create conversation' }, { status: 500 })
    }
  }

  // Load message history
  const history = await getConversation(conversationId)

  // Build messages array for Claude
  const messages = [
    ...history.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    { role: 'user' as const, content: userMessage },
  ]

  // Save user message before calling Claude
  await saveMessage(conversationId, 'user', userMessage)

  const anthropic = new Anthropic()
  const response = await anthropic.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 1024,
    messages,
  })

  const assistantContent = response.content[0].type === 'text'
    ? response.content[0].text
    : ''

  // Save assistant response with token count
  const totalTokens = response.usage.input_tokens + response.usage.output_tokens
  await saveMessage(conversationId, 'assistant', assistantContent, totalTokens)

  return Response.json({
    content: assistantContent,
    conversationId,
  })
}
\`\`\`

## Context window management

Claude has a finite context window. Long conversations eventually exceed it. Prune old messages when the conversation grows:

\`\`\`typescript
const MAX_MESSAGES_IN_CONTEXT = 20

function pruneHistory(history: Message[]): Message[] {
  if (history.length <= MAX_MESSAGES_IN_CONTEXT) return history

  // Always keep the first message (often sets important context)
  // Then keep the most recent N-1 messages
  const first = history[0]
  const recent = history.slice(-(MAX_MESSAGES_IN_CONTEXT - 1))
  return [first, ...recent]
}

// Use in route handler:
const prunedHistory = pruneHistory(history)
const messages = [
  ...prunedHistory.map(m => ({ role: m.role, content: m.content })),
  { role: 'user', content: userMessage },
]
\`\`\`

A more sophisticated approach counts tokens instead of message count. The \`usage\` field returned by Claude tells you how many tokens were used — track this to build a soft limit.

## Loading conversation in the UI

\`\`\`typescript
// app/chat/[conversationId]/page.tsx
import { getConversation } from '@/lib/conversations'

export default async function ChatPage({ params }: { params: { conversationId: string } }) {
  const messages = await getConversation(params.conversationId)

  return (
    <div>
      {messages.map(msg => (
        <div key={msg.id} className={\`message message--\${msg.role}\`}>
          {msg.content}
        </div>
      ))}
      {/* ChatInput component here */}
    </div>
  )
}
\`\`\`

The URL-based approach (\`/chat/[conversationId]\`) means users can bookmark, share, or return to any conversation. It is also debuggable — you can look up the conversation ID in Supabase directly.

## What not to do

- Do not store raw HTML in the content column — store markdown and render it on the client
- Do not lazy-load message history — load it server-side before rendering to avoid layout shift
- Do not skip the \`updated_at\` update — it is how you sort conversations by recency
- Do not trust the client to pass \`conversationId\` without verifying ownership — always check the conversation belongs to the authenticated user`,
  },

  // ── 4. Claude vs custom model ─────────────────────────────────────────────
  {
    termSlug: 'fine-tuning',
    slug: 'claude-vs-custom-model',
    angle: 'def',
    title: 'Should I use Claude or build my own model?',
    excerpt: 'The question most AI founders ask in month two. The honest answer covers fine-tuning economics, the cases where Claude is genuinely insufficient, and the trap of premature optimization.',
    readTime: 7,
    cluster: 'AI Strategy',
    body: `At some point in building an AI product, founders start wondering whether they should train their own model. The question usually arrives when Claude does something unexpected, when a competitor claims to have a "proprietary model," or when someone on Twitter posts about fine-tuning costs.

Here is the honest answer.

## In almost every case: use Claude

The burden of proof is on building your own model, not on using Claude. Before you start evaluating alternatives, ask: can you precisely describe what Claude cannot do that you need?

If the answer is "it occasionally says things I don't want it to say" — that is a system prompt and eval problem, not a model problem.

If the answer is "it doesn't know about our proprietary data" — that is a RAG problem, not a model problem.

If the answer is "it's not consistent enough" — that is a temperature and prompt engineering problem, not a model problem.

Most of the time, the model is not the constraint.

## When fine-tuning actually makes sense

Fine-tuning — taking an existing model and continuing training on your data — is appropriate when:

**1. You need a very specific output format consistently.**
If your product generates legal clauses, medical codes, or structured data in a format that Claude gets wrong 15% of the time even with detailed prompts, fine-tuning can reduce that to 1-2%. This is the clearest use case.

**2. You have high-volume inference with a simple, narrow task.**
Fine-tuning a smaller model (like GPT-3.5 or an open-source base) can cost less per call than Claude for simple extraction or classification tasks at millions of calls per day. This math rarely holds at early stage.

**3. You need on-premise deployment for regulatory reasons.**
Healthcare, certain financial contexts, and government customers sometimes require data never leaving their infrastructure. Claude is not available self-hosted.

**4. You are building a product where model differentiation is the product.**
Character.ai, Perplexity, and similar companies have genuine reasons to invest in model development. If your competitive advantage is literally the model — rare for B2B SaaS.

## The economics of fine-tuning

People dramatically underestimate the cost of training and maintaining a fine-tuned model:

- **Data preparation:** Collecting, cleaning, and labeling training data is usually the hardest and most expensive part. Expect 2-3 months and \$20k-\$100k+ for a serious dataset.
- **Training costs:** Running GPU training jobs. A small fine-tune on modern infrastructure might cost \$500-2000. A serious one costs tens of thousands.
- **Evaluation:** You need to know the fine-tuned model is better. That requires evals, which require labeled test data, which requires humans.
- **Maintenance:** Every time your task changes, you potentially need to retrain. Every time the base model improves, you need to decide whether to upgrade.
- **Serving:** You now operate your own model inference. That's GPU instances, scaling, latency monitoring, and incident response.

For an early-stage company, this is often a full-time engineering role. You are trading API costs for team costs.

## The true comparison

Most founders frame it as: "Claude costs \$X per month. Fine-tuning would cost less per call."

The real comparison is:

| | Claude API | Fine-tuned model |
|---|---|---|
| Time to first working version | Days | Months |
| Engineering cost | Low | High (ongoing) |
| Quality improvement effort | Prompt engineering | Data labeling + training |
| Upgrades | Automatic (Anthropic ships improvements) | Manual (retrain on new base) |
| Failure modes | Predictable | New ones you haven't seen |
| Per-call cost at scale | Higher | Lower |

The break-even on per-call costs only occurs at volume that most startups never reach.

## The "proprietary model" narrative

Some founders want a fine-tuned model because it sounds more defensible. "We have our own AI" sounds better than "we use Claude."

This is almost always wrong. What is defensible:

- **Your training data** (if you genuinely have unique data no one else can get)
- **Your evals** (your ability to measure quality better than competitors)
- **Your product** (the UI, the workflow, the customer relationship)

A fine-tuned model with mediocre training data is worse than a well-prompted frontier model. The model is not the moat. The data and the product are.

## A practical decision framework

Start here:

1. Can you describe exactly what Claude fails at, with examples?
2. Have you exhausted prompt engineering, few-shot examples, and structured output?
3. Have you built evals that measure the specific failure?
4. At your current scale, do API costs actually hurt your unit economics?
5. Do you have the engineering capacity to own a model pipeline?

If the answers are mostly no, you are not ready to evaluate fine-tuning. The faster path is better prompts, not a new model.

## What to do instead

The highest-leverage things most founders should do before considering model training:

- Build a proper eval suite (you cannot improve what you cannot measure)
- Add few-shot examples to your system prompt (often 5-10% quality improvement)
- Use Claude's extended thinking for complex reasoning tasks
- Improve your RAG pipeline if knowledge is the gap
- Add output validation and retry logic for structured outputs

These ship in days. Model fine-tuning ships in months — if you have the data.`,
  },

]

async function seed() {
  console.log('Seeding batch 23...\n')

  for (const art of ARTICLES) {
    const term = await getTermId(art.termSlug)
    if (!term) {
      console.error(`❌  Term not found: ${art.termSlug}`)
      continue
    }

    const payload = {
      term_id: term.id,
      slug: art.slug,
      angle: art.angle,
      title: art.title,
      excerpt: art.excerpt,
      read_time: art.readTime,
      cluster: art.cluster,
      body: art.body,
      published: true,
    }

    const { error } = await sb
      .from('articles')
      .upsert(payload, { onConflict: 'slug' })

    if (error) {
      console.error(`❌  ${art.slug}:`, error.message)
    } else {
      console.log(`✅  ${art.slug}`)
    }
  }

  console.log('\nDone.')
}

seed().catch(console.error)
