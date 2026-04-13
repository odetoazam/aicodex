/**
 * Update ai-agent-harness-explained article:
 * - Add section on Managed Agents as "pre-built harness" model
 * - Add the intelligence/infrastructure decoupling concept
 * - Add portable/throwaway framing for sessions and tools
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/update-agent-harness.ts
 */

import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const body = `You build a chatbot. You wire up a loop with a few tools. It works in a demo.

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

## What Managed Agents change about this picture

With Claude [Managed Agents](/glossary/managed-agents), Anthropic provides the harness. You bring the intelligence.

Practically: the sessions, tool execution, orchestration loop, and sandboxing are all handled by Anthropic's infrastructure. What you define — your agent's instructions, skills, and the logic of what it should accomplish — is portable. You can deploy the same agent definition to different environments because it is decoupled from the infrastructure layer underneath it.

This is useful in two scenarios. First, if you want to ship an autonomous agent without building and maintaining the infrastructure yourself — Managed Agents get you there faster at a higher ongoing cost. Second, if you want to understand what a production harness actually needs to provide, watching what Managed Agents handles for you is a good way to read the requirements list: session management, sandboxed tool execution, observability (the session transcript showing every tool call), and cost tracking.

The choice between Managed Agents and the Agent SDK is essentially a build-vs-buy decision on the harness itself. Managed Agents give you a complete harness immediately; the SDK gives you the pieces to build one that runs on your infrastructure. Same intelligence layer, different infrastructure story.

## Building the harness intentionally

Most developers build their harness by accident. A system prompt here, a try-catch there, a loop that kind of works — and over time, something that calls itself an agent.

Building it intentionally means making explicit decisions about each layer before they become problems: how context gets managed as sessions grow, how errors get returned to the model rather than swallowed, how tool permissions get enforced, how verification happens before output goes out.

Start with the orchestration loop and tool handling. Get errors returning as recoverable messages rather than exceptions. Add a basic verification step — even just running a test suite or checking output against a schema. These three changes alone cover most of the gap between demo performance and production performance.

Context management and guardrails come next. Compaction before you hit the limit. Permission enforcement separate from model reasoning.

Memory and subagent orchestration are the last layer — useful for long-running tasks that exceed a single context window, or for work that benefits from parallel exploration by specialized subagents.

The harness is not a solved problem or a commodity layer you drop in. It is the active engineering work that determines whether your model's capabilities translate into a product that actually works. The model handles reasoning. You handle everything else.`

async function main() {
  const { error } = await sb
    .from('articles')
    .update({
      body,
      updated_at: new Date().toISOString(),
    })
    .eq('slug', 'ai-agent-harness-explained')

  if (error) {
    console.error('✗ ai-agent-harness-explained:', error.message)
  } else {
    console.log('✓ ai-agent-harness-explained updated')
  }
}

main().catch(console.error)
