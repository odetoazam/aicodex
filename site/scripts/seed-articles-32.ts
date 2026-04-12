/**
 * Batch 32 — Diagnostic: why Claude feels inconsistent
 * why-claude-feels-inconsistent
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-32.ts
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
  {
    termSlug: 'hallucination',
    slug: 'why-claude-feels-inconsistent',
    angle: 'failure',
    title: 'Why Claude keeps feeling inconsistent — and the actual fix',
    excerpt: "Claude worked well last week. Now it feels worse. Some people on your team get great results; others struggle. The model hasn't changed. Here's what's actually varying — and the specific fix for each cause.",
    readTime: 8,
    cluster: 'Common Mistakes',
    audience: ['operator'],
    body: `There is a specific pattern that happens around two months into using Claude at work.

Early on, it feels impressive. You try something, it works, you show a colleague, they are converted. Then gradually something shifts. The outputs feel blander. The responses seem less tailored. Different people on your team get different quality from the same tool. You wonder if Anthropic changed something.

They almost certainly did not. The model is being perfectly consistent. What is changing is what the model sees.

Understanding this distinction is the key that unlocks better results — and it applies to every person on your team hitting this ceiling.

## Why the inconsistency happens

Claude starts every conversation with no memory of anything before it. No memory of who you are, what your company does, how you like things written, what you were working on yesterday. Each session is a blank slate.

This means the quality of what Claude produces depends almost entirely on the quality of what it receives in that session. Give it rich, specific context and it produces tailored, useful work. Give it a sparse prompt and it produces generic output — not because it is less capable, but because it is working with less information.

When output quality varies between people or between sessions, the cause almost always traces back to one of four things.

## Cause 1: No persistent context about your role or company

The most common cause. You know you work in customer success at a B2B SaaS company with mid-market clients in the logistics industry. Claude does not know any of that unless you tell it in the session.

A colleague who naturally front-loads context — "I'm a CS manager at a B2B SaaS company, my clients are operations directors at logistics companies, here's what I need..." — will consistently get better output than someone who starts with "write a customer email." Same model, very different results.

The fix is to stop front-loading context in every prompt manually and start loading it once, at the session level.

The right tool for this is Claude Projects. Create a project for your main work context and add a set of instructions: your role, your company, who your customers or stakeholders are, the communication style your team uses, any recurring formats or templates. Everything you currently explain once per conversation — put it there. From that point forward, every conversation in the project starts with Claude already knowing your context. The quality floor rises permanently.

If your team is on Claude for Teams or Enterprise, the admin can also set organisation-level instructions in the system prompt — the same principle applied across everyone's sessions rather than per person.

## Cause 2: Prompts that start too vague

The blank-slate problem compounds with vague starting points. "Write a response to this customer" produces generic output. "Write a response to this customer — they are frustrated because they expected feature X to work a certain way and it does not; they are a power user who values directness; acknowledge the limitation honestly, explain the actual behavior, and give them a workaround" produces something you might actually send.

The gap is not skill. It is specificity. The model will produce as much tailored output as the input supports.

A useful reframe: treat your prompt like a brief to a talented colleague who knows nothing about this situation yet. What would they need to know to produce exactly what you want? Role, audience, goal, tone, constraints, format — whichever of those apply. The ones you leave out are the ones Claude has to guess at, and guessing is where you get generic.

## Cause 3: No conventions or standards loaded

When your team has established ways of doing things — a communication style, a document structure, a response format that your manager prefers — Claude will produce output that ignores all of it unless those conventions are in the session.

This is the most common cause of "it works for some people and not others" within a team. The people getting good results have, consciously or not, given Claude enough context to match your team's style. The people getting mediocre results are getting Claude's defaults.

The fix here is to make conventions explicit and load them once rather than re-explaining them every time. A few things that work:

Load examples. Paste in two or three pieces of writing your team considers "on brand" — a strong email, a well-written update, a solid customer response. Say "match the style of these." Claude extracts the pattern and applies it. This is faster and more accurate than describing the style in the abstract.

Describe non-obvious constraints. If your manager hates bullet points, say so. If your customer base includes a lot of non-native English speakers and you want simple sentence structure, say so. If responses should always lead with the bottom line and put context later, say so. These constraints are invisible to Claude unless you name them.

Save them in a Project so you only write them once. The same project instructions that hold your role context can hold your style conventions. One place to set it, zero cognitive overhead going forward.

## Cause 4: Tasks that exceed a single session's context

Some work naturally spans multiple conversations — a project that develops over several weeks, a document that gets built up over time, a relationship with a client that has accumulated relevant history.

Claude has no continuity across sessions by default. When you come back the next day, it does not know about the call you had yesterday, the draft you worked through last week, or the feedback you incorporated in the previous version.

The result is that output feels inconsistent over time — not because the model changed but because each session starts without the history that would make the output build on what came before.

The fix for this kind of work is to create a running context document that you paste in at the start of relevant sessions. One or two paragraphs: where the project stands, what decisions have been made, what the current draft looks like, what you are trying to do in this session. It sounds effortful but takes two minutes and the quality difference is significant.

For long documents, paste in the current draft at the start of the session. For ongoing relationships — a client you work with regularly — keep a brief note on what matters about that account and paste it when you are working on anything related to them.

## The pattern across all four causes

Every cause of inconsistency traces back to the same thing: Claude is working from less information than you have. You have the full picture. It has what you put in the prompt.

The fix is always the same direction: give Claude the context it needs to match what you already know, rather than expecting it to guess. Projects make this systematic so you are not re-explaining things every time.

Once you set up proper session context for your main work, you will notice that the "it was better before" feeling mostly disappears. The model's quality ceiling was always higher than what you were seeing. You were just only reaching it on good days, when you naturally gave it more to work with.

## A quick diagnostic

When output feels worse than expected, ask:

What does Claude know about who I am and what I do in this session? If the answer is nothing, load your role context before the next prompt.

What does Claude know about the audience for this output? If it is guessing, tell it.

What are the non-obvious conventions for how this should be written or structured? If you have not stated them, Claude is using its own defaults.

Is there relevant history or context from previous sessions? If yes, add a brief summary at the start.

Usually one of these is the gap. Fill it and quality recovers immediately.`,
  },
]

async function main() {
  console.log('Seeding batch 32 articles...\n')

  for (const article of ARTICLES) {
    const term = await getTermId(article.termSlug)
    if (!term) {
      console.error(`  ✗ Term not found: ${article.termSlug}`)
      continue
    }

    const payload = {
      slug:      article.slug,
      title:     article.title,
      excerpt:   article.excerpt,
      body:      article.body,
      read_time: article.readTime,
      cluster:   article.cluster,
      angle:     article.angle,
      term_id:   term.id,
      term_name: term.name,
      term_slug: article.termSlug,
      published: true,
    }

    const { error } = await sb
      .from('articles')
      .upsert(payload, { onConflict: 'slug' })

    if (error) {
      console.error(`  ✗ ${article.slug}: ${error.message}`)
    } else {
      console.log(`  ✓ ${article.slug}`)
    }
  }

  console.log('\nDone.')
}

main()
