import type { Metadata } from 'next'
import PromptLibrary from '@/components/PromptLibrary'

export const metadata: Metadata = {
  title: 'Prompt Library — AI Codex',
  description: 'Curated, copy-paste-ready Claude prompts for everyday work. Summarize, draft, research, analyze, extract, review — organized by task type.',
}

export default function PromptLibraryPage() {
  return (
    <div style={{ width: 'var(--container)', margin: '0 auto', padding: 'clamp(48px, 8vw, 96px) 0 var(--section-y)' }}>
      <div style={{ marginBottom: '56px' }}>
        <p className="eyebrow" style={{ marginBottom: '16px' }}>Prompt Library</p>
        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'var(--text-2xl)',
          fontWeight: 600,
          color: 'var(--text-primary)',
          lineHeight: 1.15,
          letterSpacing: '-0.02em',
          marginBottom: '16px',
          maxWidth: '24ch',
        }}>
          Prompts that actually work. Copy and use them.
        </h1>
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--text-base)',
          color: 'var(--text-muted)',
          maxWidth: '54ch',
          lineHeight: 1.65,
        }}>
          Generic prompts for everyday tasks — summarizing, drafting, researching, analyzing. Each one is tested, explained, and ready to paste into Claude.
        </p>
      </div>

      <PromptLibrary />
    </div>
  )
}
