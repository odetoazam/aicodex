# Agent Teams: When Parallel Agents Actually Help (And When They Don't)

Agent Teams in Claude Code let you spawn multiple AI agents with distinct roles—a frontend dev, a backend dev, a QA reviewer—all working in parallel on the same project. Sounds powerful. The catch: there's real overhead, and most tasks don't need it.

## The Core Idea (And the Key Distinction)

Before diving in, the most important thing to understand: **Agent Teams are not the same as subagents.**

When you chat with Claude on the web or in the desktop app, it sometimes spawns subagents to parallelize work. Those subagents work independently and only report results back to the main agent—they never talk to each other. You can't message them directly, and you can't see what they're doing.

Agent Teams are different. Teammates:
- Each have their own context window and work independently
- **Communicate directly with each other**—not just through a lead
- Share a task list they can claim and hand off work through
- Can be messaged individually by you, at any time

That inter-agent communication is what makes them worth the setup cost for complex tasks. If you just need parallelism where results get piped back to a single agent, subagents are lighter and cheaper.

## The Setup Tax

Agent Teams require:
- Claude Code v2.1.32 or later (`claude --version` to check)
- Linux or macOS (Windows split-pane mode doesn't work in Windows Terminal—in-process mode does)
- Pro or Max subscription
- The environment variable `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` set in settings.json—it's disabled by default

These are experimental and disabled by default, with known limitations around session resumption and task coordination.

## When Agent Teams Win

**The work needs parallel exploration, not parallel execution.** The distinction matters. If you have three separate modules to build, you could split them across teammates—but if they're independent enough, just using three separate Claude Code sessions (or Git worktrees) might be simpler.

Where Agent Teams shine:

- **Research with competing hypotheses**: three teammates each investigating a different root cause for a bug, explicitly tasked with disproving each other's theories. This beats sequential investigation because the survivor is more trustworthy.
- **Code review with distinct lenses**: a security reviewer, a performance reviewer, and a test-coverage reviewer working the same PR simultaneously—each applies a different filter, no overlap.
- **Cross-layer coordination**: frontend, backend, and test coverage each owned by a different teammate. They finish in parallel, communicate about integration points, and hand off.
- **New modules with clear boundaries**: teammates own separate files. Conflict risk is low, parallelism benefit is high.

The common pattern: tasks are separable, the team genuinely benefits from talking to each other (not just running in parallel), and the total work takes 1+ hours.

## When They Don't

Single-agent Claude Code or the desktop app wins here:
- **Quick tasks under 30 minutes**: coordination overhead eats the gain
- **Same-file edits**: two teammates touching the same file will overwrite each other
- **Sequential work**: when task B depends on task A, parallelism doesn't help
- **Exploratory or undefined work**: teams work best when the structure is already clear
- **Routine scripts and one-offs**: use the desktop app; no setup required

Also: **one team per session, no nested teams**. A lead can only manage one team at a time. Teammates can't spawn their own sub-teams. If you need a different team structure, clean up first.

## The Rules That Actually Matter

Teams break silently without constraints. If you don't define ownership upfront:
- Teammates overwrite each other's files
- Tasks get claimed twice or not at all
- No one knows what "done" means

The official approach is to give the lead criteria in your spawn prompt:

- Define file ownership explicitly: "The frontend teammate owns `src/components/`, backend owns `src/api/`"
- Tell the lead what to approve or reject: "Only approve plans that include test coverage"
- Use hooks (`TeammateIdle`, `TaskCompleted`) to enforce quality gates at the task level

The task system does have built-in dependency management—a task with unresolved dependencies can't be claimed until those are done—but only if you structure the tasks correctly.

## Team Size and Task Sizing

The official recommendation is 3–5 teammates for most workflows. The sweet spot for task-to-teammate ratio is 5–6 tasks per teammate. That keeps everyone productive without too much context-switching.

- **Too few tasks**: teammates go idle; no parallelism gain
- **Too many**: coordination overhead, conflict risk
- **Too small tasks**: setup cost exceeds benefit
- **Too large tasks**: teammates work for long stretches without check-ins; mistakes compound

If the lead isn't breaking work into enough pieces, tell it to split tasks smaller.

## Display Modes: In-Process vs Split Panes

Two options:

**In-process** (default if you're not already in tmux): all teammates run inside your main terminal. Press `Shift+Down` to cycle through teammates and type to send a message. Wraps back to the lead after the last teammate. Works in any terminal, no extra setup.

**Split panes**: each teammate gets its own pane. You see all of them at once and click into any pane to interact. Requires tmux or iTerm2 with the `it2` CLI.

Split-pane mode doesn't work in VS Code's integrated terminal, Windows Terminal, or Ghostty. In-process works everywhere.

To force in-process for a session: `claude --teammate-mode in-process`

## Model Choice Per Teammate

You can specify the model per teammate—it doesn't have to be Opus:

```
Create a team with 4 teammates to refactor these modules in parallel.
Use Sonnet for each teammate.
```

Smaller models cost less per teammate, which matters when token costs scale with each active context window. If you're doing research or review tasks, Sonnet or even Haiku may be sufficient.

## Plan Approval

For risky or complex work, you can require a teammate to plan before implementing:

```
Spawn an architect teammate to refactor the authentication module.
Require plan approval before they make any changes.
```

The teammate works in read-only mode, writes a plan, and sends it to the lead for approval. The lead can approve or reject with feedback. If rejected, the teammate revises and resubmits. Only after approval does implementation begin.

You control what the lead approves. Give it criteria: "reject any plan that touches the database schema" and the lead applies that judgment autonomously.

## Known Limitations (The Ones That Actually Affect You)

- **No session resumption**: `/resume` and `/rewind` don't restore in-process teammates. If you close and reopen, the lead may try to message teammates that no longer exist. Spawn new ones.
- **Task status can lag**: teammates sometimes fail to mark tasks complete, which blocks dependent tasks. If something's stuck, manually update the status or tell the lead to nudge the teammate.
- **Lead is fixed**: whoever creates the team is the lead. You can't promote a teammate.
- **Shutdown isn't instant**: teammates finish their current action before stopping. Factor this in before force-quitting anything.

## The Real Win

Speed isn't the primary argument for Agent Teams. A well-prompted single agent with subagents often gets you there faster for most tasks.

The real argument is **structured parallel exploration**—specifically when you want multiple agents examining the same problem from different angles, talking to each other, and converging on a result that survived scrutiny. The parallel code review and competing-hypotheses debugging examples are where teams genuinely outperform everything else.

For everything else: start with Claude desktop. If you hit parallelism limits, use Git worktrees with separate sessions. Only reach for Agent Teams when inter-agent communication is actually what you need.
