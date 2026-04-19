import { createClient } from '@supabase/supabase-js'

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

const SLUGS = [
  'your-first-claude-api-call',
  'building-a-rag-pipeline-from-scratch',
  'prompt-caching-implementation',
  'securing-your-claude-app',
]

async function run() {
  for (const slug of SLUGS) {
    const { data } = await sb.from('articles').select('title, body').eq('slug', slug).single()
    if (!data) { console.log(`NOT FOUND: ${slug}`); continue }

    // Find numeric patterns: percentages, counts, time estimates, cost figures
    const numericMatches = data.body.match(/\d+[\s]?(%|percent|ms|seconds?|minutes?|hours?|KB|MB|GB|tokens?|requests?|calls?|chars?|lines?|\$\d|\bx\b)/gi) ?? []
    const thresholdMatches = data.body.match(/(?:above|below|more than|less than|at least|no more than|under|over|around|approximately|~)\s*\d+/gi) ?? []

    console.log(`\n=== ${data.title} (${slug}) ===`)
    console.log(`Numeric mentions: ${numericMatches.length}`)
    console.log(`Threshold language: ${thresholdMatches.length}`)
    if (thresholdMatches.length > 0) {
      thresholdMatches.slice(0, 5).forEach(m => console.log(`  - "${m}"`))
    }
    console.log('---')
  }
}

run().then(() => process.exit(0))
