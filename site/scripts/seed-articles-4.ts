/**
 * Batch 4 — operator-value articles: role, failure, field-note angles
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-4.ts
 */

import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const ARTICLES = [

  // ── 1. RAG — role ────────────────────────────────────────────────────────
  {
    termName: 'RAG',
    slug: 'rag-role',
    angle: 'role',
    title: "Do you actually need RAG? The decision most operators get wrong",
    excerpt: "Most teams jump to RAG because it sounds like the right answer. Half of them didn't need it. Here's how to know which situation you're in — before you build anything.",
    readTime: 5,
    tier: 3,
    body: `The most common mistake in AI implementation isn't building the wrong thing. It's building something you didn't need at all.

RAG — connecting your documents and data to Claude — is genuinely powerful. It's also genuinely complex to do well. Before you build a RAG pipeline, it's worth being honest about whether you actually need one.

## The question to start with

Can Claude answer your users' questions accurately without any additional information?

If your use case is general — writing, editing, summarising, brainstorming, answering questions about publicly known topics — Claude's training data is probably sufficient. RAG adds cost and complexity without meaningfully better answers.

If your use case requires specific knowledge Claude doesn't have — your product documentation, your internal processes, your customer data, events after Claude's training cutoff — then you genuinely need a way to get that information in front of Claude. RAG is the standard answer.

The tell: if you find yourself writing long paragraphs in your system prompt trying to describe your company's situation, you're fighting a symptom of needing RAG. The cure isn't a longer system prompt.

## Three situations where RAG is the right call

**Your knowledge base changes frequently.** Price lists, product updates, policy changes, team information. RAG retrieves this fresh every time. A system prompt can only be updated when you push a new version.

**Your information is too large to paste in.** Anthropic's entire documentation. Your complete CRM history. Five years of support tickets. These can't live in a context window. RAG finds the relevant slice and passes only that.

**You need answers tied to specific sources.** Customer-facing products especially — where "according to our returns policy..." is a different kind of answer than "generally speaking, returns policies tend to..." RAG gives Claude something concrete to cite.

## Three situations where RAG is overkill

**You have a small, stable knowledge base.** If your company's relevant information fits in 2,000 words and changes rarely, put it in your system prompt. A well-structured system prompt is faster to build, easier to maintain, and performs just as well.

**Your questions are mostly general.** A writing assistant, a brainstorming tool, an interview coach — these don't need your proprietary data. They need Claude to be good at Claude's job. Don't add complexity to a problem that doesn't exist.

**You're in week one.** RAG requires building retrieval infrastructure, chunking your documents thoughtfully, running evaluations. If you're still figuring out whether AI will work for your use case at all, build the simplest possible thing first. You can add RAG when you've validated the basic interaction.

## The honest middle path

Start with a context-stuffed prompt. Take your knowledge base, paste the most relevant parts into Claude's context window, and see how well it performs. Claude's 200K token window is large enough to hold most small company knowledge bases entirely.

If that works well and your knowledge base is stable, you're done. Ship it.

If you find yourself hitting limits — too much content, things going stale, needing citations — that's the signal to build proper RAG. Now you're building it because you know you need it, not because it sounded like the right architecture.

## Before you build: the five-question checklist

1. Does Claude need information it wasn't trained on to answer your users' questions?
2. Is that information more than roughly 50 pages of text?
3. Does it change frequently enough that a system prompt would go stale?
4. Do your users need answers tied to specific sources, not general knowledge?
5. Have you validated the basic interaction works before adding retrieval complexity?

If you answered yes to most of these, build RAG. If you answered no to most, start simpler. The best RAG system is often the one you didn't build yet.`,
  },

  // ── 2. Evals — role ─────────────────────────────────────────────────────
  {
    termName: 'Evals',
    slug: 'evals-role',
    angle: 'role',
    title: "How to know if your Claude integration is actually working",
    excerpt: "Most teams go live on gut feel and find out six weeks later that Claude has been quietly giving wrong answers. Here's how to know before that happens — without being an engineer.",
    readTime: 6,
    tier: 3,
    body: `You shipped your Claude integration. Users are using it. But is it working?

Most operators answer this question with vibes. They try it themselves a few times, it seems okay, and they move on. Six weeks later, a customer mentions something was wrong. Or a team member notices Claude keeps doing the same annoying thing. Or you realise you've been running something embarrassing without knowing it.

Evaluation — having a structured way to measure how Claude is performing — is how you close this loop before it costs you. And it doesn't require being a machine learning engineer to do it properly.

## What you're actually measuring

When you evaluate a Claude integration, you're asking: across a realistic range of inputs, does Claude do what we want it to do?

That "realistic range" matters more than most teams realise. Claude might perform brilliantly on the twenty questions you tested during development. It might quietly fail on the question type that turns out to be 40% of your actual volume.

Evaluation is the practice of finding those failure modes before your users do.

## The simplest eval you can build today

**Step 1: Collect 50 real inputs.** If you have existing data, use it — actual questions or tasks from real users. If you're pre-launch, write them yourself: 30 typical cases, 10 tricky edge cases, 10 things Claude should handle but might get wrong.

**Step 2: Write down what "good" looks like for each one.** Not necessarily a word-for-word answer, but criteria. "Mentions the refund policy. Doesn't suggest anything outside our policy. Tone is friendly, not robotic." Three to five criteria per question is enough.

**Step 3: Run your current system through all 50.** Look at each output. Score it pass/fail against your criteria. You'll immediately see patterns — the types of questions that consistently struggle, the criteria that keep getting missed.

**Step 4: Fix the highest-frequency failures first.** Usually this means updating your system prompt. Change one thing at a time. Re-run the failing cases. Verify the fix didn't break anything else.

**Step 5: Add new failures to the set as you find them.** Every bug is a new test case. Over time, your eval set becomes a safety net — you can make changes confidently because you know you'll catch regressions.

## The three failure modes to watch for

**Accuracy failures.** Claude says something wrong or misleading. Especially dangerous for anything involving your product, pricing, or policies. This is where RAG helps — if Claude is making things up, it often needs more grounding in your actual information.

**Scope failures.** Claude does something you didn't intend — answers questions outside your product area, makes promises you can't keep, engages with topics you'd rather it deflected. Caught by testing edge cases, not typical inputs.

**Tone and persona failures.** Claude sounds wrong — too formal, too casual, not like your brand, weirdly robotic. Easy to miss if you're only checking for factual accuracy. Worth having someone from your team who isn't close to the build read through a set of outputs fresh.

## The tool you already have

Claude itself is one of the most useful evaluation tools available. Once you have a set of outputs you want to evaluate, you can ask Claude to assess them:

"Here is a support response from our AI assistant. Here are our evaluation criteria: [criteria]. Rate this response on each criterion and flag any issues."

Run this across your eval set and you get fast, structured feedback that's cheaper and faster than human review — while still being substantive enough to catch real problems. Use human review for calibration, Claude-as-judge for scale.

## What good looks like

A mature eval setup for an early-stage integration is modest: 50–100 test cases, a clear rubric, a process for adding new cases monthly, and a habit of running evals before shipping any significant change to your system prompt.

That's it. No complex infrastructure, no ML expertise required. Just a Google Sheet, an honest rubric, and the discipline to check it before you ship.

The teams that get the most out of Claude aren't the ones who built the most sophisticated systems. They're the ones who built small eval sets early and used them to catch and fix failures while they were still cheap to fix.`,
  },

  // ── 3. System Prompt — failure ───────────────────────────────────────────
  {
    termName: 'System Prompt',
    slug: 'system-prompt-failure',
    angle: 'failure',
    title: "The system prompt mistakes that make Claude worse, not better",
    excerpt: "More instructions don't mean better results. Most system prompts fail in one of five predictable ways — and fixing them is usually the highest-leverage thing you can do to improve your Claude integration.",
    readTime: 5,
    tier: 3,
    body: `The system prompt is where most Claude integrations either come together or fall apart. A good one turns a capable model into a focused specialist. A bad one makes Claude hesitant, inconsistent, or subtly wrong in ways that are hard to trace back to the source.

Here are the failure patterns you'll see most often — and what to do about each.

## Mistake 1: Writing a system prompt like a legal document

The instinct to cover every edge case in the system prompt is understandable. What if a user asks about competitors? What if they swear? What if they try to get Claude to do something off-topic? You write a rule for each scenario.

The result is a 2,000-word document full of "do not," "always," "never," and "in the event that." Claude reads all of it — but behaves like someone who has been given too many rules and is now paralysed trying to follow them all simultaneously.

The fix: write principles, not rules. "Stay focused on topics related to our product" outperforms a list of thirty prohibited topics. "Match the user's tone — professional but warm" beats five paragraphs about communication style. Trust Claude to apply a principle intelligently rather than trying to enumerate every case.

## Mistake 2: Vague identity instructions

"You are a helpful AI assistant for Acme Corp." This tells Claude almost nothing. What does Acme Corp do? Who are the users? What do they usually need? What does a good interaction look like?

Claude will fill in the gaps as best it can — and the gaps it fills in won't match your mental model of what "helpful for Acme Corp" means.

The fix: be specific about context, not just identity. "You are a support assistant for Acme, a project management tool for architecture firms. Most users are project managers dealing with billing, permissions, or getting new team members set up. They're busy and want direct answers, not explanations of what's possible." Now Claude has something to work with.

## Mistake 3: Contradicting yourself

System prompts written over multiple sessions, or by multiple people, often contain quiet contradictions. "Keep responses concise" in one paragraph, "make sure to explain your reasoning fully" in another. "Always recommend consulting a professional" alongside "give users clear, actionable advice."

Claude doesn't flag the contradiction — it tries to satisfy both instructions, producing outputs that satisfy neither.

The fix: read your system prompt as a single document before shipping it. Ask: do any two instructions pull in opposite directions? When they do, decide which one wins and remove or reframe the other.

## Mistake 4: Not showing Claude what good looks like

You can describe the output you want in great detail and still be surprised by what Claude produces, because descriptions of quality are genuinely hard to interpret consistently. "Professional but warm" means something different to everyone who reads it.

The fix: include an example. One good example of the interaction you want — an ideal question and an ideal response — communicates more than three paragraphs of description. It's not always possible, but when it is, it's the highest-leverage thing you can add to a system prompt.

## Mistake 5: Setting it and forgetting it

A system prompt written at launch will drift out of alignment with your product as the product evolves. New features, changed policies, updated pricing, new user personas — none of this makes it into the system prompt unless someone deliberately updates it.

The fix: treat your system prompt like a living document. Review it quarterly at minimum. When something in your product changes, ask whether the system prompt reflects that change. When Claude starts producing outputs that feel off, the system prompt is often the first place to look.

## The underlying principle

A good system prompt is clear, specific, internally consistent, and grounded in examples. It tells Claude who it is, who it's talking to, what it should focus on, and what good looks like. Everything else is noise.

When in doubt, cut. A shorter, sharper system prompt almost always outperforms a longer one that's trying to anticipate every scenario.`,
  },

  // ── 4. AI Agent — failure ────────────────────────────────────────────────
  {
    termName: 'AI Agent',
    slug: 'ai-agent-failure',
    angle: 'failure',
    title: "Why most AI agent pilots fail in the first month",
    excerpt: "Building an AI agent that demos well is easy. Building one that works reliably in production is hard. The gap between the two is almost always one of the same five problems.",
    readTime: 6,
    tier: 3,
    body: `The agent demo goes beautifully. The agent handles three test cases flawlessly. You ship to users. Two weeks later you're fielding complaints and scrambling to understand what went wrong.

This pattern is so common it's almost a rite of passage. The good news: the failures are predictable. If you know what they are before you build, you can design around them.

## Failure 1: The task was underspecified

In a conversation, vague instructions are recoverable — Claude asks clarifying questions or makes reasonable assumptions. In an agent loop, vague instructions compound. Each decision the agent makes based on unclear guidance constrains the next one. By step five, the agent is confidently doing something completely different from what you intended.

"Research our competitors and put together a summary" sounds like a clear task. It isn't. Which competitors? What aspects of their business? What format is the summary? How long? How recent does the information need to be? A human would ask. An agent will decide — and its decisions will reflect the statistical average of similar tasks it's seen, not your specific intent.

The fix: define your agent tasks with the specificity of a work order, not a conversation request. What are the exact inputs? What are the exact outputs? What are the boundaries — what should the agent not touch? The more constrained the task definition, the more reliable the agent.

## Failure 2: Error handling was never designed

Most agent prototypes are built around the happy path — the sequence of steps that works when everything goes as expected. Production is mostly unhappy paths. An API returns an unexpected format. A document is malformed. A search returns no results. A permission is missing.

A prototype with no error handling will either loop indefinitely, produce garbage output confidently, or crash in a way that's hard to debug. None of these is acceptable for users.

The fix: before you ship, map out what happens when each step in your agent's workflow fails. Define what "stuck" looks like and how the agent should surface it to a human. Build explicit fallback behaviour for the most common failure types. Test failure scenarios, not just success scenarios.

## Failure 3: No human review before consequential actions

Demo agents do everything autonomously because autonomy is impressive. Production agents that take consequential actions — sending emails, modifying records, making purchases, communicating with customers — without human review will eventually do something embarrassing or harmful.

The failure isn't that Claude makes bad decisions. It's that no system is reliable enough to make consequential decisions at scale without any human oversight. The question isn't whether something will go wrong, but whether you'll catch it before it matters.

The fix: for any agent action that's hard to reverse or visible to people outside your system, build in a review step. "Here's what I'm about to do — confirm?" is often enough. The overhead is low; the protection is high.

## Failure 4: The tools are too broad

An agent with access to your entire database, the ability to send any email, and permission to modify any record is an agent with enormous blast radius when something goes wrong.

Most agent tasks require a much narrower set of capabilities than developers give them. The instinct to make the agent maximally capable — "just give it everything, it'll figure out what it needs" — creates agents that are hard to debug and dangerous to run unsupervised.

The fix: scope tools to the task. An agent doing research shouldn't have write access. An agent handling customer queries shouldn't be able to modify account settings. The minimal set of tools that lets the agent complete the task is the right set. Add more only when you can demonstrate you need them.

## Failure 5: You measured demo performance, not production performance

The ten test cases you used to validate the agent before launch were probably hand-selected to represent typical, clean inputs. Production has atypical, messy inputs — and they arrive in combinations you didn't anticipate.

A team that launches an agent and then checks results weekly will discover failures slowly and painfully. A team that launches with monitoring and a sample review process will catch failure modes while they're still cheap to fix.

The fix: before launch, decide how you'll know if the agent is working. What will you spot-check? How often? What would trigger you to pull it back? This isn't complex engineering — it's the same operational discipline you'd apply to any process you're responsible for.

## The common thread

Every one of these failures comes from treating an AI agent like a software feature — build it, test it, ship it, move on — instead of like a team member. Team members need clear direction, defined boundaries, and oversight proportional to the stakes of what they're doing.

Agents that work reliably in production are built by people who anticipated what would go wrong before it did.`,
  },

  // ── 5. Claude — field-note (customer support use case) ───────────────────
  {
    termName: 'Claude',
    slug: 'claude-for-customer-support',
    angle: 'field-note',
    title: "Using Claude for customer support: what actually works",
    excerpt: "Customer support is the most common first AI use case for a reason — and the place where the most teams get burned. Here's what a working implementation looks like, and what the common shortcuts miss.",
    readTime: 7,
    tier: 3,
    body: `Customer support is where most companies first try Claude in production. It's an obvious fit: high volume, repetitive questions, 24/7 availability expectations, and a clear baseline to beat.

It's also where more implementations fail than people admit. Not catastrophically — they just don't work well enough to matter. The AI handles 20% of questions passably, frustrates users on the hard 80%, and the team quietly concludes "AI isn't ready for this yet."

The teams getting genuine results are doing a few things differently. Here's what they've figured out.

## What actually works: deflection, not replacement

The most successful support implementations aren't trying to make AI handle everything. They're focused on a specific, achievable goal: handle the questions that don't need a human so that humans can focus on the ones that do.

In most support queues, 40-60% of volume is straightforward — "what's your refund policy," "how do I reset my password," "where's my order." These questions have known, documented answers. A well-configured Claude instance, given access to your documentation, answers them accurately and instantly.

The remaining 40-60% involves nuance: frustrated customers, edge cases, situations that require judgment, complaints that need a human touch. These go to your team — but now your team is handling half the volume, which means they have more time for each one.

This is the right frame. Not "AI replaces support." "AI handles the routine so humans handle what matters."

## The configuration that makes this work

Three things determine whether your support implementation performs or frustrates:

**The knowledge base.** Claude can only be as good as the information you give it. If your documentation is incomplete, inconsistent, or out of date, Claude will produce incomplete, inconsistent, or out-of-date answers. Before you configure Claude, audit your support documentation. The cleanup you do for the AI benefits your human agents too.

**The scope definition.** The clearest performing implementations are the most constrained ones. Claude handles billing questions. Or Claude handles onboarding questions. Or Claude handles one specific product line. The instinct to make it handle everything produces something that handles nothing particularly well.

**The handoff design.** What happens when a question falls outside scope, or Claude isn't confident, or a user explicitly asks for a human? This path needs to be graceful, fast, and clearly signposted. The failure mode that damages trust most isn't Claude getting something wrong — it's a user feeling trapped in a loop they can't escape.

## The system prompt structure that works

For customer support specifically, a system prompt that performs has four parts:

**Identity.** Who is Claude in this context — not just "helpful AI" but specifically: "You are the support assistant for [Product], helping customers with questions about [scope]. You have access to our documentation and policies."

**Knowledge.** Your actual documentation, policies, and FAQs embedded directly. For most small teams, this is 2,000–5,000 words of accurate, current information. This is more important than any other configuration choice.

**Boundaries.** What Claude should and shouldn't engage with. "Only answer questions about our product. If a customer asks about competitors, acknowledge you're not able to help with that and offer to connect them with the team."

**Escalation.** What Claude should do when it can't confidently answer. "If you're unsure of the answer or if a customer seems frustrated, offer to connect them with a human agent."

## The metrics worth tracking

Deflection rate — the percentage of queries handled without human escalation — is the obvious metric, but it's incomplete. A 70% deflection rate with a 40% frustration rate isn't success.

Track these alongside deflection:

**Resolution rate.** Did the user get what they needed? A quick post-interaction survey ("Did this answer your question?") gives you this cheaply.

**Escalation quality.** When users do escalate to humans, what are they escalating about? If it's the same question type repeatedly, that's a gap in your configuration.

**Error rate.** How often does Claude say something wrong, outdated, or inconsistent with your actual policy? This requires spot-checking, but it's the failure mode with the highest potential damage.

## The timeline that's realistic

Week 1–2: Audit and clean your documentation. Configure Claude with a focused system prompt. Test it internally against 50 real questions.

Week 3–4: Soft launch to a subset of traffic. Monitor closely. Fix the failure patterns you find.

Month 2: Expand scope based on what's working. Add complexity only after the simple version is running well.

Month 3+: You'll have enough data to know whether this is genuinely reducing your team's load or just adding a layer that doesn't pull its weight. Most implementations that make it to month 3 with honest evaluation either show clear ROI or reveal a configuration problem that's fixable.

## The honest caveat

Support automation with AI works best for products where answers are relatively objective — policies, processes, how-to questions. It works less well for highly emotional customer interactions, complex technical issues, or situations where the "right" answer requires judgment about specific circumstances.

Know which kind of support your customers need most, and configure your implementation accordingly.`,
  },

  // ── 6. Evals — field-note (AI pilot) ────────────────────────────────────
  {
    termName: 'Evals',
    slug: 'running-your-first-ai-pilot',
    angle: 'field-note',
    title: "Running your first AI pilot: a 30-day plan",
    excerpt: "Most AI pilots either drag on for six months without a decision, or get declared a success after two weeks based on nothing. Here's a structure that produces a real answer in 30 days.",
    readTime: 6,
    tier: 3,
    body: `The goal of an AI pilot isn't to explore what AI can do. It's to answer a specific question: does this work well enough to be worth more investment?

That's a different goal, and it requires a different structure. Here's a 30-day plan that produces a real answer.

## Before day 1: define the question

The most common reason AI pilots drag on is that nobody agreed on what "working" means before they started.

Before you begin, write down:

**The specific task.** Not "using AI to improve our operations" — that's a direction, not a task. "Using Claude to draft first responses to support tickets in categories A, B, and C" is a task.

**The current baseline.** How long does this task currently take? What's the error rate or quality level? What does it cost? You need a number to beat.

**What "good enough to proceed" looks like.** Set the bar before you see results. "If Claude can handle 40% of these queries with a satisfaction rate above 3.5 out of 5, we proceed." Pre-committing to a threshold prevents motivated reasoning after the fact.

**Who decides.** One person owns the call at the end of 30 days. A committee with no decision-maker produces a pilot that never ends.

## Week 1: build the smallest thing that works

Pick the narrowest possible version of your task. If you're testing support automation, pick one question category. If you're testing content generation, pick one content type.

Set up Claude with a basic system prompt. Don't optimize it yet — you need to see what breaks before you know what to fix. Run 20–30 real inputs through it manually.

By the end of week 1, you should have a working prototype and a list of the five most common ways it fails.

## Week 2: fix the obvious failures, start measuring

Take your failure list and address the top two or three. These are almost always system prompt issues: Claude doesn't know something it needs to know, a boundary isn't clearly defined, the tone is off.

Simultaneously, set up your measurement. What are you going to track? How will you know if outputs are good? Build the simplest possible eval set — 30 to 50 examples with clear criteria for what a passing output looks like.

Run your updated system through the eval set. You now have a baseline for your own pilot.

## Week 3: real users, supervised

Put the pilot in front of real users — but keep it supervised. For support automation, this might mean Claude drafts responses that a human reviews before sending. For content generation, Claude produces a draft that someone edits. For internal tools, a small volunteer group uses it daily.

The supervised layer does two things: it catches errors before they reach people who aren't expecting them, and it generates real data about where Claude succeeds and fails under actual use conditions.

By the end of week 3, you should have 50–100 real interactions to look at. Review them. Update your failure taxonomy. Fix the next tier of problems.

## Week 4: unsupervised, with monitoring

Remove or reduce the supervised layer for low-stakes interactions. Run the pilot at closer to real scale. Spot-check 10–15% of outputs daily.

Track your metrics. Are you hitting the threshold you set before the pilot started? Where are you above it, where below it?

This is also the week to collect structured feedback from the people using it — your team if it's internal, users if it's customer-facing. Not "do you like it" but specific: what worked, what was frustrating, what surprised you.

## Day 30: the decision

You have four weeks of data. You have eval results. You have user feedback. You have your pre-committed threshold.

The decision should be one of three:

**Proceed.** You hit your threshold. The task works at acceptable quality. Next step: expand scope, increase automation, or move to the next task.

**Iterate.** You're close to the threshold and you can see specifically what's keeping you from it. Fix those things and run another two weeks. This is only valid if you can name the specific changes and why you expect them to work.

**Stop.** The task doesn't work well enough and there's no clear path to fixing it. This isn't failure — it's information. "AI doesn't work well for this particular task with our particular data" is a real finding. The organisations that learn this fast are better positioned than those that spend six months hoping.

## The thing most pilots get wrong

They measure output quality but not process change.

Even if Claude handles a task at 80% of human quality, that might not be worth it if it requires significant overhead to review, correct, and manage. The full cost of an AI implementation includes the time to supervise it, fix its mistakes, update its configuration, and handle the cases it can't handle.

Build that into your evaluation. The question isn't just "does Claude do this well?" It's "does Claude doing this create net value for our team?"

That answer requires 30 days of honest data — which is exactly what this structure gives you.`,
  },

  // ── 7. Hallucination — role ──────────────────────────────────────────────
  {
    termName: 'Hallucination',
    slug: 'hallucination-role',
    angle: 'role',
    title: "How to work with Claude when accuracy matters",
    excerpt: "Hallucination isn't a reason to avoid Claude for high-stakes work. It's a constraint to design around. Teams that get this right build AI into their most important workflows. Teams that don't, limit AI to the low-stakes ones.",
    readTime: 5,
    tier: 3,
    body: `If your first reaction to AI hallucination is "then we can't use this for anything important," you're going to find yourself limited to the least valuable use cases.

The teams getting the most out of Claude in high-stakes contexts aren't ignoring hallucination. They're designing around it — deliberately and specifically. Here's how.

## The mindset shift that unlocks this

Stop thinking about hallucination as a bug. Think of it as a characteristic of the tool — like the fact that a spreadsheet doesn't catch logical errors, or a spell-checker doesn't catch wrong-but-correctly-spelled words.

You use spreadsheets for financial modelling anyway. You use spell-checkers anyway. You've built habits and review processes around their failure modes. That's what working with Claude in high-stakes situations looks like.

## The three accuracy contexts

Not all high-stakes work requires the same approach to accuracy. It helps to be specific about which one you're in.

**High-stakes, verifiable.** Legal document review. Financial analysis. Factual research with citable sources. Here, every significant claim should be traceable to a source. The good news: Claude is excellent at flagging its uncertainty and identifying where claims need verification. Use that — design prompts that ask Claude to mark confidence levels and identify what should be checked.

**High-stakes, judgment-based.** Strategy recommendations. Customer communication. Editorial decisions. Here there often isn't a single "correct" answer, so "accuracy" means something different — consistency, appropriateness, alignment with your values. Evals and spot-check review matter more than source verification.

**High-stakes, consequential actions.** Any situation where Claude's output directly triggers an action in the world — sending a message, making a change, completing a transaction. Here, human review before execution is almost always worth the overhead, at least until you have extensive data on reliability.

## Specific techniques that reduce accuracy risk

**Give Claude the information it needs instead of asking it to recall.** The most reliable way to prevent hallucination about your business is to not ask Claude to remember things about your business. Paste in the relevant document, policy, or data. Claude reasoning over information you provided is far more reliable than Claude recalling information from training.

**Ask Claude to show its work.** "What's the answer, and what's the basis for that answer?" A confident wrong answer often collapses when Claude has to explain its reasoning. The reasoning trace also tells you where to check.

**Ask explicitly about uncertainty.** "Are there parts of this answer you're less confident about?" Claude is trained to acknowledge uncertainty when asked. Most teams don't ask.

**Use Claude for structure, verify the substance.** Claude is excellent at producing well-structured, clearly reasoned output. For high-stakes work, let Claude produce the structure — the draft, the framework, the analysis — and focus your human review on verifying the substance. This is often 3–4x faster than reviewing unstructured raw material.

## Where accuracy risk is worth taking

Some teams use Claude for important work with no human review at all. This is rational in certain conditions:

The task has clear success criteria you've already evaluated against extensively. You've run 200 examples and the error rate is low enough that the cost of errors is less than the cost of review. You have monitoring in place that catches systematic failures before they compound.

This takes time to build to. Most teams shouldn't start here — they should start with supervised use and work toward autonomous use as evidence accumulates.

## The practical bottom line

Use Claude for high-stakes work, but be explicit about your review process before you start. "Claude drafts, human verifies" is a sustainable operating model for most important tasks. "Claude does, nobody checks" requires a level of demonstrated reliability that most teams haven't yet established.

The accuracy improvement comes from giving Claude better information, asking better questions about its uncertainty, and building review processes proportional to the stakes — not from avoiding important use cases.`,
  },

  // ── 8. Claude — role (operator habits) ───────────────────────────────────
  {
    termName: 'Claude',
    slug: 'claude-operator-habits',
    angle: 'role',
    title: "Five habits that separate operators who get results from those who don't",
    excerpt: "Most of the gap between teams getting real value from Claude and teams that are still in pilot mode comes down to a handful of specific practices. Here's what the effective ones do differently.",
    readTime: 5,
    tier: 3,
    body: `After watching a lot of teams implement Claude, a pattern becomes clear. The ones getting meaningful results aren't necessarily the most technically sophisticated. They've just developed a specific set of habits that the struggling teams haven't.

Here are the five that make the biggest difference.

## Habit 1: They give Claude context, not just tasks

The struggling team: "Summarise this document."

The effective team: "You're helping me prepare for a board meeting. I need to summarise this Q3 report in a way that highlights the three things the board most needs to understand — they care about growth, cash position, and risk. Here's the report."

The difference is context. Claude doesn't know why you're doing something unless you tell it. It doesn't know who the audience is. It doesn't know what "good" looks like in your specific situation. When you treat Claude like a colleague you're briefing rather than a search engine you're querying, the quality of output changes substantially.

The habit: before you send a task, ask yourself: "what would I tell a new team member before giving them this assignment?" Tell Claude that.

## Habit 2: They iterate quickly instead of prompting perfectly

The struggling team spends 45 minutes writing a prompt and then treats the first output as final.

The effective team sends a rough prompt, looks at the output, says "this is close but too formal in tone — redo it warmer," looks at the next output, says "good, but make the second paragraph shorter," and arrives at a great result in five minutes.

Claude is a conversation partner, not a one-shot generation engine. The fastest path to a good output is usually a rough first pass plus two or three targeted rounds of feedback. Trying to specify everything up front wastes time and produces worse results than iterative refinement.

The habit: send a first version quickly. Treat the initial output as a draft to react to, not a final product to accept or reject.

## Habit 3: They write one good system prompt and maintain it

Teams that use Claude ad hoc — a different prompt every time, starting from scratch for each use case — get inconsistent results that are hard to improve on.

Teams that invest in a well-crafted system prompt for their core use case get compound returns. Every interaction benefits from the accumulated specificity of that prompt. Every improvement to the prompt makes every future interaction better.

The habit: for any Claude use case you're running regularly, have a written system prompt. Review it quarterly. Treat it like a product asset, because it is one.

## Habit 4: They're specific about what they don't want

Claude tries to be helpful. That instinct sometimes produces outputs that are technically responsive but not quite right — too long, too hedged, includes caveats you don't need, uses a format that doesn't fit your workflow.

The most efficient correction is specific negative feedback: "don't add the summary at the end," "stop hedging everything with 'it's important to note that'," "I don't need bullet points, give me prose."

Being explicit about what you don't want is often more efficient than describing what you do want, because it targets the exact thing that's wrong rather than redefining the whole task.

The habit: when an output is almost right but has one specific problem, name the problem directly. "Everything is good except [specific thing] — fix just that."

## Habit 5: They use Claude to improve their Claude usage

The most effective teams use Claude as a tool for getting better at using Claude. When a prompt isn't working, they ask Claude why it produced the output it did and what a better prompt would look like. When they're designing a new use case, they ask Claude to help them think through the system prompt structure.

This seems circular, but it works. Claude has a detailed understanding of how it processes instructions, what kinds of prompts produce what kinds of outputs, and where common configurations go wrong. That knowledge is available in every conversation.

The habit: when something isn't working, ask Claude to diagnose it. "Here was my prompt. Here was your output. Here's what I actually wanted. What was missing from my prompt?" The answer is usually directly useful.

---

None of these habits are technically sophisticated. They're operational disciplines — ways of working with the tool that compound over time. The teams building real value with Claude aren't waiting for the technology to get better. They're getting better at using the technology they already have.`,
  },

]

async function main() {
  console.log('Fetching terms...')
  const termNames = [...new Set(ARTICLES.map(a => a.termName))]
  const { data: terms, error: tErr } = await sb
    .from('terms')
    .select('id, slug, name, cluster')
    .in('name', termNames)

  if (tErr) { console.error(tErr.message); process.exit(1) }

  const termMap = Object.fromEntries((terms ?? []).map(t => [t.name, t]))
  console.log(`Matched ${Object.keys(termMap).length}/${termNames.length} terms`)

  const rows = ARTICLES.map(a => {
    const term = termMap[a.termName]
    if (!term) { console.warn(`  ⚠ not found: ${a.termName}`); return null }
    return {
      slug: a.slug,
      term_id: term.id,
      term_name: term.name,
      term_slug: term.slug,
      cluster: term.cluster,
      title: a.title,
      angle: a.angle,
      body: a.body,
      excerpt: a.excerpt,
      read_time: a.readTime,
      tier: a.tier,
      published: true,
    }
  }).filter(Boolean)

  const { data, error } = await sb
    .from('articles')
    .upsert(rows, { onConflict: 'slug' })
    .select('slug, title')

  if (error) { console.error(error.message); process.exit(1) }

  console.log(`\n✓ ${data?.length} articles seeded:`)
  data?.forEach(a => console.log(`  - ${a.slug}`))
}

main().catch(e => { console.error(e); process.exit(1) })
