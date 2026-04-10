import type { ClusterConfig } from './types'

export const CLUSTERS: ClusterConfig[] = [
  {
    name: 'Foundation Models & LLMs',
    color: '#7B8FD4',
    bg: 'rgba(123,143,212,0.12)',
    description: 'How large language models work — architecture, training, capabilities, and limits.',
    icon: '⬡',
  },
  {
    name: 'Agents & Orchestration',
    color: '#D4845A',
    bg: 'rgba(212,132,90,0.12)',
    description: 'Building AI systems that take actions, use tools, and complete multi-step tasks.',
    icon: '◈',
  },
  {
    name: 'Retrieval & Knowledge',
    color: '#4CAF7D',
    bg: 'rgba(76,175,125,0.12)',
    description: 'How AI systems access and reason over external information — RAG, memory, knowledge graphs.',
    icon: '◎',
  },
  {
    name: 'Prompt Engineering',
    color: '#D4C45A',
    bg: 'rgba(212,196,90,0.12)',
    description: 'Communicating with AI models precisely — templates, techniques, and governance.',
    icon: '◇',
  },
  {
    name: 'Infrastructure & Deployment',
    color: '#9B7BD4',
    bg: 'rgba(155,123,212,0.12)',
    description: 'Running AI in production — APIs, cost, latency, observability, and reliability.',
    icon: '▦',
  },
  {
    name: 'Evaluation & Safety',
    color: '#D45A7B',
    bg: 'rgba(212,90,123,0.12)',
    description: 'Measuring and ensuring AI systems behave as intended — evals, safety, governance.',
    icon: '◉',
  },
  {
    name: 'Business Strategy & ROI',
    color: '#5AAFD4',
    bg: 'rgba(90,175,212,0.12)',
    description: 'Adopting AI strategically — use case discovery, ROI, change management, and leadership.',
    icon: '◐',
  },
  {
    name: 'Tools & Ecosystem',
    color: '#D4A45A',
    bg: 'rgba(212,164,90,0.12)',
    description: 'The models, platforms, and tools that make up the AI landscape — including Claude.',
    icon: '◫',
  },
]

export const CLUSTER_MAP = Object.fromEntries(CLUSTERS.map(c => [c.name, c]))

export const ANGLE_LABELS: Record<string, string> = {
  def: 'Core Definition',
  process: 'How It Works',
  failure: 'Failure Modes',
  cross: 'Cross-Concept',
  role: 'Role-Specific',
  absence: 'What\'s Missing',
  history: 'History & Evolution',
}

export const AUDIENCE_LABELS: Record<string, string> = {
  founder: 'Founders',
  cto: 'CTOs',
  operator: 'Operators',
  developer: 'Developers',
  executive: 'Executives',
  all: 'Everyone',
}
