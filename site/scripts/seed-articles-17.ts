/**
 * Batch 17 — Building with AI: completing the founder journey
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-17.ts
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

  // ── 1. Pitching an AI product to investors ───────────────────────────────
  {
    termSlug: 'ai-strategy',
    slug: 'pitching-ai-product-to-investors',
    angle: 'process',
    title: 'How to pitch an AI product to investors without losing them in the first two minutes',
    excerpt: 'Most AI pitches fail because they lead with the technology. What investors actually want to hear — and the specific narrative structure that works.',
    readTime: 7,
    cluster: 'Business Strategy & ROI',
    body: `The most common mistake in an AI startup pitch is the demo.

Not because demos are bad — they are often essential. But because most founders structure their pitch as: problem, demo, market size, team. The demo is in minute three. By minute seven they are talking about their model architecture. By minute ten the investor is thinking about their next meeting.

The demo answers the question "can you build this?" Investors already assume you can build it. What they are uncertain about is whether anyone will pay for it, whether you can reach them, and whether you will be around in three years. The demo does not answer any of those questions.

Here is the narrative structure that actually works — and why each piece matters.

## What investors are actually evaluating

Before getting into the structure, it helps to understand what a seed or pre-seed investor is evaluating when you walk in.

They are not evaluating your technology. Frontier AI capabilities are table stakes now. The question is not "can Claude do this?" — it is "why will people pay you to do this with Claude, specifically?"

They are evaluating:
- Whether the problem is real and painful (not interesting, painful)
- Whether you understand the customer better than anyone else in the room
- Whether the business can grow (distribution, not just product)
- Whether you, specifically, are the right person to build this

The pitch is evidence for all four. Every slide and every sentence should be answering one of these questions.

## The structure that works

**Open with the customer, not the problem**

Most founders open with the problem. "The enterprise knowledge management market is broken." This is abstract. It requires the investor to translate it into a human being having a bad day.

Start with the person instead. Describe one specific customer in one specific moment. Not a persona — a person. Their job title, the tool they are in, the thing they are trying to do, the exact moment when it falls apart.

"A CS manager at a 50-person SaaS company is prepping for eight QBRs this week. She has four hours to do it. She spends ninety percent of that time pulling data from three different tools and formatting slides. The actual thinking — what does this customer actually need, what is the renewal risk, what should I lead with in the meeting — gets twenty minutes."

Now the investor has a picture. Every claim you make after this is grounded in that picture.

**Make the insight specific**

The insight is not "AI can help with this." Everyone knows AI can help with this. The insight is why your specific approach, for this specific customer, at this specific moment in time, is different from what anyone else is doing.

The insight should be something that is not obvious until you explain it, and feels obviously right once you do. If the investor could have predicted your insight before you said it, it is not differentiated enough.

Bad insight: "Enterprises waste time on manual processes that AI can automate."

Better insight: "CS teams are the only revenue-facing function with no structured playbook for AI — they have been handed Claude and told to figure it out, so every rep is reinventing the same prompts every week. We have built the playbook and operationalized it."

**The demo, if you show it, should demonstrate the insight**

If you show a demo, it should make the insight visceral — not just show that the product works. A demo that shows "here is a button, you press it, AI generates output" is showing capability. A demo that shows "here is the exact moment the CS manager gets time back, and here is what she now does with that time" is showing value.

Less is more. Show the single most important thing, not everything it can do.

**The business slide is about distribution, not the product**

Most AI pitches have a slide about the product (fair) and a slide about the market size (fine, but not what you think). What is almost always missing is a credible distribution thesis.

How do you reach customers? Not "we will do outbound" — that is a method, not a thesis. A distribution thesis is a specific unfair advantage: a community you are already embedded in, a channel that most companies cannot access, a partnership that puts you in front of the right buyers, a content or brand moat that makes customers come to you.

If you do not have a distribution thesis, say so honestly — and explain what you are doing to find one. Investors respect honesty about early-stage uncertainty much more than a confident-sounding slide about TAM.

**The team slide is about why you**

Not why you are smart. Why you — specifically — are the right people for this particular problem. What do you know about this customer that someone who just read about the problem would not know? What gives you an advantage in building this that a better-funded team would not automatically have?

The answers are usually: you lived the problem, you have a specific technical insight, you have direct relationships with the first ten customers, or you have built something adjacent that taught you what not to do. One of these is usually true. Make it explicit.

## What to do about the AI-skeptic investor

You will encounter investors who are skeptical of AI-specific startups — either because they have seen too many demos that did not translate to businesses, or because they are worried about commoditization as models improve.

The commoditization objection is real and worth addressing head-on: "As models get better, won't the capability you're building get commoditized?"

The honest answer: yes, the capability gets commoditized. What does not get commoditized is the customer relationship, the workflow data, the distribution, and the brand. If your moat is the AI, you are building on sand. If your moat is the customer relationship that the AI enables — the reason they share their data with you, the reason they trust your output, the reason they would not switch even if a competitor had a marginally better model — that is durable.

Say this explicitly. It signals that you understand the market dynamics at a level most AI founders do not.

## The specific things that kill AI pitches

**Spending more than two minutes on how the AI works.** Nobody at the seed stage is investing in your model architecture. If you catch yourself explaining embeddings, stop.

**"We use AI to..." as the headline.** AI is infrastructure, not a headline. "We help CS managers close more renewals" is a headline. The AI is how you do it.

**Not knowing your numbers.** What does it cost you to acquire a customer? What do they pay? How long do they stay? At the earliest stage, rough estimates are fine. But "we haven't thought about this yet" is not.

**The generic TAM slide.** "The enterprise software market is $X trillion." This tells the investor nothing about whether your specific market is real and reachable. How many CS managers are there? What do they currently pay for tools in this category? What does a realistic conversion look like?

**Underselling the problem.** If the problem is real, make it hurt. Founders often soften the problem because they do not want to seem like they are exaggerating. Investors are looking for evidence that the pain is acute enough that people will change their behavior to make it go away. If the problem is a mild inconvenience, the product will be a nice-to-have.

## The thing investors remember

After the meeting, an investor will remember one thing about your pitch. Design that thing consciously.

It is almost never the product feature or the market size. It is usually a specific customer insight, a surprising number, or a moment in the demo where something clicked.

What is the one thing you want them to remember? Put it in minute two. Then make everything else in the pitch support it.`
  },

  // ── 2. Pricing your AI product ───────────────────────────────────────────
  {
    termSlug: 'ai-roi',
    slug: 'pricing-your-ai-product',
    angle: 'process',
    title: 'Pricing your AI product: the decisions most founders get wrong',
    excerpt: 'Pricing AI products is harder than pricing regular software because your costs are variable and your value is hard to measure. Here is the framework that actually holds up.',
    readTime: 6,
    cluster: 'Business Strategy & ROI',
    body: `Most early-stage founders underprice their AI product. Not because they are afraid to charge — founders are usually fine with charging. They underprice because they anchor to their API costs instead of to the value they create.

Here is the framing shift: your price is not a markup on what Claude charges you. Your price is a fraction of the value you create for your customer. Those are very different numbers, and they lead to very different businesses.

## The cost anchor trap

The math goes like this: an API call costs me a few cents. I make some margin on top. I charge a few dollars per user per month. This feels principled — it is cost-plus pricing, it scales with usage.

The problem: if your product saves a CS manager three hours of prep work per week, at an average salary of $60k, that is worth roughly $90 a week in labor cost. Your cost-anchored price of $29 a month is capturing about 8% of the value you create. You are leaving almost all of it on the table, and pricing yourself into a business with wafer-thin margins and no room to invest in growth.

Value-based pricing starts from the other direction: what is this worth to the customer, and what fraction of that can I reasonably capture?

## What you need to know before you price

**The value calculation.** For your specific customer and your specific use case, what does the outcome of your product translate to in dollars? Time saved × loaded hourly rate is the simplest version. More sophisticated versions include revenue recovered, errors prevented, decisions made faster. You need at least a rough number.

**The competitive alternatives.** What does the customer currently pay (in time, money, or friction) to get the same outcome? If the alternative is doing it manually, that is your baseline. If there are competing products, their pricing anchors your range.

**Who is paying.** The person using your product is often not the person writing the check. A CS manager using your tool every day may have zero budget authority — the decision goes to their VP or the CFO. Pricing has to work for both: low enough that the user can get it expensed, valuable enough that it survives a procurement conversation.

**Your cost floor.** At what price does serving this customer cost you more than you earn? This is your floor, not your price. But you need to know it — especially for high-usage customers who consume a lot of API calls.

## The three models, and when to use each

**Flat monthly per-seat pricing**

The default. Simple to understand, simple to sell, predictable revenue. Works when usage per user is relatively consistent — you are not going to get surprised by a power user running ten thousand API calls a month.

The risk: you have customers who use the product intensively (high API cost) and customers who barely use it (low API cost). Flat pricing cross-subsidizes the heavy users, which is fine until the heavy users dominate your customer base.

Recommended starting point for most B2B AI tools targeting individual contributors or small teams.

**Usage-based pricing**

You charge for what customers use — number of queries, documents processed, outputs generated. Scales naturally with value: customers who get more value pay more.

The downside: unpredictable revenue is harder to plan around, and customers are sometimes hesitant to adopt tools with variable costs. "I don't want to be surprised by a bill" is a real objection.

Usage-based works well when the value delivered is clearly proportional to usage (more documents processed = more time saved), when you have enterprise customers who expect to pay for what they use, and when your API costs vary significantly with usage.

**Tiered plans with a usage component**

Flat base fee that covers a usage allowance, with overage charges above the threshold. The most common structure for AI products that have made it past early stage.

Structurally: a starter plan that covers typical usage for a small team, a professional plan for heavier use, an enterprise tier for custom contracts. This is not the right structure at day one — it adds complexity before you need it. Get to it when you understand your usage distribution across customers.

## What to charge at the earliest stage

Charge more than you think is reasonable.

The specific number matters less than you think at the earliest stage, because you have so few customers that no single price will give you meaningful signal. What matters is getting into the zone — not so cheap that it undervalues the product and selects for price-sensitive customers who churn, not so expensive that the conversation never gets past procurement.

For most B2B AI products targeting individual contributors at SMBs, the zone is $49–$199 per seat per month. For products targeting teams or departments, it is $300–$2,000 per month. These feel high compared to typical SaaS benchmarks. They are not — they reflect what a product that genuinely saves hours per week is worth.

When in doubt, price higher and discount to close the first ten customers. You can always lower prices later. Raising prices on existing customers is much harder.

## The conversation to have before you finalize pricing

Before you publish a price, have this conversation with five customers who said they wanted your product:

*"If I told you the price was $X per month, what would happen? Would you buy it today, would you need to think about it, or would you pass?"*

Then: *"What would you need to see to make it an easy yes at $X?"*

The answers will tell you whether your price is in the right range, what the remaining objections are, and whether the value story needs more work. This conversation is worth more than any pricing framework.

## The freemium question

Should you have a free tier?

Free tiers make sense when: your product has a genuine network effect that makes more users more valuable, when free users convert to paid at a predictable rate you have measured, or when the free tier gives you data that improves the paid product.

Free tiers are expensive mistakes when: you have not measured conversion rates, when free users require meaningful support, or when "free" selects for users who were never going to pay.

At the earliest stage: do not build a free tier. Charge everyone. The feedback from customers who pay is different in quality from the feedback from customers who do not. You want paying customers first. You can add a free tier later when you understand your conversion economics.

## One thing to get right immediately

Put your pricing on your website, publicly.

Founders often hide pricing because they want to talk to every prospect before revealing the number. This is understandable but counterproductive. Buyers who cannot see pricing assume the product is expensive or evasive. Public pricing filters out the wrong leads before they waste your time, and qualifies the right ones before they get on a call with you.

If you have not figured out your pricing yet, say so on the site: "Early access pricing — contact us." That is better than nothing. But get to a published price as fast as you can.`
  },

  // ── 3. Getting your first 10 customers for an AI product ─────────────────
  {
    termSlug: 'ai-adoption',
    slug: 'first-ten-customers-ai-product',
    angle: 'field-note',
    title: 'Getting your first ten customers for an AI product',
    excerpt: 'Distribution is the hard part. The ten moves that actually work at the earliest stage — before you have brand, before you have case studies, before you have anything except the product.',
    readTime: 7,
    cluster: 'Business Strategy & ROI',
    body: `The founders who get their first ten customers fast have one thing in common: they do not wait for customers to find them.

This sounds obvious. In practice, almost every first-time founder spends the first month after shipping building a waitlist, sending cold emails into the void, and wondering why nobody is signing up. The problem is not the product. The problem is the distribution strategy, which at this stage is not a strategy — it is a hope.

Ten customers is not a lot. It is also not automatic. Here is what actually works, and in what order.

## Start with who you know

Your first customer is almost certainly someone you already know, or someone one degree away from you. This is not networking — it is the reality that trust is the primary barrier to a new product, and trust is easiest to transfer when there is already a relationship.

Make a list of every person you know who:
- Has the problem your product solves
- Trusts you enough to try something that is not polished yet
- Will tell you honestly when it does not work

This list is probably longer than you think. Work it before you do anything else. The goal is not a paying customer yet — it is a user who gives you real feedback. Payment comes after you have earned it.

**How to ask:** Be direct and specific. "I built something I think would save you time on X. I am looking for five people to try it for free for thirty days and tell me what's broken. Would you be one of them?"

Do not ask if they are interested. Ask if they will commit. Interested gets you a vague yes and no follow-through. Commit gets you a calendar invite.

## Go where your customers already are

After the personal network, the fastest path to early customers is a community they already belong to — not one you have to build.

Communities for most B2B personas already exist: Slack groups for CS professionals, subreddits for founders, LinkedIn communities for ops leaders, Discord servers for product managers. Your customers are already talking to each other about their problems. Your job is to find where they are and show up there with genuine value before asking for anything.

What genuine value looks like: answering questions, sharing something useful, making an observation that only someone who understands the problem well could make. Not posting about your product.

After you have contributed enough to be a recognizable name — which takes weeks, not days — you can mention what you built in context. Not as an ad. As "I built this because I was frustrated with the same thing you're describing." The distinction matters.

## Direct outbound, done specifically

Cold outreach works when it is specific enough to not feel cold.

The generic version does not work: "I see you work in CS. We built a tool that saves CS teams time." Delete.

The specific version does work: "I read your post in [community] about QBR prep. We built something that cuts the data-gathering part from four hours to forty minutes — would you be willing to try it for one QBR and tell me if that's actually true for you?"

The specific version works because it proves you know something about this person's actual situation, it makes a concrete and testable claim, and it asks for something small (one QBR, not a subscription).

At this stage, send twenty highly specific emails rather than two hundred generic ones. The response rate will be ten times higher and the feedback will be ten times more useful.

**Finding contacts:** LinkedIn, community member lists, conference speaker lists, Twitter/X bios, newsletter subscriber profiles when they are public. You are looking for the specific person at the specific company with the specific role — not "CS team at SaaS companies."

## Use the product to get customers

The fastest way to demonstrate that your product works is to use it in the process of getting customers.

If your product generates something — reports, analyses, summaries, copy — use it to create something of value for a prospective customer before they even sign up. Send them a sample output made from their public data. Show them what their QBR would look like if you prepped it. Generate a competitive analysis for their market using your tool and share it.

This does the work of a demo without requiring a meeting. It shows, not tells. And it creates a moment of "how did they do that?" which is the best conversation opener there is.

The category of marketing this falls into is sometimes called "show don't tell" or "productize the pitch." It works especially well for AI products because AI outputs are immediately tangible in a way that a product roadmap or feature list is not.

## The customer who refers you

Ten customers is actually a smaller number than it sounds, because you only need to find three or four of them yourself. The rest come from referrals.

The referral trigger: a customer who got real value and knows someone else who would get the same value. Referrals do not happen automatically — you have to ask. "Is there anyone else you work with who has the same headache around QBR prep? Would you be willing to introduce me?"

The timing of the ask matters. Do not ask before they have gotten value — they will not refer you to someone they respect. Ask after the specific moment when they saw something that impressed them.

Build the referral ask into your process, not as an afterthought. At the thirty-day mark, have a conversation with every early user. Ask what is working, what is not, and whether there is someone they would refer.

## Partnerships with people who already have your customer

If there is a tool, community, or service your target customer already uses and trusts, the person running that tool is potentially your best distribution channel.

What this looks like in practice: your customers use a specific CRM. You build a native integration with that CRM and reach out to the CRM's partnership team. Your customers read a specific newsletter. You pitch the newsletter author on a mention or a co-promotion. Your customers use a specific agency for a task adjacent to yours. You offer the agency a referral arrangement.

This is a slower path than direct outreach, but it scales in a way direct outreach does not. One good partnership can be worth a hundred cold emails over time.

At ten customers you are too early for formal partnerships. But you can start building the relationships that lead to them.

## What not to do

**Ads.** Not yet. Paid acquisition before you have validated the product-customer fit means you are paying to bring in customers who will churn, and using the churn as feedback when the problem might be acquisition targeting, not the product. Get to twenty customers organically first.

**Content marketing.** Also not yet — not as a primary channel. Content takes months to compound. You need customers faster than that. Write content once you have customers and know what they care about. Not before.

**Building features to compensate for lack of customers.** This is the trap. The product is not the blocker. Your next customer is probably one conversation away. Go have the conversation.

## The honest number

At the earliest stage — before you have brand, before you have case studies, before anyone has heard of you — getting from zero to ten customers takes somewhere between two weeks and three months. The variance is almost entirely about how systematically and personally you pursue it, not about the quality of the product.

The founders who move fastest do the thing that feels uncomfortable: they reach out directly, they follow up when they do not hear back, they ask for referrals explicitly, and they have the hard conversation with users who stopped engaging instead of waiting to see if they come back.

Ten customers is not scale. It is proof. And proof is what everything else — funding, partnerships, growth — runs on.`
  },

]

async function main() {
  console.log(`Seeding ${ARTICLES.length} articles (batch 17 — completing founder journey)…\n`)

  for (const art of ARTICLES) {
    const term = await getTermId(art.termSlug)
    if (!term) {
      console.error(`  ✗ Term not found: ${art.termSlug}`)
      continue
    }

    const { error } = await sb.from('articles').upsert({
      slug: art.slug,
      term_id: term.id,
      term_name: term.name,
      term_slug: art.termSlug,
      cluster: art.cluster,
      title: art.title,
      angle: art.angle,
      body: art.body.trim(),
      excerpt: art.excerpt,
      read_time: art.readTime,
      tier: 3,
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
