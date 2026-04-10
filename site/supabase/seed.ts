/**
 * Seed the terms table from ai-field-guide-kg.csv
 *
 * Usage:
 *   npx tsx supabase/seed.ts
 *
 * Requires:
 *   SUPABASE_SERVICE_ROLE_KEY env var (from Supabase dashboard → Settings → API)
 *   NEXT_PUBLIC_SUPABASE_URL env var
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Service role bypasses RLS for seeding
)

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  result.push(current.trim())
  return result
}

function parseCSV(content: string) {
  const lines = content.split('\n').filter(l => l.trim())
  const headers = parseCSVLine(lines[0])
  return lines.slice(1).map(line => {
    const values = parseCSVLine(line)
    return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? '']))
  })
}

async function seed() {
  console.log('📖 Reading CSV...')

  const csvPath = join(__dirname, '../../ai-field-guide-kg.csv')
  const csvContent = readFileSync(csvPath, 'utf-8')
  const rows = parseCSV(csvContent)

  console.log(`Found ${rows.length} terms`)

  const terms = rows.map(row => ({
    slug: slugify(row.term),
    name: row.term,
    aliases: row.aliases ? row.aliases.split('|').map((s: string) => s.trim()).filter(Boolean) : [],
    cluster: row.cluster,
    scope: row.scope || 'conceptual',
    lifecycle_stage: row.lifecycle_stage || 'awareness',
    audience: row.audience ? row.audience.split('|').map((s: string) => s.trim()).filter(Boolean) : ['all'],
    tier: parseInt(row.tier) || 1,
    angles: row.angles ? row.angles.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
    related_terms: row.related_terms
      ? row.related_terms.split('|').map((s: string) => slugify(s.trim())).filter(Boolean)
      : [],
    claude_specific: row.claude_specific === 'yes',
    definition: row.definition || '',
    published: true,
  }))

  // Upsert in batches of 50
  const BATCH = 50
  let inserted = 0

  for (let i = 0; i < terms.length; i += BATCH) {
    const batch = terms.slice(i, i + BATCH)
    const { error } = await supabase
      .from('terms')
      .upsert(batch, { onConflict: 'slug' })

    if (error) {
      console.error(`❌ Error at batch ${i}:`, error)
      process.exit(1)
    }

    inserted += batch.length
    console.log(`✓ Seeded ${inserted}/${terms.length} terms`)
  }

  console.log(`\n✅ Done — ${inserted} terms seeded to Supabase`)
}

seed().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
