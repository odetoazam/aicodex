import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// POST /api/progress — mark an article as read
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { slug } = await request.json()
  if (!slug || typeof slug !== 'string') {
    return NextResponse.json({ error: 'slug required' }, { status: 400 })
  }

  const { error } = await supabase
    .from('user_progress')
    .upsert({ user_id: session.user.id, article_slug: slug }, { onConflict: 'user_id,article_slug' })

  if (error) {
    console.error('progress upsert error:', error)
    return NextResponse.json({ error: 'Failed to save progress' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

// DELETE /api/progress — unmark an article as read
export async function DELETE(request: Request) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { slug } = await request.json()
  if (!slug || typeof slug !== 'string') {
    return NextResponse.json({ error: 'slug required' }, { status: 400 })
  }

  const { error } = await supabase
    .from('user_progress')
    .delete()
    .eq('user_id', session.user.id)
    .eq('article_slug', slug)

  if (error) {
    console.error('progress delete error:', error)
    return NextResponse.json({ error: 'Failed to delete progress' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
