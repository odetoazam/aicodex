'use client'

import { useState } from 'react'

type Org = 'Anthropic' | 'OpenAI' | 'Google' | 'Meta' | 'Microsoft' | 'Industry'

type Event = {
  date: string
  org: Org
  title: string
  description: string
  significance: 'major' | 'notable' | 'context'
  glossarySlug?: string
  href?: string
}

const EVENTS: Event[] = [
  // ── 2026 ──────────────────────────────────────────────────────────────
  {
    date: 'Apr 17, 2026',
    org: 'Anthropic',
    title: 'Claude Design — visuals, prototypes, and decks from conversation',
    description: 'Anthropic launches Claude Design, an experimental product for creating visual work: prototypes, presentation decks, one-pagers, and UI mockups. Built on Opus 4.7. Users describe what they need, Claude builds a first version, then they refine through conversation or inline edits. Reads a team\'s design system and codebase for brand consistency. Exports to PDF, URL, PPTX, or Canva. Available to Pro, Max, Team, and Enterprise subscribers.',
    significance: 'major',
    href: 'https://techcrunch.com/2026/04/17/anthropic-launches-claude-design-a-new-product-for-creating-quick-visuals/',
  },
  {
    date: 'Apr 16, 2026',
    org: 'Anthropic',
    title: 'Claude Opus 4.7 — sharper vision, better coding, self-verification',
    description: 'Opus 4.7 upgrades the flagship model with improved agentic coding, multidisciplinary reasoning, scaled tool use, and computer use. New xhigh effort level gives finer latency vs. reasoning control. Maximum image resolution jumps from 1.15MP to 3.75MP (3.3× increase). Pricing unchanged at $5/$25 per million tokens. Available across Claude products, API, Bedrock, Vertex AI, and Microsoft Foundry.',
    significance: 'major',
    href: 'https://www.anthropic.com/news/claude-opus-4-7',
  },
  {
    date: 'Apr 16, 2026',
    org: 'Meta',
    title: 'Muse Spark Shopping — AI-native commerce across Meta apps',
    description: 'Meta embeds a shopping experience directly into Muse Spark, rolling out across WhatsApp, Instagram, Facebook, and Messenger. Users get outfit suggestions, room styling help, and gift recommendations in-conversation. First major commerce integration built on a foundation model rather than a separate product layer — a template for how AI interfaces could replace traditional e-commerce flows.',
    significance: 'notable',
    href: 'https://www.retailbrew.com/stories/2026/04/16/meta-introduces-new-shopping-upgrades-under-ai-model-muse-spark',
  },
  {
    date: 'Apr 14, 2026',
    org: 'OpenAI',
    title: 'GPT-5.4-Cyber — security-focused model with tiered access',
    description: 'OpenAI releases GPT-5.4-Cyber to vetted researchers and security teams, with access tiers that loosen restrictions for verified practitioners doing defensive research. Designed for threat modeling, vulnerability analysis, and exploit documentation — with guardrails calibrated by verification level rather than a single policy. Released in direct response to Anthropic\'s Mythos Preview from Project Glasswing.',
    significance: 'notable',
    href: 'https://www.bloomberg.com/news/articles/2026-04-14/openai-releases-cyber-model-to-limited-group-in-race-with-mythos',
  },
  {
    date: 'Apr 10, 2026',
    org: 'Anthropic',
    title: 'Claude for Word — native sidebar in Microsoft Word',
    description: 'Claude launches as a native sidebar add-in for Microsoft Word on Mac and Windows. Highlights passages, rewrites sections, and inserts edits as tracked changes using Word\'s existing review workflow. Completes Claude\'s integration across the full Office suite (Excel, PowerPoint, Word). Available to Team and Enterprise plans.',
    significance: 'notable',
    href: 'https://www.thurrott.com/a-i/334834/anthropic-launches-claude-for-word-in-beta',
  },
  {
    date: 'Apr 10, 2026',
    org: 'Anthropic',
    title: 'Ultraplan — cloud-powered planning for Claude Code',
    description: 'Claude Code gains Ultraplan: a cloud-powered planning mode that uses Claude on the web to generate comprehensive implementation plans before coding begins. Designed for complex, multi-file tasks where getting the architecture right up front saves hours of rework.',
    significance: 'notable',
    href: 'https://code.claude.com/docs/en/ultraplan',
  },
  {
    date: 'Apr 9, 2026',
    org: 'Anthropic',
    title: 'Advisor strategy — Opus intelligence at Sonnet prices',
    description: 'Anthropic introduces the advisor tool: pair a fast executor model (Sonnet or Haiku) with Opus as a strategic advisor that only gets called on hard decisions. Sonnet + Opus advisor improved SWE-bench Multilingual by 2.7 percentage points while cutting per-task cost by 11.9%. A new paradigm for cost-effective agent intelligence.',
    significance: 'notable',
    href: 'https://claude.com/blog/the-advisor-strategy',
  },
  {
    date: 'Apr 9, 2026',
    org: 'Anthropic',
    title: 'Claude Cowork generally available — enterprise-ready',
    description: 'Cowork goes GA on macOS and Windows with Analytics API access, OpenTelemetry monitoring, and role-based access controls for enterprise departments. The shift from collaborative experiment to production-grade team workspace.',
    significance: 'notable',
    href: 'https://claude.com/blog/cowork-for-enterprise',
  },
  {
    date: 'Apr 9, 2026',
    org: 'Anthropic',
    title: 'Monitor tool — background streaming in Claude Code',
    description: 'Claude Code gains the Monitor tool: spawn a background process and stream its stdout into the conversation without blocking the thread. Enables patterns like "watch kubectl logs for errors and fix any crashes" — a step toward always-on agent awareness.',
    significance: 'notable',
    href: 'https://code.claude.com/docs/en/changelog',
  },
  {
    date: 'Apr 8, 2026',
    org: 'Meta',
    title: 'Muse Spark — Meta\'s first proprietary model',
    description: 'Meta launches Muse Spark, its first proprietary (non-open-source) model, developed by Meta Superintelligence Labs. Small and fast, competitive on reasoning and agentic tasks. Signals a strategic shift: Meta now has both open (Llama) and closed model lines.',
    significance: 'notable',
  },
  {
    date: 'Apr 8, 2026',
    org: 'Anthropic',
    title: 'Claude Managed Agents — autonomous agents via API',
    description: "Anthropic launches Managed Agents in public beta: a fully managed harness for running Claude as an autonomous agent with secure sandboxing, built-in tools, and streaming. Create agents, configure containers, and run sessions entirely through the API. The biggest shift from Claude-as-assistant to Claude-as-worker.",
    significance: 'major',
    glossarySlug: 'managed-agents',
    href: 'https://platform.claude.com/docs/en/managed-agents/overview',
  },
  {
    date: 'Apr 7, 2026',
    org: 'Anthropic',
    title: 'Project Glasswing — defensive cybersecurity coalition',
    description: 'Anthropic announces Project Glasswing alongside AWS, Apple, Google, Microsoft, NVIDIA, and others to secure critical software infrastructure. Claude Mythos Preview — a specialized cybersecurity model — available as a gated research preview for defensive work.',
    significance: 'notable',
    href: 'https://anthropic.com/glasswing',
  },
  {
    date: 'Apr 7, 2026',
    org: 'Google',
    title: 'AI Edge Eloquent — offline-first AI dictation for iOS',
    description: 'Google quietly ships AI Edge Eloquent, an on-device dictation app for iOS using Gemma-based speech recognition models. Works fully offline; optional Gemini cloud integration for post-processing. Signals Google\'s push into private, on-device AI — where inference stays on the hardware rather than hitting a remote API.',
    significance: 'notable',
    href: 'https://techcrunch.com/2026/04/07/google-quietly-releases-an-offline-first-ai-dictation-app-on-ios/',
  },
  {
    date: 'Apr 2, 2026',
    org: 'Google',
    title: 'Gemma 4 — natively multimodal open model family',
    description: 'Google releases Gemma 4, an open model family from 2.3B to 31B parameters that is natively multimodal (text, image, video). The 31B Dense variant ranks #3 globally among open models. A major leap in what open-weights models can do.',
    significance: 'notable',
  },
  {
    date: 'Apr 2, 2026',
    org: 'Microsoft',
    title: 'MAI-Transcribe-1, MAI-Voice-1, MAI-Image-2 — three in-house models',
    description: 'Microsoft announces three new proprietary MAI foundation models available in Azure AI Foundry: MAI-Transcribe-1 (state-of-the-art multilingual speech recognition), MAI-Voice-1 (custom voice synthesis), and MAI-Image-2 (top Arena.ai leaderboard scores, 2× faster generation). First clear signal that Microsoft is building its own model stack alongside its OpenAI and Anthropic partnerships.',
    significance: 'notable',
    href: 'https://techcrunch.com/2026/04/02/microsoft-takes-on-ai-rivals-with-three-new-foundational-models/',
  },
  {
    date: 'Mar 13, 2026',
    org: 'Anthropic',
    title: '1M token context window — generally available',
    description: 'The 1M token context window is now GA for Claude Opus 4.6 and Sonnet 4.6 at standard pricing — no beta header required. Requests over 200k tokens work automatically. Also raised the media limit from 100 to 600 images or PDF pages per request.',
    significance: 'notable',
    href: 'https://platform.claude.com/docs/en/build-with-claude/context-windows',
  },
  {
    date: 'Mar 12, 2026',
    org: 'Anthropic',
    title: 'Claude Partner Network — $100M enterprise adoption push',
    description: 'Anthropic launches the Claude Partner Network with $100M invested to accelerate enterprise adoption. Targets system integrators, consultants, and implementation partners helping organizations deploy Claude at scale.',
    significance: 'notable',
    href: 'https://www.anthropic.com/news/claude-partner-network',
  },
  {
    date: 'Feb 17, 2026',
    org: 'Anthropic',
    title: 'Claude Sonnet 4.6 — frontier performance at everyday speed',
    description: 'Sonnet 4.6 launches as the balanced model for professional work at scale — improved agentic search, fewer tokens consumed, extended thinking support, and 1M token context window. Web search and code execution tools hit general availability on the same day.',
    significance: 'major',
    href: 'https://www.anthropic.com/news/claude-sonnet-4-6',
  },
  {
    date: 'Feb 12, 2026',
    org: 'Anthropic',
    title: 'Series G — $30 billion at $380B valuation',
    description: "Anthropic raises $30B in Series G funding at a $380B post-money valuation, with $14B annual run-rate revenue. One of the most valuable private companies in history. Signals market conviction that frontier AI will be defining infrastructure.",
    significance: 'context',
    href: 'https://www.anthropic.com/news',
  },
  {
    date: 'Feb 5, 2026',
    org: 'Anthropic',
    title: 'Claude Opus 4.6 — flagship for long-horizon agents',
    description: "Opus 4.6 launches for complex, long-horizon agentic tasks. Introduces adaptive thinking (replacing manual budget_tokens), the compaction API for effectively infinite conversations, and data residency controls. Fast mode — up to 2.5x faster — available in preview.",
    significance: 'major',
    href: 'https://www.anthropic.com/news/claude-opus-4-6',
  },
  {
    date: 'Jan 13, 2026',
    org: 'Anthropic',
    title: 'Claude Labs — experimental features platform',
    description: 'Anthropic launches Labs, a platform for experimental Claude features before they reach the main product. First move toward a formal beta program for early access to capabilities in development.',
    significance: 'notable',
    href: 'https://www.anthropic.com/news',
  },
  {
    date: 'Jan 11, 2026',
    org: 'Anthropic',
    title: 'Claude for Healthcare & Life Sciences — HIPAA-ready',
    description: 'Anthropic launches HIPAA-ready infrastructure with clinical trial connectors for healthcare and life sciences. Opens Claude to regulated industries that previously had compliance blockers.',
    significance: 'notable',
    href: 'https://www.anthropic.com/news',
  },
  {
    date: 'Jan 5, 2026',
    org: 'Microsoft',
    title: 'Copilot for M365 — broad enterprise rollout',
    description: 'Microsoft Copilot reaches general availability across M365 enterprise. AI embedded in Word, Excel, PowerPoint, Outlook, and Teams. Forces the question: if Copilot is good enough for document work, what does Claude add?',
    significance: 'notable',
  },
  // ── 2025 ──────────────────────────────────────────────────────────────
  {
    date: 'Dec 9, 2025',
    org: 'Anthropic',
    title: 'MCP donated to the Agentic AI Foundation',
    description: 'Anthropic donates the Model Context Protocol to the newly formed Agentic AI Foundation, cementing MCP as an open industry standard. Adopted by dozens of companies since its release, MCP becomes a neutral, community-governed protocol.',
    significance: 'notable',
    glossarySlug: 'mcp',
    href: 'https://www.anthropic.com/news',
  },
  {
    date: 'Dec 1, 2025',
    org: 'Anthropic',
    title: 'Claude.ai Cowork — shared workspaces for teams',
    description: 'Real-time collaborative sessions in Claude — multiple users working in the same conversation. Foundation for team-based AI workflows.',
    significance: 'notable',
    glossarySlug: 'cowork',
  },
  {
    date: 'Nov 24, 2025',
    org: 'Anthropic',
    title: 'Claude Opus 4.5 — step-change in vision and coding',
    description: 'Opus 4.5 launches as the most capable Claude model yet — step-change improvements in vision, coding, and computer use at a more accessible price than previous Opus models. Best model for complex specialized tasks and professional software engineering.',
    significance: 'major',
    href: 'https://www.anthropic.com/news/claude-opus-4-5',
  },
  {
    date: 'Nov 18, 2025',
    org: 'Anthropic',
    title: 'Claude in Microsoft Foundry — Azure integration',
    description: 'Claude models come to Azure customers through Microsoft Foundry with Azure billing and OAuth authentication. Full Messages API access including extended thinking, prompt caching, PDF support, and Agent Skills.',
    significance: 'notable',
    href: 'https://platform.claude.com/docs/en/build-with-claude/claude-in-microsoft-foundry',
  },
  {
    date: 'Nov 7, 2024',
    org: 'Anthropic',
    title: 'Model Context Protocol (MCP) — open standard for tool connections',
    description: 'Anthropic releases MCP as an open protocol for connecting AI models to external tools and data sources. Other companies adopt it quickly, making MCP a de-facto standard. The shift from proprietary to standardized AI integrations.',
    significance: 'major',
    glossarySlug: 'mcp',
    href: 'https://www.anthropic.com/news/model-context-protocol',
  },
  {
    date: 'Oct 28, 2025',
    org: 'OpenAI',
    title: 'ChatGPT canvas + memory by default',
    description: 'OpenAI ships long-term memory as a default ChatGPT feature, and launches canvas — a structured writing and code workspace. Accelerates the shift from chatbot to persistent AI workspace.',
    significance: 'notable',
  },
  {
    date: 'Oct 16, 2025',
    org: 'Anthropic',
    title: 'Agent Skills — Claude works with Office files natively',
    description: 'Agent Skills launch in beta: pre-built Skills for PowerPoint, Excel, Word, and PDF files. Also supports custom Skills where you package your own domain expertise. Claude can now read and write Office documents without manual parsing — a major unlock for enterprise workflows.',
    significance: 'major',
    href: 'https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview',
  },
  {
    date: 'Oct 15, 2025',
    org: 'Anthropic',
    title: 'Claude Haiku 4.5 — fastest model with near-frontier intelligence',
    description: 'Haiku 4.5 launches as the fastest and most capable Haiku yet — near-frontier performance for real-time applications, high-volume processing, and cost-sensitive deployments where speed matters more than maximum intelligence.',
    significance: 'notable',
    href: 'https://www.anthropic.com/news/claude-haiku-4-5',
  },
  {
    date: 'Sep 29, 2025',
    org: 'Anthropic',
    title: 'Claude Sonnet 4.5 — built for complex agents and coding',
    description: 'Sonnet 4.5 launches with the highest intelligence of any Sonnet, built for complex agent workflows and coding tasks. Also ships: the memory tool (persistent context across conversations) and context editing for automatic conversation management.',
    significance: 'major',
    href: 'https://www.anthropic.com/news/claude-sonnet-4-5',
  },
  {
    date: 'Sep 10, 2025',
    org: 'Anthropic',
    title: 'Web fetch tool — Claude reads any webpage',
    description: 'Web fetch tool launches in beta, letting Claude retrieve full content from any web page or PDF by URL. Pairs with web search for end-to-end research tasks.',
    significance: 'notable',
    href: 'https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-fetch-tool',
  },
  {
    date: 'Jun 12, 2025',
    org: 'Anthropic',
    title: 'Claude Code — agentic development in the terminal',
    description: 'Claude Code launches as a terminal-native development experience: reads codebases, runs commands, writes and edits files, and navigates full projects. Goes further than autocomplete into agentic development.',
    significance: 'major',
    glossarySlug: 'claude-code',
    href: 'https://claude.ai/code',
  },
  {
    date: 'May 22, 2025',
    org: 'Anthropic',
    title: 'Claude Opus 4 + Sonnet 4 — the Claude 4 family launches',
    description: 'Anthropic ships the first Claude 4 models: Opus 4 for frontier tasks and Sonnet 4 for everyday use, both with extended thinking. Also ships: Files API, Code Execution tool, and MCP connector in the API. A step-change in what Claude can do in production.',
    significance: 'major',
    href: 'http://www.anthropic.com/news/claude-4',
  },
  {
    date: 'May 7, 2025',
    org: 'Anthropic',
    title: 'Web search — Claude accesses the live internet',
    description: 'Web search launches in the API, giving Claude access to up-to-date information. Closes the biggest gap between Claude and web-native AI products.',
    significance: 'notable',
    href: 'https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool',
  },
  {
    date: 'May 5, 2025',
    org: 'OpenAI',
    title: 'GPT-4o — natively multimodal with real-time voice',
    description: 'GPT-4o ships as a single model handling voice, image, and text without switching modes. Real-time voice with sub-second latency. Brings the conversational AI interaction model much closer to reality.',
    significance: 'major',
  },
  {
    date: 'Apr 9, 2025',
    org: 'Meta',
    title: 'LLaMA 4 — frontier open-weights model',
    description: 'Meta releases LLaMA 4 with performance competitive with GPT-4-class models. Largest open-weights release to date. Reinforces that the gap between open-source and proprietary is closing faster than expected.',
    significance: 'notable',
    glossarySlug: 'meta-llama',
  },
  {
    date: 'Feb 24, 2025',
    org: 'Anthropic',
    title: 'Claude Sonnet 3.7 — extended thinking in production',
    description: "Claude Sonnet 3.7 ships as the first Claude model with extended thinking built in — a mode where Claude reasons step-by-step before answering. Near-instant responses or visible thinking, one model. Anthropic's first mainstream reasoning model.",
    significance: 'major',
    glossarySlug: 'extended-thinking',
    href: 'http://www.anthropic.com/news/claude-3-7-sonnet',
  },
  {
    date: 'Feb 6, 2025',
    org: 'Industry',
    title: 'Agentic AI enters mainstream product conversation',
    description: 'The term "AI agents" crosses from research into mainstream product discussion. Every major AI lab ships or announces agentic products. The question shifts from "can AI do this?" to "how do you orchestrate AI to do this reliably?"',
    significance: 'context',
    glossarySlug: 'ai-agent',
  },
  {
    date: 'Jan 23, 2025',
    org: 'Anthropic',
    title: 'Citations API — source attribution for document work',
    description: 'Claude gains the ability to cite its sources when answering from documents — pointing to the exact passage it drew from. Major unlock for trust in enterprise document workflows and RAG applications.',
    significance: 'notable',
    href: 'https://platform.claude.com/docs/en/build-with-claude/citations',
  },
  {
    date: 'Jan 12, 2025',
    org: 'Google',
    title: 'Gemini Advanced with Deep Research',
    description: 'Google ships Deep Research in Gemini Advanced — a mode that autonomously researches a topic across the web over several minutes and returns a structured report. First mainstream implementation of a multi-step research agent.',
    significance: 'notable',
  },
  // ── 2024 ──────────────────────────────────────────────────────────────
  {
    date: 'Dec 17, 2024',
    org: 'Anthropic',
    title: 'Batches, Token Counting, Prompt Caching — all go GA',
    description: 'Anthropic moves several API features to general availability: Message Batches API (50% cost reduction on batch jobs), Token Counting API, Prompt Caching (90% cost reduction), and PDF support. Also ships Go and Java SDKs.',
    significance: 'notable',
    href: 'https://platform.claude.com/docs/en/build-with-claude/batch-processing',
  },
  {
    date: 'Nov 4, 2024',
    org: 'Anthropic',
    title: 'Claude Haiku 3.5 — fast, affordable, upgraded',
    description: 'Claude Haiku 3.5 launches as a fast, cost-efficient model for real-time applications and high-volume tasks. Better than Haiku 3 at a similar price point.',
    significance: 'notable',
    href: 'https://www.anthropic.com/claude/haiku',
  },
  {
    date: 'Oct 22, 2024',
    org: 'Anthropic',
    title: 'Computer Use — Claude controls a desktop',
    description: 'Anthropic ships Computer Use in public beta: Claude can move a mouse, click, type, and navigate GUI applications. First mainstream API for AI-controlled computer interaction. Sets the foundation for desktop-level automation.',
    significance: 'major',
    href: 'https://www.anthropic.com/news/developing-computer-use',
  },
  {
    date: 'Sep 12, 2024',
    org: 'OpenAI',
    title: 'o1 — reasoning model with explicit chain-of-thought',
    description: 'OpenAI releases o1, a model that reasons explicitly before answering. Significantly outperforms GPT-4 on math and science benchmarks. Introduces "reasoning model" as a distinct category from "chat model."',
    significance: 'major',
    glossarySlug: 'chain-of-thought-prompting',
  },
  {
    date: 'Sep 10, 2024',
    org: 'Anthropic',
    title: 'Console Workspaces — project-level API management',
    description: 'Workspaces launch in the Developer Console: custom spend limits, grouped API keys, usage tracking by project, and user roles. First real admin layer for teams using the Claude API.',
    significance: 'notable',
    href: 'https://www.anthropic.com/news/workspaces',
  },
  {
    date: 'Aug 14, 2024',
    org: 'Anthropic',
    title: 'Prompt Caching — 90% cost reduction on repeated context',
    description: 'Prompt caching launches in beta: cache and reuse prompt content to reduce costs by up to 90% and latency by up to 80%. Major cost unlock for applications using the same system prompt or documents repeatedly.',
    significance: 'notable',
    glossarySlug: 'prompt-caching',
    href: 'https://www.anthropic.com/news/prompt-caching',
  },
  {
    date: 'Jun 20, 2024',
    org: 'Anthropic',
    title: 'Claude Sonnet 3.5 + Artifacts — a new interaction model',
    description: 'Claude Sonnet 3.5 launches with benchmark-leading coding performance. Artifacts ship alongside: a side-panel for code, documents, and interactive outputs. The shift from text responses to living, editable artifacts.',
    significance: 'major',
    glossarySlug: 'claude-artifacts',
    href: 'http://anthropic.com/news/claude-3-5-sonnet',
  },
  {
    date: 'Mar 4, 2024',
    org: 'Anthropic',
    title: 'Claude 3 family — Haiku, Sonnet, Opus',
    description: 'Anthropic ships the Claude 3 model family: three tiers for speed vs. capability tradeoffs. Opus leads on benchmarks. Haiku enables real-time, cost-efficient use cases. Establishes the tiered naming convention still in use today.',
    significance: 'major',
    href: 'https://www.anthropic.com/news/claude-3-family',
  },
  {
    date: 'Feb 8, 2024',
    org: 'Google',
    title: 'Gemini 1.0 Ultra — Google\'s frontier model',
    description: 'Google rebrands Bard to Gemini and ships the Ultra tier. Natively multimodal from architecture rather than retrofit. Signals Google\'s intent to compete directly with GPT-4 and Claude at the frontier.',
    significance: 'notable',
    glossarySlug: 'google-gemini',
  },
  // ── 2023 ──────────────────────────────────────────────────────────────
  {
    date: 'Mar 14, 2023',
    org: 'Anthropic',
    title: 'Claude 1 — Constitutional AI in production',
    description: 'Anthropic ships the first public Claude, trained using Constitutional AI — aligning model behavior using a set of principles rather than purely human feedback. First major alternative to GPT at capability scale.',
    significance: 'major',
    glossarySlug: 'constitutional-ai',
    href: 'https://www.anthropic.com/news/claude-1',
  },
  {
    date: 'Mar 14, 2023',
    org: 'OpenAI',
    title: 'GPT-4 — multimodal, significantly improved reasoning',
    description: 'GPT-4 launches with vision capabilities and measurably better reasoning than GPT-3.5. Triggers the "AI moment" for enterprise adoption.',
    significance: 'major',
  },
  // ── 2022 ──────────────────────────────────────────────────────────────
  {
    date: 'Nov 30, 2022',
    org: 'OpenAI',
    title: 'ChatGPT — the moment AI went mainstream',
    description: 'ChatGPT launches and reaches 100 million users in two months — the fastest consumer product adoption in history. Not the most capable model at the time, but the one that made AI accessible to everyone. Everything since has been a response to this moment.',
    significance: 'major',
    glossarySlug: 'large-language-model',
    href: 'https://openai.com/blog/chatgpt',
  },
]

const ORG_COLORS: Record<Org, string> = {
  Anthropic: '#D4845A',
  OpenAI:    '#10A37F',
  Google:    '#4285F4',
  Meta:      '#0467DF',
  Microsoft: '#00A4EF',
  Industry:  '#7B8FD4',
}

const SIGNIFICANCE_LABEL: Record<Event['significance'], string> = {
  major:   'Major launch',
  notable: 'Notable',
  context: 'Context',
}

const ALL_ORGS: Org[] = ['Anthropic', 'OpenAI', 'Google', 'Meta', 'Microsoft', 'Industry']

export default function TimelineView() {
  const [activeOrg, setActiveOrg] = useState<Org | 'All'>('All')

  const filtered = activeOrg === 'All' ? EVENTS : EVENTS.filter(e => e.org === activeOrg)

  // Group by year
  const byYear: Record<string, Event[]> = {}
  filtered.forEach(e => {
    const year = e.date.split(' ').at(-1)!
    if (!byYear[year]) byYear[year] = []
    byYear[year].push(e)
  })

  return (
    <>
      {/* Org filter */}
      <div style={{ marginBottom: '48px' }}>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' as const, borderBottom: '1px solid var(--border-muted)', paddingBottom: '1px', marginBottom: '12px' }}>
          {(['All', ...ALL_ORGS] as (Org | 'All')[]).map(org => {
            const isActive = org === activeOrg
            const color = org === 'All' ? 'var(--text-muted)' : ORG_COLORS[org as Org]
            return (
              <button
                key={org}
                onClick={() => setActiveOrg(org)}
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '13px',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? (org === 'All' ? 'var(--text-primary)' : color) : 'var(--text-muted)',
                  background: 'none',
                  border: 'none',
                  borderBottom: isActive ? `2px solid ${org === 'All' ? 'var(--accent)' : color}` : '2px solid transparent',
                  marginBottom: '-1px',
                  padding: '8px 12px',
                  cursor: 'pointer',
                  transition: 'color 0.15s, border-color 0.15s',
                }}
              >
                {org}
              </button>
            )
          })}
        </div>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)' }}>
          {filtered.length} events{activeOrg !== 'All' ? ` · ${activeOrg} only` : ''}
        </p>
      </div>

      {/* Timeline by year — newest first */}
      {Object.entries(byYear).sort(([a], [b]) => Number(b) - Number(a)).map(([year, events]) => (
        <div key={year} style={{ marginBottom: '56px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-xl)', fontWeight: 600, color: 'var(--text-primary)' }}>
              {year}
            </span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-base)' }} />
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute', left: '19px', top: '24px', bottom: '24px',
              width: '1px', background: 'var(--border-muted)',
            }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {events.map((event, i) => {
                const orgColor = ORG_COLORS[event.org]
                return (
                  <div key={i} style={{ paddingLeft: '52px', paddingBottom: i === events.length - 1 ? '0' : '4px' }}>
                    <div style={{
                      position: 'relative',
                      padding: '18px 22px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-base)',
                      background: 'var(--bg-surface)',
                      borderLeft: event.significance === 'major' ? `3px solid ${orgColor}` : '1px solid var(--border-base)',
                      opacity: event.significance === 'context' ? 0.75 : 1,
                    }}>
                      {/* Dot */}
                      <div style={{
                        position: 'absolute',
                        left: event.significance === 'major' ? '-34px' : '-32px',
                        top: '20px',
                        width: event.significance === 'major' ? '12px' : '8px',
                        height: event.significance === 'major' ? '12px' : '8px',
                        borderRadius: '50%',
                        background: orgColor,
                        border: '2px solid var(--bg-base)',
                      }} />

                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' as const }}>
                          <span style={{
                            padding: '2px 8px', borderRadius: '4px',
                            fontSize: '11px', fontWeight: 600,
                            fontFamily: 'var(--font-sans)',
                            color: orgColor, background: `${orgColor}15`,
                            whiteSpace: 'nowrap' as const,
                          }}>
                            {event.org}
                          </span>
                          {event.significance === 'major' && (
                            <span style={{
                              padding: '2px 8px', borderRadius: '4px',
                              fontSize: '10px', fontWeight: 500,
                              fontFamily: 'var(--font-sans)',
                              color: 'var(--text-muted)', background: 'var(--bg-subtle)',
                              border: '1px solid var(--border-muted)',
                              textTransform: 'uppercase' as const, letterSpacing: '0.04em',
                            }}>
                              {SIGNIFICANCE_LABEL[event.significance]}
                            </span>
                          )}
                          <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-primary)', margin: 0, lineHeight: 1.3 }}>
                            {event.title}
                          </p>
                        </div>
                        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-muted)', flexShrink: 0, paddingTop: '2px', whiteSpace: 'nowrap' as const }}>
                          {event.date}
                        </span>
                      </div>

                      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                        {event.description}
                      </p>

                      {(event.href || event.glossarySlug) && (
                        <div style={{ marginTop: '10px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                          {event.href && (
                            <a href={event.href} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--accent)', textDecoration: 'none' }}>
                              Read announcement →
                            </a>
                          )}
                          {event.glossarySlug && (
                            <a href={`/glossary/${event.glossarySlug}`} style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--text-muted)', textDecoration: 'none' }}>
                              Glossary entry →
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      ))}

      {/* Footer note */}
      <div style={{ padding: '24px 28px', borderRadius: '10px', border: '1px solid var(--border-muted)', background: 'var(--bg-surface)' }}>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
          This timeline covers launches relevant to operators, founders, and teams building with AI — not an exhaustive record of every model release or research paper. Focus is on things that changed what was practically possible. Updated as things ship.
        </p>
      </div>
    </>
  )
}
