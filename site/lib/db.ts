import { getPublicClient } from './supabase/public'
import type { Term, Article, NewsletterIssue, TimelineEvent } from './types'

// ── Terms ──────────────────────────────────────────────────

export async function getAllTerms(): Promise<Term[]> {
  const supabase = getPublicClient()
  const { data, error } = await supabase
    .from('terms')
    .select('*')
    .eq('published', true)
    .order('name')

  if (error) { console.error('getAllTerms:', error); return [] }
  return data ?? []
}

export async function getTerm(slug: string): Promise<Term | null> {
  const supabase = getPublicClient()
  const { data, error } = await supabase
    .from('terms')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error) { console.error('getTerm:', error); return null }
  return data
}

export async function getTermsByCluster(cluster: string): Promise<Term[]> {
  const supabase = getPublicClient()
  const { data, error } = await supabase
    .from('terms')
    .select('*')
    .eq('cluster', cluster)
    .eq('published', true)
    .order('name')

  if (error) { console.error('getTermsByCluster:', error); return [] }
  return data ?? []
}

export async function getRelatedTerms(slugsOrNames: string[]): Promise<Pick<Term, 'slug' | 'name' | 'cluster'>[]> {
  if (!slugsOrNames.length) return []
  const normalized = slugsOrNames.map(s => s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))
  const supabase = getPublicClient()
  const { data, error } = await supabase
    .from('terms')
    .select('slug, name, cluster')
    .in('slug', normalized)
    .eq('published', true)

  if (error) { console.error('getRelatedTerms:', error); return [] }
  return data ?? []
}

export async function searchTerms(query: string): Promise<Term[]> {
  const supabase = getPublicClient()
  const { data, error } = await supabase
    .from('terms')
    .select('*')
    .eq('published', true)
    .or(`name.ilike.%${query}%,definition.ilike.%${query}%`)
    .order('name')
    .limit(20)

  if (error) { console.error('searchTerms:', error); return [] }
  return data ?? []
}

export async function getTermSlugs(): Promise<string[]> {
  const supabase = getPublicClient()
  const { data, error } = await supabase
    .from('terms')
    .select('slug')
    .eq('published', true)

  if (error) { console.error('getTermSlugs:', error); return [] }
  return data?.map(t => t.slug) ?? []
}

export async function getClusterCounts(): Promise<Record<string, number>> {
  const supabase = getPublicClient()
  const { data, error } = await supabase
    .from('terms')
    .select('cluster')
    .eq('published', true)

  if (error) { console.error('getClusterCounts:', error); return {} }

  const counts: Record<string, number> = {}
  data?.forEach(t => {
    counts[t.cluster] = (counts[t.cluster] || 0) + 1
  })
  return counts
}

// ── Articles ───────────────────────────────────────────────

export async function getAllArticles(): Promise<Article[]> {
  const supabase = getPublicClient()
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })

  if (error) { console.error('getAllArticles:', error); return [] }
  return data ?? []
}

export async function getArticle(slug: string): Promise<Article | null> {
  const supabase = getPublicClient()
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error) { console.error('getArticle:', error); return null }
  return data
}

export async function getArticlesForTerm(termId: string): Promise<Article[]> {
  const supabase = getPublicClient()
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('term_id', termId)
    .eq('published', true)
    .order('created_at')

  if (error) { console.error('getArticlesForTerm:', error); return [] }
  return data ?? []
}

export async function getFeaturedArticles(limit = 3): Promise<Article[]> {
  const supabase = getPublicClient()
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('published', true)
    .in('tier', [3, 5])
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) { console.error('getFeaturedArticles:', error); return [] }
  return data ?? []
}

export async function getArticlesByCluster(cluster: string, excludeSlug: string, limit = 4): Promise<Article[]> {
  const supabase = getPublicClient()
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('published', true)
    .eq('cluster', cluster)
    .neq('slug', excludeSlug)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) { console.error('getArticlesByCluster:', error); return [] }
  return data ?? []
}

export async function getArticlesBySlugs(slugs: string[]): Promise<Article[]> {
  if (slugs.length === 0) return []
  const supabase = getPublicClient()
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('published', true)
    .in('slug', slugs)

  if (error) { console.error('getArticlesBySlugs:', error); return [] }
  const bySlug = new Map((data ?? []).map(a => [a.slug, a]))
  return slugs.map(s => bySlug.get(s)).filter(Boolean) as Article[]
}

export async function getFieldNotes(limit = 5): Promise<Article[]> {
  const supabase = getPublicClient()
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('published', true)
    .eq('angle', 'field-note')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) { console.error('getFieldNotes:', error); return [] }
  return data ?? []
}

// ── Newsletter ─────────────────────────────────────────────

export async function getNewsletterIssues(): Promise<NewsletterIssue[]> {
  const supabase = getPublicClient()
  const { data, error } = await supabase
    .from('newsletter_issues')
    .select('*')
    .order('issue_number', { ascending: false })

  if (error) { console.error('getNewsletterIssues:', error); return [] }
  return data ?? []
}

// ── Timeline ───────────────────────────────────────────────

export async function getTimelineEvents(): Promise<TimelineEvent[]> {
  const supabase = getPublicClient()
  const { data, error } = await supabase
    .from('timeline_events')
    .select('*')
    .eq('published', true)
    .order('event_date', { ascending: false })

  if (error) { console.error('getTimelineEvents:', error); return [] }
  return data ?? []
}

export async function subscribeToNewsletter(email: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getPublicClient()
  const { error } = await supabase
    .from('newsletter_subscribers')
    .insert({ email, subscribed_at: new Date().toISOString() })

  if (error) {
    if (error.code === '23505') return { success: true } // Already subscribed
    return { success: false, error: error.message }
  }
  return { success: true }
}
