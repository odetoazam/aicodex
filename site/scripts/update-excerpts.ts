/**
 * update-excerpts.ts
 *
 * Updates excerpts for top pinned articles to lead with the claim, not the description.
 * Elena's rule: the excerpt is the ad for the article. It needs an argument, not a summary.
 *
 * Run: tsx --env-file=.env.local site/scripts/update-excerpts.ts
 */

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const EXCERPT_UPDATES: { slug: string; excerpt: string }[] = [

  // ── Pinned All ─────────────────────────────────────────────────────────────

  {
    slug: 'claude-operator-habits',
    excerpt: "The gap between people who get consistent value from Claude and people who don't isn't intelligence or skill — it's four habits most people never develop. Here's what effective Claude users actually do differently.",
  },
  {
    slug: 'running-your-first-ai-pilot',
    excerpt: "Most AI pilots succeed technically and fail politically. The evidence exists — it just wasn't collected in a way anyone can act on. Here's how to design a pilot that produces results your organization will actually use.",
  },
  {
    slug: 'how-to-write-a-good-prompt',
    excerpt: "Most prompt problems aren't caused by bad AI — they're caused by the same three things: no role, no context, no constraint. Here's how to fix all three in under two minutes.",
  },
  {
    slug: 'claude-common-mistakes',
    excerpt: "The mistakes that cause 80% of Claude frustration are predictable, and most of them happen in the first sentence of your message. Here's the full list, in order of how much they cost you.",
  },
  {
    slug: 'your-first-claude-api-call',
    excerpt: "The official quickstart gets you to 'Hello, world.' This gets you to understanding why Claude gave you a worse answer than the web app — and exactly how to fix it.",
  },
  {
    slug: 'claude-code-vs-web-app',
    excerpt: "They are different tools for different jobs. The web app is for thinking, writing, and analysis. Claude Code is for working inside your codebase. Here is the decision guide — including when neither is the right answer.",
  },

  // ── Pinned Operator ───────────────────────────────────────────────────────

  {
    slug: 'why-claude-feels-inconsistent',
    excerpt: "Claude isn't being random — inconsistency almost always has a specific cause you can find and fix. Here are the five most common ones, in order of how often they appear.",
  },
  {
    slug: 'first-week-with-claude',
    excerpt: "Most people's first week with Claude follows the same pattern: one good result, one confusing result, and a vague sense it's not as useful as advertised. Here's how to break that pattern in the first three days.",
  },
  {
    slug: 'measuring-ai-roi',
    excerpt: "The problem with AI ROI isn't that it's hard to measure — it's that teams measure the wrong things. Here's what to track instead, and how to present it in a way leadership will actually act on.",
  },
  {
    slug: 'how-to-convince-skeptical-teammate',
    excerpt: "Skeptical colleagues aren't anti-AI — they've usually had a bad experience, heard about one, or watched a tool get mandated without explanation. Here's how to address all three without being annoying about it.",
  },
  {
    slug: 'cs-manager-ai-workflow',
    excerpt: "A CS manager who uses Claude well can do meaningful work on renewals, QBRs, and escalations in the gaps between other work. Here's what that workflow actually looks like across a full day.",
  },

  // ── Pinned Founder ────────────────────────────────────────────────────────

  {
    slug: 'solo-founder-operating-system',
    excerpt: "A solo founder using Claude ineffectively has all the tools and none of the leverage. The founders who move fast have a system, not just a habit of asking questions. Here's the system.",
  },
  {
    slug: 'validating-startup-idea-with-claude',
    excerpt: "Claude can't tell you if your idea is good. It can help you figure out whether your assumptions are wrong — before you spend three months building something nobody wants. Here's how to use it for that.",
  },
  {
    slug: 'founder-ai-workflow',
    excerpt: "The founders who use AI well don't use it for everything — they use it for the three tasks that used to eat half their week. Here's what those tasks are and exactly how the workflow runs.",
  },
  {
    slug: 'solo-founder-project-setup',
    excerpt: "The way you configure Claude Code at the start of a project determines how useful it is six months in. Here's how to set it up so it stays useful — not just for you, but for anyone who touches the repo later.",
  },

  // ── Pinned Developer ──────────────────────────────────────────────────────

  {
    slug: 'building-a-rag-pipeline-from-scratch',
    excerpt: "Building RAG is easy. Building RAG that doesn't silently degrade over time is hard. Here's the production-ready version — including the retrieval failures most tutorials don't mention.",
  },
  {
    slug: 'prompt-caching-implementation',
    excerpt: "Prompt caching can cut your Claude API costs by 80% on the requests that matter most. Here's exactly how to implement it, why most teams cache the wrong things first, and what to fix.",
  },
  {
    slug: 'securing-your-claude-app',
    excerpt: "The security vulnerabilities in most Claude apps aren't exotic — they're the same three mistakes: leaking system prompts, ignoring prompt injection, and trusting user input in tool calls. Here's how to fix all three.",
  },

  // ── Pinned Agencies ───────────────────────────────────────────────────────

  {
    slug: 'pricing-claude-consulting-work',
    excerpt: "You are delivering faster and charging the same. That is a positioning problem, not a delivery problem. Here's how to reprice your AI consulting work before your clients notice you've gotten better.",
  },
  {
    slug: 'claude-for-agencies',
    excerpt: "The agencies making the most from AI aren't charging for AI expertise — they're delivering better work faster and pricing the outcome, not the time. Here's how to make that shift without losing current clients.",
  },
  {
    slug: 'what-to-tell-clients-about-ai',
    excerpt: "The wrong AI conversation with a client creates a problem you'll spend months managing. The right one positions you as the person who gets it before everyone else does. Here's the script for both scenarios.",
  },
  {
    slug: 'client-handoff-with-claude',
    excerpt: "The most common reason AI-assisted work falls apart after delivery: the client can't maintain what you built. Here's how to hand off Claude-powered workflows so they actually stick.",
  },

]

async function run() {
  let updated = 0
  let failed = 0

  for (const { slug, excerpt } of EXCERPT_UPDATES) {
    const { error } = await supabase
      .from('articles')
      .update({ excerpt })
      .eq('slug', slug)

    if (error) {
      console.error(`✗ ${slug}: ${error.message}`)
      failed++
    } else {
      console.log(`✓ ${slug}`)
      updated++
    }
  }

  console.log(`\nDone: ${updated} updated, ${failed} failed`)
}

run()
