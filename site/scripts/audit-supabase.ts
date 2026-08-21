import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  'https://qjonkertkmxzlvbiufnr.supabase.co',
  'sb_publishable_F1xTgRema9nTIheuhhuZXA_MLiw6KQc'
)

async function audit() {
  console.log('=== Supabase Audit ===\n')

  // 1. Check if tables exist by attempting a SELECT
  const tables = ['user_progress', 'user_favorites', 'articles', 'terms']
  for (const t of tables) {
    const { data, error, status } = await sb.from(t).select('*').limit(1)
    if (error) {
      console.log(`[${t}] SELECT → ${status} — ${error.message} (code: ${error.code})`)
    } else {
      const cols = data && data.length > 0 ? Object.keys(data[0]).join(', ') : '(no rows / RLS filtered)'
      console.log(`[${t}] SELECT → OK — columns: ${cols}`)
    }
  }

  console.log('\n--- Testing upsert to user_progress (anon, no auth) ---')
  const { error: upErr } = await sb
    .from('user_progress')
    .upsert({ user_id: '00000000-0000-0000-0000-000000000000', article_slug: 'test' }, { onConflict: 'user_id,article_slug' })
  console.log('upsert error:', upErr ? `${upErr.message} (code: ${upErr.code})` : 'none (unexpected success)')

  console.log('\n--- Testing upsert to user_favorites (anon, no auth) ---')
  const { error: favErr } = await sb
    .from('user_favorites')
    .upsert({ user_id: '00000000-0000-0000-0000-000000000000', article_slug: 'test' }, { onConflict: 'user_id,article_slug' })
  console.log('upsert error:', favErr ? `${favErr.message} (code: ${favErr.code})` : 'none (unexpected success)')

  // 2. Try to get column info via RPC or information_schema
  console.log('\n--- Column info for user_progress ---')
  const { data: cols, error: colErr } = await sb
    .from('user_progress')
    .select()
    .limit(0)
  console.log('columns query error:', colErr?.message ?? 'none')

  // 3. Check if there's a unique constraint on user_id+article_slug
  console.log('\n--- Checking for existing progress rows (public) ---')
  const { count, error: cntErr } = await sb
    .from('user_progress')
    .select('*', { count: 'exact', head: true })
  console.log('count:', count, '| error:', cntErr?.message ?? 'none')
}

audit().catch(console.error)
