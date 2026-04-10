/**
 * Update all article bodies with internal + external links.
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/update-links.ts
 */

import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// ── Link insertion rules ──────────────────────────────────────────────
// For each article slug, define the links to inject.
// { find: text to match (first occurrence only), replace: markdown link }
type LinkRule = { find: RegExp; replace: string }

// Internal glossary links
const TERM_LINKS: Record<string, string> = {
  'RAG': '/glossary/rag',
  'context window': '/glossary/context-window',
  'context windows': '/glossary/context-window',
  'token': '/glossary/token',
  'tokens': '/glossary/token',
  'system prompt': '/glossary/system-prompt',
  'system prompts': '/glossary/system-prompt',
  'hallucination': '/glossary/hallucination',
  'hallucinations': '/glossary/hallucination',
  'hallucinate': '/glossary/hallucination',
  'hallucinating': '/glossary/hallucination',
  'evals': '/glossary/evals',
  'evaluation': '/glossary/evals',
  'tool use': '/glossary/tool-use',
  'function calling': '/glossary/tool-use',
  'fine-tuning': '/glossary/fine-tuning',
  'fine-tune': '/glossary/fine-tuning',
  'constitutional AI': '/glossary/constitutional-ai',
  'RLHF': '/glossary/rlhf',
  'alignment': '/glossary/alignment',
  'AI agent': '/glossary/ai-agent',
  'AI agents': '/glossary/ai-agent',
  'prompt caching': '/glossary/prompt-caching',
  'vector database': '/glossary/vector-database',
  'embeddings': '/glossary/embeddings',
  'temperature': '/glossary/temperature',
  'prompt engineering': '/glossary/prompt-engineering',
  'MCP': '/glossary/mcp',
  'Model Context Protocol': '/glossary/mcp',
  'Claude Projects': '/glossary/claude-projects',
  'Projects': '/glossary/claude-projects',
  'extended thinking': '/glossary/extended-thinking',
  'Skills': '/glossary/skill',
  'Connectors': '/glossary/connector',
  'Agent SDK': '/glossary/claude-agent-sdk',
  'Claude Code': '/glossary/claude-code',
}

// External Anthropic links
const EXTERNAL_LINKS: Record<string, string> = {
  'Anthropic docs': 'https://docs.anthropic.com',
  'Anthropic': 'https://www.anthropic.com',
  'Claude.ai': 'https://claude.ai',
}

// ── Per-article link additions ────────────────────────────────────────
// Each entry: slug -> array of { pattern, replacement }
// We manually define the best links for each article to avoid over-linking.

const UPDATES: Record<string, { find: string; replace: string }[]> = {

  // ─── Batch 1-3: definition articles (currently 0 links) ──────────

  'rag-def': [
    { find: 'context window', replace: '[context window](/glossary/context-window)' },
    { find: 'vector database', replace: '[vector database](/glossary/vector-database)' },
    { find: 'hallucinate', replace: '[hallucinate](/glossary/hallucination)' },
    { find: 'system prompt', replace: '[system prompt](/glossary/system-prompt)' },
  ],

  'ai-agent-def': [
    { find: 'tool use', replace: '[tool use](/glossary/tool-use)' },
    { find: 'system prompt', replace: '[system prompt](/glossary/system-prompt)' },
    { find: 'human-in-the-loop', replace: '[human-in-the-loop](/glossary/human-in-the-loop)' },
  ],

  'constitutional-ai-def': [
    { find: 'RLHF', replace: '[RLHF](/glossary/rlhf)' },
    { find: 'alignment', replace: '[alignment](/glossary/alignment)' },
    { find: 'AI safety', replace: '[AI safety](/glossary/ai-safety)' },
  ],

  'system-prompt-def': [
    { find: 'context window', replace: '[context window](/glossary/context-window)' },
    { find: 'temperature', replace: '[temperature](/glossary/temperature)' },
    { find: 'tool use', replace: '[tool use](/glossary/tool-use)' },
  ],

  'context-window-def': [
    { find: 'tokens', replace: '[tokens](/glossary/token)' },
    { find: 'RAG', replace: '[RAG](/glossary/rag)' },
    { find: 'system prompt', replace: '[system prompt](/glossary/system-prompt)' },
  ],

  'tool-use-def': [
    { find: 'system prompt', replace: '[system prompt](/glossary/system-prompt)' },
    { find: 'AI agent', replace: '[AI agent](/glossary/ai-agent)' },
    { find: 'MCP', replace: '[MCP](/glossary/mcp)' },
  ],

  'hallucination-def': [
    { find: 'RAG', replace: '[RAG](/glossary/rag)' },
    { find: 'constitutional AI', replace: '[constitutional AI](/glossary/constitutional-ai)' },
    { find: 'system prompt', replace: '[system prompt](/glossary/system-prompt)' },
    { find: 'evals', replace: '[evals](/glossary/evals)' },
  ],

  'evals-def': [
    { find: 'system prompt', replace: '[system prompt](/glossary/system-prompt)' },
    { find: 'hallucination', replace: '[hallucination](/glossary/hallucination)' },
    { find: 'temperature', replace: '[temperature](/glossary/temperature)' },
    { find: 'prompt engineering', replace: '[prompt engineering](/glossary/prompt-engineering)' },
  ],

  'large-language-model-def': [
    { find: 'context window', replace: '[context window](/glossary/context-window)' },
    { find: 'hallucination', replace: '[hallucination](/glossary/hallucination)' },
    { find: 'RLHF', replace: '[RLHF](/glossary/rlhf)' },
    { find: 'constitutional AI', replace: '[constitutional AI](/glossary/constitutional-ai)' },
    { find: 'tokens', replace: '[tokens](/glossary/token)' },
    { find: 'fine-tuning', replace: '[fine-tuning](/glossary/fine-tuning)' },
  ],

  'prompt-caching-process': [
    { find: 'system prompt', replace: '[system prompt](/glossary/system-prompt)' },
    { find: 'tokens', replace: '[tokens](/glossary/token)' },
    { find: 'context window', replace: '[context window](/glossary/context-window)' },
  ],

  'streaming-def': [
    { find: 'tokens', replace: '[tokens](/glossary/token)' },
    { find: 'latency', replace: '[latency](/glossary/latency)' },
  ],

  'alignment-def': [
    { find: 'RLHF', replace: '[RLHF](/glossary/rlhf)' },
    { find: 'constitutional AI', replace: '[constitutional AI](/glossary/constitutional-ai)' },
    { find: 'system prompt', replace: '[system prompt](/glossary/system-prompt)' },
  ],

  'token-def': [
    { find: 'context window', replace: '[context window](/glossary/context-window)' },
    { find: 'prompt caching', replace: '[prompt caching](/glossary/prompt-caching)' },
  ],

  'fine-tuning-def': [
    { find: 'RAG', replace: '[RAG](/glossary/rag)' },
    { find: 'system prompt', replace: '[system prompt](/glossary/system-prompt)' },
  ],

  'temperature-def': [
    { find: 'tokens', replace: '[tokens](/glossary/token)' },
    { find: 'hallucination', replace: '[hallucination](/glossary/hallucination)' },
  ],

  // ─── Batch 4: operator articles (currently 0 links) ──────────────

  'running-your-first-ai-pilot': [
    { find: 'system prompt', replace: '[system prompt](/glossary/system-prompt)' },
    { find: 'evals', replace: '[evals](/glossary/evals)' },
    { find: 'hallucination', replace: '[hallucination](/glossary/hallucination)' },
  ],

  'rag-role': [
    { find: 'system prompt', replace: '[system prompt](/glossary/system-prompt)' },
    { find: 'context window', replace: '[context window](/glossary/context-window)' },
    { find: 'tokens', replace: '[tokens](/glossary/token)' },
  ],

  'evals-role': [
    { find: 'system prompt', replace: '[system prompt](/glossary/system-prompt)' },
    { find: 'RAG', replace: '[RAG](/glossary/rag)' },
    { find: 'hallucination', replace: '[hallucination](/glossary/hallucination)' },
  ],

  'system-prompt-failure': [
    { find: 'hallucination', replace: '[hallucination](/glossary/hallucination)' },
    { find: 'alignment', replace: '[alignment](/glossary/alignment)' },
    { find: 'tool use', replace: '[tool use](/glossary/tool-use)' },
  ],

  'ai-agent-failure': [
    { find: 'tool use', replace: '[tool use](/glossary/tool-use)' },
    { find: 'system prompt', replace: '[system prompt](/glossary/system-prompt)' },
    { find: 'hallucination', replace: '[hallucination](/glossary/hallucination)' },
  ],

  'claude-for-customer-support': [
    { find: 'system prompt', replace: '[system prompt](/glossary/system-prompt)' },
    { find: 'RAG', replace: '[RAG](/glossary/rag)' },
    { find: 'hallucination', replace: '[hallucination](/glossary/hallucination)' },
  ],

  'hallucination-role': [
    { find: 'evals', replace: '[evals](/glossary/evals)' },
    { find: 'RAG', replace: '[RAG](/glossary/rag)' },
    { find: 'system prompt', replace: '[system prompt](/glossary/system-prompt)' },
  ],

  'claude-operator-habits': [
    { find: 'system prompt', replace: '[system prompt](/glossary/system-prompt)' },
    { find: 'context window', replace: '[context window](/glossary/context-window)' },
    { find: 'hallucination', replace: '[hallucination](/glossary/hallucination)' },
  ],

  // ─── Batch 5-7: newer articles (have some links, need Anthropic externals) ─

  'extended-thinking-role': [
    { find: 'tokens', replace: '[tokens](/glossary/token)' },
  ],

  'mcp-role': [
    { find: 'tool use', replace: '[tool use](/glossary/tool-use)' },
  ],

  'ai-pilot-failure': [
    { find: 'system prompt', replace: '[system prompt](/glossary/system-prompt)' },
    { find: 'hallucination', replace: '[hallucination](/glossary/hallucination)' },
  ],

  'prompt-caching-role': [
    { find: 'system prompt', replace: '[system prompt](/glossary/system-prompt)' },
  ],

  'hallucination-failure': [
    { find: 'RAG', replace: '[RAG](/glossary/rag)' },
    { find: 'context window', replace: '[context window](/glossary/context-window)' },
  ],

  'system-prompt-role': [
    { find: 'context window', replace: '[context window](/glossary/context-window)' },
    { find: 'hallucination', replace: '[hallucination](/glossary/hallucination)' },
  ],

  'rag-failure': [
    { find: 'system prompt', replace: '[system prompt](/glossary/system-prompt)' },
    { find: 'hallucination', replace: '[hallucination](/glossary/hallucination)' },
    { find: 'evals', replace: '[evals](/glossary/evals)' },
  ],

  'tool-use-process': [
    { find: 'system prompt', replace: '[system prompt](/glossary/system-prompt)' },
  ],

  'ai-agent-field-note': [
    { find: 'tool use', replace: '[tool use](/glossary/tool-use)' },
    { find: 'system prompt', replace: '[system prompt](/glossary/system-prompt)' },
  ],

  'evals-field-note': [
    { find: 'system prompt', replace: '[system prompt](/glossary/system-prompt)' },
    { find: 'hallucination', replace: '[hallucination](/glossary/hallucination)' },
  ],

  'ai-for-customer-success': [
    { find: 'system prompt', replace: '[system prompt](/glossary/system-prompt)' },
    { find: 'hallucination', replace: '[hallucination](/glossary/hallucination)' },
  ],

  'context-window-role': [
    { find: 'system prompt', replace: '[system prompt](/glossary/system-prompt)' },
    { find: 'RAG', replace: '[RAG](/glossary/rag)' },
  ],
}

// ── External link additions per article ───────────────────────────────
// Append these as a "Further reading" section at the end of select articles
const EXTERNAL_SECTIONS: Record<string, { label: string; url: string; source: string }[]> = {
  'rag-def': [
    { label: 'Embeddings guide', url: 'https://docs.anthropic.com/en/docs/build-with-claude/embeddings', source: 'Anthropic Docs' },
  ],
  'system-prompt-def': [
    { label: 'Prompt engineering guide', url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview', source: 'Anthropic Docs' },
  ],
  'tool-use-def': [
    { label: 'Tool use guide', url: 'https://docs.anthropic.com/en/docs/build-with-claude/tool-use', source: 'Anthropic Docs' },
  ],
  'hallucination-def': [
    { label: 'Reducing hallucinations', url: 'https://docs.anthropic.com/en/docs/test-and-evaluate/strengthen-guardrails/reduce-hallucinations', source: 'Anthropic Docs' },
  ],
  'evals-def': [
    { label: 'Evaluation best practices', url: 'https://docs.anthropic.com/en/docs/test-and-evaluate/eval-intro', source: 'Anthropic Docs' },
  ],
  'context-window-def': [
    { label: 'Models & context windows', url: 'https://docs.anthropic.com/en/docs/about-claude/models/overview', source: 'Anthropic Docs' },
  ],
  'large-language-model-def': [
    { label: 'About Claude', url: 'https://docs.anthropic.com/en/docs/about-claude/models/overview', source: 'Anthropic Docs' },
  ],
  'constitutional-ai-def': [
    { label: 'Constitutional AI research', url: 'https://www.anthropic.com/research/constitutional-ai-harmlessness-from-ai-feedback', source: 'Anthropic' },
  ],
  'prompt-caching-process': [
    { label: 'Prompt caching guide', url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching', source: 'Anthropic Docs' },
  ],
  'streaming-def': [
    { label: 'Streaming guide', url: 'https://docs.anthropic.com/en/docs/build-with-claude/streaming', source: 'Anthropic Docs' },
  ],
  'alignment-def': [
    { label: 'Anthropic safety research', url: 'https://www.anthropic.com/safety', source: 'Anthropic' },
  ],
  'extended-thinking-role': [
    { label: 'Extended thinking guide', url: 'https://docs.anthropic.com/en/docs/build-with-claude/extended-thinking', source: 'Anthropic Docs' },
  ],
  'mcp-role': [
    { label: 'MCP documentation', url: 'https://docs.anthropic.com/en/docs/agents-and-tools/mcp-connector', source: 'Anthropic Docs' },
    { label: 'MCP specification', url: 'https://modelcontextprotocol.io', source: 'MCP' },
  ],
  'claude-projects-role': [
    { label: 'Projects overview', url: 'https://support.anthropic.com/en/articles/claude-projects', source: 'Anthropic Support' },
  ],
  'connectors-skills-role': [
    { label: 'Skills in Claude', url: 'https://support.anthropic.com/en/articles/claude-skills', source: 'Anthropic Support' },
    { label: 'Available connectors', url: 'https://support.anthropic.com/en/collections/connectors', source: 'Anthropic Support' },
  ],
  'system-prompt-role': [
    { label: 'Prompt engineering guide', url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview', source: 'Anthropic Docs' },
  ],
  'hallucination-failure': [
    { label: 'Reducing hallucinations', url: 'https://docs.anthropic.com/en/docs/test-and-evaluate/strengthen-guardrails/reduce-hallucinations', source: 'Anthropic Docs' },
  ],
  'rag-role': [
    { label: 'Embeddings guide', url: 'https://docs.anthropic.com/en/docs/build-with-claude/embeddings', source: 'Anthropic Docs' },
  ],
  'rag-failure': [
    { label: 'Embeddings guide', url: 'https://docs.anthropic.com/en/docs/build-with-claude/embeddings', source: 'Anthropic Docs' },
  ],
  'tool-use-process': [
    { label: 'Tool use documentation', url: 'https://docs.anthropic.com/en/docs/build-with-claude/tool-use', source: 'Anthropic Docs' },
  ],
  'prompt-caching-role': [
    { label: 'Prompt caching guide', url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching', source: 'Anthropic Docs' },
  ],
  'ai-agent-field-note': [
    { label: 'Agent SDK docs', url: 'https://docs.anthropic.com/en/docs/agents-and-tools/agent-sdk', source: 'Anthropic Docs' },
  ],
  'evals-role': [
    { label: 'Evaluation best practices', url: 'https://docs.anthropic.com/en/docs/test-and-evaluate/eval-intro', source: 'Anthropic Docs' },
  ],
  'evals-field-note': [
    { label: 'Evaluation best practices', url: 'https://docs.anthropic.com/en/docs/test-and-evaluate/eval-intro', source: 'Anthropic Docs' },
  ],
}

function applyInlineLinks(body: string, rules: { find: string; replace: string }[]): string {
  let result = body
  for (const rule of rules) {
    // Only replace the first occurrence, and only if not already linked
    const alreadyLinked = result.includes(rule.replace)
    if (alreadyLinked) continue

    // Build regex: case-insensitive, word-boundary, first match only
    // But skip matches that are already inside a markdown link [...](...)
    const escaped = rule.find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`(?<!\\[)\\b(${escaped})\\b(?![^\\[]*\\])`, 'i')
    result = result.replace(regex, rule.replace)
  }
  return result
}

function appendExternalSection(body: string, links: { label: string; url: string; source: string }[]): string {
  if (links.length === 0) return body
  // Don't add if already has a "Further reading" or "Official resources" section
  if (body.includes('## Further reading') || body.includes('## Official resources')) return body

  const section = '\n\n---\n\n## Further reading\n\n' +
    links.map(l => `- [${l.label}](${l.url}) — ${l.source}`).join('\n')

  return body + section
}

async function main() {
  const { data: articles } = await sb
    .from('articles')
    .select('slug, body')
    .eq('published', true)

  if (!articles) { console.error('No articles found'); return }

  let updated = 0
  let skipped = 0

  for (const article of articles) {
    let newBody = article.body ?? ''
    const slug = article.slug

    // Apply inline links
    const inlineRules = UPDATES[slug]
    if (inlineRules) {
      newBody = applyInlineLinks(newBody, inlineRules)
    }

    // Append external links section
    const externalLinks = EXTERNAL_SECTIONS[slug]
    if (externalLinks) {
      newBody = appendExternalSection(newBody, externalLinks)
    }

    // Only update if body changed
    if (newBody === article.body) {
      skipped++
      continue
    }

    const { error } = await sb
      .from('articles')
      .update({ body: newBody })
      .eq('slug', slug)

    if (error) {
      console.error(`  ✗ ${slug}:`, error.message)
    } else {
      console.log(`  ✓ ${slug}`)
      updated++
    }
  }

  console.log(`\nDone. Updated: ${updated}, Skipped (no changes): ${skipped}`)
}

main().catch(console.error)
