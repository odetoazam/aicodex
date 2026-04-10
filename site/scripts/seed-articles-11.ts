/**
 * Batch 11 — Admin guides, role-type field notes, practical operator content
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-11.ts
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

  // ── 1. AI usage policy ────────────────────────────────────────────────────
  {
    termSlug: 'claude-plans',
    slug: 'ai-usage-policy-for-teams',
    angle: 'process',
    title: 'How to write an AI usage policy your team will actually follow',
    excerpt: 'Most AI usage policies are either too vague to be useful or so restrictive they get ignored. Here is the framework that actually works.',
    readTime: 6,
    cluster: 'Business Strategy & ROI',
    body: `Before your team starts using Claude in earnest, you need a usage policy. Not a 12-page legal document — a clear, practical set of rules that tells people what they can use Claude for, what requires human review, and what is off-limits.

Most organisations get this wrong in one of two ways: they write something so vague it provides no guidance ("use AI responsibly"), or so restrictive it immediately gets ignored ("all AI outputs must be reviewed by legal"). Here is the framework that actually holds up in practice.

## The three-zone model

Think of usage in three zones:

**Zone 1: Use freely**
Tasks where Claude's output is an input to a human's work — not an output that goes directly to anyone. Internal drafts, research summaries, analysis, brainstorming, reformatting, summarising meeting notes. Claude makes work faster; a human still decides what to do with the output.

**Zone 2: Use with review**
Tasks where Claude's output goes to another person — internal or external — but where the stakes are moderate. First drafts of customer emails, project updates, documentation, reports. The human reviews and edits before sending. Claude accelerates; a human approves.

**Zone 3: Not without specific approval**
Tasks with real-world consequences that are hard to reverse: anything involving financial commitments, legal agreements, medical advice, HR decisions, or binding representations to customers. These need explicit approval from the relevant function head before Claude is used in the workflow.

The zones are not about capability — Claude can do Zone 3 tasks competently. They are about accountability. Zone 3 items are the ones that, if wrong, create real problems.

## The five things every policy must cover

**1. Data you cannot share with Claude**
Be explicit. Typically: personal data about employees or customers (names, contact details, health information, salary data), confidential financial information, passwords and credentials, legally privileged documents, and anything covered by NDA.

If your company handles healthcare, financial, or legal data, talk to your legal and compliance team before finalising this section. Claude.ai (on Team and Enterprise plans) has strong privacy defaults, but the policy should reflect your specific obligations.

**2. What requires human review before use**
Anything in Zone 2. State it plainly: "All Claude-drafted external communications must be reviewed by the sender before sending." One sentence. No ambiguity.

**3. What to do when Claude gets something wrong**
Tell people how to report problems. A Slack channel, an email address, a form — the specific channel matters less than having one. If people know where to flag bad outputs, you learn about problems early. If they don't, you find out after something has gone wrong.

**4. Who owns the policy**
Someone has to be responsible for updating it as Claude evolves. Put a name or role. "Policy owner: [IT Lead / Head of Operations / whoever you are]." Review it every six months — Claude's capabilities and your organisation's usage will both change.

**5. How to get help**
Who can team members ask when they are not sure if something is OK? Name the person or channel. This is the most commonly missing element in AI policies, and the most important — it is the difference between a policy that empowers people and one that creates anxiety.

## What to skip

Do not include:
- Long sections about how AI works. Your team does not need to know about [tokens](/glossary/token) to use Claude safely.
- Warnings about everything that could go wrong. Lead with what people can do, not with what might go wrong.
- Philosophical statements about AI ethics. Save those for a different document. The usage policy should be operational.

## Format

One page. Bullet points. Plain language. Date it and sign it from whoever has authority in your organisation. Put it somewhere people will actually find it — not buried in a wiki nobody visits.

A good usage policy is not a legal shield. It is a practical guide that helps people make decisions confidently. The less time anyone spends thinking "can I use Claude for this?" the more time they spend actually using it well.
`,
  },

  // ── 2. Writing system prompts that work ───────────────────────────────────
  {
    termSlug: 'system-prompt',
    slug: 'writing-system-prompts-that-work',
    angle: 'process',
    title: 'How to write a system prompt that actually works',
    excerpt: "The system prompt is the most powerful thing you control in Claude. Most people write them once, poorly, and wonder why outputs are inconsistent. Here's the method.",
    readTime: 7,
    cluster: 'Foundation Models & LLMs',
    body: `The [system prompt](/glossary/system-prompt) is the instruction set Claude reads before every conversation. It defines who Claude is for your use case, what it knows, how it should behave, and what it should never do. Write it well and every user in your [Project](/glossary/claude-projects) gets great outputs. Write it poorly and every user gets mediocre ones — and no amount of clever individual prompting fixes a bad system prompt.

Here is the method that produces system prompts that actually work.

## Start with four questions

Before you write a single word, answer these:

**1. Who is Claude in this context?**
Not "a helpful AI assistant" — that is meaningless. Specifically: what role is Claude playing? "A customer support specialist for [Company] who helps draft responses to incoming support tickets." "A marketing copywriter who produces content in [Brand]'s voice." The more specific the role, the more consistent the outputs.

**2. Who is Claude talking to?**
The user's context changes everything. "Experienced support reps who need Claude to handle volume, not explain basics" is different from "new joiners who need Claude to guide them through the process step by step." Write for your actual audience.

**3. What does good output look like?**
Pick three examples of output you would be happy sending. What do they have in common? Tone, structure, length, what they include, what they leave out. That is what you are trying to specify.

**4. What are the hard rules?**
Things Claude must never do in this context. Keep this list short — two or three items. "Never guess at product pricing — say you'll check and follow up." "Never promise a specific resolution timeline." "Never mention competitors by name." Hard rules should be genuinely hard, not everything you are vaguely worried about.

## The template

This structure works for most team Projects:

**Role:** [One sentence describing who Claude is and what it does]

**Audience:** [Who the user is, their context and level of knowledge]

**Tone:** [Three adjectives — not "professional and friendly," be specific: "direct, warm but not chatty, assumes the customer is intelligent"]

**Always:** [Two or three specific positive behaviours]

**Never:** [One or two hard constraints]

**Context:** [Key facts Claude needs to know about your company, product, or situation — the things it would otherwise get wrong or have to guess at]

**Format:** [How responses should be structured — length, use of lists vs prose, headers or no headers]

Total length: 200–400 words. If you are writing more than 400 words, you are either including things that are not truly rules (they are preferences, handle those with examples instead) or you are trying to cover every edge case (impossible — handle exceptions in conversation instead).

## The mistakes everyone makes

**Writing for edge cases instead of the common case.** Your system prompt should optimise for the 80% of interactions, not the 5% of weird situations. Handle edge cases in conversation.

**Using vague tone descriptors.** "Professional and friendly" describes every corporate AI assistant ever written. Instead: "Write like a senior colleague explaining something to a peer — knowledgeable but not condescending, concise but not terse."

**Putting examples in the system prompt.** Good examples belong in the Project knowledge base as documents, not in the system prompt. The system prompt is for rules, not demonstrations.

**Making it a requirements doc.** System prompts are not contracts. They are context. Claude interpolates and applies judgment. Write for a smart colleague who needs orientation, not an edge case reviewer who needs every scenario documented.

**Never testing it.** A system prompt is a hypothesis. Run it against 10 representative inputs before anyone else uses the Project. Where does it produce the wrong tone? Where does it get facts wrong? Where does it miss the format? Fix those before launch, not after.

## How to iterate

When outputs go wrong, diagnose before rewriting:
- Wrong tone? Add a specific example of the right tone in the Context section.
- Wrong facts? Add the correct information to the Project's knowledge documents.
- Wrong format? Add a Format section with explicit structure.
- Wrong scope? Tighten the Role definition.

Most system prompt problems are one of these four. Identify which before you rewrite the whole thing.

The best system prompts are not the longest ones. They are the ones where every sentence earns its place — and the Project owner reviews them every month to remove what no longer applies.
`,
  },

  // ── 3. Claude for finance teams ───────────────────────────────────────────
  {
    termSlug: 'claude-projects',
    slug: 'claude-for-finance-teams',
    angle: 'field-note',
    title: 'What AI actually looks like for a finance team',
    excerpt: 'Finance teams deal with high-stakes, high-precision work. Here is where Claude genuinely helps — and where it has no place.',
    readTime: 5,
    cluster: 'Business Strategy & ROI',
    body: `Finance teams sit in an unusual position with AI. On one hand, their work is heavily document-based, analytical, and repetitive in structure — exactly the kind of work Claude handles well. On the other hand, the consequences of errors are real: wrong numbers in a board report, a miscommunicated position in an investor update, a compliance gap. The tolerance for "approximately right" is lower than in almost any other function.

This creates a specific set of use cases that work well and a clear set that should stay human.

## Where Claude delivers for finance

**First drafts of recurring reports.** Monthly board packs, investor updates, departmental summaries — these follow a template every time. The structure is the same; the numbers change. Claude can take the numbers, the prior period's report, and the key narratives, and produce a first draft that is 80% there. The finance lead reviews, corrects the framing, and adds judgment. Two hours of work becomes thirty minutes.

**Variance commentary.** "Revenue is up 12% vs. plan. Write three sentences explaining why, based on this data." Claude is good at this — turning numbers into prose that non-finance stakeholders can read. The human still owns the interpretation; Claude handles the writing.

**Document summarisation and extraction.** Contracts, vendor agreements, regulatory filings — there is always more to read than there is time to read it. Claude can extract key terms, flag clauses that need attention, and produce a structured summary. This is not legal advice; it is triage.

**Internal Q&A and policy lookup.** "What is our capitalization policy for software development costs?" "What does the FX hedging policy say about threshold triggers?" If you upload your finance policies and procedures to a [Project](/glossary/claude-projects), your team can ask questions in plain language and get accurate answers sourced from your own documents.

**Drafting financial communications.** Emails to auditors, responses to investor queries, CFO talking points for earnings calls. The financial content is human-generated; Claude handles the writing and structure.

## Where Claude has no place in finance

**Producing numbers.** Claude generates text. It does not crunch spreadsheets reliably — it can appear to, but it makes calculation errors that are hard to spot. For any actual arithmetic, your spreadsheet or BI tool is the right system. Use Claude downstream of the numbers, not to produce them.

**Making judgments about accounting treatment.** "Should we capitalise or expense this?" is an accounting judgment that requires your policies, your auditor's position, and professional judgment. Claude can tell you what the general standard says. It cannot tell you what the right answer is for your specific situation.

**Compliance sign-off.** No AI output should serve as the final word on whether something is compliant. Claude can help you understand a regulation in plain English; it cannot tell you whether your specific practice is compliant.

## The Project setup that works

Create one [Project](/glossary/claude-projects) for finance. Upload:
- Your chart of accounts and key definitions
- Reporting templates and prior period examples
- Finance policies and procedures
- Key metrics definitions (so Claude uses your definitions, not generic ones)

System prompt: "You are a finance assistant for [Company]. You help the finance team draft communications, summarise documents, and produce first drafts of reports. You never produce or verify numbers — you work with numbers the team provides. You never give accounting or compliance advice. When in doubt about financial accuracy, flag it explicitly."

That last instruction — flagging uncertainty explicitly — is the most important one. A finance Claude that confidently produces wrong information is more dangerous than one that says "I'm not certain about this figure, please verify." Make uncertainty visible.

## The pattern that works

Use Claude where your finance team is spending time on writing, synthesis, and communication — not where they are making financial judgments. The leverage is real; it just requires knowing which side of that line you are on.
`,
  },

  // ── 4. Claude for product teams ───────────────────────────────────────────
  {
    termSlug: 'claude-projects',
    slug: 'claude-for-product-teams',
    angle: 'field-note',
    title: 'What AI actually looks like for a product team',
    excerpt: 'Product managers spend a disproportionate amount of time writing. Here is where Claude changes that — and how to set it up so it actually fits how product work gets done.',
    readTime: 5,
    cluster: 'Business Strategy & ROI',
    body: `Product managers are, underneath the strategy and the roadmaps, professional writers. PRDs, spec documents, user story maps, OKR write-ups, stakeholder updates, research synthesis, release notes — the writing never stops. And most of it is structural: the same format, different content, over and over.

That is the space where Claude changes the job.

## Where Claude genuinely helps product teams

**PRD first drafts.** Give Claude the problem statement, the key user research, the proposed solution, and the constraints. Ask it to produce a first-draft PRD in your team's format. You get a complete document with gaps you need to fill rather than a blank page. The quality of the PRD depends on the quality of your input — but even a 70% draft saves 90 minutes of writing time.

**User story generation.** "Given this feature description, write the user stories in the format 'As a [user type], I want [goal], so that [reason].'" Claude can produce 20 stories from a feature description in seconds. You review, edit, and cut. Far faster than writing from scratch.

**Research synthesis.** Paste in 10 user interview transcripts. Ask Claude to identify the top five themes, with quotes. This is not a replacement for the researcher's analysis — it is a first pass that organises the material so the researcher can do deeper analysis faster. The [RAG](/glossary/rag) approach (uploading research documents to a Project) makes this repeatable across the whole research archive.

**Stakeholder communication.** "Here is the technical spec for this feature. Write a non-technical summary for the executive team that explains the business impact." Claude bridges the translation gap that product managers spend enormous time on. Same information, two audiences, one round of human review.

**Release notes and changelogs.** Give Claude the list of changes and their technical descriptions. Ask it to produce user-facing release notes in plain language. It is entirely mechanical — exactly the kind of task where Claude consistently performs well.

**Competitive analysis first pass.** "Here is our competitor's pricing page and their recent blog posts. Summarise their positioning and what has changed in the last quarter." Claude cannot do deep strategic analysis, but it can structure the raw material so you spend your time on analysis rather than gathering and organising.

## What does not work well

**Product strategy.** Claude can help you articulate a strategy you have already developed. It cannot develop strategy. If you ask Claude "what should our product strategy be," you will get a well-structured answer that sounds good and reflects nothing about your actual market, your customers, or your company's position. Use it to sharpen and articulate; not to originate.

**Deciding what to build.** Prioritisation is a judgment call that depends on context Claude does not have. Claude can help you structure your prioritisation criteria, but do not let it rank your roadmap.

**Replacing user research.** Claude can help synthesise research. It cannot replace it. Any Claude output that contains a user insight must be traced back to a real user who said it.

## The Project setup

One Product Project with:
- Your PRD template
- User story format and examples
- Your product principles and north star metric
- Current roadmap context
- Glossary of your product's domain-specific terms

System prompt: "You are a product writing assistant for [Company]. You help the product team draft PRDs, user stories, stakeholder updates, and release notes. You know our product, our users, and our way of writing. When you are missing information needed to write accurately, ask for it rather than inventing it."

That last instruction matters — a product Claude that invents user needs or product details is worse than useless. Make it ask.

## The real change

The product managers who get the most out of Claude are not the ones who use it to think for them. They are the ones who use it to spend their thinking time on thinking — and their writing time on editing instead of generating. That is a significant shift in how the job feels. Less grinding; more judgment.
`,
  },

  // ── 5. When not to use Claude ─────────────────────────────────────────────
  {
    termSlug: 'hallucination',
    slug: 'when-not-to-use-claude',
    angle: 'role',
    title: "When not to use Claude",
    excerpt: "Claude is genuinely powerful. It is also genuinely wrong for certain kinds of work. Knowing the difference is as important as knowing what it does well.",
    readTime: 5,
    cluster: 'Foundation Models & LLMs',
    body: `There is a lot of content about what Claude can do. Less about what it reliably cannot, or should not, do. This is the version of that conversation.

Knowing when not to use Claude is not pessimism — it is the thing that keeps your team from building misplaced trust, and the thing that keeps AI producing value instead of problems.

## Do not use Claude as a source of current facts

Claude's training has a cutoff date. It does not know about things that happened after that date unless you use web search or provide the information directly. If you ask Claude about the latest regulatory guidance, a competitor's recent product launch, or current market pricing, you may get an answer that is confidently wrong.

The fix is not "never use Claude for this" — it is "always verify current facts against a current source." Web search [Skills](/glossary/skill) help here, but even those have limits. Claude synthesises; it does not replace primary sources.

## Do not use Claude for arithmetic you are relying on

Claude can appear to do maths. It often gets it wrong. Not always — but enough that you cannot rely on it for any calculation that matters. This is a known characteristic of large language models: they are trained on text, not arithmetic, and they pattern-match more than they calculate.

For any numbers that will appear in a document, a decision, or a communication: use a spreadsheet. Claude can interpret numbers, explain trends, and write about financial results. It should not produce the numbers themselves.

## Do not use Claude where the output has legal or regulatory force

Claude can draft a contract. It can summarise regulatory requirements. It can explain what a clause means. It cannot tell you whether a specific contract is enforceable in your jurisdiction, whether your practice meets a specific regulatory standard, or what the right legal position is in a dispute. These require professional judgment from a qualified person — judgment that is informed by context Claude does not have access to and is accountable in ways Claude is not.

Use Claude to prepare materials for legal review, not to replace it.

## Do not use Claude where getting it wrong is irreversible

Send-on-behalf-of emails. Irreversible financial instructions. Public statements. Anything that goes out under your name and cannot be recalled. Claude can draft these things. A human should review them before they go anywhere.

The principle: if the downside of a wrong output is significant and cannot be undone, treat Claude's output as a draft, not a deliverable. The value is still there — drafting is faster than writing from scratch — but the accountability stays with the human.

## Do not use Claude to replace expertise you need

Claude has read a great deal about medicine, law, accounting, and engineering. It is not a doctor, a lawyer, an accountant, or an engineer. It does not have professional accountability, it cannot examine your specific situation with the depth a professional can, and it does not know what it does not know in the way a professional does.

For complex decisions in specialised domains, Claude can help you understand the domain, prepare questions, and organise information. It is a good way to get up to speed before talking to an expert. It is not a substitute for the expert.

## Do not use Claude where [hallucination](/glossary/hallucination) risk is high and undetectable

Some tasks make it easy to catch Claude when it is wrong — if it misquotes a policy you know well, you notice. Some tasks make it hard — if it summarises a document you have not read and fabricates a detail, you will not catch it without re-reading the original.

For tasks where you cannot verify the output and the stakes are high, Claude adds risk rather than reducing it. The solution is not to use Claude less — it is to structure the workflow so human verification is built in. But know when you are in this territory.

## The actual rule

Claude is excellent at tasks where: the output is a draft or input to a human's work, errors are visible and correctable, and the work benefits from speed and scale. It is the wrong tool when: the output is a final answer, errors are consequential and hard to spot, or the task requires accountability that must sit with a professional.

Most knowledge work has both kinds of tasks. The teams that use Claude well are the ones that have thought clearly about which is which.
`,
  },

  // ── 6. Measuring AI ROI ───────────────────────────────────────────────────
  {
    termSlug: 'claude-plans',
    slug: 'measuring-ai-roi',
    angle: 'process',
    title: 'How to actually measure the ROI of Claude at your company',
    excerpt: '"People seem to like it" is not an ROI measurement. Here is the framework for measuring what AI is actually delivering — without needing a data science team.',
    readTime: 6,
    cluster: 'Business Strategy & ROI',
    body: `Most AI rollouts get evaluated on vibes. People seem more productive. The team is positive about it. Nobody is complaining. These are not bad signals, but they are not measurements — and when someone asks you to justify the spend or expand the rollout, you need something more concrete.

Here is how to measure AI ROI without needing a data science team or a dedicated analytics stack.

## The three things you are actually measuring

AI delivers value in three ways:

**Time savings.** The same work gets done faster. A task that took 90 minutes takes 20. A document that took 3 drafts takes 1. These are real hours recovered, and hours recovered are either reinvested in more valuable work or reflect a capacity increase without a headcount increase.

**Quality improvements.** The output is better. More consistent tone. Fewer errors. More thorough research. Less variation between what your best and your average employee produce. Quality improvements are harder to measure but often more valuable.

**New capabilities.** Things that were not feasible before are now feasible. A five-person marketing team can now produce content at the volume of a ten-person team. A CS team of eight can handle the ticket volume of twelve without the customer experience degrading. New capabilities do not show up as cost savings — they show up as growth.

Most ROI measurement focuses on time savings because it is the easiest to quantify. But for most organisations, quality improvements and new capabilities are where the real value is.

## How to measure time savings

**Before and after task timing.** Pick five representative tasks (drafting a customer email, producing a weekly report, responding to a common support ticket category). Time how long they take before Claude. Time how long they take after. The delta times the frequency times the number of people doing the task is your time savings.

You do not need to time everyone. Sample five people per team, three tasks each. Extrapolate. It will be directionally accurate.

**Rough calculation:** If a CS team of 8 saves 45 minutes per day per person through faster ticket drafting, that is 6 hours per day, 30 hours per week, 1,500 hours per year. At a fully-loaded cost of £40/hour, that is £60,000 in time recovered annually. Against a Team plan cost of £[cost per year], the ROI calculation becomes straightforward.

## How to measure quality

Quality measurement requires you to define what quality means before you measure it. For each use case, ask: what does a good output look like, and how would I know?

For customer communications: customer satisfaction scores, response time, first-contact resolution rate. These are existing metrics — does Claude move them?

For content: time from brief to approved, number of revision rounds, stakeholder satisfaction. Again, existing metrics that Claude should move.

For internal documents: time in review, number of comments or change requests. Fewer cycles means higher quality first drafts.

If you do not have existing metrics for a use case, the simplest approach is a structured human review: randomly sample 20 outputs per month, rate them against a simple rubric (1-3 scale on accuracy, tone, completeness), and track whether the score changes over time.

## How to measure new capabilities

New capabilities are the hardest to quantify because you are measuring something that did not exist before. The approach: document the constraint that was lifted. "Before Claude, we could not personalise outreach at scale — now we send personalised emails to 500 prospects per week. Here is what that pipeline looks like."

This is a before/after narrative rather than a calculation. That is fine — for board presentations and budget justifications, concrete narratives are often more persuasive than estimates anyway.

## The 30-day check-in

At 30 days into a rollout, run a structured check-in with each team using Claude:

1. What are you using Claude for that you weren't doing before?
2. What are you doing faster?
3. What have you stopped doing because Claude does it?
4. What is not working?

These four questions, answered by five people per team, give you more useful information than any usage dashboard. Usage numbers tell you adoption; these questions tell you value.

## What to report upward

When you report to a founder or executive, structure it as: "Here is what we are saving, here is what we are doing more of, here is what we are spending." Avoid percentages without baselines ("50% faster" means nothing without "compared to what"). Lead with the most concrete metric you have. Acknowledge what you cannot yet measure.

The organisations that sustain AI investment are the ones where someone is measuring it clearly enough to tell a credible story about value. That is your job.
`,
  },

  // ── 7. Prompt engineering basics ─────────────────────────────────────────
  {
    termSlug: 'system-prompt',
    slug: 'prompt-engineering-for-operators',
    angle: 'process',
    title: 'Prompt engineering for operators: what actually matters',
    excerpt: 'Most "prompt engineering" advice is either too academic or too simplistic. Here is the practical version — the five things that reliably improve outputs.',
    readTime: 6,
    cluster: 'Foundation Models & LLMs',
    body: `"Prompt engineering" has become a loaded phrase — it implies a technical skill, a discipline, an art form. In practice, most of what makes prompts work better is not technical at all. It is clarity about what you want and how you think.

Here is what actually matters.

## 1. Tell Claude what role to play

The single most reliable improvement to outputs is specifying the role. Not "you are a helpful assistant" — that is the default. Specify who Claude is for this task:

"You are a senior copywriter who specialises in SaaS B2B content."
"You are a customer support specialist who has worked in telecoms for 10 years."
"You are a financial analyst reviewing an early-stage startup's pitch deck."

The role activates a set of implicit knowledge, tone assumptions, and priorities. The same question asked to a "copywriter" and to an "analyst" will produce qualitatively different answers — even if the question says nothing else different.

## 2. Give Claude the context it cannot guess

Claude knows a great deal about the world. It knows nothing about your company, your customer, your situation, unless you tell it. The most common reason for mediocre outputs is insufficient context.

Before writing a prompt, ask: what does Claude need to know to answer this well that it could not know by default?

Bad: "Write a follow-up email to a prospect."
Better: "Write a follow-up email to a prospect who attended our webinar on contract management software last Tuesday. They are a head of legal at a 200-person company. We discussed their pain points around contract renewals. Tone: warm, professional, no pressure. Goal: book a 30-minute call."

The second prompt takes 45 more seconds to write. It produces an email you can actually send.

## 3. Specify the format before you need to edit it

If you want a bulleted list, say so. If you want exactly three options, say three. If you want a one-paragraph summary, not a five-paragraph essay, say that. Claude defaults to comprehensive; if you want concise, you have to ask.

Format instructions:
- "In three bullet points"
- "In under 100 words"
- "As a table with three columns: action, owner, deadline"
- "Two options, each explained in one sentence"
- "Write this as if for a non-technical reader"

These instructions are cheap to add and dramatically reduce editing time.

## 4. Use examples more than instructions

When you want a specific output style, showing is faster than telling. Instead of "write in a conversational, not overly formal tone with short sentences," show Claude an example of what you mean:

"Match this tone: 'We've been heads-down on this for months. Here's what we've built.'"

Examples calibrate tone, sentence length, vocabulary, and structure in a way that descriptions cannot fully capture. If you have a great example of the thing you want, put it in the prompt.

## 5. Ask Claude to check its work

For any output where accuracy matters, build verification into the prompt:

"After drafting the email, review it and flag any claim you are not certain about."
"Before finalising, check whether the pricing information in this response is accurate based on the document I've provided."
"If you are making any assumptions I haven't stated explicitly, list them at the end."

This does not make Claude infallible — it reduces [hallucination](/glossary/hallucination) risk by making Claude surface its own uncertainty rather than present guesses as facts. It shifts the output from "confident and possibly wrong" to "calibrated and flagged."

## What does not matter much

**Magic phrases.** "Think step by step" helps with complex reasoning but does not reliably improve most outputs. "As an expert in X" helps a little but is much weaker than a properly written role instruction.

**Prompt length.** Longer prompts are not better prompts. More context is valuable; more instructions are not. If you are writing more than 200 words of prompt for a routine task, most of it is probably noise.

**Clever formatting.** All-caps, XML tags, special characters — these sometimes help, sometimes don't. For most everyday tasks, plain prose instructions work as well as anything more elaborate.

## The prompting habit that matters most

Write the first draft of your prompt, run it, look at the output, and diagnose why it is not what you wanted before rewriting. Is it the wrong tone? Missing context? Wrong format? Wrong scope? Each of these has a different fix. Most people rewrite the whole prompt when one specific change would have done it.

Prompting is debugging. Treat it that way.
`,
  },

  // ── 8. Claude for legal teams ─────────────────────────────────────────────
  {
    termSlug: 'claude-projects',
    slug: 'claude-for-legal-teams',
    angle: 'field-note',
    title: 'What AI actually looks like for a legal team',
    excerpt: 'Legal has real limits with AI — and real opportunities. Here is where Claude fits in a legal context, and what should stay out of scope.',
    readTime: 5,
    cluster: 'Business Strategy & ROI',
    body: `Legal teams are often the most cautious about AI adoption — understandably. The consequences of wrong legal information are real: missed risks, unenforceable clauses, compliance failures, liability. The caution is appropriate. But it has also led some teams to dismiss Claude entirely, missing the parts of legal work where AI delivers genuine value with minimal risk.

Here is the honest version of what works.

## Where Claude delivers for legal teams

**Contract review triage.** "Here is a 40-page vendor agreement. Identify clauses that deviate from our standard positions. Flag anything unusual in the limitation of liability, indemnification, or IP ownership sections." Claude cannot tell you whether to accept a clause — that is legal judgment. But it can reduce the time it takes to get to the clauses that need judgment from three hours to thirty minutes.

Combine this with your standard positions document uploaded to the [Project](/glossary/claude-projects), and Claude flags deviations against your own standards, not generic ones.

**Plain-English summaries.** "Summarise this NDA for a non-lawyer who needs to understand what they can and cannot share with this vendor." Legal teams spend significant time explaining legal documents in plain English to colleagues. Claude does this well, and the lawyer reviews the summary rather than translating from scratch.

**Template drafting.** Standard NDAs, basic service agreements, template policy documents. Claude can produce solid first drafts. A lawyer still reviews, edits, and signs off. The saving is the blank-page problem — starting from a structured draft rather than from nothing.

**Research and horizon scanning.** "What is the current UK regulatory position on AI-generated content copyright?" Claude can provide a clear explanation of the general legal landscape. It is not legal advice, and it requires verification against current primary sources — but it gets a lawyer oriented quickly on an unfamiliar area.

**Internal policy documents.** Acceptable use policies, data handling procedures, employee guidelines. These are not legal instruments — they are internal communications that need to be accurate and clear. Claude handles the drafting; legal reviews for accuracy.

## What Claude should not do in a legal context

**Provide legal advice on specific situations.** "Is this clause enforceable?" "Do we have grounds to terminate this contract?" These require a qualified lawyer applying professional judgment to specific facts in a specific jurisdiction. Claude cannot do this.

**Produce final legal instruments.** Any document that will be signed, filed, or relied upon as a legal commitment needs qualified legal review before it is used. Claude can produce the first draft; it cannot be the final reviewer.

**Make compliance determinations.** "Does our data processing practice comply with GDPR?" involves applying complex law to specific technical and operational facts. That is not a task you can safely delegate to an AI.

**Work with privileged documents without careful consideration.** Legal professional privilege is a real concern for in-house teams. Understand your organisation's data processing agreements with Anthropic before uploading privileged documents to Claude. Team and Enterprise plans have strong privacy protections, but this is a question for your organisation's risk appetite to answer, not a default assumption.

## The Project setup that works

One legal [Project](/glossary/claude-projects) with:
- Your standard contract positions (the deviations Claude should flag)
- Template agreements you commonly produce
- Key policy documents
- Glossary of jurisdiction-specific terms relevant to your work

System prompt: "You are a legal drafting assistant for [Company]'s legal team. You help draft, summarise, and review documents. You flag legal risks and deviations from our standard positions, but you do not provide legal advice on specific situations. When something requires professional judgment rather than drafting support, say so clearly."

That last instruction is the most important. A legal Claude that presents its outputs as legal advice creates liability. A legal Claude that clearly scopes its role saves time while keeping accountability where it belongs.

## The honest summary

Claude does not replace lawyers. It replaces the part of legal work that is writing, formatting, summarising, and initial review — the work that happens before and after the judgment. In a team where lawyers spend a third of their time on document administration, that is a significant leverage point. In a team that needs legal judgment, Claude is a tool to work faster, not a substitute for the expertise.
`,
  },

]

async function seed() {
  console.log('Seeding batch 11...\n')

  for (const article of ARTICLES) {
    const term = await getTermId(article.termSlug)
    if (!term) {
      console.error(`  ✗ Term not found: ${article.termSlug} (for ${article.slug})`)
      continue
    }

    const { error } = await sb.from('articles').upsert({
      slug: article.slug,
      term_id: term.id,
      term_name: term.name,
      term_slug: article.termSlug,
      cluster: article.cluster,
      title: article.title,
      angle: article.angle,
      body: article.body.trim(),
      excerpt: article.excerpt,
      read_time: article.readTime,
      tier: 2,
      published: true,
    }, { onConflict: 'slug' })

    if (error) {
      console.error(`  ✗ ${article.slug}:`, error.message)
    } else {
      console.log(`  ✓ ${article.slug}`)
    }
  }

  console.log('\nDone.')
}

seed().then(() => process.exit(0))
