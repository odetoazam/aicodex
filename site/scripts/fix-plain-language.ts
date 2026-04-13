/**
 * Fix plain language issues across admin path articles.
 * Uses targeted string replacements — no full body rewrites needed.
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/fix-plain-language.ts
 */

import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Fix = { from: string; to: string }

const articles: { slug: string; fixes: Fix[] }[] = [
  {
    slug: 'managed-agents-for-your-org',
    fixes: [
      // "sandboxes it" and "platform-as-a-service" in opening paragraph
      {
        from: 'Anthropic runs it, sandboxes it, and gives you the result. Think of it as platform-as-a-service for AI agents — you focus on the business logic, Anthropic handles everything underneath.',
        to: 'Anthropic runs it in an isolated environment and gives you the result. Think of it as a hosted service for AI agents — you focus on what you want the agent to do, Anthropic handles everything underneath.',
      },
      // "decoupling"
      {
        from: 'The fundamental shift with Managed Agents is a decoupling of two things that previously had to live together:',
        to: 'The fundamental shift with Managed Agents is a separation of two things that previously had to live together:',
      },
      // "orchestration loop" and "sandboxing"
      {
        from: '- **The infrastructure** — the session management, tool execution, orchestration loop, and sandboxing',
        to: '- **The infrastructure** — the session management, tool execution, step-by-step coordination, and isolation layer',
      },
      // "MCP server configurations" (in Claude Code persona — keep MCP but clarify)
      {
        from: 'skills, and MCP server configurations. The same things you build in Claude Code can be packaged and deployed through `anth`.',
        to: 'skills, and tool configurations. The same things you build in Claude Code can be packaged and deployed through `anth`.',
      },
      // "token-as-a-service model"
      {
        from: 'The platform runs on a token-as-a-service model — you pay for tokens plus Anthropic\'s infrastructure time',
        to: 'The platform charges you per token plus a fee for Anthropic\'s infrastructure time',
      },
      // "sub-agent call"
      {
        from: 'On the left: every tool call, script execution, and sub-agent call made during the run.',
        to: 'On the left: every tool call, script run, and handoff to another agent made during the run.',
      },
      // "compute-intensive"
      {
        from: 'For compute-intensive internal automation, the Agent SDK on your own infrastructure may be cheaper with comparable results.',
        to: 'For heavy internal automation running at scale, the Agent SDK on your own infrastructure may be cheaper with comparable results.',
      },
    ],
  },
  {
    slug: 'claude-projects-org-structure',
    fixes: [
      // "governance"
      {
        from: 'The Claude admin manages access, billing, and governance.',
        to: 'The Claude admin manages access, billing, and policy.',
      },
      // "version-controlled"
      {
        from: '**2. System prompts are version-controlled.** Keep the current system prompt for each Project in a shared document (Notion, Google Doc). When it changes, note what changed and why.',
        to: '**2. Track changes to system prompts.** Keep the current system prompt for each Project in a shared document (Notion, Google Doc). When it changes, note what changed and why.',
      },
      // "ICP" in marketing row
      {
        from: '| Marketing — Content | Content Lead | Brand guide, ICP doc | Web search |',
        to: '| Marketing — Content | Content Lead | Brand guide, target customer doc | Web search |',
      },
      // "ICP" in sales row
      {
        from: '| Sales — Prospect Research | Sales Lead | Product one-pager, ICP | Web search |',
        to: '| Sales — Prospect Research | Sales Lead | Product one-pager, ideal customer profile | Web search |',
      },
      // "ICP description" in marketing section
      {
        from: 'For a marketing Project: brand voice guide, ICP description, messaging house, product positioning doc.',
        to: 'For a marketing Project: brand voice guide, ideal customer description, messaging house, product positioning doc.',
      },
      // "SOPs"
      {
        from: '| Operations — Process Docs | Ops Lead | Existing SOPs | File creation |',
        to: '| Operations — Process Docs | Ops Lead | Existing process guides | File creation |',
      },
      // "HR BP"
      {
        from: '| HR — Policy Q&A | HR BP | Handbook summary, policies | None |',
        to: '| HR — Policy Q&A | HR Team Lead | Handbook summary, policies | None |',
      },
      // "HR business partner" in ownership section
      {
        from: '- HR Policy Project: HR business partner',
        to: '- HR Policy Project: HR team lead or people ops manager',
      },
    ],
  },
  {
    slug: 'choosing-your-claude-plan',
    fixes: [
      // "context windows (up to 200k tokens)"
      {
        from: '- Expanded context windows (up to 200k tokens)',
        to: '- Larger conversation memory — Enterprise can handle much longer documents and conversations than standard plans',
      },
      // "SLAs"
      {
        from: '- Priority support and SLAs',
        to: '- Priority support and guaranteed response time commitments',
      },
      // "operational debt"
      {
        from: '**Never deploy Pro accounts as your team solution.** The lack of centralised management creates operational debt you will have to unwind later.',
        to: '**Never deploy Pro accounts as your team solution.** The lack of centralised management creates a mess you will have to clean up later.',
      },
      // "custom data retention policies"
      {
        from: '**When Team is the right choice:** 5–250 people, standard use cases (content, research, writing, analysis), no requirement for SSO or custom data retention policies.',
        to: '**When Team is the right choice:** 5–250 people, standard use cases (content, research, writing, analysis), no requirement for SSO or custom rules about how long your data is stored.',
      },
    ],
  },
  {
    slug: 'evals-role',
    fixes: [
      // "regressions"
      {
        from: 'Over time, your eval set becomes a safety net — you can make changes confidently because you know you\'ll catch regressions.',
        to: 'Over time, your eval set becomes a safety net — you can make changes confidently because you know you\'ll catch anything that broke.',
      },
      // "Claude-as-judge"
      {
        from: 'Use human review for calibration, Claude-as-judge for scale.',
        to: 'Use human review to calibrate, Claude reviewing Claude for scale.',
      },
      // "RAG" — already linked but let's add a plain explanation
      {
        from: 'This is where [RAG](/glossary/rag) helps — if Claude is making things up, it often needs more grounding in your actual information.',
        to: 'This is where [grounding](/glossary/rag) helps — if Claude is making things up, it often needs to be pointed more directly at your actual information (product docs, policies, FAQs) rather than relying on general knowledge.',
      },
    ],
  },
  {
    slug: 'skills-setup-guide',
    fixes: [
      // "sandbox"
      {
        from: '**Code Execution.** Claude writes and runs Python code in a sandbox.',
        to: '**Code Execution.** Claude writes and runs Python code in an isolated environment.',
      },
      // "PPTX, XLSX, DOCX" — spell out product names
      {
        from: '**File Creation.** Claude produces downloadable files — spreadsheets, documents, presentations. The office document skills (PPTX, XLSX, DOCX) are Anthropic-managed skills that produce professional-quality files.',
        to: '**File Creation.** Claude produces downloadable files — spreadsheets, documents, presentations. The office document skills (PowerPoint, Excel, Word) are Anthropic-managed skills that produce professional-quality files.',
      },
    ],
  },
  {
    slug: 'connectors-best-practices',
    fixes: [
      // "service accounts" and "team-scoped authentication"
      {
        from: 'For team deployments, use service accounts or team-scoped authentication where available.',
        to: 'For team deployments, use a shared login credential set up specifically for this purpose (not tied to one person\'s account) where your tools support it.',
      },
    ],
  },
]

async function main() {
  for (const article of articles) {
    // Fetch current body
    const { data, error: fetchError } = await sb
      .from('articles')
      .select('body')
      .eq('slug', article.slug)
      .single()

    if (fetchError || !data) {
      console.error(`✗ ${article.slug}: fetch failed — ${fetchError?.message}`)
      continue
    }

    let body: string = data.body
    let changed = 0

    for (const fix of article.fixes) {
      if (body.includes(fix.from)) {
        body = body.replace(fix.from, fix.to)
        changed++
      } else {
        console.warn(`  ⚠ ${article.slug}: pattern not found — "${fix.from.slice(0, 60)}..."`)
      }
    }

    if (changed === 0) {
      console.log(`– ${article.slug}: nothing to change`)
      continue
    }

    const { error: updateError } = await sb
      .from('articles')
      .update({ body, updated_at: new Date().toISOString() })
      .eq('slug', article.slug)

    if (updateError) {
      console.error(`✗ ${article.slug}: update failed — ${updateError.message}`)
    } else {
      console.log(`✓ ${article.slug}: ${changed}/${article.fixes.length} fixes applied`)
    }
  }
}

main().catch(console.error)
