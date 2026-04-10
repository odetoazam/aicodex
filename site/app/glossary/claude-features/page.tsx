import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Claude Feature Map — AI Codex',
  description: 'Everything Claude can do, organized by capability group. A reference for admins, operators, and anyone doing due diligence on what to roll out.',
}

type Feature = {
  name: string
  description: string
  termSlug: string
  articleSlug?: string
}

type FeatureGroup = {
  id: string
  title: string
  subtitle: string
  accent: string
  accentBg: string
  features: Feature[]
}

const FEATURE_GROUPS: FeatureGroup[] = [
  {
    id: 'core',
    title: 'Core interface',
    subtitle: 'The building blocks of how Claude is organized and remembers context',
    accent: '#5B8DD9',
    accentBg: 'rgba(91,141,217,0.08)',
    features: [
      {
        name: 'Projects',
        description: 'Shared workspaces that give a team a consistent Claude — same system prompt, same knowledge, same tone — across every conversation.',
        termSlug: 'claude-projects',
        articleSlug: 'claude-projects-role',
      },
      {
        name: 'Memory',
        description: 'Claude can remember facts about you or your organization across sessions — so it builds on context instead of starting from scratch every time.',
        termSlug: 'claude-memory',
        articleSlug: 'claude-memory-guide',
      },
      {
        name: 'Artifacts',
        description: 'Standalone outputs — documents, code, charts — that Claude produces and you can directly use, edit, or download without copying from the chat.',
        termSlug: 'artifact',
      },
      {
        name: 'System Prompt',
        description: 'The instructions that shape every response before the user says anything. The highest-leverage thing an operator controls.',
        termSlug: 'system-prompt',
        articleSlug: 'system-prompt-role',
      },
    ],
  },
  {
    id: 'skills-connections',
    title: 'Skills & connections',
    subtitle: 'How Claude gets access to tools, data, and external services',
    accent: '#4CAF7D',
    accentBg: 'rgba(76,175,125,0.08)',
    features: [
      {
        name: 'Skills',
        description: 'Pre-built capabilities you can enable per Project — web search, image generation, code execution, and more. Each Skill changes what Claude can do.',
        termSlug: 'skill',
        articleSlug: 'skills-setup-guide',
      },
      {
        name: 'Connectors',
        description: 'Integrations that give Claude read access to your data sources — Google Drive, Notion, Confluence, and others — without manual copy-paste.',
        termSlug: 'connector',
        articleSlug: 'connectors-best-practices',
      },
      {
        name: 'MCP',
        description: 'Model Context Protocol — the open standard that lets Claude connect to any tool or data source, not just the ones Anthropic has built.',
        termSlug: 'mcp',
        articleSlug: 'mcp-role',
      },
      {
        name: 'Tool Use',
        description: 'Claude\'s ability to call external functions and APIs — so it can take actions, not just produce text. The foundation of everything agentic.',
        termSlug: 'tool-use',
        articleSlug: 'tool-use-process',
      },
    ],
  },
  {
    id: 'automation-agents',
    title: 'Automation & agents',
    subtitle: 'Features that let Claude take multi-step actions with less human in the loop',
    accent: '#D4845A',
    accentBg: 'rgba(212,132,90,0.08)',
    features: [
      {
        name: 'Cowork',
        description: 'Claude as an active participant in shared workspaces — able to contribute to projects alongside human team members, not just answer questions.',
        termSlug: 'claude-cowork',
        articleSlug: 'cowork-dispatch-guide',
      },
      {
        name: 'Dispatch',
        description: 'Route tasks to Claude automatically based on triggers or schedules — so work happens without someone manually kicking it off each time.',
        termSlug: 'dispatch',
        articleSlug: 'cowork-dispatch-guide',
      },
      {
        name: 'Managed Agents',
        description: 'Claude instances configured to run autonomously within defined boundaries — handling entire workflows end-to-end with minimal oversight.',
        termSlug: 'managed-agents',
        articleSlug: 'managed-agents-for-your-org',
      },
      {
        name: 'Computer Use',
        description: 'Claude can control a computer — clicking, typing, navigating interfaces — to complete tasks in applications that don\'t have APIs.',
        termSlug: 'computer-use',
      },
    ],
  },
  {
    id: 'research-intelligence',
    title: 'Research & intelligence',
    subtitle: 'Features for working with complex information and reasoning through hard problems',
    accent: '#9B6DD4',
    accentBg: 'rgba(155,109,212,0.08)',
    features: [
      {
        name: 'Deep Research',
        description: 'Claude conducts multi-step research across the web and your documents, synthesizing findings into structured reports — not just a single answer.',
        termSlug: 'deep-research',
        articleSlug: 'deep-research-guide',
      },
      {
        name: 'Extended Thinking',
        description: 'Claude works through complex problems step by step before answering — trading speed for depth on tasks that require careful reasoning.',
        termSlug: 'extended-thinking',
        articleSlug: 'extended-thinking-role',
      },
      {
        name: 'RAG',
        description: 'Retrieval-Augmented Generation — Claude answers questions using your documents as its source material, grounding responses in your actual data.',
        termSlug: 'rag',
        articleSlug: 'rag-role',
      },
      {
        name: 'Prompt Caching',
        description: 'Reuse expensive context across multiple calls — so Claude doesn\'t re-read a 100-page document every time. Significant speed and cost savings at scale.',
        termSlug: 'prompt-caching',
        articleSlug: 'prompt-caching-role',
      },
    ],
  },
  {
    id: 'admin-scale',
    title: 'Admin & scale',
    subtitle: 'What operators control — plans, access, governance, and developer tooling',
    accent: '#5AAFD4',
    accentBg: 'rgba(90,175,212,0.08)',
    features: [
      {
        name: 'Claude Plans',
        description: 'Free, Pro, Team, and Enterprise — each tier unlocks different capabilities, context limits, and admin controls. The plan determines what your org can do.',
        termSlug: 'claude-plans',
        articleSlug: 'claude-admin-setup',
      },
      {
        name: 'Claude Code',
        description: 'An agentic coding tool that runs in the terminal — writes, edits, runs, and debugs code autonomously within a codebase. Built for developers.',
        termSlug: 'claude-code',
      },
      {
        name: 'Claude Agent SDK',
        description: 'The developer SDK for building custom agents on top of Claude — with structured tool use, multi-turn conversation management, and orchestration primitives.',
        termSlug: 'claude-agent-sdk',
      },
      {
        name: 'Tokens',
        description: 'The unit Claude charges by. Understanding token usage — what consumes them, where waste happens — is the key to keeping costs predictable at org scale.',
        termSlug: 'token',
        articleSlug: 'minimising-token-usage',
      },
    ],
  },
]

export default function ClaudeFeaturesPage() {
  const totalFeatures = FEATURE_GROUPS.reduce((sum, g) => sum + g.features.length, 0)

  return (
    <div style={{ width: 'var(--container)', margin: '0 auto', padding: 'clamp(48px, 8vw, 96px) 0 var(--section-y)' }}>

      {/* Breadcrumb */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px', fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)' }}>
        <Link href="/glossary" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Glossary</Link>
        <span>›</span>
        <span style={{ color: 'var(--text-secondary)' }}>Claude feature map</span>
      </nav>

      {/* Header */}
      <div style={{ marginBottom: '56px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <p className="eyebrow">Reference</p>
          <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 500, background: 'rgba(91,141,217,0.1)', color: '#5B8DD9', fontFamily: 'var(--font-sans)' }}>
            {totalFeatures} features · {FEATURE_GROUPS.length} capability groups
          </span>
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'var(--text-2xl)',
            fontWeight: 600,
            color: 'var(--text-primary)',
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            marginBottom: '16px',
            maxWidth: '28ch',
          }}
        >
          Claude feature map
        </h1>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', color: 'var(--text-muted)', maxWidth: '56ch', lineHeight: 1.65 }}>
          Everything Claude can do, organized by capability group. Use this to understand
          the full surface area — whether you&apos;re evaluating Claude for the first time,
          planning what to roll out next, or just trying to find the right term.
        </p>
      </div>

      {/* Feature groups */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
        {FEATURE_GROUPS.map((group) => (
          <div key={group.id}>
            {/* Group header */}
            <div style={{
              borderLeft: `3px solid ${group.accent}`,
              paddingLeft: '16px',
              marginBottom: '20px',
            }}>
              <h2 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'var(--text-xl)',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: '4px',
                lineHeight: 1.2,
              }}>
                {group.title}
              </h2>
              <p style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '14px',
                color: 'var(--text-muted)',
                margin: 0,
              }}>
                {group.subtitle}
              </p>
            </div>

            {/* Feature cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '10px',
            }}
              className="feature-grid"
            >
              {group.features.map((feature) => (
                <FeatureCard key={feature.termSlug} feature={feature} accent={group.accent} accentBg={group.accentBg} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        marginTop: '64px',
        padding: '32px',
        borderRadius: '12px',
        border: '1px solid var(--border-base)',
        background: 'var(--bg-surface)',
        borderLeft: '3px solid #5B8DD9',
      }}>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: '#5B8DD9', marginBottom: '10px' }}>
          For admins
        </p>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
          Ready to set this up?
        </p>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: 1.6 }}>
          The admin learning path walks you through evaluation, deployment, and ongoing management — in the right order.
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' as const }}>
          <Link
            href="/learn/claude-for-admins"
            style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: '#5B8DD9', textDecoration: 'none', fontWeight: 500 }}
          >
            Admin learning path →
          </Link>
          <Link
            href="/glossary"
            style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-secondary)', textDecoration: 'none' }}
          >
            Full glossary →
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .feature-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}

function FeatureCard({ feature, accent, accentBg }: { feature: Feature; accent: string; accentBg: string }) {
  return (
    <div style={{
      padding: '20px',
      borderRadius: '10px',
      border: '1px solid var(--border-base)',
      background: 'var(--bg-surface)',
      display: 'flex',
      flexDirection: 'column',
      gap: '0',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <h3 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'var(--text-base)',
          fontWeight: 600,
          color: 'var(--text-primary)',
          margin: 0,
          lineHeight: 1.2,
        }}>
          {feature.name}
        </h3>
      </div>

      <p style={{
        fontFamily: 'var(--font-sans)',
        fontSize: '13px',
        color: 'var(--text-muted)',
        lineHeight: 1.6,
        margin: '0 0 16px',
        flex: 1,
      }}>
        {feature.description}
      </p>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <Link
          href={`/glossary/${feature.termSlug}`}
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '12px',
            color: accent,
            textDecoration: 'none',
            fontWeight: 500,
            padding: '4px 10px',
            borderRadius: '4px',
            background: accentBg,
          }}
        >
          Definition →
        </Link>
        {feature.articleSlug && (
          <Link
            href={`/articles/${feature.articleSlug}`}
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '12px',
              color: 'var(--text-secondary)',
              textDecoration: 'none',
            }}
          >
            Guide →
          </Link>
        )}
      </div>
    </div>
  )
}
