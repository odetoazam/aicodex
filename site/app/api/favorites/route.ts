import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// POST /api/favorites — add a favorite
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { slug } = await request.json()
  if (!slug || typeof slug !== 'string') {
    return NextResponse.json({ error: 'slug required' }, { status: 400 })
  }

  const { error } = await supabase
    .from('user_favorites')
    .upsert({ user_id: user.id, article_slug: slug }, { onConflict: 'user_id,article_slug' })

  if (error) {
    console.error('favorites upsert error:', error)
    return NextResponse.json({ error: 'Failed to save favorite' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

// DELETE /api/favorites — remove a favorite
export async function DELETE(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { slug } = await request.json()
  if (!slug || typeof slug !== 'string') {
    return NextResponse.json({ error: 'slug required' }, { status: 400 })
  }

  const { error } = await supabase
    .from('user_favorites')
    .delete()
    .eq('user_id', user.id)
    .eq('article_slug', slug)

  if (error) {
    console.error('favorites delete error:', error)
    return NextResponse.json({ error: 'Failed to remove favorite' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
