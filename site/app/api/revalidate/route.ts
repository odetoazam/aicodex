import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

/**
 * On-demand ISR revalidation.
 *
 * Article and glossary pages are statically generated with `revalidate = 3600`,
 * so a content edit in Supabase takes up to an hour to appear. Content lives in
 * the database, not the repo, which means a code deploy is the only other way
 * to flush it — a heavy hammer for a copy fix.
 *
 * POST here after a content update to push it live immediately:
 *
 *   curl -X POST https://www.aicodex.to/api/revalidate \
 *     -H "authorization: Bearer $REVALIDATE_SECRET" \
 *     -H "content-type: application/json" \
 *     -d '{"paths":["/articles/what-ai-cant-do","/glossary/token"]}'
 *
 * Omit `paths` to revalidate the article and glossary index pages only.
 * Pass `{"all": true}` to sweep every route under /articles and /glossary.
 *
 * Requires REVALIDATE_SECRET to be set. If it is unset the route refuses every
 * request rather than defaulting open.
 */

export const dynamic = 'force-dynamic'

const MAX_PATHS = 200

export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET
  if (!secret) {
    return NextResponse.json(
      { error: 'Revalidation is not configured on this deployment.' },
      { status: 503 }
    )
  }

  const auth = request.headers.get('authorization') ?? ''
  const provided = auth.startsWith('Bearer ') ? auth.slice(7) : ''
  if (provided !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let payload: { paths?: unknown; all?: unknown } = {}
  try {
    payload = await request.json()
  } catch {
    // An empty body is fine — fall through to the index-only default.
  }

  if (payload.all === true) {
    revalidatePath('/articles/[slug]', 'page')
    revalidatePath('/glossary/[slug]', 'page')
    revalidatePath('/articles')
    revalidatePath('/glossary')
    return NextResponse.json({ revalidated: 'all article and glossary pages' })
  }

  const raw = payload.paths
  if (raw !== undefined && !Array.isArray(raw)) {
    return NextResponse.json({ error: '`paths` must be an array of strings.' }, { status: 400 })
  }

  const paths = (raw as unknown[] | undefined)?.filter(
    (p): p is string => typeof p === 'string' && p.startsWith('/') && !p.includes('..')
  ) ?? ['/articles', '/glossary']

  if (paths.length > MAX_PATHS) {
    return NextResponse.json(
      { error: `Too many paths — ${MAX_PATHS} max per request.` },
      { status: 400 }
    )
  }

  for (const path of paths) revalidatePath(path)

  return NextResponse.json({ revalidated: paths })
}
