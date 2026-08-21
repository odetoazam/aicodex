import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const OLD = 'Run this on your top 10-20 most important cases. Anything with a pass rate below 95% is flaky and needs attention.'
const NEW = 'Run this on your top 10-20 most important cases. Anything with a pass rate below 95% is flaky and needs attention.\n\n**CI-readiness threshold:** if more than 2 of your top 10 cases show a pass rate below 95%, your suite is not CI-ready. Fix the flaky cases or mark them as monitored (nightly-only) before you let this gate production deploys — a CI that fails intermittently stops being trusted, and engineers start merging around it.'

async function run() {
  const { data, error } = await sb.from('articles').select('slug, body').eq('slug', 'auditing-your-eval-suite').single()
  if (error || !data) { console.log('fetch error:', error); return }
  const body: string = data.body
  if (!body.includes(OLD)) { console.log('OLD not found — aborting'); return }
  if (body.includes('CI-readiness threshold')) { console.log('already updated — skip'); return }
  const updated = body.replace(OLD, NEW)
  const { error: upErr } = await sb.from('articles').update({ body: updated }).eq('slug', 'auditing-your-eval-suite')
  if (upErr) { console.log('update error:', upErr); return }
  console.log('✓ auditing-your-eval-suite updated with CI-readiness threshold')
}

run().then(() => process.exit(0))
