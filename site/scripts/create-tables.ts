/**
 * Creates user_progress and user_favorites tables with RLS.
 * Uses service role key to run DDL — requires SUPABASE_SERVICE_ROLE_KEY in env.
 * 
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/create-tables.ts
 */
import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function run() {
  console.log('Service role key present:', !!process.env.SUPABASE_SERVICE_ROLE_KEY)
  console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
}

run()
