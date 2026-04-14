/**
 * Batch 58 — New-to-AI on-ramp (three articles)
 *
 * 1. new-to-ai-start-here
 *    Orientation piece for people who have heard about AI but never gotten
 *    real value from it. Addresses the "is this worth my time?" question,
 *    gives a mental model (3 modes), explains what disappoints people, and
 *    points to Anthropic's AI Fluency course + Path 1.
 *    Audience: all (pinned). Cluster: Getting Started.
 *
 * 2. what-to-share-with-claude
 *    Data privacy article. Answers the #1 blocker for professional services
 *    owners and employees at companies: "Am I putting confidential information
 *    at risk?" Direct, practical, no hand-wringing.
 *    Audience: operator, all. Cluster: Getting Started.
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-58.ts
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

  // ── 1. new-to-ai-start-here ───────────────────────────────────────────────
  {
    termSlug: 'large-language-model',
    slug: 'new-to-ai-start-here',
    angle: 'role',
    title: 'New to AI? Start here.',
    excerpt: "You've heard about AI. You've maybe tried it once, got something weird, and closed the tab. This is the honest version of what it is, why most people's first attempts disappoint them, and what to actually do.",
    readTime: 8,
    cluster: 'Getting Started',
    body: `If you've opened this wondering whether AI is actually worth your time — that's the right question to start with.

The honest answer: for some things, yes. For others, not meaningfully yet. The people who get real value from Claude aren't the ones who use it for everything. They're the ones who figured out what it's actually good at and built a small number of habits around those things.

This takes about eight minutes.

## What Claude actually is

Claude is an AI assistant made by Anthropic. It was trained on enormous amounts of text and learned to understand language, follow instructions, reason through problems, and generate useful output across a huge range of tasks.

What it is not:
- A search engine — it doesn't browse the web in real-time by default, and its knowledge has a cutoff date
- A database — it can be wrong, and it doesn't always know when it is
- A magic productivity button — the quality of what you get out depends heavily on what you put in

The most useful mental model: Claude is like a very capable colleague who is available at any hour, works extremely fast, and needs clear direction to be useful. Vague instructions produce vague results. Specific, contextual instructions produce output that's often genuinely good on the first or second pass.

## Three ways people use AI

There are three distinct modes for working with AI, and recognizing which one you're in changes how you approach it.

**Automation** is when you hand Claude a specific task and it executes it. "Draft a reply to this email." "Summarize this 30-page report." "Translate this into plain English." You review the output and use what works. This is the easiest mode to start with and where most people get their first concrete wins.

**Augmentation** is when you and Claude work through something together. You bring your expertise and judgment; Claude brings speed, breadth, and a different angle. "I'm writing a proposal for a skeptical client — help me think through their likely objections." The result is better than what either of you would produce alone. This is the mode most people move into once they've gotten comfortable with the basics.

**Agency** is when you configure Claude to work on your behalf with minimal setup on each task. This is what Claude Projects enable: you describe your context, your clients, your preferences, and your typical tasks once — and every subsequent conversation starts with Claude already knowing all of that. More setup upfront, far more consistent value day-to-day.

Most people start in Automation, move to Augmentation once they've had enough experience to know how to direct it well, and set up Agency (Projects) when they're tired of re-explaining themselves every session.

## Why most people's first attempt disappoints them

The single most common pattern: someone tries AI, gets generic or wrong output, and concludes it's overhyped.

Usually the problem isn't the AI. It's one of three things:

**Treating it like a search engine.** "Write me a marketing email" produces a generic marketing email. "Write a follow-up email to a long-term client who went quiet after our February conversation — we did their year-end accounting, they were happy, but they haven't responded to my last two messages. Keep it warm, not pushy, and give them an easy out" produces something you might actually send.

**Not giving it your context.** Claude knows nothing about you, your business, your clients, or your preferences unless you tell it. Every conversation starts from zero unless you've set up a Project. The more specific context you provide, the more specific and useful the output.

**Expecting perfection on the first pass.** Claude is fast and often good. It's rarely perfect. The workflow that actually works: generate, evaluate, refine. Two or three exchanges almost always beat a single prompt. When the first output isn't right, tell it what's wrong — don't just ask again.

## Your first 15 minutes

1. Go to [claude.ai](https://claude.ai) and create a free account.
2. Take something real from your work — an email you need to write, a document you need to summarize, a message you're stuck on — and give it to Claude with actual context about what you need.
3. When the output isn't quite right, tell it specifically what's wrong and ask for another pass.

That one session will tell you more about whether this is useful for you than reading about it for an hour.

## Where to go from here

**For the conceptual foundation** — what AI actually is, how it was built, and why it behaves the way it does — Anthropic has a free AI Fluency course that covers this well. It's a couple of hours and gives you a framework (the 4Ds: Delegation, Description, Discernment, Diligence) that makes the rest of your AI usage more intentional.

**For practical application** — how to actually use Claude effectively in your specific work — that's what this site is for.

[Path 1: Claude for your work](/learn/claude) is the right next step: eight practical guides for anyone using Claude personally, starting with how to write prompts that actually work and ending with building a routine that sticks. No technical background needed.

The Anthropic course gives you the theory. Path 1 gives you Monday morning.`,
  },

  // ── 2. what-to-share-with-claude ─────────────────────────────────────────
  {
    termSlug: 'system-prompt',
    slug: 'what-to-share-with-claude',
    angle: 'role',
    title: "What's safe to share with Claude — and what isn't",
    excerpt: "The most common reason professionals hold back from using Claude for real work: they're not sure whether they're putting confidential information at risk. Here's the direct answer.",
    readTime: 6,
    cluster: 'Getting Started',
    body: `The most common reason professionals hold back from using Claude for real work: they're not sure whether they're putting confidential information at risk by pasting it in.

It's a fair concern. Here's the direct answer.

## What Anthropic does with your data

When you send a message to Claude, it's transmitted to Anthropic's servers, processed to generate a response, and returned to you.

What happens after that depends on your plan:

**Free plan (claude.ai):** Anthropic's terms permit using conversations for safety research and product improvement. For casual personal use, this is typically fine. For work involving client information, employer data, or anything you'd consider confidential, it's not the right environment.

**Pro plan:** Conversations are not used to train Claude. Anthropic processes your inputs to generate responses; they are not fed back into model training.

**Team plan:** Same no-training policy as Pro, plus organizational admin controls — your IT or ops team can manage access, set retention policies, and monitor usage.

**Enterprise plan:** The strictest data controls, with options for custom data retention, audit logs, and in some cases a Business Associate Agreement (BAA) for regulated industries.

If you're doing professional work involving client or employer data: use a paid plan.

## The vendor test

A useful heuristic for any given piece of information: *Would I share this with an outside contractor or consultant working on this project?*

If yes — it's probably fine to share with Claude. If no — because it contains personally identifiable client information, trade secrets, financial data, or anything regulated — apply the same standard.

**Generally fine to share:**
- Your own drafts, documents, and notes
- General business context ("we're a 9-person accounting firm focused on small business clients")
- Anonymized examples ("my client is a manufacturing company with about $2M in annual revenue and they have this situation...")
- Publicly available information
- Your own intellectual work that you'd share with a collaborator

**Worth being cautious with:**
- Client names paired with sensitive details (financial, legal, health)
- Contracts or agreements marked confidential
- Personally identifiable information about individuals (names, SSNs, addresses)
- Medical or health records
- Anything that falls under specific regulatory requirements in your industry

## For professional services firms

If you're an accountant, lawyer, consultant, or anyone handling client information professionally: a paid plan plus basic judgment about what you share gets you to a reasonable standard for most work.

The practical approach most professionals use: anonymize where you can. "My client runs a $2M manufacturing business and has this tax situation" is sufficient for almost every task. Using their actual name and attaching their real financial statements adds risk that's unnecessary for most purposes.

A paid plan plus anonymized inputs is the right posture for professional services. For highly regulated environments (healthcare, financial services with specific data regimes), check with your compliance team before using any cloud AI tool — this is not unique to Claude.

## For employees at companies

Many organizations are developing AI usage policies. If yours hasn't published one: treat Claude like any other cloud software tool you use for work. Share what you'd share in a business email or a document stored in company Google Drive — not everything in your database.

If your organization is on the Team or Enterprise plan, your admin has likely configured appropriate data handling already. If you're using a personal Pro account for work: you're responsible for applying your company's data standards to what you share.

## The practical summary

The risk of using Claude on a paid plan for most professional work is comparable to using Google Docs or Dropbox — reasonable with judgment, not unlimited. The specific things that create real risk:

- Sharing regulated data you don't need to share (when an anonymized version would work just as well)
- Using a free account for work involving confidential client information
- Assuming a paid plan means anything goes — it means no training use, not no data handling

Most professional tasks — writing, editing, analysis, research, summarizing documents — don't require sharing the most sensitive details. Learn what you actually need to include to get a useful output, and share that much.`,
  },

  // ── (marketing teams article removed — reserved for paid tier) ───────────
  /*
  {
    termSlug: 'large-language-model',
    slug: 'claude-for-marketing-teams',
    angle: 'role',
    title: 'Claude for marketing teams',
    excerpt: "Marketing is one of the strongest fits for Claude — but not for the reasons most people assume. The wins aren't in generating more content faster. They're in the thinking work underneath the content.",
    readTime: 8,
    cluster: 'Role Guides',
    body: `Marketing is one of the strongest fits for AI — writing, research, analysis, briefing, iteration. But the people who get the most value from Claude on marketing teams are usually not the ones generating content at scale. They're the ones using it for the thinking work that precedes and shapes the content.

That distinction matters for how you set it up.

## What actually works

### Campaign and content briefing

Claude is excellent at taking messy inputs — a positioning doc, a conversation summary, a strategic objective — and producing a tight brief. "Here's what we know about this product launch, here's the campaign goal, here are the constraints. Draft a brief for the creative team." The output is rarely final, but it gets you 80% of the way there in minutes instead of hours.

The key is feeding it real inputs. The more context it has — actual product information, actual audience data, actual competitive landscape — the more useful the brief.

### Copy drafts and variations

Claude can produce multiple copy variations quickly for testing. Give it the context (what you're selling, who it's for, what you want them to do, what constraints you have) and ask for four or five variations with different tones or angles. Use this as raw material for your own judgment, not as finished output.

Where this works best: email subject lines, ad headline variations, landing page headlines, social copy. Where it works less well: long-form thought leadership, brand storytelling, anything where your distinctive voice is the point.

### Competitive and market research synthesis

Claude can't do primary research, but it's good at synthesizing information you give it. Paste in a competitor's homepage, pricing page, and recent press releases and ask for an analysis of their positioning. Dump in a batch of customer feedback and ask for themes. Feed it a research report and ask for the three most relevant implications for your specific situation.

The pattern: you gather the raw information, Claude helps you structure and extract meaning from it faster than you could manually.

### Performance analysis narrative

Data people can pull the numbers. What's harder is writing the narrative — what this week's campaign performance actually means, what's working, what to change. Claude is useful here: give it the numbers, the context (what we were trying to do, what changed), and ask for a clear summary with implications.

### Stakeholder and internal communications

Marketing spends a lot of time explaining things to people who don't live in marketing — leadership updates, budget justifications, cross-functional briefs. Claude is good at helping you translate marketing work into the language of business impact. "Here's what we did last quarter. Help me write this up for a leadership team that cares about pipeline and revenue, not impressions and clicks."

## The brand voice problem

Claude doesn't know your brand voice unless you teach it. Without guidance, it defaults to something that sounds competent but generic — polished but not distinctive.

The fix: give it examples. Paste in three or four pieces of copy that represent your brand at its best and say "write in this style." Or describe it explicitly: "our voice is direct and a bit dry — we never use exclamation marks, we avoid corporate jargon, we write like we're talking to a smart colleague, not pitching at a prospect."

You'll still need to edit for voice. Claude gets you a useful draft; you make it yours.

## Setting up a marketing Project

If you use Claude regularly for marketing work, a Project is worth the 20-minute setup.

Your system prompt should include:
- What your company does and who it's for (actual positioning, not the PR version)
- Your audience — who you're writing for, what they care about, what they're skeptical of
- Brand voice — examples of writing that sounds like you, and descriptions of what you're avoiding
- Common context you find yourself re-explaining (product features, pricing tier names, campaign frameworks your team uses)

Once this is set, every conversation starts with Claude already knowing your context. You stop spending the first paragraph of every session catching it up.

## Where to be realistic

**Thought leadership and brand voice content** — Claude can draft it, but if your content strategy depends on a distinctive perspective, you'll need to do more editing than it might feel worth. Use Claude for structure and a starting draft; bring the ideas and the voice yourself.

**SEO content at volume** — generating large amounts of content with Claude and publishing it without meaningful human editing is a strategy with diminishing returns. Search and readers both penalize generic. If you're going to use Claude for SEO content, the editing pass where you add real specificity and actual perspective is the part that determines whether it works.

**Anything requiring factual accuracy about your own products** — Claude only knows what you tell it. If you give it outdated or incomplete product information, it will confidently write content based on that. Always verify product-specific claims in anything going out.

## The marketing team workflow

What a week using Claude well looks like for a marketing coordinator or manager:

**Monday:** Paste your campaign performance data and key context into Claude, ask for a draft performance summary for the weekly standup. Edit it. Saves 30 minutes.

**When briefing creative:** Start with a quick Claude pass to get structure — audience, goal, message hierarchy, constraints. Then refine it with your own knowledge of what the creative team actually needs.

**When writing copy:** Give Claude the brief and ask for three variations. Use them as raw material, not finished work. Pick the best starting point and rewrite it.

**Before a big send:** "Here's this email. What's likely to confuse readers? What objections might it create? What's the weakest sentence?" Better to hear this from Claude than from your inbox.

**When prepping for a leadership update:** "Here's what we did last month and here are the results. Write a summary focused on business impact, not marketing metrics." Then add the strategic context that Claude doesn't have.

## The honest version

Marketing teams that get real value from Claude are using it to go faster on the cognitive work they were already doing — briefing, drafting, synthesizing, analyzing. They're not replacing judgment with generation. The output is only as good as the direction they give it, which means marketing expertise still matters — maybe more than it did before, because you now need it to direct the tool effectively rather than just produce the work yourself.

---

*Related: [How to write a good prompt](/articles/how-to-write-a-good-prompt) — if Claude's output consistently misses the mark, this is usually why. [Claude for writing and editing](/articles/claude-for-writing-and-editing) — covers the writing workflow in more depth. [Claude Projects guide](/articles/claude-projects-role) — how Projects work and how to set one up for your team.*`,
  },
  */

]

async function main() {
  console.log(`Seeding ${ARTICLES.length} articles (batch 58 — new-to-AI on-ramp: orientation + privacy)...\n`)

  for (const art of ARTICLES) {
    const term = await getTermId(art.termSlug)
    if (!term) {
      console.error(`  ✗ Term not found: ${art.termSlug}`)
      continue
    }

    const { error } = await sb.from('articles').upsert({
      slug:      art.slug,
      term_id:   term.id,
      term_name: term.name,
      term_slug: art.termSlug,
      cluster:   art.cluster,
      title:     art.title,
      angle:     art.angle,
      body:      art.body.trim(),
      excerpt:   art.excerpt,
      read_time: art.readTime,
      tier:      3,
      published: true,
    }, { onConflict: 'slug' })

    if (error) {
      console.error(`  ✗ ${art.slug}:`, error.message)
    } else {
      console.log(`  ✓ ${art.slug}`)
    }
  }

  console.log('\nDone.')
}

main().catch(console.error)
