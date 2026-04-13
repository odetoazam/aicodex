'use client'

import { useState, useCallback } from 'react'

type Category = 'summarize' | 'draft' | 'research' | 'analyze' | 'extract' | 'review' | 'plan' | 'compare' | 'operators' | 'developers'

type Prompt = {
  id: string
  title: string
  category: Category
  description: string
  prompt: string
  whenToUse: string
  tips: string
}

const TASK_CATEGORIES: { id: Category; label: string; icon: string; color: string }[] = [
  { id: 'summarize', label: 'Summarize',  icon: '◈', color: '#D4845A' },
  { id: 'draft',     label: 'Draft',      icon: '◧', color: '#5B8DD9' },
  { id: 'research',  label: 'Research',   icon: '◇', color: '#4CAF7D' },
  { id: 'analyze',   label: 'Analyze',    icon: '◐', color: '#7B8FD4' },
  { id: 'extract',   label: 'Extract',    icon: '▤', color: '#D4A45A' },
  { id: 'review',    label: 'Review',     icon: '◎', color: '#D45A7B' },
  { id: 'plan',      label: 'Plan',       icon: '◬', color: '#5AAFD4' },
  { id: 'compare',   label: 'Compare',    icon: '◫', color: '#9B7BD4' },
]

const ROLE_CATEGORIES: { id: Category; label: string; icon: string; color: string }[] = [
  { id: 'operators',  label: 'Operators',  icon: '⬡', color: '#5B8DD9' },
  { id: 'developers', label: 'Developers', icon: '{ }', color: '#7B8FD4' },
]

const CATEGORIES = [...TASK_CATEGORIES, ...ROLE_CATEGORIES]

const PROMPTS: Prompt[] = [
  // ── Summarize ─────────────────────────────────────────────────────────
  {
    id: 'summarize-document',
    title: 'Summarize a document',
    category: 'summarize',
    description: 'Condenses a long document into key points without losing what matters.',
    prompt: `Read the following document carefully. Then provide:

1. A one-paragraph executive summary (3-4 sentences max)
2. The 5 most important points, each in one sentence
3. Any action items or decisions mentioned
4. Anything that seems unclear or contradictory

Be specific — use names, numbers, and dates from the document. Don't generalize.

[Paste your document here]`,
    whenToUse: 'When you receive a long report, proposal, or memo and need the key takeaways fast.',
    tips: 'Works best when you paste the actual document rather than describing it. For PDFs, upload the file directly.',
  },
  {
    id: 'summarize-meeting',
    title: 'Summarize meeting notes',
    category: 'summarize',
    description: 'Turns messy meeting notes or a transcript into structured action items.',
    prompt: `Here are notes from a meeting. Turn them into a structured summary:

1. **Meeting purpose** — one sentence on what this meeting was about
2. **Key decisions made** — list each decision and who made it
3. **Action items** — for each: what needs to be done, who owns it, and any deadline mentioned
4. **Open questions** — anything raised but not resolved
5. **Next steps** — what happens next and when

Keep it factual. If something is unclear from the notes, say so rather than guessing.

[Paste meeting notes or transcript here]`,
    whenToUse: 'After any meeting where you took rough notes or have a transcript. Especially useful for catching commitments you might miss.',
    tips: 'If you have a Zoom/Teams transcript, paste the whole thing — Claude handles messy transcripts well.',
  },
  {
    id: 'summarize-email-thread',
    title: 'Summarize an email thread',
    category: 'summarize',
    description: 'Catches you up on a long email chain in 30 seconds.',
    prompt: `Read this email thread from oldest to newest. Tell me:

1. **What started this** — what's the original question or issue?
2. **What's been agreed** — any decisions or commitments made so far
3. **What's unresolved** — what still needs a decision or response
4. **What I need to do** — if I need to reply, what should I address?

Be brief. Use the actual names of the people involved.

[Paste email thread here]`,
    whenToUse: 'When you\'re cc\'d on a 15-message email chain and need to catch up without reading every reply.',
    tips: 'Include the full thread with headers (From, To, Date) if possible — it helps Claude track who said what.',
  },

  // ── Draft ─────────────────────────────────────────────────────────────
  {
    id: 'draft-email-reply',
    title: 'Draft an email reply',
    category: 'draft',
    description: 'Writes a professional email response based on what you want to say.',
    prompt: `I need to reply to this email. Here's the original:

[Paste the email you're replying to]

Here's what I want to say (rough notes, doesn't need to be polished):

[Your rough points here]

Draft a reply that:
- Is professional but not stiff
- Is concise (under 150 words unless the topic requires more)
- Addresses every point raised in the original
- Ends with a clear next step

Don't add filler phrases like "I hope this email finds you well."`,
    whenToUse: 'When you know what you want to say but don\'t want to spend 15 minutes wordsmithing it.',
    tips: 'The more specific your rough notes, the better the draft. "Say yes but push the timeline to next month" is better than "reply positively."',
  },
  {
    id: 'draft-slack-message',
    title: 'Draft a Slack message',
    category: 'draft',
    description: 'Writes a clear, well-structured Slack message for team communication.',
    prompt: `I need to post a message in Slack to [channel/person]. Here's the context:

[Describe the situation]

What I need to communicate:
[Your key points]

Draft a Slack message that:
- Gets to the point in the first line
- Uses bullet points if there are multiple items
- Is casual but clear (this is Slack, not email)
- Includes any @mentions or action items at the end
- Is scannable — someone should get the gist in 5 seconds`,
    whenToUse: 'When you need to announce something, ask for input, or share an update and want it to be clear the first time.',
    tips: 'Specify the channel type (leadership, engineering, general) — tone should match the audience.',
  },
  {
    id: 'draft-proposal',
    title: 'Draft a one-page proposal',
    category: 'draft',
    description: 'Creates a concise proposal document from your rough thinking.',
    prompt: `I need a one-page proposal for the following:

**What I'm proposing:** [Describe the idea]
**Who it's for:** [The decision-maker or audience]
**Why now:** [What prompted this]
**What I know about constraints:** [Budget, timeline, team size, etc.]

Write a proposal that includes:
1. **Problem** — what's the current pain (2-3 sentences)
2. **Proposed solution** — what to do (be specific)
3. **Expected outcome** — what success looks like (with numbers if possible)
4. **What it costs** — time, money, or resources needed
5. **Next step** — one clear action to move forward

Keep it under 400 words. The reader should be able to decide yes/no in 3 minutes.`,
    whenToUse: 'When you need to pitch an idea internally and want a clean, compelling one-pager.',
    tips: 'Include any specific numbers you have (budget, timeline, team size) — proposals with specifics get approved faster than vague ones.',
  },

  // ── Research ──────────────────────────────────────────────────────────
  {
    id: 'research-topic',
    title: 'Research a topic from scratch',
    category: 'research',
    description: 'Gives you a structured overview of any topic you need to get smart on fast.',
    prompt: `I need to get up to speed on [topic]. Give me a structured overview:

1. **What it is** — plain-English explanation (assume I know nothing)
2. **Why it matters** — why should someone in [my role/industry] care?
3. **Key concepts** — the 5 most important things to understand, each in 2-3 sentences
4. **Common misconceptions** — what do people usually get wrong about this?
5. **What to read next** — 3 specific things I should look into to go deeper

Be direct. Don't pad with caveats. If something is genuinely uncertain or debated, say so.`,
    whenToUse: 'When you\'re walking into a meeting about something you don\'t fully understand, or starting work in a new area.',
    tips: 'Replace [my role/industry] with your actual role — "product manager at a SaaS company" gets better answers than just "professional."',
  },
  {
    id: 'research-competitive',
    title: 'Competitive landscape overview',
    category: 'research',
    description: 'Maps out the competitive landscape for a product, market, or approach.',
    prompt: `I need a competitive landscape overview for [market/product area].

For each major player:
1. **Name and what they do** (one sentence)
2. **Target customer** — who are they built for?
3. **Pricing** — what does it cost? (ballpark is fine)
4. **Strengths** — what are they genuinely good at?
5. **Weaknesses** — where do they fall short?

Then add:
- **Trends** — what direction is this market moving?
- **Gaps** — what's nobody doing well yet?
- **My takeaway** — if I were entering this market, where would I position?

Use web search if you need current information. Cite sources where possible.`,
    whenToUse: 'Before making a build-vs-buy decision, entering a new market, or preparing a strategy presentation.',
    tips: 'Use this with Claude\'s web search turned on for the most current pricing and feature data.',
  },

  // ── Analyze ───────────────────────────────────────────────────────────
  {
    id: 'analyze-data',
    title: 'Analyze a dataset',
    category: 'analyze',
    description: 'Finds patterns, outliers, and insights in your data without you writing formulas.',
    prompt: `Here's a dataset I need help analyzing:

[Paste your data — CSV, table, or describe the spreadsheet]

Tell me:
1. **Summary stats** — totals, averages, ranges for the key columns
2. **Patterns** — any trends over time, correlations between columns, or clusters
3. **Outliers** — anything that looks unusual or doesn't fit the pattern
4. **Top and bottom performers** — the best and worst rows by [metric]
5. **So what?** — what should I actually do with this information?

Show your work — I want to see the numbers, not just conclusions.`,
    whenToUse: 'When you have a spreadsheet export and want insights without opening Excel. Works with CSV data, pasted tables, or uploaded files.',
    tips: 'For best results, upload the actual file (CSV or Excel) rather than pasting. If pasting, include column headers.',
  },
  {
    id: 'analyze-decision',
    title: 'Decision analysis',
    category: 'analyze',
    description: 'Structures a complex decision by mapping out options, tradeoffs, and risks.',
    prompt: `I need to make a decision and I want to think it through properly.

**The decision:** [What are you choosing between?]
**Context:** [What's the situation? What constraints exist?]
**What I care about most:** [Speed? Cost? Quality? Risk? Team morale?]

For each option:
1. **What happens if we do this** — realistic best case
2. **What could go wrong** — realistic worst case
3. **What we give up** — the tradeoffs
4. **Reversibility** — how hard is it to undo this decision?

Then give me:
- **Your recommendation** — what would you do and why?
- **What I should validate before deciding** — what assumption, if wrong, would change the answer?

Be direct. I want your actual opinion, not a balanced "it depends."`,
    whenToUse: 'When facing a significant decision with multiple options and you want to pressure-test your thinking before committing.',
    tips: 'Turn on Extended Thinking for this one — Claude does much better on complex tradeoff analysis when it can reason step-by-step.',
  },

  // ── Extract ───────────────────────────────────────────────────────────
  {
    id: 'extract-key-info',
    title: 'Extract key information from a document',
    category: 'extract',
    description: 'Pulls out specific data points from contracts, reports, or dense documents.',
    prompt: `Read this document and extract the following information:

[List the specific things you need — for example:]
- All dates and deadlines mentioned
- All dollar amounts and who pays what
- Names and roles of people mentioned
- Any obligations or commitments
- Any conditions or contingencies

Format the output as a structured list. If something isn't explicitly stated in the document, say "not specified" — don't infer.

[Paste document here]`,
    whenToUse: 'When reviewing contracts, legal docs, policy documents, or any dense text where you need specific facts pulled out.',
    tips: 'Be specific about what you need extracted. "All the important stuff" gives worse results than "all dates, dollar amounts, and obligations."',
  },
  {
    id: 'extract-action-items',
    title: 'Extract action items from any text',
    category: 'extract',
    description: 'Finds every commitment, task, and follow-up buried in long text.',
    prompt: `Read the following text and find every action item, commitment, or follow-up. For each one:

- **What** needs to be done (specific, not vague)
- **Who** is responsible (name the person if mentioned)
- **When** it's due (date/deadline if mentioned, or "no deadline stated")
- **Status** — is it done, in progress, or not started?

Group them by person if possible. If a commitment is vague ("we should look into that"), still include it but flag it as "vague — needs clarification."

[Paste text here — meeting notes, email thread, Slack conversation, document]`,
    whenToUse: 'After meetings, long Slack threads, or email chains where commitments were made but nobody wrote them down cleanly.',
    tips: 'This works on any text format — meeting notes, email threads, Slack exports, even voice transcripts.',
  },

  // ── Review ────────────────────────────────────────────────────────────
  {
    id: 'review-writing',
    title: 'Review and improve writing',
    category: 'review',
    description: 'Gives you specific, actionable feedback on a piece of writing.',
    prompt: `Review the following piece of writing. I want honest feedback, not compliments.

**What this is for:** [Blog post / email / proposal / internal doc / etc.]
**Target audience:** [Who will read this?]
**What I'm most worried about:** [Tone? Clarity? Length? Missing something?]

Give me:
1. **Overall impression** — does it work? (2 sentences)
2. **What's strong** — specific parts that are effective
3. **What's weak** — specific parts that need work, and why
4. **Line-level edits** — 3-5 specific sentences or phrases to rewrite (show the before and after)
5. **Structure** — is anything in the wrong order or missing?

Don't rewrite the whole thing. Help me see what to fix so I can improve it myself.

[Paste your writing here]`,
    whenToUse: 'Before sending important writing — proposals, blog posts, client communications, presentations.',
    tips: 'Including your target audience and what you\'re worried about dramatically improves the quality of feedback.',
  },
  {
    id: 'review-process',
    title: 'Review a process or workflow',
    category: 'review',
    description: 'Pressure-tests a business process for gaps, inefficiencies, and risks.',
    prompt: `Here's a process my team follows. I want you to review it for problems.

**The process:**
[Describe the step-by-step workflow]

**What it's supposed to achieve:** [The goal]
**How often it runs:** [Daily / weekly / per-project / etc.]
**Known pain points:** [What already frustrates people about it?]

Tell me:
1. **Bottlenecks** — where does this process slow down or depend on one person?
2. **Failure points** — where is it most likely to break?
3. **Redundancies** — is anyone doing work that doesn't need to happen?
4. **Missing steps** — what's not here that should be?
5. **Quick wins** — what one change would make the biggest difference?

Be blunt. "This looks fine" is not useful feedback.`,
    whenToUse: 'When a workflow feels inefficient but you can\'t pinpoint why, or before formalizing a process.',
    tips: 'Include the actual steps, not a summary. "Step 3: Sarah reviews in Notion and approves via Slack" is better than "manager approval."',
  },

  // ── Plan ──────────────────────────────────────────────────────────────
  {
    id: 'plan-project',
    title: 'Create a project plan',
    category: 'plan',
    description: 'Turns a vague idea into a structured plan with milestones and owners.',
    prompt: `I need a project plan for the following:

**What we're doing:** [Describe the project]
**Timeline:** [When does it need to be done?]
**Team:** [Who's available? What are their roles?]
**Constraints:** [Budget, dependencies, risks]

Create a plan that includes:
1. **Goal** — what "done" looks like (specific, measurable)
2. **Phases** — break it into 3-5 phases with clear deliverables per phase
3. **Key milestones** — the 4-5 dates that matter most
4. **Dependencies** — what has to happen before something else can start
5. **Risks** — what's most likely to go wrong, and what's the mitigation
6. **First week** — specifically what should happen in the first 5 days

Keep it practical. I want something I can share with my team on Monday, not a 20-page document.`,
    whenToUse: 'When you\'ve been told to "figure out the plan" for a new initiative and need a structured starting point.',
    tips: 'Include team members\' actual names and roles — Claude will assign tasks to specific people rather than generic roles.',
  },
  {
    id: 'plan-agenda',
    title: 'Create a meeting agenda',
    category: 'plan',
    description: 'Designs a focused meeting agenda that respects everyone\'s time.',
    prompt: `I need to run a meeting. Help me create an agenda.

**Purpose:** [Why are we meeting?]
**Attendees:** [Who's in the room and their roles]
**Time:** [How long is the meeting?]
**What needs to happen:** [Decisions needed, updates to share, problems to solve]

Create an agenda with:
- **Time blocks** for each item (total should equal meeting duration)
- **Owner** for each agenda item
- **Goal** for each item (decision, input, update, or brainstorm)
- A **pre-read** section if anything should be reviewed before the meeting
- **Last 5 minutes** reserved for action items and next steps

Design it so the meeting could end 10 minutes early if everything goes well.`,
    whenToUse: 'Before any meeting with 3+ people, especially recurring meetings that tend to go off track.',
    tips: 'Including the meeting duration forces Claude to make hard tradeoffs about what actually fits.',
  },

  // ── Operators ─────────────────────────────────────────────────────────
  {
    id: 'operators-system-prompt',
    title: 'Write a Claude Project system prompt',
    category: 'operators',
    description: 'Creates a tight, effective system prompt for any team use case.',
    prompt: `I need to write a Claude system prompt for the following team use case:

**Team:** [Which team will use this — e.g. customer success, marketing, operations]
**Primary task:** [What will they mainly ask Claude to do?]
**Audience for outputs:** [Who reads/receives Claude's outputs — internal team, customers, executives?]
**Tone:** [How should Claude write — formal, conversational, concise, detailed?]
**What Claude should always do:** [2-3 specific behaviors]
**What Claude should never do:** [1-2 hard constraints]
**Key context about our company:** [Name, what we do, relevant details]

Write a system prompt that:
- Is under 400 words
- Uses direct, specific language (not "be helpful" — say what helpful looks like)
- States constraints explicitly
- Gives Claude enough context to handle the most common 80% of requests without asking clarifying questions

Then tell me what's missing from my inputs that would make it better.`,
    whenToUse: 'When setting up a new Claude Project for a team and writing the instructions that define how Claude behaves for everyone in that Project.',
    tips: 'Tight system prompts (200-400 words) consistently outperform long ones (1000+ words). Cut anything that describes a rare edge case — handle those in conversation.',
  },
  {
    id: 'operators-eval',
    title: 'Evaluate whether Claude is actually helping your team',
    category: 'operators',
    description: 'A quick diagnostic framework for assessing real Claude adoption and impact.',
    prompt: `I want to evaluate whether our Claude rollout is working. Help me think through this.

**How many people have access:** [Number]
**How long we've had it:** [Weeks/months]
**Main use cases we set it up for:** [List them]
**What I'm observing:** [Describe what you're seeing — heavy use, low use, complaints, etc.]
**What data I have access to:** [Usage stats, anecdotes, surveys, nothing yet]

Give me:
1. **The 3 questions I should be asking** — what would tell me whether this is actually working?
2. **What "good" looks like at this stage** — realistic benchmarks for where we should be
3. **What the warning signs are** — patterns that indicate adoption is failing and why
4. **The fastest way to get signal** — one conversation I should have this week to learn the most
5. **The one thing to change** — if I could only fix one thing based on what I've described, what is it?

Be direct. I don't need encouragement — I need an honest read on what's working and what isn't.`,
    whenToUse: 'At the 30-day and 90-day marks after a Claude rollout, or any time adoption feels lower than expected.',
    tips: 'Include specific observations even if they\'re anecdotal ("three people told me the outputs don\'t sound like us"). Specific signals get more useful diagnosis than vague concerns.',
  },
  {
    id: 'operators-skill',
    title: 'Write a reusable Claude skill',
    category: 'operators',
    description: 'Structures a SKILL.md instruction set for a repeatable team task.',
    prompt: `I want to create a reusable Claude skill — a structured instruction set that any team member can use to complete the same task the same way every time.

**Task name:** [What is this skill called?]
**What it does:** [Describe the task in one sentence]
**Who uses it:** [Which team members, in what situation]
**Input:** [What does the user provide at the start? Documents, data, a brief, etc.]
**Output:** [What should Claude produce at the end? Format, length, structure]
**Quality standard:** [What makes a good output vs. a mediocre one?]
**Common variations:** [Are there 2-3 sub-types or scenarios this needs to handle?]

Write a SKILL.md instruction set that:
- Opens with one sentence explaining what this skill does
- States the expected input clearly
- Gives Claude a step-by-step process to follow
- Defines the output format precisely
- Includes one example of a good output (or describes what it looks like)
- Is under 500 words

The skill should be clear enough that a new team member could use it on day one without training.`,
    whenToUse: 'When a team keeps doing the same task repeatedly and wants Claude to do it consistently without re-prompting from scratch each time.',
    tips: 'The best skills are for tasks with a predictable structure and a clear "right" output. If every output looks completely different, a skill won\'t help much — fix the process first.',
  },
  {
    id: 'operators-rollout',
    title: 'Draft a Claude rollout announcement',
    category: 'operators',
    description: 'Writes the internal message that gets your team to actually try Claude.',
    prompt: `I need to announce Claude to my team for the first time. Help me write the internal message.

**Team size:** [How many people]
**Channels I'm posting to:** [Slack, email, all-hands, etc.]
**What we've set up:** [Projects, connectors, skills already configured]
**The main use cases I want them to start with:** [2-3 specific things]
**The biggest concern I'm anticipating:** [What will people worry about — job replacement, data privacy, quality, time to learn?]
**What I want them to do first:** [Specific first action — log in, try a prompt, attend a demo?]

Write an announcement that:
- Opens with what's in it for them (not "the company is excited to roll out AI")
- Is honest about what Claude is good and bad at
- Gives them one specific thing to try today — not a list of possibilities
- Addresses the concern I flagged without over-explaining
- Is under 200 words

Then write a follow-up message for one week later if people haven't engaged yet.`,
    whenToUse: 'When you\'re ready to launch Claude to your team and want the announcement to drive actual usage, not just awareness.',
    tips: 'The single most important thing: give one specific prompt to try, not a range of options. "Open Claude and paste your last meeting notes — try the meeting summary prompt" beats "Claude can help with many things."',
  },
  {
    id: 'operators-debug-outputs',
    title: 'Diagnose inconsistent Claude outputs',
    category: 'operators',
    description: 'Finds the root cause when Claude keeps giving different results for the same task.',
    prompt: `Our team is getting inconsistent outputs from Claude for a task that should be predictable. Help me diagnose the problem.

**The task:** [Describe what Claude is supposed to do]
**What we're seeing:** [Describe the inconsistency — sometimes X, sometimes Y, no pattern]
**How we're prompting:** [Paste your current prompt or system prompt]
**What "good" looks like:** [Describe the ideal output]
**What "bad" looks like:** [Describe the unacceptable outputs you're getting]
**Context changes between uses:** [Does anything change between runs — different users, different inputs, different times?]

Diagnose:
1. **Most likely cause** — what is probably producing the inconsistency?
2. **Second most likely cause** — what else could it be?
3. **How to test my diagnosis** — what specific change would confirm which cause it is?
4. **The fix** — what to change in the prompt, system prompt, or workflow
5. **What to monitor** — how to know if the fix worked

Be specific. "Make the prompt clearer" is not useful — tell me exactly what to change.`,
    whenToUse: 'When a Claude-assisted workflow produces good outputs sometimes and bad outputs other times, with no obvious reason for the difference.',
    tips: 'Include the actual prompt you\'re using. Paraphrasing it loses the detail that\'s usually causing the problem.',
  },
  {
    id: 'operators-policy',
    title: 'Draft a team AI usage policy section',
    category: 'operators',
    description: 'Writes the specific section of your AI policy covering what needs human review.',
    prompt: `I need to write the section of our AI usage policy that covers when humans must review Claude's outputs before they go out.

**Our team:** [Industry, company type, size]
**Main ways Claude is being used:** [List the use cases]
**Our biggest risk areas:** [Customer communications, legal documents, financial decisions, etc.]
**Current review process (if any):** [How do people handle Claude outputs today?]
**Level of formality needed:** [Internal guidelines vs. formal policy document]

Write a policy section that covers:
1. **What always requires human review** — the non-negotiable list
2. **What can go out without review** — low-risk outputs where Claude can operate independently
3. **The grey zone** — situations where judgment is required, and how to make that call
4. **The review standard** — what "reviewed" actually means (spot check? full read? approval sign-off?)
5. **What to do when Claude gets it wrong** — the reporting and correction process

Keep it practical. People should be able to read this once and know what to do — not consult it every time.`,
    whenToUse: 'When setting up Claude for the first time and establishing guardrails, or when updating existing AI policies after expanding how Claude is used.',
    tips: 'The most important section is the grey zone — that\'s where most mistakes happen. Spend the most time defining the judgment calls, not the obvious yes/no cases.',
  },

  // ── Compare ───────────────────────────────────────────────────────────
  {
    id: 'compare-options',
    title: 'Compare options side by side',
    category: 'compare',
    description: 'Creates a structured comparison of tools, vendors, approaches, or products.',
    prompt: `I need to compare these options:

**Option A:** [Name and brief description]
**Option B:** [Name and brief description]
**Option C:** [Name and brief description, if applicable]

Compare them on:
[List your criteria — e.g., cost, ease of setup, scalability, team fit, long-term risk]

For each option, score it on each criterion (Strong / Adequate / Weak) and explain why in one sentence.

Then give me:
1. **Summary table** — options as columns, criteria as rows
2. **Your recommendation** — which one and why
3. **When you'd pick a different one** — under what circumstances does the runner-up win?

Use web search if you need current pricing or feature data.`,
    whenToUse: 'When evaluating tools, vendors, job candidates, approaches, or any decision with multiple options and criteria.',
    tips: 'Name your specific criteria rather than asking Claude to choose them. Your criteria reflect what actually matters to your team.',
  },
  {
    id: 'compare-before-after',
    title: 'Before/after analysis',
    category: 'compare',
    description: 'Documents what changed and whether the change was worth it.',
    prompt: `I want to compare a before-and-after for something we changed.

**What changed:** [Describe the change — new tool, new process, reorganization, etc.]
**When it changed:** [Timeline]
**Before:** [How things worked before — be specific]
**After:** [How things work now — be specific]

Analyze:
1. **What got better** — specific improvements with evidence
2. **What got worse** — honest about downsides
3. **What's the same** — things that didn't change (this is useful to note)
4. **Net assessment** — was the change worth it?
5. **What to adjust** — if we keep the change, what should we tweak?

Don't sugarcoat. A balanced assessment is more useful than a positive one.`,
    whenToUse: 'When reviewing the impact of a change — new tool adoption, process update, team restructuring, AI implementation.',
    tips: 'Include specific metrics if you have them (response time, cost, satisfaction scores). Claude will work with hard data if you provide it.',
  },
  // ── Developers ────────────────────────────────────────────────────────
  {
    id: 'dev-system-prompt',
    title: 'Write a production system prompt',
    category: 'developers',
    description: 'Structures a system prompt for API use — precise, testable, token-efficient.',
    prompt: `I need to write a production system prompt for a Claude API integration.

**What the product does:** [Describe the application]
**What Claude's role is:** [Specific function — not "be helpful," but what it actually does]
**User type:** [Who interacts with it — customers, internal users, other systems?]
**Tone and voice:** [2-3 specific descriptors with examples if possible]
**What it must always do:** [Non-negotiable behaviors]
**What it must never do:** [Hard constraints — topics, actions, formats to avoid]
**Output format requirements:** [Does Claude always return JSON? Markdown? Plain text? Specific structure?]
**Token budget for system prompt:** [Target length — e.g. under 500 tokens]

Write a system prompt that:
- States the role and context in the first 2 sentences
- Uses specific, testable language (not "be professional" — say what professional means here)
- Puts the most critical constraints early
- Defines output format explicitly if the application depends on it
- Stays within the token budget

Then flag any ambiguities in my inputs that could cause inconsistent outputs in production.`,
    whenToUse: 'When building a Claude-powered feature or product and writing the system prompt that will run in production.',
    tips: 'Write the system prompt, then write 5 test cases that would break it. Fix the cases before shipping. This catches most edge cases before your users do.',
  },
  {
    id: 'dev-tool-schema',
    title: 'Design a Claude tool schema',
    category: 'developers',
    description: 'Structures a well-described tool definition for Claude tool use.',
    prompt: `I need to design a tool schema for Claude to use in a tool-use implementation.

**Tool name:** [What the tool is called — use snake_case]
**What it does:** [Describe the tool's function in one sentence]
**When Claude should call it:** [The conditions or user intent that should trigger this tool]
**Parameters needed:**
  - [Parameter 1]: [type, what it represents, required/optional]
  - [Parameter 2]: [type, what it represents, required/optional]
  - [etc.]
**What it returns:** [Structure and content of the response]
**What can go wrong:** [Possible errors or edge cases]

Write a complete tool schema in JSON format with:
- A clear, specific \`description\` that tells Claude exactly when to use this tool (not when not to)
- Well-described parameter \`description\` fields — Claude reads these to decide what values to pass
- Correct JSON Schema types and constraints
- An \`enum\` for any parameter with a fixed set of valid values

Then write the system prompt addition that tells Claude this tool exists and when to prefer it over generating a direct response.`,
    whenToUse: 'When implementing Claude tool use and need to define the schema that tells Claude what a tool does and how to call it.',
    tips: 'The \`description\` field on each parameter is what Claude reads to decide what value to pass. Vague descriptions produce wrong argument values. Be specific: "the ISO 8601 date string for when the event starts" beats "the date."',
  },
  {
    id: 'dev-evals',
    title: 'Write evals for a Claude feature',
    category: 'developers',
    description: 'Generates a set of test cases to evaluate output quality for a specific use case.',
    prompt: `I need to write evaluations (evals) for a Claude-powered feature to catch quality regressions.

**What the feature does:** [Describe the Claude-powered function]
**Current system prompt:** [Paste it or describe it]
**What "good" looks like:** [Describe a high-quality output — specific criteria]
**What "bad" looks like:** [Describe a failure mode — what would be wrong/unacceptable]
**Edge cases I'm worried about:** [List 2-3 scenarios that might cause problems]

Generate:
1. **10 test inputs** covering: typical cases (5), edge cases (3), adversarial inputs (2)
2. **For each test input:** what the expected output should look like (not exact text, but criteria)
3. **A grading rubric** — 3-5 specific criteria to score each output on (yes/no or 1-5 scale)
4. **The 2-3 tests most likely to catch a regression** — if you only run a few, which matter most?

Format the test cases as a table I can copy into a spreadsheet or test harness.`,
    whenToUse: 'When shipping a Claude feature to production and need to verify it works, or when making changes to a system prompt and need to confirm nothing broke.',
    tips: 'Run your evals before and after any system prompt change. The goal isn\'t 100% pass rate — it\'s knowing what changed so regressions don\'t surprise you in production.',
  },
  {
    id: 'dev-debug-prompt',
    title: 'Debug a prompt that is not working',
    category: 'developers',
    description: 'Diagnoses why a Claude prompt is producing wrong or inconsistent outputs.',
    prompt: `My Claude prompt is not producing the results I expect. Help me diagnose and fix it.

**My current prompt (system + user):**
[Paste the full prompt]

**What I expect Claude to output:**
[Describe the ideal output — format, content, tone, length]

**What Claude is actually outputting:**
[Describe or paste the actual output that's wrong]

**Is it always wrong, or sometimes wrong?**
[Always / Sometimes — if sometimes, describe the pattern]

**Model I'm using:**
[claude-3-5-sonnet, claude-3-haiku, etc.]

Diagnose:
1. **Root cause** — why is Claude producing this output?
2. **Specific fix** — exact change to make to the prompt (show me the rewrite)
3. **Why the fix works** — what behavior it changes and why
4. **What to watch for** — any tradeoffs or new failure modes the fix might introduce

Don't give me general prompt engineering advice. Diagnose this specific prompt.`,
    whenToUse: 'When a prompt that should work isn\'t producing the right output and you need to understand why before trying random changes.',
    tips: 'Include the full prompt exactly as it runs in production — not a paraphrase. The problem is almost always in a specific word or sentence that you\'d think to simplify when describing it.',
  },
  {
    id: 'dev-optimize-tokens',
    title: 'Optimize a system prompt for tokens',
    category: 'developers',
    description: 'Reduces system prompt length without losing the behaviors that matter.',
    prompt: `I need to reduce the token count of my system prompt without losing the behaviors that matter.

**Current system prompt:**
[Paste it]

**Current token count (approximate):**
[Number, or "not sure"]

**Target token count:**
[What you're aiming for, or "as low as possible"]

**Behaviors I must preserve:**
[List the specific behaviors that are non-negotiable]

**Behaviors I'm less certain about:**
[Anything in the prompt you're not sure is doing anything]

Rewrite the system prompt to:
1. Remove redundant instructions (things Claude does by default without being told)
2. Collapse examples that illustrate the same point
3. Convert negative instructions ("don't do X") to positive ones where possible
4. Cut anything that addresses an edge case that can be handled in the user turn instead
5. Tighten phrasing without changing meaning

Show me: the rewritten prompt, the estimated token reduction, and a list of anything you removed that I should verify still works with the shorter version.`,
    whenToUse: 'When system prompt token costs are significant at scale, or when you\'re approaching context window limits and need to make room.',
    tips: 'After shortening, run your evals on the new prompt before deploying. The most common mistake is cutting an instruction that was doing invisible work — you only notice it\'s gone when outputs degrade.',
  },
  {
    id: 'dev-review-integration',
    title: 'Review a Claude API integration',
    category: 'developers',
    description: 'Spots common mistakes and missing best practices in a Claude implementation.',
    prompt: `Review my Claude API integration for common mistakes and missing best practices.

**What I've built:** [Describe the application]
**My system prompt:**
[Paste it]

**My API call setup:**
[Paste the relevant code or describe: model, max_tokens, temperature, streaming yes/no]

**Conversation history handling:**
[How do you manage the messages array — full history, summarized, windowed?]

**Error handling:**
[What happens when the API returns an error or times out?]

**What I'm worried about:**
[Performance? Cost? Quality? Security? Something specific?]

Review for:
1. **System prompt issues** — vague instructions, missing constraints, token waste
2. **API parameter choices** — model selection, temperature, max_tokens for the use case
3. **Context management** — is history handled in a way that will scale?
4. **Error handling gaps** — what failure modes aren't covered?
5. **Cost risks** — anything that could cause unexpected token usage at scale?
6. **Security concerns** — prompt injection vectors, data exposure risks

For each issue: what's wrong, why it matters, and the specific fix.`,
    whenToUse: 'Before launching a Claude-powered feature to production, or when something is wrong and you want a systematic check rather than random debugging.',
    tips: 'Include the actual code for your API call and history management if you can. Descriptions of implementation hide the details that usually cause problems.',
  },
]

export default function PromptLibrary() {
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [openIds, setOpenIds] = useState<Set<string>>(new Set())

  const filtered = activeCategory === 'all'
    ? PROMPTS
    : PROMPTS.filter(p => p.category === activeCategory)

  const copyPrompt = useCallback(async (id: string, text: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }, [])

  function togglePrompt(id: string) {
    setOpenIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function countForCategory(cat: Category | 'all') {
    if (cat === 'all') return PROMPTS.length
    return PROMPTS.filter(p => p.category === cat).length
  }

  return (
    <>
      {/* Category filter */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' as const, alignItems: 'center' }}>
          {/* All */}
          <button
            onClick={() => setActiveCategory('all')}
            style={{
              fontFamily: 'var(--font-sans)', fontSize: '13px',
              fontWeight: activeCategory === 'all' ? 600 : 400,
              color: activeCategory === 'all' ? 'var(--text-primary)' : 'var(--text-muted)',
              background: activeCategory === 'all' ? 'var(--bg-subtle)' : 'none',
              border: '1px solid',
              borderColor: activeCategory === 'all' ? 'var(--border-base)' : 'var(--border-muted)',
              borderRadius: '6px', padding: '6px 14px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px',
              transition: 'all 0.15s ease',
            }}
          >
            All
            <span style={{
              fontSize: '11px', color: 'var(--text-muted)',
              background: 'var(--bg-subtle)', border: '1px solid var(--border-muted)',
              borderRadius: '4px', padding: '0 5px', lineHeight: '18px',
            }}>
              {PROMPTS.length}
            </span>
          </button>

          {/* Task categories */}
          {TASK_CATEGORIES.map(cat => {
            const isActive = cat.id === activeCategory
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  fontFamily: 'var(--font-sans)', fontSize: '13px',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? cat.color : 'var(--text-muted)',
                  background: isActive ? `${cat.color}10` : 'none',
                  border: '1px solid',
                  borderColor: isActive ? cat.color : 'var(--border-muted)',
                  borderRadius: '6px', padding: '6px 14px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '6px',
                  transition: 'all 0.15s ease',
                }}
              >
                <span style={{ fontSize: '12px' }}>{cat.icon}</span>
                {cat.label}
                <span style={{
                  fontSize: '11px', color: isActive ? cat.color : 'var(--text-muted)',
                  background: isActive ? `${cat.color}15` : 'var(--bg-subtle)',
                  border: '1px solid var(--border-muted)',
                  borderRadius: '4px', padding: '0 5px', lineHeight: '18px',
                }}>
                  {countForCategory(cat.id)}
                </span>
              </button>
            )
          })}

          {/* Divider */}
          <span style={{ width: '1px', height: '22px', background: 'var(--border-base)', margin: '0 4px', flexShrink: 0 }} />

          {/* Role categories */}
          {ROLE_CATEGORIES.map(cat => {
            const isActive = cat.id === activeCategory
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  fontFamily: 'var(--font-sans)', fontSize: '13px',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? cat.color : 'var(--text-muted)',
                  background: isActive ? `${cat.color}10` : 'none',
                  border: '1px solid',
                  borderColor: isActive ? cat.color : 'var(--border-muted)',
                  borderRadius: '6px', padding: '6px 14px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '6px',
                  transition: 'all 0.15s ease',
                }}
              >
                <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }}>{cat.icon}</span>
                {cat.label}
                <span style={{
                  fontSize: '11px', color: isActive ? cat.color : 'var(--text-muted)',
                  background: isActive ? `${cat.color}15` : 'var(--bg-subtle)',
                  border: '1px solid var(--border-muted)',
                  borderRadius: '4px', padding: '0 5px', lineHeight: '18px',
                }}>
                  {countForCategory(cat.id)}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Prompt cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {filtered.map(prompt => {
          const cat = CATEGORIES.find(c => c.id === prompt.category)!
          const isOpen = openIds.has(prompt.id)
          const isCopied = copiedId === prompt.id

          return (
            <div key={prompt.id} style={{
              borderRadius: '10px',
              border: '1px solid var(--border-base)',
              borderLeft: `3px solid ${cat.color}`,
              background: 'var(--bg-surface)',
              overflow: 'hidden',
            }}>
              {/* Header — click to expand */}
              <button
                onClick={() => togglePrompt(prompt.id)}
                style={{
                  width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                  padding: '14px 18px',
                  display: 'flex', alignItems: 'center', gap: '12px',
                  textAlign: 'left' as const,
                }}
              >
                <span style={{ fontSize: '16px', color: cat.color, flexShrink: 0 }}>{cat.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {prompt.title}
                  </span>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)', marginLeft: '10px' }}>
                    {prompt.description}
                  </span>
                </div>
                <span style={{
                  fontFamily: 'var(--font-sans)', fontSize: '10px', fontWeight: 600,
                  color: cat.color, background: `${cat.color}12`,
                  padding: '2px 8px', borderRadius: '4px',
                  letterSpacing: '0.05em', textTransform: 'uppercase' as const,
                  flexShrink: 0,
                }}>
                  {cat.label}
                </span>
                <span style={{
                  color: 'var(--text-muted)', fontSize: '12px', flexShrink: 0,
                  transition: 'transform 0.2s ease',
                  display: 'inline-block',
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                }}>
                  ▾
                </span>
              </button>

              {/* Expanded content */}
              {isOpen && (
                <div style={{ padding: '0 18px 18px', borderTop: '1px solid var(--border-muted)' }}>
                  {/* The prompt itself */}
                  <div style={{
                    marginTop: '16px', marginBottom: '16px',
                    position: 'relative',
                    background: 'var(--bg-base)',
                    border: '1px solid var(--border-muted)',
                    borderRadius: '8px',
                    padding: '16px 18px',
                  }}>
                    <pre style={{
                      fontFamily: 'var(--font-sans)', fontSize: '13px',
                      color: 'var(--text-secondary)', lineHeight: 1.65,
                      whiteSpace: 'pre-wrap' as const, wordBreak: 'break-word' as const,
                      margin: 0,
                    }}>
                      {prompt.prompt}
                    </pre>
                    <button
                      onClick={(e) => { e.stopPropagation(); copyPrompt(prompt.id, prompt.prompt) }}
                      style={{
                        position: 'absolute', top: '10px', right: '10px',
                        fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 600,
                        color: isCopied ? '#4CAF7D' : 'var(--accent)',
                        background: isCopied ? 'rgba(76,175,125,0.1)' : 'var(--bg-surface)',
                        border: '1px solid',
                        borderColor: isCopied ? '#4CAF7D' : 'var(--border-base)',
                        borderRadius: '6px', padding: '5px 12px', cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {isCopied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>

                  {/* When to use + tips */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="prompt-meta-grid">
                    <div>
                      <p style={{
                        fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600,
                        letterSpacing: '0.05em', textTransform: 'uppercase' as const,
                        color: cat.color, marginBottom: '6px',
                      }}>
                        When to use
                      </p>
                      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.55, margin: 0 }}>
                        {prompt.whenToUse}
                      </p>
                    </div>
                    <div>
                      <p style={{
                        fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600,
                        letterSpacing: '0.05em', textTransform: 'uppercase' as const,
                        color: cat.color, marginBottom: '6px',
                      }}>
                        Tips
                      </p>
                      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.55, margin: 0 }}>
                        {prompt.tips}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div style={{
        marginTop: '40px', padding: '18px 22px', borderRadius: '10px',
        border: '1px solid var(--border-muted)', background: 'var(--bg-surface)',
      }}>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
          Paste any prompt into Claude and fill in the [bracketed placeholders] with your actual context.
          The generic prompts work for anyone. The Operators and Developers sections are for prompts about working with Claude itself — configuring it, building with it, evaluating it.
        </p>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .prompt-meta-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
