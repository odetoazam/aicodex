/**
 * Batch 30 — Claude Code configuration guide
 * claude-code-project-setup
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-30.ts
 */

import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function getTermId(slug: string): Promise<{ id: string; name: string } | null> {
  const { data } = await sb.from('terms').select('id, name').eq('slug', slug).single()
  return data
}

const ARTICLES = [

  {
    termSlug: 'system-prompt',
    slug: 'claude-code-project-setup',
    angle: 'process',
    title: 'Setting up Claude Code for your team: the leverage-ordered guide',
    excerpt: 'The .claude folder has five layers. Most teams set up one and wonder why they keep correcting Claude. Here is what to configure in what order — and what you can skip entirely.',
    readTime: 9,
    cluster: 'Developer Patterns',
    audience: ['developer'],
    body: `The .claude folder is not a feature to explore. It is a priority stack. Set up the bottom layers well and Claude behaves the way your team needs it to behave across every session. Skip them and you spend your time giving the same corrections over and over.

Most teams set up one layer — usually CLAUDE.md — and stop. That is a fine start. But if you are using Claude Code seriously, you have five tools available: CLAUDE.md, settings.json, hooks, rules, and skills/agents. Each one serves a different purpose. Each one is more optional than the last.

This guide walks through them in order of leverage, not alphabetical order.

## Before anything else: there are two .claude folders

One lives inside your project. The other lives at \`~/.claude/\` in your home directory.

The project folder is team configuration. You commit it to git. Everyone on the team gets the same rules, the same permission policy, the same hooks. This is where your shared working agreements live.

The global folder is personal configuration. Your own preferences, your private instruction overrides, your session history. Claude loads both, and your project folder takes precedence on any conflict.

When you are wondering where a setting goes — if it is a team decision, the project folder. If it is personal preference, the global folder.

## Layer 1: CLAUDE.md

This file loads into every Claude Code session as part of the system prompt. Everything you write in it, Claude holds in memory for the entire conversation.

That is worth sitting with. CLAUDE.md is not documentation. It is a live system prompt. Every line you add costs context. If you add 500 lines of background reading, you are burning token budget on information Claude rarely needs. Instruction adherence also drops as files get longer — not because Claude ignores long CLAUDE.md files, but because it weights instructions differently when there is too much to track.

**What belongs in CLAUDE.md:**

Your run commands. Claude will ask what commands exist if you do not tell it. Five lines solves this permanently.

Architecture decisions that are non-obvious. "We use Turborepo" or "all database access goes through the repository layer in \`src/db/\`" — things Claude would get wrong by default.

Gotchas. "TypeScript strict mode is on. Unused imports are a compile error." "Tests hit a real local database, not mocks. Run \`npm run db:test:reset\` before running the test suite." These are the things that waste 15 minutes the first time Claude gets them wrong.

Naming and import conventions that differ from common defaults. If you use a custom logger module instead of console.log, say so. If your error handling returns a \`{ data, error }\` shape everywhere, say so.

**What does not belong in CLAUDE.md:**

Anything your linter or formatter already enforces. If ESLint catches it, Claude does not need to be told.

Long explanations. CLAUDE.md is not a wiki. If you need to explain background, link to the doc — do not paste the doc.

Things obvious from reading the code. Claude reads files. If the pattern is visible, it will pick it up.

A useful test: would Claude get this wrong on the first try without the instruction? If yes, it belongs in CLAUDE.md. If Claude would figure it out anyway, leave it out.

Keep CLAUDE.md under 200 lines. A minimal but complete file for a Node/TypeScript API covers: the four or five run commands, the stack in two sentences (Express, Node 20, PostgreSQL via Prisma), which directories hold what (handlers in \`src/handlers/\`, shared types in \`src/types/\`), and three or four conventions (zod for request validation, \`{ data, error }\` response shape, the logger module not console.log). That is roughly 20 lines and it tells Claude everything it needs to work in the codebase without constant correction.

For personal preferences that should not affect the team — a different test runner preference, an editor workflow you like — create \`CLAUDE.local.md\` in the project root. It is auto-gitignored. Claude reads it alongside the main file. Your changes stay off the team's configuration.

## Layer 2: settings.json

\`settings.json\` inside \`.claude/\` controls what Claude is and is not allowed to do. Think of it as team policy written in JSON, not personal preference.

The file has two lists: allow and deny.

The allow list contains commands and operations that run automatically, without Claude prompting for confirmation. For most projects this covers your build and run scripts (\`Bash(npm run *)\` or \`Bash(make *)\`), read-only git commands (\`Bash(git status)\`, \`Bash(git diff *)\`), and standard file operations (Read, Write, Edit, Glob, Grep).

The deny list contains commands that are blocked entirely, regardless of context. A sensible minimum set blocks destructive shell commands (\`Bash(rm -rf *)\`), direct network calls (\`Bash(curl *)\`), and access to credential files (\`Read(./.env)\`, \`Read(./.env.*)\`).

Everything not in either list sits in the middle: Claude asks before proceeding. This is the right default for anything risky that you have not explicitly thought through. You do not need to anticipate every possible command. The ask-before behavior is the safety net for the gaps.

One note worth including: add the \`$schema\` line pointing to the Claude Code settings schema from SchemaStore. It enables autocomplete and inline validation in VS Code and Cursor, and takes 5 seconds to add.

For personal permission changes — if you want to allow something on your machine that the team has not collectively agreed to — use \`.claude/settings.local.json\`. Auto-gitignored, same format.

## Layer 3: hooks

CLAUDE.md is a suggestion. Hooks are a guarantee.

If you write "always run the linter after editing files" in CLAUDE.md, Claude follows it most of the time. If you write a PostToolUse hook that runs the linter automatically, it runs every single time, without exception.

Hooks are shell scripts that fire at specific points in Claude's workflow. They receive a JSON payload on stdin and communicate back via exit codes. The configuration lives under a \`hooks\` key in \`settings.json\`.

**The exit code mistake that kills most hook implementations:**

Exit code 2 is the only code that blocks execution. Exit 0 is success. Exit 1 is "error, but non-blocking" — it logs a message and does nothing else. If you write a security hook and exit with code 1, you have written a hook that logs warnings while Claude proceeds anyway. For any hook meant to prevent an action, the exit code must be 2.

**The two hooks worth setting up first:**

A PostToolUse formatter that runs automatically after every file edit. Wire up the \`Write|Edit|MultiEdit\` matcher in \`settings.json\` to a command that reads the edited file path from the JSON payload (via \`jq -r '.tool_input.file_path'\`) and runs Prettier on it. Claude edits a file, Prettier runs immediately, the file is formatted before Claude sees it again.

A PreToolUse bash firewall that blocks dangerous commands before they execute. A script reads the proposed command from stdin, checks it against a list of blocked patterns (\`rm -rf /\`, \`git push --force main\`, \`DROP TABLE\`, \`chmod 777\`), and exits with code 2 if there is a match. The match causes Claude to see the error and self-correct rather than proceeding.

**The Stop hook trap:**

Stop hooks fire when Claude finishes its work. A Stop hook that runs your test suite and exits 2 on failure prevents Claude from declaring done until tests pass — useful for quality gates. The trap: if you do not check the \`stop_hook_active\` flag in the JSON payload, the hook will block Claude, Claude will retry, the hook will block again, and you have an infinite loop. Always check this flag and return exit 0 on the second attempt.

One more thing: hooks do not hot-reload mid-session. Change a hook while Claude Code is running and you need to restart the session for it to take effect.

## Layer 4: rules/

At some point CLAUDE.md grows. Different people own different parts. The API conventions section gets long. You want certain rules to only apply when Claude is working in specific directories.

That is when you reach for the \`rules/\` folder.

Every markdown file inside \`.claude/rules/\` loads alongside CLAUDE.md automatically. Instead of one file that everyone edits, you have separate files organized by concern — \`api-conventions.md\`, \`testing.md\`, \`code-style.md\`, \`security.md\`. The person who owns API conventions edits \`api-conventions.md\`. Nobody steps on each other.

The more useful feature is path-scoped rules. Add YAML frontmatter to a rules file and it only activates when Claude is working with matching paths. A file with \`paths: ["src/api/**/*.ts", "src/handlers/**/*.ts"]\` in its frontmatter loads when Claude is in those directories and nowhere else. The same API conventions that you want enforced in your handler code stay out of Claude's context when it is editing a React component.

Rules files without a \`paths\` field load unconditionally, every session.

Most teams do not need \`rules/\` early on. When your CLAUDE.md hits around 200 lines, or when two people edit it in the same week and create a merge conflict — that is the signal.

## Layer 5: skills and agents

Most teams never need these. That is not a reason to ignore them, but it is worth being honest about.

Skills are workflows that Claude invokes based on context — it reads the description in a skill's frontmatter and activates the skill when the task matches. They bundle a set of instructions with any supporting files the workflow needs. You can also call them explicitly with a slash command. The right use case: recurring workflows complex enough to be worth packaging — a security audit checklist before PRs, a deployment notes template, a release process guide.

Agents are specialized subagent personas. When a task is exploratory enough to flood your main context window with intermediate steps — reading 40 files, correlating findings across them, building a report — spawning an agent keeps that work in a separate context window and returns a compressed result. The \`tools\` field in an agent's config restricts what it can do: a code reviewer only needs Read, Grep, and Glob. A security auditor should not be writing files. The \`model\` field lets you run focused read-only tasks on a cheaper, faster model and reserve the heavier one for work that actually needs it.

The signal for skills: you find yourself giving Claude the same multi-step workflow instructions more than a few times a week. The signal for agents: a task is big enough that the exploration work would consume most of your context budget, and the final output is a distillation of that work rather than the exploration itself.

## Where to start

Day one: CLAUDE.md with your run commands, architecture essentials, and non-obvious gotchas. Keep it under 50 lines. Add \`.claude/settings.json\` with an allow list for your build commands and a deny list for destructive operations and credential files.

First week: Add a PostToolUse formatter hook. This is the highest-leverage hook for most teams and takes about ten minutes to set up.

When you hit friction: If CLAUDE.md starts growing or causing merge conflicts, split it into \`.claude/rules/\` files. If you have a security-critical workflow, add a PreToolUse bash firewall.

When you have recurring complexity: Skills and agents, for workflows you repeat often enough to formalize.

The 80/20: CLAUDE.md and settings.json get you most of the value. Every layer after that is an optimization on a working foundation — not a substitute for having the foundation right.`,
  },

  {
    termSlug: 'ai-agent',
    slug: 'ai-agent-harness-explained',
    angle: 'process',
    title: 'The agent harness: why your infrastructure matters more than your model',
    excerpt: 'Most developers focus on the model. The engineers building production AI applications focus on everything around it. Here is what the agent harness is, why it determines whether your app actually works, and where to start building it intentionally.',
    readTime: 9,
    cluster: 'Developer Patterns',
    audience: ['developer'],
    body: `You build a chatbot. You wire up a loop with a few tools. It works in a demo.

Then you try to make it production-grade, and something starts to go wrong. The model forgets what it did three steps ago. Tool calls return errors that get swallowed. Context fills up with garbage. You swap in a more powerful model and the improvement is smaller than expected.

The model is fine. The problem is everything around the model.

That everything has a name: the agent harness.

## What the harness actually is

Strip an AI agent down to its moving parts and you find two things: the model (weights, training, the intelligence) and the harness (everything else that makes the intelligence useful). The model is the engine. The harness is the car.

Anthropic put it directly in their Claude Code documentation: "the SDK is the agent harness that powers Claude Code." OpenAI uses the same framing for Codex. LangChain researcher Vivek Trivedy summarized the mental model in one line: "If you're not the model, you're the harness."

When a developer says "I built an agent," they mean they built a harness and pointed it at a model. The model handles reasoning. The harness handles everything that makes that reasoning useful: keeping context coherent, executing tools reliably, catching failures before they compound, persisting state across turns, and enforcing safety constraints.

A production harness has several distinct layers working together.

**The orchestration loop** is the heartbeat. It assembles the prompt, calls the model, parses the output, executes any tool calls, feeds results back, and repeats. Mechanically, it is often a while loop. The complexity lives in what the loop manages, not the loop itself. Anthropic describes their runtime as a "dumb loop" — all intelligence lives in the model; the harness just manages turns.

**Tools** are the agent's hands. Each tool is defined as a schema (name, description, parameter types) injected into the model's context so it knows what is available. The tool layer handles argument validation, sandboxed execution, result capture, and formatting results back into the model's next prompt.

**Memory** operates at different timescales. Short-term memory is conversation history within a session. Long-term memory persists across sessions. Anthropic's Claude Code implements a three-tier hierarchy: a lightweight index (always loaded), detailed topic files pulled in on demand, and raw transcripts accessed through search. The architectural principle: treat stored memory as a hint and verify against actual state before acting on it.

**Context management** is where most harnesses fail silently. Key content landing in the middle of a context window degrades model performance by 30% or more — this is the "Lost in the Middle" effect confirmed across multiple research groups. Even million-token windows suffer instruction-following degradation as context grows. Production harnesses respond with compaction (summarizing history when approaching limits), observation masking (hiding old tool outputs while keeping tool calls visible), and just-in-time retrieval (loading data dynamically rather than pre-loading everything).

**Error handling and verification** are the difference between a demo and a product. A 10-step process with 99% per-step success still has only about a 90% end-to-end success rate. Errors compound. Production harnesses catch failures within tool handlers and return them as error messages so the model can self-correct — rather than letting errors propagate silently. Verification loops — running tests, checking output against expectations, having a separate model evaluate quality — improve output quality by 2 to 3x according to measurements from the Claude Code team.

**Guardrails** enforce what the model is allowed to attempt. The architectural separation matters: the model decides what to try, the harness decides what is permitted. These are different systems and they should be.

## Why the harness determines your results

LangChain researchers demonstrated something counterintuitive on TerminalBench 2.0: they changed only the infrastructure wrapping the model — same model, same weights — and jumped from outside the top 30 to rank 5. A separate research project hit 76% pass rate by having a model optimize the harness itself, surpassing hand-designed systems.

The same model in a well-designed harness outperforms itself in a poorly designed one by a larger margin than switching to the next tier of model.

This happens because a capable model running inside a failing harness cannot compensate for the harness. If context rot is degrading its access to earlier information, the model cannot fix that — it can only work with what it sees. If tool errors get swallowed instead of returned as recoverable messages, the model proceeds on incomplete information. If there is no verification loop, mistakes compound undetected.

The inverse is also true: a harness that actively supports good outcomes amplifies model capability. Context management keeps key information in high-signal positions. Error handling gives the model a chance to self-correct. Verification loops catch mistakes early. The model does what it does best — reason — because the harness handles everything that reasoning depends on.

## The four places harnesses fail in practice

**Context rot accumulates gradually.** Every turn that adds low-value content to the context window is degrading the signal-to-noise ratio for future turns. The model still runs. Output still appears. The quality degradation is subtle until it is not. Build compaction into your orchestration loop before you need it, not after you notice the quality drop.

**Tool failures disappear.** The most common tool handling mistake is letting exceptions bubble up without returning them as model-readable messages. A tool that throws an exception and halts the loop cannot be recovered. A tool that catches the exception and returns "Error: the file path you specified does not exist — please check the path and try again" gives the model something to work with. The loop continues. The model adjusts.

**Security hooks use the wrong exit code.** This applies specifically to Claude Code and similar hook systems. Exit code 2 is the only code that blocks execution. Exit code 1 logs an error and proceeds. A security hook that exits with code 1 is a warning system, not a guard. The model continues. This mistake is common because code 1 feels like "failure" — and failure should stop things. In this system, only code 2 stops things.

**Verification is treated as optional.** A harness that produces output without checking it is a one-shot system. Every meaningful production deployment has a verification layer: tests that run after code changes, visual checks for UI tasks, output validation before responses go out, or a separate evaluation step for quality-critical outputs. Catching a wrong answer before it reaches the user is worth more than producing the right answer faster.

## How the frameworks approach it differently

Anthropic bets on thin harnesses. The harness manages turns and enforces permissions. Intelligence — including planning and self-correction — lives in the model. As models improve, harness complexity decreases. Claude Code's team regularly removes planning steps from the harness as new model versions internalize those capabilities.

LangGraph bets on explicit structure. The harness is a typed state graph with checkpoints, conditional routing, and composable node logic. Control flow is visible, testable, and inspectable. Sub-agent delegation happens through nested state graphs.

OpenAI's Agents SDK sits between the two. The runtime is code-first — workflow logic in Python, not graph DSLs — with handoffs and tool restrictions governing how agents hand off control. The model handles reasoning; the SDK manages routing and tool permissions.

The philosophical difference is about where complexity should live. Thin harnesses assume models will keep improving and scaffolding will become less necessary. Thick harnesses assume explicit control is valuable regardless of model capability. Both bets have evidence supporting them.

One finding cuts across all frameworks: more tools often means worse performance. Vercel removed 80% of the tools from their v0 agent and got better results. The principle — expose the smallest tool set the current step actually requires — holds across architectures.

## Building the harness intentionally

Most developers build their harness by accident. A system prompt here, a try-catch there, a loop that kind of works — and over time, something that calls itself an agent.

Building it intentionally means making explicit decisions about each layer before they become problems: how context gets managed as sessions grow, how errors get returned to the model rather than swallowed, how tool permissions get enforced, how verification happens before output goes out.

Start with the orchestration loop and tool handling. Get errors returning as recoverable messages rather than exceptions. Add a basic verification step — even just running a test suite or checking output against a schema. These three changes alone cover most of the gap between demo performance and production performance.

Context management and guardrails come next. Compaction before you hit the limit. Permission enforcement separate from model reasoning.

Memory and subagent orchestration are the last layer — useful for long-running tasks that exceed a single context window, or for work that benefits from parallel exploration by specialized subagents.

The harness is not a solved problem or a commodity layer you drop in. It is the active engineering work that determines whether your model's capabilities translate into a product that actually works. The model handles reasoning. You handle everything else.`,
  },

]

async function main() {
  console.log('Seeding batch 30 articles...\n')

  for (const article of ARTICLES) {
    const term = await getTermId(article.termSlug)
    if (!term) {
      console.error(`  ✗ Term not found: ${article.termSlug}`)
      continue
    }

    const payload = {
      slug:      article.slug,
      title:     article.title,
      excerpt:   article.excerpt,
      body:      article.body,
      read_time: article.readTime,
      cluster:   article.cluster,
      angle:     article.angle,
      term_id:   term.id,
      term_name: term.name,
      term_slug: article.termSlug,
      published: true,
    }

    const { error } = await sb
      .from('articles')
      .upsert(payload, { onConflict: 'slug' })

    if (error) {
      console.error(`  ✗ ${article.slug}: ${error.message}`)
    } else {
      console.log(`  ✓ ${article.slug}`)
    }
  }

  console.log('\nDone.')
}

main()
