/**
 * Batch 59 — Career context: AI impact on knowledge work
 * ai-impact-on-knowledge-work
 *
 * Pillar 2 article: why learning to operate with AI matters.
 * Featured on homepage (tier 5). No persona filter — speaks to everyone.
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-59.ts
 */

import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const ARTICLES = [
  {
    slug: 'ai-impact-on-knowledge-work',
    angle: 'role',
    title: 'What AI Is Actually Doing to Your Job',
    excerpt: 'Block is eliminating middle management. Altman and Amodei predict the first billion-dollar one-person company. 36% of B2B companies already cut their SDR teams. The future of work isn\'t theoretical — it\'s playing out role by role, with specific data, right now.',
    readTime: 15,
    tier: 5,
    cluster: null,
    body: `**Key takeaways:**
- AI is restructuring organizations, not just individual roles — Block is eliminating middle management, Sequoia is underwriting for "agentic leverage," and solo-founded startups now make up 36% of new ventures
- The pattern across every knowledge work role is the same: systematizable tasks move to AI, judgment-dependent tasks become more central — and more accountable
- Sales development is the clearest early signal: 36% of B2B companies cut SDR teams in 2025, but hybrid human-AI teams book more meetings at 38% lower cost
- The productive response is specific: map your own task bundle, identify what's high-exposure, and build competence in the work that remains distinctly human

---

In January 2026, Block — the company behind Square and Cash App — [published a detailed essay](https://block.xyz/inside/from-hierarchy-to-intelligence) explaining why they're eliminating middle management. Not trimming it. Eliminating it. Their argument: for 2,000 years, hierarchy has been the only viable way to route intelligence through an organization. AI changes that. The intelligence moves into the system. Humans work on the edge — handling judgment, ethics, and the situations the models can't parse.

Block is one company. But the thesis behind their restructuring shows up everywhere you look, in different forms, at different levels of ambition. Sam Altman and Dario Amodei both predict the first billion-dollar one-person company will arrive within a year or two. Andreessen Horowitz says every team — marketing, legal, finance, procurement — needs to become a software team or it's already behind. Sequoia Capital has started adjusting its underwriting for what it calls "agentic leverage" — tiny teams producing outsized output through AI agent orchestration.

These are structural bets that real companies and real investors are making with real money. Understanding them matters, because the way organizations restructure determines which roles inside them grow, which compress, and which disappear.

## What organizations are becoming

Three models are competing for the future of the company. They overlap, they contradict, and each contains a version of the truth.

### The intelligence model

[Block's essay](https://block.xyz/inside/from-hierarchy-to-intelligence) traces the problem with hierarchy back to the Roman legions: one person can effectively manage three to eight people, so you stack layers to coordinate larger groups. Every modern company is built this way. Every previous attempt to escape it — Spotify's squads, Zappos's holacracy, Valve's flat structure — failed at scale because, as Block puts it, "no alternative information routing mechanism has been powerful enough to replace it."

AI is that mechanism.

In Block's model, the organization becomes a kind of mini-AGI. Intelligence lives in the system — world models built from transaction data, an intelligence layer that composes capabilities into solutions, and interfaces where that intelligence meets users. Humans operate in three roles: deep specialists who build things, cross-functional owners (DRIs) who solve specific problems with resource authority, and player-coaches who are technical builders that also mentor people. The traditional middle manager — the person whose primary job was to route information up and down the chain — gets replaced by the AI layer itself.

The world model provides the context a manager used to provide. The intelligence layer handles the coordination a manager used to handle. What's left for humans is the work that requires being human.

This is the most specific and most radical restructuring thesis coming from a real company actually implementing it. The implication is stark: the organizational chart is a technology, and it just got obsoleted.

### The compression model

On the other end of the spectrum: the organization doesn't just restructure. It compresses to almost nothing.

Sam Altman and Dario Amodei have both predicted the first [billion-dollar one-person company](https://techcrunch.com/2025/02/01/ai-agents-could-birth-the-first-one-person-unicorn-but-at-what-societal-cost/). The trajectory is visible. Midjourney hit $200M in annual revenue with approximately 11 employees — $18M per employee. [Medvi, a telehealth company, reached $401M in its first year with two people](https://www.pymnts.com/artificial-intelligence-2/2026/the-one-person-billion-dollar-company-is-here/). [Solo-founded startups now represent 36.3% of all new ventures](https://rorycallaghan.com/the-rise-of-the-one-person-billion-dollar-company-how-ai-agents-are-redefining-entrepreneurship-by-2026/).

Balaji Srinivasan frames the logic with a mental model worth remembering: ["Humans are the sensor, AI is the actuator."](https://www.startuphub.ai/ai-news/artificial-intelligence/2026/ai-needs-humans-balaji-srinivasan-on-ai-s-limits) Humans provide context, interpretation, and real-world judgment. AI executes. The future company is a small number of human sensors directing a fleet of AI actuators. The org chart doesn't just flatten — for some companies, it functionally disappears.

Sequoia Capital has begun adjusting its underwriting models for what it calls "agentic leverage" — the ability of tiny teams to produce output that previously required dozens or hundreds of people. This isn't a conference talking point. It's changing how some of the most influential investors in tech allocate capital.

### The execution-layer model

[Andreessen Horowitz's Big Ideas 2026](https://a16z.com/newsletter/big-ideas-2026-part-1/) outlines a middle path: organizations don't necessarily shrink, but they fundamentally change how they operate.

Their argument: AI becomes the execution layer of the economy. Multi-agent systems replace isolated tools. Every function — marketing, legal, procurement, finance — becomes software-first. The prompt box disappears entirely for mainstream users; AI becomes invisible scaffolding woven through every workflow, activated by intent rather than explicit instruction.

The org chart survives in this model, but what people do inside it changes. The marketing team still exists — they're designing agent workflows, not writing copy. The finance team still exists — they're building automated pipelines, not pulling reports. The work is orchestration, not execution.

a16z's direct claim: every team and every task should be software-first, and every leader will have to learn to reach for a software toolbox. The people who can't make that shift become bottlenecks. The people who can make it become disproportionately valuable.

### Where these models converge — and where they don't

These three perspectives come from different places. A payments company restructuring itself. A venture firm investing in the next wave. A tech philosopher thinking about civilizational design. But they converge on several points.

**Routine execution is leaving the building.** Whether it's Block's intelligence layer, Balaji's actuator fleet, or a16z's agent workflows, the tasks that involve applying known processes to structured data are moving to AI systems. This is already true across every function.

**The remaining human work is judgment-heavy.** Every model describes the surviving human role the same way: providing context that AI systems can't generate on their own, making decisions in ambiguous situations, managing relationships where trust matters, and handling novel problems that don't fit existing patterns.

**Organizational structures are flattening around AI.** Block eliminates middle management. The one-person company eliminates the org entirely. a16z's model keeps the structure but replaces what's inside it. The direction is the same: fewer layers, more individual autonomy, more direct accountability.

The honest tension: Block and the compression model describe what the most aggressive, most tech-native organizations are building. Most companies — a 200-person Series B, a mid-market SaaS company, a regional services firm — won't reorganize as mini-AGIs in 2026. They'll adopt AI tools incrementally. The transformation will be slower, messier, less dramatic. But it will move in the same direction. The question for most knowledge workers is practical: how much of the work I do today will be handled differently in 18 months, and am I building the skills for the work that remains?

That question has specific, role-by-role answers.

## How specific roles are changing

The data below is early but directional — drawn from industry reports, market surveys, job data, and what practitioners are sharing publicly. Each section covers what's being automated, what the surviving version of the role looks like, and what skills are gaining value.

### Sales development: the canary in the coal mine

Sales development is the clearest case study because the data is the most specific and the shift happened fastest.

[36% of B2B companies cut their SDR teams in 2025](https://www.landbase.com/blog/death-of-bdr-role-ai-agents-sdr-hiring-2026), according to a SaaStr survey. Most reductions happened through attrition — companies stopped backfilling roles when people left. The tasks that disappeared first: prospect research, list building, templated email sequences, CRM data entry, follow-up scheduling. AI agents now handle all of these at volume that no human team could match.

The economics are concrete. A traditional 10-person BDR team costs approximately $625 per meeting booked. A hybrid 5-person team with AI tools costs roughly $390 per meeting — and books more meetings. [Salesforce's State of Sales 2026](https://www.salesforce.com/news/stories/state-of-sales-report-announcement-2026/) report confirms the pattern: 83% of sales teams using AI saw revenue growth, compared to 66% without. High-performing sellers are 1.7x more likely to use AI agents for prospecting than underperformers.

The surviving BDR role looks fundamentally different. Multi-stakeholder discovery conversations. Navigating buying committees. Building internal champions in complex enterprise deals. Higher-paid, more senior, fewer people. As [Bain Capital Ventures argues](https://baincapitalventures.com/insight/the-case-for-humans-in-sales-why-bdrs-still-win-in-the-age-of-ai/), BDRs matter more than ever for high-ACV, complex sales — they can cut through the noise of AI-generated outreach in a way that another AI agent simply can't.

A new role has already emerged from this shift: GTM Engineer. It barely existed two years ago. It combines sales ops, marketing ops, and systems architecture to build the signal-based workflows and AI agent infrastructure that replaced the traditional BDR motion. If you're an SDR wondering where the career path goes — this is the direction.

### Marketing: from production to orchestration

Marketing managers who spent 2023 producing content and managing campaigns spend 2026 in a fundamentally different operating mode: designing the workflows that produce content, reviewing AI-generated outputs, and making the strategic decisions about positioning, timing, and budget that determine whether the automation produces anything useful.

[65% of marketing teams now have designated AI ops roles](https://www.jasper.ai/state-of-ai-marketing-2025), according to Jasper's State of AI in Marketing report. AI fluency is now a ["baseline expectation"](https://etcjournal.com/2026/04/02/in-2026-ai-is-redefining-how-marketers-work-ai-fluency-is-a-baseline-expectation/) for marketing hires — not a differentiator, not a bonus, a requirement. The shift from "campaign manager" to "campaign conductor" is concrete: set the objectives, define the guardrails, review the outputs, audit the performance. The production — the actual copywriting, the email variants, the ad creative, the attribution reporting — increasingly flows through agent workflows.

For demand generation, the buyer journey is compressing. B2B buyers now research independently using AI before ever engaging a sales team. They arrive more informed and with higher expectations. Demand gen has to reach them earlier with higher signal, in the channels those AI-assisted buyers actually consume.

Field marketing stands out as a resilient exception. Event execution, local relationships, and physical presence resist automation completely. The shift is subtler: less time on logistics coordination (AI handles scheduling, follow-ups, vendor communication), more time on strategic event selection and proving ROI with data. The field marketers who thrive in this environment are the ones who can tie a physical handshake to a pipeline number — and AI actually makes that attribution easier, which raises the bar for everyone.

### Customer success: the accountability shift

AI is absorbing the CSM operational layer. Health score monitoring. Automated playbook triggers. Check-in email drafting. Account role mapping. [TSIA's State of Customer Success 2026](https://www.tsia.com/blog/state-of-customer-success-2026-ai-economics) describes the new reality: CSMs become "executives of their own books of business." The operational cover is gone. What remains is the work that requires genuinely knowing the customer — reading whether an expansion conversation is premature, sensing when a champion is losing internal support, deciding when to escalate before the health score catches up.

Revenue accountability has become explicit. Boards expect CS teams to predict renewals and drive expansion with sharper precision than ever, and the data infrastructure to support those predictions finally exists. [Companies report 25%+ churn reduction](https://www.gainsight.com/blog/what-customer-success-teams-are-prioritizing-in-2026-and-what-the-data-shows-is-working/) with AI-powered early intervention playbooks — which means the CSMs who remain are measured against a higher standard of outcomes.

The skills gaining value: commercial confidence, data literacy, outcome ownership, and the ability to have difficult conversations about whether a customer is actually getting value. The skills losing value: manual reporting, routine follow-up coordination, and the kind of reactive support that an automated system handles better.

### Revenue operations: the quiet power grab

RevOps is one of the few functions that has unambiguously gained influence through the AI transition. [RevOps leaders are being elevated to VP-level positions](https://skaled.com/insights/revops%E2%80%912026/) across mid-market and enterprise SaaS, reporting directly to the CEO or COO. The reason: AI systems require clean data infrastructure, well-designed automation pipelines, and someone who understands how all the pieces of the revenue engine connect. That person is the RevOps leader.

The RevOps software market is projected to grow from [$3.45B in 2024 to $10.25B by 2033](https://orm-tech.com/revops-strategic-planning-trends-for-2026/) at a 13.5% CAGR. [BCG calls RevOps](https://www.bcg.com/publications/2025/ai-was-made-for-revops-from-prediction-to-execution) "the function AI was made for" — the combination of structured data, repeatable process, and cross-functional coordination that AI augments most naturally.

The GTM Engineer role mentioned earlier is emerging directly from RevOps. Part marketing ops, part sales ops, part systems architect. They build signal-based outbound workflows, automate enrichment pipelines, and create the technical infrastructure that AI agents need to actually work. The role didn't have a name two years ago. Now it's on job boards with six-figure comp.

### Product management: the new object of judgment

[14,000+ AI product manager roles are open globally](https://productschool.com/blog/artificial-intelligence/guide-ai-product-manager), with average U.S. compensation at $133,600 and senior roles clearing $200K. The PM role hasn't contracted — it shifted what it's pointed at.

Product managers who owned backlogs and coordinated sprints are moving toward AI system design. Deciding which capabilities to build with models. Understanding how model behavior changes at scale and across edge cases. Managing agentic workflows that span multiple systems and interact with each other. [Harvard Business Review argues](https://hbr.org/2026/02/to-drive-ai-adoption-build-your-teams-product-management-skills) that product management skills — systems thinking, user empathy, cross-functional coordination — are precisely what organizations need to adopt AI effectively.

The judgment is the same. The object of that judgment changed completely. The PM who can think in systems, understand model limitations, and make sound tradeoff decisions about AI capabilities is in extraordinary demand. The PM who just managed a sprint board is wondering what happened.

### Partnerships: the counterintuitive winner

Partnerships and business development might be the most AI-resilient function in a tech company. Trust, relationship capital, and complex deal negotiation resist automation almost completely. You can automate a prospecting email. You can't automate a partnership negotiation between two companies with competing interests and overlapping customer bases.

Demand for this function is actually growing. [83% of tech CEOs are prioritizing joint ventures and alliances in 2026](https://www.ey.com/en_gl/newsroom/2026/01/ceos-double-down-on-ai-transformation-and-m-and-a-to-drive-growth-amid-uncertainty-in-the-global-economy) — up nearly 30% from 2025, according to an EY CEO survey. A new category of partnership work is emerging alongside the traditional kind: AI tool integrations, ecosystem deals around agent infrastructure, and the kind of cross-product collaboration that only a human can negotiate with another human.

The shift is real but modest compared to other roles: less time on routine partner communications and status reporting (AI handles the coordination), more time on complex deal structuring and the relationship management that determines whether a partnership creates real value or just a joint press release.

## The re-bundling

Across every role examined here, the pattern is the same. AI compresses the systematizable parts. It amplifies the judgment-dependent parts. The ratio of each in your role is changing right now.

[CSEP's analysis of Karpathy's exposure dashboard](https://csep.org/blog/which-jobs-are-at-risk-from-ai-evaluating-karpathys-exposure-dashboard/) calls this "re-bundling" — the restructuring of a role around the tasks that remain distinctly human. Their most important insight: the productive response isn't technical retraining. It's re-bundling your work around human judgment, domain verification, client interaction, and AI supervision. That's a different kind of skill development than learning a new tool. It means understanding which of your tasks are high-exposure, intentionally shifting your time and identity toward the low-exposure work, and building competence in operating the AI systems that handle the rest.

The macro data supports this framing. [Goldman Sachs estimates](https://www.goldmansachs.com/insights/articles/how-will-ai-affect-the-global-workforce) that tasks within approximately 300 million jobs globally could be automated — not 300 million jobs eliminated, 300 million jobs changed. [McKinsey's estimate](https://www.hungyichen.com/en/insights/ai-job-displacement-labor-market): 30–50% of current work activities are automatable, depending on industry and region. But the displacement story is only half the picture. The [World Economic Forum projects](https://www.weforum.org/stories/2026/01/ai-has-already-added-1-3-million-new-jobs-according-to-linkedin-data/) that AI creates 97 million new roles while displacing 85 million — a net positive of 12 million jobs by 2030. [LinkedIn's Economic Graph](https://economicgraph.linkedin.com/research/future-of-work-report-ai) already shows 1.3 million net new AI-related roles created, with forward-deployed engineer postings growing 800% in a single year.

The jobs aren't vanishing. They're restructuring. And the window for building the skills that match the restructured version is open right now.

## What the people ahead are doing differently

There's a useful exercise buried in all of this data, and it's specific enough to do this week.

Map your own task bundle. Take your current role and list what you actually do in a given week. Separate the tasks that are research, drafting, data synthesis, scheduling, reporting, or routine coordination from the tasks that require judgment, relationships, or domain expertise that took years to build.

The first group is high-exposure. AI either handles it already or will soon. The second group is low-exposure — and it's becoming more central to your role, not less.

The people who are ahead made specific decisions, not general ones:

- They identified which of their specific tasks were high-exposure and started using AI tools for those — not as an experiment but as a permanent workflow change
- They shifted their time, intentionally, toward the judgment work that the data says will remain human — the complex conversations, the strategic decisions, the relationship-dependent work
- They built real competence in orchestrating AI systems — understanding how to design a workflow, how to evaluate outputs critically, when to trust the system and when to override it

The accountability point is direct. If AI can handle 30–40% of what your role currently requires, and you don't figure out where to redirect that capacity, you're not protected by the fact that your job title still exists on an org chart. You're producing less value in the same time. The organizational restructuring described in this article happens whether you're ready for it or not.

## Frequently asked questions

**Is AI going to eliminate my job?**

For most knowledge workers, no. [Goldman Sachs projects](https://www.goldmansachs.com/insights/articles/how-will-ai-affect-the-us-labor-market) 6–7% of U.S. jobs displaced longer-term — approximately 11 million workers. Significant, but not the majority. The far more common pattern is task displacement within existing roles. Your title stays; your task mix changes. The risk for most people is doing less valuable work in the same amount of time, not losing the job outright.

**Which roles are most exposed?**

Roles that are entirely screen-based and involve applying structured processes to data score highest on [Karpathy's exposure index](https://karpathy.ai/jobs/). Software developers scored 9/10. Accountants, 8. Customer service representatives, 9. But high exposure doesn't automatically mean high risk — software developer demand is growing even as AI transforms what developers actually do day-to-day. Exposure measures how much of the role is within AI's reach. What happens next depends on how the role re-bundles around the remaining human tasks.

**Which roles are most resilient?**

Roles involving physical presence, complex relationship management, and judgment in genuinely ambiguous situations. In tech companies specifically, partnerships, field marketing, and senior leadership roles are the most resilient. RevOps and product management are actually expanding in scope and influence, even as the tasks within them change.

**How fast is this happening?**

It varies sharply by role and company. SDR teams saw 36% cuts in a single year. Marketing AI adoption already exceeds 65% for designated AI roles. Product management AI roles are multiplying — 14,000+ open globally. The velocity depends on the role, the company's AI maturity, and the competitive pressure in the industry. But the direction is consistent and the pace is accelerating.

**What should I do about it right now?**

Map your task bundle. Identify the high-exposure tasks in your current role. Start building real competence with AI tools for those specific tasks — not as a curiosity but as a permanent change to how you work. Simultaneously, invest in the low-exposure skills that are becoming more central: judgment, relationship management, strategic thinking, domain expertise, the ability to make good decisions under uncertainty. The practical guides, learning paths, and role-specific workflows on this site are built around exactly that transition.

---

*Sources: [Block](https://block.xyz/inside/from-hierarchy-to-intelligence) · [Karpathy](https://karpathy.ai/jobs/) · [Goldman Sachs](https://www.goldmansachs.com/insights/articles/how-will-ai-affect-the-global-workforce) · [McKinsey](https://www.hungyichen.com/en/insights/ai-job-displacement-labor-market) · [World Economic Forum](https://www.weforum.org/stories/2026/01/ai-has-already-added-1-3-million-new-jobs-according-to-linkedin-data/) · [LinkedIn Economic Graph](https://economicgraph.linkedin.com/research/future-of-work-report-ai) · [Salesforce State of Sales 2026](https://www.salesforce.com/news/stories/state-of-sales-report-announcement-2026/) · [Landbase](https://www.landbase.com/blog/death-of-bdr-role-ai-agents-sdr-hiring-2026) · [Bain Capital Ventures](https://baincapitalventures.com/insight/the-case-for-humans-in-sales-why-bdrs-still-win-in-the-age-of-ai/) · [TSIA](https://www.tsia.com/blog/state-of-customer-success-2026-ai-economics) · [Gainsight](https://www.gainsight.com/blog/what-customer-success-teams-are-prioritizing-in-2026-and-what-the-data-shows-is-working/) · [BCG](https://www.bcg.com/publications/2025/ai-was-made-for-revops-from-prediction-to-execution) · [a16z Big Ideas 2026](https://a16z.com/newsletter/big-ideas-2026-part-1/) · [CSEP](https://csep.org/blog/which-jobs-are-at-risk-from-ai-evaluating-karpathys-exposure-dashboard/) · [Jasper](https://www.jasper.ai/state-of-ai-marketing-2025) · [Product School](https://productschool.com/blog/artificial-intelligence/guide-ai-product-manager) · [Harvard Business Review](https://hbr.org/2026/02/to-drive-ai-adoption-build-your-teams-product-management-skills) · [EY](https://www.ey.com/en_gl/newsroom/2026/01/ceos-double-down-on-ai-transformation-and-m-and-a-to-drive-growth-amid-uncertainty-in-the-global-economy) · [Skaled](https://skaled.com/insights/revops%E2%80%912026/) · [TechCrunch](https://techcrunch.com/2025/02/01/ai-agents-could-birth-the-first-one-person-unicorn-but-at-what-societal-cost/) · [PYMNTS](https://www.pymnts.com/artificial-intelligence-2/2026/the-one-person-billion-dollar-company-is-here/) · [Balaji Srinivasan](https://www.startuphub.ai/ai-news/artificial-intelligence/2026/ai-needs-humans-balaji-srinivasan-on-ai-s-limits) · [ORM Technologies](https://orm-tech.com/revops-strategic-planning-trends-for-2026/)*`,
  },
]

async function seed() {
  for (const a of ARTICLES) {
    const { error } = await sb.from('articles').upsert(
      {
        slug: a.slug,
        angle: a.angle,
        title: a.title,
        excerpt: a.excerpt,
        body: a.body,
        read_time: a.readTime,
        tier: a.tier,
        cluster: a.cluster,
        published: true,
      },
      { onConflict: 'slug' }
    )
    if (error) {
      console.error(`✗ ${a.slug}:`, error.message)
    } else {
      console.log(`✓ ${a.slug}`)
    }
  }
}

seed()
