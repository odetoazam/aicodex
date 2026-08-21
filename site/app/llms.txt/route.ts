export async function GET() {
  const body = `# AI Codex

> Anthropic teaches the product. AI Codex covers the job around it: what breaks in production, what deployments actually cost, how to get budget approved, when to pick a different vendor, and what the Forward Deployed Engineer and AI Agent Manager roles are really accountable for.

AI Codex (aicodex.to) is an independent site with no affiliation to Anthropic. Anthropic runs its own free training at academy.claude.com — 355 courses, tutorials, and role use cases — and it is the best product training any AI company publishes. We link to it throughout and maintain a course map at /academy.

What we cover that a vendor course structurally cannot: cross-vendor comparison, production failure modes, organisational and budget friction, model deprecations and migrations, a dated cross-lab industry timeline, and career guidance for the roles AI deployment is creating.

## Learning Paths

Structured sequences of articles for specific situations.

- [Claude for Your Work](/learn/claude): 8-step path for individuals using Claude personally. Prompting, mistakes, research, writing.
- [Rolling Out Claude to Your Team](/learn/for-your-team): 8-step path for managers deploying Claude to a team. From where to start to measuring impact.
- [Setting Up Claude for Your Company](/learn/claude-for-admins): 10-step path for IT leads and admins. Plans, permissions, Projects, Skills, governance.
- [Setting up Claude Code for Your Team](/learn/claude-code): 6-step path for teams using Claude Code. CLAUDE.md, hooks, settings.json, templates, team decisions, agent layer.
- [Build with AI](/learn/build-with-ai): 10-step path for founders building AI products. Validation, prompting, build vs. buy, deploying, fundraising.
- [Building with the Claude API](/learn/developers): 20-step path for developers. API, streaming, RAG, evals, tool use, prompt caching, cost optimization, auth, rate limiting.
- [Becoming an AI Agent Manager](/learn/agent-manager): 8-step path for the person accountable for running AI agents inside their own company. First 90 days, wiring internal systems, evals without code, diagnosing failures, change management, cost control, ROI reporting.
- [Forward Deployed Engineer career path](/learn/forward-deployed-engineer): 8-step path for engineers moving into FDE roles at AI companies. What the role is, how to break in, portfolio projects, client-facing craft.
- [The Internal AI Stack](/learn/internal-ai-stack): architecture path for wiring company systems to agents — MCP servers, access control, data warehouses, live API vs. ETL, token economics.
- [Getting Your Team Started](/learn/getting-your-team-started): the first-weeks rollout sequence for a team lead.
- [AI for Your Company](/learn/ai-for-your-company): org-level strategy, adoption phases, and business case.

## Claude Academy

- [Claude Academy course map](/academy): Anthropic launched Claude Academy (academy.claude.com) on August 20, 2026 with 355 free resources. This page triages the catalog: which six resources matter for each of five roles, in what order, and what each track leaves out.
- [Which Claude Academy courses are worth your time](/articles/claude-academy-guide): the full triage, with time budgets by role and what to skip.
- [What Claude Academy doesn't teach you](/articles/what-claude-academy-doesnt-teach): nine things a vendor course structurally cannot cover.
- [The four Claude certifications](/articles/claude-certifications-guide): the proctored Pearson VUE exams, costs, and the Partner Network prerequisite that blocks most people.

## Timeline

- [AI Timeline](/timeline): 140+ dated events covering every significant release from Anthropic, OpenAI, Google, Meta, and Microsoft since 2022. Model launches, product launches, deprecations, partnerships, and industry standards. Filterable by organisation and audience.

## Tools

- [Claude API Cost Calculator](/tools/cost-calculator): estimate monthly spend by model, volume, and caching strategy.
- [System Prompt Builder](/tools/system-prompt-builder): generate a production system prompt for your use case.
- [AI Maturity Scorecard](/tools/scorecard): 10 questions assessing where a Claude deployment stands.
- [Prompt Library](/tools/prompt-library): reusable prompts by role and task.

## Comparisons

- [Claude vs GPT-5.6: Coding](/compare/claude-vs-gpt5-coding), [Customer Support](/compare/claude-vs-gpt5-customer-support), [Writing](/compare/claude-vs-gpt5-writing), [Document Analysis](/compare/claude-vs-gpt5-document-analysis)
- [Claude vs Gemini for Business](/compare/claude-vs-gemini-for-business), [Claude vs OpenAI for Enterprise](/compare/claude-vs-openai-for-enterprise), [Haiku vs Sonnet](/compare/claude-haiku-vs-sonnet)

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
- [claude agents: parallel multi-agent terminal mode](/articles/claude-agents-command): The new terminal command for running multiple independent agent tasks simultaneously — keyboard navigation, cost model, sub-agent compatibility
- [Claude Code updates — May 22–27, 2026](/articles/claude-code-may-2026-updates): /code-review --fix, /usage cost breakdown, Auto mode without consent prompts, VS Code remote agents, enterprise MCP setting

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
- [Claude, Codex, or Cursor: choosing your AI platform in 2026](/articles/ai-platform-landscape-2026): Decision framework for operators and IT choosing where to standardize — model quality, platform completeness, cost
- [Andrej Karpathy joins Anthropic](/articles/karpathy-joins-anthropic): What the hire signals about Claude's research trajectory and why it matters for platform bets
- [Claude Compliance API](/articles/claude-compliance-api): 28 enterprise security integrations (DLP, SIEM, CASB, eDiscovery) — what the API returns and how to scope a rollout
- [Why Anthropic and OpenAI copied Palantir](/articles/why-anthropic-openai-copied-palantir): The simultaneous $1.5B and $10B FDE venture launches — what the Palantir model is and why it matters
- [Claude for Small Business](/articles/claude-for-small-business): Pre-built connectors for QuickBooks, PayPal, HubSpot, Canva, DocuSign — what's included and who needs it
- [The Agent Operator job market in 2026](/articles/agent-operator-job-market-2026): 280% job growth, salary bands, titles crystallizing — the data on what companies are hiring for

### Forward Deployed Engineering
- [What is a Forward Deployed Engineer](/articles/what-is-a-forward-deployed-engineer): The definitive guide — what FDEs do, where the role came from, compensation, the honest filter
- [How to become a Forward Deployed Engineer](/articles/how-to-become-forward-deployed-engineer): The actual career path — four skill areas, three transition tracks, portfolio requirements
- [FDE portfolio projects](/articles/fde-portfolio-projects): The 5 projects that signal FDE readiness — MCP servers, evals, enterprise integrations
- [FDE for career counselors](/articles/fde-for-career-counselors): What CS departments and career advisors need to know about the role
- [What is an Agent Operator](/articles/what-is-an-agent-operator): Aaron Levie's 500,000-job prediction explained — the internal role that's not an FDE but is just as important

### Microsoft 365 integration
- [Claude for Microsoft 365](/articles/claude-for-microsoft-365): Claude add-ins for Excel, PowerPoint, Word (GA), and Outlook (beta) — cross-app context, how the Office integration works

### Claude + Tool guides
- [Claude + Notion](/articles/claude-plus-notion): What actually works connecting Claude to your Notion workspace
- [Claude + Slack](/articles/claude-plus-slack-for-teams): Team-level Slack integration patterns
- [Claude + Jira](/articles/claude-plus-jira): Engineering team workflows with Jira
- [Claude + HubSpot](/articles/claude-plus-hubspot): Sales and marketing Claude + HubSpot integration
- [Claude + Salesforce](/articles/claude-plus-salesforce): What actually works with Salesforce + Claude
- [Claude + Confluence](/articles/claude-plus-confluence): Knowledge base and documentation workflows

## About

AI Codex (aicodex.to) is an independent learning site with no affiliation to Anthropic. It is written by an operator running AI systems in a regulated industry, for people doing the same.

The division of labour we maintain: Anthropic's Claude Academy (academy.claude.com) teaches the product, and we link there generously. This site covers everything downstream of that — what breaks, what it costs, who has to approve it, when to use something else, and what the job becomes.

Contact: Available via the site.
`

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
