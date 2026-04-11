export type Cluster =
  | 'Foundation Models & LLMs'
  | 'Agents & Orchestration'
  | 'Retrieval & Knowledge'
  | 'Prompt Engineering'
  | 'Infrastructure & Deployment'
  | 'Evaluation & Safety'
  | 'Business Strategy & ROI'
  | 'Tools & Ecosystem'

export type Scope = 'conceptual' | 'technical' | 'business' | 'strategic'

export type LifecycleStage = 'awareness' | 'evaluation' | 'adoption' | 'scaling' | 'optimization'

export type Audience = 'founder' | 'cto' | 'operator' | 'developer' | 'executive' | 'all'

export type ArticleAngle =
  | 'def'
  | 'process'
  | 'failure'
  | 'cross'
  | 'role'
  | 'absence'
  | 'history'
  | 'field-note'

export type Term = {
  id: string
  slug: string
  name: string
  aliases: string[]
  cluster: Cluster
  scope: Scope
  lifecycle_stage: LifecycleStage
  audience: Audience[]
  tier: 1 | 2 | 3 | 4 | 5
  angles: ArticleAngle[]
  related_terms: string[]
  claude_specific: boolean
  definition: string
  practical_example: string | null
  published: boolean
  created_at: string
  updated_at: string
}

export type Article = {
  id: string
  slug: string
  term_id: string
  term_name: string
  term_slug: string
  cluster: Cluster
  title: string
  angle: ArticleAngle
  body: string
  excerpt: string | null
  read_time: number
  tier: number
  published: boolean
  created_at: string
}

export type NewsletterIssue = {
  id: string
  slug: string
  subject: string
  body: string
  sent_at: string
  issue_number: number
}

export type ClusterConfig = {
  name: Cluster
  color: string
  bg: string
  description: string
  icon: string
}
