/**
 * FDE Foundation — 4 articles establishing AI Codex as the definitive resource
 * for Forward Deployed Engineer career content.
 *
 * 1. what-is-a-forward-deployed-engineer
 *    The definitional anchor. Covers the $1.5B Anthropic / $10B OpenAI deployment
 *    company launches, what an FDE actually does, where the role came from (Palantir),
 *    the hiring explosion, compensation, and the honest filter.
 *    Cluster: Business Strategy & ROI. Angle: def.
 *
 * 2. how-to-become-forward-deployed-engineer
 *    The career path nobody has written. Addresses Aaron Levie's gap directly.
 *    Four-part skill stack, three transition paths (CS student, SWE, consultant),
 *    interview prep, and the honest filter.
 *    Cluster: Business Strategy & ROI. Angle: process.
 *
 * 3. fde-portfolio-projects
 *    The 5 portfolio projects that signal FDE readiness. Specific, actionable.
 *    MCP servers, eval frameworks, enterprise integrations, ADRs, post-mortems.
 *    Cluster: Infrastructure & Deployment. Angle: process.
 *
 * 4. fde-for-career-counselors
 *    Written for career advisors, CS departments, bootcamp instructors.
 *    Distribution play — meant to spread through career infrastructure channels.
 *    Cluster: Business Strategy & ROI. Angle: role.
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-fde-foundation.ts
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
  // Article 1: what-is-a-forward-deployed-engineer
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: 'what-is-a-forward-deployed-engineer',
    angle: 'def',
    title: 'What is a Forward Deployed Engineer — and why every AI company is hiring for them now',
    excerpt: "Anthropic and OpenAI both launched billion-dollar deployment companies in the same week — and both are built around the same type of engineer: someone who moves into a company, builds production AI systems against their actual messy environment, and leaves something that lasts. That engineer has a name now.",
    readTime: 11,
    cluster: 'Business Strategy & ROI',
    audience: ['developer', 'founder'],
    termSlug: 'ai-agent',
    body: `In the same week in early 2026, two of the most powerful AI companies in the world announced something unusual: they weren't just building better models. They were building deployment companies.

[Anthropic launched a $1.5B joint venture](https://www.anthropic.com/news/enterprise-ai-services-company) with Blackstone, Goldman Sachs, and Hellman & Friedman. [OpenAI launched "DeployCo"](https://openai.com/index/openai-launches-the-deployment-company/) — a $10B operation with McKinsey, Bain, and Capgemini — and acquired Tomoro, a 150-person FDE firm, to staff it immediately.

The question worth asking: if you have the best AI model in the world, why do you need a separate $10B deployment company?

The answer is the last-mile problem. Building Claude or GPT-4o is the hard part of AI research. Getting it to actually change how a 50,000-person pharmaceutical company runs their clinical trial workflows — against their undocumented internal APIs, their 15-year-old ERP, their data scattered across three cloud environments — that's a different problem entirely. It requires an engineer who can operate inside a company, not just consult from outside it.

That engineer is a Forward Deployed Engineer.

---

## The clear definition

A Forward Deployed Engineer embeds directly inside a client company and builds production AI systems against their actual technical environment. Not a pilot. Not a proof of concept. Production systems.

The word "forward deployed" is military in origin — it means stationed in the field, not at headquarters. For software engineers, it means working inside the client's systems, on their infrastructure, against their constraints, with their stakeholders.

Here's what an FDE is **not**:

| Role | What they do | What they don't do |
|------|-------------|-------------------|
| Solutions Engineer | Demos software | Writes production code |
| Consultant | Delivers strategy decks | Owns the implementation |
| Sales Engineer | Proves the product works | Stays for the complexity |
| Forward Deployed Engineer | Builds production systems inside the client | All of the above |

The distinction matters because the FDE model is fundamentally different from consulting. A consultant leaves a recommendation. An FDE leaves a working system. A consultant's deliverable is a document. An FDE's deliverable is deployed, running code.

---

## What an FDE actually builds

Pull up the [Anthropic FDE job listing](https://job-boards.greenhouse.io/anthropic/jobs/4985877008) and the deliverables are specific:

- **MCP servers** — Model Context Protocol servers that connect Claude to internal data sources: the CRM, the data warehouse, the internal knowledge base, the legacy ticketing system. FDEs build the plumbing that makes AI actually know what the company knows.
- **Sub-agents and agent skills** — Not just "use the API." Production agent architectures with tool routing, fallback handling, access control layers. Agents that work in messy real-world conditions.
- **Evaluation frameworks** — How do you know the AI is actually doing the right thing? FDEs build the eval suites that measure quality, catch regressions, and give stakeholders confidence that the system works.
- **Production deployment** — Auth, observability, rate limiting, error handling. The full engineering work required to put something in front of real users at scale.

Here's a concrete example. A pharmaceutical company wants AI to help clinical trial managers answer questions about their trial protocols. An FDE's job isn't to write a prompt. It's to:
1. Map the existing data sources (trial databases, regulatory documents, internal wikis — probably three different systems that don't talk to each other)
2. Build an MCP server that connects Claude to all three with appropriate access controls (clinical trial data has regulatory requirements)
3. Design an agent that routes questions to the right data source
4. Build an eval framework using real questions from trial managers to measure accuracy
5. Deploy it with monitoring so the team knows if output quality degrades
6. Hand it off to the client's engineering team with documentation they can actually maintain

That project might take 6–12 weeks. A consultant would have spent weeks 1–4 writing a strategy document. The FDE spent those same weeks building the system.

---

## Where the role comes from

[Palantir](https://www.palantir.com/docs/foundry/ai-fde/overview) invented this model. They called their version Forward Deployed Engineers going back over a decade, embedding engineers inside government agencies and defense contractors to build data systems against the most hostile technical environments imaginable — classified networks, legacy databases from the 1980s, bureaucracies that had never shipped software before.

The model worked. Palantir became one of the few enterprise software companies that actually delivered on its promises, because they sent engineers to solve the problem on site rather than shipping software and leaving clients to figure it out.

The rest of the industry is now catching up. EY [launched FDE roles in the UK in April 2026](https://www.ey.com/en_uk/newsroom/2026/04/ey-launches-fde-roles). Accenture [launched an FDE practice](https://newsroom.accenture.com/news/2026/accenture-launches-microsoft-forward-deployed-engineering-practice-to-help-organizations-scale-ai-across-the-enterprise) with Microsoft and ServiceNow. Deloitte and Google have deployed similar programs. The model went from "Palantir's unusual strategy" to "the obvious answer to enterprise AI deployment" in roughly 18 months.

---

## The current hiring explosion

The numbers are not subtle. FDE hiring is up 800% since January 2025.

Who's hiring:

**The AI labs directly:**
- Anthropic (via their $1.5B enterprise AI services joint venture)
- OpenAI (via DeployCo + Tomoro acquisition)
- Scale AI (FDE team supporting enterprise customers)

**The Big 4 and consulting firms:**
- EY (April 2026, UK launch, expanding globally)
- Accenture (Microsoft + ServiceNow FDE practices)
- Deloitte (AI Center of Excellence, FDE roles)
- Capgemini (part of the OpenAI DeployCo structure)

**Enterprise companies hiring internally:**
Banks, pharma companies, logistics firms, and government contractors are all building internal FDE functions rather than outsourcing indefinitely. If you're at JPMorgan's AI group, or Pfizer's digital transformation team, you're doing FDE work with a different title.

**Specialized firms and job boards:**
[fwddeploy.com](https://www.fwddeploy.com/) has become the dedicated job board for this category. [FDE Academy](https://fde.academy/) launched as a training pathway. This is a role category large enough to have its own job board. That's a meaningful signal.

---

## What companies look for

The [Anthropic FDE job listing](https://job-boards.greenhouse.io/anthropic/jobs/4985877008) is the clearest public specification for what this role requires. It's worth reading in full if you're considering the path.

The explicit requirements:

- **3+ years in a technical, customer-facing role** — not just building, but building in contact with users and stakeholders
- **Production experience with LLMs**: advanced prompt engineering, agent development, evaluation frameworks, deployment at scale
- **Strong Python** — plus TypeScript and/or Java
- **Experience shipping production applications** — not just side projects

The deliverables specified in the listing: MCP servers, sub-agents, agent skills in production workflows.

Two phrases appear in essentially every FDE job description, across every company:

**"High agency"** — The ability to identify what needs to be done and do it without being told. In a client environment, you often don't have a manager who knows the right answer. You have to figure it out.

**"Navigate ambiguity"** — Client environments are messy. Requirements are incomplete. Systems are undocumented. Stakeholders disagree. FDEs have to build in conditions where the specs change while you're building.

---

## Compensation

The range is wide because the seniority range is wide:

| Level | Typical Total Comp |
|-------|-------------------|
| Entry-level FDE (3–5 years exp) | $180K–$250K |
| Mid-level FDE (5–8 years exp) | $250K–$450K |
| Senior FDE / Staff FDE | $450K–$700K+ |

Why does it pay this well? Because it requires a combination of skills that's genuinely rare:

1. **Deep technical ability** — You have to be able to build production systems quickly in unfamiliar codebases
2. **Business acumen** — You have to understand what the client actually needs, not just what they said
3. **Communication under pressure** — You're in the room with executives. You explain technical decisions in non-technical terms, in real time
4. **High tolerance for ambiguity** — You can't wait for full specs. You have to build while discovering what you're building

Most engineers are strong on #1. Some have #4. Very few have all four at a level that makes the FDE model work. That scarcity drives the compensation.

---

## Is this role right for you?

The honest filter:

**Who thrives as an FDE:**
- Engineers who find standard product roles too slow and too internally focused
- People who genuinely enjoy figuring out undocumented systems
- Engineers who are as comfortable in a stakeholder meeting as in a codebase
- People who get energy from delivering something real for a real user, not from shipping a PR

**Who struggles:**
- Engineers who need clear specs before starting (you will not have them)
- People who find client work draining rather than energizing
- Engineers who want to go deep on one codebase for years (FDE assignments rotate)
- People who prefer building greenfield projects to fixing what exists

The FDE model is not for everyone. It's a specific combination of engineering and embedded operator. If the idea of walking into a Fortune 500's data infrastructure and building something production-worthy in 10 weeks sounds exciting, this is the path. If it sounds exhausting, that's useful information too.

---

## How to get there

If you're a developer or recent CS graduate considering this path, the career guide covers the four-part skill stack and the three realistic transition paths in detail.

→ See [How to become a Forward Deployed Engineer](/articles/how-to-become-forward-deployed-engineer)

If you want to build a portfolio that signals FDE readiness, the portfolio guide covers the five specific projects that hiring managers look for.

→ See [The 5 portfolio projects that signal FDE readiness](/articles/fde-portfolio-projects)

---

## The bigger picture

The FDE hiring explosion is a consequence of a structural reality: the gap between what AI can do in a research environment and what it actually does inside a real enterprise is enormous. Models are capable. Deployment is hard. The engineer who can close that gap — who can walk into a company, understand their systems, build production AI against their actual environment, and leave something that works — is worth an extraordinary amount.

Anthropic and OpenAI didn't launch billion-dollar deployment companies because they ran out of model improvements to make. They launched them because they understand that the model is not the product. The deployed, working system inside the client is the product. And building that system requires a specific kind of engineer.

That engineer has a name now. The role is here. The demand is real.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Article 2: how-to-become-forward-deployed-engineer
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: 'how-to-become-forward-deployed-engineer',
    angle: 'process',
    title: 'How to become a Forward Deployed Engineer — the path nobody has written down yet',
    excerpt: "Aaron Levie said career counselors should be figuring out how to help students get these jobs. The path exists — 800% hiring growth, $180K–$700K+ comp, every major AI company hiring. It just hasn't been written down anywhere useful. Until now.",
    readTime: 10,
    cluster: 'Business Strategy & ROI',
    audience: ['developer', 'founder'],
    termSlug: 'ai-agent',
    body: `In May 2026, Aaron Levie — Box CEO, someone who has watched enterprise software hiring for two decades — posted that career counselors should quickly figure out how to help students get forward deployed engineer jobs. The hiring explosion is real, the compensation is real ($180K–$700K+ total comp), and career infrastructure hasn't caught up.

The path exists. It's just not written down anywhere useful. Until now.

---

## The reality check before anything else

What makes an FDE different from a senior engineer isn't just technical skills. It's a specific combination that most engineers have only part of:

**1. Technical depth** — You have to be able to build production systems quickly, in unfamiliar codebases, against undocumented constraints. This is table stakes.

**2. Business acumen** — You have to understand what the client actually needs, not just what they said. This means understanding how a company makes money, what their data actually represents, and what the stakeholder asking you for something actually cares about. Not an MBA. Operational intelligence.

**3. Communication under pressure** — You're in the room when decisions get made. You explain architecture decisions to executives who don't code. You translate between the engineering reality and the business expectation, in real time, when both sides are frustrated.

**4. High agency under ambiguity** — This phrase is in every FDE job description. What it actually means: you can identify what needs to be done, decide what to build, and start building it before anyone has given you the full spec — because the full spec will never exist.

Most engineers are strong on #1. Some have #4 instinctively. The combination of all four is what's genuinely rare, and what drives the compensation.

The honest question before you pursue this path: do you have #3 and #4, or do you need to build them? The answer changes what preparation looks like.

---

## The 4-part skill stack

### 1. Technical depth

The [Anthropic FDE job listing](https://job-boards.greenhouse.io/anthropic/jobs/4985877008) specifies the exact technical requirements. They are not vague:

- **Python proficiency** — Not "familiarity." Production Python. You should be able to read a 3,000-line codebase you've never seen, understand what it does, and add to it within hours.
- **TypeScript and/or Java** — Many enterprise environments run Java. TypeScript is everywhere in modern web infrastructure. Pick one to be strong in alongside Python.
- **Agent development** — Not just prompting. Building agent loops with tool use, multi-step reasoning, fallback handling. The [internal MCP server article](/articles/internal-mcp-server-explained) covers the architectural patterns you need to understand.
- **MCP servers** — Model Context Protocol is how Claude connects to external data. Every FDE at Anthropic is building these. Learn the spec. Build one. Then build one that connects three data sources.
- **Evaluation frameworks** — Evals are the thing most junior developers skip and most production systems desperately need. If you can't write an eval suite that catches regressions, you can't maintain a production AI system.
- **Production deployment** — Auth, observability, rate limiting, error handling. The difference between "it works on my machine" and "it works at 1am when the client's biggest customer is using it."

Specific things to build to prove this stack:
- A working MCP server connecting 3 real APIs (not toy examples)
- An agent with tool use that handles failure gracefully
- An eval suite with 20+ test cases for a specific task
- Something deployed — even a small Heroku or Fly.io app that other people can use

### 2. Business acumen

This is the skill most engineers underestimate. An FDE isn't embedded in the client to build what they ask for. They're embedded to figure out what needs to be built, which is often different.

Concretely, this means:
- Understanding how the company makes money — what's the revenue model, what are the constraints
- Understanding what the data means — a CRM "opportunity" means something different at a pharma company than at a SaaS startup
- Understanding stakeholder incentives — the VP asking for this feature has a quarterly review. What are they trying to show? What would make them look bad?
- Understanding organizational dynamics — who has the technical credibility, who has the budget authority, who will block this at the last minute

You don't need an MBA. You need to have worked inside enough businesses that you develop an instinct for how they operate. Internships at real companies — especially in industries you'd want to work in as an FDE — are more valuable than side projects here.

Reading to do: anything that explains how enterprises actually make decisions. Clayton Christensen on jobs-to-be-done. Patrick Lencioni on organizational dynamics. Reading case studies from McKinsey or BCG on enterprise transformation — not to become a consultant, but to understand what problems enterprises pay to solve.

### 3. Communication under pressure

The failure mode here is not "can't talk to non-technical people." Most engineers can explain things. The failure mode is: can you explain things under pressure, in a room where someone is skeptical, when the answer is "this is more complicated than you think"?

This skill is built through practice, not reading. Ways to develop it:
- **Teaching** — TA a course. Lead a workshop. Explain technical concepts to people who don't code. The feedback is immediate.
- **Engineering writing** — Write architecture decision records (ADRs). Write post-mortems. Write technical documentation for non-technical audiences. [This is also portfolio gold — more on that in the portfolio article.](/articles/fde-portfolio-projects)
- **Cross-functional work** — Deliberately take on projects that require you to work with non-engineers. The student who leads a hackathon team that includes non-CS people. The SWE who volunteers to present the eng team's work to the sales org.

The specific pattern FDE interviewers look for: "Tell me about a time you had to explain a technical decision to a non-technical executive." If you don't have an answer to this, you need one before you interview.

### 4. High agency under ambiguity

This is the hardest to fake and the hardest to develop without the right environment.

Signs you have it:
- You've completed a significant project without being told exactly what to do
- You've made architecture decisions without consensus from a team
- You've shipped something when the requirements were incomplete
- You've worked in an environment where "figure it out" was a real instruction, not a complaint

Signs you need to build it:
- Every project you've worked on had clear specs before you started
- You've never shipped something without multiple rounds of review
- You wait for direction before moving

How to build it: take on projects with genuine ambiguity. This might mean: picking a client-facing internship over a structured program. Starting a side project where no one tells you what to build. Contributing to an open-source project where the right approach isn't obvious. The goal is to accumulate decisions — many small ones, building the muscle for making them quickly under uncertainty.

---

## The three transition paths

### Path 1: CS student → FDE

**Timeline:** 18–24 months from junior year to first FDE role

**What to do in school:**
- Pick internships based on technical+client exposure, not brand name. A smaller company where you ship code that real users touch is better FDE preparation than a structured rotation at a big tech company.
- Build the technical stack: Python fluency, agent development, MCP servers. The [portfolio projects article](/articles/fde-portfolio-projects) has the exact list.
- Practice cross-functional communication: TA, workshop, hackathon leadership with non-CS people.
- Apply directly to Anthropic's [Forward Deployed Engineer, Applied AI role](https://job-boards.greenhouse.io/anthropic/jobs/4985877008) after graduation — it's the gold standard, and new grads with strong portfolios are competitive.

**Where to look first:**
Scale AI, Cohere, Anthropic, OpenAI have junior/associate FDE tracks. So does EY's new FDE practice. [fwddeploy.com](https://www.fwddeploy.com/) lists open roles. Palantir hires aggressively from universities — their Forward Deployed Software Engineer role is the classic entry point into this model.

### Path 2: SWE → FDE

**Timeline:** 6–12 months of focused preparation

**Who this works best for:** Engineers with 2–5 years of experience who have shipped production systems, but in internal-facing roles (no client exposure) or without the AI/agent development stack.

**What 6 months of focused prep looks like:**

Months 1–2: Build the AI stack you're missing. If you've never built a production agent, build one. If you've never built an MCP server, build one. Do this in public — real GitHub repos with READMEs that explain your decisions.

Months 3–4: Build the portfolio projects. The [five portfolio projects](/articles/fde-portfolio-projects) are designed to show FDE-specific capabilities: enterprise integration experience, eval frameworks, architecture decision records, post-mortems. If you've never written an ADR or a post-mortem for a real failure, write them now from past experiences.

Months 5–6: Apply and prepare for interviews. The FDE interview is different from standard SWE interviews. See the interview section below.

**What transfers directly from SWE experience:** Production thinking (error handling, observability, performance), systems design, shipping under pressure.

**What you still need to build:** Client communication stories, ambiguity navigation stories, AI-specific technical skills if you haven't worked on LLM applications.

### Path 3: Consultant/analyst → FDE

**Timeline:** 12–18 months to technical proficiency

**Who this works best for:** People coming from business consulting, product management, or data analysis who have strong client and business skills but need to build the technical depth.

**What transfers:** Business acumen (you already understand what clients actually care about), stakeholder communication (you've been in those rooms), ambiguity tolerance (consulting is inherently ambiguous).

**What you need to build:** The technical depth is the hard part. Python proficiency at production level. Agent development. MCP servers. This is genuinely 12–18 months of focused learning if you're starting from scratch on the engineering side.

The honest advice: this path works, but don't underestimate how much engineering depth is required. FDE is not "consultant who knows some AI." It's an engineer who also happens to be good at client work. If you can't build the system yourself, you're a solutions engineer at best.

---

## Where to apply

**Direct:**
- [Anthropic FDE listing](https://job-boards.greenhouse.io/anthropic/jobs/4985877008) — the gold standard
- Palantir Forward Deployed Software Engineer (university and experienced hires)
- OpenAI (via DeployCo — new roles being added monthly)
- Scale AI (FDE team)

**Consulting firms:**
- EY (April 2026 launch, actively hiring)
- Accenture (Microsoft and ServiceNow FDE practices)
- Deloitte AI Center of Excellence

**Job boards:**
- [fwddeploy.com](https://www.fwddeploy.com/) — dedicated FDE job board, the best single resource for open roles

**Enterprise internal roles:**
Large banks, pharma companies, and logistics firms are building internal FDE functions. JPMorgan, Goldman Sachs, Pfizer, and UPS all have roles that are functionally FDE work under different titles. Search for "Applied AI Engineer," "AI Implementation Engineer," or "Enterprise AI Engineer" at these companies.

---

## The interview

FDE interviews are different from standard software engineering interviews. What to expect:

**Live system design for enterprise AI** — Not "design Twitter." More like: "A retail company has sales data in Salesforce, inventory in an ERP, and customer service tickets in Zendesk. They want AI to help their regional managers make better inventory decisions. How do you build it?" You're being evaluated on your ability to decompose a real enterprise problem, not just your knowledge of distributed systems patterns.

**Behavioral on ambiguity and client communication** — Questions like:
- "Tell me about a time you had to deliver something when the requirements weren't clear."
- "Tell me about a time you had to explain a technical decision to a non-technical executive."
- "Tell me about something you shipped that broke in production and how you handled it."

These are not soft questions. They're evaluating specific capabilities that determine whether you can actually do the job.

**Architecture decomposition case study** — Take a real enterprise problem and whiteboard the architecture. The evaluation criteria: Did you ask the right clarifying questions? Did you identify the right constraints? Did you make defensible design decisions or just go with the most obvious answer?

**Preparation advice:** Have specific stories ready for all three behavioral categories. Practice explaining technical architecture decisions in plain English — out loud, not just in your head. Review the [portfolio projects article](/articles/fde-portfolio-projects) and make sure you can speak fluently about every decision you made in each project.

---

## The honest filter

**You'll thrive as an FDE if:**
- You've always felt like engineering roles are too internally focused — you want to see your work actually land with real users and real organizations
- You're comfortable being in meetings that engineers normally don't attend
- You can make decisions without full information without it paralyzing you
- You find messy real-world environments more interesting than clean greenfield projects

**You should look elsewhere if:**
- You need clear specs before you can start building
- Client work sounds exhausting rather than energizing
- You prefer going deep on one codebase for years rather than rotating through different environments
- You want a predictable engineering role with stable requirements

This is a genuine filter. The role is high-stakes, high-autonomy, and high-reward. Being clear-eyed about whether it fits you is useful information, not a failure.

The path is real. The demand is real. The compensation reflects the scarcity. If the filter passes, the next step is the portfolio.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Article 3: fde-portfolio-projects
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: 'fde-portfolio-projects',
    angle: 'process',
    title: 'The 5 portfolio projects that actually signal FDE readiness',
    excerpt: "A GitHub full of side projects tells an FDE hiring manager that you can code. What they actually want to see is evidence that you can build in the real world — against legacy systems, ambiguous requirements, and non-technical stakeholders. These five projects show exactly that.",
    readTime: 9,
    cluster: 'Infrastructure & Deployment',
    audience: ['developer'],
    termSlug: 'ai-agent',
    body: `Most developer portfolio advice is the same: build three projects, put them on GitHub, write a README. That advice works for standard software engineering roles. FDE hiring is different.

FDE hiring managers are evaluating something specific: can you build production AI systems inside a real enterprise environment, against undocumented APIs, incomplete requirements, and non-technical stakeholders? A clean tutorial-complete project doesn't answer that question. It answers a different question: can you follow instructions?

These five projects are designed to answer the right question.

---

## What FDE interviewers actually look for

Before the projects themselves, it's worth understanding the evaluation criteria. When an FDE interviewer reviews your portfolio, they're looking for:

**Production thinking** — Error handling, observability, access control, graceful degradation. Does the project handle failure modes, or does it just work when everything goes right?

**Architecture decision-making** — Not just "here's what I built." Why did you build it this way? What did you consider? What did you reject? A project without architecture reasoning is a project that tells them you built it, not that you know how to design systems.

**Communication for a non-technical audience** — Can a non-engineer understand what you built and why? FDEs spend significant time with stakeholders who don't code. Your README and documentation are a proxy for this skill.

**Evidence of real-world constraints** — Did you deal with anything messy? Authentication issues, undocumented API behavior, data inconsistency, rate limits? Projects with no friction suggest you've only worked in clean environments.

---

## Project 1: An MCP server that connects 3+ real data sources

**Why this works:**

[Anthropic's FDE job listing](https://job-boards.greenhouse.io/anthropic/jobs/4985877008) explicitly lists MCP server development as a deliverable. This is not a generic "show you know APIs" project. MCP servers are how FDEs connect Claude to enterprise data — the internal CRM, the data warehouse, the ticketing system. Building one that connects multiple sources demonstrates you understand data access patterns, authentication, and routing, which is the core technical architecture of almost every enterprise AI deployment.

**What to build:**

An MCP server that connects at least 3 real data sources. Not toy examples. Good combinations:
- GitHub (via API) + Notion (via API) + a CRM API (HubSpot has a free tier)
- Slack (via webhook) + Linear or Jira + a database you control
- Any combination that involves a structured data source, an unstructured knowledge source, and an action-capable source

The repo should have a clear README that explains:
- What the server does
- Why you chose these three data sources (what use case does this serve?)
- How authentication works for each source
- What happens when one source is unavailable

**What to include:**

An access control layer. Even a simple one — not every tool should be available to every query. Showing that you thought about who can access what signals production thinking that most junior developers skip.

Error handling for each source individually. If the GitHub API is rate limited, the server should degrade gracefully, not crash. Document what happens in each failure case.

**What not to do:**

Don't wrap three toy APIs that return static data. The point is real APIs with real authentication, real rate limits, real inconsistent behavior. The friction is the point.

---

## Project 2: An evaluation framework for a real use case

**Why this works:**

Production AI agents fail in ways that are genuinely hard to detect without a formal eval suite. Most junior developers skip evals entirely and rely on "it works when I test it." FDE hiring managers know this is how production systems accumulate silent failures. An eval framework shows you think about reliability and regression prevention — the thing that separates "built it" from "shipped it and maintained it."

**What to build:**

Choose a specific agent workflow — not "is the model good?" but something like: "An agent that answers questions about a company's HR policies from a document corpus" or "An agent that routes customer support tickets to the right team." Then build an eval suite for that specific workflow.

The suite should include:
- At least 20 test cases
- Cases that cover edge cases and failure modes, not just easy examples
- A way to run the suite and see results in aggregate (pass rate, failure patterns)
- Documented failure modes you found during development

**What to include:**

Show the failure modes you found. An eval suite that shows 100% pass rate on the first version looks like you wrote easy tests. An eval suite that shows 73% pass rate, followed by the fixes you made, followed by 94% pass rate, shows you actually found real problems.

Document your scoring methodology. How did you decide what "correct" means for this task? This is a design decision with real consequences.

**What not to do:**

Don't build a generic "LLM quality evaluator." That's a product, not a portfolio project. Build an eval for one specific task, done well, and explain why the cases you chose are the right cases.

---

## Project 3: An enterprise integration with real constraints

**Why this works:**

FDEs work inside legacy enterprise environments. This is not optional context — it's the core of the job. A project that shows you've dealt with undocumented APIs, authentication headaches, data inconsistencies, or compliance-adjacent requirements signals that you've encountered real-world engineering, not just tutorial engineering.

**What to build:**

An integration with a real enterprise tool. Options that work well:
- Salesforce (free developer edition available) — their API is well-documented but their data model is complex
- A legacy database — set up a PostgreSQL or MySQL instance with a realistic messy schema and build an AI layer on top of it
- An ERP simulator — some open-source ERP tools exist for exactly this purpose
- Any internal tool at a company where you've worked or interned — even a small integration counts

**What to document:**

This project's value is in the documentation, not just the code. You need to write about:
- What broke or was unclear when you started
- How you figured out the undocumented behavior
- What you'd do differently
- What a non-technical stakeholder would need to understand about how this integration works

If you've built this at an actual company (internship, job, freelance), document the real constraints and challenges. Anonymize the company if needed — the details are what matter, not the name.

**What makes this project genuinely valuable:**

It's evidence of adaptability. Anyone can build against a well-documented REST API that returns consistent JSON. Not everyone has dealt with an API that sometimes returns XML and sometimes JSON, or a database where the "customer_id" field means different things in different tables. Those are the conditions FDEs work in every day.

---

## Project 4: A written architecture decision record (ADR)

**Why this works:**

This one is not code. It's a document. But it might be the most differentiating project on this list.

FDEs are constantly explaining architecture decisions to non-technical executives and stakeholders. The ability to write a clear, honest ADR — explaining what you chose, what you rejected, what the tradeoffs were, and what you'd revisit — is a direct signal of communication skill that most technical portfolios don't demonstrate at all.

**What to write:**

Pick one architecture decision from one of your other portfolio projects. Write a 1–2 page document covering:
- **The situation** — what were you building, what decision did you need to make
- **The options you considered** — at least 3, with their honest tradeoffs
- **The decision** — what you chose and why
- **What you'd revisit** — with more time, more information, or different constraints, what would you do differently?

**What good looks like:**

A good ADR doesn't pretend the decision was obvious. It shows that you genuinely evaluated alternatives and made a defensible choice. The "what I'd revisit" section is particularly valuable — it shows intellectual honesty and the ability to think past the decision you already made.

**What not to do:**

Don't write an ADR justifying a decision after the fact with only positive framing. The reader should feel like they're watching you think, not reading your defense of a conclusion you'd already reached.

**Where to put it:**

A linked document from your project README. When the interviewer asks "what was the hardest architecture decision in this project?" your answer should start with "I actually wrote an ADR for that" and then link them to it.

---

## Project 5: A post-mortem on something that broke in production

**Why this works:**

The FDE interview almost always includes a variation of: "Tell me about something you shipped that broke. What happened?" Having a written post-mortem shows three things at once: that you've shipped things to production (not just side projects), that you think in systems (not just "my code was buggy"), and that you're honest about failure in a way that signals trustworthiness.

**What to write:**

500–1,000 words covering:
- **What broke** — describe the failure specifically, not vaguely
- **Why it broke** — the root cause, not just the symptom
- **How you diagnosed it** — what was your process for figuring out what happened
- **What you changed** — the fix, but also the process or architectural change you made to prevent it recurring
- **What you'd do differently** — the honest reflection

**What if nothing has broken in production?**

Then you haven't shipped enough to production. This is a signal. Build something real, deploy it somewhere, and accept that it will break in ways you didn't anticipate. If you've only ever built on localhost, the post-mortem isn't available to you yet — and that's a gap worth closing before you interview.

If you've had real production failures at work that you can describe (appropriately anonymized), those count. A post-mortem from an internship where you broke a staging environment is still a post-mortem.

**Where to put it:**

A linked document from the relevant project's README. Or a public post on your personal site or GitHub. The medium matters less than the existence and quality.

---

## How to present the portfolio

**Repository structure:**

Each project should have:
- A README that opens with what the project does and why it exists (not what technologies it uses)
- A section on architecture decisions (link to the ADR if you wrote one)
- A section on known limitations and what you'd improve
- Installation/running instructions that actually work

**In interviews:**

When asked to walk through a project, don't start with the technology stack. Start with: "The problem I was solving was..." Then the constraints. Then the decisions. The technology is context, not the story.

If you've written ADRs and post-mortems for your projects, reference them during the walkthrough. Most candidates don't have them. Having them is a signal.

---

## Red flags to avoid

**Tutorial-complete projects** — If the project is clearly from a tutorial (the dataset is MNIST, the API is a weather API, the structure is exactly like a guide you followed), it signals you haven't moved beyond directed learning. FDE hiring requires independent judgment.

**No error handling** — Check every project. Does it fail silently? Does it throw uncaught exceptions? Does it have any logging? Error handling is the single clearest signal of whether you've thought about production.

**No tests, no evals** — At minimum, you should be able to explain what you would test and how. Better: actually have tests.

**No documentation of what you'd do differently** — Every project should have a "limitations" or "what I'd improve" section. If everything looks perfect, it signals you either don't know enough to see the problems, or you're not being honest. Neither is reassuring to an FDE interviewer.

**Projects that can't be run** — If the interviewer tries to run your project and it fails, that's a significant negative signal. Test your own setup instructions on a clean machine before interviewing.

---

The five projects above are not a checklist to complete mechanically. Each one is designed to answer a specific question an FDE interviewer is asking. The MCP server answers: can you build the enterprise data connectivity layer? The eval framework answers: do you think about reliability, not just capability? The enterprise integration answers: have you dealt with real-world constraints? The ADR answers: can you communicate architecture decisions to a non-technical audience? The post-mortem answers: have you shipped to production and learned from what broke?

If you can answer all five questions, you're ready for the FDE interview.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Article 4: fde-for-career-counselors
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: 'fde-for-career-counselors',
    angle: 'role',
    title: 'The Forward Deployed Engineer: a guide for career advisors and CS departments',
    excerpt: "Aaron Levie said career counselors should quickly figure out how to get students into forward deployed engineer roles. The role exists, it's exploding, and it pays $150K–$700K+ total comp. The career infrastructure just hasn't caught up yet. Here's what to tell students.",
    readTime: 8,
    cluster: 'Business Strategy & ROI',
    audience: ['operator'],
    termSlug: 'ai-agent',
    body: `In May 2026, Aaron Levie — CEO of Box and one of the more consistently accurate observers of enterprise technology — posted that career counselors "need to quickly figure out how to help students get forward deployed engineer jobs."

He's right. The role is real, the demand is massive, and the career infrastructure — career centers, CS departments, bootcamp curricula — hasn't caught up. Students are graduating into an industry that is desperately hiring for a role most advisors have never heard of.

This guide is what career advisors should know, and what to tell students.

---

## What an FDE actually is

In plain terms: a Forward Deployed Engineer is an engineer who moves inside a client company for weeks or months, builds production AI systems against their actual technical environment, and leaves something that works.

The key word is "production." This is not consulting. A consultant leaves a document recommending what to build. An FDE leaves a deployed, running system — connected to the client's real databases, their real APIs, their real infrastructure.

The "forward deployed" framing is military in origin — it means stationed in the field. For engineers, it means operating inside the client's environment rather than building from the outside and handing over software. The engineer is physically and organizationally inside the problem.

A useful comparison table for explaining this to students:

| Role | What they leave behind | Build code? | Client environment? |
|------|----------------------|-------------|-------------------|
| Strategy consultant | A recommendation | No | Rarely |
| Solutions engineer | A demo | Sometimes | Occasionally |
| Implementation partner | A configured product | Sometimes | Yes, but using vendor tools |
| **Forward Deployed Engineer** | **Production AI systems** | **Yes** | **Yes, against their actual systems** |

The simplest way to explain it: imagine a senior engineer who spends six months inside your company, gets access to all your systems, and builds the AI infrastructure you couldn't build yourself. That's the FDE model.

---

## Why this role is exploding right now

The demand surge has a specific cause. AI models are now genuinely capable. The problem is deployment.

When a 50,000-person pharmaceutical company wants AI to help their clinical trial managers, the challenge isn't finding a good AI model. The challenge is that the relevant data lives in three different systems that don't talk to each other, the APIs are undocumented, the compliance requirements restrict how data can flow, and the people who will use the system aren't engineers. No AI company can solve that by shipping better software. Someone has to go in.

Every major AI company has now concluded the same thing:

- [Anthropic launched a $1.5B joint venture](https://www.anthropic.com/news/enterprise-ai-services-company) with Blackstone, Goldman Sachs, and Hellman & Friedman to deploy Claude via embedded engineers
- [OpenAI launched "DeployCo"](https://openai.com/index/openai-launches-the-deployment-company/) — a $10B operation — and immediately acquired Tomoro, a 150-person FDE firm, to staff it
- [EY launched FDE roles in the UK in April 2026](https://www.ey.com/en_uk/newsroom/2026/04/ey-launches-fde-roles), expanding globally
- [Accenture launched an FDE practice](https://newsroom.accenture.com/news/2026/accenture-launches-microsoft-forward-deployed-engineering-practice-to-help-organizations-scale-ai-across-the-enterprise) with Microsoft and ServiceNow
- Deloitte, Capgemini, and Google have similar programs in motion

FDE hiring is up 800% since January 2025. [fwddeploy.com](https://www.fwddeploy.com/) launched as a dedicated job board for this role category. When a role has its own job board, it has become a category.

This is not a niche. This is the emerging labor market for technical AI deployment.

---

## Who should pursue this

The student profile that maps well to FDE work:

**Applied technical background** — CS major or minor with a strong focus on building things, not just theory. The signal is internships where they shipped something real that users touched, not just coursework.

**Shipped something real** — The best FDE candidates have delivered production code in conditions with real constraints. A summer job where they built a small internal tool that the company actually uses. A freelance project for a local business. Anything where there was a real stakeholder and a real deployment.

**Can talk to non-engineers without condescension** — This is rarer than it sounds. Many technically strong students have never practiced explaining their work to someone who doesn't code. Career advisors can help here: does the student have any experience teaching, tutoring, or working in cross-functional teams?

**Self-directed** — FDE work happens in conditions where full requirements are never given. Students who need structured direction before they start will find this role extremely uncomfortable. Students who thrive on ambiguity and have a history of figuring things out independently are natural FDE candidates.

**Interested in how businesses operate** — The best FDEs are genuinely curious about how companies work, not just how code works. Students who have done business-facing internships, read about company strategy, or shown interest in how technology decisions get made organizationally are good candidates.

**Who is probably not the right fit:** Students who want a quiet, internally-focused engineering role. Students who find client interaction draining. Students who need full specifications before they start work.

---

## What to encourage them to build

Specific curriculum guidance for career advisors:

**Agent development — not just prompting**

The distinction matters. Prompting is writing better text to get better AI outputs. Agent development is building systems where AI takes actions, uses tools, and operates over multiple steps. The second is what FDEs actually build. Courses or workshops that cover the Anthropic or OpenAI APIs at the implementation level — writing code, not using the chat interface — are the relevant ones.

**MCP servers and data integrations**

Model Context Protocol is how Claude connects to external data sources. Every FDE at Anthropic is building these. Students who have built an MCP server connecting real APIs demonstrate a specific, current, in-demand skill. This is buildable in 2–3 weeks of focused work with the right resources. The [MCP server overview article](/articles/internal-mcp-server-explained) covers the concepts.

**Production deployment basics**

Authentication, error handling, observability, basic monitoring. The difference between "runs on my laptop" and "runs in production when someone uses it at 2am." This is teachable through project-based work where students actually deploy something — even small — to a real environment.

**Business communication practice**

One specific exercise that is highly effective: have students write a technical explanation of something they built for someone who doesn't code. One page. The exercise surfaces the gap between "can code well" and "can communicate about technical work to non-technical audiences." FDEs need both.

---

## Where to find these jobs

For students actively looking:

**Directly at AI companies:**
- [Anthropic Forward Deployed Engineer, Applied AI](https://job-boards.greenhouse.io/anthropic/jobs/4985877008) — the gold standard job description for this role; worth reading as a benchmark even if students don't apply immediately
- Palantir Forward Deployed Software Engineer — the original role, hiring from universities
- OpenAI (via DeployCo — new roles being added frequently)
- Scale AI FDE team

**At consulting and professional services firms:**
- EY (active expansion, entry-level roles available)
- Accenture (Microsoft and ServiceNow FDE practices)
- Deloitte AI Center of Excellence

**At enterprises directly:**
Large banks, pharmaceutical companies, logistics firms, and government contractors are building internal FDE functions. These roles often appear under titles like "Applied AI Engineer," "Enterprise AI Engineer," or "AI Implementation Engineer." Worth encouraging students to search these phrases specifically.

**Job boards:**
- [fwddeploy.com](https://www.fwddeploy.com/) is the most comprehensive FDE-specific job board

**Compensation expectations to set:**
- Entry-level FDE at major AI companies or Big 4: $150K–$250K total comp
- Mid-level: $250K–$450K
- Senior: $450K–$700K+

These are not inflated estimates. They reflect genuine market scarcity for the combination of technical depth, client capability, and AI expertise the role requires.

---

## How to evaluate training programs

Several training options have emerged as the FDE role has grown:

- [FDE Academy](https://fde.academy/) — purpose-built for FDE preparation
- IIT Roorkee and Supervity have launched FDE-specific programs
- Various bootcamps are adding "AI deployment" tracks

What to look for in any program:
- **Hands-on deployment practice** — students should build and deploy real systems, not just watch lectures
- **Real enterprise case studies** — exposure to messy real-world environments, not just clean examples
- **Portfolio outcomes** — the program should produce work students can actually show to hiring managers

What to be skeptical of:
- Pure theory without implementation
- No client simulation component
- A certificate without a portfolio of work
- Programs that end at "prompting" without covering agent development and deployment

The credential itself matters less than what the student can demonstrate. An FDE candidate with a strong GitHub portfolio and no certificate is more competitive than one with a certificate and nothing to show.

---

## One thing to tell students right now

Apply to [Anthropic's Forward Deployed Engineer, Applied AI role](https://job-boards.greenhouse.io/anthropic/jobs/4985877008) directly.

Read the job description in full. It is the clearest public specification of what this role requires — what skills, what deliverables, what experience. Even students who aren't immediately ready to apply should read it as a roadmap.

The role is public. It's hiring. And for students who have built the right technical stack and have a portfolio that shows they can operate in messy real-world environments, it's attainable within 12–24 months of focused preparation.

The career infrastructure for this role is still being built. Career advisors who understand FDE hiring now will be the ones students trust with their career decisions over the next several years. The demand is not a trend — it's structural. Enterprises need engineers who can deploy AI. That need will compound as AI capabilities continue to improve.

Aaron Levie was right: career counselors should be figuring this out. This guide is a start.

---

## Further reading for students

- [What is a Forward Deployed Engineer](/articles/what-is-a-forward-deployed-engineer) — the full definition, what FDEs build, compensation ranges, the hiring landscape
- [How to become a Forward Deployed Engineer](/articles/how-to-become-forward-deployed-engineer) — the four-part skill stack, the three transition paths, and what the interview actually looks like
- [The 5 portfolio projects that signal FDE readiness](/articles/fde-portfolio-projects) — specific, buildable projects that demonstrate FDE capabilities to hiring managers`,
  },
]

async function seed() {
  console.log('Seeding FDE Foundation articles...\n')

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
