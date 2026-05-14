/**
 * Agent Operator — 8 articles targeting the "Agent Operator" content track.
 *
 * Persona: Priti Kapoor — IT/Systems Manager at a 380-person logistics company.
 * Handed AI responsibility by her CEO 6 months ago. Figuring it out alone.
 * Can do SQL, Zapier, API config, Salesforce/Slack admin. Can't write Python.
 *
 * 1. what-is-an-agent-operator
 *    Definitional anchor. Aaron Levie's 500K–1M prediction. What the role
 *    actually is, how it differs from IT admin / developer / PM.
 *    Cluster: Business Strategy & ROI. Angle: def.
 *
 * 2. agent-operator-first-90-days
 *    The 90-day build-validate-stabilize playbook. One team, one workflow, one agent.
 *    Cluster: Business Strategy & ROI. Angle: process.
 *
 * 3. how-to-evaluate-your-agents
 *    Evaluation without code. Spreadsheet-based test sets, weekly scoring runs,
 *    freshness checks. The thing most Agent Operators never do.
 *    Cluster: Evaluation & Safety. Angle: process.
 *
 * 4. when-agents-break
 *    Five failure modes with diagnostics and fixes. The 45-minute debugging workflow.
 *    Cluster: Evaluation & Safety. Angle: failure.
 *
 * 5. wiring-internal-systems-to-agents
 *    Four levels of integration from paste to MCP server. Most AOs only need Level 2–3.
 *    Cluster: Infrastructure & Deployment. Angle: process.
 *
 * 6. agent-change-management
 *    Getting teams to actually use the agent. Three resistance types, each with a fix.
 *    Cluster: Business Strategy & ROI. Angle: failure.
 *
 * 7. agent-operator-cost-control
 *    Keeping the Claude bill under control as you scale. Cost per task as the metric.
 *    Cluster: Infrastructure & Deployment. Angle: process.
 *
 * 8. agent-operator-roi-reporting
 *    Showing ROI to your CEO. Three types of evidence that work. The monthly update format.
 *    Cluster: Business Strategy & ROI. Angle: role.
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-agent-operator.ts
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
  // ─────────────────────────────────────────────────────────────────────────
  // Article 1: what-is-an-agent-operator
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: 'what-is-an-agent-operator',
    angle: 'def',
    title: 'What is an Agent Operator — the role Aaron Levie says 500,000 companies are about to hire for',
    excerpt: "Aaron Levie says 500,000 to 1 million companies will hire for this role. Most won't call it 'Agent Operator.' Some will call it an AI program manager, an automation lead, an AI systems admin. Whatever the title, the job is the same: you are responsible for making AI agents actually work inside your company.",
    readTime: 9,
    cluster: 'Business Strategy & ROI',
    audience: ['operator'],
    termSlug: 'ai-agent',
    body: `In May 2026, Aaron Levie — CEO of Box, someone who has tracked enterprise software for two decades — posted a prediction that most people in tech dismissed as hype and most people inside companies quietly recognized as already true: between 500,000 and 1 million "Agent Operator" roles will exist in the near future. He published a specific job spec. Not a vague "AI skills required" paragraph — an actual eight-part description of what this person does every day.

The jobs are already appearing. They just don't have consistent names yet.

At some companies it's an AI Program Manager. At others it's an Automation Lead, an AI Systems Administrator, a Digital Transformation Specialist, or just "the person who handles the AI stuff." The titles vary. The job is the same. And millions of people are already doing it, usually without having been hired for it, often without being paid for it, and almost never with adequate support.

This is the article that explains what this role actually is — and whether you're already in it.

---

## The definition

An Agent Operator is the internal person responsible for deploying, maintaining, and improving AI agents across their company.

Not a consultant who sets things up and leaves. Not a developer building a product for external customers. An employee — with ongoing accountability for whether the agents keep working.

That accountability is the key distinction. It means when an agent breaks at 2pm on a Tuesday and the customer service team can't process claims, you're the one who gets called. When the CEO asks "so what has the AI actually delivered this quarter?" you're the one who has to answer. When a department wants to expand the agent to cover a new workflow, you're the person who figures out if that's a good idea and makes it happen.

---

## How it's different from other roles people confuse it with

**It's not the same as IT administration.** IT admins manage systems that already exist — they configure, maintain, and troubleshoot. Agent Operators redesign workflows. You're not just keeping the lights on; you're rebuilding how work gets done.

**It's not the same as software development.** Developers build products, usually for external customers or internal platforms. Agent Operators operate and evolve systems that are running inside the business. The work is closer to running a business operation than building software. You don't need to write code from scratch. You need to understand systems deeply enough to configure, connect, and maintain them.

**It's not the same as project management.** Project managers coordinate between people and track deliverables. Agent Operators get hands-on with the systems themselves — writing system prompts (the instructions that tell an agent how to behave), building evaluation test sets, connecting data sources, diagnosing failures.

**The closest existing analogy:** a Salesforce admin. Salesforce admins don't build Salesforce — they configure it, customize it for their company's workflows, maintain the data quality, train users, and figure out what to turn on next. That's exactly the relationship an Agent Operator has with AI agents. Except the toolset is newer, the job is less standardized, and there's no Salesforce certification equivalent yet.

---

## The eight things an Agent Operator actually does

Levie's job spec was specific. Here's what each item means in practice:

**1. Map out new workflows with agents.**
Before you can deploy an agent, you have to understand the workflow you're replacing or augmenting. That means talking to the people who do the work, understanding the exceptions and edge cases, and deciding what the agent should handle and what should stay human. This is half operational analysis, half systems thinking.

**2. Implement new systems to deploy agents.**
The "implementation" at the Agent Operator level is usually not code — it's configuration. Writing a system prompt. Setting up a Claude Project. Connecting a Google Drive folder. Building the Zapier flow that keeps context current. Technical, but not engineering.

**3. Make sure agents have the right, up-to-date context.**
An agent is only as good as what it knows. If the agent is answering questions using a policy document from last year, the answers will be wrong. Keeping context fresh — knowing which documents feed each agent, knowing when they need to be updated — is one of the most important and most neglected parts of the job.

**4. Wire up internal systems to connect to agents.**
Eventually your agents need to talk to the systems where work actually happens: your CRM, your ticketing system, your ERP, your documents. The Agent Operator figures out how to make those connections, at whatever level of integration the company can support right now.

**5. Create evals for agents.**
An eval (short for evaluation) is a documented set of test cases — real examples of inputs and expected outputs — that you run regularly to check whether the agent is still working correctly. Most Agent Operators haven't built one yet. The ones who have are the ones who catch problems before users do.

**6. Figure out where the human is in the loop.**
Not every output from an agent should go directly to the user or directly into a system. Some decisions need human review. Some outputs need spot-checking. The Agent Operator decides which ones, and designs the workflow so humans are in the right places — not so many that the agent adds no value, not so few that errors compound unchecked.

**7. Manage the system when there are new upgrades.**
AI models get upgraded. When Claude releases a new version, or when Anthropic changes default behaviors, your agents may behave differently. The Agent Operator needs to notice this, run tests, and either accept the new behavior or adjust prompts to maintain consistency.

**8. Help with change management of existing business processes.**
The technology is often the easy part. Getting people to actually use the agent — to trust it, to change their workflows, to stop doing the task manually — is the hard part. Agent Operators are on the front lines of this.

---

## Where this role comes from in the org

Levie was explicit about this: the role will come from IT, engineering, or directly from business functions. That's not a vague "it could be anyone." Those three paths correspond to three different types of Agent Operators:

**From IT:** Technically grounded, already trusted on systems questions, may need to build more business workflow instinct. Strong at integration and reliability.

**From engineering:** Deepest technical capability, may need to build more tolerance for ambiguity and organizational dynamics. Strong at evals and debugging.

**From the business function itself:** Deepest understanding of the actual workflow, may need to build more technical confidence. Strong at identifying the right use cases and getting team adoption.

All three can do this job. The combination Levie described was "technical-yet-business-savvy." The technical part means you can understand how these systems work well enough to configure and maintain them. The business-savvy part means you understand what the workflow is actually supposed to accomplish, who uses it, and what failure looks like.

---

## Who is becoming this right now

Look around any mid-size company and you'll find people already doing this work without the title. The IT manager who got asked to "figure out the AI stuff" six months ago. The operations analyst who built three Zapier flows and a few Claude Projects and somehow became the internal expert. The business analyst who noticed their team was spending 15 hours a week on a task that an agent could handle in two, and decided to fix it.

These people are Agent Operators. They didn't choose the role so much as the role found them.

The skill profile that keeps appearing: systems thinkers who can read documentation, who understand both how software works and how work actually gets done in their organization, and who are comfortable operating without a playbook. Former Salesforce admins, business systems managers, ops analysts, IT generalists. People who have always been the person who "figures out the new tool."

---

## What to do if this is you

If you've read this far and recognized yourself in the description, the next question is how to build the role into something durable — and how to do it without burning out trying to do everything at once.

The place to start is with a disciplined 90-day plan: one team, one workflow, one agent that actually works. Everything else flows from that first win. The [90-day Agent Operator playbook](/articles/agent-operator-first-90-days) covers exactly this — what to build in what order, what to defer, and what to avoid.

The role Levie described isn't hypothetical. It's already here. And most people in it are figuring it out without a roadmap.

---

## Try this today

Write down the agents you're currently responsible for — even informally. For each one: is there a written description of what it's supposed to do? Is there a way you'd know if it stopped working? Is the context it uses current?

If the answer to any of those is "not really," that's where to start. The role of Agent Operator isn't just building agents — it's maintaining the ones you've already built.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Article 2: agent-operator-first-90-days
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: 'agent-operator-first-90-days',
    angle: 'process',
    title: 'Your first 90 days as an Agent Operator — what to build, in what order',
    excerpt: "Most people handed AI responsibility try to do everything at once and ship nothing reliable, or wait for a perfect plan and never start. The 90-day path is simpler: one team, one workflow, one agent that actually works. Then you expand.",
    readTime: 10,
    cluster: 'Business Strategy & ROI',
    audience: ['operator'],
    termSlug: 'ai-agent',
    body: `Someone handed you AI responsibility. Maybe it was a direct conversation with your CEO. Maybe it accumulated — you answered a few questions, built one thing that worked, and suddenly you're the AI person. Either way, you're now accountable for making AI agents work inside your company, and you're probably doing it without a team, without a budget that covers consultants, and without a playbook.

The two failure modes I see most often:

**Chaos:** You try to automate five workflows at once, deploy agents to three teams simultaneously, and spend the first 90 days in a perpetual state of "nearly working." Nothing gets to reliable. Users lose confidence. You exhaust yourself.

**Paralysis:** You spend the first 90 days designing the architecture, waiting for buy-in from more stakeholders, and deferring the actual building until you have a more complete plan. Nothing ships. The CEO's enthusiasm fades. The window closes.

The path between these is narrower than it sounds: one team, one workflow, one agent. Get it working reliably. Measure the results. Then expand.

Here's what that looks like, concretely.

---

## Days 1–30: Diagnose before you build

The first month is not for building. It's for finding the right thing to build.

**Start with an honest audit of what already exists.**

Shadow AI use is real and it's happening in your company right now. People are using ChatGPT for their work emails. They're pasting customer complaints into Claude and asking for summaries. They're using Gemini to draft proposals. Usually without telling IT. Usually without any standard approach. This isn't a problem to stop — it's signal about where AI is already providing value.

Before you build anything formal, find out what informal AI use is already happening. Ask directly: "What are you using AI for right now?" You'll be surprised. And some of it will point you directly at your best first project.

**Interview 3–5 people from different teams about their most painful workflows.**

You're looking for tasks that are:
- High volume (they happen frequently — daily or weekly, not quarterly)
- Repetitive in structure (the task follows a predictable pattern, even if the inputs vary)
- Currently consuming significant time (hours per week, not minutes)
- Low-stakes-per-instance (a single error is annoying but not catastrophic)
- Data-accessible (the information the agent needs actually exists and is findable)

Good examples from non-tech companies: supplier invoice triage, first-line customer inquiry responses, contract clause review, safety incident report categorization, shift scheduling requests, HR policy lookups.

Bad first projects: anything that requires making final decisions in high-stakes situations, anything that touches compensation or employment, anything where the input data is inaccessible or highly unstructured, anything where "good" is impossible to define.

**Map the top 3 candidates and pick one.**

For each candidate workflow, write down four things:
1. What does the agent need to know? (What context, documents, or data?)
2. What should it produce? (What does the output look like?)
3. How would you know if it's wrong? (What does a bad output look like?)
4. What happens if it fails? (Who is affected and how badly?)

This exercise usually makes the right choice obvious. The workflow where you can answer all four questions clearly and specifically is the one to build first.

---

## Days 31–60: Build and validate before you roll out

You have a workflow. Now build the agent — but don't roll it out yet.

**Set up the agent with a proper system prompt and context.**

A system prompt is the standing instruction set that tells Claude who it is, what it's supposed to do, and how it should behave. This is not the same as the user's question — it runs behind the scenes on every interaction. A good system prompt for a first agent is usually 300–600 words. It covers:

- What the agent is and what it's for (one sentence)
- The context it has access to (which documents, which data)
- What it should output and in what format
- What it should do when it doesn't know something ("I don't have enough information to answer that — please contact [name]")
- What it should explicitly not do (critical for high-risk topics)

Write this out before you start configuring. It takes an hour and saves weeks of debugging later.

**Build a test set of 10 real cases before anything goes live.**

A test set is a list of real inputs — questions or requests the agent will actually receive — along with what a good response looks like. You run this test set to check whether the agent is working correctly.

For your first agent, 10 cases is enough. Include:
- 5 typical cases (the bread-and-butter inputs)
- 3 edge cases (unusual inputs, incomplete information, ambiguous requests)
- 2 cases where you know what the agent should say it can't help with

For each case, write a one-sentence description of what "good" looks like. Not "accurate" — something specific. "Correctly identifies the policy section and gives the relevant clause number" or "Escalates to HR rather than attempting to answer" or "Gives the correct handling time for a fragile shipment category."

**Run the agent with 2–3 people maximum before anyone else sees it.**

Find the person most likely to be your internal champion — someone enthusiastic about the use case, willing to give detailed feedback, and patient with a first version. Give it to them and one or two colleagues. Ask them to use it for one week for real work.

Collect specific examples of where it worked, where it didn't, and what the failure looked like. This is your debugging data. Most first agents need 3–5 prompt revisions before they're ready for broader rollout. Do those revisions now, not after you've rolled out to 50 people.

---

## Days 61–90: Stabilize before you expand

Your pilot worked. The 2–3 people are using the agent and getting value from it. Now the work is getting to a state you can maintain and explaining it to your CEO.

**Get to a point where you can answer "is this agent working?" at any given moment.**

This means: you have your test set, you're running it weekly (or after any change), and you know your pass/fail rate. You have a rough sense of volume (how many queries per day). You know who to contact if users report problems.

This is the operational baseline. Without it, you don't have a deployed agent — you have a demo that may or may not be working at any given moment.

**Connect one live data source to keep context current.**

If the agent relies on a document or database that changes — a pricing sheet, a policy document, a product catalog — set up a way for that to stay current without manual intervention. For most Agent Operators, this is simpler than it sounds: it might be as simple as pointing the agent's Claude Project at a shared Google Drive folder that your team already maintains. When someone updates the document in Drive, the agent's context updates automatically.

If that's not possible yet, at minimum: create a calendar reminder to manually update the context document on whatever schedule the underlying data changes. Monthly for most policies, weekly for operational data, daily if you have something real-time. Stale context is the most common cause of mysterious agent failures that start weeks after the agent was working fine.

**Report to your CEO with real numbers.**

Before day 90, write a one-page summary of what the agent is doing, what it's handling, and what it's saving. You need at least one concrete number. See the section below on what to defer for what not to include yet.

Then pick the second workflow and start the cycle again.

---

## What to defer (even though it sounds important)

**Enterprise MCP servers.** An MCP server is a custom integration that gives Claude live access to internal databases and APIs. It's the right long-term architecture. It's also an engineering project that requires real technical resources. You don't need it yet. Native connectors and Zapier solve 80% of what you need in year one.

**Custom dashboards and monitoring systems.** A spreadsheet with your test results and a weekly 30-minute review session is monitoring. Build the elaborate dashboard after you have enough agents running that the spreadsheet becomes unmanageable.

**Company-wide training.** Don't train the whole company before you have 3 agents that work reliably. Training 380 people to use an agent that breaks will destroy trust and set back adoption by 6 months. Train the pilot team first. Let word of mouth spread.

**Trying to show big numbers fast.** The Agent Operator who shows 3 working agents with documented results in 90 days is more credible than the one who demos 12 that break. Your CEO wants to know if this is working and whether to invest more. Three solid wins answer that question. Twelve questionable ones don't.

---

## The single most important thing to get right

Before anything else, write down exactly what each agent is supposed to do — its scope, its context, its output format, and what it should not do. This document is your system prompt, your test set, and your incident response guide. When the agent breaks at 2pm on a Tuesday, this document is how you diagnose it in 20 minutes instead of 4 hours.

Most Agent Operators skip this because they're moving fast. Don't. It takes 2 hours per agent to do it properly and it saves 20 hours of debugging later.

---

## Try this today

Write the job description for your most important current agent — as if it were a new hire. What would you tell them in their first week? What would they need to know? What would good work look like, and what would bad work look like?

That document is your system prompt. If you can't write it, you're not ready to deploy the agent.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Article 3: how-to-evaluate-your-agents
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: 'how-to-evaluate-your-agents',
    angle: 'process',
    title: 'How to evaluate your agents — without being a developer',
    excerpt: "Most agents in production have never been formally tested. The person who set them up tried a few examples and it seemed fine. That's how you end up with a contract review agent that hallucinates clause details. Evaluation doesn't require code — it requires a spreadsheet and 30 minutes a week.",
    readTime: 9,
    cluster: 'Evaluation & Safety',
    audience: ['operator', 'developer'],
    termSlug: 'ai-agent',
    body: `Take any five AI agents running inside a company right now and ask the person who deployed them: "Have you formally tested this?"

Four out of five will give the same answer: "I tried it a bunch and it seemed to work well."

That's not evaluation. That's a vibe check. And vibes are how you end up with a contract review agent that confidently cites clause 4.3 when the actual problematic clause is 7.1. The contract reviews that matter most — the ones with real financial exposure — are exactly the cases where the agent is most likely to be confidently wrong in ways you haven't tested for.

Formal evaluation sounds like something that requires code. ML benchmarks, automated test runners, regression suites. It doesn't. Evaluation means: you have a consistent set of test cases, you run them regularly, and you know what good output looks like. You can do all of this in a spreadsheet. The rigor is in the test design, not the tooling.

Here's the complete process.

---

## What evaluation actually is at the Agent Operator level

Let's clear up the terminology, because "evaluation" or "evals" is used differently by different people.

For an ML researcher, evaluation means running a model against a benchmark dataset and measuring performance across thousands of examples. For a developer, it might mean an automated test suite that runs on every code change. Neither of these is what you need.

For an Agent Operator, evaluation means: **a documented set of inputs and expected outputs that you run on a schedule to check whether your agent is still performing correctly**.

The inputs are real examples — questions or tasks the agent actually receives. The expected outputs are written descriptions of what good looks like. You run these cases, you compare the actual output to your expectation, and you note any failures.

That's it. The value comes from doing it consistently, not from doing it with sophisticated tooling.

---

## Step 1: Build your test set

This is the most important step and the one most often skipped because it requires thinking before doing.

**Pull 20 real examples from the agent's recent history.**

If you have logs of what users have submitted to the agent, go back through the last month and pick 20 examples. Choose them deliberately:
- 12 typical cases (the most common types of inputs the agent receives)
- 5 edge cases (unusual inputs: incomplete information, ambiguous phrasing, requests that are adjacent to but outside the agent's scope)
- 3 known failure cases if you have them — times the agent produced a wrong or unhelpful output

If you don't have logs, create 20 realistic examples based on your knowledge of how the agent is used. Ask a few users "what's a typical question you'd ask it?" and "what's the weirdest thing you've tried to ask it?"

**Write down what "good" looks like for each case.**

This is the step that distinguishes evaluation from guessing. For every test case, write one or two sentences describing what a good response looks like. Be specific — not "accurate" but:

- "Identifies the correct clause number and quotes the relevant language"
- "Gives the handling procedure for hazmat category 3 shipments, not category 2"
- "Declines to answer and redirects to HR with a specific contact name"
- "Lists exactly 3 options with cost and lead time for each, not more, not fewer"

Vague criteria ("clear and accurate") produce inconsistent judgments. Specific criteria produce consistent ones.

**Don't build a test set of 100.** Twenty is enough to catch most problems. A hundred cases you stop running is worth nothing. Twenty you run every week is worth everything.

---

## Step 2: Score regularly

Running your test set takes about 30 minutes. Do it:
- Every week (if the agent is in a high-stakes workflow or high volume)
- Every two weeks (for most agents)
- After any change to the system prompt, context documents, or model version

**The scoring rubric:** Keep it simple. Three categories:

- **Pass:** The output matches or exceeds your written expectation
- **Partial:** The output is roughly right but missing something or formatted incorrectly
- **Fail:** The output is wrong, misleading, or unhelpful

No partial credit math. Just count your Passes, Partials, and Fails.

**The action threshold:** If more than 2 of your 20 cases fail in any given run, stop and investigate before doing anything else with this agent. Especially before expanding its scope or adding users. A 10% failure rate sounds small until you multiply it by your volume.

**Track in a spreadsheet.** Date each run. The trend matters as much as any single result. An agent whose pass rate drops from 18/20 to 15/20 over three weeks is telling you something — even if 15/20 still feels "good enough."

Here's the column structure that works:

| Test Case # | Input | Expected Output | Date: 05-07 Result | Date: 05-14 Result | Notes |
|---|---|---|---|---|---|
| 1 | [the input] | [what good looks like] | Pass | Pass | |
| 2 | [the input] | [what good looks like] | Pass | Partial | Format changed |

Keep this spreadsheet. It becomes your institutional memory for what the agent has done and when things changed.

---

## Step 3: The human-in-the-loop audit

Your test set catches regressions — things that used to work and stopped working. But real usage is messier than your test set. Users ask things you didn't anticipate. Context gets used in combinations you didn't test.

Once a week, pull 10 random real outputs from the last 7 days. Rate each one:

- Would I be comfortable if a department head saw this output?
- Is there anything in this that's factually wrong?
- Does it match the format and scope the agent is supposed to produce?

This is a 15-minute exercise. It catches drift that your test set misses — the gradual expansion of scope as users push the boundaries, the edge case you didn't anticipate, the output that's technically passing your rubric but feels off in actual use.

---

## Step 4: The freshness check

Stale context is the most common cause of mysterious agent failures — the "it worked last month" problems that have no obvious cause.

Every month, ask these questions for each agent:

- What documents or data sources does this agent use?
- When were they last updated?
- Has anything changed in our business that should be reflected in those documents?

Make a list. For each document the agent relies on: what's the update schedule, who owns it, and when does it need to be refreshed?

For policies and runbooks that change infrequently, a quarterly review is usually fine. For operational data like pricing, inventory, or scheduling — if it's not connected to a live source, it needs more frequent manual updates.

If you find that an agent is working from a document that was last updated six months ago, don't assume it's fine. Check: has anything material changed? Update the document and run your test set.

---

## The red flags that mean stop and investigate

These are behaviors that should trigger immediate investigation regardless of your test set results:

**The agent is suddenly much more verbose.** It's adding caveats, disclaimers, and qualifications it wasn't adding before. This often signals a model version change or a context problem.

**The agent starts hedging constantly.** "I'm not sure but..." or "This might not be accurate, but..." — if this increases significantly, something changed in the model or the prompt.

**Output format drifts.** It was producing bullet-pointed summaries; now it's producing paragraphs. Something changed in the prompt or model that's affecting format adherence.

**Users start routing around it.** They message you directly instead of using the agent, or they use it but don't act on the output. This is a lagging indicator — by the time you notice, quality has been declining for a while.

**Your failure rate crosses 2/20.** Stop expanding. Fix before you scale.

---

## What to do when you find a failure

Finding a failure is not a crisis — it's the system working. Your evaluation caught something before it caused more damage.

The first response is almost never "change the model." Ninety percent of the time, the fix is in the prompt or the context. Work through the failure systematically:

1. Can you reproduce it with the specific input that failed? (If not, it may be intermittent — test 3 more times)
2. Is the context document current and correct?
3. Does the system prompt have a clear instruction that covers this case?
4. If not, add a specific example to the system prompt that shows the correct behavior for this type of case

If you've worked through all of this and still can't identify the cause, document the specific failure case before asking for technical help. "It's giving wrong answers" doesn't help anyone diagnose the problem. "On inputs of type X, it consistently gives output Y when it should give output Z — and this started after we updated the policy doc on May 3" does.

---

## Try this today

Take your most important running agent. Open a spreadsheet. Write down 10 real inputs it has received in the last month — go through your logs, ask users, or create realistic examples if you have to. For each one, write one sentence describing what a good response looks like.

That's your test set. Run it against the current agent tonight. Note the results.

You now have a baseline. Next week, run it again and compare. That's evaluation. It took you two hours and it will take 30 minutes a week to maintain.

The contract review agent that's hallucinating clause details needs one of these. Start there.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Article 4: when-agents-break
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: 'when-agents-break',
    angle: 'failure',
    title: 'When your agent breaks — how to diagnose it and fix it',
    excerpt: "When your agent starts producing bad outputs, the instinct is to assume the model got worse. It usually didn't. 90% of agent failures are context failures or prompt failures — both of which you can diagnose and fix without any technical help.",
    readTime: 8,
    cluster: 'Evaluation & Safety',
    audience: ['operator', 'developer'],
    termSlug: 'ai-agent',
    body: `It's Tuesday afternoon. Your agent worked fine on Friday. Now the customer service team is sending you screenshots of outputs that are clearly wrong — wrong product names, wrong procedures, outdated pricing. Or maybe they're not wrong so much as off: the format changed, the tone changed, the outputs are longer than they used to be and nobody knows why.

You don't have a developer to call. You have your system prompt, a few documents, and the admin console. You have to figure this out yourself.

The first and most important thing to understand: **this is almost certainly not a model failure.** The model didn't get dumber. Claude doesn't randomly degrade on a Tuesday afternoon. What changed is almost always one of five things — and all five are diagnosable and fixable without any code.

Here's the systematic approach.

---

## The five failure modes

### Failure Mode 1: Stale context

**What it looks like:** The agent gives outdated information. It references policies you changed last month, discontinued products, last quarter's pricing, a process you updated after a compliance audit. Everything else about the output looks fine — format, tone, structure — but the facts are wrong.

**Why it happens:** The documents or data the agent uses as context haven't been updated. The agent can only work with what it knows. If it knows the old version of your supplier policy, it will give answers based on the old version, confidently and consistently.

**How to diagnose it:** Ask yourself: when did the underlying information change? When did the agent last get updated context? If those dates don't line up, you've found your problem.

**How to fix it:** Update the context document. Then set a process to prevent this from happening again. At minimum: a calendar reminder on the schedule the underlying data changes. If the data changes frequently, look at connecting a live source rather than maintaining a static document (see [wiring-internal-systems-to-agents](/articles/wiring-internal-systems-to-agents)).

---

### Failure Mode 2: Prompt drift

**What it looks like:** The output format changed. The agent used to produce structured bullet points; now it produces paragraphs. It used to be concise; now it adds lengthy caveats. The content quality may be the same, but the form is different — and users notice.

**Why it happens:** Someone changed the system prompt. This is more common than it sounds. If multiple people have access to the Claude Project admin settings, prompt changes can happen without coordination. Even small changes — adding a sentence, reordering instructions — can change output format significantly.

**How to diagnose it:** Check who has admin access to the agent's Project. Check whether any changes were made recently. If you're the only admin and you haven't changed it, check whether you accidentally edited it (this happens — it's easier than you think to accidentally modify a system prompt in the admin console).

**How to fix it:** Restore the original prompt. If you don't have a copy, you'll need to reconstruct it — this is a reminder to always save your system prompts somewhere outside the admin console (a Google Doc works fine). After restoring, add a comment at the top: "Do not modify without running test cases first." Then run your test set to confirm the fix.

---

### Failure Mode 3: Out-of-scope inputs

**What it looks like:** The agent was designed to handle one type of task and users are asking it to do related but different things. It's trying to answer but producing low-quality outputs. Or it's answering a different question than the one the user actually had, because it's interpreting out-of-scope inputs through the lens of what it knows how to do.

**Why it happens:** Users naturally push boundaries. Your invoice triage agent gets asked to draft supplier emails. Your policy lookup agent gets asked to make judgment calls about policy exceptions. Your scheduling agent gets asked about payroll. The agent doesn't know to redirect — it tries its best, and its best at out-of-scope tasks is usually poor.

**How to diagnose it:** Pull the actual user inputs from the last two weeks and read through them. Look for the pattern: are users asking for things that were never in the original design? If more than 10% of inputs are asking for something outside scope, you have scope creep.

**How to fix it:** Two options depending on whether the new use cases are worth supporting. If they are: update the system prompt to cover them explicitly, add test cases for them, and verify quality. If they're not: add explicit redirect instructions to the system prompt. "For questions about [X], I can't help directly — please contact [name/channel]." Specific redirects work much better than general ones.

---

### Failure Mode 4: Missing context for specific case types

**What it looks like:** The agent works for most inputs but consistently fails on a specific type. Your contract review agent works for standard contracts but fails on contracts with non-standard clause numbering. Your supplier lookup works for domestic suppliers but gives wrong results for international ones. It's not random failure — it's patterned.

**Why it happens:** The agent's context covers the common case well but has gaps for certain edge cases. The agent doesn't know what it doesn't know — it makes its best attempt with incomplete information.

**How to diagnose it:** Find the pattern in the failures. What do they have in common? Is it a specific category, a specific format, a specific type of input? If you can describe the pattern in one sentence, you've found the gap.

**How to fix it:** Add examples of the failing case type to the agent's context. Add explicit instructions to the system prompt that cover the edge case. "When the contract uses non-standard clause numbering (e.g., A.1, A.2 instead of 1, 2), use the section header to identify clauses, not the number." Explicit examples of edge cases in the system prompt consistently fix these pattern failures.

---

### Failure Mode 5: Model upgrade without testing

**What it looks like:** Everything was working fine, then it wasn't. You may not have noticed anything changed — no documents were updated, no prompts were edited. But the outputs are subtly different: longer, or more conservative, or formatted differently.

**Why it happens:** Claude's underlying models get upgraded periodically. When Anthropic releases an improved version, behavior can change even for the same prompt. Most of the time these changes are improvements. Occasionally they break something specific to your use case.

**How to diagnose it:** Check when the failure started. If you have a log of your test set results, look at when the pass rate dropped. Check the [Anthropic changelog](https://docs.anthropic.com/en/release-notes/overview) for model updates around that time.

**How to fix it:** Run your test set on the new model version. If specific cases are failing that weren't before, adjust your system prompt to restore the original behavior. Add explicit instructions where the new defaults diverge from what you need.

This is the single best argument for having a test set before you need one. If you run your 20 test cases every week and you catch a regression the day after a model upgrade, you know immediately what changed and when. Without a test set, you find out when users complain, which is usually 2–3 weeks after the change.

---

## The 45-minute debugging workflow

When an agent breaks and you don't immediately know why, work through this sequence:

**Step 1 (5 min): Reproduce it with a specific example.**
Don't debug in the abstract. Find one specific input that produced a bad output. Run it again now. Does it still produce the bad output? If yes, continue. If it's intermittent, run it 5 more times and note the pattern.

**Step 2 (5 min): Narrow to when it started.**
Ask users when they first noticed the problem. Check your test set history if you have one. Knowing when it started tells you what changed — it narrows the universe of causes from everything to "something that happened in this time window."

**Step 3 (10 min): Check the context.**
When were the documents or data the agent uses last updated? Does anything in those documents conflict with the failing output? Is there information that's now outdated?

**Step 4 (10 min): Check the prompt.**
Pull the current system prompt. Does it have clear instructions that cover this type of case? Did anyone change it recently? Is there anything in it that could be causing the behavior you're seeing?

**Step 5 (15 min): Check for scope creep.**
Pull the last 50 user inputs. Are users asking for things outside the original design? Is the agent trying to answer questions it wasn't built to answer?

In most cases, one of steps 3–5 will reveal the problem. The fix is usually either updating a document, restoring or editing the system prompt, or adding explicit instructions for an edge case.

---

## When to escalate

If you've run through all five steps and genuinely can't find the cause, document before you ask for help. Write down:

- The specific input that fails
- What the agent produces
- What it should produce
- When the problem started
- What you've already checked and ruled out

"The agent is giving wrong answers" takes someone 2 hours to diagnose. "On inputs containing non-standard invoice formats, the agent assigns them to the wrong category. Started around May 8. Context documents are current. System prompt hasn't changed. Happens on about 30% of non-standard inputs, consistently." takes someone 20 minutes.

---

## What not to do

**Don't rebuild from scratch.** When an agent is failing, the instinct is to throw it out and start over. Don't. The failure is almost always in the context or prompt, not the underlying architecture. Rebuilding costs you weeks and doesn't fix the root cause.

**Don't swap models without testing.** "Maybe Claude 3.5 would be better" is sometimes true. It's also sometimes worse for your specific use case. Never change the model without running your test set on both versions first.

**Don't turn it off without communicating.** If you need to take an agent offline while you debug, tell the users. "The invoice triage agent is down for maintenance until Thursday — please submit to [email] in the meantime." Silence is worse than a clear message.

---

## Try this today

Take the agent that's been giving you the most trouble. Find one specific example of a bad output — an actual input and output pair where the output was wrong or unhelpful. Walk through steps 1–5 of the debugging workflow. Write down what you find.

If you've been blaming the model, you're about to find out it's something else.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Article 5: wiring-internal-systems-to-agents
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: 'wiring-internal-systems-to-agents',
    angle: 'process',
    title: 'Wiring your internal systems to Claude — what\'s actually possible without an engineer',
    excerpt: "Most Agent Operators think connecting their internal systems to Claude requires an engineer. For the majority of use cases, it doesn't. Four levels of integration exist — and Level 2 (native connectors for Google/Microsoft) or Level 3 (Zapier) solve 80% of what you need.",
    readTime: 9,
    cluster: 'Infrastructure & Deployment',
    audience: ['operator', 'developer'],
    termSlug: 'ai-agent',
    body: `Every Agent Operator hits the same wall eventually.

You've built the agent with a Claude Project, uploaded a few documents, written a solid system prompt. It works. Users are getting value. Then someone asks: "Can it look up a customer's order history?" Or: "Can it check our current inventory before answering?" Or: "Can it see the case notes from Salesforce when a customer asks a question?"

And you think: I need an engineer for that.

Sometimes you do. But less often than you think. Most Agent Operators are at Level 1 of integration when Level 2 or Level 3 would solve what they need — and they're skipping to thinking about Level 4 (which does require engineering) without realizing the middle options exist.

Here's the complete map.

---

## The four levels of integration

### Level 1: Paste or upload (no integration required)

**What it is:** You take the information the agent needs — a policy document, a runbook, a product catalog, a pricing sheet — and you paste it into the system prompt or upload it to the Claude Project as a file.

**Works for:**
- Policy documents, procedures, runbooks
- Product or service catalogs
- FAQs and knowledge base content
- Anything that changes infrequently (less than once a month)

**How to set it up:** Upload the document directly in your Claude Project settings. Claude can read PDFs, Word documents, plain text, and more. Or paste the content directly into the system prompt if it's short enough.

**The limitation:** The information is static. When the underlying source changes, you have to manually update the file in the Project. If you forget, the agent works from stale information. (See [when-agents-break](/articles/when-agents-break) — stale context is failure mode #1.)

**Right for:** Every Agent Operator at the start. Also right for mature agents where the underlying data genuinely doesn't change much.

---

### Level 2: Native connectors (no code required)

**What it is:** Claude has built-in connectors for Google Workspace (Drive, Docs, Gmail) and Microsoft 365 (SharePoint, OneDrive, Teams). When enabled, the agent can search and read files from your connected organization's Google Drive or SharePoint in real time.

**Works for:**
- Companies on Google Workspace or Microsoft 365
- Situations where documents change regularly but your team already maintains them in Drive/SharePoint
- Any workflow where the agent needs to reference files that your team already keeps updated

**How to set it up:** In the Claude for Work admin console, enable the Google Workspace or Microsoft 365 connector. Users authenticate with their work Google/Microsoft account. The agent can then access the files and folders those users have permission to see — no additional setup needed.

**What the agent actually gets:** The ability to search documents in Drive/SharePoint and pull relevant content into its context when answering a question. It respects the same permissions the user has — if they can't see a file, the agent can't either.

**The limitation:** Only works for Google Workspace and Microsoft 365. Permissions are per-user, so the agent sees what that user sees. You can't, for example, give the agent global access to all Salesforce data through this connector.

**Right for:** Most companies on Google Workspace or M365. This is the integration that feels like magic the first time it works. Your agent is suddenly drawing on the latest version of every document your team keeps in Drive, without any manual updates.

---

### Level 3: Zapier or Make.com (no code, some setup time)

**What it is:** Zapier and Make.com are automation platforms that can connect hundreds of business tools — Salesforce, HubSpot, Jira, Notion, Airtable, Slack, and more — and let them talk to Claude without writing code.

**Works for:**
- CRM data (Salesforce, HubSpot) — look up customer records before answering
- Project management (Jira, Asana) — check ticket status, create tickets from agent output
- Spreadsheets and databases (Airtable, Google Sheets) — query tables, update records
- Any tool with a Zapier connector (there are thousands)

**How it works:**
There are two directions:

*Feeding data into the agent:* You create a Zapier flow that watches for a trigger (a new order, a Salesforce record update, a form submission), formats the relevant data, and sends it to Claude as part of the conversation context. When a customer service rep uses the agent, the agent automatically has that customer's latest order status from your order management system — because Zapier pulled it and formatted it.

*Sending agent output to other systems:* The agent produces structured output (a categorized ticket, a drafted response, a recommended action), and Zapier takes that output and creates a record in Salesforce, sends a Slack message, or updates a spreadsheet.

**How to set it up:** Start at [zapier.com](https://zapier.com). Search for Claude AI in the app directory. Zapier has a pre-built Claude integration that lets you send text to Claude and receive a response. Connect it to whatever source system you need.

**The limitation:** There's some latency (Zapier flows take seconds to execute, not milliseconds). And you're building flows — not true live queries. If you need real-time bidirectional access to a database mid-conversation, Zapier isn't the right tool. But for the most common Agent Operator needs, it works well.

**Right for:** Agent Operators who need to connect to CRM, ticketing, or operational tools without an engineer. This is where most medium-complexity integrations live.

---

### Level 4: MCP server (requires engineering help)

**What it is:** MCP stands for Model Context Protocol. It's an open standard that lets you build a custom server that gives Claude structured, live, bidirectional access to internal APIs and databases. When a user asks the agent a question, the agent can call the MCP server in real time to fetch exactly the data it needs — from your legacy ERP, your internal database, your proprietary system.

**Works for:**
- Real-time access to internal systems that don't have Zapier connectors
- Legacy ERP or warehouse management systems
- Proprietary databases with complex query needs
- High-volume, low-latency use cases where Zapier's speed isn't sufficient

**Who builds it:** A developer. This is not a no-code project. Building an MCP server requires writing server-side code, defining the tool interface, handling authentication, and deploying it somewhere. If you have an internal developer available, it's a few days of work. If you don't, it's a project that needs to be scoped and staffed.

**The limitation:** This is the right long-term architecture for a mature AI stack. It is not where you should start. MCP servers are powerful and flexible — but they take real engineering time to build and maintain.

**Right for:** When Levels 1–3 genuinely can't solve the problem, and you have engineering resources. Don't start here.

---

## The decision framework

Four questions that tell you which level you need:

**Does the data change less than once a month?** → Level 1 is fine. Upload it, update it when it changes.

**Is the data in Google Drive/SharePoint and your company uses Google Workspace or M365?** → Level 2. Turn on the native connector. This is probably the fastest win you have available.

**Does the tool have a Zapier connector?** Go to [zapier.com/apps](https://zapier.com/apps) and search for it. If yes, and if your use case is batch-style rather than real-time → Level 3. Build the flow.

**Do you need real-time access to a proprietary internal system that has no external connector?** → Level 4. Get engineering help, or scope it as a future project.

---

## The most common mistake

Jumping straight to Level 4 because it sounds like the "right" architecture.

Level 4 is the right architecture for a mature, scaled AI stack. It is not the right starting point. Most Agent Operators who are 6–12 months into the role are still getting enormous value from Level 1 and Level 2. The move to Level 3 unlocks another round of capabilities without requiring engineering help. Level 4 is a year-two project for most companies.

The other common mistake: staying at Level 1 forever because it works, while paying the maintenance cost of manually updating documents that could be automated with Level 2.

---

## A practical example

Here's how a logistics company might think through integration for a customer service agent:

The agent needs to answer questions about shipping status and delivery windows.

**Option A (Level 1):** Export daily shipping reports to a PDF, upload to the Claude Project every morning. Works, but manual. Misses real-time accuracy.

**Option B (Level 2):** If shipping reports are maintained as Google Sheets in Drive, connect the native Google Workspace connector. The agent can now read the current version of the sheet whenever needed. No manual updates.

**Option C (Level 3):** Build a Zapier flow that triggers when a Salesforce case is opened, fetches the order number from the case, looks up the shipment status in the order management system, and passes it to Claude as context. The agent now has the specific shipment status for this customer's order before the rep even types the first message.

**Option D (Level 4):** Build an MCP server with live access to the warehouse management system for real-time inventory and delivery window queries. Right answer if volume and latency demands require it. Significant engineering investment.

For most logistics company CS agents, Option B or C solves the real problem. Option D becomes worth considering at scale.

---

## Try this today

For each agent you're currently running: look at the context it uses. Is it a static document? Could it be replaced with a live connection to something your team already maintains in Google Drive or Sharepoint?

If yes, turn on the native connector today. It's a 20-minute admin task and it eliminates one category of stale context failures permanently.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Article 6: agent-change-management
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: 'agent-change-management',
    angle: 'failure',
    title: 'Getting your team to actually use the agent — the change management problem nobody warned you about',
    excerpt: "Building the agent is the easy part. Getting people to use it is where most Agent Operators fail. Three types of resistance — trust, speed, job fear — each with a different fix. And one thing that kills adoption faster than anything else.",
    readTime: 8,
    cluster: 'Business Strategy & ROI',
    audience: ['operator'],
    termSlug: 'ai-agent',
    body: `You built the agent. Your test cases pass. The output quality is good — you've checked it carefully, you know it works. You rolled it out to the team two weeks ago. And half of them are still doing the task manually.

Some are politely using the agent and then redoing the work themselves. Some are routing around it by messaging you directly. One or two are vocal: "I just think it's faster if I do it myself." And a few are clearly anxious in a way they haven't quite said out loud.

This is change management. And it's the part of the Agent Operator job that nobody prepares you for, because most of the writing about AI at work is about the technology, not about the humans who have to change their behavior to use it.

The technology working is necessary but not sufficient. The adoption is the actual job.

---

## Why adoption fails

The reasons people don't adopt a working tool fall into three categories. They're distinct problems with distinct fixes. Treating all resistance the same way — more training, more encouragement, more mandates — is why most rollouts underperform.

---

### Resistance Type 1: "I don't trust it"

**What they're saying:** The agent made a mistake in front of them — or they heard it made a mistake for someone else — and now they assume it's always wrong. Or they've never used AI and they have a general wariness about whether it's reliable.

**What's actually going on:** They don't have a mental model for when to trust it and when to check it. They're not being irrational — they're being appropriately cautious when they don't know the error rate or the failure pattern. The agent that's 95% accurate is still wrong 1 in 20 times. If they don't know which 1 in 20, everything feels suspect.

**What doesn't work:** General reassurance. "It's really good now, trust me" doesn't give them anything to act on. Showing them it's 95% accurate doesn't tell them which 5% they need to verify.

**What works:** Give them a specific rule. Tell them exactly when to trust it without checking, and exactly when to verify before using the output.

"Trust it for policy lookups — the policy documents are updated weekly and it's been accurate on 19 of our last 20 test cases. Always verify before forwarding contract clause references to external parties."

Specificity reduces anxiety more than reassurance. They're not asking for a guarantee — they're asking for a mental model. Give them one.

---

### Resistance Type 2: "It's slower than doing it myself"

**What they're saying:** For this specific task, using the agent takes longer than the manual workflow.

**What's actually going on:** They're usually right, for them. Here's why: the people who are fastest at the manual workflow are the ones who have done it hundreds of times. They've developed shortcuts, muscle memory, pattern recognition. For them, opening a new interface, writing a prompt, waiting for output, and reviewing it adds friction compared to a workflow they could do in their sleep.

The agent isn't slower for everyone — it's slower for the people who were already fast. It's often significantly faster for people doing the task for the first time, or doing it infrequently, or who haven't had time to develop the expert shortcuts.

**What doesn't work:** Arguing that the agent is faster. For the expert user, it may genuinely not be, at least not yet.

**What works:** Stop targeting the expert users first. Target the people who will actually be faster with the agent:
- New hires who haven't learned the manual workflow yet
- People who do the task occasionally, not daily
- People who are doing a task slightly outside their core expertise

Let the agent prove itself with this group. Measure the time savings. Then bring those numbers back to the skeptics: "The two people we onboarded last month are doing this task in 20 minutes. Before the agent, it was taking new hires 45–60 minutes for the first few months."

---

### Resistance Type 3: "What happens to my job?"

**What they're saying:** (Usually not out loud) — if the agent does this task, what do I do?

**What's actually going on:** This is fear, often unspoken, often inarticulate, often experienced as something else entirely. The person who says "I just prefer doing it myself" might be saying something that's genuinely true about speed — or they might be saying something about how unsettled they feel about what's changing.

You don't have to be a psychologist to address this. But you do have to be direct.

**What doesn't work:** Vague reassurance. "Don't worry, nobody's losing their job over this" is something people have heard before, often before being told about a restructuring. It doesn't reduce fear — it signals that you're not going to be straight with them.

**What works:** Naming what changes and what doesn't, specifically.

"The agent handles first-line invoice categorization. That used to take 2 hours a week. Your job is now handling the 15% of invoices that the agent flags for review — the complex cases, the new suppliers, the ones where something is unusual. That work is more interesting and it's the work that matters."

If the honest version of this conversation is "yes, we're going to need fewer people to do this function," that's a harder conversation. But it's a conversation that deserves to be had directly, not managed with ambiguity. The people who are most anxious are usually the ones who sense that nobody's being straight with them.

---

## The rollout approach that actually works

**Don't mandate. Find the early adopter.**

There's always one person in every team who's curious, who's been using AI in their personal life, who's slightly frustrated with the manual workflow and eager for a better one. Find them before you build the agent. Build the agent around their specific workflow and let them help you test it. When you roll out, they become the internal advocate — "I've been using this for three weeks and here's what it changed for me" carries more weight than any announcement you'll ever send.

Mandated adoption creates compliance. Organic advocacy creates actual use.

**Give them their own numbers.**

General statistics about AI productivity don't change behavior. Your team's own before-and-after numbers do.

If you can, have a few early adopters track their time on the relevant task for two weeks before the agent rollout. Track it after. "Before: 3.5 hours a week. After: 50 minutes" is concrete enough to believe and concrete enough to act on. People trust data from their own team more than anything else.

**Stay present during rollout.**

The biggest mistake Agent Operators make: build the agent, send the announcement, disappear to build the next thing. Then wonder three months later why adoption is at 40%.

For the first month after any rollout, check in with the team weekly. Specifically ask: "What's working? What's frustrating? What's making you route around it?" Collect the friction points. Fix the ones you can fix quickly. Communicate the ones that are on your list.

Being visibly present — "I know the contract reference format is annoying, I'm fixing it this week" — builds the trust that drives actual adoption.

---

## The thing that kills adoption faster than anything else

A confident wrong answer in a high-stakes moment.

Every time the agent produces a bad output that a real user acts on — sends to a client, uses in a decision, shares with leadership — you get a story. That story spreads. "I used the AI thing and it told me the wrong delivery date and I passed it on to the client and we had to call them back and apologize." That story reaches everyone in the team within a week, and the half of them who were already skeptical will cite it for the next six months.

You cannot prevent this entirely. But you can dramatically reduce the frequency. Run your evaluations. Test your edge cases. Know the failure modes before you expand scope. Don't roll out to 30 people until the agent is passing 18/20 test cases consistently.

The adoption math works both ways: one bad public failure can undo three months of good adoption progress. One visible, well-documented win — "it caught a clause discrepancy that would have cost us $40K" — can accelerate adoption faster than any training session.

---

## Try this today

Look at the team the agent is deployed to. Find the one or two people who seem to have genuine reservations — not the vocal skeptics who will complain about anything, but the thoughtful, capable people who just aren't using it much.

Have a direct conversation. Ask them: what would have to be true for you to trust this? What specifically feels uncertain?

You will learn more in that 20-minute conversation than in all the usage analytics you've been looking at. And you'll almost certainly find one specific, fixable thing that's driving their hesitation.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Article 7: agent-operator-cost-control
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: 'agent-operator-cost-control',
    angle: 'process',
    title: 'Keeping your agent costs under control as you scale',
    excerpt: "Your Claude bill went from $200 to $2,000 and you can't explain why. The four cost drivers — bloated system prompts, unnecessary context loading, high failure rates, and no usage monitoring — each have fixes. Cost per task is the metric that matters, not total spend.",
    readTime: 7,
    cluster: 'Infrastructure & Deployment',
    audience: ['operator', 'developer'],
    termSlug: 'ai-agent',
    body: `You had one agent running well. Then two more. Then five. The monthly Claude usage bill, which was $200 when you started, is now $2,000. And when your CFO asks why it went up 10x, you don't have a clean answer.

This is a normal place to find yourself. The cost model for AI agents is genuinely different from most software tools, and most Agent Operators don't develop a working mental model of it until the bill arrives.

Here's what you need to understand — and what to do about it.

---

## How agent costs actually work

You pay per token. A token is roughly a word (or a few characters) of text. You pay for tokens going in (the system prompt, the context documents, the user's message) and tokens coming out (the agent's response).

The critical thing to understand: **the system prompt runs on every single interaction.**

If your system prompt is 2,000 words and your agent handles 500 queries a day, that's roughly 1 million tokens per day just from the system prompt — before any user messages or responses are counted. At current Claude pricing, that's meaningful money. And it compounds: if you add a second agent with a 2,000-word system prompt, you've doubled that component of your cost.

This is why costs go from linear to non-linear as you scale. It's not just that you have more agents — it's that the system prompt cost multiplies with every interaction on every agent.

---

## The four cost drivers

### Driver 1: Bloated system prompts

System prompts have a tendency to grow. You add an edge case instruction. You add an example to make the format clearer. You add a warning about a sensitive topic. Each addition made sense at the time. Six months later, what started as a 400-word system prompt is 2,000 words.

A 2,000-word system prompt costs 5x a 400-word one for every interaction. If your agent runs 300 times a day, that's 5x the cost of all your input tokens — which might be a $200/month difference, might be $800/month, depending on volume and model.

**The fix:** Quarterly system prompt audit. Go through each prompt and ask:
- Is every instruction here actually doing something? (Remove defensive clauses that are never triggered)
- Can any of these examples be moved to a reference document that only gets loaded when needed?
- Is this instruction still relevant, or is it from an edge case we solved three months ago?

A disciplined edit that brings a 2,000-word prompt to 800 words won't hurt quality — it often improves it. Shorter, clearer prompts usually outperform long ones.

### Driver 2: Unnecessary context on every call

There's a temptation to preload everything the agent might ever need into the context. Your entire company handbook. The full product catalog. Three years of policy documents. The thinking is: better to have too much than too little.

The problem: you're paying for all of it on every call, even when 90% of it is irrelevant to the specific query.

**The fix:** Think about what the agent actually needs for a typical query versus what it might need for an unusual one. If 80% of queries only need 5 documents, don't load 50. For the uncommon cases that need more, consider using Claude's retrieval capabilities (native connectors, as discussed in the [integration article](/articles/wiring-internal-systems-to-agents)) to fetch the specific relevant content per query rather than pre-loading everything.

### Driver 3: High failure rate causing retries

When an agent fails — produces a wrong answer, an unhelpful response, or a confusing output — users retry. Sometimes they retry manually. Sometimes they retry automatically. Either way, you're paying for the failed interaction and the retry.

A 20% failure rate means you're paying for roughly 1.2 interactions for every task actually completed. At scale, that's a substantial cost premium.

**The fix:** This is the cost argument for investing in evaluation. Fixing reliability doesn't just improve quality — it directly reduces cost. An agent that fails 5% of the time instead of 20% is processing 15% fewer total tokens for the same number of useful outputs.

### Driver 4: No visibility on usage

If you don't know which agent is generating the most cost or why, you can't fix it. Most Agent Operators see the total bill and can't attribute it — they're flying blind.

**The fix:** Claude for Work admin console → Usage. Review weekly, not monthly. Look at:
- Which agents have the highest token volume?
- Are any agents spiking unexpectedly?
- Is the cost per task stable or trending upward?

A usage spike in a specific agent usually points at one of the other three drivers — a prompt that grew, a context expansion, or a rash of failures. The monitoring tells you where to look.

---

## The metric that matters: cost per task

Total spend is the wrong number to manage. It will always go up as you deploy more agents and handle more volume. The question isn't "are we spending more?" — it's "are we spending less per task as we scale?"

Cost per task = total monthly Claude spend ÷ total tasks completed across all agents

If this number is going down over time, you're getting more efficient as you scale. Good.

If it's going up despite growing volume, something is wrong — usually one of the four drivers above. Find it.

---

## The conversation with your CFO

Most companies bucket their Claude usage in the IT software budget. Levie's observation is worth taking seriously here: as agents take over real operational tasks, the cost of running them should be compared to the operational cost it's replacing, not to other software licenses.

The frame that works with finance leadership:

"Our Claude spend is $2,000/month. The agents are handling 1,800 supplier invoice categorizations per month — tasks that were taking Sarah's team approximately 4 hours a day collectively. At fully-loaded labor cost, that's roughly $15,000/month of work. The cost-to-value ratio is solid. We're also handling [X more tasks]. Here's how it's trending."

This frames the spend as OPEX tied to a function, not as an IT line item that needs to be justified against other software costs. Finance understands "this costs $2K and saves $15K." They are much less equipped to evaluate "$2K/month AI vs $3K/month CRM add-on."

---

## The mistake that makes costs worse, not better

Cutting quality to cut cost.

When an Agent Operator sees a high bill, the first instinct is often to shorten system prompts aggressively, or to reduce the amount of context loaded. Sometimes this works. More often, shorter prompts that produce worse outputs create a different cost problem: higher failure rates, more retries, more manual work downstream, and eventually loss of user confidence that requires expensive rebuilding.

The right place to cut is the fat in your prompts — defensive clauses that aren't triggered, outdated examples, redundant instructions. Not the substance.

---

## Try this today

Open your Claude for Work admin console and look at your usage data. Find your highest-volume agent. Calculate its rough cost per task: divide last month's usage cost attributed to that agent by the number of interactions.

Is that number what you'd expect? Is it trending up, down, or flat?

If you can't attribute costs by agent, that's the first thing to fix — you can't manage what you can't measure.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Article 8: agent-operator-roi-reporting
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: 'agent-operator-roi-reporting',
    angle: 'role',
    title: 'Showing AI ROI to your CEO — what to measure and how to report it',
    excerpt: "Your CEO doesn't want a technology update. They want to know if the investment is working and whether to do more. Three types of evidence actually work: time saved, error rate improvement, and throughput. Here's how to measure them and how to present them.",
    readTime: 7,
    cluster: 'Business Strategy & ROI',
    audience: ['operator'],
    termSlug: 'ai-agent',
    body: `Ninety days in. Your CEO schedules a check-in and asks: "So what has the AI stuff actually delivered?"

You don't want to answer with "it's been really promising" or "the team is excited about the possibilities." Those answers destroy credibility faster than any bad demo. Your CEO came back from a conference, handed you this responsibility, and has been mostly leaving you alone to figure it out. They're not asking because they're curious. They're asking because they want to decide whether to invest more.

You need a real answer. Here's how to have one.

---

## Why traditional ROI doesn't work for agents

Most ROI calculations look for revenue impact: does the investment generate more revenue, or reduce direct costs? Agents can do both, but often indirectly. The contract review agent that catches problematic clauses doesn't generate revenue — it prevents revenue from leaking. The invoice triage agent that saves Sarah 3 hours a week doesn't reduce headcount — it frees Sarah to do the work that requires judgment.

This doesn't mean the ROI isn't real. It means the measurement model has to account for the indirect path.

The three types of evidence that actually work with executives each have a different measurement approach — and you need to know which one applies to each agent you're running.

---

## Type 1: Time saved (most credible, most commonly available)

This is the easiest to measure and the most intuitive for any executive to understand.

**Before:** "Maria spends approximately 4 hours a week on supplier invoice triage — sorting incoming invoices by category, flagging discrepancies, routing to the right approver."

**After:** "Maria spends about 40 minutes a week on the same function — the agent handles initial categorization and routing. Maria reviews flagged items and handles exceptions."

**The number:** 3.3 hours/week × $58/hour fully-loaded cost × 50 working weeks = **~$9,600/year for one person.**

If you have three people who were doing this task and they're all down to 40 minutes, multiply by three.

**How to get this number reliably:**

The mistake most Agent Operators make is not establishing the baseline. If you deploy the agent and then try to figure out how long it used to take, you're estimating. Your CEO will press on the estimate and you'll have nothing solid.

Before you deploy any agent, ask the people who currently do the task to track their time on that specific task for two weeks. Not every task — just the one the agent will handle. Use a simple shared spreadsheet: name, date, task, minutes. It takes 30 seconds per session and produces numbers you can defend.

After rollout, track for two more weeks. The before/after comparison is now a measurement, not an estimate.

Even rough numbers are better than estimates. "We tracked it for 3 weeks: average dropped from 18 minutes per invoice to 4 minutes" is defensible. "We think it saves about 75% of the time" is not.

---

## Type 2: Error rate or quality improvement

This works when the value comes from catching mistakes, not saving time. Contract review, compliance checks, quality control, data validation — the ROI is in the downstream cost of errors that didn't happen.

**Before:** "Our contract review process caught clause issues in about 60% of contracts before signing. We tracked 3 contract disputes in Q4 that could have been caught earlier — combined rework cost was approximately $85K."

**After:** "The agent flags clause patterns we trained it to recognize. Independent review of 40 contracts over the last 6 weeks: agent flagged issues in 82% of cases that had actual problems, versus our previous 60% catch rate."

**Why this works with executives:** The cost of the errors you're preventing is almost always much larger than the cost of running the agent. One prevented contract dispute that would have cost $30K in rework pays for 6 months of Claude usage. You don't need to claim you prevented every error — just that you improved the catch rate and the math on prevented errors is favorable.

**How to get this number:**

You need a baseline catch rate, which means you need to track how many issues your current process catches and how many slip through. For most companies, you'll find this in downstream data: contract disputes, invoice discrepancies that required rework, quality failures, compliance flags that should have been caught earlier.

Establish this baseline before you deploy. After rollout, track the agent's performance on the same metric. The comparison becomes the evidence.

---

## Type 3: Throughput and capacity

This works when the value comes from doing more with the same team — handling more volume, processing more requests, serving more customers without adding headcount.

**Before:** "Our customer service team handles approximately 90 tickets per day manually. Average first-response time is 6 hours."

**After:** "With the triage agent handling first-line categorization and routing — and drafting responses for standard request types — we're handling 90 tickets per day with the same team, but complex escalation time is down 40% because tier-1 time has been cut significantly. And we've absorbed a 20% volume increase from the new account additions without adding staff."

**Why this works:** Same cost, more output, or same output during a period of growth without additional cost. Both are compelling to a CFO.

**How to get this number:** Pull from your ticketing system, CRM, or whatever system of record tracks volume and cycle time. This data usually already exists — you just need to pull the before and after comparisons.

---

## The monthly update format that actually lands

Once a quarter, or whenever asked, provide a one-pager with this structure:

**What's running:** A 2–3 bullet list of active agents and what each one handles. One sentence each. Not technical — functional.

**What it's handling:** Numbers per agent. Choose whichever metric is most meaningful: tasks handled per week, time saved per person, volume processed.

**What it's costing:** Total monthly Claude spend. Don't hide it — present it alongside the value.

**What we're building next:** One sentence on the next agent and why it was prioritized.

**The question you're answering:** Not "is this ROI positive?" — that's a threshold question that leads to a yes/no. The real question your CEO is asking is: "Should we be doing more of this?" Answer that. "Yes — the next highest-value workflow is supplier onboarding communications. Based on volume, we estimate similar time savings as the invoice triage agent. Here's what it would take to build it."

---

## What kills your credibility with this report

**Claiming ROI you didn't measure.** "We estimate this saves approximately 40% of the time" — when you didn't track it — reads as a guess. Your CEO has seen enough inflated estimates from technology projects to be skeptical. If you didn't measure it, say so, and describe what you'll track going forward.

**Activity metrics instead of outcome metrics.** "We ran 1,200 agent queries this month" is an activity metric. It says nothing about value. "The invoice triage agent handled 340 categorizations, saving approximately 6 hours of work per week" is an outcome metric. Use outcome metrics.

**Comparing to the cost of premium software.** "The Claude bill is lower than what we'd pay for another Salesforce seat" is a comparison that makes no sense to your CEO. The right comparison is to the cost of the work the agent is replacing.

---

## The longer game

Your first ROI report is about defending the investment. Your second and third are about expanding it. The frame that builds long-term credibility:

"We now have 3 agents running. Two are clearly delivering value — I have the numbers. One is still in validation. Here's what I've learned about which types of workflows are best suited to agents, and here's my recommendation for what to build next."

This is the Agent Operator who builds institutional support for the initiative over time. Not because they oversell results, but because they're honest about what they know and what they don't — and they keep delivering reliable results.

---

## Try this today

Go back to your most important running agent. Can you quantify the time it's saving, the quality it's improving, or the volume it's enabling? If yes, write those numbers down. If no, set up the tracking you'll need to have those numbers in 30 days.

Before your next CEO check-in, you'll want at least one agent with a clean before-and-after story. Start building that story now.`,
  },
]

async function seed() {
  console.log('Seeding Agent Operator articles...\n')

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
