/**
 * Seed timeline_events table from the original hardcoded EVENTS array.
 * Run: npx tsx scripts/seed-timeline.ts
 */
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.join(__dirname, '../.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const EVENTS = [
  // 2026
  { event_date: '2026-04-17', org: 'Anthropic', title: 'Claude Design — visuals, prototypes, and decks from conversation', description: "Anthropic launches Claude Design, an experimental product for creating visual work: prototypes, presentation decks, one-pagers, and UI mockups. Built on Opus 4.7. Users describe what they need, Claude builds a first version, then they refine through conversation or inline edits. Reads a team's design system and codebase for brand consistency. Exports to PDF, URL, PPTX, or Canva. Available to Pro, Max, Team, and Enterprise subscribers.", significance: 'major', href: 'https://techcrunch.com/2026/04/17/anthropic-launches-claude-design-a-new-product-for-creating-quick-visuals/', audience: ['for-you'] },
  { event_date: '2026-04-16', org: 'Anthropic', title: 'Claude Opus 4.7 — sharper vision, better coding, self-verification', description: 'Opus 4.7 upgrades the flagship model with improved agentic coding, multidisciplinary reasoning, scaled tool use, and computer use. New xhigh effort level gives finer latency vs. reasoning control. Maximum image resolution jumps from 1.15MP to 3.75MP (3.3× increase). Pricing unchanged at $5/$25 per million tokens. Available across Claude products, API, Bedrock, Vertex AI, and Microsoft Foundry.', significance: 'major', href: 'https://www.anthropic.com/news/claude-opus-4-7', article_slug: 'claude-opus-4-7', audience: ['for-you', 'for-builders'] },
  { event_date: '2026-04-16', org: 'Meta', title: 'Muse Spark Shopping — AI-native commerce across Meta apps', description: "Meta embeds a shopping experience directly into Muse Spark, rolling out across WhatsApp, Instagram, Facebook, and Messenger. Users get outfit suggestions, room styling help, and gift recommendations in-conversation. First major commerce integration built on a foundation model rather than a separate product layer — a template for how AI interfaces could replace traditional e-commerce flows.", significance: 'notable', href: 'https://www.retailbrew.com/stories/2026/04/16/meta-introduces-new-shopping-upgrades-under-ai-model-muse-spark' },
  { event_date: '2026-04-14', org: 'OpenAI', title: 'GPT-5.4-Cyber — security-focused model with tiered access', description: "OpenAI releases GPT-5.4-Cyber to vetted researchers and security teams, with access tiers that loosen restrictions for verified practitioners doing defensive research. Designed for threat modeling, vulnerability analysis, and exploit documentation — with guardrails calibrated by verification level rather than a single policy. Released in direct response to Anthropic's Mythos Preview from Project Glasswing.", significance: 'notable', href: 'https://www.bloomberg.com/news/articles/2026-04-14/openai-releases-cyber-model-to-limited-group-in-race-with-mythos' },
  { event_date: '2026-04-10', org: 'Anthropic', title: 'Claude for Word — native sidebar in Microsoft Word', description: "Claude launches as a native sidebar add-in for Microsoft Word on Mac and Windows. Highlights passages, rewrites sections, and inserts edits as tracked changes using Word's existing review workflow. Completes Claude's integration across the full Office suite (Excel, PowerPoint, Word). Available to Team and Enterprise plans.", significance: 'notable', href: 'https://www.thurrott.com/a-i/334834/anthropic-launches-claude-for-word-in-beta', audience: ['for-you', 'for-admins'] },
  { event_date: '2026-04-10', org: 'Anthropic', title: 'Ultraplan — cloud-powered planning for Claude Code', description: 'Claude Code gains Ultraplan: a cloud-powered planning mode that uses Claude on the web to generate comprehensive implementation plans before coding begins. Designed for complex, multi-file tasks where getting the architecture right up front saves hours of rework.', significance: 'notable', href: 'https://code.claude.com/docs/en/ultraplan', audience: ['for-builders'] },
  { event_date: '2026-04-09', org: 'Anthropic', title: 'Advisor strategy — Opus intelligence at Sonnet prices', description: 'Anthropic introduces the advisor tool: pair a fast executor model (Sonnet or Haiku) with Opus as a strategic advisor that only gets called on hard decisions. Sonnet + Opus advisor improved SWE-bench Multilingual by 2.7 percentage points while cutting per-task cost by 11.9%. A new paradigm for cost-effective agent intelligence.', significance: 'notable', href: 'https://claude.com/blog/the-advisor-strategy', audience: ['for-builders'] },
  { event_date: '2026-04-09', org: 'Anthropic', title: 'Ask Your Org — org-wide knowledge search across Slack, email, Drive', description: 'Anthropic launches Ask Your Org: a pre-configured Project that searches across connected company tools (Slack, Microsoft 365, Google Workspace, custom MCP connectors) and returns a single synthesized answer with citations. Permission-aware — users only see data they can already access. Available to Team and Enterprise plans after owner setup.', significance: 'major', article_slug: 'ask-your-org-guide', audience: ['for-you', 'for-admins'] },
  { event_date: '2026-04-09', org: 'Anthropic', title: 'New admin controls — user groups, spend limits, Compliance API', description: 'Anthropic ships a batch of admin controls for Team and Enterprise: user groups with SCIM sync, role-based access defining which Claude features each group can use, per-user spend caps, managed Claude Code policies (tool/file/MCP permissions), and a new Compliance API for Enterprise giving programmatic access to usage data and selective deletion.', significance: 'notable', article_slug: 'claude-admin-controls-2026', audience: ['for-admins'] },
  { event_date: '2026-04-09', org: 'Anthropic', title: 'Claude Cowork generally available — enterprise-ready', description: 'Cowork goes GA on macOS and Windows with Analytics API access, OpenTelemetry monitoring, and role-based access controls for enterprise departments. The shift from collaborative experiment to production-grade team workspace.', significance: 'notable', href: 'https://claude.com/blog/cowork-for-enterprise', audience: ['for-you', 'for-admins'] },
  { event_date: '2026-04-09', org: 'Anthropic', title: 'Monitor tool — background streaming in Claude Code', description: 'Claude Code gains the Monitor tool: spawn a background process and stream its stdout into the conversation without blocking the thread. Enables patterns like "watch kubectl logs for errors and fix any crashes" — a step toward always-on agent awareness.', significance: 'notable', href: 'https://code.claude.com/docs/en/changelog', audience: ['for-builders'] },
  { event_date: '2026-04-08', org: 'Meta', title: "Muse Spark — Meta's first proprietary model", description: "Meta launches Muse Spark, its first proprietary (non-open-source) model, developed by Meta Superintelligence Labs. Small and fast, competitive on reasoning and agentic tasks. Signals a strategic shift: Meta now has both open (Llama) and closed model lines.", significance: 'notable' },
  { event_date: '2026-04-08', org: 'Anthropic', title: 'Claude Managed Agents — autonomous agents via API', description: "Anthropic launches Managed Agents in public beta: a fully managed harness for running Claude as an autonomous agent with secure sandboxing, built-in tools, and streaming. Create agents, configure containers, and run sessions entirely through the API. The biggest shift from Claude-as-assistant to Claude-as-worker.", significance: 'major', glossary_slug: 'managed-agents', href: 'https://platform.claude.com/docs/en/managed-agents/overview', audience: ['for-builders'] },
  { event_date: '2026-04-07', org: 'Anthropic', title: 'Project Glasswing — defensive cybersecurity coalition', description: 'Anthropic announces Project Glasswing alongside AWS, Apple, Google, Microsoft, NVIDIA, and others to secure critical software infrastructure. Claude Mythos Preview — a specialized cybersecurity model — available as a gated research preview for defensive work.', significance: 'notable', href: 'https://anthropic.com/glasswing', audience: ['for-admins'] },
  { event_date: '2026-04-07', org: 'Google', title: 'AI Edge Eloquent — offline-first AI dictation for iOS', description: "Google quietly ships AI Edge Eloquent, an on-device dictation app for iOS using Gemma-based speech recognition models. Works fully offline; optional Gemini cloud integration for post-processing. Signals Google's push into private, on-device AI — where inference stays on the hardware rather than hitting a remote API.", significance: 'notable', href: 'https://techcrunch.com/2026/04/07/google-quietly-releases-an-offline-first-ai-dictation-app-on-ios/' },
  { event_date: '2026-04-02', org: 'Google', title: 'Gemma 4 — natively multimodal open model family', description: 'Google releases Gemma 4, an open model family from 2.3B to 31B parameters that is natively multimodal (text, image, video). The 31B Dense variant ranks #3 globally among open models. A major leap in what open-weights models can do.', significance: 'notable' },
  { event_date: '2026-04-02', org: 'Microsoft', title: 'MAI-Transcribe-1, MAI-Voice-1, MAI-Image-2 — three in-house models', description: "Microsoft announces three new proprietary MAI foundation models available in Azure AI Foundry: MAI-Transcribe-1 (state-of-the-art multilingual speech recognition), MAI-Voice-1 (custom voice synthesis), and MAI-Image-2 (top Arena.ai leaderboard scores, 2× faster generation). First clear signal that Microsoft is building its own model stack alongside its OpenAI and Anthropic partnerships.", significance: 'notable', href: 'https://techcrunch.com/2026/04/02/microsoft-takes-on-ai-rivals-with-three-new-foundational-models/' },
  { event_date: '2026-03-13', org: 'Anthropic', title: '1M token context window — generally available', description: 'The 1M token context window is now GA for Claude Opus 4.6 and Sonnet 4.6 at standard pricing — no beta header required. Requests over 200k tokens work automatically. Also raised the media limit from 100 to 600 images or PDF pages per request.', significance: 'notable', href: 'https://platform.claude.com/docs/en/build-with-claude/context-windows', audience: ['for-builders'] },
  { event_date: '2026-03-12', org: 'Anthropic', title: 'Claude Partner Network — $100M enterprise adoption push', description: 'Anthropic launches the Claude Partner Network with $100M invested to accelerate enterprise adoption. Targets system integrators, consultants, and implementation partners helping organizations deploy Claude at scale.', significance: 'notable', href: 'https://www.anthropic.com/news/claude-partner-network', audience: ['for-admins'] },
  { event_date: '2026-02-17', org: 'Anthropic', title: 'Claude Sonnet 4.6 — frontier performance at everyday speed', description: 'Sonnet 4.6 launches as the balanced model for professional work at scale — improved agentic search, fewer tokens consumed, extended thinking support, and 1M token context window. Web search and code execution tools hit general availability on the same day.', significance: 'major', href: 'https://www.anthropic.com/news/claude-sonnet-4-6', audience: ['for-you', 'for-builders'] },
  { event_date: '2026-02-12', org: 'Anthropic', title: 'Series G — $30 billion at $380B valuation', description: "Anthropic raises $30B in Series G funding at a $380B post-money valuation, with $14B annual run-rate revenue. One of the most valuable private companies in history. Signals market conviction that frontier AI will be defining infrastructure.", significance: 'context', href: 'https://www.anthropic.com/news' },
  { event_date: '2026-02-05', org: 'Anthropic', title: 'Claude Opus 4.6 — flagship for long-horizon agents', description: "Opus 4.6 launches for complex, long-horizon agentic tasks. Introduces adaptive thinking (replacing manual budget_tokens), the compaction API for effectively infinite conversations, and data residency controls. Fast mode — up to 2.5x faster — available in preview.", significance: 'major', href: 'https://www.anthropic.com/news/claude-opus-4-6', audience: ['for-you', 'for-builders'] },
  { event_date: '2026-01-13', org: 'Anthropic', title: 'Claude Labs — experimental features platform', description: 'Anthropic launches Labs, a platform for experimental Claude features before they reach the main product. First move toward a formal beta program for early access to capabilities in development.', significance: 'notable', href: 'https://www.anthropic.com/news', audience: ['for-you'] },
  { event_date: '2026-01-11', org: 'Anthropic', title: 'Claude for Healthcare & Life Sciences — HIPAA-ready', description: 'Anthropic launches HIPAA-ready infrastructure with clinical trial connectors for healthcare and life sciences. Opens Claude to regulated industries that previously had compliance blockers.', significance: 'notable', href: 'https://www.anthropic.com/news', audience: ['for-admins'] },
  { event_date: '2026-01-05', org: 'Microsoft', title: 'Copilot for M365 — broad enterprise rollout', description: 'Microsoft Copilot reaches general availability across M365 enterprise. AI embedded in Word, Excel, PowerPoint, Outlook, and Teams. Forces the question: if Copilot is good enough for document work, what does Claude add?', significance: 'notable' },
  // 2025
  { event_date: '2025-12-09', org: 'Anthropic', title: 'MCP donated to the Agentic AI Foundation', description: 'Anthropic donates the Model Context Protocol to the newly formed Agentic AI Foundation, cementing MCP as an open industry standard. Adopted by dozens of companies since its release, MCP becomes a neutral, community-governed protocol.', significance: 'notable', glossary_slug: 'mcp', href: 'https://www.anthropic.com/news', audience: ['for-builders', 'for-admins'] },
  { event_date: '2025-12-01', org: 'Anthropic', title: 'Claude.ai Cowork — shared workspaces for teams', description: 'Real-time collaborative sessions in Claude — multiple users working in the same conversation. Foundation for team-based AI workflows.', significance: 'notable', glossary_slug: 'cowork', audience: ['for-you', 'for-admins'] },
  { event_date: '2025-11-24', org: 'Anthropic', title: 'Claude Opus 4.5 — step-change in vision and coding', description: 'Opus 4.5 launches as the most capable Claude model yet — step-change improvements in vision, coding, and computer use at a more accessible price than previous Opus models. Best model for complex specialized tasks and professional software engineering.', significance: 'major', href: 'https://www.anthropic.com/news/claude-opus-4-5', audience: ['for-you', 'for-builders'] },
  { event_date: '2025-11-18', org: 'Anthropic', title: 'Claude in Microsoft Foundry — Azure integration', description: 'Claude models come to Azure customers through Microsoft Foundry with Azure billing and OAuth authentication. Full Messages API access including extended thinking, prompt caching, PDF support, and Agent Skills.', significance: 'notable', href: 'https://platform.claude.com/docs/en/build-with-claude/claude-in-microsoft-foundry', audience: ['for-builders', 'for-admins'] },
  { event_date: '2024-11-07', org: 'Anthropic', title: 'Model Context Protocol (MCP) — open standard for tool connections', description: 'Anthropic releases MCP as an open protocol for connecting AI models to external tools and data sources. Other companies adopt it quickly, making MCP a de-facto standard. The shift from proprietary to standardized AI integrations.', significance: 'major', glossary_slug: 'mcp', href: 'https://www.anthropic.com/news/model-context-protocol', audience: ['for-builders', 'for-admins'] },
  { event_date: '2025-10-28', org: 'OpenAI', title: 'ChatGPT canvas + memory by default', description: 'OpenAI ships long-term memory as a default ChatGPT feature, and launches canvas — a structured writing and code workspace. Accelerates the shift from chatbot to persistent AI workspace.', significance: 'notable' },
  { event_date: '2025-10-16', org: 'Anthropic', title: 'Agent Skills — Claude works with Office files natively', description: 'Agent Skills launch in beta: pre-built Skills for PowerPoint, Excel, Word, and PDF files. Also supports custom Skills where you package your own domain expertise. Claude can now read and write Office documents without manual parsing — a major unlock for enterprise workflows.', significance: 'major', href: 'https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview', audience: ['for-you', 'for-builders'] },
  { event_date: '2025-10-15', org: 'Anthropic', title: 'Claude Haiku 4.5 — fastest model with near-frontier intelligence', description: 'Haiku 4.5 launches as the fastest and most capable Haiku yet — near-frontier performance for real-time applications, high-volume processing, and cost-sensitive deployments where speed matters more than maximum intelligence.', significance: 'notable', href: 'https://www.anthropic.com/news/claude-haiku-4-5', audience: ['for-builders'] },
  { event_date: '2025-09-29', org: 'Anthropic', title: 'Claude Sonnet 4.5 — built for complex agents and coding', description: 'Sonnet 4.5 launches with the highest intelligence of any Sonnet, built for complex agent workflows and coding tasks. Also ships: the memory tool (persistent context across conversations) and context editing for automatic conversation management.', significance: 'major', href: 'https://www.anthropic.com/news/claude-sonnet-4-5', audience: ['for-you', 'for-builders'] },
  { event_date: '2025-09-10', org: 'Anthropic', title: 'Web fetch tool — Claude reads any webpage', description: 'Web fetch tool launches in beta, letting Claude retrieve full content from any web page or PDF by URL. Pairs with web search for end-to-end research tasks.', significance: 'notable', href: 'https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-fetch-tool', audience: ['for-builders'] },
  { event_date: '2025-06-12', org: 'Anthropic', title: 'Claude Code — agentic development in the terminal', description: 'Claude Code launches as a terminal-native development experience: reads codebases, runs commands, writes and edits files, and navigates full projects. Goes further than autocomplete into agentic development.', significance: 'major', glossary_slug: 'claude-code', href: 'https://claude.ai/code', audience: ['for-builders'] },
  { event_date: '2025-05-22', org: 'Anthropic', title: 'Claude Opus 4 + Sonnet 4 — the Claude 4 family launches', description: 'Anthropic ships the first Claude 4 models: Opus 4 for frontier tasks and Sonnet 4 for everyday use, both with extended thinking. Also ships: Files API, Code Execution tool, and MCP connector in the API. A step-change in what Claude can do in production.', significance: 'major', href: 'http://www.anthropic.com/news/claude-4', audience: ['for-you', 'for-builders'] },
  { event_date: '2025-05-07', org: 'Anthropic', title: 'Web search — Claude accesses the live internet', description: 'Web search launches in the API, giving Claude access to up-to-date information. Closes the biggest gap between Claude and web-native AI products.', significance: 'notable', href: 'https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool', audience: ['for-you', 'for-builders'] },
  { event_date: '2025-05-05', org: 'OpenAI', title: 'GPT-4o — natively multimodal with real-time voice', description: 'GPT-4o ships as a single model handling voice, image, and text without switching modes. Real-time voice with sub-second latency. Brings the conversational AI interaction model much closer to reality.', significance: 'major' },
  { event_date: '2025-04-09', org: 'Meta', title: 'LLaMA 4 — frontier open-weights model', description: 'Meta releases LLaMA 4 with performance competitive with GPT-4-class models. Largest open-weights release to date. Reinforces that the gap between open-source and proprietary is closing faster than expected.', significance: 'notable', glossary_slug: 'meta-llama' },
  { event_date: '2025-02-24', org: 'Anthropic', title: 'Claude Sonnet 3.7 — extended thinking in production', description: "Claude Sonnet 3.7 ships as the first Claude model with extended thinking built in — a mode where Claude reasons step-by-step before answering. Near-instant responses or visible thinking, one model. Anthropic's first mainstream reasoning model.", significance: 'major', glossary_slug: 'extended-thinking', href: 'http://www.anthropic.com/news/claude-3-7-sonnet', audience: ['for-you', 'for-builders'] },
  { event_date: '2025-02-06', org: 'Industry', title: 'Agentic AI enters mainstream product conversation', description: 'The term "AI agents" crosses from research into mainstream product discussion. Every major AI lab ships or announces agentic products. The question shifts from "can AI do this?" to "how do you orchestrate AI to do this reliably?"', significance: 'context', glossary_slug: 'ai-agent' },
  { event_date: '2025-01-23', org: 'Anthropic', title: 'Citations API — source attribution for document work', description: 'Claude gains the ability to cite its sources when answering from documents — pointing to the exact passage it drew from. Major unlock for trust in enterprise document workflows and RAG applications.', significance: 'notable', href: 'https://platform.claude.com/docs/en/build-with-claude/citations', audience: ['for-builders'] },
  { event_date: '2025-01-12', org: 'Google', title: 'Gemini Advanced with Deep Research', description: 'Google ships Deep Research in Gemini Advanced — a mode that autonomously researches a topic across the web over several minutes and returns a structured report. First mainstream implementation of a multi-step research agent.', significance: 'notable' },
  // 2024
  { event_date: '2024-12-17', org: 'Anthropic', title: 'Batches, Token Counting, Prompt Caching — all go GA', description: 'Anthropic moves several API features to general availability: Message Batches API (50% cost reduction on batch jobs), Token Counting API, Prompt Caching (90% cost reduction), and PDF support. Also ships Go and Java SDKs.', significance: 'notable', href: 'https://platform.claude.com/docs/en/build-with-claude/batch-processing', audience: ['for-builders'] },
  { event_date: '2024-11-04', org: 'Anthropic', title: 'Claude Haiku 3.5 — fast, affordable, upgraded', description: 'Claude Haiku 3.5 launches as a fast, cost-efficient model for real-time applications and high-volume tasks. Better than Haiku 3 at a similar price point.', significance: 'notable', href: 'https://www.anthropic.com/claude/haiku', audience: ['for-builders'] },
  { event_date: '2024-10-22', org: 'Anthropic', title: 'Computer Use — Claude controls a desktop', description: 'Anthropic ships Computer Use in public beta: Claude can move a mouse, click, type, and navigate GUI applications. First mainstream API for AI-controlled computer interaction. Sets the foundation for desktop-level automation.', significance: 'major', href: 'https://www.anthropic.com/news/developing-computer-use', audience: ['for-builders'] },
  { event_date: '2024-09-12', org: 'OpenAI', title: 'o1 — reasoning model with explicit chain-of-thought', description: 'OpenAI releases o1, a model that reasons explicitly before answering. Significantly outperforms GPT-4 on math and science benchmarks. Introduces "reasoning model" as a distinct category from "chat model."', significance: 'major', glossary_slug: 'chain-of-thought-prompting' },
  { event_date: '2024-09-10', org: 'Anthropic', title: 'Console Workspaces — project-level API management', description: 'Workspaces launch in the Developer Console: custom spend limits, grouped API keys, usage tracking by project, and user roles. First real admin layer for teams using the Claude API.', significance: 'notable', href: 'https://www.anthropic.com/news/workspaces', audience: ['for-admins', 'for-builders'] },
  { event_date: '2024-08-14', org: 'Anthropic', title: 'Prompt Caching — 90% cost reduction on repeated context', description: 'Prompt caching launches in beta: cache and reuse prompt content to reduce costs by up to 90% and latency by up to 80%. Major cost unlock for applications using the same system prompt or documents repeatedly.', significance: 'notable', glossary_slug: 'prompt-caching', href: 'https://www.anthropic.com/news/prompt-caching', audience: ['for-builders'] },
  { event_date: '2024-06-20', org: 'Anthropic', title: 'Claude Sonnet 3.5 + Artifacts — a new interaction model', description: 'Claude Sonnet 3.5 launches with benchmark-leading coding performance. Artifacts ship alongside: a side-panel for code, documents, and interactive outputs. The shift from text responses to living, editable artifacts.', significance: 'major', glossary_slug: 'claude-artifacts', href: 'http://anthropic.com/news/claude-3-5-sonnet', audience: ['for-you'] },
  { event_date: '2024-03-04', org: 'Anthropic', title: 'Claude 3 family — Haiku, Sonnet, Opus', description: 'Anthropic ships the Claude 3 model family: three tiers for speed vs. capability tradeoffs. Opus leads on benchmarks. Haiku enables real-time, cost-efficient use cases. Establishes the tiered naming convention still in use today.', significance: 'major', href: 'https://www.anthropic.com/news/claude-3-family' },
  { event_date: '2024-02-08', org: 'Google', title: "Gemini 1.0 Ultra — Google's frontier model", description: "Google rebrands Bard to Gemini and ships the Ultra tier. Natively multimodal from architecture rather than retrofit. Signals Google's intent to compete directly with GPT-4 and Claude at the frontier.", significance: 'notable', glossary_slug: 'google-gemini' },
  // 2023
  { event_date: '2023-03-14', org: 'Anthropic', title: 'Claude 1 — Constitutional AI in production', description: 'Anthropic ships the first public Claude, trained using Constitutional AI — aligning model behavior using a set of principles rather than purely human feedback. First major alternative to GPT at capability scale.', significance: 'major', glossary_slug: 'constitutional-ai', href: 'https://www.anthropic.com/news/claude-1' },
  { event_date: '2023-03-14', org: 'OpenAI', title: 'GPT-4 — multimodal, significantly improved reasoning', description: 'GPT-4 launches with vision capabilities and measurably better reasoning than GPT-3.5. Triggers the "AI moment" for enterprise adoption.', significance: 'major' },
  // 2022
  { event_date: '2022-11-30', org: 'OpenAI', title: 'ChatGPT — the moment AI went mainstream', description: 'ChatGPT launches and reaches 100 million users in two months — the fastest consumer product adoption in history. Not the most capable model at the time, but the one that made AI accessible to everyone. Everything since has been a response to this moment.', significance: 'major', glossary_slug: 'large-language-model', href: 'https://openai.com/blog/chatgpt' },
] as const

// New events: Apr 18 – May 13, 2026 (+ Apr 14 which was missed in original)
const NEW_EVENTS = [
  {
    event_date: '2026-04-14',
    org: 'Anthropic',
    title: 'Claude Code desktop redesign — parallel sessions, integrated editor',
    description: "Claude Code's desktop app ships a major redesign: a sessions sidebar for running multiple tasks in parallel, an integrated terminal and file editor with faster diffs, expanded preview pane, side chat (⌘+;) for asking questions without interrupting the main session, drag-and-drop workspace, and SSH support on Mac. The shift from a single-task CLI to a multi-session coding environment.",
    significance: 'notable',
    href: 'https://code.claude.com/docs/en/changelog',
    audience: ['for-builders'],
  },
  {
    event_date: '2026-04-23',
    org: 'OpenAI',
    title: 'GPT-5.5 — next step toward an AI super-app',
    description: "OpenAI releases GPT-5.5 and GPT-5.5 Pro, framing it as a step toward a unified AI 'super-app.' Available via API (as chat-latest) from April 24. Positions ChatGPT closer to a full-featured work assistant rather than a pure chat interface.",
    significance: 'notable',
    href: 'https://openai.com/index/introducing-gpt-5-5/',
  },
  {
    event_date: '2026-04-30',
    org: 'Industry',
    title: '$700 billion — Big Tech AI infrastructure spending in 2026',
    description: "Microsoft, Google, Meta, Amazon, and others are on track to collectively spend ~$700 billion on AI infrastructure in 2026, nearly double 2025 levels. Meta alone guided $115–135B in capex. No clear ceiling: every major hyperscaler is accelerating, treating AI compute as the defining infrastructure race of the decade.",
    significance: 'context',
    href: 'https://fortune.com/2026/04/30/big-tech-hyperscalers-will-spend-700-billion-on-ai-infrastructure-this-year-with-no-clear-end-in-sight-eye-on-ai/',
  },
  {
    event_date: '2026-05-04',
    org: 'Anthropic',
    title: 'Enterprise AI services company — Anthropic + Blackstone + Goldman',
    description: "Anthropic, Blackstone, Hellman & Friedman, and Goldman Sachs announce a new AI services company targeting mid-sized businesses. The joint venture deploys Claude into core operations across sectors — the first major move by Anthropic to own the services layer, not just the model.",
    significance: 'notable',
    href: 'https://www.anthropic.com/news/enterprise-ai-services-company',
    audience: ['for-admins'],
  },
  {
    event_date: '2026-05-05',
    org: 'OpenAI',
    title: 'GPT-5.5 Instant — new default ChatGPT model',
    description: "OpenAI ships GPT-5.5 Instant as the default model for all ChatGPT users, replacing GPT-5.3 Instant. Produces 52.5% fewer hallucinated claims on high-stakes prompts (medicine, law, finance). Can search past conversations, files, and Gmail for personalized answers. GPT-5.3 Instant remains available to paid users for three months before retirement.",
    significance: 'notable',
    href: 'https://openai.com/index/gpt-5-5-instant/',
  },
  {
    event_date: '2026-05-07',
    org: 'Anthropic',
    title: 'Managed Agents: Dreaming, Outcomes, multi-agent orchestration',
    description: "Anthropic ships three new capabilities for Managed Agents. Dreaming: agents review their own past sessions, extract patterns, and self-improve over time. Outcomes: a separate grading agent scores completed tasks and re-runs them until they hit quality thresholds — lifted document generation quality 10.1% on benchmarks. Multi-agent orchestration: a lead agent breaks jobs into pieces and delegates each to a specialist with its own model, prompt, and tools running in parallel on a shared filesystem.",
    significance: 'major',
    href: 'https://9to5mac.com/2026/05/07/anthropic-updates-claude-managed-agents-with-three-new-features/',
    audience: ['for-builders'],
  },
  {
    event_date: '2026-05-08',
    org: 'Anthropic',
    title: 'Claude Platform on AWS — generally available',
    description: "Anthropic's native Claude Platform experience arrives on AWS as a GA service — the first cloud provider to offer it. AWS customers get the full Claude API (Messages, Files, Batches, Managed Agents, Agent Skills, code execution, web tools) through native AWS endpoints, unified with existing AWS billing, authentication, and security controls. No separate Anthropic contract needed. Anthropic simultaneously commits $100B+ to AWS over ten years.",
    significance: 'major',
    href: 'https://aws.amazon.com/about-aws/whats-new/2026/05/claude-platform-aws/',
    audience: ['for-builders', 'for-admins'],
  },
  {
    event_date: '2026-05-12',
    org: 'Google',
    title: 'Android Show 2026 — Gemini Intelligence across Android',
    description: "Google's Android Show 2026 centers on Gemini Intelligence: on-device AI that automates complex tasks, summarizes web content, fills forms, and includes Rambler (polishes voice messages or builds custom widgets from natural language). New Googlebooks AI-first laptops announced. Gemini comes to Chrome. Rolling out to Samsung and Pixel phones first, then broader Android. Signals the shift from Gemini-as-chatbot to Gemini-as-OS-layer.",
    significance: 'notable',
    href: 'https://techcrunch.com/2026/05/12/everything-google-announced-at-its-android-show-from-googlebooks-to-vibe-coded-widgets/',
  },
] as const

function toRow(e: Record<string, unknown>) {
  return {
    event_date: e.event_date,
    org: e.org,
    title: e.title,
    description: e.description,
    significance: e.significance,
    glossary_slug: (e.glossary_slug ?? null) as string | null,
    href: (e.href ?? null) as string | null,
    article_slug: (e.article_slug ?? null) as string | null,
    audience: (e.audience ?? []) as string[],
    published: true,
  }
}

async function seed() {
  const allEvents = [...EVENTS, ...NEW_EVENTS]
  console.log(`Seeding ${allEvents.length} timeline events (${EVENTS.length} original + ${NEW_EVENTS.length} new)...`)

  const rows = allEvents.map(e => toRow(e as unknown as Record<string, unknown>))

  const { error } = await supabase
    .from('timeline_events')
    .upsert(rows, { onConflict: 'event_date,org,title' })

  if (error) {
    console.error('Seed failed:', error)
    process.exit(1)
  }

  console.log(`✓ Seeded ${rows.length} events`)
}

seed()
