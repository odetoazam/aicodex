/**
 * Cofounder dashboard data.
 *
 * Milestones, phases, and session wins. Edited by hand and by the /cofounder
 * skill after major sessions. The site queries this file for the dashboard.
 *
 * Keep entries terse. The dashboard renders them densely.
 */

export type Milestone = {
  id: string
  title: string
  target: string            // human-readable target ("1,000 monthly active readers")
  current: number | null    // current progress toward target (null = qualitative, not numeric)
  targetValue: number | null // numeric target if applicable
  unit?: string             // "readers", "subs", "$", etc.
  status: 'locked' | 'in-flight' | 'close' | 'hit'
  unlocks: string           // what this milestone unlocks next
}

export type Phase = {
  id: string
  label: string
  description: string
  status: 'shipped' | 'active' | 'next' | 'later'
}

export type Win = {
  date: string            // YYYY-MM-DD
  headline: string        // short — "Newsletter pipeline shipped"
  detail: string          // one sentence
}

export type FocusItem = {
  title: string           // "Ship first newsletter issue"
  why: string             // one sentence — why this matters now
  blockedBy?: string      // optional — what's blocking
}

// ─── The vision, in one line ──────────────────────────────────────────────

export const VISION = {
  oneLine: 'The practitioner layer for AI at work — so anyone using Claude gets real value from it, and pays for depth when they want more.',
  northStar: 'Role-specific paid courses (CS → Operators → Power User → Marketing → Finance) powered by the free editorial layer, with a team licensing tier for B2B.',
}

// ─── Strategic phases ─────────────────────────────────────────────────────

export const PHASES: Phase[] = [
  {
    id: 'foundation',
    label: 'Foundation',
    description: 'Site, 150+ articles across 5 personas, learning paths, glossary, integrations page, tools. Authenticated users, save + read tracking.',
    status: 'shipped',
  },
  {
    id: 'editorial',
    label: 'Editorial voice',
    description: 'Persona-driven content, advisor retros, failure-mode framing, Priya–Marcus–James org arc, the "complement Anthropic" positioning.',
    status: 'shipped',
  },
  {
    id: 'distribution',
    label: 'Distribution + return mechanic',
    description: 'Newsletter pipeline shipped (Resend + Supabase). First issue not yet sent. Domain verification in progress. Return mechanic unblocks when first issue lands.',
    status: 'active',
  },
  {
    id: 'skill-modules',
    label: 'Skill modules (Diaz pattern)',
    description: 'Two modules shipped: influence article (Scenario → Task → What good looks like → Common mistake) + business case article (the Friday proposal rep). Replication continues across top how-to articles.',
    status: 'active',
  },
  {
    id: 'traffic',
    label: 'Traffic + community',
    description: 'Zero organic today. Shareable callouts on 3 articles (April 19). LinkedIn/community experiments + first newsletter issue are the seeds.',
    status: 'next',
  },
  {
    id: 'monetization',
    label: 'Monetization',
    description: 'Free until 1K+ MAU. Then: role-specific courses ($49-97), B2B team dashboard ($2-5K/year). Course priority: CS Teams → Operators → Power User → Marketing → Finance.',
    status: 'later',
  },
]

// ─── Milestones (the things that unlock the next phase) ───────────────────

export const MILESTONES: Milestone[] = [
  {
    id: 'first-newsletter-sent',
    title: 'First newsletter issue sent',
    target: 'One issue shipped to the audience',
    current: 0,
    targetValue: 1,
    unit: 'issue',
    status: 'in-flight',
    unlocks: 'Tom\'s return mechanic. Reader retention data.',
  },
  {
    id: 'newsletter-subs',
    title: 'First 100 newsletter subscribers',
    target: '100 real (non-test) subscribers',
    current: 0,
    targetValue: 100,
    unit: 'subscribers',
    status: 'in-flight',
    unlocks: 'Enough signal to A/B subject lines. Audience worth promoting.',
  },
  {
    id: 'monthly-actives',
    title: '1,000 monthly active readers',
    target: '1K+ MAU for 3 consecutive months',
    current: 0,
    targetValue: 1000,
    unit: 'MAU',
    status: 'locked',
    unlocks: 'Paid course tier. Monetization phase begins.',
  },
  {
    id: 'path-completions',
    title: '500 path completions',
    target: '500 users who finished a learning path',
    current: 0,
    targetValue: 500,
    unit: 'completions',
    status: 'locked',
    unlocks: 'Certificates infrastructure. Quiz system worth building.',
  },
  {
    id: 'first-paying-customer',
    title: 'First paying customer',
    target: 'Any paid tier — individual course or team license',
    current: 0,
    targetValue: 1,
    unit: 'customer',
    status: 'locked',
    unlocks: 'Proof the monetization model works. Course production ramps up.',
  },
  {
    id: 'domain-verified',
    title: 'aicodex.to verified on Resend',
    target: 'DNS records propagated, sender verified',
    current: null,
    targetValue: null,
    status: 'in-flight',
    unlocks: 'First newsletter issue can send from newsletter@aicodex.to.',
  },
  {
    id: 'azam-team-onboarding-story',
    title: 'Team onboarding article from Azam\'s Distru rollout',
    target: 'Real-story article shipped',
    current: null,
    targetValue: null,
    status: 'in-flight',
    unlocks: 'Highest-authenticity content on the site. Sarah says shareable.',
  },
]

// ─── Focus now: 2–3 items max. What's being pushed this week. ─────────────

export const FOCUS_NOW: FocusItem[] = [
  {
    title: 'Ship first newsletter issue',
    why: 'Copy is live, pipeline is live. The promise ("one thing most people haven\'t figured out yet") stays theoretical until #1 lands.',
    blockedBy: 'aicodex.to domain verification on Resend (pending DNS propagation)',
  },
  {
    title: 'Team onboarding article from Distru rollout',
    why: 'Highest-authenticity content we could have. Sarah: shareable. Waiting on Azam\'s real-story input.',
    blockedBy: 'Azam sharing the rollout story (first Slack messages, who used it, who stopped)',
  },
  {
    title: 'Path completion indicators on /learn',
    why: 'Cassie\'s #2. user_progress table exists. Users who finish a path have no visible signal they did. Checkmark/progress markers add the return-mechanic loop Tom keeps asking about.',
  },
]

// ─── Recent wins (session log — appended by /cofounder after major work) ──
// Most-recent first. Keep to ~12 entries; rotate older into memory/retro.md.

export const WINS: Win[] = [
  {
    date: '2026-04-19',
    headline: 'Selection protocol codified in /cofounder',
    detail: 'Metric check → lens scoring (Sarah/Tom/Diaz/phase-critical) → tiebreak = most-deferred. Cofounder now has an algorithm, not just a list.',
  },
  {
    date: '2026-04-19',
    headline: 'Diaz skill module #2: the Friday proposal',
    detail: 'building-a-business-case-for-claude now has Scenario → Task → What good looks like → Common mistake. Second module shipped.',
  },
  {
    date: '2026-04-19',
    headline: 'Numeric thresholds audit completed',
    detail: 'securing-your-claude-app + your-first-claude-api-call patched with earned thresholds. RAG article already had them. prompt-caching already had them.',
  },
  {
    date: '2026-04-19',
    headline: 'Resend signup pipeline live in prod',
    detail: 'Every /api/subscribe now writes to Supabase + adds to Resend "AI Codex Weekly" audience. Single opt-in. Verified end-to-end.',
  },
  {
    date: '2026-04-19',
    headline: 'First full Diaz skill module shipped',
    detail: 'influencing-ai-adoption-without-authority — Raj\'s long-outstanding #1 request. Includes the "hallway conversation" rep.',
  },
  {
    date: '2026-04-19',
    headline: 'Shareable screenshot callouts on 3 articles',
    detail: 'claude-operator-habits, claude-common-mistakes, running-your-first-ai-pilot. Numbered blocks with claim endings.',
  },
  {
    date: '2026-04-19',
    headline: 'James + Sofia persona gap articles',
    detail: 'claude-team-vs-enterprise-for-it (scannable comparison table for IT) + documenting-claude-setup-for-client-handoff (Sofia\'s handoff gap).',
  },
  {
    date: '2026-04-19',
    headline: 'Monitoring split formally retired',
    detail: 'Kwame\'s 3-session deferral closed with a stated reason. Quality pass applied instead: currency note + healthy/unhealthy threshold + 30-min application prompt.',
  },
  {
    date: '2026-04-19',
    headline: 'Newsletter copy rewritten (Tom\'s alt)',
    detail: '"Each week: one thing Claude can do in your work that most people haven\'t figured out yet — plus the failure modes to avoid."',
  },
  {
    date: '2026-04-19',
    headline: 'PINNED curation pass — 14/10 → 5/5',
    detail: 'Binding Cassie rule enforced. Demoted articles stay in pool; pinned lists now read as coherent "start here" sequences.',
  },
  {
    date: '2026-04-14',
    headline: 'New-to-AI on-ramp shipped',
    detail: 'Orientation + privacy articles for users who never got value from AI. Rob + Amara personas added.',
  },
  {
    date: '2026-04-13',
    headline: 'Homepage redesigned around 3 intent cards',
    detail: '7-card grid → 3 primary intents (individual / builder / team). Cassie\'s orientation fix.',
  },
  {
    date: '2026-04-13',
    headline: 'Persona + advisor system built',
    detail: '6 personas with consumption logs + 5 advisors + 2 retro voices (Tom, Diaz). Every session now ends with a retro.',
  },
]
