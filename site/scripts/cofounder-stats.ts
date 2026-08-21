/**
 * Cofounder session-start briefing.
 *
 * Reads current live stats from Supabase + last-session snapshot from memory.
 * Emits a delta-oriented summary for the cofounder to open the session with.
 * Then saves the current stats as the new snapshot for next session.
 *
 * Run at the start of every /cofounder session (AI Codex only):
 *   ./node_modules/.bin/tsx --env-file=.env.local scripts/cofounder-stats.ts
 *
 * The output is text — designed to be read by the cofounder, not structured JSON
 * (though the snapshot file itself IS JSON). Delta framing makes the cofounder
 * open with "here's what changed" instead of "here's current state."
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const SNAPSHOT_PATH = '/Users/azamkhan/.claude/projects/-Users-azamkhan-AI-knowledge/memory/last_session_stats.json'

type Snapshot = {
  capturedAt: string
  articlesPublished: number
  glossaryTerms: number
  newsletterSubs: number
  progressRows: number
  favoritesRows: number
  authUsers: number | null
}

async function getCurrentStats(): Promise<Snapshot> {
  const [articlesRes, glossaryRes, subsRes, usersRes, progressRes, favoritesRes] = await Promise.all([
    sb.from('articles').select('id', { count: 'exact', head: true }).eq('published', true),
    sb.from('terms').select('id', { count: 'exact', head: true }),
    sb.from('newsletter_subscribers').select('email', { count: 'exact', head: true }),
    sb.from('user_profiles').select('id', { count: 'exact', head: true }),
    sb.from('user_progress').select('user_id', { count: 'exact', head: true }),
    sb.from('user_favorites').select('user_id', { count: 'exact', head: true }),
  ])

  return {
    capturedAt: new Date().toISOString(),
    articlesPublished: articlesRes.count ?? 0,
    glossaryTerms: glossaryRes.count ?? 0,
    newsletterSubs: subsRes.count ?? 0,
    authUsers: usersRes.count,
    progressRows: progressRes.count ?? 0,
    favoritesRows: favoritesRes.count ?? 0,
  }
}

function loadSnapshot(): Snapshot | null {
  if (!existsSync(SNAPSHOT_PATH)) return null
  try {
    return JSON.parse(readFileSync(SNAPSHOT_PATH, 'utf-8')) as Snapshot
  } catch {
    return null
  }
}

function daysBetween(a: string, b: string): number {
  const ms = Math.abs(new Date(a).getTime() - new Date(b).getTime())
  return Math.round(ms / (1000 * 60 * 60 * 24) * 10) / 10
}

function fmtDelta(delta: number | null): string {
  if (delta === null) return ''
  if (delta === 0) return ' (no change)'
  if (delta > 0) return ` (+${delta.toLocaleString()})`
  return ` (${delta.toLocaleString()})`
}

function emit(current: Snapshot, prev: Snapshot | null) {
  console.log('═══ Cofounder session briefing — AI Codex ═══')
  console.log(`Captured: ${current.capturedAt.slice(0, 19).replace('T', ' ')} UTC\n`)

  if (!prev) {
    console.log('No prior snapshot — this is the first briefing. Current state:')
    console.log(`  Articles published:     ${current.articlesPublished}`)
    console.log(`  Glossary terms:         ${current.glossaryTerms}`)
    console.log(`  Newsletter subscribers: ${current.newsletterSubs}`)
    console.log(`  Registered users:       ${current.authUsers ?? '—'}`)
    console.log(`  Path progress events:   ${current.progressRows}`)
    console.log(`  Favorites saved:        ${current.favoritesRows}`)
    console.log('\nNext session will show deltas from this snapshot.')
    return
  }

  const gap = daysBetween(current.capturedAt, prev.capturedAt)
  console.log(`Last snapshot: ${prev.capturedAt.slice(0, 19).replace('T', ' ')} UTC  (${gap} days ago)\n`)

  const d = {
    articles: current.articlesPublished - prev.articlesPublished,
    glossary: current.glossaryTerms - prev.glossaryTerms,
    subs: current.newsletterSubs - prev.newsletterSubs,
    users: current.authUsers !== null && prev.authUsers !== null ? current.authUsers - prev.authUsers : null,
    progress: current.progressRows - prev.progressRows,
    favorites: current.favoritesRows - prev.favoritesRows,
  }

  console.log('Since last session:')
  console.log(`  Articles published:     ${current.articlesPublished}${fmtDelta(d.articles)}`)
  console.log(`  Glossary terms:         ${current.glossaryTerms}${fmtDelta(d.glossary)}`)
  console.log(`  Newsletter subscribers: ${current.newsletterSubs}${fmtDelta(d.subs)}`)
  console.log(`  Registered users:       ${current.authUsers ?? '—'}${d.users !== null ? fmtDelta(d.users) : ''}`)
  console.log(`  Path progress events:   ${current.progressRows}${fmtDelta(d.progress)}`)
  console.log(`  Favorites saved:        ${current.favoritesRows}${fmtDelta(d.favorites)}`)

  // Narrative signal — which metric moved most?
  const movers = [
    { name: 'articles', delta: d.articles },
    { name: 'subscribers', delta: d.subs },
    { name: 'users', delta: d.users ?? 0 },
    { name: 'path progress events', delta: d.progress },
    { name: 'favorites', delta: d.favorites },
  ].filter(m => m.delta !== 0).sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))

  console.log()
  if (movers.length === 0) {
    console.log('Signal: nothing moved since last session. Either no work shipped or the work didn\'t reach users.')
  } else {
    const top = movers[0]
    const dir = top.delta > 0 ? 'grew' : 'shrank'
    console.log(`Signal: ${top.name} ${dir} by ${Math.abs(top.delta).toLocaleString()}. That's the biggest mover.`)
    if (movers.length > 1) {
      console.log(`         Also moved: ${movers.slice(1).map(m => `${m.name} ${m.delta > 0 ? '+' : ''}${m.delta}`).join(', ')}.`)
    }
    if (d.subs === 0 && d.articles > 0) {
      console.log('         Content shipped but no new subscribers — distribution loop is still open.')
    }
    if (d.progress === 0 && d.favorites === 0 && d.subs === 0 && d.users === 0) {
      console.log('         No reader-side movement at all. Everything shipped this session stayed invisible to real users.')
    }
  }
}

async function run() {
  const prev = loadSnapshot()
  const current = await getCurrentStats()

  emit(current, prev)

  // Save new snapshot for next session
  writeFileSync(SNAPSHOT_PATH, JSON.stringify(current, null, 2))
  console.log(`\n(Snapshot saved to ${SNAPSHOT_PATH})`)
}

run().then(() => process.exit(0))
