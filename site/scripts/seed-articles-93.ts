/**
 * Batch 93 — Claude Academy positioning + August 2026 Anthropic shipping
 *
 * Trigger: Anthropic launched Claude Academy (academy.claude.com) on Aug 20, 2026.
 * anthropic.com/learn now redirects there. 355 free resources.
 *
 * Three positioning articles (the complement thesis) plus three catch-up articles
 * for August shipping the prior passes missed.
 *
 * 1. claude-academy-guide          — triage the 355-resource catalog by role
 * 2. what-claude-academy-doesnt-teach — the thesis: nine structural gaps
 * 3. claude-certifications-guide   — the four proctored exams + the prerequisite
 * 4. computer-use-browser-use-ga   — Aug 19 GA: computer use, browser use, Skills, Files
 * 5. claude-code-august-2026-updates — auto mode default, self-hosted envs, Playground
 * 6. managed-agents-budgets-guardrails — Aug 7/19: budgets, advisor, geo, memory stores
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-93.ts
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

const articles = [

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'claude-academy-guide',
    angle: 'role',
    title: 'Which Claude Academy courses are actually worth your time',
    excerpt:
      'Anthropic launched Claude Academy on August 20, 2026 with 355 free resources — 22 courses, 119 tutorials, and 148 role use cases. Nobody is going to work through that. Here is the triage: the two things almost everyone should take, six-course tracks for five roles, and what to skip.',
    readTime: 11,
    cluster: 'Getting Started',
    termSlug: 'ai-literacy',
    body: `Anthropic launched [Claude Academy](https://academy.claude.com) on August 20, 2026. \`anthropic.com/learn\` now redirects there.

The catalog holds **355 resources**: 22 courses, 119 tutorials, 148 role-specific use cases, plus live webinars. Everything is free, no credit card, and completing a course leaves a badge on your Academy profile.

It is the best product training any AI company has published. It is also more material than any working person will get through, and the site gives you almost no help deciding what matters. This is that help.

## Read this before you pick anything

Anthropic wrote its own recommended order and then buried it in the tutorial list: [Getting good at Claude: a research-backed curriculum](https://academy.claude.com/tutorials/getting-good-at-claude-a-research-backed-curriculum). It is short. Read it first. It will save you an hour of browsing.

## The two everyone should take

If you do nothing else on this page, do these.

**[Claude 101](https://academy.claude.com/courses/claude-101)** — 13 lessons, 2.5 hours. First conversation through Projects, Artifacts, Skills, and connected tools. Most people using Claude at work have never been shown Projects properly and are re-pasting the same context every morning. This fixes that.

**[AI Capabilities and Limitations](https://academy.claude.com/courses/ai-capabilities-and-limitations)** — 13 lessons, 3.5 hours. Next-token prediction, knowledge, working memory, steerability, context limits. This is the course that stops the frustration, because most frustration with a language model comes from an inaccurate mental model of what it is doing. If you have ever wondered [why Claude feels inconsistent](/articles/why-claude-feels-inconsistent), the answer is in here.

Six hours total. That is the highest-return six hours available on this subject right now.

## What the catalog actually contains

| Type | Count | What it is |
|---|---|---|
| Courses | 22 | Multi-lesson, quizzed, 45 min to 9 hours |
| Tutorials | 119 | Single-topic, 5–30 min, no quiz |
| Use cases | 148 | Task recipes by department — 10 min each |
| Webinars | Ongoing | Live, registration required |

The **courses** are the substance. The **tutorials** are mostly either concept explainers (why models hallucinate, what sycophancy is) or connector walkthroughs — and roughly 30 of the 119 are "using the X connector," where X is a vertical data provider like PubMed, FactSet, or Benchling. Skip those unless you work in that vertical.

The **use cases** are ten-minute task recipes: *build a battle card library*, *reconcile transactions across your accounts*, *draft investment memos*. They are well made. They are also the part of the catalog that ages fastest, because they encode a specific product surface at a specific moment.

## The 4D framework, and whether to bother

Nine of the 22 courses are AI Fluency variants. They all teach the same thing — Anthropic's **4D framework**: Delegation, Description, Discernment, Diligence. Delegation is deciding what to hand over. Description is how you brief it. Discernment is judging the output. Diligence is verifying in proportion to the stakes.

You do not need nine versions. Take one:

- Most people → [AI Fluency: Framework & Foundations](https://academy.claude.com/courses/ai-fluency-framework-foundations) (14 lessons, 4 hr)
- You ship software → [AI Fluency for Builders](https://academy.claude.com/courses/ai-fluency-for-builders) (9 lessons, 3 hr)
- You own a small business → [AI Fluency for Small Businesses](https://academy.claude.com/courses/ai-fluency-for-small-businesses) (9 lessons, 4 hr)
- You teach → [AI Fluency for educators](https://academy.claude.com/courses/ai-fluency-for-educators) or [pK–12](https://academy.claude.com/courses/ai-fluency-for-k-12-educators)
- You are going to train other people → [Teaching AI Fluency](https://academy.claude.com/courses/teaching-ai-fluency) (7 lessons, 4.5 hr)

Is a four-hour framework course worth it? If you are the person who will be explaining AI to colleagues for the next year — yes, unambiguously, because it hands you shared vocabulary and you will stop reinventing the explanation every time. If you are a developer who just wants to ship, take AI Capabilities and Limitations instead and skip the framework.

The single most useful idea in the whole framework is **verify in proportion to the stakes**. There is a seven-minute tutorial on exactly that — [Can you trust what AI tells you](https://academy.claude.com/tutorials/can-you-trust-what-ai-tells-you) — and it is safe to send to a skeptical colleague who will never take a four-hour course.

## Track: you are running AI inside your company

The [AI Agent Manager](/articles/what-is-an-agent-operator) role. Six items, in order:

1. [AI Fluency: Framework & Foundations](https://academy.claude.com/courses/ai-fluency-framework-foundations) — 4 hr. Vocabulary you will use every week.
2. [Claude 101](https://academy.claude.com/courses/claude-101) — 2.5 hr. You cannot support features you have not used.
3. [Introduction to Claude Cowork](https://academy.claude.com/courses/introduction-to-claude-cowork) — 2.5 hr. Take this *before* you enable Cowork for anyone.
4. [Introduction to agent skills](https://academy.claude.com/courses/introduction-to-agent-skills) — 1 hr. Skills are how company knowledge gets encoded.
5. [Claude Enterprise Administrator Guide](https://academy.claude.com/tutorials/claude-enterprise-administrator-guide) — the controls your first security review will ask about.
6. [What is Claude Managed Agents](https://academy.claude.com/tutorials/what-is-claude-managed-agents) — the concept your CEO read about.

About 11 hours. What it will not give you: what to do when [adoption plateaus](/articles/claude-adoption-plateau), how to [defend the spend](/articles/agent-operator-cost-control), or how to [build an eval suite](/articles/how-to-evaluate-your-agents) that catches a regression before your users do.

## Track: Forward Deployed Engineer

The [FDE](/articles/what-is-a-forward-deployed-engineer) role. This is where Academy is strongest.

1. [Building with the Claude API](https://academy.claude.com/courses/building-with-the-claude-api) — 67 lessons, 9 hours. Prompting, tool use, RAG, agents, MCP, production patterns. This is the single highest-value free thing on the internet for this role.
2. [Introduction to Model Context Protocol](https://academy.claude.com/courses/introduction-to-model-context-protocol) — 1 hr. Every engagement ends up wiring a client system to Claude.
3. [MCP: Advanced Topics](https://academy.claude.com/courses/model-context-protocol-advanced-topics) — 1.5 hr. Sampling and roots come up the moment a client asks for something non-trivial.
4. [Claude Code in Action](https://academy.claude.com/courses/claude-code-in-action) — 1 hr. Long unattended sessions on codebases you did not write.
5. [Introduction to subagents](https://academy.claude.com/courses/introduction-to-subagents) — 45 min. Decomposition is the difference between a demo and a system.
6. [Claude with Amazon Bedrock](https://academy.claude.com/courses/claude-with-amazon-bedrock) — 8 hr, **instead of** item 1 if your clients deploy on AWS. Same content, correct plumbing. There is a [Vertex AI version](https://academy.claude.com/courses/claude-with-google-cloud-s-vertex-ai) too.

About 13 hours, or 12 if you swap Bedrock in. Combine it with [portfolio projects](/articles/fde-portfolio-projects), because a certificate is not evidence and a working system is.

## Track: IT and admin

1. [Claude Enterprise Administrator Guide](https://academy.claude.com/tutorials/claude-enterprise-administrator-guide) — start here.
2. [Getting started with Claude security](https://academy.claude.com/tutorials/getting-started-with-claude-security) — quotable in a review.
3. [Claude Cowork Enterprise Administrator Guide](https://academy.claude.com/tutorials/claude-cowork-enterprise-administrator-guide) — Cowork has its own admin surface. It does not inherit your claude.ai settings.
4. [How to enable Claude Code for your enterprise team](https://academy.claude.com/tutorials/how-to-enable-claude-code-for-your-enterprise-team) — including the permission model.
5. [Generate an AI policy](https://academy.claude.com/use-cases/generate-an-ai-policy) — a usable first draft.
6. [AI Fluency: Framework & Foundations](https://academy.claude.com/courses/ai-fluency-framework-foundations) — take it so you can run the internal training yourself instead of buying it.

Around 6 hours, most of it tutorials rather than courses. Pair it with [building a business case](/articles/building-a-business-case-for-claude) and [getting IT approval](/articles/getting-it-approval-for-claude), neither of which appears anywhere in the catalog.

## Track: developer

1. [Claude Platform 101](https://academy.claude.com/courses/claude-platform-101) — 1.5 hr, Console orientation and correct first requests.
2. [Building with the Claude API](https://academy.claude.com/courses/building-with-the-claude-api) — 9 hr, the main event.
3. [Introduction to agent skills](https://academy.claude.com/courses/introduction-to-agent-skills) — 1 hr. Skills went GA on the API on August 19, 2026.
4. [Introduction to Model Context Protocol](https://academy.claude.com/courses/introduction-to-model-context-protocol) — 1 hr. Build a server rather than copying a template you do not understand.
5. [Introduction to subagents](https://academy.claude.com/courses/introduction-to-subagents) — 45 min.
6. [Claude Code in Action](https://academy.claude.com/courses/claude-code-in-action) — 1 hr, because you will spend more hours here than in the API this year.

About 14 hours. The courses stop at "it works" — rate-limit behaviour under load, error taxonomies, and [eval suites that catch regressions](/articles/auditing-your-eval-suite) are not covered.

## Track: you just use Claude at work

1. [Getting good at Claude: a research-backed curriculum](https://academy.claude.com/tutorials/getting-good-at-claude-a-research-backed-curriculum) — read first, it is short.
2. [Claude 101](https://academy.claude.com/courses/claude-101) — 2.5 hr.
3. [AI Fluency: Framework & Foundations](https://academy.claude.com/courses/ai-fluency-framework-foundations) — 4 hr.
4. [AI Capabilities and Limitations](https://academy.claude.com/courses/ai-capabilities-and-limitations) — 3.5 hr.
5. [Can you trust what AI tells you](https://academy.claude.com/tutorials/can-you-trust-what-ai-tells-you) — 7 min.
6. [Introduction to Claude Cowork](https://academy.claude.com/courses/introduction-to-claude-cowork) — 2.5 hr, when you are ready to hand over whole tasks rather than single questions.

About 13 hours spread over a few weeks. Pair it with [your first week with Claude](/articles/first-week-with-claude).

## What to skip

**The vertical connector tutorials**, unless you work in that vertical. There are roughly 30 of them — Benchling, PubMed, FactSet, Morningstar, ChEMBL, ICD-10, 10x Genomics. Excellent if you are in life sciences or finance. Noise otherwise.

**Duplicate AI Fluency variants.** Take one. The 4D framework is the same in all nine.

**Bedrock or Vertex if you deploy on neither.** They are 8-hour reproductions of the base API course with different plumbing. Taking two of the three is eight wasted hours.

**Use cases for departments you are not in.** They are ten minutes each and there are 148 of them. That is 24 hours if you complete the set, and the marginal value after the first five in your own department is close to zero.

## The realistic time budget

| You are | Hours | Over |
|---|---|---|
| Using Claude at work | 13 | 3–4 weeks |
| Running AI for a company | 11 | 2–3 weeks |
| IT / admin | 6 | 1–2 weeks |
| Developer | 14 | 3–4 weeks |
| FDE | 13 | 3–4 weeks |

Nobody completes 355 resources. Pick a track, finish it, and stop.

## Then what

A course teaches capability. It does not produce the habit, and it does not touch the organisation the capability lands in. Once you have the product training, the remaining work is operational: what breaks, what it costs, who has to approve it, and what you do when the model underneath your system gets retired.

That is the split we maintain — see the [full course map](/academy) for the side-by-side, and [what Claude Academy doesn't teach you](/articles/what-claude-academy-doesnt-teach) for the specifics.`,
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'what-claude-academy-doesnt-teach',
    angle: 'absence',
    title: "What Claude Academy doesn't teach you",
    excerpt:
      'Anthropic\'s 355 free resources are the best product training in the industry. There are still nine things a vendor course structurally cannot cover, and they are the things that consume an AI deployment: vendor choice, failure modes, budget fights, deprecations, and the career itself.',
    readTime: 12,
    cluster: 'Business Strategy & ROI',
    termSlug: 'ai-adoption',
    body: `[Claude Academy](https://academy.claude.com) launched on August 20, 2026 with 355 free courses, tutorials, and use cases. It is genuinely good, it costs nothing, and if you use Claude for work you should [go take it](/academy).

This is about the shape of what is left.

None of what follows is a complaint. Every gap here exists for a structural reason — a vendor cannot write it, or has no reason to, or would have to say something against interest to do it honestly. Knowing where the gaps are is more useful than pretending they are not there.

## 1. When to use something else

Every one of the 22 courses assumes the answer is Claude. That is correct for a Claude course. It is not correct for you.

There are real cases where Claude is the wrong pick: a high-volume classification job where a small open model at a fraction of the cost is indistinguishable in quality; a workflow already sitting inside Microsoft 365 where Copilot's integration beats a better model reached through a connector; a task where you need image generation, which Claude does not do.

Nobody at Anthropic is going to write the page that says *use the other one here*. See [the AI platform landscape](/articles/ai-platform-landscape-2026) and [when not to use Claude](/articles/when-not-to-use-claude) for the honest version.

## 2. What breaks in month six

Courses teach the path that works. That is the correct thing for a course to do — you cannot learn a product by studying its failures.

But the deployment failures are patterned and predictable, and they arrive on a schedule:

- **Month 2** — the pilot team loves it, nobody else has logged in.
- **Month 4** — someone built 40 Skills and 34 of them have never fired. The [Cowork skills graveyard](/articles/cowork-skills-graveyard) is now a real maintenance burden.
- **Month 6** — [adoption plateaus](/articles/claude-adoption-plateau) around 30% weekly active, and the standard advice has stopped working.
- **Month 8** — an agent that worked for five months starts producing subtly wrong output and [nobody can tell you why](/articles/when-agents-break).

None of this is in the catalog, and it is where most of the work is.

## 3. The budget conversation

There is no course on getting money. There is no tutorial on what to do when your security team has already said no once. There is no lesson on the renewal conversation in month eleven, when finance wants to know what the last twelve months bought.

These are the conversations that determine whether the deployment survives, and they are entirely absent — reasonably so, because a vendor writing "here is how to argue with your CFO about our invoice" is a strange artifact.

We cover them in [building a business case](/articles/building-a-business-case-for-claude), [getting IT approval](/articles/getting-it-approval-for-claude), and [reporting ROI](/articles/agent-operator-roi-reporting).

## 4. What it actually costs at your volume

Pricing pages are accurate. They are not the same as cost.

The gap between list price and your bill is made of things the courses do not model: cache hit rates that collapse when you change one line of a system prompt, agents that retry silently, [cold-start context](/articles/ai-agent-cold-start-caching) reloaded on every session, [effort settings](https://academy.claude.com/tutorials/choosing-the-right-effort-level-in-claude-code) left on high by default across a team of forty.

Anthropic ships good primitives here — session budgets, spend alerts, the [analytics and cost controls](/articles/claude-enterprise-cost-controls) — and does not teach you where the money goes. See [agent cost control](/articles/agent-operator-cost-control) and [session economics](/articles/claude-session-economics).

## 5. Surviving a deprecation

Anthropic announces model retirements. Claude Opus 4.1 was retired on August 5, 2026 and requests to it now return an error rather than falling back.

That announcement is not the same as help. If you built a system on a model, tuned prompts against its specific behaviour, and calibrated an eval suite to its outputs, a retirement is a migration project with a deadline someone else set. In 2026 alone, Sonnet 4 and Opus 4 retired in June, Opus 4.1 in August, and Fable 5 and Mythos 5 were suspended worldwide for nineteen days in June by government order.

There is no course on this because a course on this would be a course on the risk of building on the vendor. See [when your AI model disappears](/articles/when-your-ai-model-disappears) and [migration](/articles/migrating-to-claude-4-7).

## 6. The organisation the software lands in

The catalog's 148 use cases teach an individual how to do a task. Almost every real deployment problem is between people.

The warehouse team routes around the agent because they do not trust it. Legal wants a review of something no one has written down yet. A senior engineer is quietly telling juniors not to use it. A VP asked for a demo and now believes the demo is the product. Somebody has to run the [change management](/articles/agent-change-management), and it is you, without authority, on top of your actual job.

The closest the catalog comes is a tutorial on [writing an AI diligence statement](https://academy.claude.com/tutorials/writing-an-ai-diligence-statement) — useful, and about disclosure ethics rather than organisational friction.

## 7. Evals you can defend

Evals appear in [Building with the Claude API](https://academy.claude.com/courses/building-with-the-claude-api). What is missing is the harder half: building a test set that reflects real usage rather than the twelve cases you thought of on a Tuesday, deciding what score is good enough to ship, and [auditing the eval suite itself](/articles/auditing-your-eval-suite) when it starts passing things it should catch.

This is the most-tested skill in Agent Manager interviews and the one most operators skip. Start at [how to evaluate your agents](/articles/how-to-evaluate-your-agents).

## 8. The record of what everyone else shipped

Academy covers Anthropic. That is its remit.

But a decision made in August 2026 depends on more than what Anthropic shipped — on GPT-5.6 landing in July, Gemini 3.5 Flash opening the 3.5 family in June, xAI acquiring Cursor in May, and Meta entering the cloud market in July. Vendor training will never chronicle a competitor's roadmap.

We keep [a dated timeline](/timeline) of every significant release from Anthropic, OpenAI, Google, Meta, and Microsoft going back to 2022, currently at 130 events.

## 9. The job

There are [four Claude certifications](/articles/claude-certifications-guide) and no career guidance.

Nothing tells you what a [Forward Deployed Engineer](/articles/what-is-a-forward-deployed-engineer) is hired to do, what an [AI Agent Manager](/articles/what-is-an-agent-operator) is accountable for, [what those roles pay](/articles/agent-operator-job-market-2026), or [what to build](/articles/fde-portfolio-projects) so a hiring manager believes you can do the work. A certificate is not evidence. A system you shipped is.

Aaron Levie's estimate is that 500,000 to 1 million companies will hire someone to run AI internally. Anthropic sells to those companies. It does not staff them.

## The pattern

Read the nine back to back and the shape is obvious. A vendor course teaches **capability**. Everything above is **consequence** — what happens when the capability meets a budget, a skeptic, a deadline, a retirement notice, and a competitor's product.

Anthropic's own stated philosophy for Academy is *mindsets over features*, and they are right that mindsets outlast features. The mindset still has to survive a Tuesday in month six when the agent is wrong, the CFO has questions, and the model you built on is scheduled for retirement.

That is the part we write.

**Where to start:** the [Claude Academy course map](/academy), then whichever role track applies to you — [AI Agent Manager](/learn/agent-manager), [Forward Deployed Engineer](/learn/forward-deployed-engineer), or [IT / admin](/learn/claude-for-admins).`,
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'claude-certifications-guide',
    angle: 'role',
    title: 'The four Claude certifications — and the prerequisite that blocks most people',
    excerpt:
      'Anthropic runs four proctored Claude certifications through Pearson VUE, from $99 to $175, 120 minutes each. There is a registration requirement almost nobody mentions up front: you need a work email at an organisation in the Claude Partner Network. Here is what each exam covers, who can sit it, and whether it is worth the prep time.',
    readTime: 10,
    cluster: 'Business Strategy & ROI',
    termSlug: 'anthropic-partner-program',
    body: `There are two separate things with similar names, and confusing them wastes a lot of time.

**[Claude Academy](https://academy.claude.com)** is free, open to anyone with an email address, self-paced, and issues completion badges. Anyone can use it today. We [mapped the catalog here](/academy).

**The Claude Certification Program** is a set of proctored exams delivered through Pearson VUE, costing $99 to $175 per attempt, and gated behind a registration requirement most write-ups mention late or not at all.

This article is about the second one.

## The four exams

As of August 2026 there are four live exams across three roles:

| Exam | Price per attempt | Role |
|---|---|---|
| Claude Certified Associate — Foundations | $99 | Non-technical / business |
| Claude Certified Developer — Foundations | $125 | Building on the API |
| Claude Certified Architect — Foundations | $125 | Designing deployments |
| Claude Certified Architect — Professional | $175 | Senior deployment design |

Common format across all four:

- **120 minutes**
- Multiple-choice and multiple-response, with each item stating how many answers to select
- Scaled score from **100 to 1,000**, pass at **720**
- Delivered by Pearson VUE, online-proctored (OnVUE) or at a test centre
- Valid for **12 months**, with a free on-time renewal

The program began with Claude Certified Architect: Foundations in March 2026 and expanded to four exams by July, when delivery moved to Pearson VUE. Anthropic reported more than 36,000 certified consultants across 1,300+ organisations by late July 2026.

## The prerequisite

Registration requires a work email address on a domain belonging to an organisation in the [Claude Partner Network](https://www.anthropic.com/partners). Personal addresses are rejected. Anthropic's own certification FAQ states that certification is available to people at Partner Network organisations.

In practice this means:

- **Independent developers, freelancers, and job seekers cannot sit these exams** on their own.
- **Students cannot sit them.**
- If you work at a consultancy, system integrator, or agency, check whether your employer is already in the network — many are, and you may already be eligible without knowing.
- Joining the network is free, so the realistic path for most people is asking their employer (or a client) to apply.

This is the single most important fact about the program and it is the one most commonly buried. If you are between jobs and hoping a certification will help you get hired, this is a closed door until you are inside a partner organisation.

## What each exam is for

**Associate — Foundations ($99).** Product knowledge and AI fluency for people who deploy Claude for customers in non-engineering roles: solution consultants, project managers, enablement, pre-sales. If your company is in the Partner Network and you are customer-facing but not writing code, this is the one.

**Developer — Foundations ($125).** Building on the Claude API. Prompting, tool use, retrieval, agents, MCP, and production patterns — largely the ground covered by [Building with the Claude API](https://academy.claude.com/courses/building-with-the-claude-api), which is free and 67 lessons long.

**Architect — Foundations ($125).** Designing a Claude deployment rather than coding one: model selection, cost and latency tradeoffs, security posture, integration architecture, rollout shape. Closest to the [Forward Deployed Engineer](/articles/what-is-a-forward-deployed-engineer) and [AI Agent Manager](/articles/what-is-an-agent-operator) roles.

**Architect — Professional ($175).** The senior version. Multi-system deployments, governance, scale.

## How to prepare, for free

Every exam maps onto material Anthropic already publishes at no cost. There is no reason to buy a third-party prep course, and the market is now full of sites selling one.

**For Developer — Foundations:**
- [Claude Platform 101](https://academy.claude.com/courses/claude-platform-101) — 1.5 hr
- [Building with the Claude API](https://academy.claude.com/courses/building-with-the-claude-api) — 9 hr
- [Introduction to Model Context Protocol](https://academy.claude.com/courses/introduction-to-model-context-protocol) — 1 hr
- [Introduction to agent skills](https://academy.claude.com/courses/introduction-to-agent-skills) — 1 hr

**For Architect — Foundations:**
- [Claude Enterprise Administrator Guide](https://academy.claude.com/tutorials/claude-enterprise-administrator-guide)
- [Getting started with Claude security](https://academy.claude.com/tutorials/getting-started-with-claude-security)
- [Choosing the right Claude model](https://academy.claude.com/tutorials/choosing-the-right-claude-model)
- [Building with the Claude API](https://academy.claude.com/courses/building-with-the-claude-api) — for the parts you will be architecting around

**For Associate — Foundations:**
- [Claude 101](https://academy.claude.com/courses/claude-101) — 2.5 hr
- [AI Fluency: Framework & Foundations](https://academy.claude.com/courses/ai-fluency-framework-foundations) — 4 hr
- [AI Capabilities and Limitations](https://academy.claude.com/courses/ai-capabilities-and-limitations) — 3.5 hr

Budget 10 to 15 hours of study for Associate, 15 to 20 for Developer or Architect Foundations.

## Is it worth it

Three honest cases.

**Yes, if your employer is a partner and pays.** A $125 exam your company covers, that maps onto free training you should take anyway, that renews free for twelve months, is not a decision that needs agonising over. Partner organisations frequently need certified headcount to maintain tier status, which means your certification has value to your employer independent of its value to you.

**Probably, if you are customer-facing at a consultancy.** In a pitch or a procurement review, "our team holds twelve Claude Certified Architect credentials" is a real signal to a buyer. It is the same logic as AWS and Salesforce certifications, and it works for the same reason.

**No, if you are trying to get hired.** Two problems. First, you likely cannot sit the exam — the Partner Network requirement excludes you. Second, even if you could, hiring managers for [FDE and Agent Manager roles](/articles/agent-operator-job-market-2026) are not screening on certifications. They screen on systems you have shipped. A working agent with an eval suite and a cost model beats a credential every time.

If you are in that third case, spend the fifteen hours on [portfolio projects](/articles/fde-portfolio-projects) instead. The free Academy courses give you the same knowledge with none of the gate.

## What a certification does not tell an employer

It tests product knowledge under exam conditions. It does not test whether you can scope an engagement, notice that a client's data is worse than they claimed, [tell whether an agent is actually reliable](/articles/how-to-evaluate-your-agents), or [diagnose one that has quietly started producing wrong output](/articles/when-agents-break).

Those are the things the job is made of, and no proctored multiple-choice exam reaches them. That is not a criticism of the exam — it is what exams are.

**Related:** [the Claude Academy course map](/academy) · [what Claude Academy doesn't teach you](/articles/what-claude-academy-doesnt-teach) · [the FDE career path](/learn/forward-deployed-engineer)

*Exam prices, format, and eligibility above reflect Anthropic's July 2026 partner communications as reported publicly. Confirm current terms with the Claude Partner Network before registering.*`,
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'computer-use-browser-use-ga',
    angle: 'update',
    title: 'Computer use goes GA, and a new browser tool ships alongside it',
    excerpt:
      'On August 19, 2026, Anthropic moved computer use to general availability as computer_toolset_20260801 and launched browser use as a separate client toolset. The Skills API and Files API went GA the same day. Here is what changed in the request shape, when to pick browser over computer, and what to check before you migrate.',
    readTime: 11,
    cluster: 'Claude API',
    termSlug: 'computer-use',
    body: `On August 19, 2026, four things went generally available on the Claude API at once: the computer use tool, a new browser use tool, Agent Skills and the Skills API, and the Files API. All four drop their beta headers.

This is the largest single change to agent tooling since Managed Agents launched, and it changes the request shape for anyone already running computer use in beta.

## Computer use: what changed

Computer use is now \`computer_toolset_20260801\`. No beta header required.

Three substantive changes beyond the GA label:

**Batch actions.** A turn can now carry several actions instead of one. Previously a click, a type, and a screenshot were three round trips through the model. Now they are one. For any multi-step interaction this is the difference between a workflow that feels usable and one that does not.

**Zoom on by default.** Previously opt-in. The model can inspect a region of the screen at higher resolution without you configuring it.

**Per-member configuration through \`configs\`.** Individual tools inside the toolset can be configured separately rather than the toolset being all-or-nothing.

Supported models: Claude Fable 5, Claude Mythos 5, [Claude Opus 5](/articles/claude-opus-5), [Claude Sonnet 5](/articles/claude-sonnet-5), and Claude Opus 4.8.

### The migration is not a header removal

If you are on \`computer_20251124\`, upgrading changes both the request shape and how you handle tool results. Anthropic publishes a [migration guide](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool#migrate-from-computer-20251124), and the earlier beta versions still work, so there is no forced deadline.

The thing to check before you migrate: **your tool-result handling loop.** Batch actions mean a single tool use block can now produce multiple results. Code written against the one-action-one-result assumption will silently drop results rather than error, which is the worst failure mode available. Test that path explicitly.

## Browser use: the new one

\`browser_toolset_20260801\` is a **client toolset** — the browser runs in your application, not on Anthropic's infrastructure. You host it, you drive it.

The difference from computer use is the level it operates at. Computer use looks at a screenshot of an entire desktop and clicks coordinates. Browser use works inside a browser viewport and **reads the page itself**: the accessibility tree, elements, forms, tabs.

That gives it capabilities screenshot-and-click cannot have:

- **Element references** — target an element by reference rather than by pixel coordinate
- **Form input** — set a field's value directly instead of clicking and typing
- **Tab management** — open, switch, and close tabs as first-class actions
- **Download reporting** — know that a download started and what it was
- **Opt-in file upload**

### When to pick which

| | Computer use | Browser use |
|---|---|---|
| Scope | Whole desktop | One browser viewport |
| How it sees | Screenshots | Accessibility tree + screenshots |
| Targeting | Pixel coordinates | Element references |
| Hosting | Your VM/container | Your application's browser |
| Best for | Desktop apps, OS-level work, anything not a web page | Web apps, forms, scraping, multi-tab flows |

The practical rule: **if the work happens entirely in a web page, use browser use.** It is more reliable, because an element reference does not break when a layout shifts by four pixels and a coordinate does. Reach for computer use when you need the desktop — a native application, a file manager, an installer.

Most agent work people describe as "computer use" is actually browser work, and has been badly served by pixel-coordinate targeting the whole time.

## Skills API GA

[Agent Skills](/articles/skills-setup-guide) and the Skills API (\`/v1/skills\`) are generally available. No more \`skills-2025-10-02\` beta header, including on Messages API requests that load Skills through the \`container\` parameter. Requests still sending the header keep working unchanged.

A Skill is a packaged set of instructions — a markdown file plus optional supporting files — that Claude applies automatically when a task matches. This is the mechanism most teams should be using to encode company-specific procedure, and GA means it is now safe to build a dependency on it. See [building AI Skills for your team](/articles/building-ai-skills-for-your-team) for the organisational side, and be honest with yourself about the [skills graveyard problem](/articles/cowork-skills-graveyard) before you write forty of them.

Related, from August 7: Managed Agents sessions can now [load Skills directly from a GitHub repository](https://platform.claude.com/docs/en/managed-agents/skills#load-skills-from-a-github-repository). When a session mounts a repo, anything in its root \`.claude/skills\` directory is discovered at session start. That closes the loop between where Skills are versioned and where they run.

## Files API GA

The Files API is GA. \`/v1/files\` endpoints and Messages API requests referencing an uploaded file no longer need \`files-api-2025-04-14\`.

Two changes arrive with the GA response format, and both matter operationally:

**File expiration.** Set \`expires_in_seconds\` at upload; file objects report \`expires_at\`. If you have been uploading files and never cleaning them up — which is most people — this is the mechanism that stops your file store growing without bound. Set it at upload rather than building a reaper job.

**Pagination and filtering.** Listing files now supports \`page\` and \`next_page\`, plus an \`ids[]\` filter.

Requests that still send the beta header keep the previous response format. That is a compatibility guarantee and also a trap: if half your codebase sends the header and half does not, you are parsing two response shapes. Pick one and migrate the whole surface.

## What to do this week

1. **Do not rush the computer use migration.** Beta versions still work. Migrate deliberately, and test batch-action result handling before you ship.
2. **Evaluate browser use for anything web-based** you currently do with computer use. Element references over pixel coordinates is a reliability upgrade, not a lateral move.
3. **Drop the Skills and Files beta headers** in one pass rather than incrementally, so you are not handling two response formats.
4. **Set \`expires_in_seconds\` on every file upload** from now on.
5. **Re-run your eval suite** after each of the above. GA transitions change response shapes, and [a suite that has not been audited](/articles/auditing-your-eval-suite) will not catch a shape change — it will just start passing things it should not.

## The wider picture

Four GA transitions in one day is a platform saying its agent surface has stopped moving. Computer use has been in beta since October 2024. Skills since October 2025. The Files API since April 2025.

For anyone building production agents, the useful signal is not the features — it is the stability commitment. You can now build on these without a beta header telling you the shape might change. That is the precondition for the kind of system a [Forward Deployed Engineer](/articles/what-is-a-forward-deployed-engineer) can hand to a client and walk away from.

**Related:** [MCP in production agents](/articles/mcp-production-agents) · [Managed Agents](/articles/claude-managed-agents) · [monitoring your Claude app](/articles/monitoring-your-claude-app)`,
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'claude-code-august-2026-updates',
    angle: 'update',
    title: 'Claude Code in August 2026: auto mode by default, and what that means for your team',
    excerpt:
      'On August 14, 2026, auto mode became the default for new Claude Code sessions on Pro, Max, and Team plans — an AI classifier now approves safe commands instead of prompting you for each one. Enterprise and API remain opt-in. Here is what changed, the admin settings to know about, and the case for turning it off in specific places.',
    readTime: 9,
    cluster: 'Claude Code',
    termSlug: 'claude-code',
    body: `Auto mode became the default for new Claude Code sessions on Pro, Max, and Team plans on August 14, 2026. Before that it was opt-in.

If you manage a team on Claude Code, this changed the default security posture of everyone's terminal, and it is worth understanding precisely rather than approximately.

## What auto mode is

Auto mode is a permission system. Rather than prompting you before every action Claude wants to take, an AI classifier evaluates each command and automatically approves the ones it judges safe, while still blocking ones it judges dangerous.

The intent is obvious to anyone who has used Claude Code for a long session: the prompt fatigue is real, and a developer who has approved four hundred consecutive \`ls\` commands is not meaningfully reviewing the four hundred and first.

## What changed, exactly

**Default now:** Pro, Max, and Team plans. New sessions run in auto mode.

**Still opt-in:** Claude Enterprise, the Claude API, Claude Platform on AWS, Amazon Bedrock, Google Cloud's Agent Platform, and Microsoft Foundry.

That split is the interesting part. Anthropic changed the default for individual and small-team plans, and left it unchanged for every enterprise and cloud-marketplace surface. Read that as an explicit judgement: auto mode is right for a developer working on their own repository, and not something to impose on an organisation that has a security review process.

If you previously set a different default, you may get a one-time prompt asking whether to switch. Pinned defaults are not changed.

## Turning it off

**Per session:** \`Shift+Tab\` in the CLI cycles modes, or use the mode dropdown in the desktop app.

**Org-wide, as an admin:** managed settings expose two controls.

- \`defaultMode\` — set the mode new sessions start in
- \`disableAutoMode\` — remove auto mode as an option entirely

The second is the one to reach for if you have a compliance answer that depends on a human approving each action. \`defaultMode\` is a default; a developer can still switch. \`disableAutoMode\` is a policy.

## Anthropic's own caveat

From the announcement: it relies on classification systems and therefore does not eliminate risk. Anthropic recommends manual review for high-stakes production infrastructure changes.

That is an accurate framing and worth taking literally. A classifier is a model making a judgement, and models are wrong sometimes. The question is not whether auto mode is safe in general — it is whether it is safe on the specific machine, with the specific credentials, in the specific repository.

## Where to turn it off, specifically

Rather than an org-wide on or off, the useful decision is per-context:

**Leave auto mode on** for local development repositories, personal projects, scratch work, anything where the worst case is a bad commit on a branch, and any long refactor where prompt fatigue would otherwise make you approve without reading.

**Turn auto mode off** on any machine with production credentials in the environment, in infrastructure-as-code repositories where an apply is one command away, wherever the CLI has access to a live database, and in shared or CI environments where the blast radius is not one person's afternoon.

The failure mode to avoid is a developer who has auto mode on in their normal repo, switches to the infra repo, and does not notice the mode carried over. If your organisation has an infra repo, \`disableAutoMode\` scoped to those machines is a cheaper control than remembering.

## The rest of the month

Two other Claude Code changes landed in August 2026.

**Self-hosted environments (August 6, public beta).** Claude Code sessions can run in an environment you host rather than Anthropic's. For organisations that could not adopt cloud-run sessions for data-residency reasons, this is the unblock. It pairs with the [self-hosted sandboxes for Managed Agents](/articles/claude-managed-agents-self-hosted) that shipped in June.

**Workbench became Playground (August 18).** In the Claude Console, Workbench is now [Playground](https://platform.claude.com/playground). It supports every Messages API parameter, ships templates demonstrating code execution and web search, and shows the full SDK request alongside the API response for each run. The old Workbench and prompt tools APIs retired on August 17, so if you had automation calling those, it has already broken.

## What to do

1. **Check which mode your team is actually in.** The default changed underneath them; most people will not have noticed.
2. **Decide your infra-repo policy** and enforce it with \`disableAutoMode\` rather than a reminder in a Slack channel.
3. **If you are on Enterprise, nothing changed** — but decide deliberately whether to opt in rather than leaving it unexamined.
4. **Re-read your [Claude Code antipatterns](/articles/claude-code-antipatterns).** Several of them get more likely, not less, when the approval prompts stop.

**Related:** [Claude Code for your team](/articles/claude-code-for-your-team) · [June 2026 updates](/articles/claude-code-june-2026-updates) · [May 2026 updates](/articles/claude-code-may-2026-updates) · Anthropic's [effort level guide](https://academy.claude.com/tutorials/choosing-the-right-effort-level-in-claude-code)`,
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'managed-agents-budgets-guardrails',
    angle: 'update',
    title: 'Managed Agents got budgets, an advisor, and geo pinning — the guardrails arrived',
    excerpt:
      'Between August 7 and August 19, 2026, Anthropic shipped a hard spend cap per Managed Agents session, an advisor model the primary thread can consult mid-turn, inference geo pinning, GitHub-loaded Skills, memory stores in self-hosted sandboxes, and a rebuilt session viewer. Taken together, this is the month Managed Agents became something you can put a budget behind.',
    readTime: 10,
    cluster: 'Claude API',
    termSlug: 'managed-agents',
    body: `[Managed Agents](/articles/claude-managed-agents) launched in April 2026 as a way to run Claude as an autonomous worker with a sandbox and built-in tools. The capability was there from the start. The controls were not.

Between August 7 and August 19, 2026, the controls arrived. Six changes, and the theme running through all of them is *bounding an autonomous system you are not watching*.

## Session budgets — the one that matters most

You can now set a hard cap on a session's spend, priced at public list rates.

A session that reaches its budget **pauses** with the \`budget_reached\` stop reason rather than starting new model requests. Changing or removing the budget resumes it. Deployments accept the same budget setting and apply it to every session they start.

This closes the single scariest gap in autonomous agents. Before this, an agent in a retry loop or working on a task harder than you estimated could spend an unbounded amount of money while nobody was looking. The honest answer to "what is the worst case on this agent's bill" was "I do not know."

Now it is a number you set.

Two things to get right:

**Pause, not kill.** \`budget_reached\` is recoverable. The session is not destroyed — raise the budget and it continues. That means a budget can be a checkpoint rather than a guillotine: set it deliberately low on a new agent, let it pause, look at what it did with the money, then decide.

**Deployment-level budgets apply per session, not in aggregate.** A deployment with a $5 budget running two hundred sessions can spend $1,000. If you need an aggregate ceiling, that is still a monitoring problem, not a budget-setting one. See [agent cost control](/articles/agent-operator-cost-control) and the [Enterprise cost controls](/articles/claude-enterprise-cost-controls) that shipped in July.

## The advisor, inside a session

A Managed Agents session can now be given an **advisor**: a model at least as capable as the agent's own, which the session's primary thread can consult mid-turn for strategic guidance.

Configure it as a \`{"type": "advisor"}\` entry in the agent's multiagent roster, naming the model to consult.

This is the [advisor strategy](/articles/claude-advisor-tool) Anthropic published in April, now available inside the managed harness. The original result: pairing a fast executor with a stronger advisor consulted only on hard decisions improved SWE-bench Multilingual by 2.7 percentage points while cutting per-task cost by 11.9%. Cheaper *and* better, because most steps in a long task are easy and do not need the expensive model.

If you are running Sonnet 5 agents on long tasks and have not tried an Opus 5 advisor, that is the highest-value experiment available to you this month.

## Inference geo pinning

You can now control where model inference runs for a Managed Agents agent. Set \`inference_geo\` inside the \`model\` object when creating the agent, or override it for a single session.

For anyone who has been told by legal that inference cannot leave a jurisdiction, this is the thing that was blocking you. Pricing varies by geo — check [the data residency page](https://platform.claude.com/docs/en/manage-claude/data-residency) before you assume it is free.

## Skills from a GitHub repository

When a session mounts a GitHub repository, any Skills in its root \`.claude/skills\` directory are discovered automatically at session start and available for that session.

The significance is versioning. Before this, Skills lived somewhere separate from the code they operated on, which meant they drifted. Now the Skill that knows how to work on a repository can live *in* that repository, reviewed in the same pull request as the code it describes.

If you maintain Skills for more than one project, move them into the repos. It is the difference between a Skill library and a [Skill graveyard](/articles/cowork-skills-graveyard).

## Memory stores in self-hosted sandboxes

Sessions running in a [self-hosted sandbox](/articles/claude-managed-agents-self-hosted) can now attach [memory stores](/articles/claude-managed-agents-memory). The Python, TypeScript, and Go SDK workers download each attached store into the sandbox at its \`mount_path\` and sync the agent's changes back.

Before this, self-hosting meant giving up persistent memory — the two features were mutually exclusive. Organisations that self-host for data-residency reasons were running stateless agents as a consequence. That constraint is gone.

## A session viewer you can debug with

The Claude Console session viewer was rebuilt: a timeline minimap, a transcript grouped by model request, and an Inspector panel carrying session details and cost, raw events, per-tool statistics, mounted resources, and per-thread activity.

Per-tool statistics is the line to notice. When [an agent breaks](/articles/when-agents-break), the most common cause is a tool that is failing silently — returning empty rather than erroring, so the model carries on with nothing. A per-tool call and failure count is how you find that in two minutes instead of two hours.

## Also: Sonnet 5 pricing stopped going up

Unrelated to Managed Agents but relevant to anyone budgeting against them. On August 10, 2026, Anthropic made [Claude Sonnet 5](/articles/claude-sonnet-5)'s introductory pricing permanent: **$2 / $10 per million tokens**. The increase to $3 / $15 scheduled for September 1, 2026 will not happen.

If you built a cost model that assumed a 50% increase in September, take it out. That is a material change to agent economics — Sonnet 5 is the model most agent fleets run on, and a fleet sized against $3/$15 has just gained a third of its headroom back.

## What this month adds up to

Managed Agents in April was a capability demonstration. Managed Agents in August is a product an operations person can be accountable for:

| Question | Answer as of August 2026 |
|---|---|
| What is the worst case on the bill? | The budget you set |
| Can I make it smarter without making it expensive? | Advisor on the roster |
| Where does inference run? | Wherever you pin it |
| Where do the Skills live? | In the repo, versioned with the code |
| Can I self-host and keep memory? | Yes, since August 19 |
| Why did it fail? | Per-tool statistics in the Inspector |

Every one of those is a question a CFO, a lawyer, or an on-call engineer asks — and until this month, several had no good answer.

**Related:** [Managed Agents](/articles/claude-managed-agents) · [multi-agent orchestration](/articles/claude-managed-agents-multiagent) · [self-hosted sandboxes](/articles/claude-managed-agents-self-hosted) · [how to evaluate your agents](/articles/how-to-evaluate-your-agents) · Anthropic's [Managed Agents explainer](https://academy.claude.com/tutorials/what-is-claude-managed-agents)`,
  },
]

async function seed() {
  console.log('Seeding Batch 93 — Claude Academy positioning + August 2026 shipping...\n')

  for (const a of articles) {
    const term = await getTermId(a.termSlug)
    if (!term) {
      console.error(`  ✗ Term not found: ${a.termSlug}`)
      continue
    }

    const payload = {
      slug:      a.slug,
      angle:     a.angle,
      title:     a.title,
      excerpt:   a.excerpt,
      body:      a.body,
      read_time: a.readTime,
      cluster:   a.cluster,
      term_id:   term.id,
      term_name: term.name,
      term_slug: a.termSlug,
      published: true,
    }

    const { error } = await sb.from('articles').upsert(payload, { onConflict: 'slug' })

    if (error) {
      console.error(`  ✗ ${a.slug}: ${error.message}`)
    } else {
      console.log(`  ✓ ${a.slug}`)
    }
  }

  console.log('\nDone.')
}

seed().catch(console.error)
