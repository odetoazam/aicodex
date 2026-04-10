/**
 * Interlinking pass 2 — add internal links to batch 8 + 9 articles,
 * and add links FROM existing articles to new content.
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/update-links-2.ts
 */

import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

/* ── inline link rules ─────────────────────────────────────────────── */

type LinkRule = { find: string; href: string; label: string }

// Map of article slug → inline links to add (first occurrence only)
const UPDATES: Record<string, LinkRule[]> = {

  // ── Batch 8 articles ────────────────────────────────────────────
  'ai-for-sales': [
    { find: 'follow-up email', href: '/articles/ai-for-customer-success', label: 'follow-up email' },
    { find: 'token', href: '/glossary/token', label: 'token' },
  ],
  'claude-admin-setup': [
    { find: 'Team plan', href: '/glossary/claude-plans', label: 'Team plan' },
    { find: 'token', href: '/glossary/token', label: 'token' },
    { find: 'evaluate', href: '/glossary/evals', label: 'evaluate' },
  ],
  'ai-for-operations': [
    { find: 'meeting', href: '/articles/ai-for-customer-success', label: 'meeting' },
    { find: 'token', href: '/glossary/token', label: 'token' },
  ],
  'sales-prospecting-with-claude': [
    { find: 'token', href: '/glossary/token', label: 'token' },
    { find: 'follow-up', href: '/articles/ai-for-sales', label: 'follow-up' },
    { find: 'Memory', href: '/glossary/claude-memory', label: 'Memory' },
  ],
  'ai-for-hr': [
    { find: 'token', href: '/glossary/token', label: 'token' },
    { find: 'Memory', href: '/glossary/claude-memory', label: 'Memory' },
  ],

  // ── Batch 9 articles ────────────────────────────────────────────
  'managed-agents-for-your-org': [
    { find: 'token', href: '/glossary/token', label: 'token' },
    { find: 'system prompt', href: '/glossary/system-prompt', label: 'system prompt' },
  ],
  'minimising-token-usage': [
    { find: 'Haiku', href: '/articles/choosing-the-right-claude-model', label: 'Haiku' },
    { find: 'Sonnet', href: '/articles/choosing-the-right-claude-model', label: 'Sonnet' },
    { find: 'Opus', href: '/articles/choosing-the-right-claude-model', label: 'Opus' },
    { find: 'Deep Research', href: '/glossary/deep-research', label: 'Deep Research' },
    { find: 'Memory', href: '/glossary/claude-memory', label: 'Memory' },
  ],
  'skills-setup-guide': [
    { find: 'token', href: '/glossary/token', label: 'token' },
    { find: 'Managed Agents', href: '/glossary/managed-agents', label: 'Managed Agents' },
    { find: 'Cowork', href: '/glossary/claude-cowork', label: 'Cowork' },
    { find: 'Memory', href: '/glossary/claude-memory', label: 'Memory' },
  ],
  'connectors-best-practices': [
    { find: 'Skills', href: '/glossary/skill', label: 'Skills' },
    { find: 'Memory', href: '/glossary/claude-memory', label: 'Memory' },
    { find: 'Managed Agents', href: '/glossary/managed-agents', label: 'Managed Agents' },
  ],
  'cowork-dispatch-guide': [
    { find: 'token', href: '/glossary/token', label: 'token' },
    { find: 'system prompt', href: '/glossary/system-prompt', label: 'system prompt' },
    { find: 'Memory', href: '/glossary/claude-memory', label: 'Memory' },
    { find: 'Managed Agents', href: '/glossary/managed-agents', label: 'Managed Agents' },
    { find: 'Skills', href: '/glossary/skill', label: 'Skills' },
  ],
  'choosing-the-right-claude-model': [
    { find: 'token', href: '/glossary/token', label: 'token' },
    { find: 'Deep Research', href: '/glossary/deep-research', label: 'Deep Research' },
    { find: 'Cowork', href: '/glossary/claude-cowork', label: 'Cowork' },
  ],
  'claude-memory-guide': [
    { find: 'token', href: '/glossary/token', label: 'token' },
    { find: 'system prompt', href: '/glossary/system-prompt', label: 'system prompt' },
  ],
  'deep-research-guide': [
    { find: 'token', href: '/glossary/token', label: 'token' },
    { find: 'Skills', href: '/glossary/skill', label: 'Skills' },
    { find: 'system prompt', href: '/glossary/system-prompt', label: 'system prompt' },
    { find: 'Managed Agents', href: '/glossary/managed-agents', label: 'Managed Agents' },
  ],

  // ── Cross-links FROM existing articles TO new content ────────────
  'ai-for-customer-success': [
    { find: 'token', href: '/glossary/token', label: 'token' },
    { find: 'Connectors', href: '/glossary/connector', label: 'Connectors' },
  ],
  'ai-for-marketing': [
    { find: 'token', href: '/glossary/token', label: 'token' },
    { find: 'Deep Research', href: '/glossary/deep-research', label: 'Deep Research' },
  ],
  'claude-for-customer-support': [
    { find: 'Memory', href: '/glossary/claude-memory', label: 'Memory' },
    { find: 'token', href: '/glossary/token', label: 'token' },
  ],
  'claude-operator-habits': [
    { find: 'token', href: '/glossary/token', label: 'token' },
    { find: 'Memory', href: '/glossary/claude-memory', label: 'Memory' },
    { find: 'Connectors', href: '/glossary/connector', label: 'Connectors' },
  ],
  'what-to-automate-first': [
    { find: 'Managed Agents', href: '/glossary/managed-agents', label: 'Managed Agents' },
    { find: 'Cowork', href: '/glossary/claude-cowork', label: 'Cowork' },
    { find: 'Dispatch', href: '/glossary/dispatch', label: 'Dispatch' },
  ],
}

/* ── further reading sections ──────────────────────────────────────── */

const FURTHER_READING: Record<string, { label: string; url: string }[]> = {
  'managed-agents-for-your-org': [
    { label: 'Managed Agents documentation — Anthropic Docs', url: 'https://docs.anthropic.com/en/docs/agents-and-tools/managed-agents' },
    { label: 'Agent SDK documentation — Anthropic Docs', url: 'https://docs.anthropic.com/en/docs/agents-and-tools/agent-sdk' },
  ],
  'cowork-dispatch-guide': [
    { label: 'Cowork overview — Anthropic Support', url: 'https://support.anthropic.com/en/articles/claude-cowork' },
    { label: 'Computer Use documentation — Anthropic Docs', url: 'https://docs.anthropic.com/en/docs/agents-and-tools/computer-use' },
  ],
  'skills-setup-guide': [
    { label: 'Skills in Claude — Anthropic Support', url: 'https://support.anthropic.com/en/articles/claude-skills' },
  ],
  'connectors-best-practices': [
    { label: 'Connectors overview — Anthropic Support', url: 'https://support.anthropic.com/en/collections/connectors' },
    { label: 'MCP connector docs — Anthropic Docs', url: 'https://docs.anthropic.com/en/docs/agents-and-tools/mcp-connector' },
  ],
  'claude-memory-guide': [
    { label: 'Memory in Claude — Anthropic Support', url: 'https://support.anthropic.com/en/articles/claude-memory' },
  ],
  'deep-research-guide': [
    { label: 'Deep Research — Anthropic Support', url: 'https://support.anthropic.com/en/articles/claude-deep-research' },
  ],
  'choosing-the-right-claude-model': [
    { label: 'Claude models overview — Anthropic Docs', url: 'https://docs.anthropic.com/en/docs/about-claude/models/overview' },
    { label: 'Claude pricing — Anthropic', url: 'https://claude.ai/pricing' },
  ],
  'minimising-token-usage': [
    { label: 'Prompt caching guide — Anthropic Docs', url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching' },
    { label: 'Prompt engineering overview — Anthropic Docs', url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview' },
  ],
  'claude-admin-setup': [
    { label: 'Claude for Teams — Anthropic', url: 'https://www.anthropic.com/claude/team' },
    { label: 'Projects overview — Anthropic Support', url: 'https://support.anthropic.com/en/articles/claude-projects' },
  ],
  'ai-for-sales': [
    { label: 'Claude for work — Anthropic', url: 'https://www.anthropic.com/claude/work' },
  ],
  'ai-for-operations': [
    { label: 'Claude for work — Anthropic', url: 'https://www.anthropic.com/claude/work' },
  ],
  'ai-for-hr': [
    { label: 'Claude for work — Anthropic', url: 'https://www.anthropic.com/claude/work' },
  ],
}

/* ── helpers ───────────────────────────────────────────────────────── */

function applyInlineLinks(body: string, rules: LinkRule[]): { body: string; count: number } {
  let count = 0
  let updated = body

  for (const rule of rules) {
    // Skip if this text is already linked anywhere in the body
    if (updated.includes(`[${rule.label}](`)) continue
    if (updated.includes(`(${rule.href})`)) continue

    // First occurrence only, not inside an existing markdown link
    const escaped = rule.find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const re = new RegExp(`(?<!\\[)\\b(${escaped})\\b(?![\\]\\(])`, '')
    if (re.test(updated)) {
      updated = updated.replace(re, `[${rule.label}](${rule.href})`)
      count++
    }
  }

  return { body: updated, count }
}

function appendFurtherReading(body: string, links: { label: string; url: string }[]): string {
  if (body.includes('## Further reading')) return body
  const section = '\n\n## Further reading\n\n' + links.map(l => `- [${l.label}](${l.url})`).join('\n')
  return body + section
}

/* ── main ──────────────────────────────────────────────────────────── */

async function main() {
  const slugs = [...new Set([...Object.keys(UPDATES), ...Object.keys(FURTHER_READING)])]
  console.log('Updating ' + slugs.length + ' articles...\n')

  let totalInline = 0
  let totalExternal = 0
  let updated = 0

  for (const slug of slugs) {
    const { data: article } = await sb
      .from('articles')
      .select('slug, body')
      .eq('slug', slug)
      .single()

    if (!article) {
      console.log('  ✗ ' + slug + ': not found')
      continue
    }

    let body = article.body ?? ''
    let inlineCount = 0

    // Apply inline links
    if (UPDATES[slug]) {
      const result = applyInlineLinks(body, UPDATES[slug])
      body = result.body
      inlineCount = result.count
      totalInline += inlineCount
    }

    // Append further reading
    let externalCount = 0
    if (FURTHER_READING[slug]) {
      const before = body
      body = appendFurtherReading(body, FURTHER_READING[slug])
      if (body !== before) {
        externalCount = FURTHER_READING[slug].length
        totalExternal += externalCount
      }
    }

    if (inlineCount === 0 && externalCount === 0) {
      console.log('  – ' + slug + ': no changes needed')
      continue
    }

    const { error } = await sb
      .from('articles')
      .update({ body })
      .eq('slug', slug)

    if (error) {
      console.log('  ✗ ' + slug + ': ' + error.message)
    } else {
      console.log('  ✓ ' + slug + ': +' + inlineCount + ' inline, +' + externalCount + ' external')
      updated++
    }
  }

  console.log('\nDone. Updated ' + updated + ' articles.')
  console.log('Total: +' + totalInline + ' inline links, +' + totalExternal + ' external links.')
}

main().catch(console.error)
