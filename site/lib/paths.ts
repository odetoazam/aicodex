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

// Claude intro path — 8 steps (beginner)
const CLAUDE_INTRO_STEPS = [
  'large-language-model-def',
  'context-window-def',
  'token-def',
  'system-prompt-def',
  'constitutional-ai-def',
  'hallucination-def',
  'rag-def',
  'ai-agent-def',
]

// AI for your company path — 7 steps (ops leaders / founders)
const AI_FOR_COMPANY_STEPS = [
  'ai-roi-role',
  'what-to-automate-first',
  'running-your-first-ai-pilot',
  'ai-pilot-failure',
  'system-prompt-failure',
  'claude-projects-role',
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

// Build-with-AI path — 10 steps (step 0 through 9)
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

const CLAUDE_INTRO_MAP    = buildMap(CLAUDE_INTRO_STEPS, 'How Claude Works', '/learn/claude', '#D4845A')
const AI_FOR_COMPANY_MAP  = buildMap(AI_FOR_COMPANY_STEPS, 'AI for Your Company', '/learn/ai-for-your-company', '#5AAFD4')
const DEV_MAP             = buildMap(DEV_STEPS, 'Developer Path', '/learn/developers', '#7B8FD4')
const BWAI_MAP            = buildMap(BWAI_STEPS, 'Build with AI', '/learn/build-with-ai', '#4CAF7D', 0)

/**
 * Precedence (last wins on slug conflicts):
 * Claude Intro → AI for Company → Build-with-AI → Developer Path
 * Developer path wins on shared articles (e.g. system-prompt-failure, deploying-claude-app-production).
 */
export const ARTICLE_PATHS: Record<string, PathMembership> = {
  ...CLAUDE_INTRO_MAP,
  ...AI_FOR_COMPANY_MAP,
  ...BWAI_MAP,
  ...DEV_MAP, // Developer path wins on conflicts
}
