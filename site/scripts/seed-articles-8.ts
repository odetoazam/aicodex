/**
 * Batch 8 — Persona-specific getting-started content
 * Sales, admins, operations, HR
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-8.ts
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

  // ── 1. AI for sales — field-note ──────────────────────────────────────────
  {
    termSlug: 'claude',
    slug: 'ai-for-sales',
    angle: 'field-note',
    title: 'What AI actually looks like for a sales team',
    excerpt: 'Not "AI will write your emails." What sales teams are genuinely using Claude for, what works, and the one thing most reps get wrong.',
    readTime: 6,
    cluster: 'Business Strategy & ROI',
    body: `Sales is one of the best fits for AI — high-repetition tasks, clear quality signals, and enough volume that even a small time saving per rep adds up fast. Here's what it actually looks like when sales teams use Claude well.

## What works

**Pre-call research.** This is the highest-value use case. Before a call, a rep pastes in a prospect's company name, LinkedIn summary, and any recent news. Claude produces a structured briefing: likely pain points, relevant company context, questions worth asking, potential objections. What used to take 25–30 minutes takes 3–5.

Setup: a [Claude Project](/glossary/claude-projects) with your ICP description, your product's differentiators, and your most common customer situations. Claude then tailors the briefing to your product context, not just generic research.

**Follow-up email drafts.** After a call, paste your rough notes. Claude drafts the follow-up referencing specific things that came up. The rep edits and sends. Handle time drops significantly, and the emails are more specific than the average template.

**Personalising outbound sequences.** Generic outbound performs poorly. Claude can take a prospect's job title, company stage, and recent news and produce a personalised first line for each email in a sequence. You're still using templates for structure — Claude personalises the hook.

**Summarising long email threads before re-engaging.** A prospect went cold three months ago. You want to re-engage. Before writing anything, paste the full thread. Claude summarises: where the conversation stopped, what was agreed, what objections came up. You respond from a position of context, not guesswork.

**Objection prep.** Before a call with a prospect who's been pushing back on pricing, paste their objections and your notes. Claude helps you think through responses, stress-test your positioning, and identify the real concern underneath the stated objection.

## What doesn't work

**Fully automated outbound.** Teams that have tried fully AI-generated cold outreach report that response rates often drop — it's detectable. Use Claude to personalise and assist, not to automate entirely.

**Using Claude without your product context.** Generic Claude giving generic answers about your product is worse than nothing — it produces confident-sounding outputs that are subtly wrong. Your Claude Project needs your product one-pager, pricing structure, and ICP description loaded in before anyone on the sales team uses it for customer-facing work.

**Replacing call prep with AI briefings.** The briefing is a starting point, not a substitute for knowing your prospect. Reps who read the briefing and stop there produce conversations that feel like they're following a script. Use it to supplement your judgment, not replace it.

## The setup that takes 30 minutes and pays off immediately

1. Create a [Claude Project](/glossary/claude-projects) named something like "Sales — [Your Company]"
2. Add your product description, key differentiators, and common objections to the Project instructions
3. Add your ICP description: company size, role, typical pain points, what they usually compare you to
4. Write a simple prompt template your team uses before every call: "Here's the prospect. Here's what I know. Give me a 5-point briefing."
5. Share the Project with the team

From that point, every rep has the same starting point. The quality of briefings stops varying by how good each rep is at research.

## The number to track

Time from meeting booked to call-ready. If your team is spending more than 20 minutes prepping for a discovery call, Claude should cut that to under 10. If it's not, your Project instructions need work.
`,
  },

  // ── 2. Setting up Claude as an admin — process ────────────────────────────
  {
    termSlug: 'claude-projects',
    slug: 'claude-admin-setup',
    angle: 'process',
    title: 'How to set up Claude for your whole company',
    excerpt: 'You\'ve been asked to "get Claude set up for the team." Here\'s exactly what that means, what decisions you need to make, and what to do in what order.',
    readTime: 7,
    cluster: 'Business Strategy & ROI',
    body: `Someone — probably a founder, a department head, or your IT manager — has asked you to set up Claude for the team. Here's what that actually involves.

## What "setting up Claude" means

There are two things to set up: **access** and **context**.

Access is the easy part: everyone needs a Claude account. Anthropic's [Team plan](https://www.anthropic.com/claude/team) handles billing and user management centrally. You provision seats, people log in with their work email.

Context is what makes Claude useful versus just available. Without it, everyone on your team is starting from zero every conversation — explaining who you are, what you do, and what they need each time. With it, every conversation starts with Claude already knowing your company, your tone, and your use case.

That context lives in [Claude Projects](/glossary/claude-projects).

## What a Project is and why admins care

A Project is a shared workspace where you can:
- Set persistent instructions (the [system prompt](/glossary/system-prompt)) that apply to every conversation in that Project
- Upload documents that Claude can reference — product docs, style guides, SOPs, templates
- Invite team members so everyone works from the same starting point

You'll typically create one Project per team or use case, not one per person.

## The four decisions to make before you build anything

**1. Which teams get their own Project?**
Start with the teams that have the clearest, most repetitive use cases. Customer success (ticket responses), marketing (content), and sales (prospect research) are usually the first three. Operations comes next. Create separate Projects — don't mix teams, they have different contexts and tone requirements.

**2. Who writes the Project instructions?**
This is the most important decision you'll make. The instructions define how Claude behaves for everyone in the Project. The person who writes them needs to understand both the team's work and what good output looks like. Don't delegate this to the most junior person. For each Project, work with the team lead to draft the instructions together.

**3. What documents go in each Project?**
For each team, identify the 3–5 documents Claude would need to give accurate, on-brand answers. For CS: your product FAQ and support tone guidelines. For marketing: your brand voice guide and ICP description. For sales: your product one-pager and objection-handling notes. Upload these to the Project.

**4. What's the rollout sequence?**
Don't roll out to everyone at once. Start with one enthusiastic person on each team. Let them work out the rough edges for 2–3 weeks. Then expand. The early adopter's learnings — what the instructions should say, what prompts work, what to watch out for — are more valuable than any training doc you could write upfront.

## Step-by-step: building a Project

1. **Go to Projects** in the Claude sidebar and create a new one. Name it clearly: "CS Team" not "Project 1."

2. **Write the system prompt.** For a CS team, something like:
   > You are a customer support assistant for [Company]. You help draft responses to customer tickets. Always acknowledge the customer's frustration before addressing the issue. Be concise and specific. If you're unsure about a product detail, say so rather than guessing. Tone: professional and warm, not robotic.

3. **Upload your key documents.** Product FAQ, tone guide, known bugs list, escalation guide. Anything a new support rep would need to read before handling tickets.

4. **Test it before sharing.** Run 10 representative ticket types through it. Does Claude get the tone right? Are there accuracy gaps? Fix the instructions before the team sees it.

5. **Invite the team.** Share the Project link. Run a 20-minute walkthrough showing one or two concrete prompts that work.

## What to monitor in the first month

- Are people actually using it? (If not, the workflow isn't clear enough — talk to users, not the manager)
- Are there consistent output quality problems? (Fix the Project instructions, not the users)
- Is anyone using it in ways that produce risk? (Customer-facing outputs should have human review in the workflow)

## The admin mistake to avoid

Creating one giant "All Teams" Project with a generic system prompt. This produces mediocre outputs for everyone. The leverage is in specificity — a tight CS Project that knows your product, your tone, and your escalation criteria will produce dramatically better outputs than a general one.

One focused Project per team is worth ten generic ones.
`,
  },

  // ── 3. AI for operations — field-note ─────────────────────────────────────
  {
    termSlug: 'claude',
    slug: 'ai-for-operations',
    angle: 'field-note',
    title: 'What AI actually looks like for an operations team',
    excerpt: 'Ops has more to gain from AI than almost any other function — but the use cases look different to what most people expect.',
    readTime: 6,
    cluster: 'Business Strategy & ROI',
    body: `Operations teams deal with high-volume, high-variety work: processes that need documenting, data that needs summarising, emails that need drafting, meeting outputs that need capturing. Most of it is time-consuming and repetitive in structure even when the details vary.

That's exactly where Claude delivers.

## What ops teams actually use Claude for

**Writing and updating SOPs.** Standard operating procedures are essential and chronically out of date. When a process changes, someone needs to update the doc. That person never has time. With Claude: describe the new process in rough notes, ask Claude to write it in your SOP format. A 2-hour documentation task becomes a 20-minute review task. Upload your SOP template to a [Claude Project](/glossary/claude-projects) so the output is always in the right format.

**Summarising meeting outputs.** Paste in rough meeting notes or a transcript. Claude produces a structured summary: decisions made, actions assigned, open questions, next steps. You stop writing meeting notes from scratch and start editing a draft.

**Vendor and contractor emails.** Ops involves a lot of external communication: chasing vendors, writing scope-of-work confirmations, following up on deliveries, escalating service failures. Claude drafts these given a quick brief. The rep edits and sends. What used to take 15 minutes takes 3.

**Turning data exports into readable summaries.** Paste a CSV or table of data — ticket volumes, vendor performance, inventory counts — and ask Claude to summarise the key patterns. Not a replacement for proper analytics, but for one-off "what does this tell us" questions, it's faster than building a report.

**Building templates.** Ask Claude to create a template for anything: a project brief, a vendor evaluation scorecard, an incident report. Give it an example of your existing format and it'll match the structure. Building a template library from scratch is a week of work; with Claude it's an afternoon.

**Policy and process drafts.** First draft of a new travel policy, a contractor onboarding checklist, a data handling procedure. Claude can produce a solid first draft from a brief description, which you then edit to match your specifics. Starting from a draft is much faster than starting from a blank page.

## Where ops is different from other teams

Ops work is more varied than CS or sales work. A CS team handles a narrow range of ticket types; an ops team handles whatever comes up. This means:

**Generic prompts work better.** You don't need as much pre-configured context — ops team members tend to be comfortable giving Claude the relevant context in each conversation. A Project with your company name, what you do, and your documentation style is often enough.

**Process knowledge matters.** Claude can draft an SOP but it can't know your actual process unless you explain it. The quality of outputs is directly proportional to how clearly you describe the current state and what needs to change. This is a skill ops people develop quickly.

**Review is non-negotiable.** Ops outputs often go into shared systems, get sent to vendors, or define how other teams work. Always have a human review before anything goes external or becomes official documentation.

## The highest-leverage thing to do first

Pick the most time-consuming recurring documentation task your team has. The thing someone has to produce every week or every month that nobody looks forward to.

Build a Project with the template, your company context, and instructions for the format you need. Try it for one cycle. The time saving on just that one task usually justifies the whole setup.
`,
  },

  // ── 4. Step-by-step sales prospecting with Claude — process ───────────────
  {
    termSlug: 'claude',
    slug: 'sales-prospecting-with-claude',
    angle: 'process',
    title: 'Step-by-step: researching a prospect with Claude before a call',
    excerpt: 'A concrete workflow for turning 30 minutes of pre-call research into 5 minutes — without losing the signal that makes a call go well.',
    readTime: 5,
    cluster: 'Business Strategy & ROI',
    body: `Most reps know they should research prospects before calls. Most also skip half of it because it takes too long. Here's a workflow that cuts that time by 70–80% without cutting corners on what matters.

## Before you start: set up your Project

You only need to do this once. Create a [Claude Project](/glossary/claude-projects) called "Sales Research" and add these instructions:

> You help me prepare for sales calls. When I give you information about a prospect, produce a structured call briefing with: (1) company overview, (2) likely pain points based on their stage and industry, (3) relevant news or context I should know, (4) questions worth asking, (5) potential objections and how to address them. Keep it scannable — I read this in the 5 minutes before a call.

Add your product one-pager and ICP description as uploaded documents. From now on, every research conversation starts with Claude already knowing what you sell and who your best customers are.

## The 5-minute workflow

**Step 1: Gather what you already have (2 min)**

Before going to Claude, collect:
- The prospect's name, title, company
- Company website URL and a quick skim of their "About" page
- Their LinkedIn headline (30 seconds)
- Any notes from the booking email or previous touches

You don't need to read everything. You're gathering raw inputs for Claude, not analysing them yourself.

**Step 2: Paste it all in and ask for the briefing (1 min)**

Paste everything into your Project and write:

> Here's my prospect: [name], [title] at [company]. Here's their LinkedIn summary: [paste]. Here's what their company does: [paste 2-3 sentences from their About page]. We have a discovery call in 20 minutes. Give me the briefing.

That's it. Claude does the synthesis.

**Step 3: Read the briefing and add your own context (2 min)**

Read the output. Add one line of your own to the call notes with anything Claude missed that you already know — something from the booking email, a mutual connection, a specific thing they mentioned wanting to solve.

The briefing is your starting point, not your script.

## What the output looks like

A good briefing from this workflow covers:

- **Company snapshot**: what they do, who they sell to, approximate stage
- **Growth signals**: if they're hiring, what roles (signals investment areas and pain points)
- **Likely situation**: based on their stage and ICP fit, what are they probably dealing with
- **Conversation hooks**: 3 specific questions worth asking based on their context
- **Likely objections**: based on how they compare to your typical customer, what pushback to expect

You won't always get all of this — it depends on what information is publicly available. But even a partial briefing is better than starting cold.

## The one thing most reps skip

The ICP match. Claude can tell you what a company does. It can't tell you whether they're a good fit for your product without knowing your ICP. If you haven't uploaded your ICP description to the Project, the briefing will describe the prospect but won't help you decide how to position the call.

Add a paragraph to your Project instructions describing your best customers: company size, industry, growth stage, the problem they had before buying from you. Claude's output quality jumps significantly.

## After the call

Paste your call notes into the same Project. Ask Claude to:
1. Write the follow-up email referencing the specific things that came up
2. Summarise the prospect's situation and key objections for your CRM notes
3. Flag any red or green flags you should log

The same workflow that compressed pre-call research now compresses post-call admin. The whole cycle — prep, call, follow-up — goes from an hour of admin to under 15 minutes.
`,
  },

  // ── 5. AI for HR teams — field-note ──────────────────────────────────────
  {
    termSlug: 'claude',
    slug: 'ai-for-hr',
    angle: 'field-note',
    title: 'What AI actually looks like for an HR team',
    excerpt: 'HR involves a lot of writing, reviewing, and communicating. Here\'s where Claude saves real time — and where to be careful.',
    readTime: 5,
    cluster: 'Business Strategy & ROI',
    body: `HR teams are writers and communicators. Job descriptions, offer letters, policies, onboarding materials, performance review templates, difficult conversation frameworks — the function produces a huge volume of text. Claude is genuinely useful here, with some important caveats.

## What HR teams use Claude for

**Job descriptions.** This is often the first thing HR teams try, and it works. Give Claude the role title, team context, key responsibilities, and must-have experience. Claude produces a structured draft. The main edit required: make sure the language sounds like your company, not like every other job description on the internet. A style guide uploaded to a [Claude Project](/glossary/claude-projects) helps with this.

One specific use: inclusion review. Ask Claude to review a draft job description for language that might unintentionally discourage applications from underrepresented groups. It's not a substitute for professional DEI guidance, but it catches obvious things.

**Interview question banks.** Give Claude the role requirements and ask for 20 structured interview questions organised by competency. Then edit to keep the ones that reflect how your team actually evaluates candidates. Building a question bank from scratch takes hours; editing a draft takes 20 minutes.

**Policy drafts.** New policies — remote work, AI usage, expenses, parental leave top-ups — need drafting. Claude produces a solid first draft from a brief description of what you want the policy to cover. You then edit for your legal jurisdiction, your culture, and what your leadership has actually approved. Never ship a policy draft without review — this is one of the cases where the human review step is not optional.

**Onboarding documentation.** Week-one checklists, team guides, tool access runbooks, culture docs. Claude can draft all of these. The editing work is catching the company-specific details it can't know: the specific Slack channels, the way your standup works, who to ask about what.

**Communication drafts for difficult situations.** Redundancy communications, performance improvement plan language, internal announcements about sensitive changes. Claude can draft these in a neutral, professional tone. The requirement: a human with judgment reviews every word before anything goes to an employee. Claude can help you not start from a blank page; it cannot replace HR judgment in sensitive situations.

**Summarising feedback.** Paste 20 performance review responses and ask Claude to identify common themes — what people appreciate, what concerns come up repeatedly. Useful for identifying team-level patterns without having to manually code qualitative data.

## Where to be careful

**Anything that affects employment decisions.** Claude helps with drafts and summaries; a human makes every decision. There's meaningful legal and ethical risk in using AI outputs as the basis for hiring, firing, or performance decisions without appropriate human oversight.

**Jurisdiction-specific legal requirements.** Claude knows a lot about employment law in general but doesn't know your specific jurisdiction's requirements, your company's negotiated terms, or your legal counsel's guidance. All policy and contract drafts need legal review.

**Employee data.** Don't paste individual employee records, performance data, or personal information into Claude.ai. If you're building an internal HR tool with the API, your data handling practices need to comply with your privacy policies.

## The setup that makes it practical

A Project with:
- Your company values and culture description
- Your tone guidelines for HR communications (formal vs. conversational?)
- Your current headcount and growth stage (helps Claude calibrate role descriptions)
- Any standard templates you want Claude to follow

The goal: HR team members can get a useful first draft for almost any communication task without explaining company context each time.
`,
  },

]

async function main() {
  console.log(`Seeding ${ARTICLES.length} articles...`)

  for (const a of ARTICLES) {
    const term = await getTermId(a.termSlug)
    if (!term) {
      console.error(`  ✗ ${a.slug}: term not found: ${a.termSlug}`)
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
      console.error(`  ✗ ${a.slug}:`, error.message)
    } else {
      console.log(`  ✓ ${a.slug}`)
    }
  }

  console.log('\nDone.')
}

main().catch(console.error)
