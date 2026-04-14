/**
 * Batch 42 — Persona-driven gaps
 * 1. how-to-convince-skeptical-teammate (Priya's #1 unanswered question)
 * 2. solo-founder-project-setup (Lena's specific gap)
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-42.ts
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

  {
    termSlug: 'claude-projects',
    slug: 'how-to-convince-skeptical-teammate',
    angle: 'process',
    title: 'How to get a skeptical teammate to actually try Claude',
    excerpt: "Every team rollout has the same person: smart, experienced, quietly resistant. They have tried AI before and found it underwhelming. Here is what actually works — and what makes skeptics dig in harder.",
    readTime: 6,
    cluster: 'Business Strategy & ROI',
    body: `Every team Claude rollout has the same person. They have been around long enough to have seen productivity tools come and go. They tried an AI tool once and found it generated confident-sounding nonsense. They are not hostile — they just do not think it is going to change their work, and they are not going to pretend otherwise.

If you push them too hard, they comply performatively and then revert. If you ignore them, they become the visible non-adopter who makes the rollout feel like a failure even when the rest of the team is getting real value.

Here is what actually works.

## What does not work (first)

**Sending articles and videos.** People do not change their minds from reading general content about AI capabilities. They change their minds from doing something specific and having it work.

**Assigning use cases.** "Use Claude to write your weekly update" — given as a directive — feels like extra work with a new tool added on top of the actual work. It is experienced as a burden, not an opportunity.

**Showing them impressive demos.** Demos of other people's workflows are not credible. The skeptic has already heard about the impressive things AI can do. That is not the reason they are skeptical. They are skeptical about whether it will do those things reliably for their specific work.

**Framing it as a company initiative.** The more the rollout is positioned as a top-down mandate, the more the skeptic's resistance is about the mandate, not about Claude. You want their first real use of Claude to be something they chose.

## What actually works

**Start with their actual frustration, not your use case.**

The most effective approach is to ask the skeptic what they find most tedious or repetitive in their current work — not "what could AI help with?" but "what do you find yourself doing that you wish someone would just do for you?"

Then try Claude on exactly that, together, with real data. Not a demonstration of what it can do generally — a direct attempt on the specific thing they find annoying.

If it works, they experienced it themselves. If it does not work well the first time, that is also fine — troubleshoot it together. "What would make this output actually useful?" is a useful conversation that builds their understanding of what good prompting looks like.

**Give them something that saves time today, not something that might help in the future.**

The best first use case is something that has an immediate, measurable time saving: draft a document they have been putting off, summarize a long thread they need to respond to, prepare talking points for a meeting they have this afternoon. The value needs to be felt in the same session, not promised for the future.

**Let them own the prompt.**

When you work through the first use case together, let them write (or heavily modify) the prompt. People trust outcomes they had a hand in producing. If you run the prompt and show them the output, they are watching a demo. If they run the prompt themselves, they produced the output.

**Do not oversell the result.**

The skeptic's radar is tuned for hype. If you say "wow, that would have taken you an hour!" when the draft is actually mediocre, you lose credibility. Acknowledge what was good, acknowledge what needs fixing, and let the time comparison be real. "That gave you a starting point in two minutes instead of fifteen — is that useful?" is more persuasive than enthusiasm.

## The specific conversation that usually works

Pick a moment when they have a concrete task in front of them — something they need to produce today. The opening that works best is not "can I show you Claude?" — it is something like: *"Hey, what's the most annoying thing you have to write this week? I want to try something quickly."* That framing is about their problem, not about the tool.

Paste the relevant context and ask Claude to produce a draft. Watch together. Ask: "Is that useful, or is it off?"

If it is off: figure out why and try again. One round of iteration is more instructive than a perfect first result.

If it is useful: ask what they would need to change to send it. Let them edit it. Note how long the whole thing took.

That is the proof of concept. Not a demo, not a mandate — a 10-minute experiment with real work, producing something real.

## The people who stay skeptical

Some people will remain resistant after good-faith attempts. A few honest observations:

The people who are most resistant to trying Claude are often the highest performers on the team — they have strong workflows, they are fast at their current approach, and the switching cost is genuinely higher for them. This is not perversity. They are correctly assessing that their existing workflow is good.

For high performers, the right framing is not "Claude will help you do your job" — it is "Claude frees up your time for the work only you can do." The value proposition is different. It is about offloading the parts of their work that do not require their specific judgment, so they can spend more time on the parts that do.

The people who never convert are usually fine. One visible holdout does not undermine a team rollout if the rest of the team is getting real value. Trying to force adoption from someone who has genuinely evaluated Claude and decided it does not help them is not a productive use of your time.

---

*If you are managing the broader rollout question — sequence, metrics, what success looks like — [running your first AI pilot](/articles/running-your-first-ai-pilot) covers the structural side. For the CS team context specifically, the [CS manager workflow guide](/articles/cs-manager-ai-workflow) shows what the practical day-to-day looks like once adoption is working.*`,
  },

  {
    termSlug: 'claude-projects',
    slug: 'solo-founder-project-setup',
    angle: 'process',
    title: 'Setting up your Claude Project as a solo founder',
    excerpt: "Everyone says to create a Project. Nobody shows you what to write in the system prompt if you are a solo founder building a B2B product. Here is what to include — and the three things most founders skip.",
    readTime: 5,
    cluster: 'Founder',
    body: `Everyone says to create a Claude Project. The advice is always the same: create a Project, add a system prompt with your context, upload relevant documents. Nobody shows you what this looks like for a solo founder building a B2B product.

This article fills that gap. Below is what to write and why, with explanations of what each section does and what happens if you skip it.

## What a Project system prompt actually does

Before getting to the template: a Project system prompt is loaded into every conversation in that project, automatically. You do not have to repeat it. Claude starts every session already knowing what is in it.

The practical consequence: every piece of context you put in the system prompt is something you never have to explain again. Your company, your product, your customer, your current priorities — all of it. If you spend five minutes writing a good system prompt, you recover that time in the first week.

## What to include

**1. What you are building (one sentence)**

Not a paragraph. One sentence that captures what the product does and who it is for.

*"I am building a B2B SaaS tool that helps HR teams automate new hire onboarding — specifically the checklist and document collection process."*

This determines what "good" looks like for every output Claude produces. Without it, Claude defaults to generic advice. With it, Claude knows whether to lean toward enterprise buyer language or SMB, whether to frame things around HR workflows or developer workflows, whether cost or compliance is likely to be the primary concern.

**2. Where you are in the journey**

*"Pre-revenue, bootstrapped, no co-founder. Currently in active customer development — talking to HR managers at companies of 50–500 people."*

This matters more than most founders realize. Claude's advice for a pre-revenue solo founder validating a market is different from advice for a funded startup hiring a sales team. Tell it where you are, so the advice is relevant to the actual stage you are in.

**3. Your customer in one sentence**

*"My target customer is an HR Manager at a mid-size company (50–500 employees) who is managing new hire onboarding manually — spreadsheets, email chains, individual document requests."*

This is your ICP (ideal customer profile) stated concisely. When you ask Claude to help you draft a cold email, write landing page copy, or prepare interview questions for customer discovery, this context determines whether the output is relevant or generic.

**4. What you are working on right now**

*"Current focus: customer discovery. I am running 30-minute calls with HR managers and trying to understand whether the biggest pain is the tracking process, the compliance risk, or the new hire experience."*

This changes every few weeks. Keep it updated. When you are actively working on customer discovery, Claude's suggestions for how to frame questions, analyze patterns, and synthesize what you are hearing will be much more targeted.

**5. Your communication style**

*"I write in a plain, direct style. No corporate buzzwords, no padding. Short sentences. Conversational but professional."*

Two sentences here eliminate the most common frustration with Claude-drafted content: the AI-smooth register that makes everything sound like it was written by a committee. Describe how you actually write, and Claude matches it.

## The three things most founders skip

**The stage.** Without knowing whether you are pre-revenue, post-revenue, pre-product, or scaling, Claude defaults to generic startup advice that is often wrong for your specific moment. This is the single biggest impact addition.

**The customer.** Founders often write about their product but not their customer. Claude giving you advice about your product without knowing who you are selling to is like a copywriter writing without knowing the audience.

**The current focus.** The system prompt feels like something you set once and leave. But updating the "what I am working on right now" field every few weeks means Claude's input stays relevant to what you actually need this week, not what you needed three months ago.

## Documents to upload

Beyond the system prompt, upload into the Project:

- **Your current landing page copy** — lets Claude match your voice and framing without being told
- **Your customer discovery notes** (anonymized) — lets Claude help you find patterns, synthesize themes, draft follow-up questions
- **Any key email templates you have written** — gives Claude a voice reference beyond what is in the system prompt

Do not over-upload. Three to five focused documents beats a Project stuffed with things Claude will rarely need. Quality over comprehensiveness.

## The 15-minute setup

1. Open Claude, go to Projects, create a new project (name it "[Product] — Working Session" or similar)
2. In the project instructions, write the five sections above — 3–5 sentences total per section
3. Upload your landing page and any customer discovery notes you have
4. Start your next work session inside the project instead of in a regular conversation

The whole setup takes about 15 minutes. After that, every conversation in the project starts with Claude already knowing everything it needs to know about your product, your customer, and where you are.

---

*For what a real working week with Claude looks like once the Project is set up, [the founder workflow guide](/articles/founder-ai-workflow) covers Monday through Friday. For the broader question of what to build with Claude vs. buy vs. prompt, [this guide](/articles/build-buy-prompt-early-stage) has the decision framework.*`,
  },

]

async function seed() {
  console.log('Seeding batch 42...\n')

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
