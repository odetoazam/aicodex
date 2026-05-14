/**
 * Curated "What to read next" recommendations.
 *
 * Each entry is an array of up to 3 recommendations for a given article slug.
 * When an article has a curated entry here, the article page shows these
 * instead of the generic same-term / same-cluster fallback.
 *
 * reason — one sentence shown to the reader explaining *why* this is worth
 * reading next, from the reader's perspective.
 */

export type NextRead = {
  slug: string
  reason: string
}

export const NEXT_READS: Record<string, NextRead[]> = {

  // ── Entry points & pinned ────────────────────────────────────────────────

  'claude-operator-habits': [
    { slug: 'rolling-out-claude-across-teams', reason: 'Once your own habits are set, the next challenge is getting your team to adopt them.' },
    { slug: 'writing-system-prompts-that-work', reason: 'The habit that has the highest ROI — a well-structured system prompt changes every output.' },
    { slug: 'measuring-ai-roi', reason: 'How to prove the time you\'re saving is real and defensible when your boss asks.' },
  ],

  'running-your-first-ai-pilot': [
    { slug: 'measuring-ai-roi', reason: 'The pilot is only defensible if you can show what changed — here\'s how to measure it.' },
    { slug: 'ai-change-management', reason: 'Most pilots fail in the rollout phase, not the technology phase. This covers the human side.' },
    { slug: 'rolling-out-claude-across-teams', reason: 'If the pilot works, this is the playbook for what happens next.' },
  ],

  'first-week-with-claude': [
    { slug: 'claude-common-mistakes', reason: 'The mistakes in week one set the patterns for the next year — better to catch them early.' },
    { slug: 'how-to-write-a-good-prompt', reason: 'Prompting well is a skill. This is the fastest way to level up what you\'re already doing.' },
    { slug: 'claude-operator-habits', reason: 'What people who use Claude effectively every day actually do differently.' },
  ],

  'after-your-manager-approves-claude': [
    { slug: 'setting-up-claude-for-your-team', reason: 'The two-layer model for configuring shared Projects — the technical foundation under the rollout.' },
    { slug: 'first-week-with-claude', reason: 'What a good first experience looks like from each individual team member\'s perspective.' },
    { slug: 'rolling-out-claude-across-teams', reason: 'Once the 48-hour window is done, this is the broader rollout playbook for sustained adoption.' },
  ],

  'setting-up-claude-for-your-team': [
    { slug: 'after-your-manager-approves-claude', reason: 'The setup is the technical layer — this is the 48-hour action plan for making adoption stick.' },
    { slug: 'first-week-with-claude', reason: 'What onboarding looks like from the individual user\'s side, once the team setup is done.' },
    { slug: 'ai-usage-policy-for-teams', reason: 'The governance layer that sits on top of the technical setup — worth doing together.' },
  ],

  'claude-code-vs-web-app': [
    { slug: 'claude-code-project-setup', reason: 'If you decided Claude Code is the right tool — here\'s how to set it up properly from day one.' },
    { slug: 'your-first-claude-api-call', reason: 'If you decided on a custom API integration — this is the first step.' },
    { slug: 'claude-md-vs-hooks', reason: 'The two configuration mechanisms in Claude Code that determine how it behaves in your project.' },
  ],

  'solo-founder-operating-system': [
    { slug: 'validating-startup-idea-with-claude', reason: 'The first thing to do with this OS running: validate whether the idea is worth building.' },
    { slug: 'what-to-build-with-claude', reason: 'If you\'re still figuring out the product — this is the decision framework.' },
    { slug: 'customer-discovery-with-claude', reason: 'The fastest way to run discovery calls and synthesize what you\'re hearing.' },
  ],

  'solo-founder-project-setup': [
    { slug: 'claude-code-project-setup', reason: 'How to configure Claude Code properly inside the repo you just set up.' },
    { slug: 'claude-md-vs-hooks', reason: 'The first config decision every project hits: what belongs in CLAUDE.md vs. hooks.' },
    { slug: 'build-buy-prompt-early-stage', reason: 'Before you build more — this is the framework for deciding what to build vs. what to use.' },
  ],

  // ── Developer path ───────────────────────────────────────────────────────

  'your-first-claude-api-call': [
    { slug: 'streaming-claude-responses-implementation', reason: 'The next thing most apps need after the basic call — streaming makes responses feel instant.' },
    { slug: 'building-a-rag-pipeline-from-scratch', reason: 'The most common next build: connecting Claude to your own data.' },
    { slug: 'claude-cost-optimization', reason: 'Token costs compound fast — good to understand the economics before you build more.' },
  ],

  'streaming-claude-responses-implementation': [
    { slug: 'tool-use-implementation-deep-dive', reason: 'Streaming + tool use is how most production AI interfaces are actually built.' },
    { slug: 'building-a-rag-pipeline-from-scratch', reason: 'Streaming works differently when your responses include retrieved context — this covers that.' },
    { slug: 'claude-streaming-decision', reason: 'Not every response should stream — this is the decision framework for when to use it.' },
  ],

  'building-a-rag-pipeline-from-scratch': [
    { slug: 'writing-evals-that-catch-regressions', reason: 'RAG pipelines break in subtle ways — evals are how you catch degradation before users do.' },
    { slug: 'prompt-caching-implementation', reason: 'Caching your document context can cut RAG costs by 80% — worth doing early.' },
    { slug: 'tool-use-implementation-deep-dive', reason: 'Many RAG systems end up using tool calls to route retrieval — this explains how.' },
  ],

  'writing-evals-that-catch-regressions': [
    { slug: 'auditing-your-eval-suite', reason: 'Once your evals are written, auditing them tells you whether they\'re testing the right things.' },
    { slug: 'monitoring-your-claude-app', reason: 'Evals run before launch; monitoring runs after — both are required for production.' },
    { slug: 'evaluating-multi-agent-systems', reason: 'If your app uses agents or chains, evaluating individual responses isn\'t enough.' },
  ],

  'auditing-your-eval-suite': [
    { slug: 'writing-evals-that-catch-regressions', reason: 'If the audit reveals gaps, this is the foundational implementation guide for writing new cases.' },
    { slug: 'evaluating-multi-agent-systems', reason: 'Multi-agent pipelines have eval patterns that single-agent suites miss — worth auditing separately.' },
    { slug: 'monitoring-your-claude-app', reason: 'A clean eval suite covers pre-launch; monitoring covers what slips through post-launch.' },
  ],

  'claude-cost-optimization': [
    { slug: 'prompt-caching-implementation', reason: 'Caching is the single biggest lever for reducing cost — this is the implementation guide.' },
    { slug: 'claude-vs-custom-model', reason: 'After optimizing with Claude, the next decision is whether a fine-tuned model changes the math.' },
    { slug: 'rate-limiting-claude-api', reason: 'Cost control and rate limiting are two sides of the same problem in production.' },
  ],

  'prompt-caching-implementation': [
    { slug: 'claude-cost-optimization', reason: 'Caching is one tactic — this gives you the full cost optimization strategy.' },
    { slug: 'deploying-claude-app-production', reason: 'Caching behavior changes in production — covers what to watch for at scale.' },
    { slug: 'rate-limiting-claude-api', reason: 'After caching, rate limiting is the other critical cost-control mechanism.' },
  ],

  'tool-use-implementation-deep-dive': [
    { slug: 'multi-agent-orchestration-basics', reason: 'Tool use at scale leads to multi-agent systems — this is the natural next step.' },
    { slug: 'writing-evals-that-catch-regressions', reason: 'Tool call failures are the hardest bugs to catch without an eval suite.' },
    { slug: 'deploying-claude-app-production', reason: 'Tool use adds new failure modes in production that this deployment guide covers.' },
  ],

  'multi-agent-orchestration-basics': [
    { slug: 'multi-agent-failure-handling', reason: 'Orchestration patterns are only half the picture — the other half is what to do when agents fail mid-pipeline.' },
    { slug: 'evaluating-multi-agent-systems', reason: 'Multi-agent systems are much harder to evaluate than single-step responses — this is how.' },
    { slug: 'claude-managed-agents', reason: 'Anthropic\'s hosted agent loop is the alternative to building your own orchestration.' },
  ],

  'multi-agent-failure-handling': [
    { slug: 'multi-agent-orchestration-basics', reason: 'The orchestration patterns that this article extends with failure handling.' },
    { slug: 'evaluating-multi-agent-systems', reason: 'Failure handling and evaluation are paired concerns — you need both for a production pipeline.' },
    { slug: 'claude-production-error-handling', reason: 'Application-level error handling for when the Claude API itself fails, not just your agents.' },
  ],

  'deploying-claude-app-production': [
    { slug: 'claude-production-error-handling', reason: 'Deployment and error handling are tightly coupled — read this immediately after.' },
    { slug: 'monitoring-your-claude-app', reason: 'Once deployed, you need to know what\'s actually happening — monitoring is how.' },
    { slug: 'securing-your-claude-app', reason: 'Production means real users with real inputs — security should be in the deployment checklist.' },
  ],

  'claude-production-error-handling': [
    { slug: 'monitoring-your-claude-app', reason: 'Error handling is reactive; monitoring is proactive. Both belong in production.' },
    { slug: 'rate-limiting-claude-api', reason: 'Most production errors stem from rate limits — this covers how to handle them gracefully.' },
    { slug: 'securing-your-claude-app', reason: 'Error messages leak information. Security and error handling overlap more than most people expect.' },
  ],

  'monitoring-your-claude-app': [
    { slug: 'claude-production-error-handling', reason: 'Monitoring tells you something is wrong; error handling determines what happens next.' },
    { slug: 'writing-evals-that-catch-regressions', reason: 'Monitoring catches real-world degradation; evals catch it before it ships.' },
    { slug: 'claude-cost-optimization', reason: 'Monitoring dashboards often reveal the biggest cost surprises — review these together.' },
  ],

  'securing-your-claude-app': [
    { slug: 'claude-production-error-handling', reason: 'Security and error handling overlap — especially around what gets shown when things fail.' },
    { slug: 'rate-limiting-claude-api', reason: 'Rate limiting is a security measure as much as a cost control.' },
    { slug: 'deploying-claude-app-production', reason: 'Security should be part of the deployment checklist — review together.' },
  ],

  'nextjs-chatbot-claude-full-tutorial': [
    { slug: 'supabase-conversation-history', reason: 'The chatbot from this tutorial needs persistent history — this is how to add it.' },
    { slug: 'nextauth-claude-integration', reason: 'Auth is the next thing most chatbots need after the core loop works.' },
    { slug: 'chatbot-with-persistent-memory', reason: 'Memory makes chatbots feel like they know the user — different from conversation history.' },
  ],

  // ── Claude Code ──────────────────────────────────────────────────────────

  'claude-code-project-setup': [
    { slug: 'claude-md-vs-hooks', reason: 'After setup, this is the first config decision: what goes in CLAUDE.md vs. hooks.' },
    { slug: 'claude-md-templates', reason: 'Copy-paste starting templates for CLAUDE.md across different project types.' },
    { slug: 'claude-code-for-your-team', reason: 'If you\'re setting this up for a team, not just yourself, read this before configuring.' },
  ],

  'claude-md-vs-hooks': [
    { slug: 'claude-md-templates', reason: 'Once you know what belongs where — here are ready-to-use templates for CLAUDE.md.' },
    { slug: 'claude-md-maintenance', reason: 'CLAUDE.md files that aren\'t maintained become noise. This covers how to keep them useful.' },
    { slug: 'claude-code-for-your-team', reason: 'How the CLAUDE.md / hooks distinction works when multiple engineers share a project.' },
  ],

  'claude-md-templates': [
    { slug: 'claude-md-maintenance', reason: 'Templates are a starting point — this covers how to evolve them as projects grow.' },
    { slug: 'claude-md-vs-hooks', reason: 'If you\'re unsure what belongs in the template vs. hooks — this explains the boundary.' },
    { slug: 'claude-code-client-setup', reason: 'How to adapt these templates when setting up Claude Code for a client project.' },
  ],

  'claude-md-maintenance': [
    { slug: 'claude-code-antipatterns', reason: 'CLAUDE.md bloat is one of several Code anti-patterns — the full list of what to stop doing.' },
    { slug: 'claude-code-for-your-team', reason: 'Maintenance is harder on shared repos — this covers the team-specific patterns.' },
    { slug: 'claude-md-templates', reason: 'When maintaining becomes a rewrite — these templates are a clean starting point.' },
  ],

  'ai-agent-harness-explained': [
    { slug: 'multi-agent-orchestration-basics', reason: 'The harness handles one agent loop — orchestration handles multiple agents working together.' },
    { slug: 'evaluating-multi-agent-systems', reason: 'Agent harnesses make evaluation harder, not easier — this is how practitioners solve it.' },
    { slug: 'claude-managed-agents', reason: 'Anthropic\'s hosted agent loop is the alternative to building your own harness.' },
  ],

  'claude-code-for-your-team': [
    { slug: 'claude-code-antipatterns', reason: 'The failure-mode companion to this setup guide — what teams get wrong after the initial config.' },
    { slug: 'ai-usage-policy-for-teams', reason: 'Team Claude Code adoption needs a usage policy — especially around what Claude can access.' },
    { slug: 'claude-md-maintenance', reason: 'Shared CLAUDE.md files drift fast without a maintenance process — this covers it.' },
  ],

  // ── Operator / CS ────────────────────────────────────────────────────────

  'rolling-out-claude-across-teams': [
    { slug: 'ai-change-management', reason: 'Rollout is the easy part — sustained adoption is the hard part, and this is the playbook.' },
    { slug: 'ai-usage-policy-for-teams', reason: 'Every rollout needs a usage policy before teams go unsupervised.' },
    { slug: 'measuring-ai-roi', reason: 'Rollout without measurement is noise — how to show leadership it\'s working.' },
  ],

  'ai-change-management': [
    { slug: 'rolling-out-claude-across-teams', reason: 'Change management is the theory; this is the step-by-step rollout playbook.' },
    { slug: 'how-to-convince-skeptical-teammate', reason: 'The individual-level version of the same challenge — how to get one skeptic on board.' },
    { slug: 'first-week-with-claude', reason: 'What a good onboarding experience looks like from the new user\'s perspective.' },
  ],

  'how-to-convince-skeptical-teammate': [
    { slug: 'influencing-ai-adoption-without-authority', reason: 'If you don\'t have authority to pitch formally, this covers the three levers you actually have — demonstration, advocacy, proximity.' },
    { slug: 'measuring-ai-roi', reason: 'Skeptics respond to numbers — here\'s how to build the case.' },
    { slug: 'claude-common-mistakes', reason: 'Skepticism is often based on bad early experiences — this is why those happen and how to prevent them.' },
  ],

  'measuring-ai-roi': [
    { slug: 'building-a-business-case-for-claude', reason: 'The measurement is more credible when it\'s built into the original business case — how to write that.' },
    { slug: 'running-your-first-ai-pilot', reason: 'ROI measurement starts at the pilot stage — here\'s how to design it in from the beginning.' },
    { slug: 'rolling-out-claude-across-teams', reason: 'After you can measure it, scaling it becomes easier to justify.' },
  ],

  'writing-system-prompts-that-work': [
    { slug: 'claude-operator-habits', reason: 'System prompts are one habit — this covers the full picture of effective daily practice.' },
    { slug: 'claude-prompt-debugging', reason: 'When a system prompt isn\'t working the way you expected, this is how to diagnose it.' },
    { slug: 'claude-common-mistakes', reason: 'The most common system prompt mistakes, and what to do instead.' },
  ],

  'ai-usage-policy-for-teams': [
    { slug: 'ai-usage-policy-template', reason: 'The policy framework explained — now here\'s a ready-to-use template to adapt.' },
    { slug: 'claude-admin-security-privacy', reason: 'Policy and security settings should be set together — covers the admin side.' },
    { slug: 'rolling-out-claude-across-teams', reason: 'Policy is one piece of rollout — this is the broader team adoption playbook.' },
  ],

  // ── Common mistakes / diagnostics ────────────────────────────────────────

  'why-claude-feels-inconsistent': [
    { slug: 'writing-system-prompts-that-work', reason: 'Inconsistency almost always traces back to a system prompt problem — this fixes it.' },
    { slug: 'claude-common-mistakes', reason: 'Inconsistency is one of several common patterns — context on the others.' },
    { slug: 'claude-operator-habits', reason: 'What practitioners with consistent results actually do differently.' },
  ],

  'claude-common-mistakes': [
    { slug: 'claude-hallucination-prevention', reason: 'Hallucination is the highest-stakes mistake — this goes deeper on how to prevent it.' },
    { slug: 'claude-prompt-debugging', reason: 'When you\'ve identified a mistake, this is the systematic process for fixing it.' },
    { slug: 'writing-system-prompts-that-work', reason: 'Most common mistakes come from a weak or missing system prompt — this is the fix.' },
  ],

  'claude-hallucination-prevention': [
    { slug: 'building-a-rag-pipeline-from-scratch', reason: 'Grounding Claude in your own data is the most reliable hallucination prevention technique.' },
    { slug: 'writing-evals-that-catch-regressions', reason: 'Hallucination prevention requires measuring whether it\'s actually working.' },
    { slug: 'claude-common-mistakes', reason: 'Hallucination in context of the other patterns that trip people up.' },
  ],

  'how-to-write-a-good-prompt': [
    { slug: 'writing-system-prompts-that-work', reason: 'System prompts are the most important prompt you\'ll write — a level up from this.' },
    { slug: 'claude-common-mistakes', reason: 'The mistakes that undo good prompts — useful to read alongside this.' },
    { slug: 'claude-prompt-debugging', reason: 'When a prompt doesn\'t work, this is how to figure out why.' },
  ],

  'claude-prompt-debugging': [
    { slug: 'writing-system-prompts-that-work', reason: 'Debugging a prompt often reveals a system prompt issue — this is how to fix it.' },
    { slug: 'claude-common-mistakes', reason: 'Many debugging sessions trace back to one of these common patterns.' },
    { slug: 'why-claude-feels-inconsistent', reason: 'Inconsistency is a specific class of prompt failure — dedicated treatment here.' },
  ],

  // ── Agencies ─────────────────────────────────────────────────────────────

  'claude-for-agencies': [
    { slug: 'pricing-claude-consulting-work', reason: 'How to price the faster, AI-assisted work so you\'re not delivering more for the same fee.' },
    { slug: 'client-handoff-with-claude', reason: 'The trickiest part of agency AI work — handing off something the client can actually maintain.' },
    { slug: 'building-claude-powered-deliverable', reason: 'What a Claude-assisted deliverable actually looks like from a client\'s perspective.' },
  ],

  'pricing-claude-consulting-work': [
    { slug: 'client-handoff-with-claude', reason: 'Pricing and handoff are linked — what you charge should reflect what the client gets after you leave.' },
    { slug: 'what-to-tell-clients-about-ai', reason: 'Before the pricing conversation, you need the AI conversation — how to frame it.' },
    { slug: 'claude-for-agencies', reason: 'The full agency playbook — pricing is one chapter.' },
  ],

  'client-handoff-with-claude': [
    { slug: 'documenting-claude-setup-for-client-handoff', reason: 'Deliverable handoff is one piece — this covers how to document the Claude setup itself so the client can maintain it.' },
    { slug: 'what-to-tell-clients-about-ai', reason: 'The handoff starts with the client understanding what they\'re taking over.' },
    { slug: 'pricing-claude-consulting-work', reason: 'Handoff quality affects client perception of value — pricing should reflect it.' },
  ],

  'documenting-claude-setup-for-client-handoff': [
    { slug: 'client-handoff-with-claude', reason: 'Deliverable handoff is the other half — this is the system documentation; that covers the client-facing output.' },
    { slug: 'pricing-claude-consulting-work', reason: 'A real maintenance retainer needs a real scope — the handoff doc is what defines what maintenance even means.' },
    { slug: 'claude-code-client-setup', reason: 'If Claude Code is part of the handoff, the .claude/ folder needs its own documentation layer on top of this.' },
  ],

  // ── Claude + Tool ─────────────────────────────────────────────────────────

  'claude-plus-notion': [
    { slug: 'claude-plus-google-docs', reason: 'The same "Claude as a thinking partner" pattern, applied to a different writing environment.' },
    { slug: 'note-taking-knowledge-management-claude', reason: 'The strategy behind using Claude for knowledge management, not just individual docs.' },
    { slug: 'claude-plus-slack-for-teams', reason: 'If you\'re using Claude in Notion, you\'re likely already on Slack — this covers the pairing.' },
  ],

  'claude-plus-hubspot': [
    { slug: 'claude-plus-salesforce', reason: 'The Salesforce version of the same integration patterns — if your team is evaluating both.' },
    { slug: 'ai-for-sales', reason: 'The broader sales productivity picture, not just the HubSpot-specific workflows.' },
    { slug: 'sales-prospecting-with-claude', reason: 'The most time-consuming HubSpot task — prospecting research — gets its own treatment here.' },
  ],

  'claude-plus-jira': [
    { slug: 'claude-plus-confluence', reason: 'Jira tracks work; Confluence holds knowledge. The workflows pair naturally — here\'s the Confluence side.' },
    { slug: 'claude-for-engineering-teams', reason: 'Jira is one piece of the engineering workflow — this covers how Claude fits into the full picture.' },
    { slug: 'claude-code-for-your-team', reason: 'If the team is using Jira, they\'re probably also candidates for Claude Code.' },
  ],

  'claude-plus-slack-for-teams': [
    { slug: 'rolling-out-claude-across-teams', reason: 'Slack is where team adoption either takes hold or stalls — the rollout guide covers this.' },
    { slug: 'meeting-prep-with-claude', reason: 'The most common use case that pairs with Slack: coming into meetings prepared.' },
    { slug: 'weekly-review-with-claude', reason: 'Closing the loop: Slack surfaces the work, weekly review synthesizes it.' },
  ],

  'managing-email-with-claude': [
    { slug: 'weekly-review-with-claude', reason: 'Email triage is the morning routine; weekly review is the system that ties it together.' },
    { slug: 'meeting-prep-with-claude', reason: 'Email and meetings are the two biggest time sinks — good to optimize both together.' },
    { slug: 'claude-operator-habits', reason: 'Email management is one habit in a broader system — context on the others.' },
  ],

  'weekly-review-with-claude': [
    { slug: 'managing-email-with-claude', reason: 'Weekly review depends on having processed your inbox — these two workflows pair naturally.' },
    { slug: 'note-taking-knowledge-management-claude', reason: 'The weekly review feeds your knowledge system — how to connect them.' },
    { slug: 'claude-operator-habits', reason: 'Weekly review is one habit — this covers the full system effective Claude users build.' },
  ],

  // ── Org dynamics (Priya–Marcus–James arc) ────────────────────────────────

  'building-a-business-case-for-claude': [
    { slug: 'getting-it-approval-for-claude', reason: 'The business case gets leadership to yes — this gets IT to yes. You need both.' },
    { slug: 'measuring-ai-roi', reason: 'Your proposal needs a success metric. This covers how to measure and report AI impact in 90 days.' },
    { slug: 'claude-adoption-plateau', reason: 'The business case is step one. This is what happens if the rollout loses momentum at month 4.' },
  ],

  'influencing-ai-adoption-without-authority': [
    { slug: 'building-a-business-case-for-claude', reason: 'Once you\'ve built the demonstration story, this is what the formal pitch to your manager should look like.' },
    { slug: 'claude-operator-habits', reason: 'The habits worth demonstrating — if people ask how you\'re faster, this is what you\'re showing them.' },
    { slug: 'how-to-convince-skeptical-teammate', reason: 'Specific moves for the one-on-one conversation when a teammate is hesitant but not hostile.' },
  ],

  'getting-it-approval-for-claude': [
    { slug: 'claude-team-vs-enterprise-for-it', reason: 'Once IT is engaged, this is the side-by-side plan comparison they\'ll ask for — written to be forwarded to legal.' },
    { slug: 'claude-admin-controls-2026', reason: 'New April 2026 admin controls — user groups, spend limits, Compliance API — are the specific features IT will want to understand.' },
    { slug: 'ai-usage-policy-template', reason: 'The usage policy James needs to see before he approves — have it ready before the conversation.' },
  ],

  'claude-team-vs-enterprise-for-it': [
    { slug: 'getting-it-approval-for-claude', reason: 'The comparison answers "what are we actually buying?" — this covers how to frame the approval conversation.' },
    { slug: 'claude-admin-controls-2026', reason: 'Drill down into the specific admin controls that differ between plans — user groups, spend caps, Compliance API.' },
    { slug: 'building-a-business-case-for-claude', reason: 'The upstream proposal that brought IT into the conversation in the first place — know how Priya framed it.' },
  ],

  'claude-adoption-plateau': [
    { slug: 'measuring-ai-roi', reason: 'The plateau is often invisible without measurement — here\'s how to set up the metrics before month 4 arrives.' },
    { slug: 'rolling-out-claude-across-teams', reason: 'The plateau comes from the rollout stopping — this is what the rollout should have included.' },
    { slug: 'getting-it-approval-for-claude', reason: 'If you\'re at the plateau and considering a restart, this is often where the governance gaps surface.' },
  ],

  // ── CS team ──────────────────────────────────────────────────────────────

  'cs-manager-ai-workflow': [
    { slug: 'claude-plus-intercom', reason: 'The Intercom integration is the highest-leverage CS tool change you can make.' },
    { slug: 'claude-cs-team-playbook', reason: 'The playbook for deploying this workflow across a full CS team, not just yourself.' },
    { slug: 'measuring-ai-roi', reason: 'CS teams can measure AI impact clearly — CSAT, time-to-resolve, renewal rate. Here\'s how.' },
  ],

  'claude-for-customer-support': [
    { slug: 'claude-plus-intercom', reason: 'If your team uses Intercom, this is the most direct implementation path.' },
    { slug: 'claude-cs-team-playbook', reason: 'Customer support is one lane — the playbook covers the full CS operation.' },
    { slug: 'cs-qbr-and-renewal-prep-with-claude', reason: 'Support efficiency is the daily win; QBR prep is where it becomes a strategic asset.' },
  ],

  // ── Founders (extended) ──────────────────────────────────────────────────

  'what-to-build-with-claude': [
    { slug: 'your-first-claude-api-call', reason: 'Once you know what to build — this is the first technical step.' },
    { slug: 'ai-product-failure-modes-founders', reason: 'Most founders only read failure modes after they\'ve failed. This is worth reading before.' },
    { slug: 'solo-founder-operating-system', reason: 'The product decision is one thing; the operating system for building it is another.' },
  ],

  'validating-startup-idea-with-claude': [
    { slug: 'customer-discovery-with-claude', reason: 'Validation through research is step one; discovery calls are where you test assumptions with real people.' },
    { slug: 'ai-product-failure-modes-founders', reason: 'Many ideas fail not because of the idea itself but because of predictable execution patterns.' },
    { slug: 'first-ten-customers-ai-product', reason: 'The natural next question after validation: how do you actually get the first customers?' },
  ],

  'pitching-ai-product-to-investors': [
    { slug: 'pricing-your-ai-product', reason: 'Investors always ask about the pricing model — knowing your answer before the pitch matters.' },
    { slug: 'first-ten-customers-ai-product', reason: 'Traction is the most compelling pitch ingredient — this is how to get there.' },
    { slug: 'ai-product-failure-modes-founders', reason: 'Investors fund the team\'s ability to navigate failure modes — showing you know them builds confidence.' },
  ],

  // ── Claude + Tool (engineering cluster) ─────────────────────────────────

  'claude-plus-confluence': [
    { slug: 'claude-plus-jira', reason: 'Confluence handles knowledge; Jira handles work. Using Claude across both creates a complete engineering loop.' },
    { slug: 'claude-for-engineering-teams', reason: 'Documentation is one piece — here\'s how engineering teams use Claude across planning, review, and standups.' },
    { slug: 'claude-md-maintenance', reason: 'If you use Claude Code, CLAUDE.md is your team\'s most important document — here\'s how to keep it accurate.' },
  ],

  // ── Feature updates (batch 60–62) ────────────────────────────────────────

  'ask-your-org-guide': [
    { slug: 'claude-admin-controls-2026', reason: 'Ask Your Org is one feature — this covers the full batch of admin controls that shipped alongside it.' },
    { slug: 'getting-it-approval-for-claude', reason: 'An owner has to set up Ask Your Org. If IT hasn\'t approved Claude yet, this is the conversation to have first.' },
    { slug: 'setting-up-claude-for-your-team', reason: 'Ask Your Org is the org-wide layer; this covers the project and team setup layer underneath it.' },
  ],

  'claude-admin-controls-2026': [
    { slug: 'ask-your-org-guide', reason: 'The most visible new feature shipping alongside these controls — how to set up org-wide knowledge search.' },
    { slug: 'getting-it-approval-for-claude', reason: 'These controls help IT say yes — the approval guide covers how to frame the conversation.' },
    { slug: 'claude-admin-security-privacy', reason: 'New controls sit on top of existing security settings — worth reviewing both together.' },
  ],

  'claude-session-economics': [
    { slug: 'claude-projects-role', reason: 'Projects are the escape hatch from conversation overhead — how to use them to hold context without accumulating cost.' },
    { slug: 'minimising-token-usage', reason: 'Session economics is one lever; this covers the full token reduction picture.' },
    { slug: 'claude-operator-habits', reason: 'Starting fresh chats is one habit in a system — what effective Claude users build over time.' },
  ],

  'claude-code-antipatterns': [
    { slug: 'claude-md-maintenance', reason: 'The CLAUDE.md trimming anti-pattern is covered here — the full maintenance process.' },
    { slug: 'claude-code-for-your-team', reason: 'Team setups amplify most of these anti-patterns — the team guide has the positive version.' },
    { slug: 'mcp-for-operators', reason: 'The MCP cost trap is the trickiest to diagnose — this covers what to connect and why.' },
  ],

  'claude-opus-4-7': [
    { slug: 'migrating-to-claude-4-7', reason: 'There are 5 API breaking changes in Opus 4.7 — this is the migration checklist.' },
    { slug: 'choosing-the-right-claude-model', reason: 'Opus 4.7 is now the flagship — how it fits against Sonnet 4.6 and Haiku for your use case.' },
    { slug: 'claude-cost-optimization', reason: 'The new tokenizer changes your cost math — worth re-running your estimates.' },
  ],

  'migrating-to-claude-4-7': [
    { slug: 'claude-opus-4-7', reason: 'The full overview of what\'s new in Opus 4.7 beyond the breaking changes.' },
    { slug: 'deploying-claude-app-production', reason: 'Migration checklist and production deployment are related concerns — good to review together.' },
    { slug: 'claude-production-error-handling', reason: 'The new tokenizer and behavioral changes can surface as new error patterns in production.' },
  ],

  'claude-code-parallel-agents': [
    { slug: 'claude-code-antipatterns', reason: 'The new parallel session workflow comes with its own anti-patterns — what to avoid as you scale up.' },
    { slug: 'claude-code-project-setup', reason: 'Parallel sessions work better when each project is configured correctly from the start.' },
    { slug: 'claude-code-for-your-team', reason: 'Parallel agents changes how teams coordinate on Claude Code — the team setup guide covers the shared patterns.' },
  ],

  // ── Internal MCP series ──────────────────────────────────────────────────

  'internal-mcp-server-explained': [
    { slug: 'ai-data-access-token-economics', reason: 'Once you understand what the MCP server does, the token cost of how data flows through it is the next thing to get right.' },
    { slug: 'internal-ai-stack-architecture', reason: 'The full five-layer stack this server sits inside — how everything connects and what the mature version looks like.' },
  ],

  'ai-data-access-token-economics': [
    { slug: 'ai-agent-cold-start-caching', reason: 'The biggest single win on token cost: a nightly cron that pre-fetches context so session startup costs near zero.' },
    { slug: 'live-api-vs-etl-for-ai', reason: 'The decision framework for when live API beats warehouse and when warehouse beats live — the routing logic behind the cost tiers.' },
  ],

  'ai-agent-cold-start-caching': [
    { slug: 'ai-agent-access-control', reason: 'Once sessions are fast and cheap, access control is the next layer to build in — before you scale.' },
    { slug: 'ai-data-access-token-economics', reason: 'Cold start is one piece of the token cost picture — the full economics of how data fetching drives cost.' },
  ],

  'ai-agent-access-control': [
    { slug: 'internal-mcp-server-explained', reason: 'ACL middleware is built into the MCP server — revisit the architecture to see how the permission layer fits in.' },
    { slug: 'building-ai-skills-for-your-team', reason: 'Once access control shapes what each role sees, skills are how you encode what each role should do.' },
  ],

  'live-api-vs-etl-for-ai': [
    { slug: 'data-warehouse-for-ai-agents', reason: 'Once you know when to use the warehouse, this covers which warehouse fits AI agent query patterns best.' },
    { slug: 'ai-agent-cold-start-caching', reason: 'Pre-fetch caching is where the live-vs-warehouse decision plays out in practice — what gets cached, what stays live.' },
  ],

  'data-warehouse-for-ai-agents': [
    { slug: 'live-api-vs-etl-for-ai', reason: 'The routing logic that decides which queries go to the warehouse and which go to live APIs.' },
    { slug: 'internal-ai-stack-architecture', reason: 'The warehouse is Layer 2 in the full internal AI stack — see how it connects to the rest.' },
  ],

  'building-ai-skills-for-your-team': [
    { slug: 'internal-ai-stack-architecture', reason: 'Skills are Layer 4 of the internal AI stack — how they connect to the MCP server, the warehouse, and the cache.' },
    { slug: 'internal-mcp-server-explained', reason: 'Skills call tools through the MCP server — this covers the routing and access control layer they depend on.' },
  ],

  'internal-ai-stack-architecture': [
    { slug: 'internal-mcp-server-explained', reason: 'The MCP server is the control layer of the stack — the implementation details behind the architecture overview.' },
    { slug: 'building-ai-skills-for-your-team', reason: 'Skills are how the stack delivers value to individual teams — how to build and publish reusable workflows.' },
  ],

  // ── FDE cluster ──────────────────────────────────────────────────────────

  'what-is-a-forward-deployed-engineer': [
    { slug: 'how-to-become-forward-deployed-engineer', reason: 'The step-by-step path: the four-part skill stack, three transition paths, and what the interview actually looks like.' },
    { slug: 'fde-portfolio-projects', reason: 'The five specific projects that signal FDE readiness to hiring managers — buildable, not generic.' },
    { slug: 'what-is-an-agent-operator', reason: 'The internal counterpart to the FDE role — what the operator side of the same AI deployment wave looks like.' },
  ],

  'how-to-become-forward-deployed-engineer': [
    { slug: 'fde-portfolio-projects', reason: 'The concrete portfolio projects that prove each part of the skill stack — what to build and why.' },
    { slug: 'internal-mcp-server-explained', reason: 'MCP servers are the core FDE technical deliverable — this covers the architecture in depth.' },
  ],

  'fde-portfolio-projects': [
    { slug: 'how-to-become-forward-deployed-engineer', reason: 'The full transition path context — which projects matter most depends on which path you\'re on.' },
    { slug: 'internal-mcp-server-explained', reason: 'Project 1 requires building an MCP server — this is the deep-dive on the architecture patterns.' },
  ],

  'fde-for-career-counselors': [
    { slug: 'what-is-a-forward-deployed-engineer', reason: 'The full definition article for sharing with students — covers what FDEs build, compensation, and the hiring landscape.' },
    { slug: 'how-to-become-forward-deployed-engineer', reason: 'The step-by-step path for students to follow — the four-part skill stack and three transition timelines.' },
  ],

  // ── Agent Operator cluster ───────────────────────────────────────────────

  'what-is-an-agent-operator': [
    { slug: 'agent-operator-first-90-days', reason: 'The concrete 90-day playbook for actually starting — what to build first, in what order, without doing everything at once.' },
    { slug: 'how-to-evaluate-your-agents', reason: 'The first real accountability question: how do you know if the agents you\'re responsible for are actually working?' },
    { slug: 'what-is-a-forward-deployed-engineer', reason: 'The external-facing version of the same role — helps clarify where Agent Operator ends and FDE begins.' },
  ],

  'agent-operator-first-90-days': [
    { slug: 'how-to-evaluate-your-agents', reason: 'Day 31 is when you start building test cases — this is the complete guide to doing evaluation without code.' },
    { slug: 'wiring-internal-systems-to-agents', reason: 'Day 61 is when you connect your first live data source — here\'s the four-level framework for doing it without an engineer.' },
  ],

  'how-to-evaluate-your-agents': [
    { slug: 'when-agents-break', reason: 'What to do when your test set finds a failure — the five failure modes and the 45-minute diagnostic workflow.' },
    { slug: 'agent-operator-first-90-days', reason: 'How evaluation fits into the broader 90-day build and stabilize cycle.' },
  ],

  'when-agents-break': [
    { slug: 'how-to-evaluate-your-agents', reason: 'The test set that catches failures before users do — how to build and run one without code.' },
    { slug: 'agent-change-management', reason: 'One bad public failure can undo months of adoption progress — here\'s how to manage the human side of reliability.' },
  ],

  'wiring-internal-systems-to-agents': [
    { slug: 'agent-operator-first-90-days', reason: 'How live data connections fit into the broader 90-day build sequence — when to tackle them and when to wait.' },
    { slug: 'agent-operator-cost-control', reason: 'How you load context directly drives your token costs — what to load and what to leave out.' },
  ],

  'agent-change-management': [
    { slug: 'agent-operator-first-90-days', reason: 'The pilot-first rollout sequence that prevents the trust and speed resistance problems before they start.' },
    { slug: 'agent-operator-roi-reporting', reason: 'Once adoption is working, here\'s how to show leadership what it\'s actually delivered.' },
  ],

  'agent-operator-cost-control': [
    { slug: 'how-to-evaluate-your-agents', reason: 'High failure rates drive retry costs — fixing reliability is also cost reduction.' },
    { slug: 'agent-operator-roi-reporting', reason: 'The cost number belongs in your ROI report — here\'s how to frame it so it lands with your CFO.' },
  ],

  'agent-operator-roi-reporting': [
    { slug: 'agent-operator-first-90-days', reason: 'The 90-day playbook that generates the data you\'ll need to report — baseline tracking starts on day one.' },
    { slug: 'agent-change-management', reason: 'Adoption numbers are part of the ROI story — what to measure on the human side.' },
  ],

}
