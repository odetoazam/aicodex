'use client'

import { useState } from 'react'

type Role = 'ops' | 'marketing' | 'cs' | 'founder' | 'developer'
type Verdict = 'essential' | 'worth-it' | 'situational'

type Integration = {
  id: string
  name: string
  icon: string
  what: string           // One-line: what it actually does for you
  verdict: Verdict
  verdictNote: string
  href?: string
  docsHref?: string
  guideHref?: string
}

type StackItem = {
  integrationId: string
  why: string            // Why this item belongs in this stack specifically
}

type Stack = {
  role: Role
  headline: string
  outcome: string        // What changes when you do this
  items: StackItem[]
  caveat?: string        // Honest note about what this stack won't do
}

const INTEGRATIONS: Record<string, Integration> = {
  projects: {
    id: 'projects',
    name: 'Projects',
    icon: '◫',
    what: 'Gives Claude persistent memory — your docs, style guide, and instructions stay loaded across every session.',
    verdict: 'essential',
    verdictNote: 'Set this up first. Everything else builds on it.',
    href: 'https://claude.ai',
    docsHref: 'https://support.claude.ai/en/articles/9517075-what-are-projects',
  },
  'web-search': {
    id: 'web-search',
    name: 'Web Search',
    icon: '◎',
    what: "Removes Claude's training data cutoff. It searches the live web and cites sources.",
    verdict: 'essential',
    verdictNote: 'Turn this on by default. Almost everyone benefits.',
    href: 'https://claude.ai',
  },
  'extended-thinking': {
    id: 'extended-thinking',
    name: 'Extended Thinking',
    icon: '◐',
    what: 'Claude works through complex problems step-by-step before answering — shows its reasoning.',
    verdict: 'situational',
    verdictNote: 'Slower and uses more quota. Save it for decisions that deserve it.',
    href: 'https://claude.ai',
  },
  artifacts: {
    id: 'artifacts',
    name: 'Artifacts',
    icon: '◈',
    what: 'Outputs appear in a side panel as editable documents, code, or live previews — not just chat text.',
    verdict: 'essential',
    verdictNote: 'Automatic when relevant. No setup needed.',
    href: 'https://claude.ai',
  },
  research: {
    id: 'research',
    name: 'Research mode',
    icon: '◇',
    what: 'Claude breaks a question into sub-searches, runs them, and returns a structured report with sources.',
    verdict: 'worth-it',
    verdictNote: 'Takes minutes. Replaces hours of manual research.',
    href: 'https://claude.ai',
  },
  cowork: {
    id: 'cowork',
    name: 'Cowork',
    icon: '⬡',
    what: 'Invite colleagues into a live Claude session — everyone sees and prompts the same thread.',
    verdict: 'situational',
    verdictNote: 'Most Claude work is solo. Worth knowing for team sessions.',
    href: 'https://claude.ai',
  },
  'google-drive': {
    id: 'google-drive',
    name: 'Google Drive',
    icon: '▲',
    what: 'Claude reads your Docs, Sheets, and files by name — no downloading or copy-pasting.',
    verdict: 'essential',
    verdictNote: 'If your team runs on Google Workspace, set this up first.',
    docsHref: 'https://support.claude.ai/en/articles/10171873-connecting-google-drive',
    guideHref: '/articles/claude-plus-google-docs',
  },
  slack: {
    id: 'slack',
    name: 'Slack',
    icon: '◉',
    what: '@mention Claude in any channel or thread. It reads the context and responds without switching tools.',
    verdict: 'worth-it',
    verdictNote: 'High value for teams that live in Slack. Lower value if Slack is mostly social.',
    docsHref: 'https://support.claude.ai/en/articles/10171876-claude-for-slack',
    guideHref: '/articles/claude-plus-slack-for-teams',
  },
  notion: {
    id: 'notion',
    name: 'Notion',
    icon: '◻',
    what: 'Claude reads your pages, databases, and wiki — your internal knowledge base becomes queryable.',
    verdict: 'worth-it',
    verdictNote: "Worth it if Notion is genuinely your source of truth. Less so if it's full of outdated docs.",
    docsHref: 'https://support.claude.ai/en/articles/10172218-connecting-notion',
    guideHref: '/articles/claude-plus-notion',
  },
  jira: {
    id: 'jira',
    name: 'Jira',
    icon: '◆',
    what: 'Claude queries your issues, sprint status, and project data — release notes, blocker summaries, sprint reviews.',
    verdict: 'situational',
    verdictNote: 'High value for engineering managers and PMs. Overkill for individual task tracking.',
    docsHref: 'https://support.claude.ai/en/articles/10172220-connecting-jira',
    guideHref: '/articles/claude-plus-jira',
  },
  asana: {
    id: 'asana',
    name: 'Asana',
    icon: '◎',
    what: 'Claude helps write task descriptions, project briefs, status updates, and retrospectives from your Asana context.',
    verdict: 'worth-it',
    verdictNote: 'No native connector — works via copy-paste or Zapier. High value for teams drowning in task admin.',
    guideHref: '/articles/claude-plus-asana',
  },
  figma: {
    id: 'figma',
    name: 'Figma',
    icon: '◈',
    what: 'Claude writes UI copy, component docs, design specs for handoff, and design feedback write-ups.',
    verdict: 'worth-it',
    verdictNote: 'No live connection — screenshot-based or copy-paste. Eliminates the copy and documentation bottleneck in design workflows.',
    guideHref: '/articles/claude-plus-figma',
  },
  'excel-skill': {
    id: 'excel-skill',
    name: 'Excel skill',
    icon: '▦',
    what: 'Upload a spreadsheet — Claude cleans, restructures, adds formulas, and hands back a real .xlsx file.',
    verdict: 'essential',
    verdictNote: 'Lets Claude return actual .xlsx files instead of just describing changes — makes a real difference for spreadsheet-heavy work.',
    docsHref: 'https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview',
  },
  'word-skill': {
    id: 'word-skill',
    name: 'Word skill',
    icon: '◧',
    what: 'Claude produces .docx files with proper formatting — headings, tables, sections.',
    verdict: 'worth-it',
    verdictNote: 'Valuable for legal, HR, and ops work where Word is the standard deliverable.',
    docsHref: 'https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview',
  },
  'powerpoint-skill': {
    id: 'powerpoint-skill',
    name: 'PowerPoint skill',
    icon: '▷',
    what: 'Give Claude an outline or doc — it produces a structured .pptx you can open immediately.',
    verdict: 'worth-it',
    verdictNote: "Claude handles structure and content, not visual polish. That alone saves hours.",
    docsHref: 'https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview',
  },
  'pdf-skill': {
    id: 'pdf-skill',
    name: 'PDF skill',
    icon: '▤',
    what: 'Claude reads and extracts from PDFs — contracts, reports, scanned docs, complex layouts.',
    verdict: 'essential',
    verdictNote: 'Works automatically when you upload a PDF. No setup needed.',
    docsHref: 'https://platform.claude.com/docs/en/build-with-claude/pdf-support',
  },
  'github-plugin': {
    id: 'github-plugin',
    name: 'GitHub plugin',
    icon: '◉',
    what: 'Create issues, manage PRs, review code, search repos — all from your Claude Code session.',
    verdict: 'essential',
    verdictNote: 'The most-installed Claude Code plugin. Install this first.',
    href: 'https://claude.com/plugins',
  },
  'context7-plugin': {
    id: 'context7-plugin',
    name: 'Context7',
    icon: '◎',
    what: 'Pulls live, version-specific docs from source repos into Claude Code. Stops hallucinated API syntax.',
    verdict: 'worth-it',
    verdictNote: 'Essential when working with fast-moving libraries.',
    href: 'https://claude.com/plugins',
  },
  'playwright-plugin': {
    id: 'playwright-plugin',
    name: 'Playwright',
    icon: '▷',
    what: "Claude Code automates browsers, fills forms, takes screenshots, and writes end-to-end tests.",
    verdict: 'situational',
    verdictNote: 'Essential for frontend testing. Skip if you work purely on backend.',
    href: 'https://claude.com/plugins',
  },
  'frontend-design-plugin': {
    id: 'frontend-design-plugin',
    name: 'Frontend Design',
    icon: '◈',
    what: 'Claude renders and previews UI components live in a browser panel as it builds them.',
    verdict: 'worth-it',
    verdictNote: '450K+ installs. Turns Claude Code into a much more interactive design tool.',
    href: 'https://claude.com/plugins',
  },
  'code-review-plugin': {
    id: 'code-review-plugin',
    name: 'Code Review',
    icon: '◐',
    what: 'Structured code review — bugs, security issues, performance bottlenecks, with explanations.',
    verdict: 'worth-it',
    verdictNote: 'Especially valuable for solo developers without a team to review their code.',
    href: 'https://claude.com/plugins',
  },
  salesforce: {
    id: 'salesforce',
    name: 'Salesforce',
    icon: '◌',
    what: 'Claude writes account briefs, renewal narratives, and CRM notes from your Salesforce data.',
    verdict: 'worth-it',
    verdictNote: 'No native connector — works via copy-paste, Zapier, or MCP on Enterprise. High value for CS and sales.',
    guideHref: '/articles/claude-plus-salesforce',
  },
  confluence: {
    id: 'confluence',
    name: 'Confluence',
    icon: '◫',
    what: 'Claude reads your wiki for Q&A, and drafts runbooks, ADRs, and SOPs back into it.',
    verdict: 'worth-it',
    verdictNote: 'Native connector available. Turns your Confluence space into a queryable knowledge base.',
    guideHref: '/articles/claude-plus-confluence',
  },
}

const STACKS: Stack[] = [
  {
    role: 'ops',
    headline: 'The Ops & Admin Setup',
    outcome: 'Claude works from your actual files and remembers your processes — no re-explaining every session.',
    items: [
      { integrationId: 'projects', why: 'Load your SOPs, templates, and policies once. Claude applies them every time.' },
      { integrationId: 'google-drive', why: "Read any doc by name — no copy-pasting from Drive into the chat window." },
      { integrationId: 'asana', why: 'Turn rough task notes into properly scoped Asana briefs and generate weekly status updates from your project list.' },
      { integrationId: 'confluence', why: 'Draft runbooks, SOPs, and process docs — then query existing docs in plain language without navigating Confluence.' },
      { integrationId: 'excel-skill', why: 'Turn raw data exports into clean, formatted spreadsheets without manual work.' },
      { integrationId: 'word-skill', why: 'Produce policy docs, process guides, and templates as real Word files.' },
      { integrationId: 'pdf-skill', why: 'Extract from vendor contracts, reports, and forms without downloading anything.' },
    ],
    caveat: "Projects + Google Drive is the combination that delivers. Confluence is worth adding if your team documents processes there — the Q&A alone saves the constant 'where is the runbook for X' questions. The skills are high value if you regularly produce documents or work with spreadsheets.",
  },
  {
    role: 'marketing',
    headline: 'The Marketing Setup',
    outcome: 'Consistent brand voice, faster research, briefs that actually reflect current reality.',
    items: [
      { integrationId: 'projects', why: 'Load your brand guidelines, tone of voice, and style guide. Every output follows them automatically.' },
      { integrationId: 'web-search', why: 'Current competitor pricing, recent news, live data — no more stale training cutoff.' },
      { integrationId: 'google-drive', why: "Pull from briefs, decks, and past campaigns without leaving the chat." },
      { integrationId: 'figma', why: 'Write UI copy and section copy directly in Figma, and generate design specs for engineering handoff.' },
      { integrationId: 'research', why: 'Deep competitive research in minutes — market sizing, player breakdown, positioning analysis.' },
      { integrationId: 'powerpoint-skill', why: 'Turn a brief or outline into a structured deck you can actually open and edit.' },
    ],
    caveat: "The Projects + Web Search combination is the core. Figma is worth adding for teams where copy and design run in the same workflow. Research mode is genuinely useful for competitive work — use it for questions worth doing properly, not quick lookups.",
  },
  {
    role: 'cs',
    headline: 'The Customer Success Setup',
    outcome: 'Claude answers customer questions from your actual documentation — not from training data guesses.',
    items: [
      { integrationId: 'projects', why: 'Load your product docs, FAQ, and support playbooks. Claude answers from them, not from thin air.' },
      { integrationId: 'slack', why: '@mention Claude in any support thread. It reads the conversation and drafts a reply.' },
      { integrationId: 'salesforce', why: 'Account briefs, QBR narratives, and renewal risk summaries from your live Salesforce data.' },
      { integrationId: 'google-drive', why: 'Give Claude direct access to your knowledge base without manual copy-pasting.' },
      { integrationId: 'pdf-skill', why: 'Read and extract from customer contracts, onboarding docs, or support PDFs on the fly.' },
    ],
    caveat: "Projects is the foundation — load your product docs and FAQ and most CS work gets meaningfully faster. Slack is high value if your team lives there. Salesforce integration ranges from copy-paste to MCP depending on your setup; the guide covers all three approaches.",
  },
  {
    role: 'founder',
    headline: 'The Solo Founder Setup',
    outcome: 'A research and writing partner that knows your business and can access current information.',
    items: [
      { integrationId: 'projects', why: 'Your business context — pitch, positioning, competitors, decisions — always in scope.' },
      { integrationId: 'web-search', why: "Current market data, investor news, competitor moves — no knowledge cutoff." },
      { integrationId: 'research', why: 'Investor prep, competitive landscape, market sizing — structured reports in minutes.' },
      { integrationId: 'google-drive', why: 'Access pitch decks, investor memos, and working docs without switching context.' },
      { integrationId: 'extended-thinking', why: 'Strategic decisions with real tradeoffs — Claude works through them visibly before answering.' },
    ],
    caveat: "Projects + Web Search is the combination to start with. Research mode earns its keep for competitive and market research. Extended Thinking is a situational upgrade — use it when the decision is genuinely complex.",
  },
  {
    role: 'developer',
    headline: 'The Developer Setup',
    outcome: 'Claude Code becomes your full engineering environment — PRs, docs, testing, and code review in one session.',
    items: [
      { integrationId: 'github-plugin', why: 'Open PRs, manage issues, and review diffs without leaving your terminal.' },
      { integrationId: 'context7-plugin', why: "Live docs from source repos. Claude stops guessing at API signatures it doesn't know." },
      { integrationId: 'frontend-design-plugin', why: 'Live browser preview of UI components as Claude builds them — no manual run cycle.' },
      { integrationId: 'figma', why: 'Write component docs, UI copy, and design-to-engineering specs directly from screenshots.' },
      { integrationId: 'code-review-plugin', why: 'Structured review for security, performance, and edge cases — useful when working solo.' },
      { integrationId: 'playwright-plugin', why: 'Claude writes and runs end-to-end tests against your actual UI.' },
      { integrationId: 'jira', why: 'Pull sprint state, draft release notes, and summarize blockers from your actual Jira data.' },
      { integrationId: 'confluence', why: 'Query your engineering wiki in plain English, and write ADRs and runbooks back to it without leaving Claude Code.' },
    ],
    caveat: "GitHub + Context7 is the foundation. Figma is worth adding when you own the design-to-code handoff. The rest depends on your stack — Playwright only matters for frontend testing, Jira and Confluence only matter if you're managing a team or sprint.",
  },
]

const ROLE_TABS: { id: Role; label: string }[] = [
  { id: 'ops',       label: 'Ops & Admin' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'cs',        label: 'Customer Success' },
  { id: 'founder',   label: 'Founder' },
  { id: 'developer', label: 'Developer' },
]

const VERDICT_CONFIG: Record<Verdict, { label: string; color: string; bg: string }> = {
  'essential':   { label: 'Essential',   color: '#4CAF7D', bg: 'rgba(76,175,125,0.1)' },
  'worth-it':    { label: 'Worth it',    color: '#5B8DD9', bg: 'rgba(91,141,217,0.1)' },
  'situational': { label: 'Situational', color: '#D4A45A', bg: 'rgba(212,164,90,0.1)' },
}

export default function IntegrationsView() {
  const [activeRole, setActiveRole] = useState<Role>('ops')

  const stack = STACKS.find(s => s.role === activeRole)!

  return (
    <>
      {/* Philosophy callout */}
      <div style={{
        marginBottom: '40px', padding: '18px 22px',
        borderRadius: '10px', border: '1px solid var(--border-muted)',
        background: 'var(--bg-surface)',
        display: 'flex', gap: '14px', alignItems: 'flex-start',
      }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '16px', flexShrink: 0, marginTop: '1px' }}>◎</span>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.65, margin: 0 }}>
          We don't list every integration — Anthropic already does that.{' '}
          <a href="https://claude.com/plugins" target="_blank" rel="noopener noreferrer"
            style={{ color: 'var(--accent)', textDecoration: 'none' }}>
            Browse the full directory →
          </a>
          {' '}We tell you what to actually set up for your role, what order, and what's genuinely worth your time.
        </p>
      </div>

      {/* Role selector */}
      <div style={{ marginBottom: '40px' }}>
        <p style={{
          fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 500,
          letterSpacing: '0.06em', textTransform: 'uppercase' as const,
          color: 'var(--text-muted)', marginBottom: '10px',
        }}>
          What's your role?
        </p>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' as const }}>
          {ROLE_TABS.map(tab => {
            const isActive = tab.id === activeRole
            return (
              <button
                key={tab.id}
                onClick={() => setActiveRole(tab.id)}
                style={{
                  fontFamily: 'var(--font-sans)', fontSize: '13px',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                  background: isActive ? 'var(--bg-subtle)' : 'none',
                  border: '1px solid',
                  borderColor: isActive ? 'var(--border-base)' : 'var(--border-muted)',
                  borderRadius: '6px', padding: '7px 16px',
                  cursor: 'pointer', transition: 'all 0.15s ease',
                }}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Stack */}
      <div>
        {/* Stack headline + outcome */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{
            fontFamily: 'var(--font-serif)', fontSize: 'var(--text-2xl)',
            color: 'var(--text-primary)', fontWeight: 600,
            letterSpacing: '-0.01em', marginBottom: '10px',
          }}>
            {stack.headline}
          </h2>
          <p style={{
            fontFamily: 'var(--font-sans)', fontSize: '15px',
            color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0,
          }}>
            {stack.outcome}
          </p>
        </div>

        {/* Ordered integration list */}
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '10px', marginBottom: '28px' }}>
          {stack.items.map((item, idx) => {
            const integration = INTEGRATIONS[item.integrationId]
            if (!integration) return null
            const verdict = VERDICT_CONFIG[integration.verdict]

            return (
              <div key={item.integrationId} style={{
                display: 'flex', gap: '16px', alignItems: 'flex-start',
                padding: '20px', borderRadius: '10px',
                border: '1px solid var(--border-base)',
                background: 'var(--bg-surface)',
              }}>
                {/* Step number */}
                <div style={{
                  flexShrink: 0, width: '28px', height: '28px',
                  borderRadius: '50%', border: '1px solid var(--border-base)',
                  background: 'var(--bg-subtle)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 600,
                  color: 'var(--text-muted)',
                }}>
                  {idx + 1}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' as const }}>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {integration.icon} {integration.name}
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600,
                      color: verdict.color, background: verdict.bg,
                      padding: '2px 9px', borderRadius: '5px',
                    }}>
                      {verdict.label}
                    </span>
                  </div>

                  {/* What it does */}
                  <p style={{
                    fontFamily: 'var(--font-sans)', fontSize: '13px',
                    color: 'var(--text-muted)', lineHeight: 1.55, margin: '0 0 8px',
                  }}>
                    {integration.what}
                  </p>

                  {/* Why it belongs in this stack */}
                  <p style={{
                    fontFamily: 'var(--font-sans)', fontSize: '13px',
                    color: 'var(--text-secondary)', lineHeight: 1.55,
                    margin: '0 0 12px',
                    paddingLeft: '10px',
                    borderLeft: '2px solid var(--border-base)',
                  }}>
                    {item.why}
                  </p>

                  {/* Links */}
                  <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' as const }}>
                    {integration.guideHref && (
                      <a href={integration.guideHref}
                        style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>
                        Full guide →
                      </a>
                    )}
                    {integration.docsHref && (
                      <a href={integration.docsHref} target="_blank" rel="noopener noreferrer"
                        style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none' }}>
                        Docs →
                      </a>
                    )}
                    {integration.href && !integration.docsHref && (
                      <a href={integration.href} target="_blank" rel="noopener noreferrer"
                        style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none' }}>
                        Set it up →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Honest caveat */}
        {stack.caveat && (
          <div style={{
            padding: '16px 20px', borderRadius: '8px',
            border: '1px solid var(--border-muted)',
            background: 'var(--bg-subtle)',
            marginBottom: '16px',
          }}>
            <p style={{
              fontFamily: 'var(--font-sans)', fontSize: '13px',
              color: 'var(--text-muted)', lineHeight: 1.65,
              margin: 0, fontStyle: 'italic',
            }}>
              <span style={{ fontStyle: 'normal', fontWeight: 600, color: 'var(--text-secondary)' }}>Honest take: </span>
              {stack.caveat}
            </p>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .stack-item { flex-direction: column !important; }
        }
      `}</style>
    </>
  )
}
