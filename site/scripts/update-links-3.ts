/**
 * update-links-3.ts — Cross-link batches 16-20 articles
 *
 * Developer articles link to each other.
 * Founder articles link forward through the journey.
 * Productivity articles reference each other where relevant.
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/update-links-3.ts
 */

import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// ── Link map: article slug → list of {text, href} to inject ──────────────────
// href is either /articles/slug or /glossary/slug
// text must match exactly in the article body (case-sensitive)

const LINK_RULES: Record<string, { text: string; href: string }[]> = {

  // ── Developer: your-first-claude-api-call ────────────────────────────────
  'your-first-claude-api-call': [
    { text: 'prompt caching', href: '/glossary/prompt-caching' },
    { text: 'structured output', href: '/glossary/structured-output' },
    { text: 'streaming', href: '/articles/streaming-claude-responses-implementation' },
  ],

  // ── Developer: streaming-claude-responses-implementation ─────────────────
  'streaming-claude-responses-implementation': [
    { text: 'system prompt', href: '/glossary/system-prompt' },
    { text: 'token', href: '/glossary/token' },
  ],

  // ── Developer: building-a-rag-pipeline-from-scratch ──────────────────────
  'building-a-rag-pipeline-from-scratch': [
    { text: 'eval suite', href: '/articles/writing-evals-that-catch-regressions' },
    { text: 'context window', href: '/glossary/context-window' },
    { text: 'semantic search', href: '/glossary/semantic-search' },
    { text: 'vector database', href: '/glossary/vector-database' },
    { text: 'hybrid search', href: '/glossary/hybrid-search' },
    { text: 'reranking', href: '/glossary/reranking' },
    { text: 'chunking', href: '/glossary/chunking' },
  ],

  // ── Developer: writing-evals-that-catch-regressions ──────────────────────
  'writing-evals-that-catch-regressions': [
    { text: 'RAG', href: '/articles/building-a-rag-pipeline-from-scratch' },
    { text: 'hallucination', href: '/glossary/hallucination' },
    { text: 'system prompt', href: '/glossary/system-prompt' },
  ],

  // ── Developer: tool-use-implementation-deep-dive ─────────────────────────
  'tool-use-implementation-deep-dive': [
    { text: 'multi-turn tool calls', href: '/articles/multi-agent-orchestration-basics' },
    { text: 'system prompt', href: '/glossary/system-prompt' },
    { text: 'streaming', href: '/articles/streaming-claude-responses-implementation' },
    { text: 'hallucinating', href: '/glossary/hallucination' },
  ],

  // ── Developer: multi-agent-orchestration-basics ───────────────────────────
  'multi-agent-orchestration-basics': [
    { text: 'tool calls', href: '/articles/tool-use-implementation-deep-dive' },
    { text: 'context window', href: '/glossary/context-window' },
    { text: 'human-in-the-loop', href: '/glossary/human-in-the-loop' },
    { text: 'orchestrator', href: '/glossary/orchestration' },
  ],

  // ── Founder: solo-founder-operating-system ───────────────────────────────
  'solo-founder-operating-system': [
    { text: 'validating your startup idea', href: '/articles/validating-startup-idea-with-claude' },
    { text: 'customer discovery', href: '/articles/customer-discovery-with-claude' },
    { text: 'system prompt', href: '/glossary/system-prompt' },
  ],

  // ── Founder: validating-startup-idea-with-claude ────────────────────────
  'validating-startup-idea-with-claude': [
    { text: 'customer interviews', href: '/articles/customer-discovery-with-claude' },
    { text: 'unit economics', href: '/glossary/total-cost-of-ownership' },
    { text: 'go-to-market', href: '/articles/first-ten-customers-ai-product' },
  ],

  // ── Founder: build-buy-prompt-early-stage ────────────────────────────────
  'build-buy-prompt-early-stage': [
    { text: 'system prompt', href: '/glossary/system-prompt' },
    { text: 'Claude API', href: '/articles/your-first-claude-api-call' },
    { text: 'evals', href: '/articles/writing-evals-that-catch-regressions' },
    { text: 'fine-tuning', href: '/glossary/fine-tuning' },
    { text: 'prompt-engineered', href: '/glossary/prompt' },
  ],

  // ── Founder: ai-product-failure-modes-founders ───────────────────────────
  'ai-product-failure-modes-founders': [
    { text: 'eval suite', href: '/articles/writing-evals-that-catch-regressions' },
    { text: 'system prompt', href: '/glossary/system-prompt' },
    { text: 'RAG', href: '/articles/building-a-rag-pipeline-from-scratch' },
    { text: 'retention', href: '/articles/first-ten-customers-ai-product' },
  ],

  // ── Founder: pitching-ai-product-to-investors ────────────────────────────
  'pitching-ai-product-to-investors': [
    { text: 'go-to-market', href: '/articles/first-ten-customers-ai-product' },
    { text: 'unit economics', href: '/articles/pricing-your-ai-product' },
    { text: 'product-market fit', href: '/articles/validating-startup-idea-with-claude' },
  ],

  // ── Founder: pricing-your-ai-product ────────────────────────────────────
  'pricing-your-ai-product': [
    { text: 'API costs', href: '/articles/your-first-claude-api-call' },
    { text: 'prompt caching', href: '/glossary/prompt-caching' },
    { text: 'freemium', href: '/articles/first-ten-customers-ai-product' },
  ],

  // ── Founder: first-ten-customers-ai-product ──────────────────────────────
  'first-ten-customers-ai-product': [
    { text: 'customer discovery', href: '/articles/customer-discovery-with-claude' },
    { text: 'validating', href: '/articles/validating-startup-idea-with-claude' },
    { text: 'product-market fit', href: '/articles/ai-product-failure-modes-founders' },
  ],

  // ── Founder: customer-discovery-with-claude ──────────────────────────────
  'customer-discovery-with-claude': [
    { text: 'validating your startup idea', href: '/articles/validating-startup-idea-with-claude' },
    { text: 'system prompt', href: '/glossary/system-prompt' },
    { text: 'Claude Project', href: '/glossary/claude-projects' },
  ],

  // ── Productivity: managing-email-with-claude ────────────────────────────
  'managing-email-with-claude': [
    { text: 'connector', href: '/articles/how-to-write-precise-connector-instructions' },
    { text: 'weekly review', href: '/articles/weekly-review-with-claude' },
    { text: 'system prompt', href: '/glossary/system-prompt' },
  ],

  // ── Productivity: weekly-review-with-claude ─────────────────────────────
  'weekly-review-with-claude': [
    { text: 'email', href: '/articles/managing-email-with-claude' },
    { text: 'meeting prep', href: '/articles/meeting-prep-with-claude' },
  ],

  // ── Productivity: meeting-prep-with-claude ───────────────────────────────
  'meeting-prep-with-claude': [
    { text: 'customer discovery', href: '/articles/customer-discovery-with-claude' },
    { text: 'weekly review', href: '/articles/weekly-review-with-claude' },
  ],

  // ── Connectors: how-to-write-precise-connector-instructions ─────────────
  'how-to-write-precise-connector-instructions': [
    { text: 'system prompt', href: '/glossary/system-prompt' },
    { text: 'agentic', href: '/glossary/agentic-workflow' },
    { text: 'tool use', href: '/glossary/tool-use' },
  ],

  // ── Developer: prompt-caching-implementation ─────────────────────────────
  'prompt-caching-implementation': [
    { text: 'structured output', href: '/glossary/structured-output' },
    { text: 'context window', href: '/glossary/context-window' },
    { text: 'token', href: '/glossary/token' },
  ],

  // ── Developer: claude-cost-optimization ──────────────────────────────────
  'claude-cost-optimization': [
    { text: 'prompt caching', href: '/articles/prompt-caching-implementation' },
    { text: 'evals', href: '/articles/writing-evals-that-catch-regressions' },
    { text: 'context window', href: '/glossary/context-window' },
    { text: 'streaming', href: '/articles/streaming-claude-responses-implementation' },
  ],

  // ── Developer: chatbot-with-persistent-memory ─────────────────────────────
  'chatbot-with-persistent-memory': [
    { text: 'prompt caching', href: '/articles/prompt-caching-implementation' },
    { text: 'tool use', href: '/articles/tool-use-implementation-deep-dive' },
    { text: 'multi-turn', href: '/articles/multi-agent-orchestration-basics' },
  ],

  // ── Productivity: note-taking-knowledge-management-claude ─────────────────
  'note-taking-knowledge-management-claude': [
    { text: 'Claude Projects', href: '/glossary/claude-projects' },
    { text: 'meeting prep', href: '/articles/meeting-prep-with-claude' },
    { text: 'weekly review', href: '/articles/weekly-review-with-claude' },
  ],

}

// ── Inject links into article body (first occurrence only, skip if already linked) ──

function injectLinks(body: string, rules: { text: string; href: string }[]): string {
  let result = body
  for (const { text, href } of rules) {
    // Skip if already linked
    if (result.includes(`(${href})`)) continue
    if (result.includes(`href="${href}"`)) continue

    // Match first plain occurrence (not inside a link, not inside a code block)
    // Use a simple approach: find first occurrence not preceded by [ or inside backticks
    const escaped = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const pattern = new RegExp(`(?<!\\[)(?<!\`[^\`]*)\\b(${escaped})\\b(?!\\])(?![^\`]*\`)`, '')

    // Check the pattern finds something outside code blocks and links
    // Simple heuristic: split on code fences, only replace in non-code sections
    const parts = result.split(/(```[\s\S]*?```|`[^`]+`)/)
    let replaced = false
    const newParts = parts.map((part, i) => {
      if (replaced) return part
      // Odd indices are code blocks — skip
      if (i % 2 === 1) return part
      // Check not inside an existing markdown link
      const linkPattern = new RegExp(`(?<!\\[[^\\]]*)(${escaped})(?![^\\[]*\\])`)
      if (linkPattern.test(part)) {
        replaced = true
        return part.replace(linkPattern, `[$1](${href})`)
      }
      return part
    })
    if (replaced) result = newParts.join('')
  }
  return result
}

async function main() {
  const slugs = Object.keys(LINK_RULES)
  console.log(`Processing ${slugs.length} articles…\n`)

  for (const slug of slugs) {
    const { data: article, error: fetchErr } = await sb
      .from('articles')
      .select('id, body')
      .eq('slug', slug)
      .single()

    if (fetchErr || !article) {
      console.log(`  ⊘ ${slug} — not found, skipping`)
      continue
    }

    const rules = LINK_RULES[slug]
    const updatedBody = injectLinks(article.body, rules)

    if (updatedBody === article.body) {
      console.log(`  · ${slug} — no changes`)
      continue
    }

    const { error: updateErr } = await sb
      .from('articles')
      .update({ body: updatedBody })
      .eq('id', article.id)

    if (updateErr) {
      console.error(`  ✗ ${slug}:`, updateErr.message)
    } else {
      const count = rules.filter(r => updatedBody.includes(`(${r.href})`)).length
      console.log(`  ✓ ${slug} — ${count} link(s) added`)
    }
  }

  console.log('\nDone.')
}

main().catch(console.error)

// ── Batch 21 additions ──────────────────────────────────────────────────────
// Add these to LINK_RULES above, or run as a separate pass:
