/**
 * Batch 20 — Tool use deep dive, multi-agent basics, customer discovery, meeting prep
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-20.ts
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

  // ── 1. Tool use: implementation deep dive ─────────────────────────────────
  {
    termSlug: 'tool-use',
    slug: 'tool-use-implementation-deep-dive',
    angle: 'process',
    title: 'Tool use with Claude: the complete implementation guide',
    excerpt: 'Defining tools, parsing responses, handling multi-turn tool calls, parallel tool use, and the failure modes that will bite you in production.',
    readTime: 8,
    cluster: 'Agents & Orchestration',
    body: `[Tool use](/glossary/tool-use) is how you give Claude the ability to take actions: call an API, query a database, run a function, search the web. The model decides when to use a tool and what arguments to pass. You execute the tool and return the result. Claude continues from there.

The concept is simple. The implementation has enough edge cases to warrant a full walkthrough.

## Defining tools

Tools are described as JSON schema objects. Claude uses the description and parameter schema to decide when and how to call them. Quality here directly affects quality of tool calls — vague descriptions produce vague calls.

\`\`\`python
import anthropic

client = anthropic.Anthropic()

tools = [
    {
        "name": "get_weather",
        "description": "Get current weather for a specific location. Returns temperature in Celsius, conditions (sunny/cloudy/rainy/etc), and humidity percentage.",
        "input_schema": {
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "description": "City name and country code, e.g. 'London, GB' or 'Tokyo, JP'"
                },
                "units": {
                    "type": "string",
                    "enum": ["celsius", "fahrenheit"],
                    "description": "Temperature units. Defaults to celsius."
                }
            },
            "required": ["location"]
        }
    },
    {
        "name": "search_database",
        "description": "Search internal product database for items matching a query. Returns list of matching products with name, SKU, price, and stock status.",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "Search query. Supports partial matches."
                },
                "max_results": {
                    "type": "integer",
                    "description": "Maximum number of results to return. Default 10, max 50.",
                    "default": 10
                }
            },
            "required": ["query"]
        }
    }
]
\`\`\`

Description writing rules that matter:
- Say what the tool *returns*, not just what it does. "Returns temperature in Celsius, conditions, and humidity" is more useful to the model than "Gets weather."
- Describe parameter formats explicitly. "City name and country code, e.g. 'London, GB'" prevents the model from passing "London" when you need "London, GB".
- Note defaults and limits. The model uses this to avoid unnecessary parameter inclusion.

## Making a request with tools

\`\`\`python
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    tools=tools,
    messages=[
        {"role": "user", "content": "What's the weather like in Tokyo right now?"}
    ]
)

print(response.stop_reason)   # "tool_use" or "end_turn"
print(response.content)       # list of content blocks
\`\`\`

When Claude wants to use a tool, \`stop_reason\` is \`"tool_use"\` and \`content\` contains one or more \`tool_use\` blocks alongside any text:

\`\`\`python
# Inspect the response
for block in response.content:
    if block.type == "tool_use":
        print(f"Tool: {block.name}")
        print(f"ID:   {block.id}")
        print(f"Args: {block.input}")
    elif block.type == "text":
        print(f"Text: {block.text}")
\`\`\`

## Executing the tool and continuing

This is where most implementations get the message structure wrong. After a tool call, you must:
1. Append Claude's full response (including the \`tool_use\` block) to messages as an \`assistant\` turn
2. Append a \`user\` turn containing a \`tool_result\` block with the result

\`\`\`python
import json

def execute_tool(name: str, args: dict) -> str:
    """Your actual tool execution logic."""
    if name == "get_weather":
        # Call your weather API
        return json.dumps({"temp": 18, "conditions": "partly cloudy", "humidity": 72})
    elif name == "search_database":
        # Query your DB
        return json.dumps({"results": [{"name": "Widget A", "sku": "W001", "price": 29.99, "in_stock": True}]})
    return json.dumps({"error": "Unknown tool"})


def run_with_tools(user_message: str) -> str:
    messages = [{"role": "user", "content": user_message}]

    while True:
        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=1024,
            tools=tools,
            messages=messages,
        )

        # Append assistant response to history
        messages.append({"role": "assistant", "content": response.content})

        if response.stop_reason == "end_turn":
            # Extract final text response
            for block in response.content:
                if hasattr(block, "text"):
                    return block.text
            return ""

        if response.stop_reason == "tool_use":
            # Execute all tool calls in this response
            tool_results = []
            for block in response.content:
                if block.type == "tool_use":
                    result = execute_tool(block.name, block.input)
                    tool_results.append({
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": result,
                    })

            # Append tool results as user turn
            messages.append({"role": "user", "content": tool_results})
            # Loop — Claude will continue from here

        else:
            # stop_reason is "max_tokens" or something unexpected
            break

    return ""
\`\`\`

## Parallel tool use

Claude can call multiple tools in a single response when the calls are independent. Your loop already handles this — process all \`tool_use\` blocks in a response before continuing.

\`\`\`python
# Claude might return this in a single response:
# - tool_use: get_weather(location="Tokyo, JP")
# - tool_use: get_weather(location="London, GB")
# - tool_use: search_database(query="umbrellas")

# Execute all three, return all three results, then continue
\`\`\`

When parallel tool calls are possible, they are faster. If your execution is synchronous, that does not help you — use \`asyncio\` or threading if latency matters.

## Forcing or preventing tool use

\`tool_choice\` controls whether Claude must use a tool, can choose, or cannot use any:

\`\`\`python
# Force Claude to call a specific tool
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    tools=tools,
    tool_choice={"type": "tool", "name": "search_database"},
    messages=[...]
)

# Let Claude decide (default)
tool_choice={"type": "auto"}

# Prevent any tool use — Claude answers from context only
tool_choice={"type": "none"}
\`\`\`

Force-calling a tool is useful when you want structured extraction rather than a conversational response. Ask Claude to call a tool whose schema matches the shape of data you want back — cleaner than asking for JSON and parsing it.

## Error handling

Tools fail. Return errors in the \`tool_result\` content so Claude can respond appropriately rather than hallucinating a result:

\`\`\`python
try:
    result = call_external_api(args)
    tool_result_content = json.dumps(result)
    is_error = False
except Exception as e:
    tool_result_content = f"Error: {str(e)}"
    is_error = True

tool_results.append({
    "type": "tool_result",
    "tool_use_id": block.id,
    "content": tool_result_content,
    "is_error": is_error,   # tells Claude the tool failed
})
\`\`\`

With \`is_error: true\`, Claude knows the call failed and can tell the user, retry with different parameters, or try a different approach — rather than continuing as if it got a valid result.

## The failure modes

**Infinite tool loops.** If Claude calls a tool, gets a result, calls the same tool again, and so on — you have a loop. Cap iterations:

\`\`\`python
MAX_ITERATIONS = 10
iteration = 0

while iteration < MAX_ITERATIONS:
    # ... your loop
    iteration += 1
\`\`\`

**Tool descriptions that are too vague.** If Claude calls the wrong tool or passes wrong arguments, the description is almost always the cause. Read the tool call in your logs and ask: given this description, would a developer know to call it this way? If not, fix the description.

**Not passing the full content array.** When you append the assistant turn after a tool call, you must pass \`response.content\` (the full list), not just the text blocks. Omitting the \`tool_use\` blocks causes an API error on the next request.

**Assuming tool calls are atomic.** Claude may call multiple tools before producing a final answer. Your loop must handle this correctly — do not return early after the first \`end_turn\` check if the response also contains unprocessed tool calls.`,
  },

  // ── 2. Multi-agent orchestration basics ───────────────────────────────────
  {
    termSlug: 'multi-agent-system',
    slug: 'multi-agent-orchestration-basics',
    angle: 'process',
    title: 'Multi-agent orchestration: when one Claude isn\'t enough',
    excerpt: 'Subagents, orchestrators, parallelism, and state management. The patterns that work and the ones that look good until they hit production.',
    readTime: 8,
    cluster: 'Agents & Orchestration',
    body: `A single Claude call handles a lot. But some tasks are too long for one context window, benefit from parallelism, or require specialized sub-tasks that should not pollute a single context. That is when you reach for multi-agent patterns.

Multi-agent does not mean "use multiple models for everything." It means decomposing a task so that multiple focused agents each do one thing well, coordinated by an orchestrator that manages the overall workflow.

## The core pattern: orchestrator + subagents

The orchestrator receives the top-level task, breaks it into subtasks, dispatches subagents to handle each one, collects results, and produces a final output. Subagents are narrow: they know how to do one thing.

\`\`\`python
import anthropic
from concurrent.futures import ThreadPoolExecutor, as_completed

client = anthropic.Anthropic()

def run_subagent(task: str, context: str, system: str) -> str:
    """A focused agent that handles one subtask."""
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2048,
        system=system,
        messages=[{"role": "user", "content": f"Context:\\n{context}\\n\\nTask: {task}"}]
    )
    return response.content[0].text


def orchestrate(user_request: str) -> str:
    # Step 1: Orchestrator plans the work
    plan_response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        system="""You are a task planner. Break the user's request into 2-4 independent subtasks
that can be done in parallel. Return JSON: {"subtasks": [{"id": "1", "task": "...", "specialist": "..."}]}""",
        messages=[{"role": "user", "content": user_request}]
    )

    import json
    plan = json.loads(plan_response.content[0].text)

    # Step 2: Run subtasks in parallel
    results = {}
    with ThreadPoolExecutor(max_workers=4) as executor:
        futures = {
            executor.submit(
                run_subagent,
                subtask["task"],
                user_request,
                f"You are a specialist in {subtask['specialist']}. Be thorough and specific."
            ): subtask["id"]
            for subtask in plan["subtasks"]
        }
        for future in as_completed(futures):
            task_id = futures[future]
            results[task_id] = future.result()

    # Step 3: Synthesize
    synthesis_input = "\\n\\n".join([
        f"Subtask {tid}:\\n{result}"
        for tid, result in sorted(results.items())
    ])

    final = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2048,
        system="Synthesize the subtask results into a coherent, complete response.",
        messages=[{"role": "user", "content": f"Original request: {user_request}\\n\\nSubtask results:\\n{synthesis_input}"}]
    )

    return final.content[0].text
\`\`\`

## When parallelism actually helps

Parallel subagents reduce wall-clock time when subtasks are independent and each takes meaningful time. Common cases:

- **Research across multiple sources**: agent A searches domain X, agent B searches domain Y, orchestrator combines
- **Processing a list in parallel**: each item analyzed by its own subagent, results merged
- **Perspective generation**: agent A argues for, agent B argues against, orchestrator synthesizes
- **Multi-step pipelines with independent branches**: draft + fact-check + format can all run simultaneously if they operate on different inputs

Parallelism does not help when subtasks are sequential (each depends on the previous result) or when the orchestration overhead exceeds the time saved.

## State management

Multi-agent systems fail at state. Each agent call is stateless — the subagent does not remember previous calls unless you explicitly pass context. You are responsible for:

**Passing relevant context to each subagent.** Do not assume subagents know what the orchestrator knows. Pass the original request, any relevant intermediate results, and any constraints that should shape the output.

\`\`\`python
context = {
    "original_request": user_request,
    "constraints": ["max 500 words", "cite sources", "avoid jargon"],
    "prior_results": results_so_far,  # if sequential
}
\`\`\`

**Storing intermediate results.** For long-running workflows, save subagent outputs to persistent storage (database, file) rather than holding them in memory. If a subagent fails mid-workflow, you can resume from the last saved state rather than restarting from scratch.

**Passing the right amount of context.** Context windows are large but not infinite. If you pass every prior result to every subsequent agent, context grows until it overflows or performance degrades. Pass only what is necessary for each step.

## Handling subagent failures

Subagents fail. Network errors, model errors, unexpected output formats. Your orchestrator needs to handle this without failing the whole workflow:

\`\`\`python
def run_subagent_safe(task: str, context: str, system: str, retries: int = 2) -> dict:
    for attempt in range(retries + 1):
        try:
            result = run_subagent(task, context, system)
            return {"success": True, "result": result}
        except Exception as e:
            if attempt == retries:
                return {"success": False, "error": str(e), "task": task}
    return {"success": False, "error": "Max retries exceeded", "task": task}

# In orchestrator: handle partial failures
results = {}
failed = []
for future in as_completed(futures):
    task_id = futures[future]
    outcome = future.result()
    if outcome["success"]:
        results[task_id] = outcome["result"]
    else:
        failed.append(outcome)

if failed:
    # Decide: proceed with partial results, retry failed tasks, or surface error
    pass
\`\`\`

## Human-in-the-loop checkpoints

For consequential workflows — ones that write to a database, send communications, execute financial transactions — add explicit checkpoints where a human reviews before the agent proceeds.

\`\`\`python
def checkpoint(description: str, payload: dict) -> bool:
    """Show the human what the agent is about to do. Return True to proceed."""
    print(f"\\n--- CHECKPOINT ---")
    print(f"About to: {description}")
    print(f"Payload: {json.dumps(payload, indent=2)}")
    response = input("Proceed? [y/n]: ")
    return response.lower() == "y"

# In your agent loop:
if checkpoint("Send email to client", {"to": email, "subject": subject, "body": body}):
    send_email(email, subject, body)
else:
    print("Cancelled by user")
\`\`\`

In production, checkpoints surface in a UI rather than a terminal prompt — but the pattern is the same. The agent pauses, the human reviews, the agent continues or stops.

## The patterns that look good but fail

**Too many agents for a simple task.** Orchestration adds latency, complexity, and failure surface. If a single well-prompted Claude call can do the job, use it. Multi-agent is for tasks where the single-call approach genuinely falls short.

**Agents that call each other in cycles.** Agent A calls Agent B, which calls Agent C, which calls Agent A. You get a loop. Design flows as DAGs (directed acyclic graphs) — each agent's output feeds forward, never backward.

**Passing full conversation history through agents.** If Agent A's full 10,000-token conversation is passed as context to Agent B, your context consumption compounds quickly. Extract summaries or structured outputs, not raw histories.

**No output validation between stages.** If Agent A produces malformed JSON that Agent B expects to parse, Agent B fails and the error is hard to trace. Validate outputs at each handoff point.

## Choosing the right model per agent

You do not need to use the same model for every agent. Use the most capable model where quality matters most (the synthesis step, complex reasoning) and cheaper/faster models where precision is less critical (classification, routing, simple extraction):

\`\`\`python
ORCHESTRATOR_MODEL = "claude-sonnet-4-6"   # planning and synthesis
SUBAGENT_MODEL = "claude-haiku-4-5-20251001"  # fast, cheap parallel workers
JUDGE_MODEL = "claude-haiku-4-5-20251001"     # eval/validation
\`\`\`

This can cut cost 60-80% on parallelized workloads with no meaningful quality loss on the subtasks themselves.`,
  },

  // ── 3. Customer discovery with Claude ─────────────────────────────────────
  {
    termSlug: 'ai-use-case-discovery',
    slug: 'customer-discovery-with-claude',
    angle: 'field-note',
    title: 'Using Claude for customer discovery: what works and what makes it worse',
    excerpt: 'Customer discovery is the one job where Claude is most dangerous if used wrong. Here\'s how to use it to prepare better, synthesize faster, and avoid the trap of letting it replace the conversations.',
    readTime: 6,
    cluster: 'Business Strategy & ROI',
    body: `Customer discovery is the most important thing an early-stage founder does, and it is the area where AI use can go most wrong. The failure mode is not using Claude for the wrong task — it is using it in a way that gives you false confidence in insights you have not actually earned.

This is the version that works: Claude for preparation and synthesis, humans for the actual conversations.

## What Claude is good for in discovery

**Preparing for interviews.** The quality of a customer interview depends almost entirely on the questions you ask. Generic questions get generic answers. Specific, hypothesis-driven questions get the information you actually need.

Before each interview, spend ten minutes in Claude:

*"I'm interviewing a [role] at a [company type] tomorrow. My current hypothesis is [hypothesis]. I think they have [problem]. Help me generate 10 questions that would either confirm or kill this hypothesis. Make them open-ended. Avoid leading questions. Start with their current behavior, not my product."*

The resulting questions are better than what most founders prepare on their own, because Claude will push you toward behavioral questions ("Walk me through the last time you did X") over opinion questions ("Would you use a product that did Y?"). Behavioral questions get real data. Opinion questions get polite speculation.

**Synthesizing across interviews.** After five interviews, patterns start emerging but are hard to articulate. You have pages of notes, a handful of quotes, and a general sense of what you heard — but translating that into a clear hypothesis requires real synthesis work.

Paste your raw notes into Claude (redact anything sensitive):

*"Here are my notes from five customer discovery interviews. What patterns do you see? What do multiple people mention that I might have dismissed as one-off? What seems like a strong signal vs. noise? What question should I have been asking that I wasn't?"*

Claude will surface connections across interviews that are hard to see when you're too close to the individual conversations. The synthesis is not a substitute for your own analysis — it is a starting point that saves you two hours of staring at sticky notes.

**Writing the synthesis doc.** Most founders keep their discovery insights in their head or in scattered notes. Writing a clear synthesis document — what you learned, what you believe, what you are still uncertain about — forces clarity and creates something you can share with co-founders, advisors, or early investors.

Claude is genuinely useful here: you dump your insights in rough form, it organizes them into a readable document. The thinking is yours. The formatting is Claude's.

## The interview simulation (use carefully)

You can ask Claude to roleplay as a customer and practice your interview script. This has real value — it surfaces questions that are confusing, leading, or too narrow before you burn an actual interview slot on them.

*"Roleplay as a senior CS manager at a 100-person SaaS company. I'm going to practice my customer discovery interview with you. Push back when my questions are leading or too vague. Stay in character."*

The critical caveat: Claude's simulated responses are drawn from its training data about how people generally behave, not from the actual person you are trying to understand. It will validate plausible things and miss unusual things. Use it to stress-test your questions, not to draw conclusions about your customer.

The trap: founders who run five simulated interviews and feel like they have done discovery. They have not. Simulated interviews are warmup, not research.

## What Claude cannot do

**Tell you whether your hypothesis is right.** Only real customers can do that. If you describe your hypothesis to Claude and ask if it sounds valid, you will get a thoughtful analysis of whether it seems plausible — not evidence that it is true.

**Replace the unscripted parts of an interview.** The most valuable moments in customer discovery are usually the tangents — the thing the person mentions offhand that was not in your question list, the moment of visible frustration when you ask about a workaround, the pause before they answer a question in a way that tells you they're being careful. These only happen in real conversations.

**Catch what you are missing in your mental model.** Claude synthesizes what you give it. If you went into five interviews with a blind spot — a whole category of problem you were not asking about — Claude will not invent it. It will organize the blind spot you already have. The cure for this is diversity of interview subjects and active effort to disconfirm your assumptions, not more Claude.

## The discipline that makes it work

Use Claude between interviews, not during them. During the interview: phone down, notes brief, full attention on the person. After the interview: immediately write rough notes while the memory is fresh (ten minutes, no polish), then use Claude to help you think through what you heard.

The founders who extract the most from customer discovery do the hard part — the actual conversations, the uncomfortable silences, the follow-up probes — and use Claude to make the surrounding work faster. The founders who use Claude to shortcut the conversations end up with organized notes about things they never actually learned.`,
  },

  // ── 4. Meeting prep with Claude ────────────────────────────────────────────
  {
    termSlug: 'claude-projects',
    slug: 'meeting-prep-with-claude',
    angle: 'process',
    title: 'Meeting prep with Claude: the 10-minute routine that changes the quality of every call',
    excerpt: 'Most meetings fail before they start — not from bad intentions but bad preparation. A structured 10-minute routine that works for 1:1s, client calls, difficult conversations, and investor meetings.',
    readTime: 5,
    cluster: 'Business Strategy & ROI',
    body: `Most meetings are bad because they were prepared for badly, not because the people in them were bad. Walking into a 1:1 with your manager without knowing what you want from it. Getting on a client call without reviewing the last three interactions. Having a difficult conversation you have been avoiding without thinking through what you are actually trying to accomplish.

Ten minutes of structured prep changes the quality of almost every meeting. Claude makes that ten minutes faster and sharper than doing it alone.

## The one question that matters before any meeting

Before anything else: *what is the specific outcome I want from this meeting?*

Not "to catch up." Not "to discuss Q3." A specific outcome: a decision made, a concern addressed, a relationship repaired, a next step agreed on, a number approved.

Prompt: *"I have a [meeting type] with [who] in 30 minutes. Here is my context: [context]. Help me articulate the specific outcome I want. Then give me the three most important things to say or ask to get there."*

This forces clarity that most people never reach before walking into a room. The three things you get back are your agenda — not written on a slide, just in your head.

## The four meeting types and what prep looks like for each

**The 1:1 with your manager**

The goal: leave with clarity on priorities and with your manager knowing where you stand.

Prompt: *"I have my weekly 1:1 in 20 minutes. Here's what I've been working on this week: [summary]. Here's where I'm stuck or uncertain: [blockers]. Help me: (1) frame my update in a way that's concise and shows judgment, not just activity; (2) phrase the thing I'm uncertain about as a clear question rather than just dumping it on them; (3) flag anything here that my manager might care about that I'm underselling."*

The third part is the one most people miss — the thing you are downplaying because it feels like admitting a problem when actually it is something your manager wants to know about.

**The client call**

The goal: understand where you stand and what needs to happen next.

Before a client call, paste the last two or three email threads or meeting notes into Claude:

*"Here are my last few interactions with this client. Before our call today: (1) what is the current state of this relationship — warm, lukewarm, or at risk? (2) what did I say I would do that I should have updates on? (3) what is the one thing I should not leave this call without addressing?"*

This catches the dropped thread you forgot about, the commitment you made three weeks ago that they remember and you don't, and the underlying concern that might not be on the explicit agenda.

**The difficult conversation**

The goal: say what needs to be said without it going sideways.

Difficult conversations fail in two ways: you avoid the real point and talk around it, or you lead with the wrong framing and put the other person on the defensive immediately.

Prompt: *"I need to have a difficult conversation with [person] about [issue]. My goal is [specific outcome — not 'make them feel bad', but 'agree on a new arrangement' or 'understand why this keeps happening']. Help me: (1) find the most direct, non-accusatory way to open; (2) anticipate their likely reaction and how I should respond; (3) identify the thing I'm afraid to say that is actually the most important thing to say."*

The third part is the hardest and the most valuable. There is almost always something the person preparing for the difficult conversation already knows they should say but is hoping they can avoid. Claude surfaces it.

**The investor or sales meeting**

The goal: give them a clear picture and create forward momentum.

Prompt: *"I have a [investor pitch / sales call] in 30 minutes with [description of who they are and what they care about]. Here is my context: [company stage, what I want from the meeting, relevant background on them]. Help me: (1) identify the two or three things they are most likely to probe or push back on; (2) give me a one-sentence framing for each potential objection; (3) what question should I ask them at the end to create genuine momentum rather than ending with 'we'll follow up'?"*

The closing question is where most meetings lose their momentum. "Any questions?" is not a closing question. "What would need to be true for this to be a serious conversation in the next 30 days?" is.

## The follow-up: closing the loop fast

After the meeting, while it is still fresh, two minutes with Claude:

*"Here's what happened in my [meeting type] with [person]: [rough notes]. Help me: (1) write a brief follow-up message that captures the decisions made and next steps; (2) identify anything I agreed to do that I need to put in my task list now."*

The follow-up email takes 90 seconds to edit rather than 10 minutes to write. The action items are captured before you forget them. The loop closes while the context is still live.

## The habit that makes all of this compound

The value of meeting prep compounds if you keep a record. In a [Claude Project](/glossary/claude-projects) for each significant relationship — your manager, your key clients, your co-founder — paste the rough notes from every meeting. Over time, Claude can see the arc of the relationship, the patterns in what comes up, the commitments that were made and whether they were kept.

After six months of 1:1 notes in a project: *"Based on our conversation history, what are the two or three things my manager consistently cares about that I should always be addressing? What has been the recurring friction?"*

This is a different category of useful than one-off prep. It is memory that you actually use.`,
  },

]

async function main() {
  console.log(`Seeding ${ARTICLES.length} articles (batch 20 — tool use, multi-agent, customer discovery, meeting prep)…\n`)

  for (const art of ARTICLES) {
    const term = await getTermId(art.termSlug)
    if (!term) {
      console.error(`  ✗ Term not found: ${art.termSlug}`)
      continue
    }

    const { error } = await sb.from('articles').upsert({
      slug: art.slug,
      term_id: term.id,
      term_name: term.name,
      term_slug: art.termSlug,
      cluster: art.cluster,
      title: art.title,
      angle: art.angle,
      body: art.body.trim(),
      excerpt: art.excerpt,
      read_time: art.readTime,
      tier: 3,
      published: true,
    }, { onConflict: 'slug' })

    if (error) {
      console.error(`  ✗ ${art.slug}:`, error.message)
    } else {
      console.log(`  ✓ ${art.slug}`)
    }
  }

  console.log('\nDone.')
}

main().catch(console.error)
