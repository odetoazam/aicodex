/**
 * Learning path membership map.
 * Tells us which learning path(s) an article belongs to,
 * its position, and the prev/next article slugs.
 */

export interface PathMembership {
  pathName: string
  pathHref: string
  accent: string
  stepNumber: number
  totalSteps: number
  prevSlug: string | null
  nextSlug: string | null
}

// Track 1: For yourself — 8 practical steps
const FOR_YOURSELF_STEPS = [
  'what-to-share-with-claude',
  'how-to-write-a-good-prompt',
  'what-ai-cant-do',
  'claude-common-mistakes',
  'claude-for-writing-and-editing',
  'using-claude-for-research',
  'claude-projects-role',
  'hallucination-failure',
  'claude-prompt-debugging',
  'managing-email-with-claude',
]

// Track 2: For your team — 8 steps (merged from ai-for-your-company + getting-your-team-started)
const FOR_YOUR_TEAM_STEPS = [
  'ai-roi-role',
  'what-to-automate-first',
  'running-your-first-ai-pilot',
  'system-prompt-role',
  'claude-projects-role',
  'connectors-skills-role',
  'hallucination-failure',
  'evals-role',
]

// Developer path — 17 steps
const DEV_STEPS = [
  'your-first-claude-api-call',
  'system-prompt-failure',
  'streaming-claude-responses-implementation',
  'building-a-rag-pipeline-from-scratch',
  'tool-use-process',
  'writing-evals-that-catch-regressions',
  'prompt-caching-implementation',
  'claude-cost-optimization',
  'tool-use-implementation-deep-dive',
  'multi-agent-orchestration-basics',
  'evaluating-multi-agent-systems',
  'chatbot-with-persistent-memory',
  'deploying-claude-app-production',
  'monitoring-your-claude-app',
  'claude-production-error-handling',
  'securing-your-claude-app',
  'nextauth-claude-integration',
  'supabase-conversation-history',
  'rate-limiting-claude-api',
  'nextjs-chatbot-claude-full-tutorial',
]

// Admin path — 15 steps
const ADMIN_STEPS = [
  'claude-admin-zero-to-one',
  'claude-team-vs-enterprise-for-it',
  'choosing-your-claude-plan',
  'claude-admin-setup',
  'ai-usage-policy-for-teams',
  'claude-admin-controls-2026',
  'ask-your-org-guide',
  'claude-projects-org-structure',
  'skills-setup-guide',
  'connectors-best-practices',
  'minimising-token-usage',
  'evals-role',
  'cowork-dispatch-guide',
  'managed-agents-for-your-org',
  'claude-admin-ongoing-maintenance',
]

// Claude Code path — 6 steps
const CLAUDE_CODE_STEPS = [
  'claude-code-project-setup',
  'claude-md-vs-hooks',
  'claude-md-templates',
  'claude-code-for-your-team',
  'claude-md-maintenance',
  'ai-agent-harness-explained',
]

// Internal AI Stack path — 8 steps
const INTERNAL_AI_STACK_STEPS = [
  'internal-mcp-server-explained',
  'ai-data-access-token-economics',
  'live-api-vs-etl-for-ai',
  'ai-agent-cold-start-caching',
  'data-warehouse-for-ai-agents',
  'ai-agent-access-control',
  'building-ai-skills-for-your-team',
  'internal-ai-stack-architecture',
]

// Forward Deployed Engineer path — 11 steps
// (role → market → career → portfolio → technical playbook → the engagement itself)
const FDE_STEPS = [
  'what-is-a-forward-deployed-engineer',
  'why-anthropic-openai-copied-palantir',
  'how-to-become-forward-deployed-engineer',
  'fde-portfolio-projects',
  'internal-mcp-server-explained',
  'mcp-production-agents',
  'ai-agent-access-control',
  'internal-ai-stack-architecture',
  'fde-scoping-an-engagement',
  'fde-when-client-data-is-bad',
  'fde-handoff-that-survives',
]

// AI Agent Manager path — 8 steps (the internal role: role → 90 days → wiring → evals → break → change → cost → ROI)
const AGENT_MANAGER_STEPS = [
  'what-is-an-agent-operator',
  'agent-operator-first-90-days',
  'wiring-internal-systems-to-agents',
  'how-to-evaluate-your-agents',
  'when-agents-break',
  'agent-change-management',
  'agent-operator-cost-control',
  'agent-operator-roi-reporting',
]

// Build-with-AI path — 10 steps (page still accessible, not in main index)
const BWAI_STEPS = [
  'what-to-build-with-claude',
  'solo-founder-operating-system',
  'validating-startup-idea-with-claude',
  'system-prompt-failure',
  'build-buy-prompt-early-stage',
  'ai-product-failure-modes-founders',
  'evals-role',
  'deploying-claude-app-production',
  'claude-production-error-handling',
  'pitching-ai-product-to-investors',
]

function buildMap(
  steps: string[],
  pathName: string,
  pathHref: string,
  accent: string,
  startAt: number = 1
): Record<string, PathMembership> {
  const map: Record<string, PathMembership> = {}
  for (let i = 0; i < steps.length; i++) {
    const slug = steps[i]
    map[slug] = {
      pathName,
      pathHref,
      accent,
      stepNumber: i + startAt,
      totalSteps: steps.length + (startAt - 1),
      prevSlug: i > 0 ? steps[i - 1] : null,
      nextSlug: i < steps.length - 1 ? steps[i + 1] : null,
    }
  }
  return map
}

const FOR_YOURSELF_MAP       = buildMap(FOR_YOURSELF_STEPS, 'Claude for Your Work', '/learn/claude', '#D4845A')
const FOR_YOUR_TEAM_MAP      = buildMap(FOR_YOUR_TEAM_STEPS, 'Rolling Out Claude to Your Team', '/learn/for-your-team', '#4CAF7D')
const DEV_MAP                = buildMap(DEV_STEPS, 'Developer Path', '/learn/developers', '#7B8FD4')
const BWAI_MAP               = buildMap(BWAI_STEPS, 'Build with AI', '/learn/build-with-ai', '#4CAF7D', 0)
const ADMIN_MAP              = buildMap(ADMIN_STEPS, 'Setting up Claude for your company', '/learn/claude-for-admins', '#5B8DD9')
const CLAUDE_CODE_MAP        = buildMap(CLAUDE_CODE_STEPS, 'Setting up Claude Code for your team', '/learn/claude-code', '#5DA698')
const INTERNAL_AI_STACK_MAP  = buildMap(INTERNAL_AI_STACK_STEPS, 'Building Your Internal AI Stack', '/learn/internal-ai-stack', '#4A7BA7')
const FDE_MAP                = buildMap(FDE_STEPS, 'Becoming a Forward Deployed Engineer', '/learn/forward-deployed-engineer', '#6E78D6')
const AGENT_MANAGER_MAP      = buildMap(AGENT_MANAGER_STEPS, 'Becoming an AI Agent Manager', '/learn/agent-manager', '#C28A3E')

/** Path → slug list map — used by /learn page for progress computation */
export const PATH_SLUGS: Record<string, string[]> = {
  '/learn/claude':              FOR_YOURSELF_STEPS,
  '/learn/for-your-team':       FOR_YOUR_TEAM_STEPS,
  '/learn/claude-for-admins':   ADMIN_STEPS,
  '/learn/claude-code':         CLAUDE_CODE_STEPS,
  '/learn/build-with-ai':       BWAI_STEPS,
  '/learn/developers':          DEV_STEPS,
  '/learn/internal-ai-stack':   INTERNAL_AI_STACK_STEPS,
  '/learn/forward-deployed-engineer': FDE_STEPS,
  '/learn/agent-manager':       AGENT_MANAGER_STEPS,
}

/**
 * Precedence (last wins on slug conflicts):
 * For Yourself → Build-with-AI → For Your Team → Admin → Claude Code → Developer Path
 * Developer path wins on shared articles (e.g. system-prompt-failure, deploying-claude-app-production).
 * For Your Team wins over For Yourself on shared articles (e.g. claude-projects-role, hallucination-failure).
 * Admin path wins on evals-role over For Your Team.
 * Claude Code path wins on claude-code-project-setup and ai-agent-harness-explained.
 */
export const ARTICLE_PATHS: Record<string, PathMembership> = {
  // FDE + Agent Manager placed first: their unique articles get these banners,
  // but shared technical articles (MCP server, access control, stack architecture)
  // are overridden below by Internal AI Stack, their home path.
  ...FDE_MAP,
  ...AGENT_MANAGER_MAP,
  ...FOR_YOURSELF_MAP,
  ...BWAI_MAP,
  ...FOR_YOUR_TEAM_MAP,        // wins over for-yourself on conflicts
  ...ADMIN_MAP,                // admin path wins on its articles
  ...CLAUDE_CODE_MAP,          // claude code path wins on its articles
  ...INTERNAL_AI_STACK_MAP,    // internal AI stack wins on its articles
  ...DEV_MAP,                  // developer path wins on conflicts
}
