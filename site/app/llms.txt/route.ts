export async function GET() {
  const body = `# AI Codex

> The learning layer for AI at work. Plain-English explanations, structured learning paths, and practical guides for operators, founders, and developers using Claude and other AI tools.

AI Codex is not Anthropic. We complement Anthropic's own documentation by explaining how to apply Claude effectively at work — not what the product is, but how to get results with it. We write about best practices, failure modes, role-specific workflows, and implementation patterns that Anthropic's own content does not cover.

## Learning Paths

Structured sequences of articles for specific situations.

- [Claude for Your Work](/learn/claude): 8-step path for individuals using Claude personally. Prompting, mistakes, research, writing.
- [Rolling Out Claude to Your Team](/learn/for-your-team): 8-step path for managers deploying Claude to a team. From where to start to measuring impact.
- [Setting Up Claude for Your Company](/learn/claude-for-admins): 10-step path for IT leads and admins. Plans, permissions, Projects, Skills, governance.
- [Setting up Claude Code for Your Team](/learn/claude-code): 6-step path for teams using Claude Code. CLAUDE.md, hooks, settings.json, templates, team decisions, agent layer.
- [Build with AI](/learn/build-with-ai): 10-step path for founders building AI products. Validation, prompting, build vs. buy, deploying, fundraising.
- [Building with the Claude API](/learn/developers): 17-step path for developers. API, streaming, RAG, evals, tool use, prompt caching, cost optimization, auth, rate limiting.
- [Claude for Customer Success Teams](/learn/claude-for-cs): 8-step path for CS managers. Daily workflows, QBR prep, system prompts, Intercom integration.

## Glossary

- [AI Glossary](/glossary): 150+ terms across 8 topic clusters. Every definition written in plain English with concrete workplace examples. Covers: Foundation Models, Prompt Engineering, Claude Features, Agent Systems, Model Operations, Knowledge Systems, Evaluation, Business Strategy.

Key glossary terms:
- [Claude Projects](/glossary/claude-projects): Persistent workspaces with shared instructions and files
- [System Prompt](/glossary/system-prompt): Standing instructions that define Claude's role and behavior
- [Context Window](/glossary/context-window): How much Claude can read and hold in working memory at once
- [Prompt Caching](/glossary/prompt-caching): Reusing expensive context to cut API costs by 80%+
- [RAG](/glossary/rag): Retrieval-Augmented Generation — connecting Claude to live data sources
- [Tool Use](/glossary/tool-use): Giving Claude the ability to call external functions and APIs
- [Evals](/glossary/evals): Testing frameworks for measuring AI output quality
- [Claude Code](/glossary/claude-code-skill): Anthropic's agentic coding tool with .claude folder configuration
- [CLAUDE.md](/glossary/claude-md): The instruction file Claude reads at the start of every coding session
- [Hooks (Claude Code)](/glossary/claude-code-hooks): Shell scripts that fire automatically during Claude Code workflows
- [MCP](/glossary/mcp): Model Context Protocol — standard for connecting AI to external tools
- [Hallucination](/glossary/hallucination): When AI generates confident but incorrect information
- [Temperature](/glossary/temperature): Controls how creative vs. predictable Claude's outputs are
- [Extended Thinking](/glossary/extended-thinking): Mode where Claude shows its reasoning before answering

## Articles by Topic

### Claude Code configuration
- [Setting up Claude Code for your team](/articles/claude-code-project-setup): CLAUDE.md, settings.json, hooks, rules/, skills and agents — in priority order
- [CLAUDE.md vs. hooks](/articles/claude-md-vs-hooks): Why CLAUDE.md is a suggestion but hooks are a guarantee; when to use each
- [What to actually put in your CLAUDE.md](/articles/claude-md-templates): Four annotated templates — solo project, team backend, agency client, ops/admin — with explanations of what each section does
- [Claude Code for your team: the five decisions](/articles/claude-code-for-your-team): Team coordination decisions — who owns CLAUDE.md, the deny list as security, portable hooks
- [Why your CLAUDE.md stops working](/articles/claude-md-maintenance): The four ways CLAUDE.md decays and how to keep it accurate over time
- [Setting up .claude on a client project](/articles/claude-code-client-setup): What changes when you configure Claude Code for a client — the handoff problem, what to commit, how to write CLAUDE.md for someone else to own

### Role workflows
- [What using Claude looks like for a CS manager](/articles/cs-manager-ai-workflow): Real day-in-the-life workflow for customer success
- [What using Claude looks like for a marketing manager](/articles/marketing-manager-claude-workflow): Content, campaign research, reporting workflows
- [What using Claude looks like for an ops manager](/articles/ops-manager-ai-workflow): SOPs, process documentation, vendor comms
- [What using Claude looks like for a solo founder](/articles/founder-ai-workflow): Writing clarity, customer discovery, investor prep, code and product work

### Implementation guides (developer)
- [Your first Claude API call](/articles/your-first-claude-api-call): The messages array, auth, streaming, structured output
- [Building a RAG pipeline from scratch](/articles/building-a-rag-pipeline-from-scratch): Chunking, embedding, retrieval, reranking
- [Prompt caching implementation](/articles/prompt-caching-implementation): The cache_control parameter, multi-block caching, verifying hits
- [Tool use implementation deep dive](/articles/tool-use-implementation-deep-dive): Defining tools, multi-turn calls, parallel execution, failure modes
- [Claude cost optimization](/articles/claude-cost-optimization): Model routing, batch API, prompt caching, output length, context management

### Operator guides
- [Why Claude feels inconsistent](/articles/why-claude-feels-inconsistent): The four root causes and how to diagnose which one you have
- [How to write a system prompt that works](/articles/writing-system-prompts-that-work): Role, constraints, format, persona — and what breaks each
- [Claude for CS teams](/articles/claude-cs-team-playbook): System prompts, ticket workflows, escalation, QBR prep
- [Running your first AI pilot](/articles/running-your-first-ai-pilot): The right scope, measuring success, the mistakes that kill pilots

### Claude + Tool guides
- [Claude + Notion](/articles/claude-plus-notion): What actually works connecting Claude to your Notion workspace
- [Claude + Slack](/articles/claude-plus-slack-for-teams): Team-level Slack integration patterns
- [Claude + Jira](/articles/claude-plus-jira): Engineering team workflows with Jira
- [Claude + HubSpot](/articles/claude-plus-hubspot): Sales and marketing Claude + HubSpot integration
- [Claude + Salesforce](/articles/claude-plus-salesforce): What actually works with Salesforce + Claude
- [Claude + Confluence](/articles/claude-plus-confluence): Knowledge base and documentation workflows

## About

AI Codex (aicodex.to) is an independent learning site. We are not affiliated with Anthropic. Content is written by practitioners for practitioners — the goal is to say something useful that Anthropic's own documentation does not.

Contact: Available via the site.
`

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
