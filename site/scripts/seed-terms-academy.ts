/**
 * New glossary terms, Aug 21 2026 — the vocabulary Claude Academy just made standard.
 *
 * "AI fluency" and "the 4D framework" are now the terms Anthropic uses across 355
 * training resources. Anyone who takes a course arrives using them, so the glossary
 * needs them defined honestly — including what the framework does not reach.
 */
import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const terms = [
  {
    slug: 'ai-fluency',
    name: 'AI Fluency',
    aliases: ['4D Framework', 'Delegation Description Discernment Diligence'],
    cluster: 'Business Strategy & ROI',
    scope: 'conceptual',
    lifecycle_stage: 'awareness',
    audience: ['all'],
    tier: 1,
    angles: ['def', 'process', 'role'],
    related_terms: ['AI Literacy', 'AI Adoption', 'Change Management'],
    claude_specific: false,
    definition:
      "Anthropic's framework for working with AI, taught across Claude Academy and built on four practices it calls the 4Ds. **Delegation** is deciding what to hand to a model and what to keep. **Description** is briefing it well enough to get the output you meant. **Discernment** is judging what comes back. **Diligence** is verifying in proportion to the stakes — the single most portable idea in the set. AI fluency sits one level above AI literacy: literacy is knowing what a model can do, fluency is having a repeatable practice for working with one. The framework is deliberately about durable habits rather than product features, which is its strength. It is also scoped to one person working with one model, so it says nothing about the organisational problems — budget, adoption, procurement, failure at scale — that consume most of a real deployment.",
    practical_example:
      "A analyst applying the 4Ds to a quarterly report: delegates the first-pass summarisation but keeps the interpretation; describes the audience and format up front instead of iterating five times; reads the output looking for the specific claims that would embarrass them if wrong; and verifies every number that goes in front of the board while accepting the prose as drafted. That last split — heavy verification on figures, light on wording — is diligence proportional to stakes.",
    published: true,
  },
  {
    slug: 'claude-academy',
    name: 'Claude Academy',
    aliases: ['Anthropic Academy', 'academy.claude.com'],
    cluster: 'Tools & Ecosystem',
    scope: 'conceptual',
    lifecycle_stage: 'awareness',
    audience: ['all'],
    tier: 1,
    angles: ['def', 'role'],
    related_terms: ['AI Fluency', 'AI Literacy', 'Claude'],
    claude_specific: true,
    definition:
      "Anthropic's free training platform at academy.claude.com, launched on August 20, 2026. It holds 355 resources: 22 courses, 119 tutorials, 148 role-specific use cases, and live webinars, with badges and completion tracking. `anthropic.com/learn` redirects there. The catalog covers AI fundamentals through the AI Fluency courses, product training for claude.ai, Cowork, Claude Code, Claude Tag, and the Platform, and task recipes by department. Everything is open to anyone with an email address. It is distinct from the **Claude Certification Program** — four proctored Pearson VUE exams costing $99 to $175 that require a work email at a Claude Partner Network organisation, which excludes most independent practitioners.",
    practical_example:
      "A new AI Agent Manager takes Claude 101 and AI Capabilities and Limitations in their first fortnight — about six hours — and stops guessing at why the model behaves the way it does. What Academy will not teach them is what to do in month six, when adoption has plateaued at 30% and the CFO wants the spend justified.",
    published: true,
  },
]

async function main() {
  console.log('Seeding Academy glossary terms...\n')
  for (const t of terms) {
    const { error } = await sb.from('terms').upsert(t, { onConflict: 'slug' })
    console.log(error ? `  ✗ ${t.slug}: ${error.message}` : `  ✓ ${t.slug}`)
  }
  console.log('\nDone.')
}

main().catch(console.error)
