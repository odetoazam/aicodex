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
  'how-to-write-a-good-prompt',
  'what-ai-cant-do',
  'claude-common-mistakes',
  'claude-for-writing-and-editing',
  'using-claude-for-research',
  'claude-projects-role',
  'hallucination-failure',
  'claude-prompt-debugging',
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
  'chatbot-with-persistent-memory',
  'deploying-claude-app-production',
  'claude-production-error-handling',
  'nextauth-claude-integration',
  'supabase-conversation-history',
  'rate-limiting-claude-api',
  'nextjs-chatbot-claude-full-tutorial',
]

// Admin path — 10 steps
const ADMIN_STEPS = [
  'claude-admin-zero-to-one',
  'choosing-your-claude-plan',
  'claude-admin-setup',
  'claude-projects-org-structure',
  'skills-setup-guide',
  'connectors-best-practices',
  'minimising-token-usage',
  'evals-role',
  'cowork-dispatch-guide',
  'managed-agents-for-your-org',
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

const FOR_YOURSELF_MAP  = buildMap(FOR_YOURSELF_STEPS, 'Claude for Your Work', '/learn/claude', '#D4845A')
const FOR_YOUR_TEAM_MAP = buildMap(FOR_YOUR_TEAM_STEPS, 'Rolling Out Claude to Your Team', '/learn/for-your-team', '#4CAF7D')
const DEV_MAP           = buildMap(DEV_STEPS, 'Developer Path', '/learn/developers', '#7B8FD4')
const BWAI_MAP          = buildMap(BWAI_STEPS, 'Build with AI', '/learn/build-with-ai', '#4CAF7D', 0)
const ADMIN_MAP         = buildMap(ADMIN_STEPS, 'Setting up Claude for your company', '/learn/claude-for-admins', '#5B8DD9')

/**
 * Precedence (last wins on slug conflicts):
 * For Yourself → Build-with-AI → For Your Team → Admin → Developer Path
 * Developer path wins on shared articles (e.g. system-prompt-failure, deploying-claude-app-production).
 * For Your Team wins over For Yourself on shared articles (e.g. claude-projects-role, hallucination-failure).
 * Admin path wins on evals-role over For Your Team.
 */
export const ARTICLE_PATHS: Record<string, PathMembership> = {
  ...FOR_YOURSELF_MAP,
  ...BWAI_MAP,
  ...FOR_YOUR_TEAM_MAP, // wins over for-yourself on conflicts
  ...ADMIN_MAP,         // admin path wins on its articles
  ...DEV_MAP,           // developer path wins on conflicts
}
