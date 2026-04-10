/**
 * Batch 9 — Claude best practices, new features, practical operator guides
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-9.ts
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

  // ── 1. Managed Agents — what they are and how your org can use them ───────
  {
    termSlug: 'managed-agents',
    slug: 'managed-agents-for-your-org',
    angle: 'role',
    title: 'Managed Agents: what they are and what they mean for your organisation',
    excerpt: 'Anthropic just launched Managed Agents. Here is what they do, who they are for, and how to think about whether your team should use them.',
    readTime: 6,
    cluster: 'Agents & Orchestration',
    body: `Anthropic launched [Managed Agents](/glossary/managed-agents) in April 2026. If you have been following the AI space, you have heard the word "agent" a lot. Most of the time it is vague. This is not.

Managed Agents are Claude running in the cloud, completing multi-step tasks on its own, with Anthropic handling the infrastructure. You define what the agent should do. Anthropic runs it, sandboxes it, and gives you the result.

## What this actually means in practice

Think of it this way. Right now, when you use Claude, you are in a conversation. You ask, Claude answers. If you want Claude to do something complex — research a market, process a batch of documents, prepare a report that requires multiple steps — you either do it as a long conversation or you build custom infrastructure.

Managed Agents remove the second option's complexity. You describe the task, give the agent the tools it needs (web search, file access, code execution), and it runs. It can take minutes or hours. You get the output when it is done.

**The key difference from a regular conversation:** the agent works autonomously through multiple steps. It does not wait for you between each one. It decides what to do next based on what it found in the previous step.

## Who this is for

**Teams building internal tools.** If you have developers who want to build AI-powered workflows — processing incoming documents, monitoring data sources, generating reports — Managed Agents handle the infrastructure so your team focuses on the logic.

**Operations teams with high-volume research tasks.** Competitive analysis, vendor evaluation, market monitoring. Tasks where a human currently spends hours gathering and synthesising information from multiple sources.

**Companies that tried building agents and hit infrastructure problems.** Sandboxing, error handling, scaling, session management — Managed Agents handle all of this. If you built an agent prototype that worked but was painful to run in production, this is the managed version.

## Who this is not for (yet)

**Non-technical teams who just use Claude.ai.** Managed Agents are currently an API product. You need a developer to set them up. If your team is using Claude through the chat interface, the features that matter to you are [Cowork](/glossary/claude-cowork) and [Dispatch](/glossary/dispatch) instead.

**Tasks that need real-time human judgment.** Managed Agents run autonomously. If the task requires a human to review intermediate steps — customer communications, legal documents, anything where a wrong output has real consequences — you need a human-in-the-loop architecture, not a fully autonomous agent.

## The cost model

$0.08 per session-hour plus your normal token costs. A session that runs for 30 minutes costs $0.04 plus tokens. For most use cases, the session cost is small compared to the token cost of the work the agent is actually doing.

Compare this to the cost of building and hosting your own agent infrastructure: servers, sandboxing, error recovery, scaling. For most teams, managed is cheaper until you are running thousands of sessions per day.

## How to think about it

Managed Agents are not a replacement for Claude conversations. They are a different tool for a different kind of work. Conversations are for interactive, back-and-forth collaboration. Agents are for "go do this thing and come back with the result."

If you are an operator trying to decide whether to explore this: start by identifying the tasks your team does that take more than 30 minutes, involve gathering information from multiple sources, and produce a document or summary at the end. Those are your agent candidates.
`,
  },

  // ── 2. Token consumption best practices ──────────────────────────────────
  {
    termSlug: 'token',
    slug: 'minimising-token-usage',
    angle: 'process',
    title: 'How to minimise your Claude token usage without sacrificing quality',
    excerpt: 'Tokens are what you pay for. Here are the practical things you can do to use fewer of them — from how you prompt to which model you choose.',
    readTime: 6,
    cluster: 'Business Strategy & ROI',
    body: `Every message you send Claude, every document you upload, every response Claude generates — all of it is measured in [tokens](/glossary/token). Tokens are how usage is tracked (on Claude.ai plans) and how costs are calculated (on the API). Using fewer tokens does not mean using Claude less. It means using Claude more efficiently.

## The biggest token costs (and what to do about each)

### 1. Long system prompts and Project instructions

Your [system prompt](/glossary/system-prompt) or [Project instructions](/glossary/claude-projects) are sent with every single message. If your instructions are 3,000 tokens, that is 3,000 tokens consumed on every turn of the conversation — even if the user just says "thanks."

**What to do:** Keep instructions focused and specific. Remove examples that illustrate the same point. Cut the "do not" lists — Claude follows positive instructions better than negative ones anyway. A tight 500-token system prompt that covers the essentials outperforms a 3,000-token one that covers every edge case.

### 2. Uploading large documents

When you upload a document to a Project or a conversation, the entire document is loaded into the [context window](/glossary/context-window). A 50-page PDF can be 30,000+ tokens.

**What to do:** Only upload documents Claude actually needs. If Claude only needs your product FAQ, don't also upload your entire employee handbook. For large documents, extract the relevant sections rather than uploading the whole thing. If you reference the same documents repeatedly, consider using [prompt caching](/glossary/prompt-caching) on the API.

### 3. Long conversation histories

Every message in a conversation — yours and Claude's — stays in the context window. A 40-message conversation can consume 20,000+ tokens before you type anything new.

**What to do:** Start fresh conversations for new topics rather than continuing old ones. In Claude.ai, each new chat in a Project still gets your Project instructions, so you don't lose context. On the API, manage conversation history deliberately — trim or summarise old messages rather than sending the entire history every time.

### 4. Verbose Claude responses

By default, Claude gives thorough, detailed responses. If you only need a short answer, you're paying for paragraphs you don't read.

**What to do:** Tell Claude how you want the response formatted. "Answer in 2-3 sentences" or "give me a bulleted list, no explanation" or "just the number." Adding output format instructions to your system prompt ensures every response is appropriately concise.

## Choosing the right model

Not every task needs the most powerful model. Claude has three tiers:

- **Haiku** — fastest, cheapest, good for simple tasks (classification, extraction, reformatting)
- **Sonnet** — balanced, good for most everyday work (drafting, summarising, analysis)
- **Opus** — most capable, best for complex reasoning, nuanced judgment, and difficult problems

If your team uses Claude.ai with a Pro or Team plan, model selection is handled in the model picker. On the API, routing simple tasks to Haiku and complex tasks to Sonnet or Opus can reduce costs by 60-80% without quality loss on the simple tasks.

## Connectors and token awareness

[Connectors](/glossary/connector) pull in external content — documents from Google Drive, messages from Slack, pages from Notion. Every piece of content a connector retrieves consumes tokens.

**Best practice:** Disable connectors you don't need for a given conversation. If you are writing marketing copy, you probably don't need your Jira connector active — it will pull in issue context that adds tokens without adding value. Enable only the connectors relevant to your current task.

## The 80/20 rule

For most teams, two changes make the biggest difference:
1. **Tighter system prompts** — cut yours in half, test, iterate
2. **Start new conversations** instead of running one endlessly

Everything else is optimisation. Get these two right first.
`,
  },

  // ── 3. Skills — when and how to use them ─────────────────────────────────
  {
    termSlug: 'skill',
    slug: 'skills-setup-guide',
    angle: 'process',
    title: 'Claude Skills: what they are, which to enable, and when to use them',
    excerpt: 'Skills give Claude superpowers — web search, code execution, file creation. Here is which ones matter, how to set them up, and when to turn them off.',
    readTime: 5,
    cluster: 'Tools & Ecosystem',
    body: `[Skills](/glossary/skill) are the capabilities you enable inside Claude.ai. Each one gives Claude access to a specific tool — searching the web, running code, creating files, generating images. They are not on by default (some are, depending on your plan). Understanding which to use when is one of the quickest ways to get better results.

## The skills that matter most for operators

**Web Search.** Claude searches the internet and incorporates current information into its response. Turn this on when you need up-to-date information: current pricing, recent news, live documentation. Turn it off when you are working with your own documents and don't want Claude pulling in external context that might conflict.

**Code Execution.** Claude writes and runs Python code in a sandbox. Essential for data analysis: paste a CSV, ask Claude to analyse it, and it writes and executes the code to give you actual numbers — not estimates. If your work involves any data, this should be on.

**File Creation.** Claude produces downloadable files — spreadsheets, documents, presentations. The office document skills (PPTX, XLSX, DOCX) are Anthropic-managed skills that produce professional-quality files. If you need Claude to create a deliverable, not just text in a chat window, enable this.

**[Deep Research](/glossary/deep-research).** Claude spends extended time crawling multiple web sources and produces a cited research report. Use this for thorough investigation, not quick questions. It takes longer and uses more tokens, but the output is qualitatively different — comprehensive, multi-source, cited.

## How to set them up

In Claude.ai, skills are managed per conversation or per Project:

1. **Per conversation:** Click the skills icon in the message bar. Toggle on what you need. These settings apply to this conversation only.

2. **Per Project:** In your Project settings, enable the skills that everyone using this Project should have access to. This is better for team consistency — the marketing Project always has web search on, the data analysis Project always has code execution on.

## When to turn skills OFF

This is the part most people miss. Skills add tokens and can introduce noise.

**Turn off web search when working with internal documents.** If you uploaded your product documentation to a Project and want Claude to answer from that, web search can pull in conflicting or outdated information from the internet. Disable it to keep Claude focused on your content.

**Turn off connectors you are not using.** Each active [connector](/glossary/connector) is a potential source of context that consumes tokens. If you are not actively using your Jira integration in this conversation, disable it.

**Turn off code execution for pure writing tasks.** It won't interfere much, but keeping your skill set focused keeps Claude's behaviour predictable. If you are writing blog posts, you don't need code execution trying to run things.

## Custom skills

Beyond Anthropic's built-in skills, you can create custom SKILL.md files — instruction sets that teach Claude specialised workflows. A custom skill might define how your team writes product briefs, how to format customer reports, or a specific analysis methodology.

Custom skills live in your Project. They are essentially structured [system prompts](/glossary/system-prompt) — but scoped to a specific capability rather than general behaviour.

## The practical setup for a team admin

If you are rolling Claude out to a team:

1. Create one [Project](/glossary/claude-projects) per team function
2. Enable the relevant skills per Project (CS gets web search + file creation; data team gets code execution; marketing gets web search + deep research)
3. Disable skills that don't apply — it reduces confusion and token waste
4. Document which skills are enabled and why, so team members don't randomly toggle things

The goal: each team member opens their Project and has exactly the capabilities they need, nothing more.
`,
  },

  // ── 4. Connectors — best practices ───────────────────────────────────────
  {
    termSlug: 'connector',
    slug: 'connectors-best-practices',
    angle: 'process',
    title: 'Connectors: which to enable, which to disable, and why it matters',
    excerpt: 'Connectors give Claude access to your tools. But having all of them on all the time costs tokens and introduces noise. Here is how to manage them.',
    readTime: 5,
    cluster: 'Tools & Ecosystem',
    body: `[Connectors](/glossary/connector) link Claude to the tools you already use — Google Drive, Slack, Notion, Jira, GitHub, Dropbox, and others. Once connected, Claude can search your documents, read messages, and pull in relevant context from these services.

This is powerful. It is also easy to mismanage.

## How connectors affect your experience

When a connector is active, Claude can pull content from that service into your conversation. This happens automatically — if you ask about a project and your Jira connector is active, Claude might search your Jira board for relevant issues.

Every piece of content pulled in consumes [tokens](/glossary/token). A Jira issue with 40 comments pulled into context can be thousands of tokens. Multiply that by several connectors pulling in content simultaneously, and you can burn through your usage limits quickly on context you didn't need.

## The principle: connect what you need, disconnect what you don't

Think of connectors like browser tabs. Having 30 tabs open doesn't make you more productive — it makes everything slower and harder to find. Same with connectors.

**For each conversation or Project, ask: what external information does Claude actually need?**

Writing a marketing brief? You need Google Drive (for brand docs) and maybe Notion (for strategy docs). You do not need Jira, GitHub, or Slack.

Debugging a customer issue? You need your knowledge base connector and maybe Jira. You do not need Google Drive or Dropbox.

## How to manage connectors

### Per conversation
Toggle connectors on/off in the message bar before you start. Get in the habit of disabling the ones you won't use. It takes 5 seconds and saves tokens.

### Per Project
In your [Project](/glossary/claude-projects) settings, configure which connectors are available. This is the better approach for teams — the admin decides what's relevant for each use case, and team members don't need to think about it.

**Recommended Project-connector mapping:**
- **CS team Project:** Knowledge base, CRM, ticketing system
- **Marketing Project:** Google Drive (brand assets), Notion (strategy docs)
- **Sales Project:** CRM, Google Drive (proposals and decks)
- **Engineering Project:** GitHub, Jira, Confluence
- **Operations Project:** Google Drive, Notion, Slack (for context searching)

### For your own workflows
If you switch between different types of work throughout the day, toggle connectors as you switch context. Writing mode: Drive + Notion. Research mode: web search + Drive. Issue triage: Jira + knowledge base.

## What happens when too many connectors are active

Three things, all bad:

1. **Token waste.** Claude pulls in context you didn't ask for and didn't need. Each retrieval costs tokens.
2. **Slower responses.** More connectors means more sources to search. Responses take longer.
3. **Noise in outputs.** Claude might reference a Slack thread from three months ago that's no longer relevant, or pull in a draft Google Doc instead of the final version. More sources means more opportunities for irrelevant or outdated information to enter the conversation.

## The admin checklist

If you are setting up Claude for a team:

1. **Audit which connectors your team actually uses.** Not which they could use — which they do use daily.
2. **Connect only those.** You can always add more later.
3. **Set defaults per Project.** Don't rely on individuals to manage their own connectors. Configure it once in the Project.
4. **Review quarterly.** Services change, team needs change. Check whether your connector setup still matches how people actually work.

## Security note

Each connector grants Claude access to read from an external service using someone's authentication. Make sure the person who connects the service has appropriate permissions — if they connect their personal Google Drive, Claude can access their personal files, not just work files. For team deployments, use service accounts or team-scoped authentication where available.
`,
  },

  // ── 5. Cowork and Dispatch — the new way Claude works ────────────────────
  {
    termSlug: 'claude-cowork',
    slug: 'cowork-dispatch-guide',
    angle: 'process',
    title: 'Cowork and Dispatch: Claude working on your computer',
    excerpt: 'Claude can now control your desktop and complete tasks while you do other things. Here is how it works, what it is good at, and what to be careful about.',
    readTime: 6,
    cluster: 'Tools & Ecosystem',
    body: `Two of Claude's newest capabilities change the relationship between you and AI from "I ask, it answers" to "I assign, it does."

[Cowork](/glossary/claude-cowork) is Claude working alongside you on your desktop — seeing your screen, clicking, typing, navigating applications. [Dispatch](/glossary/dispatch) is the async version — you assign a task from your phone or the web, and Claude picks it up on your desktop and completes it independently.

## Cowork: real-time collaboration

With Cowork active, Claude can see your screen and interact with it. You might say:

- "Fill in this spreadsheet with the data from the PDF I just opened"
- "Navigate to our CRM and find all deals closing this month"
- "Set up this form based on the wireframe I'm showing you"

Claude sees what you see and acts on it. It is the difference between explaining what you want done and showing Claude what you're looking at.

**Where it works well:**
- Repetitive desktop tasks — filling forms, copying data between apps, formatting documents
- Navigating unfamiliar software — "show me where the export settings are in this app"
- Multi-step workflows across applications — pulling data from one tool into another

**Where to be careful:**
- Claude can see everything on your screen. If you have sensitive information visible — passwords, personal messages, confidential documents — be aware that Claude is processing it.
- Cowork uses more resources than a regular conversation. Your computer may feel slower while it is active.
- For critical actions (sending emails, submitting forms, making purchases), confirm before Claude clicks "send." Most Cowork interactions include a confirmation step, but stay aware.

## Dispatch: async task assignment

Dispatch is what you use when you want Claude to do something while you're away. From your phone or the Claude web app:

1. Write the task: "Prepare a summary of all customer tickets from the last week, organised by category, and put it in a Google Doc"
2. Assign it to your desktop
3. Claude picks it up and works through it

When you come back, the work is done. You review it.

**Where it works well:**
- Research tasks that take time — gathering information, reading multiple sources, compiling results
- Report preparation — pulling data, formatting it, creating the document
- Routine tasks you do weekly — the same steps every time, now automated

**Where to be careful:**
- Claude needs your desktop to be on and logged in. If your computer sleeps, Dispatch can't run.
- Review the output before acting on it. Dispatch is autonomous — it doesn't ask you questions along the way. The output is only as good as your task description.
- Start with low-stakes tasks. Don't Dispatch "email all our customers" before you have tried "draft an email to one customer" and reviewed the result.

## How to think about the difference

| | Cowork | Dispatch |
|---|---|---|
| When to use | Working at your desk, need help now | Stepping away, want work done while you're gone |
| Interaction | Real-time, you watch and guide | Async, Claude works independently |
| Best for | Multi-app workflows, visual tasks | Research, reporting, routine prep |
| Control level | High — you see every step | Lower — you see the result |

## Setting this up for a team

If you are an admin rolling this out:

1. **Start with Cowork, not Dispatch.** Let people get comfortable with Claude working on their screen while they watch before they trust it to work unsupervised.
2. **Define approved use cases.** Not everything should be delegated to Claude on a desktop. Customer communications, financial actions, anything with real-world consequences should stay in the "human reviews before acting" category.
3. **Train on task description quality.** Dispatch is only as good as the prompt. Vague tasks produce vague results. Teach your team to write specific, scoped task descriptions — the same skill they need for good prompting in general.
`,
  },

  // ── 6. Choosing the right Claude model ───────────────────────────────────
  {
    termSlug: 'claude-plans',
    slug: 'choosing-the-right-claude-model',
    angle: 'role',
    title: 'Opus, Sonnet, or Haiku: which Claude model should your team use?',
    excerpt: 'Claude has three model tiers. Here is which one to use for what — and why defaulting to the most powerful one is usually a mistake.',
    readTime: 5,
    cluster: 'Business Strategy & ROI',
    body: `Claude comes in three models: Opus (most powerful), Sonnet (balanced), and Haiku (fastest and cheapest). Most teams default to whatever sounds best — usually Opus. This wastes money and often produces slower results without meaningful quality improvement.

Here is how to actually choose.

## What each model is good at

**Haiku** — the workhorse. Fast responses, lowest cost. Use for:
- Simple Q&A, classification, extraction
- Reformatting text (turning bullet points into paragraphs, adjusting tone)
- Sorting, categorising, and tagging
- Quick drafts where speed matters more than nuance
- High-volume tasks where cost scales linearly

Haiku handles 70-80% of what most teams use Claude for. If the task has a clear, straightforward answer, Haiku gets there.

**Sonnet** — the daily driver. Good at most things. Use for:
- Content drafting (emails, blog posts, reports)
- Summarising documents and conversations
- Analysis that requires some judgment
- Code generation and review
- Multi-step tasks that need coherent reasoning

Sonnet is where most teams should spend most of their time. It handles complex work well, responds quickly, and costs significantly less than Opus.

**Opus** — the heavy lifter. Use when the problem is genuinely hard:
- Complex analysis with ambiguous inputs
- Tasks requiring nuanced judgment (evaluating strategy, reviewing arguments)
- Long documents where maintaining coherence over 50+ pages matters
- Difficult reasoning, math, or logic problems
- When Sonnet's output is not good enough — use Opus as an upgrade, not a default

## The mistake teams make

Defaulting to Opus for everything. It is like taking a taxi for every trip when most of them are a five-minute walk. You arrive at the same place, just slower and more expensively.

**The right approach:** Start with Sonnet. If the output quality isn't good enough for a specific use case, upgrade to Opus for that use case. Keep everything else on Sonnet. Route truly simple tasks (extraction, reformatting, classification) to Haiku.

On Claude.ai, you select the model in the model picker at the top of each conversation. On the API, you specify the model per request — which means you can route different types of tasks to different models programmatically.

## For team admins: model strategy

If you're managing a team on Claude:

1. **Set Sonnet as the default.** Most people don't need to think about model selection. Sonnet handles their work.
2. **Educate on when to upgrade.** If someone is doing deep analysis or getting mediocre outputs, switching to Opus for that specific task is the right move.
3. **Watch usage patterns.** If your usage limits are getting hit, check whether people are using Opus for tasks Sonnet handles equally well. Switching to Sonnet for routine work extends your limits significantly.

## On API pricing (for teams building with Claude)

The cost difference is substantial:

- **Haiku:** ~$0.25 / million input tokens, $1.25 / million output tokens
- **Sonnet:** ~$3 / million input tokens, $15 / million output tokens
- **Opus:** ~$15 / million input tokens, $75 / million output tokens

Opus costs 5x more than Sonnet and 60x more than Haiku. For a production application processing thousands of requests, model routing — sending simple requests to Haiku and complex ones to Sonnet or Opus — is one of the highest-leverage cost optimisations you can make.

## The simple rule

If in doubt, use Sonnet. Upgrade to Opus when the output matters a lot and Sonnet isn't cutting it. Drop to Haiku when the task is simple and you need speed or volume.
`,
  },

  // ── 7. Claude Memory — how to use it effectively ─────────────────────────
  {
    termSlug: 'claude-memory',
    slug: 'claude-memory-guide',
    angle: 'process',
    title: 'Claude Memory: what it remembers, how to use it, and how to manage it',
    excerpt: 'Claude now remembers things about you across conversations. Here is how it works, what to tell it to remember, and how to keep it useful.',
    readTime: 5,
    cluster: 'Tools & Ecosystem',
    body: `[Claude Memory](/glossary/claude-memory) is Claude retaining information about you across conversations. Your name, your role, your preferences, your projects — things you have mentioned that Claude stores and applies in future chats without you having to repeat them.

This is different from your [conversation history](/glossary/context-window) (which resets with each new chat) and different from [Project instructions](/glossary/claude-projects) (which you write explicitly). Memory is what Claude learns about you naturally through your interactions.

## What Claude remembers

Claude stores facts and preferences you share:
- Your name and role
- How you prefer outputs formatted ("I like bullet points" or "always use British English")
- Projects you're working on ("I'm building a marketing site for a B2B SaaS company")
- Decisions you've made ("we decided to use Next.js for the frontend")
- Preferences about Claude's behaviour ("don't explain things I already know" or "always show your reasoning")

Claude does not memorise entire conversations. It extracts the important facts and preferences and stores those.

## How to use it effectively

**Be explicit about what matters.** If you want Claude to remember something, say it clearly: "Remember that I prefer concise responses" or "My company sells project management software to construction firms." Claude is better at retaining things you state as facts than things buried in passing.

**Correct it when it is wrong.** If Claude applies a memory that is outdated or incorrect — maybe you changed roles or your company pivoted — tell it directly: "I'm no longer working on the mobile app, I've moved to the platform team." Claude updates the memory.

**Use it to skip setup time.** The biggest value of Memory is skipping the first few minutes of every conversation where you explain who you are and what you need. Once Claude knows your role, your company, and your preferences, every conversation starts further along.

## Managing your memory

You can view and manage what Claude remembers:

1. **View memories:** Go to your Claude settings and look for the Memory section. You can see everything Claude has stored about you.
2. **Delete specific memories:** If something is wrong or outdated, delete it.
3. **Clear all memory:** If you want to start fresh, you can wipe everything.

## Memory vs. Projects: when to use which

| | Memory | Projects |
|---|---|---|
| **Scope** | About you personally | About a specific body of work |
| **Persistence** | Across all conversations | Within the Project |
| **Content** | Preferences, role, context | Instructions, documents, files |
| **Who sets it** | Claude learns it from you | You configure it explicitly |

**Use Memory for:** things that are true about you regardless of what you're working on. Your role, your preferences, your communication style.

**Use Projects for:** context specific to a body of work. Your CS team's tone guide, your product documentation, your marketing brief.

They complement each other. Memory means Claude knows who you are. Projects mean Claude knows what you're working on.

## For team admins

Memory is personal — each team member has their own. You cannot configure it centrally. What you can do:

1. **Encourage your team to tell Claude their role and preferences early.** The faster Claude builds a useful memory, the faster everyone gets value.
2. **Remind people to update memories when things change.** If someone changes teams or the company pivots, their Claude memory needs updating.
3. **Use Projects for shared context, Memory for personal context.** Don't rely on Memory for things the whole team needs to know — that belongs in Project instructions.
`,
  },

  // ── 8. Deep Research — when and how to use it ────────────────────────────
  {
    termSlug: 'deep-research',
    slug: 'deep-research-guide',
    angle: 'process',
    title: 'When to use Deep Research and how to get the most from it',
    excerpt: 'Deep Research is not just "web search but longer." It is a different tool for a different kind of question. Here is when it is worth the time and tokens.',
    readTime: 5,
    cluster: 'Tools & Ecosystem',
    body: `[Deep Research](/glossary/deep-research) is Claude spending extended time — sometimes 10-15 minutes — crawling multiple web sources, cross-referencing information, and producing a comprehensive, cited research report. It uses significantly more tokens than a regular web search. It is worth it for the right questions.

## When to use Deep Research

**Market and competitive analysis.** "Who are the main competitors in the AI observability space, what do they charge, and how do they position themselves?" A regular web search gives you a list. Deep Research gives you a structured analysis with source citations.

**Due diligence on a company or product.** Before a partnership, acquisition, or major vendor decision. Deep Research reads press coverage, company blogs, job postings, customer reviews, and product documentation — the same sources a human analyst would check.

**Understanding a new space.** When your company is evaluating entering a new market or adopting a new technology. "What's the current state of AI regulation in the EU?" needs depth, not a quick answer.

**Building research documents that need citations.** If you need to show where the information came from — board presentations, strategy documents, investor updates — Deep Research provides sourced, citable outputs.

## When NOT to use Deep Research

**Quick factual questions.** "What's Anthropic's API pricing?" — regular web search handles this in seconds. Deep Research would spend 10 minutes confirming what you could have found in 30 seconds.

**Internal questions.** Deep Research searches the web. If the answer is in your company's documents, use your [Project](/glossary/claude-projects) with uploaded docs or [connectors](/glossary/connector) instead.

**Time-sensitive situations.** If you need the answer in 30 seconds, Deep Research is the wrong tool. It is thorough, not fast.

**Highly subjective questions.** "Should we pivot to B2B?" requires judgment, not research. Deep Research can give you data to inform the decision, but frame it as "What are the market dynamics in B2B vs B2C for our category?" not "Should we pivot?"

## How to get better results

**Be specific about what you want.** "Research the AI market" produces a generic overview. "Research the AI agent infrastructure market — key players, pricing models, customer segments, and recent funding rounds" produces something useful.

**Define the output format.** "Produce a brief with sections for market size, key players, pricing landscape, and risks" gets you a structured deliverable. Without format guidance, you get a long essay.

**Specify depth.** "Focus on companies with more than $10M in funding" or "only look at the US market" prevents Claude from spending time on information you don't need.

**Ask follow-up questions.** After the initial report, ask Claude to go deeper on specific sections. "Expand on the pricing models section — I need more detail on usage-based vs. seat-based pricing in this space."

## The cost consideration

Deep Research uses substantially more tokens than a regular conversation — it reads many web pages and produces a long, detailed output. On Claude.ai plans, this counts against your usage limits. On the API, it costs proportionally more.

The question is not "is this expensive?" but "is this cheaper than the alternative?" A human analyst doing the same research would take 4-8 hours. Deep Research does it in 15 minutes. Even at higher token costs, the ROI is clear — if you would have actually done the research manually.

If you would not have done the research at all — you would have just made the decision without it — Deep Research's value is the quality of the decision it enables.
`,
  },

]

async function main() {
  console.log('Seeding ' + ARTICLES.length + ' articles (batch 9)...')

  for (const a of ARTICLES) {
    const term = await getTermId(a.termSlug)
    if (!term) {
      console.error('  ✗ ' + a.slug + ': term not found: ' + a.termSlug)
      continue
    }

    const { error } = await sb.from('articles').upsert({
      slug: a.slug,
      term_id: term.id,
      term_name: term.name,
      term_slug: a.termSlug,
      cluster: a.cluster,
      title: a.title,
      angle: a.angle,
      body: a.body.trim(),
      excerpt: a.excerpt,
      read_time: a.readTime,
      tier: 2,
      published: true,
    }, { onConflict: 'slug' })

    if (error) {
      console.error('  ✗ ' + a.slug + ':', error.message)
    } else {
      console.log('  ✓ ' + a.slug)
    }
  }

  console.log('\nDone.')
}

main().catch(console.error)
