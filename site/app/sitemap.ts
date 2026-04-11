import type { MetadataRoute } from 'next'
import { getAllArticles, getTermSlugs } from '@/lib/db'

const BASE = 'https://www.aicodex.to'

const STATIC_ROUTES: MetadataRoute.Sitemap = [
  { url: BASE, changeFrequency: 'weekly', priority: 1.0, lastModified: new Date() },
  { url: `${BASE}/learn`, changeFrequency: 'weekly', priority: 0.9 },
  { url: `${BASE}/learn/claude`, changeFrequency: 'monthly', priority: 0.8 },
  { url: `${BASE}/learn/ai-for-your-company`, changeFrequency: 'monthly', priority: 0.8 },
  { url: `${BASE}/learn/claude-for-admins`, changeFrequency: 'monthly', priority: 0.8 },
  { url: `${BASE}/learn/getting-your-team-started`, changeFrequency: 'monthly', priority: 0.8 },
  { url: `${BASE}/learn/developers`, changeFrequency: 'monthly', priority: 0.85 },
  { url: `${BASE}/learn/build-with-ai`, changeFrequency: 'monthly', priority: 0.8 },
  { url: `${BASE}/articles`, changeFrequency: 'weekly', priority: 0.85 },
  { url: `${BASE}/glossary`, changeFrequency: 'weekly', priority: 0.85 },
  { url: `${BASE}/timeline`, changeFrequency: 'monthly', priority: 0.6 },
  { url: `${BASE}/updates`, changeFrequency: 'monthly', priority: 0.4 },
  { url: `${BASE}/about`, changeFrequency: 'yearly', priority: 0.3 },
  // Tools
  { url: `${BASE}/tools`, changeFrequency: 'monthly', priority: 0.85 },
  { url: `${BASE}/tools/cost-calculator`, changeFrequency: 'monthly', priority: 0.8 },
  { url: `${BASE}/tools/system-prompt-builder`, changeFrequency: 'monthly', priority: 0.8 },
  { url: `${BASE}/tools/scorecard`, changeFrequency: 'monthly', priority: 0.75 },
  // Compare
  { url: `${BASE}/compare`, changeFrequency: 'monthly', priority: 0.85 },
  { url: `${BASE}/compare/claude-vs-gpt4-customer-support`, changeFrequency: 'monthly', priority: 0.8 },
  { url: `${BASE}/compare/claude-vs-gpt4-coding`, changeFrequency: 'monthly', priority: 0.8 },
  { url: `${BASE}/compare/claude-vs-gpt4-writing`, changeFrequency: 'monthly', priority: 0.8 },
  { url: `${BASE}/compare/claude-vs-gpt4-document-analysis`, changeFrequency: 'monthly', priority: 0.8 },
  { url: `${BASE}/compare/claude-haiku-vs-sonnet`, changeFrequency: 'monthly', priority: 0.8 },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, termSlugs] = await Promise.all([
    getAllArticles(),
    getTermSlugs(),
  ])

  const articleRoutes: MetadataRoute.Sitemap = articles.map(article => ({
    url: `${BASE}/articles/${article.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
    lastModified: article.created_at ? new Date(article.created_at) : undefined,
  }))

  const glossaryRoutes: MetadataRoute.Sitemap = termSlugs.map(slug => ({
    url: `${BASE}/glossary/${slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.65,
  }))

  return [...STATIC_ROUTES, ...articleRoutes, ...glossaryRoutes]
}
