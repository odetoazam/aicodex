/**
 * Batch 36 — Day in the life: founder
 * founder-ai-workflow
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-36.ts
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
    termSlug: 'claude-projects',
    slug: 'founder-ai-workflow',
    angle: 'field-note',
    title: "What using Claude actually looks like for a solo founder",
    excerpt: "Solo founders do not have one job — they have twelve. Here is where Claude actually shows up across the week, and what it does not replace.",
    readTime: 8,
    cluster: 'Role Workflows',
    body: `Solo founders have a particular relationship with AI tools. There is no team to split work with, no specialist to hand off to, and the context switches happen every hour — product thinking in the morning, customer conversation at noon, investor email at 3pm, code review at midnight.

Claude does not fix that. But it does compress the parts that were eating time without requiring thought. Here is where it actually shows up in a founder's week — not the idealized version, but the real one.

## Monday morning: getting unstuck on something you wrote

The most reliable use case is also the most unglamorous: taking something you wrote and making it clearer.

Not "write this for me" — founders are rarely stuck on having nothing to say. They are stuck on having too much to say, or saying it in the way they think about it internally rather than the way someone else needs to hear it.

A cold email draft that buries the ask. A product description that explains the mechanism instead of the outcome. A one-pager that answers questions the investor is not asking.

The workflow: paste the draft, say what it is trying to do, ask what is getting in the way. Not "rewrite this" — "what is confusing here." For example: *"Here's a cold email I wrote to a potential customer. My goal is to get a 30-minute call. What's making this harder to say yes to?"* Claude's answer is usually faster and more specific than a second pass from the same brain that wrote it.

This happens three or four times a week for most founders, in five-minute windows. The cumulative time saved is more than it sounds.

## Mid-week: synthesizing what you heard from customers

By the time you have done ten customer conversations, you have more notes than you know what to do with. Emails with feedback pointing at the same problem. Call notes written in a rush across different docs. A recurring objection that keeps appearing in demos.

The problem is not a lack of information — it is that ten sets of scattered notes do not tell you anything on their own.

The workflow: dump the raw notes (or a summary of each call) into a conversation and ask specifically: *"What objections keep appearing? What are people actually trying to do when they use this? Where does the same confusion show up in different words?"* Claude is not doing anything magical — it is reading the notes the same way you would if you had two uninterrupted hours and a clear head, which founders rarely have simultaneously.

Claude is not doing anything magical. It is reading the notes the same way you would if you had two uninterrupted hours and a clear head — which founders rarely do simultaneously.

## Investor materials: the research no one has time to do

Fundraising involves a lot of contextual research that founders should do but often skip because it takes time they do not have.

What does this investor's portfolio tell you about what they are actually looking for? What did their last public statement about a sector reveal about how they think? What is the right warm intro path given who you know?

This used to require dedicated blocks of time. With Claude's web research mode, it compresses into a few minutes per investor. You come to the conversation knowing something relevant rather than leading with a cold pitch and hoping.

The honest caveat: this works for research and prep, not for writing the pitch itself. Investors read a lot of AI-generated outreach. The message still needs your voice and something specific to them.

## Code and product: the debugging and the spec

For founders who can code — even a little — Claude's real value is not writing features from scratch. It is the parts around the code.

Explaining what a chunk of code does in plain English (useful before a technical conversation with an engineer or investor). Writing the spec for a feature you know you want but have not fully articulated. Generating test cases for an edge case you thought of at midnight. Debugging something that stopped working and you cannot figure out why from the error alone.

None of these replace an engineer. They let a non-specialist founder be less bottlenecked by the technical work that does not require a specialist.

## The context problem: why Projects matter for founders

The biggest friction for founders using Claude casually is re-explaining context. You are working on multiple things — company background, current product state, the customer you are focused on this week, the problem you are trying to solve. Explaining this from scratch in every conversation wastes time and produces worse output.

A Project with a system prompt that covers: what the company does in two sentences, who the target customer is, what stage you are at, and any non-obvious context Claude would otherwise get wrong — this is the highest-leverage setup change a founder can make.

It does not need to be long. Three to four paragraphs of current state. Update it when something significant changes. Once it is there, every conversation starts with context rather than rebuilding it.

## What it does not replace

Two things are still entirely yours.

The judgment calls. What to build next. Whether to raise now or in six months. Whether this customer signal means something or is noise. Claude can help you think through a decision, surface considerations you have not thought of, and argue the other side — but the call is yours, and it should be.

The relationships. The investor who commits because they trust you specifically. The customer who stays because they believe in what you are building and you built that belief over time. The early hire who joins because of how you made them feel in the conversation. None of this is compressible.

The founders who get the most from Claude are the ones who are clear about what it is: a tool that compresses the parts of the job that run on information and structure, so they can spend more time on the parts that run on trust and judgment.`,
  },

]

async function seed() {
  console.log('Seeding batch 36...\n')

  for (const article of ARTICLES) {
    const term = await getTermId(article.termSlug)
    if (!term) {
      console.error(`  ✗ Term not found: ${article.termSlug} (for ${article.slug})`)
      continue
    }

    const { error } = await sb.from('articles').upsert({
      slug: article.slug,
      term_id: term.id,
      term_name: term.name,
      term_slug: article.termSlug,
      cluster: article.cluster,
      title: article.title,
      angle: article.angle,
      body: article.body.trim(),
      excerpt: article.excerpt,
      read_time: article.readTime,
      tier: 2,
      published: true,
    }, { onConflict: 'slug' })

    if (error) {
      console.error(`  ✗ ${article.slug}:`, error.message)
    } else {
      console.log(`  ✓ ${article.slug}`)
    }
  }

  console.log('\nDone.')
}

seed().then(() => process.exit(0))
