import type { Metadata } from 'next'
import GlossaryBrowser from './GlossaryBrowser'
import { getAllTerms } from '@/lib/db'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Glossary — AI Codex',
  description: '150+ AI terms mapped across 8 clusters — from foundation models to business strategy. Every concept connected to the decisions it informs.',
}

export default async function GlossaryPage() {
  const terms = await getAllTerms()
  return <GlossaryBrowser terms={terms} />
}
