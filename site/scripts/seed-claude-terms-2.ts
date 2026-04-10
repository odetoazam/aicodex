/**
 * Seed Claude terms batch 2 — new features: Cowork, Managed Agents, Dispatch, Memory, etc.
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-claude-terms-2.ts
 */

import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const TERMS = [
  {
    slug: 'managed-agents',
    name: 'Managed Agents',
    aliases: ['Claude Managed Agents', 'cloud agents'],
    cluster: 'Agents & Orchestration',
    scope: 'technical',
    lifecycle_stage: 'adoption',
    audience: ['operator', 'developer'],
    tier: 2,
    angles: ['def', 'process', 'role'],
    related_terms: ['ai-agent', 'claude-agent-sdk', 'tool-use', 'mcp'],
    claude_specific: true,
    definition: 'Managed Agents are cloud-hosted AI agents that Anthropic runs for you. Instead of building and hosting your own agent infrastructure, you define what the agent should do and Anthropic handles execution — secure sandboxing, long-running sessions, tool access, and scaling. Think of it as Claude-as-a-worker: you assign a task, it runs in the cloud, and you get the result. Currently in public beta at $0.08/session-hour plus token costs.',
    published: true,
  },
  {
    slug: 'claude-cowork',
    name: 'Cowork',
    aliases: ['Claude Cowork'],
    cluster: 'Tools & Ecosystem',
    scope: 'technical',
    lifecycle_stage: 'adoption',
    audience: ['operator', 'user'],
    tier: 2,
    angles: ['def', 'process', 'role'],
    related_terms: ['dispatch', 'computer-use', 'skill', 'claude-projects'],
    claude_specific: true,
    definition: 'Cowork is Claude working directly on your computer — controlling your mouse, keyboard, browser, and applications to complete tasks alongside you. It can navigate websites, fill in forms, move files, use desktop apps, and work through multi-step workflows on your actual screen. Available on macOS and Windows for all paid Claude plans. It turns Claude from something you chat with into something that does the work with you.',
    published: true,
  },
  {
    slug: 'dispatch',
    name: 'Dispatch',
    aliases: ['Claude Dispatch'],
    cluster: 'Tools & Ecosystem',
    scope: 'technical',
    lifecycle_stage: 'adoption',
    audience: ['operator', 'user'],
    tier: 2,
    angles: ['def', 'process', 'role'],
    related_terms: ['claude-cowork', 'computer-use', 'ai-agent'],
    claude_specific: true,
    definition: 'Dispatch lets you assign tasks to Claude from your phone or the web, and Claude picks them up on your desktop to execute. You write what you need done — "prepare the weekly report", "research these three companies" — and Claude works through it on your computer while you do something else. The task and its progress persist across devices. It is the async version of Cowork: instead of working alongside you in real time, Claude works independently and reports back.',
    published: true,
  },
  {
    slug: 'claude-memory',
    name: 'Memory',
    aliases: ['Claude Memory', 'persistent memory'],
    cluster: 'Foundation Models & LLMs',
    scope: 'conceptual',
    lifecycle_stage: 'adoption',
    audience: ['all'],
    tier: 1,
    angles: ['def', 'process', 'role'],
    related_terms: ['context-window', 'claude-projects', 'system-prompt'],
    claude_specific: true,
    definition: 'Memory is Claude remembering things about you across conversations. Your preferences, your role, your projects, decisions you have made — Claude retains this context and applies it automatically in future chats. You don\'t need to re-explain who you are or what you\'re working on every time. Available on all Claude tiers including Free. You can view and manage what Claude remembers in your settings.',
    published: true,
  },
  {
    slug: 'deep-research',
    name: 'Deep Research',
    aliases: ['Claude Deep Research'],
    cluster: 'Tools & Ecosystem',
    scope: 'technical',
    lifecycle_stage: 'adoption',
    audience: ['operator', 'user'],
    tier: 2,
    angles: ['def', 'process', 'role'],
    related_terms: ['skill', 'rag', 'ai-agent', 'tool-use'],
    claude_specific: true,
    definition: 'Deep Research is Claude spending extended time crawling the web, reading multiple sources, and producing a comprehensive, cited research report on a topic. Unlike a quick web search that returns a few results, Deep Research follows leads across dozens of pages, cross-references sources, and synthesises everything into a structured document with citations. Use it when you need thorough research — competitive analysis, market landscape, technical evaluations — not just a quick answer.',
    published: true,
  },
  {
    slug: 'computer-use',
    name: 'Computer Use',
    aliases: ['Claude Computer Use', 'desktop control'],
    cluster: 'Agents & Orchestration',
    scope: 'technical',
    lifecycle_stage: 'adoption',
    audience: ['operator', 'developer'],
    tier: 2,
    angles: ['def', 'process', 'role'],
    related_terms: ['claude-cowork', 'dispatch', 'ai-agent', 'tool-use'],
    claude_specific: true,
    definition: 'Computer Use is the underlying capability that lets Claude see and interact with a computer screen — clicking buttons, typing text, navigating applications, reading what is displayed. It is the technology behind Cowork and Dispatch. For developers building with the API, Computer Use means you can give Claude a virtual desktop and have it operate software the same way a human would — useful for automating workflows in applications that don\'t have APIs.',
    published: true,
  },
  {
    slug: 'claude-plans',
    name: 'Claude Plans',
    aliases: ['Claude pricing', 'Claude Team', 'Claude Enterprise', 'Claude Pro', 'Claude Max'],
    cluster: 'Business Strategy & ROI',
    scope: 'conceptual',
    lifecycle_stage: 'adoption',
    audience: ['operator', 'all'],
    tier: 1,
    angles: ['def', 'role'],
    related_terms: ['claude-projects', 'claude-cowork', 'connector', 'skill'],
    claude_specific: true,
    definition: 'Claude is available across several pricing tiers: Free (basic access to Sonnet, limited usage), Pro ($20/month — higher limits, all models, Cowork, Dispatch), Max ($100/month — very high usage limits), Team Standard ($25/seat/month — admin tools, shared Projects, 5-seat minimum), Team Premium ($125/seat/month — includes Claude Code), and Enterprise (custom pricing — SSO/SCIM, HIPAA-ready, 500K context, full compliance controls). The right plan depends on how many people need access and what level of admin control you need.',
    published: true,
  },
  {
    slug: 'token',
    name: 'Token',
    aliases: ['tokens', 'token usage'],
    cluster: 'Foundation Models & LLMs',
    scope: 'conceptual',
    lifecycle_stage: 'adoption',
    audience: ['all'],
    tier: 1,
    angles: ['def', 'process', 'role'],
    related_terms: ['context-window', 'prompt-caching', 'claude-plans'],
    claude_specific: false,
    definition: 'A token is the basic unit Claude uses to read and write text — roughly three-quarters of a word. "Hello, how are you?" is about 6 tokens. Everything you send to Claude (your message, system prompt, uploaded documents) and everything Claude sends back counts as tokens. Tokens determine both your usage limits and your API costs. Understanding tokens helps you manage costs, stay within limits, and structure your prompts efficiently.',
    published: true,
  },
]

async function main() {
  console.log(`Seeding ${TERMS.length} Claude terms (batch 2)...`)

  for (const term of TERMS) {
    const { error } = await sb
      .from('terms')
      .upsert({
        ...term,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'slug' })

    if (error) {
      console.error(`  ✗ ${term.slug}:`, error.message)
    } else {
      console.log(`  ✓ ${term.slug}`)
    }
  }

  console.log('\nDone.')
}

main().catch(console.error)
