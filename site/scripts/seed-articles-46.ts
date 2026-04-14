/**
 * Batch 46 — New employee Claude guide
 * 1. first-week-with-claude — the employee-side onboarding guide:
 *    "I just joined a company that uses Claude. What do I actually do?"
 *    Priya's open question #2. Broadly useful for any new employee.
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-46.ts
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
    slug: 'first-week-with-claude',
    angle: 'process',
    title: 'Your first week with Claude at a new job',
    excerpt: "You just started somewhere that uses Claude. You've been told to 'get up to speed on AI.' Here's what to actually do in week one — setup that will save you hours by week three.",
    readTime: 5,
    cluster: 'Business Strategy & ROI',
    body: `You've joined a company that uses Claude. Maybe your manager sent you a doc, maybe you were told to "figure it out," maybe you got a 10-minute demo on day two. Either way, you're starting from scratch while also learning the job.

This is the setup that will make Claude actually useful to you — not generically useful, but useful for your specific role at this specific company. It takes about 20 minutes. Do it in the first week.

## The problem with starting from scratch every conversation

If you open Claude and type "help me write a follow-up email for a customer" without any context, you will get a generic follow-up email that does not sound like you, does not reference your product, and does not match how your company communicates. Then you spend 10 minutes editing it, decide it is not worth it, and go back to writing it yourself.

Most new employees who try Claude and give up are working this way. Every conversation starts from zero.

The fix is a Project. It is the difference between Claude knowing nothing about you and Claude knowing who you are, what you do, and what you are working on.

## Step 1: Create a Project for your role

In Claude's web interface, create a new Project. Name it something simple — "CS Role" or "Marketing Work" or whatever describes your job.

In the Project instructions (the system prompt), put three things:

**Who you are and what you do:**

> I'm [name], a [job title] at [Company Name]. [One sentence on what the company does.] In my role, I [brief description of main responsibilities — 1-2 sentences].

**The context that will save you time:**

> [Company name] sells [product/service] to [customer type]. Key things to know about our customers: [2-3 relevant facts from what you've learned in onboarding — industry, typical company size, main pain points we solve].

**Your communication style:**

> Our tone is [professional/casual/formal — whatever you've observed from internal comms]. When writing customer-facing communications, [any specific guidelines — "avoid jargon," "use first name," "always include a clear call to action," whatever is true for your company].

If you don't know all of this in week one, that's fine. Put in what you know and update it as you learn more. Even half a system prompt is dramatically better than nothing.

## Step 2: Upload what you know

Once the Project is set up, add the documents that give Claude real context:

- **Your company's product one-pager or pitch deck** — Claude will understand what you sell and how you describe it
- **The onboarding doc you were given** — if it covers processes, terminology, or workflows, add it
- **Any sample emails or communications your team uses** — this teaches Claude your company's voice, not a generic one

You do not need to curate these documents. Drop them in. Claude will use what is relevant and ignore what is not.

If you are in a customer-facing role, also add:
- A few anonymised sample customer emails (the types you will be dealing with)
- Your team's FAQ or common objection responses if they exist

If you are in an internal role (ops, HR, finance), add:
- Any process documentation or SOPs you have been given
- Relevant templates your team uses

## Step 3: The three things to try in week one

Once your Project is set up, use it for three things before the end of your first week. This is not about productivity — it is about learning what Claude can and cannot do for your specific job.

**1. A real task you are procrastinating on.**

Pick something on your to-do list that requires writing — a follow-up email, an internal update, a meeting summary, a response to a common question. Do it in Claude first. See how close it gets to what you would have written. Edit it. Notice what it got right and what it missed. That gap tells you where Claude needs more context.

**2. A question you have been embarrassed to ask.**

You're new. There are things you do not know and do not want to ask your manager about for the fourth time. Ask Claude. "What is [industry term]?" "What does [internal acronym] typically stand for?" "How do I typically handle [situation] in a CS role?" It will not judge you, and the answers will often be useful enough to close the gap.

**3. Summarising something you need to understand quickly.**

Onboarding involves absorbing a lot of information. Paste a document, email chain, or meeting transcript into Claude and ask: "Summarise the key points. What do I need to know from this? What questions should I be asking?"

This is not about laziness — it is about getting oriented faster so you can focus your attention on what requires human judgment.

## The mistake most new employees make

The most common mistake: treating Claude like a search engine or a spell-checker. "Clean up this email." "Summarise this doc." These are low-leverage uses that barely justify the context switch.

The higher-leverage use: treat Claude like a thinking partner who knows your role. "Here is the situation with this customer. What am I missing? What would you do here?" Or: "I need to present this update to my manager. What are the two weaknesses in my thinking?"

These uses require more from you — you have to share enough context for Claude to engage meaningfully. But the payoff is much higher than grammar checking.

## What to do when Claude gets something wrong

Claude will get things wrong, especially early in your use of it. It will misread a situation, suggest a tone that does not fit your company, or make an assumption about your customer that is incorrect.

When this happens:
1. Correct it in the conversation: "That tone is too formal for our customers — we're more casual. Try again."
2. If it is a pattern, update your Project instructions: "Claude keeps being too formal, so I'll add a note about tone."

The system gets better as you teach it. Your Project instructions at the end of month one will be more accurate than at the start of week one.

## The 20-minute investment

Set up the Project in week one. Add documents. Try three things. Update the instructions once after your first week of use.

That's it. You don't need to read a book about AI or build a workflow from scratch. The people who get the most out of Claude at work are not the ones who spent the most time learning about AI — they're the ones who bothered to give it enough context to be useful.

---

*If your company has a Claude administrator who has set up organisation-wide tools or connectors, ask them what's available. Some companies have set up integrations with Salesforce, Intercom, or other tools that make Claude significantly more useful for role-specific work. For the admin perspective on how to onboard a team to Claude effectively, [see the HR and onboarding guide](/articles/claude-for-new-hire-onboarding).*`,
  },
]

async function seed() {
  console.log('Seeding batch 46...\n')

  for (const article of ARTICLES) {
    const term = await getTermId(article.termSlug)
    if (!term) {
      console.error(`  Term not found: ${article.termSlug} (for ${article.slug})`)
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
      console.error(`  ${article.slug}:`, error.message)
    } else {
      console.log(`  ${article.slug} — seeded`)
    }
  }

  console.log('\nDone.')
}

seed().then(() => process.exit(0))
