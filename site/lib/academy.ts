/**
 * Claude Academy — Anthropic's official free training platform.
 * Launched as academy.claude.com on August 20, 2026 (anthropic.com/learn now redirects there).
 *
 * We link out to it generously. Academy teaches the product; AI Codex covers the job
 * around it. Where an article of ours overlaps with an official course, we say so and
 * send the reader there — being the honest map is worth more than hoarding the traffic.
 *
 * Every URL here was verified against the live /all catalog on 2026-08-20.
 */

export const ACADEMY_BASE = 'https://academy.claude.com'

export type AcademyResource = {
  /** Path on academy.claude.com, e.g. '/courses/claude-101' */
  path: string
  title: string
  /** 'Course' | 'Tutorial' | 'Use case' | 'Collection' */
  kind: string
  /** e.g. '13 lessons · 2.5 hr' */
  meta?: string
  /** One line, in our voice, on who this is actually for. */
  note: string
}

export const url = (r: AcademyResource) => `${ACADEMY_BASE}${r.path}`

// ── The full course catalog (22 courses as of 2026-08-20) ────────────────────

export const ACADEMY_COURSES: Record<string, AcademyResource> = {
  // AI fundamentals
  aiFluency: {
    path: '/courses/ai-fluency-framework-foundations',
    title: 'AI Fluency: Framework & Foundations',
    kind: 'Course',
    meta: '14 lessons · 4 hr',
    note: "Anthropic's 4D framework — Delegation, Description, Discernment, Diligence. The reference text for how they think about working with AI.",
  },
  aiCapabilities: {
    path: '/courses/ai-capabilities-and-limitations',
    title: 'AI Capabilities and Limitations',
    kind: 'Course',
    meta: '13 lessons · 3.5 hr',
    note: 'Next-token prediction, working memory, steerability, context limits. The best free explanation of why models behave the way they do.',
  },
  aiFluencyBuilders: {
    path: '/courses/ai-fluency-for-builders',
    title: 'AI Fluency for Builders',
    kind: 'Course',
    meta: '9 lessons · 3 hr',
    note: 'The 4D framework applied to owning a problem end to end, rather than to individual prompts.',
  },
  aiFluencySmallBusiness: {
    path: '/courses/ai-fluency-for-small-businesses',
    title: 'AI Fluency for Small Businesses',
    kind: 'Course',
    meta: '9 lessons · 4 hr',
    note: 'Research, customer data, and operations for owner-operators. Assumes no technical background.',
  },
  aiFluencyStudents: {
    path: '/courses/ai-fluency-for-students',
    title: 'AI Fluency for students',
    kind: 'Course',
    meta: '5 lessons · 3 hr',
    note: 'Learning, career planning, and academic integrity. Useful for anyone early in their career, not just enrolled students.',
  },
  aiFluencyNonprofits: {
    path: '/courses/ai-fluency-for-nonprofits',
    title: 'AI Fluency for nonprofits',
    kind: 'Course',
    meta: '9 lessons · 4 hr',
    note: 'Grant work, donor data, program measurement — with the mission-alignment questions built in.',
  },
  aiFluencyEducators: {
    path: '/courses/ai-fluency-for-educators',
    title: 'AI Fluency for educators',
    kind: 'Course',
    meta: '4 lessons · 1.5 hr',
    note: 'Course design and teaching practice for higher-ed faculty and instructional designers.',
  },
  aiFluencyK12: {
    path: '/courses/ai-fluency-for-k-12-educators',
    title: 'AI Fluency for pK–12 Educators',
    kind: 'Course',
    meta: '10 lessons · 3 hr',
    note: 'Built with Teach For America. Classroom-specific, including the student-integrity questions.',
  },
  aiFluencyTrainTrainer: {
    path: '/courses/ai-fluency-for-pk-12-train-the-trainer',
    title: 'AI Fluency for pK-12 Train the Trainer',
    kind: 'Course',
    meta: '4 lessons · 45 min',
    note: 'A ready-to-run workshop kit. Worth stealing the structure even if you are training a corporate team.',
  },
  teachingAiFluency: {
    path: '/courses/teaching-ai-fluency',
    title: 'Teaching AI Fluency',
    kind: 'Course',
    meta: '7 lessons · 4.5 hr',
    note: 'Assessment and assignment design for instructor-led settings. The closest thing to a train-the-trainer course for AI.',
  },

  // Product training
  claude101: {
    path: '/courses/claude-101',
    title: 'Claude 101',
    kind: 'Course',
    meta: '13 lessons · 2.5 hr',
    note: 'First conversation through Projects, Artifacts, Skills, and connected tools. The single best starting point for a non-technical user.',
  },
  cowork: {
    path: '/courses/introduction-to-claude-cowork',
    title: 'Introduction to Claude Cowork',
    kind: 'Course',
    meta: '14 lessons · 2.5 hr',
    note: 'Workspaces, context, task loops, and plugins. Required before you roll Cowork out to anyone.',
  },
  claudeCode101: {
    path: '/courses/claude-code-101',
    title: 'Claude Code 101',
    kind: 'Course',
    meta: '12 lessons · 1 hr',
    note: 'What Claude Code is and the core workflows. One hour, and it removes most first-week confusion.',
  },
  claudeCodeInAction: {
    path: '/courses/claude-code-in-action',
    title: 'Claude Code in Action',
    kind: 'Course',
    meta: '9 lessons · 1 hr',
    note: 'Long, hands-off sessions: steering, configuration, automation, verification. The follow-on to 101.',
  },
  platform101: {
    path: '/courses/claude-platform-101',
    title: 'Claude Platform 101',
    kind: 'Course',
    meta: '13 lessons · 1.5 hr',
    note: 'For developers who have made a few API calls or none. Console, keys, first requests.',
  },
  buildingWithApi: {
    path: '/courses/building-with-the-claude-api',
    title: 'Building with the Claude API',
    kind: 'Course',
    meta: '67 lessons · 9 hr',
    note: 'The big one. Prompting, tool use, RAG, agents, MCP, production patterns. Nine hours and worth every one of them.',
  },
  bedrock: {
    path: '/courses/claude-with-amazon-bedrock',
    title: 'Claude with Amazon Bedrock',
    kind: 'Course',
    meta: '65 lessons · 8 hr',
    note: 'The API course rebuilt for AWS. Take this one instead if Bedrock is where you deploy.',
  },
  vertex: {
    path: '/courses/claude-with-google-cloud-s-vertex-ai',
    title: "Claude with Google Cloud's Vertex AI",
    kind: 'Course',
    meta: '66 lessons · 8.5 hr',
    note: 'The API course rebuilt for GCP. Same content, Vertex plumbing.',
  },
  agentSkills: {
    path: '/courses/introduction-to-agent-skills',
    title: 'Introduction to agent skills',
    kind: 'Course',
    meta: '6 lessons · 1 hr',
    note: 'Creating your first Skill through team distribution and troubleshooting.',
  },
  mcp: {
    path: '/courses/introduction-to-model-context-protocol',
    title: 'Introduction to Model Context Protocol',
    kind: 'Course',
    meta: '10 lessons · 1 hr',
    note: 'Build MCP servers and clients with the Python SDK. Tools, resources, prompts.',
  },
  mcpAdvanced: {
    path: '/courses/model-context-protocol-advanced-topics',
    title: 'Model Context Protocol: Advanced Topics',
    kind: 'Course',
    meta: '11 lessons · 1.5 hr',
    note: 'Sampling, notifications, and roots, with interactive walkthroughs of each flow.',
  },
  subagents: {
    path: '/courses/introduction-to-subagents',
    title: 'Introduction to subagents',
    kind: 'Course',
    meta: '4 lessons · 45 min',
    note: 'Decomposing work across parallel Claude subagents and orchestrating them deterministically.',
  },
}

// ── Selected tutorials worth linking directly ────────────────────────────────

export const ACADEMY_TUTORIALS: Record<string, AcademyResource> = {
  enterpriseAdmin: {
    path: '/tutorials/claude-enterprise-administrator-guide',
    title: 'Claude Enterprise Administrator Guide',
    kind: 'Tutorial',
    note: 'The official admin walkthrough — SSO, roles, provisioning, policy.',
  },
  coworkAdmin: {
    path: '/tutorials/claude-cowork-enterprise-administrator-guide',
    title: 'Claude Cowork Enterprise Administrator Guide',
    kind: 'Tutorial',
    note: 'Cowork-specific admin setup for enterprise deployments.',
  },
  claudeCodeEnterprise: {
    path: '/tutorials/how-to-enable-claude-code-for-your-enterprise-team',
    title: 'How to enable Claude Code for your enterprise team',
    kind: 'Tutorial',
    note: 'The official rollout path for Claude Code inside an enterprise.',
  },
  chooseModel: {
    path: '/tutorials/choosing-the-right-claude-model',
    title: 'Choosing the right Claude model',
    kind: 'Tutorial',
    note: "Anthropic's own model-selection guidance.",
  },
  effortLevel: {
    path: '/tutorials/choosing-the-right-effort-level-in-claude-code',
    title: 'Choosing the right effort level in Claude Code',
    kind: 'Tutorial',
    note: 'How the effort setting changes latency, cost, and output quality.',
  },
  firstSkill: {
    path: '/tutorials/creating-your-first-skill',
    title: 'Creating your first skill',
    kind: 'Tutorial',
    note: 'The hands-on version of the Skills course.',
  },
  whatAreSkills: {
    path: '/tutorials/what-are-skills',
    title: 'What are Skills',
    kind: 'Tutorial',
    note: 'The concept explainer, five minutes.',
  },
  troubleshootSkills: {
    path: '/tutorials/troubleshooting-skills',
    title: 'Troubleshooting skills',
    kind: 'Tutorial',
    note: 'Why a Skill did not fire, and how to find out.',
  },
  connectors: {
    path: '/tutorials/getting-started-with-connectors',
    title: 'Getting started with connectors',
    kind: 'Tutorial',
    note: 'The official connector setup path.',
  },
  hallucinate: {
    path: '/tutorials/why-do-ai-models-hallucinate',
    title: 'Why do AI models hallucinate',
    kind: 'Tutorial',
    note: 'Short, accurate, and safe to send to a skeptical colleague.',
  },
  sycophancy: {
    path: '/tutorials/what-is-sycophancy-in-ai-models',
    title: 'What is sycophancy in AI models',
    kind: 'Tutorial',
    note: 'Why the model agrees with you, and why that is a problem.',
  },
  bias: {
    path: '/tutorials/why-does-bias-exist-in-ai-models',
    title: 'Why does bias exist in AI models',
    kind: 'Tutorial',
    note: 'Where bias enters, in plain language.',
  },
  trustAi: {
    path: '/tutorials/can-you-trust-what-ai-tells-you',
    title: 'Can you trust what AI tells you',
    kind: 'Tutorial',
    note: 'Verification proportional to stakes — the most useful single idea in the AI Fluency material.',
  },
  claudeSecurity: {
    path: '/tutorials/getting-started-with-claude-security',
    title: 'Getting started with Claude security',
    kind: 'Tutorial',
    note: 'The baseline security posture for a new deployment.',
  },
  aiPolicy: {
    path: '/use-cases/generate-an-ai-policy',
    title: 'Generate an AI policy',
    kind: 'Use case',
    note: 'A starting draft for an internal AI usage policy.',
  },
  diligenceStatement: {
    path: '/tutorials/writing-an-ai-diligence-statement',
    title: 'Writing an AI diligence statement',
    kind: 'Tutorial',
    note: 'How to disclose AI involvement in work you hand to colleagues or customers.',
  },
  managedAgents: {
    path: '/tutorials/what-is-claude-managed-agents',
    title: 'What is Claude Managed Agents',
    kind: 'Tutorial',
    note: 'The official concept explainer for Managed Agents.',
  },
  claudeTag: {
    path: '/tutorials/best-practices-using-claude-tag',
    title: 'Best practices using Claude Tag',
    kind: 'Tutorial',
    note: 'How to work with Claude in Slack without turning every channel into noise.',
  },
  excel: {
    path: '/tutorials/getting-started-with-claude-in-excel',
    title: 'Getting started with Claude in Excel',
    kind: 'Tutorial',
    note: 'The official Excel add-in walkthrough.',
  },
  curriculum: {
    path: '/tutorials/getting-good-at-claude-a-research-backed-curriculum',
    title: 'Getting good at Claude: a research-backed curriculum',
    kind: 'Tutorial',
    note: "Anthropic's own recommended learning order. Read this before you pick courses.",
  },
  projects: {
    path: '/tutorials/intro-to-projects',
    title: 'Intro to Projects',
    kind: 'Tutorial',
    note: 'Persistent workspaces with shared instructions and files. The feature most people never set up properly.',
  },
  artifacts: {
    path: '/tutorials/use-artifacts-to-visualize-and-create-ai-apps-without-ever-writing-a-line-of-code',
    title: 'Use Artifacts to visualize and create AI apps',
    kind: 'Tutorial',
    note: 'Building interactive outputs without writing code.',
  },
  artifactPrototypes: {
    path: '/tutorials/prototype-ai-powered-apps-with-claude-artifacts',
    title: 'Prototype AI-powered apps with Claude Artifacts',
    kind: 'Tutorial',
    note: 'The developer-facing version — working prototypes in an Artifact.',
  },
  design: {
    path: '/tutorials/using-claude-design-for-prototypes-and-ux',
    title: 'Using Claude Design for prototypes and UX',
    kind: 'Tutorial',
    note: 'The official walkthrough for Claude Design on interface work.',
  },
  designDecks: {
    path: '/tutorials/using-claude-design-for-presentations-and-slide-decks',
    title: 'Using Claude Design for presentations and slide decks',
    kind: 'Tutorial',
    note: 'Decks and one-pagers from a conversation.',
  },
  powerpoint: {
    path: '/tutorials/working-smarter-with-claude-in-powerpoint',
    title: 'Working smarter with Claude in PowerPoint',
    kind: 'Tutorial',
    note: 'The PowerPoint add-in, start to finish.',
  },
  memoryContext: {
    path: '/tutorials/parametric-memory-and-context',
    title: 'Parametric memory and context',
    kind: 'Tutorial',
    note: 'What the model knows from training versus what it holds in the window. The distinction that explains most memory confusion.',
  },
  tokensEmbeddings: {
    path: '/tutorials/tokens-and-embeddings',
    title: 'Tokens and embeddings',
    kind: 'Tutorial',
    note: 'The units your bill is denominated in, explained properly.',
  },
  whatHappens: {
    path: '/tutorials/what-happens-when-you-talk-to-ai',
    title: 'What happens when you talk to AI',
    kind: 'Tutorial',
    note: 'The request path, in plain language. Good for a non-technical colleague.',
  },
  whatAiKnows: {
    path: '/tutorials/what-does-ai-know-about-me',
    title: 'What does AI know about me',
    kind: 'Tutorial',
    note: 'The privacy explainer to send before someone asks.',
  },
  coworkOrChat: {
    path: '/tutorials/choosing-between-claude-cowork-or-chat',
    title: 'Choosing between Claude Cowork or chat',
    kind: 'Tutorial',
    note: 'The surface-selection question every new team asks in week one.',
  },
  coworkScaling: {
    path: '/tutorials/scaling-workflows-with-claude-cowork-at-your-organization',
    title: 'Scaling workflows with Cowork at your organization',
    kind: 'Tutorial',
    note: 'Moving from one person delegating tasks to a team doing it.',
  },
  effortCowork: {
    path: '/tutorials/how-to-select-the-right-effort-setting-for-claude-cowork-and-chat',
    title: 'Selecting the right effort setting for Cowork and chat',
    kind: 'Tutorial',
    note: 'The setting that quietly drives both quality and spend.',
  },
  teachSkills: {
    path: '/tutorials/teach-claude-your-way-of-working-using-skills',
    title: 'Teach Claude your way of working using Skills',
    kind: 'Tutorial',
    note: 'Encoding how your team does something, rather than what it does.',
  },
  shareSkills: {
    path: '/tutorials/sharing-skills',
    title: 'Sharing skills',
    kind: 'Tutorial',
    note: 'Distribution — the step most Skill libraries never reach.',
  },
  multiFileSkills: {
    path: '/tutorials/configuration-and-multi-file-skills',
    title: 'Configuration and multi-file skills',
    kind: 'Tutorial',
    note: 'Once one markdown file is not enough.',
  },
  skillsVsCodeFeatures: {
    path: '/tutorials/how-skills-compare-to-other-claude-code-features',
    title: 'How Skills compare to other Claude Code features',
    kind: 'Tutorial',
    note: 'Skills vs. CLAUDE.md vs. hooks vs. subagents — the disambiguation.',
  },
  research: {
    path: '/tutorials/using-research',
    title: 'Using Research',
    kind: 'Tutorial',
    note: 'Multi-step research runs and what to expect from them.',
  },
  smallBusiness: {
    path: '/tutorials/using-claude-for-your-small-business',
    title: 'Using Claude for your small business',
    kind: 'Tutorial',
    note: 'Owner-operator scale, no technical background assumed.',
  },
  financialServices: {
    path: '/tutorials/getting-started-with-claude-for-financial-services',
    title: 'Getting started with Claude for financial services',
    kind: 'Tutorial',
    note: 'The vertical build — connectors, skills, and the compliance shape.',
  },
  lifeSciences: {
    path: '/tutorials/getting-started-with-claude-for-life-sciences',
    title: 'Getting started with Claude for life sciences',
    kind: 'Tutorial',
    note: 'The vertical build for research and clinical work.',
  },
  desktopApp: {
    path: '/tutorials/navigating-the-claude-desktop-app',
    title: 'Navigating the Claude desktop app',
    kind: 'Tutorial',
    note: 'Orientation for the desktop surface.',
  },
  chrome: {
    path: '/tutorials/simplify-your-browsing-experience-with-claude-for-chrome',
    title: 'Claude for Chrome',
    kind: 'Tutorial',
    note: 'The browser surface, now folded into Cowork.',
  },
  createEditFiles: {
    path: '/tutorials/create-and-edit-files-with-claude-to-eliminate-hours-of-busy-work',
    title: 'Create and edit files with Claude',
    kind: 'Tutorial',
    note: 'Documents, spreadsheets, and decks produced directly rather than pasted.',
  },
  connectTools: {
    path: '/tutorials/connect-your-tools-to-unlock-a-smarter-more-capable-ai-companion',
    title: 'Connect your tools',
    kind: 'Tutorial',
    note: 'Why a connected Claude answers differently from an unconnected one.',
  },
  remoteControl: {
    path: '/tutorials/using-claude-code-remote-control',
    title: 'Using Claude Code remote control',
    kind: 'Tutorial',
    note: 'Driving a Claude Code session from another device.',
  },
}

// ── Mapping: our article slug → the official Academy resource(s) that cover
// the same ground. Rendered as a "Official Anthropic training" callout on the
// article page. Keep this honest — only map where Academy genuinely covers it.

export const ARTICLE_ACADEMY_LINKS: Record<string, AcademyResource[]> = {
  // Getting started / fluency
  'new-to-ai-start-here': [ACADEMY_COURSES.claude101, ACADEMY_COURSES.aiFluency],
  'first-week-with-claude': [ACADEMY_COURSES.claude101, ACADEMY_TUTORIALS.curriculum],
  'how-to-write-a-good-prompt': [ACADEMY_COURSES.aiFluency],
  'claude-common-mistakes': [ACADEMY_COURSES.aiCapabilities, ACADEMY_TUTORIALS.trustAi],
  'why-claude-feels-inconsistent': [ACADEMY_COURSES.aiCapabilities, ACADEMY_TUTORIALS.sycophancy],
  'claude-hallucination-prevention': [ACADEMY_TUTORIALS.hallucinate, ACADEMY_TUTORIALS.trustAi],
  'what-ai-cant-do': [ACADEMY_COURSES.aiCapabilities],
  'when-not-to-use-claude': [ACADEMY_COURSES.aiCapabilities],
  'what-to-share-with-claude': [ACADEMY_TUTORIALS.claudeSecurity],
  'prompt-engineering-for-operators': [ACADEMY_COURSES.aiFluency],
  'writing-system-prompts-that-work': [ACADEMY_COURSES.buildingWithApi],
  'claude-prompt-debugging': [ACADEMY_COURSES.aiFluency],

  // Model / plan selection
  'choosing-the-right-claude-model': [ACADEMY_TUTORIALS.chooseModel],
  'choosing-your-claude-plan': [ACADEMY_TUTORIALS.chooseModel],

  // Skills
  'skills-setup-guide': [ACADEMY_COURSES.agentSkills, ACADEMY_TUTORIALS.firstSkill],
  'building-ai-skills-for-your-team': [ACADEMY_COURSES.agentSkills, ACADEMY_TUTORIALS.troubleshootSkills],
  'cowork-skills-graveyard': [ACADEMY_TUTORIALS.troubleshootSkills, ACADEMY_COURSES.agentSkills],

  // Connectors
  'connectors-best-practices': [ACADEMY_TUTORIALS.connectors],
  'claude-everyday-connectors': [ACADEMY_TUTORIALS.connectors],
  'how-to-write-precise-connector-instructions': [ACADEMY_TUTORIALS.connectors],

  // Cowork
  'cowork-dispatch-guide': [ACADEMY_COURSES.cowork],
  'claude-cowork-adoption-metrics': [ACADEMY_COURSES.cowork, ACADEMY_TUTORIALS.coworkAdmin],
  'cowork-mobile-web': [ACADEMY_COURSES.cowork],

  // Claude Code
  'claude-code-for-operators': [ACADEMY_COURSES.claudeCode101],
  'claude-code-vs-web-app': [ACADEMY_COURSES.claudeCode101],
  'claude-code-project-setup': [ACADEMY_COURSES.claudeCodeInAction],
  'claude-code-for-your-team': [ACADEMY_TUTORIALS.claudeCodeEnterprise, ACADEMY_COURSES.claudeCode101],
  'claude-code-antipatterns': [ACADEMY_COURSES.claudeCodeInAction, ACADEMY_TUTORIALS.effortLevel],
  'claude-md-vs-hooks': [ACADEMY_TUTORIALS.skillsVsCodeFeatures, ACADEMY_COURSES.claudeCodeInAction],
  'claude-code-parallel-agents': [ACADEMY_COURSES.subagents],
  'claude-code-agent-teams': [ACADEMY_COURSES.subagents],
  'claude-code-dynamic-workflows': [ACADEMY_COURSES.subagents],
  'claude-agents-command': [ACADEMY_COURSES.subagents],

  // API / developer
  'your-first-claude-api-call': [ACADEMY_COURSES.platform101, ACADEMY_COURSES.buildingWithApi],
  'building-a-rag-pipeline-from-scratch': [ACADEMY_COURSES.buildingWithApi],
  'tool-use-implementation-deep-dive': [ACADEMY_COURSES.buildingWithApi],
  'streaming-claude-responses-implementation': [ACADEMY_COURSES.buildingWithApi],
  'prompt-caching-implementation': [ACADEMY_COURSES.buildingWithApi],
  'deploying-claude-app-production': [ACADEMY_COURSES.buildingWithApi],
  'multi-agent-orchestration-basics': [ACADEMY_COURSES.subagents, ACADEMY_COURSES.buildingWithApi],
  'claude-managed-agents': [ACADEMY_TUTORIALS.managedAgents],
  'claude-managed-agents-memory': [ACADEMY_TUTORIALS.managedAgents],
  'claude-managed-agents-multiagent': [ACADEMY_TUTORIALS.managedAgents],
  'claude-managed-agents-self-hosted': [ACADEMY_TUTORIALS.managedAgents],
  'managed-agents-for-your-org': [ACADEMY_TUTORIALS.managedAgents],

  // MCP
  'mcp-for-operators': [ACADEMY_COURSES.mcp],
  'internal-mcp-server-explained': [ACADEMY_COURSES.mcp, ACADEMY_COURSES.mcpAdvanced],
  'mcp-production-agents': [ACADEMY_COURSES.mcpAdvanced],
  'mcp-spec-2026-07-28': [ACADEMY_COURSES.mcpAdvanced],

  // Admin
  'claude-admin-zero-to-one': [ACADEMY_TUTORIALS.enterpriseAdmin],
  'claude-admin-setup': [ACADEMY_TUTORIALS.enterpriseAdmin],
  'claude-admin-security-privacy': [ACADEMY_TUTORIALS.enterpriseAdmin, ACADEMY_TUTORIALS.claudeSecurity],
  'claude-team-vs-enterprise-for-it': [ACADEMY_TUTORIALS.enterpriseAdmin],
  'claude-admin-ongoing-maintenance': [ACADEMY_TUTORIALS.enterpriseAdmin],
  'setting-up-claude-for-your-team': [ACADEMY_TUTORIALS.enterpriseAdmin],
  'claude-security': [ACADEMY_TUTORIALS.claudeSecurity],
  'ai-usage-policy-for-teams': [ACADEMY_TUTORIALS.aiPolicy, ACADEMY_TUTORIALS.diligenceStatement],
  'ai-usage-policy-template': [ACADEMY_TUTORIALS.aiPolicy],
  'what-to-tell-clients-about-ai': [ACADEMY_TUTORIALS.diligenceStatement],

  // Tag / Slack
  'claude-tag': [ACADEMY_TUTORIALS.claudeTag],
  'claude-plus-slack-for-teams': [ACADEMY_TUTORIALS.claudeTag],

  // Role & vertical
  'claude-for-finance-teams': [ACADEMY_TUTORIALS.excel],
  'claude-plus-google-sheets': [ACADEMY_TUTORIALS.excel],

  // Foundation concepts — Academy's AI Capabilities course is the reference
  'context-window-def': [ACADEMY_COURSES.aiCapabilities, ACADEMY_TUTORIALS.memoryContext],
  'context-window-role': [ACADEMY_COURSES.aiCapabilities],
  'context-window-practical': [ACADEMY_COURSES.aiCapabilities, ACADEMY_TUTORIALS.memoryContext],
  'large-language-model-def': [ACADEMY_COURSES.aiCapabilities, ACADEMY_TUTORIALS.whatHappens],
  'token-def': [ACADEMY_TUTORIALS.tokensEmbeddings],
  'temperature-def': [ACADEMY_COURSES.aiCapabilities],
  'fine-tuning-def': [ACADEMY_COURSES.aiCapabilities],
  'adaptive-thinking-def': [ACADEMY_TUTORIALS.effortLevel],
  'constitutional-ai-def': [ACADEMY_COURSES.aiCapabilities],
  'hallucination-def': [ACADEMY_TUTORIALS.hallucinate],
  'hallucination-role': [ACADEMY_TUTORIALS.hallucinate, ACADEMY_TUTORIALS.trustAi],
  'hallucination-failure': [ACADEMY_TUTORIALS.hallucinate],
  'extended-thinking-role': [ACADEMY_TUTORIALS.effortLevel],
  'extended-thinking-practical': [ACADEMY_TUTORIALS.effortLevel],

  // Prompting
  'system-prompt-def': [ACADEMY_COURSES.aiFluency],
  'system-prompt-role': [ACADEMY_COURSES.aiFluency],
  'system-prompt-failure': [ACADEMY_COURSES.aiFluency],

  // Core product surfaces
  'claude-operator-habits': [ACADEMY_COURSES.claude101, ACADEMY_TUTORIALS.curriculum],
  'claude-projects-role': [ACADEMY_TUTORIALS.projects],
  'claude-projects-org-structure': [ACADEMY_TUTORIALS.projects],
  'solo-founder-project-setup': [ACADEMY_TUTORIALS.projects],
  'claude-artifacts-guide': [ACADEMY_TUTORIALS.artifacts, ACADEMY_TUTORIALS.artifactPrototypes],
  'claude-memory-guide': [ACADEMY_TUTORIALS.memoryContext],
  'claude-memory-practical': [ACADEMY_TUTORIALS.memoryContext],
  'deep-research-guide': [ACADEMY_TUTORIALS.research],
  'deep-research-practical': [ACADEMY_TUTORIALS.research],
  'using-claude-for-research': [ACADEMY_TUTORIALS.research],
  'claude-design': [ACADEMY_TUTORIALS.design, ACADEMY_TUTORIALS.designDecks],
  'claude-for-creative-work': [ACADEMY_TUTORIALS.designDecks],
  'claude-for-microsoft-365': [ACADEMY_TUTORIALS.powerpoint, ACADEMY_TUTORIALS.excel],
  'claude-for-word': [ACADEMY_TUTORIALS.createEditFiles],
  'claude-for-writing-and-editing': [ACADEMY_TUTORIALS.createEditFiles],
  'connectors-skills-role': [ACADEMY_TUTORIALS.connectTools, ACADEMY_COURSES.agentSkills],
  'claude-session-economics': [ACADEMY_TUTORIALS.effortCowork, ACADEMY_TUTORIALS.tokensEmbeddings],
  'minimising-token-usage': [ACADEMY_TUTORIALS.tokensEmbeddings, ACADEMY_TUTORIALS.effortCowork],

  // Skills, deeper
  'building-claude-powered-deliverable': [ACADEMY_TUTORIALS.teachSkills],
  'claude-md-maintenance': [ACADEMY_TUTORIALS.skillsVsCodeFeatures],
  'claude-md-templates': [ACADEMY_TUTORIALS.skillsVsCodeFeatures],

  // Claude Code
  'claude-code-routines': [ACADEMY_COURSES.claudeCodeInAction],
  'claude-code-client-setup': [ACADEMY_TUTORIALS.claudeCodeEnterprise],
  'claude-code-may-2026-updates': [ACADEMY_COURSES.claudeCodeInAction],
  'claude-code-june-2026-updates': [ACADEMY_COURSES.claudeCodeInAction],
  'claude-code-august-2026-updates': [ACADEMY_COURSES.claudeCodeInAction, ACADEMY_TUTORIALS.effortLevel],
  'ultraplan-def': [ACADEMY_COURSES.claudeCodeInAction],
  'monitor-tool-def': [ACADEMY_COURSES.claudeCodeInAction],

  // Agents & orchestration
  'ai-agent-def': [ACADEMY_COURSES.subagents, ACADEMY_COURSES.buildingWithApi],
  'tool-use-def': [ACADEMY_COURSES.buildingWithApi],
  'tool-use-process': [ACADEMY_COURSES.buildingWithApi],
  'advisor-tool-def': [ACADEMY_COURSES.subagents],
  'claude-advisor-tool': [ACADEMY_COURSES.subagents],
  'ai-agent-harness-explained': [ACADEMY_COURSES.buildingWithApi],
  'chatbot-with-persistent-memory': [ACADEMY_COURSES.buildingWithApi],
  'evaluating-multi-agent-systems': [ACADEMY_COURSES.subagents],
  'computer-use-browser-use-ga': [ACADEMY_COURSES.buildingWithApi],
  'managed-agents-budgets-guardrails': [ACADEMY_TUTORIALS.managedAgents],

  // Retrieval
  'rag-def': [ACADEMY_COURSES.buildingWithApi],
  'rag-role': [ACADEMY_COURSES.buildingWithApi],
  'rag-failure': [ACADEMY_COURSES.buildingWithApi],

  // Evals
  'evals-def': [ACADEMY_COURSES.buildingWithApi],
  'evals-role': [ACADEMY_COURSES.buildingWithApi],
  'writing-evals-that-catch-regressions': [ACADEMY_COURSES.buildingWithApi],

  // Developer / production
  'securing-your-claude-app': [ACADEMY_TUTORIALS.claudeSecurity, ACADEMY_COURSES.buildingWithApi],
  'claude-production-error-handling': [ACADEMY_COURSES.buildingWithApi],
  'claude-streaming-decision': [ACADEMY_COURSES.buildingWithApi],
  'rate-limiting-claude-api': [ACADEMY_COURSES.buildingWithApi],
  'claude-rate-limits-api': [ACADEMY_COURSES.buildingWithApi],
  'claude-cost-optimization': [ACADEMY_COURSES.buildingWithApi, ACADEMY_TUTORIALS.tokensEmbeddings],
  'prompt-caching-process': [ACADEMY_COURSES.buildingWithApi],
  'prompt-caching-role': [ACADEMY_COURSES.buildingWithApi],
  'streaming-def': [ACADEMY_COURSES.buildingWithApi],
  'monitoring-your-claude-app': [ACADEMY_COURSES.buildingWithApi],
  'ant-cli': [ACADEMY_COURSES.platform101],

  // Models & pricing
  'claude-opus-5': [ACADEMY_TUTORIALS.chooseModel],
  'claude-sonnet-5': [ACADEMY_TUTORIALS.chooseModel],
  'claude-opus-4-8': [ACADEMY_TUTORIALS.chooseModel],
  'claude-opus-4-7': [ACADEMY_TUTORIALS.chooseModel],
  'claude-fable-5': [ACADEMY_TUTORIALS.chooseModel],
  'migrating-to-claude-4-7': [ACADEMY_TUTORIALS.chooseModel],
  'when-your-ai-model-disappears': [ACADEMY_TUTORIALS.chooseModel],

  // Admin & rollout
  'claude-admin-controls-2026': [ACADEMY_TUTORIALS.enterpriseAdmin],
  'claude-compliance-api': [ACADEMY_TUTORIALS.enterpriseAdmin],
  'claude-enterprise-cost-controls': [ACADEMY_TUTORIALS.enterpriseAdmin, ACADEMY_TUTORIALS.effortCowork],
  'rolling-out-claude-across-teams': [ACADEMY_TUTORIALS.coworkScaling, ACADEMY_COURSES.aiFluency],
  'claude-adoption-plateau': [ACADEMY_TUTORIALS.coworkScaling],
  'claude-for-new-hire-onboarding': [ACADEMY_COURSES.claude101, ACADEMY_COURSES.aiFluency],

  // Verticals & roles
  'claude-for-small-business': [ACADEMY_TUTORIALS.smallBusiness, ACADEMY_COURSES.aiFluencySmallBusiness],
  'claude-finance-agents': [ACADEMY_TUTORIALS.financialServices],
  'claude-science': [ACADEMY_TUTORIALS.lifeSciences],
  'claude-for-engineering-teams': [ACADEMY_COURSES.claudeCode101],
  'claude-for-data-teams': [ACADEMY_TUTORIALS.excel],
  'claude-for-hr-teams': [ACADEMY_TUTORIALS.excel],

  // Integrations — the generic connector path
  'claude-plus-google-docs': [ACADEMY_TUTORIALS.createEditFiles],
  'claude-plus-figma': [ACADEMY_TUTORIALS.design],
}

export function academyLinksFor(slug: string): AcademyResource[] {
  return ARTICLE_ACADEMY_LINKS[slug] ?? []
}

// ── Role-ordered reading tracks: which Academy courses matter for each of the
// roles AI Codex writes for, in the order we would take them.

export type AcademyTrack = {
  id: string
  role: string
  blurb: string
  /** Our learning path that pairs with this track */
  ourPath?: { label: string; href: string }
  steps: { resource: AcademyResource; why: string }[]
  /** What the track leaves out — the gap we cover. */
  gap: string
}

export const ACADEMY_TRACKS: AcademyTrack[] = [
  {
    id: 'agent-manager',
    role: 'AI Agent Manager',
    blurb: 'You are the person at your company responsible for AI actually working. Academy gets you fluent in the products; the operating problems are yours.',
    ourPath: { label: 'AI Agent Manager path', href: '/learn/agent-manager' },
    steps: [
      { resource: ACADEMY_COURSES.aiFluency, why: 'The shared vocabulary. You will be explaining delegation and verification to non-technical colleagues for the next year.' },
      { resource: ACADEMY_COURSES.claude101, why: 'You cannot support users on features you have not used. Two and a half hours.' },
      { resource: ACADEMY_COURSES.cowork, why: 'Cowork is where most internal agent work now happens. Take this before you enable it for anyone.' },
      { resource: ACADEMY_COURSES.agentSkills, why: 'Skills are how you encode your company knowledge. This is the mechanic.' },
      { resource: ACADEMY_TUTORIALS.enterpriseAdmin, why: 'Roles, provisioning, policy. The controls you will be asked about in your first security review.' },
      { resource: ACADEMY_TUTORIALS.managedAgents, why: 'The concept explainer for the thing your CEO read about and wants deployed.' },
    ],
    gap: 'Nothing in the catalog covers what to do when adoption plateaus at 30%, how to defend the spend to a CFO, or how to run an eval suite that catches a regression before your users do.',
  },
  {
    id: 'fde',
    role: 'Forward Deployed Engineer',
    blurb: 'You build agent systems inside someone else\'s company. Academy gives you the product depth; the client-facing craft is not taught anywhere.',
    ourPath: { label: 'FDE career path', href: '/learn/forward-deployed-engineer' },
    steps: [
      { resource: ACADEMY_COURSES.buildingWithApi, why: 'Nine hours, 67 lessons. This is the single highest-value free thing on the internet for this role.' },
      { resource: ACADEMY_COURSES.mcp, why: 'Every FDE engagement ends up wiring a client system to Claude. MCP is the shape that takes.' },
      { resource: ACADEMY_COURSES.mcpAdvanced, why: 'Sampling and roots come up the moment a client asks for something non-trivial.' },
      { resource: ACADEMY_COURSES.claudeCodeInAction, why: 'You will be running long unattended sessions on unfamiliar codebases. This is how not to lose an afternoon.' },
      { resource: ACADEMY_COURSES.subagents, why: 'Decomposition is the difference between a demo and a system.' },
      { resource: ACADEMY_COURSES.bedrock, why: 'Take this instead of the base API course if your clients deploy on AWS. Same content, correct plumbing.' },
    ],
    gap: 'No course teaches you how to scope an engagement, what to do when the client\'s data is worse than they said, or how to hand a system over so it survives your departure. We wrote those three, because naming a gap and not filling it is just marketing.',
  },
  {
    id: 'admin',
    role: 'IT / admin',
    blurb: 'You are deploying Claude to an organization. Academy has the official configuration path; the procurement and governance fights are elsewhere.',
    ourPath: { label: 'IT / admin path', href: '/learn/claude-for-admins' },
    steps: [
      { resource: ACADEMY_TUTORIALS.enterpriseAdmin, why: 'Start here. The official configuration walkthrough.' },
      { resource: ACADEMY_TUTORIALS.claudeSecurity, why: 'The baseline posture, in Anthropic\'s own words — useful to cite in a review.' },
      { resource: ACADEMY_TUTORIALS.coworkAdmin, why: 'Cowork has its own admin surface. Do not assume it inherits your claude.ai settings.' },
      { resource: ACADEMY_TUTORIALS.claudeCodeEnterprise, why: 'The rollout path for Claude Code, including the permission model.' },
      { resource: ACADEMY_TUTORIALS.aiPolicy, why: 'A usable first draft of an internal AI policy.' },
      { resource: ACADEMY_COURSES.aiFluency, why: 'Take it so you can run the internal training yourself instead of buying it.' },
    ],
    gap: 'Nothing covers building the business case, getting security sign-off from a team that has already said no once, or what your renewal conversation looks like in month eleven.',
  },
  {
    id: 'developer',
    role: 'Developer',
    blurb: 'You are shipping something on the API. Academy is genuinely excellent here — this is the strongest part of the catalog.',
    ourPath: { label: 'Developer path', href: '/learn/developers' },
    steps: [
      { resource: ACADEMY_COURSES.platform101, why: 'Ninety minutes to get oriented in the Console and make correct first requests.' },
      { resource: ACADEMY_COURSES.buildingWithApi, why: 'The main event. Prompting through production patterns.' },
      { resource: ACADEMY_COURSES.agentSkills, why: 'Skills are now GA on the API. This is the shortest path to using them properly.' },
      { resource: ACADEMY_COURSES.mcp, why: 'Build a server from scratch rather than copying a template you do not understand.' },
      { resource: ACADEMY_COURSES.subagents, why: 'Orchestration patterns that hold up past the first demo.' },
      { resource: ACADEMY_COURSES.claudeCodeInAction, why: 'Because you will spend more hours in Claude Code than in the API this year.' },
    ],
    gap: 'The courses stop at "it works." Rate-limit behaviour under real load, error taxonomies, cost blowups, and eval suites that catch regressions are not covered.',
  },
  {
    id: 'individual',
    role: 'Using Claude at work',
    blurb: 'You are not deploying anything. You want to be good at this. Academy is the right place to start and you should start today.',
    ourPath: { label: 'Working with Claude path', href: '/learn/claude' },
    steps: [
      { resource: ACADEMY_TUTORIALS.curriculum, why: 'Read this first — it is Anthropic\'s own recommended order, and it is short.' },
      { resource: ACADEMY_COURSES.claude101, why: 'The best two and a half hours you can spend on this.' },
      { resource: ACADEMY_COURSES.aiFluency, why: 'The framework that makes the habits stick after the novelty wears off.' },
      { resource: ACADEMY_COURSES.aiCapabilities, why: 'Once you know why the model behaves as it does, most frustration stops.' },
      { resource: ACADEMY_TUTORIALS.trustAi, why: 'Verification proportional to stakes. The single most useful idea in the whole catalog.' },
      { resource: ACADEMY_COURSES.cowork, why: 'When you are ready to hand over whole tasks rather than single questions.' },
    ],
    gap: 'Courses teach capability, not habit. What is missing is the part where you keep doing it in week six, and what to do when your team does not.',
  },
]
