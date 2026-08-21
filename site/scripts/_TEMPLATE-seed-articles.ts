/**
 * TEMPLATE — copy to scripts/seed-articles-<N>.ts for a new batch.
 *
 * The `assertSeedable` call is retro instruction #30 and is not optional:
 * nothing is written unless every article ends with something the reader can
 * do, or carries an explicit `noPromptReason`. This existed as a rule for
 * three sessions and was missed every time, so it is now a gate.
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-<N>.ts
 */

import { createClient } from '@supabase/supabase-js'
import { assertSeedable } from './_lib/article-gate'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function getTermId(slug: string): Promise<{ id: string; name: string } | null> {
  const { data } = await sb.from('terms').select('id, name').eq('slug', slug).single()
  return data
}

const articles = [
  {
    slug: 'example-slug',
    angle: 'update', // def | process | failure | role | field-note | cross | absence | history | update
    title: '',
    excerpt: '',
    readTime: 9,
    cluster: '',
    termSlug: '',
    // Inline code in the body needs escaped backticks: \`like_this\`
    body: `Opening paragraph.

## A section

Body.

## Try this today — N minutes

The concrete thing the reader does now, with a time box. Delete this heading only
if you are also setting noPromptReason below, and only if the article genuinely
has no useful action (a pure definition, say).`,
    // noPromptReason: 'Glossary definition — practice lives on the role article for this term.',
  },
]

async function seed() {
  // Gate first. Throws before anything is written.
  assertSeedable(articles)

  console.log('Seeding...\n')

  for (const a of articles) {
    const term = await getTermId(a.termSlug)
    if (!term) {
      console.error(`  ✗ Term not found: ${a.termSlug}`)
      continue
    }

    const { error } = await sb.from('articles').upsert({
      slug:      a.slug,
      angle:     a.angle,
      title:     a.title,
      excerpt:   a.excerpt,
      body:      a.body,
      read_time: a.readTime,
      cluster:   a.cluster,
      term_id:   term.id,
      term_name: term.name,
      term_slug: a.termSlug,
      published: true,
    }, { onConflict: 'slug' })

    console.log(error ? `  ✗ ${a.slug}: ${error.message}` : `  ✓ ${a.slug}`)
  }

  console.log('\nDone. Now: verify the rows landed, add slugs to ArticlesFilteredView, and add lib/next-reads.ts entries.')
}

seed().catch(err => { console.error(err.message); process.exit(1) })
