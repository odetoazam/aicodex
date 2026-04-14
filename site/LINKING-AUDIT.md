# Outbound Linking Audit

Track progress on ensuring AI Codex articles link to Anthropic's primary sources rather than duplicating their content.

**Principle**: We explain what Anthropic builds and add insight they don't. We link to their content, not replicate it.

## Summary (2026-04-14)

**First pass complete.** Added "Further reading" sections with outbound Anthropic links to 132 articles that previously had zero. Fixed 29 old `docs.anthropic.com` URLs to `platform.claude.com`. Fixed 5 old `support.anthropic.com` URLs.

- Before: 39/171 articles (23%) had Anthropic links
- After: 165/171 articles (96%) have Anthropic links
- Remaining 6 articles are general/lifestyle content where forcing an Anthropic link would feel unnatural

**Timeline updated** with 7 new events: Claude for Word, Ultraplan, Advisor strategy, Cowork GA, Monitor tool, Meta Muse Spark, Google Gemma 4.

### What remains (future passes)
- [ ] Deep content audit: check if any article body *duplicates* Anthropic blog content rather than adding to it
- [ ] Verify all outbound URLs still resolve (link rot check)
- [ ] Add inline links within article bodies (not just "Further reading" sections)
- [ ] Cross-reference new Anthropic blog posts as they publish and add links to relevant existing articles
- [ ] Review articles for features that have shipped since the article was written (e.g., articles about Cowork pre-GA)

## Status Legend
- [ ] Not audited
- [x] Audited and updated
- [-] Audited, no changes needed
- [!] Needs content revision (duplicates Anthropic content)

---

## Anthropic Primary Sources
- claude.com/blog (107 posts)
- anthropic.com/news (197 posts)
- anthropic.com/engineering (22 posts)
- platform.claude.com/docs
- code.claude.com/docs
- support.claude.com/en/articles/12138966-release-notes
- code.claude.com/docs/en/changelog
- github.com/anthropics/claude-code/releases

---

## Articles — Audit Progress

### Core Concepts (definitions)
- [ ] ai-agent-def
- [ ] constitutional-ai-def
- [ ] context-window-def
- [ ] rag-def
- [ ] system-prompt-def
- [ ] hallucination-def
- [ ] tool-use-def
- [ ] evals-def
- [ ] large-language-model-def
- [ ] temperature-def
- [ ] fine-tuning-def
- [ ] token-def
- [ ] alignment-def
- [ ] streaming-def
- [ ] adaptive-thinking-def

### Operator / Role articles
- [ ] hallucination-role
- [ ] rag-role
- [ ] ai-agent-failure
- [ ] system-prompt-failure
- [ ] evals-role
- [ ] claude-operator-habits
- [ ] claude-for-customer-support
- [ ] running-your-first-ai-pilot
- [ ] claude-projects-role
- [ ] extended-thinking-role
- [ ] mcp-role
- [ ] ai-pilot-failure
- [ ] what-to-automate-first
- [ ] connectors-skills-role
- [ ] context-window-role
- [ ] prompt-caching-role
- [ ] hallucination-failure
- [ ] system-prompt-role
- [ ] rag-failure

### Team-specific guides
- [ ] ai-for-customer-success
- [ ] ai-for-marketing
- [ ] ai-for-sales
- [ ] ai-for-operations
- [ ] ai-for-hr
- [ ] claude-for-finance-teams
- [ ] claude-for-product-teams
- [ ] claude-for-legal-teams
- [ ] claude-for-data-teams
- [ ] claude-for-engineering-teams
- [ ] claude-for-hr-teams
- [ ] claude-cs-team-playbook

### Admin / Setup guides
- [ ] claude-admin-setup
- [ ] claude-admin-zero-to-one
- [ ] claude-admin-security-privacy
- [ ] claude-admin-ongoing-maintenance
- [ ] ai-usage-policy-for-teams
- [ ] ai-usage-policy-template
- [ ] choosing-your-claude-plan
- [ ] choosing-the-right-claude-model
- [ ] claude-projects-org-structure
- [ ] rolling-out-claude-across-teams
- [ ] setting-up-claude-for-your-team
- [ ] getting-it-approval-for-claude
- [ ] building-a-business-case-for-claude
- [ ] after-your-manager-approves-claude
- [ ] claude-adoption-plateau

### Feature guides
- [ ] managed-agents-for-your-org
- [ ] minimising-token-usage
- [ ] skills-setup-guide
- [ ] connectors-best-practices
- [ ] cowork-dispatch-guide
- [ ] claude-memory-guide
- [ ] deep-research-guide
- [ ] prompt-caching-process
- [ ] tool-use-process
- [ ] writing-system-prompts-that-work
- [ ] context-window-practical
- [ ] claude-memory-practical
- [ ] deep-research-practical
- [ ] extended-thinking-practical
- [ ] claude-artifacts-guide
- [ ] mcp-for-operators
- [ ] claude-code-for-operators
- [ ] prompt-engineering-for-operators
- [ ] how-to-write-precise-connector-instructions
- [ ] why-claude-feels-inconsistent

### Developer articles
- [ ] tool-use-implementation-deep-dive
- [ ] multi-agent-orchestration-basics
- [ ] your-first-claude-api-call
- [ ] building-a-rag-pipeline-from-scratch
- [ ] writing-evals-that-catch-regressions
- [ ] streaming-claude-responses-implementation
- [ ] prompt-caching-implementation
- [ ] claude-cost-optimization
- [ ] chatbot-with-persistent-memory
- [ ] deploying-claude-app-production
- [ ] claude-production-error-handling
- [ ] nextjs-chatbot-claude-full-tutorial
- [ ] what-to-build-with-claude
- [ ] rate-limiting-claude-api
- [ ] nextauth-claude-integration
- [ ] supabase-conversation-history
- [ ] claude-vs-custom-model
- [ ] securing-your-claude-app
- [ ] claude-streaming-decision
- [ ] evaluating-multi-agent-systems
- [ ] monitoring-your-claude-app
- [ ] multi-agent-failure-handling
- [ ] auditing-your-eval-suite
- [ ] ai-agent-harness-explained
- [ ] claude-advisor-tool
- [ ] claude-managed-agents

### Claude Code articles
- [ ] claude-code-project-setup
- [ ] claude-code-for-your-team
- [ ] claude-md-vs-hooks
- [ ] claude-md-maintenance
- [ ] claude-md-templates
- [ ] claude-code-client-setup
- [ ] claude-code-vs-web-app

### Integration guides (Claude + X)
- [ ] claude-plus-notion
- [ ] claude-plus-google-sheets
- [ ] claude-plus-slack-for-teams
- [ ] claude-plus-zapier
- [ ] claude-plus-google-docs
- [ ] claude-plus-hubspot
- [ ] claude-plus-airtable
- [ ] claude-plus-asana
- [ ] claude-plus-linear
- [ ] claude-plus-figma
- [ ] claude-plus-webflow
- [ ] claude-plus-jira
- [ ] claude-plus-intercom
- [ ] claude-plus-salesforce
- [ ] claude-plus-confluence

### Workflow / Use case articles
- [ ] sales-prospecting-with-claude
- [ ] cs-qbr-and-renewal-prep-with-claude
- [ ] claude-for-new-hire-onboarding
- [ ] managing-email-with-claude
- [ ] weekly-review-with-claude
- [ ] using-claude-to-declutter-your-digital-life
- [ ] customer-discovery-with-claude
- [ ] meeting-prep-with-claude
- [ ] note-taking-knowledge-management-claude
- [ ] cs-manager-ai-workflow
- [ ] marketing-manager-claude-workflow
- [ ] ops-manager-ai-workflow
- [ ] founder-ai-workflow

### Founder / Startup articles
- [ ] solo-founder-operating-system
- [ ] validating-startup-idea-with-claude
- [ ] build-buy-prompt-early-stage
- [ ] ai-product-failure-modes-founders
- [ ] pitching-ai-product-to-investors
- [ ] pricing-your-ai-product
- [ ] first-ten-customers-ai-product
- [ ] solo-founder-project-setup

### Agency / Consultant articles
- [ ] claude-for-agencies
- [ ] client-handoff-with-claude
- [ ] building-claude-powered-deliverable
- [ ] what-to-tell-clients-about-ai
- [ ] claude-code-client-setup
- [ ] pricing-claude-consulting-work

### Beginner / General
- [ ] how-to-write-a-good-prompt
- [ ] what-ai-cant-do
- [ ] claude-for-writing-and-editing
- [ ] using-claude-for-research
- [ ] claude-common-mistakes
- [ ] claude-hallucination-prevention
- [ ] claude-prompt-debugging
- [ ] when-not-to-use-claude
- [ ] how-to-convince-skeptical-teammate
- [ ] first-week-with-claude
- [ ] ai-for-executive-leaders
- [ ] ai-change-management
- [ ] measuring-ai-roi
- [ ] ai-roi-role

---

## Key Anthropic URL mappings (topic → source)

### Models & capabilities
- Opus 4.6: anthropic.com/news/claude-opus-4-6
- Sonnet 4.6: anthropic.com/news/claude-sonnet-4-6
- Haiku 4.5: anthropic.com/news/claude-haiku-4-5
- Claude 4: anthropic.com/news/claude-4
- Extended thinking: claude.com/blog (Sonnet 3.7 post) + platform.claude.com/docs/en/build-with-claude/extended-thinking
- Adaptive thinking: platform.claude.com/docs/en/build-with-claude/adaptive-thinking
- Context windows: platform.claude.com/docs/en/build-with-claude/context-windows

### Product features
- Artifacts: claude.com/blog/claude-powered-artifacts
- Projects: anthropic.com/news/projects
- Cowork: claude.com/blog/cowork-for-enterprise + claude.com/blog/cowork-plugins
- Memory: platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool
- Deep Research: claude.com/blog/research
- Web search: claude.com/blog/web-search + claude.com/blog/web-search-api
- Connectors: claude.com/blog/connectors-directory + claude.com/blog/interactive-tools-in-claude
- Skills: claude.com/blog/skills + claude.com/blog/complete-guide-to-building-skills-for-claude
- Computer use: anthropic.com/news/developing-computer-use + claude.com/blog/dispatch-and-computer-use

### Developer / API
- Tool use: claude.com/blog/tool-use-ga + platform.claude.com/docs/en/agents-and-tools/tool-use/
- Prompt caching: claude.com/blog/prompt-caching + platform.claude.com/docs/en/build-with-claude/prompt-caching
- Citations: claude.com/blog/introducing-citations-api
- Batch API: claude.com/blog/message-batches-api
- Streaming: platform.claude.com/docs/en/build-with-claude/working-with-messages
- Structured outputs: claude.com/blog/structured-outputs-on-the-claude-developer-platform
- MCP: anthropic.com/news/model-context-protocol + claude.com/blog/what-is-model-context-protocol
- Managed Agents: claude.com/blog/claude-managed-agents + platform.claude.com/docs/en/managed-agents/overview
- Advisor tool: claude.com/blog/the-advisor-strategy + platform.claude.com/docs/en/agents-and-tools/tool-use/advisor-tool
- Agent SDK: claude.com/blog/building-agents-with-the-claude-agent-sdk
- Multi-agent patterns: claude.com/blog/multi-agent-coordination-patterns + claude.com/blog/building-multi-agent-systems-when-and-how-to-use-them
- Agent harness design: anthropic.com/engineering/harness-design-long-running-apps + anthropic.com/engineering/effective-harnesses-for-long-running-agents
- Building effective agents: anthropic.com/engineering/building-effective-agents
- Context engineering: anthropic.com/engineering/effective-context-engineering-for-ai-agents
- Evals: anthropic.com/engineering/demystifying-evals-for-ai-agents
- RAG / Contextual Retrieval: anthropic.com/engineering/contextual-retrieval
- Prompt engineering: claude.com/blog/best-practices-for-prompt-engineering + platform.claude.com/docs/en/build-with-claude/prompt-engineering

### Claude Code
- Overview: code.claude.com/docs/en/overview
- Best practices: anthropic.com/engineering/claude-code-best-practices
- CLAUDE.md: claude.com/blog/using-claude-md-files + code.claude.com/docs/en/memory
- Hooks: claude.com/blog/how-to-configure-hooks + code.claude.com/docs/en/hooks-guide
- Plugins: claude.com/blog/claude-code-plugins + code.claude.com/docs/en/plugins
- Auto mode: claude.com/blog/auto-mode + anthropic.com/engineering/claude-code-auto-mode
- Subagents: claude.com/blog/subagents-in-claude-code + code.claude.com/docs/en/sub-agents
- Scaling: claude.com/blog/scaling-agentic-coding
- GitHub Actions: code.claude.com/docs/en/github-actions
- Security: claude.com/blog/beyond-permission-prompts-making-claude-code-more-secure-and-autonomous

### Plans & pricing
- Team plan: claude.com/blog/claude-team-updates
- Enterprise: claude.com/blog/self-serve-enterprise + claude.com/blog/claude-for-enterprise
- Max plan: claude.com/blog/max-plan
- Pricing: platform.claude.com/docs/en/about-claude/pricing

### Enterprise / Industry
- Financial services: anthropic.com/news/advancing-claude-for-financial-services + claude.com/blog/building-ai-agents-in-financial-services
- Healthcare: anthropic.com/news/healthcare-life-sciences + claude.com/blog/building-ai-agents-in-healthcare-and-life-sciences
- Education: anthropic.com/news/advancing-claude-for-education
- Excel/PowerPoint: claude.com/blog/claude-excel-powerpoint-updates
- Word: (Apr 10, 2026 — no Anthropic blog post yet, Thurrott coverage)
- Slack: claude.com/blog/claude-and-slack + claude.com/blog/claude-code-and-slack
- M365 Copilot: claude.com/blog/claude-now-available-in-microsoft-365-copilot

---

## Notes
- Last updated: 2026-04-13
- Created during initial audit session
- This is an ongoing task — update as new Anthropic content is published
