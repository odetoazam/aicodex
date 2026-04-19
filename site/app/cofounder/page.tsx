import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import CofounderDashboard from './CofounderDashboard'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Cofounder — AI Codex',
  description: 'The build log.',
  robots: 'noindex',
}

async function getLiveStats() {
  const supabase = await createClient()

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const sevenDaysAgoISO = sevenDaysAgo.toISOString()

  const [articlesRes, articlesThisWeekRes, glossaryRes, subsRes, subsThisWeekRes, usersRes, progressRes, favoritesRes] = await Promise.all([
    supabase.from('articles').select('id', { count: 'exact', head: true }).eq('published', true),
    supabase.from('articles').select('id', { count: 'exact', head: true }).eq('published', true).gte('created_at', sevenDaysAgoISO),
    supabase.from('terms').select('id', { count: 'exact', head: true }),
    supabase.from('newsletter_subscribers').select('email', { count: 'exact', head: true }),
    supabase.from('newsletter_subscribers').select('email', { count: 'exact', head: true }).gte('subscribed_at', sevenDaysAgoISO),
    supabase.from('user_profiles').select('id', { count: 'exact', head: true }),
    supabase.from('user_progress').select('user_id', { count: 'exact', head: true }),
    supabase.from('user_favorites').select('user_id', { count: 'exact', head: true }),
  ])

  return {
    articlesPublished: articlesRes.count ?? 0,
    articlesThisWeek: articlesThisWeekRes.count ?? 0,
    glossaryTerms: glossaryRes.count ?? 0,
    newsletterSubs: subsRes.count ?? 0,
    subsThisWeek: subsThisWeekRes.count ?? 0,
    authUsers: usersRes.count,
    progressRows: progressRes.count ?? 0,
    favoritesRows: favoritesRes.count ?? 0,
  }
}

export default async function CofounderPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const ownerEmail = process.env.COFOUNDER_EMAIL
  if (!user || (ownerEmail && user.email !== ownerEmail)) {
    redirect('/')
  }

  const stats = await getLiveStats()
  return <CofounderDashboard stats={stats} />
}
