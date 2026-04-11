/**
 * Batch 16 — Solo founder / zero-person startup content
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-16.ts
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

  // ── 1. Solo founder operating system ─────────────────────────────────────
  {
    termSlug: 'ai-augmentation',
    slug: 'solo-founder-operating-system',
    angle: 'process',
    title: 'The solo founder\'s operating system with Claude',
    excerpt: 'When you\'re doing everything yourself, ad-hoc AI use isn\'t enough. Here\'s how to set Claude up as a structured operating system for a one-person company.',
    readTime: 8,
    cluster: 'Business Strategy & ROI',
    body: `Most founders use Claude the way they use search: reactively. Something comes up, they open a tab, type a question, get an answer, close it. That works fine for one-off tasks. It is the wrong model for running a company alone.

When you are the only person — handling sales, product, support, marketing, finance, legal, and strategy simultaneously — you need something more systematic. You need Claude configured as an operating system, not used as a search engine.

This is the difference between Claude helping you occasionally and Claude functioning as the second brain your business actually needs.

## The problem with reactive Claude use

The reactive pattern looks like this: you sit down to write a cold email, open Claude, write the email, close it. An hour later you need to think through a pricing decision, open Claude, think through it, close it. Next day, you need to prep for an investor call. Open Claude, prep, close it.

Every session starts from zero. Claude has no memory of your company, your positioning, your customers, your constraints. You are re-explaining context constantly. And because you never gave Claude the full picture of your business, its help is generic — useful, but not as sharp as it could be.

The fix is a [Claude Project](/glossary/claude-projects). One persistent workspace that knows everything about your company, always loaded and ready, with different conversation threads for different functions.

## Setting up your founder OS

**Step 1: Write your company context document**

Start a new Project and upload a single document — your "company brain." It should cover:

- What your company does and who it's for (one paragraph, brutally specific)
- Your current stage (pre-revenue, early customers, post-seed — be honest)
- Your target customer: not demographics, but the specific problem they have and what they've tried before
- Your pricing and business model
- Your top three constraints right now (time, capital, technical, distribution)
- What you're trying to accomplish in the next 90 days
- Anything Claude should know about your voice and tone for external communication

This document gets loaded into every conversation in the Project. You stop re-explaining context. Claude starts giving sharper, more specific answers because it actually knows what you're dealing with.

**Step 2: Create separate threads for separate functions**

Within your Project, create named conversation threads for different hats you wear. Not because Claude needs the separation — it doesn't — but because you do. Keeping your sales thinking separate from your product thinking prevents the mental noise from bleeding together.

Suggested threads:
- **Sales & outreach** — cold emails, follow-up sequences, objection handling, call prep
- **Product** — feature prioritization, user feedback synthesis, roadmap thinking
- **Customer support** — response drafts, FAQ building, escalation templates
- **Marketing** — positioning, copy, content drafts
- **Finance & ops** — projections, vendor decisions, contracts review
- **Strategy** — big-picture thinking, investor prep, pivots

You will not use all of these equally. That is fine. The point is that when you sit down to do sales work, you are in the sales context — not scrolling through a jumbled conversation where product thoughts and sales drafts are mixed together.

## The five hats and how to use Claude for each

**Founder as salesperson**

The hardest part of early sales is not the pitch — it is the first email. You need to say something specific enough to be credible, brief enough to be read, and valuable enough to warrant a response. Claude does this well when you give it specifics.

Prompt pattern: *"I'm reaching out to [specific role] at [specific company type]. They likely have [specific problem]. Our product does [specific thing]. Draft a cold email, 3 sentences max, that references the problem without being presumptuous. Don't pitch. Just open a door."*

The key is specificity. Generic prompts produce generic emails. If you tell Claude the exact job title, the likely pain point, and the constraint on word count, what comes back is usable.

**Founder as product manager**

Product decisions at the earliest stage are really prioritization decisions. You can build almost anything. You should build almost nothing, and almost nothing should come first. Claude is useful here as a structured thinking partner.

When you get feature requests or feedback, dump them into a conversation: *"Here are the last seven pieces of feedback I've gotten. What patterns do you see? What's the one thing these customers are actually asking for under the surface?"*

Claude will surface connections you missed because you were too close to the individual feedback items.

**Founder as customer support**

Early support is where you learn the most. It is also where you spend the most time on things that should not require your judgment. Set up a template library in your Project: your standard responses to the ten most common support situations, drafted by Claude, reviewed by you, ready to send with light editing.

Update the templates every month as your product changes. This is not cutting corners on support — it is getting out of the way of your own learning by removing the mechanical part.

**Founder as marketer**

The single most useful marketing prompt for a solo founder: *"Here is how I explain what we do. Here is what my best customer said about why they chose us. Rewrite my description from the customer's perspective — their words, not mine."*

You will learn something every time you run this. Customers care about different things than founders think they do.

**Founder as strategist**

This is the most underused mode. When you are stuck on a decision — should I pivot, should I raise now, should I go after this enterprise customer or focus on SMB — Claude is a structured sounding board.

The prompt that works: *"I'm facing this decision: [decision]. Here are the arguments for each option as I understand them: [arguments]. What am I not considering? What would change my answer? What question should I be asking that I'm not asking?"*

Claude is not going to make the decision for you. It is going to force you to think more completely before you make it yourself.

## The daily check-in

Build one habit: a morning check-in prompt in your strategy thread. Five minutes, every day.

*"Here's what I'm working on today: [three things]. Here's what I'm worried about: [one thing]. Given what you know about where we are, what's the highest-leverage thing I could do today? What should I not be spending time on?"*

You will get a response that sometimes agrees with you and sometimes challenges you. The challenge is the point. Running a company alone means there is no one to push back. This is your pushback.

## What Claude cannot replace

You need to be honest about this. Claude cannot replace:

**Judgment about people.** Hiring, partnerships, investor relationships — Claude can help you prepare and think through frameworks, but you are reading humans in real time. That is yours.

**Taste and conviction.** What you decide your product actually is, what it is not, what you are willing to sacrifice — these are founder decisions. Claude will help you think through the tradeoffs, but it will not tell you what to believe.

**Customer relationships.** Early customers are not just revenue. They are your product development team. That relationship requires you to be present in a way Claude cannot be on your behalf.

**The pivots that only come from being in the room.** The best startup pivots come from a founder who heard something specific in a customer conversation and knew it mattered. Claude can help you think through what you heard. It cannot be in the room.

Use Claude to clear everything else off your plate so that you can be fully present for the things only you can do.`
  },

  // ── 2. Validating your startup idea with Claude ───────────────────────────
  {
    termSlug: 'ai-use-case-discovery',
    slug: 'validating-startup-idea-with-claude',
    angle: 'field-note',
    title: 'How to validate your startup idea using Claude (without fooling yourself)',
    excerpt: 'Claude will cheerfully validate a terrible idea if you let it. Here is the discipline required to use it as a genuine stress-test instead of a mirror.',
    readTime: 7,
    cluster: 'Business Strategy & ROI',
    body: `There is a trap that kills a specific kind of early-stage founder: the founder who uses Claude to think through their startup idea and walks away more confident than they should be.

Claude is agreeable. If you describe your idea enthusiastically and ask "what do you think?", you will get a thoughtful, generous response that finds the merit in what you said. This is not a bug — it is how a good thinking partner operates. But for idea validation, you need something different. You need a structured adversary, not a supportive colleague.

This is a guide to using Claude as a genuine stress-test — the kind that tells you things you do not want to hear, before you spend a year building something nobody needs.

## The cheerleader problem

The cheerleader problem is not unique to Claude. It happens in founder communities, with friends, with early investors who are being polite. The difference is that Claude is so accessible and so good at reflecting your framing back at you that the false validation can feel especially convincing.

The fix is not to avoid Claude in the validation process. The fix is to change the prompts you use.

Bad prompt: *"I'm building a platform that helps independent consultants manage their client relationships. What are the strengths of this idea?"*

Better prompt: *"I'm building a platform that helps independent consultants manage their client relationships. Steelman the case against this idea. What would make it fail? What assumptions am I making that could be wrong? Who has tried this before and what happened?"*

The difference is not just in what you ask — it is in what you signal you are ready to hear. The second prompt tells Claude you want honest analysis. Give it permission to push back.

## The five questions that matter

Before you build anything, you should be able to answer these five questions confidently. Claude can help you find the cracks in your answers.

**Question 1: Who specifically has this problem?**

Not "small businesses" or "marketing teams." A specific person. Their job title, their company size, their day, the moment when this problem actually occurs.

Prompt: *"Here is who I think my customer is: [description]. Make this more specific. What is the exact trigger moment when they feel this problem? What have they already tried to solve it? Why haven't existing solutions worked for them?"*

If Claude cannot help you get specific, it is because you are not specific yet. Vagueness at this stage is a red flag.

**Question 2: Why hasn't this been built?**

Every obvious idea has been tried. If it has not worked, there is a reason — timing, distribution, wrong customer segment, unit economics, regulatory issue, technical barrier that just got resolved. Understanding why this is the right time is as important as understanding why this is the right idea.

Prompt: *"What companies have tried to build something like this before? Why might they have failed or not achieved scale? What has changed recently — technically, behaviorally, or in the market — that makes this moment different?"*

Claude will be honest about what it does not know. Push it on the specific companies it names. Find out what happened to them.

**Question 3: How do you get the first ten customers?**

Not the first thousand. The first ten. If you cannot describe a specific, personal path to ten customers — names, conversations, referrals, communities — your go-to-market is not a strategy, it is a hope.

Prompt: *"Here is my go-to-market plan: [plan]. What specifically is wrong with this? Where am I assuming distribution that I have not earned? What would the path to ten paying customers actually look like, step by step, this month?"*

**Question 4: What does the unit economics look like at scale?**

You do not need a spreadsheet. You need to understand: roughly what does it cost to acquire a customer, roughly what do they pay, roughly how long do they stay? If the numbers do not work at scale even in a best-case scenario, the idea needs to change before you build.

Prompt: *"Here is my rough unit economics thinking: [thinking]. What am I missing? What assumptions am I making that are optimistic? What does this look like if acquisition costs are three times what I think they will be?"*

**Question 5: What would have to be true for this to be a big company?**

This is the venture question, but it matters even if you are not raising. Understanding the ceiling of what you are building tells you how much to invest in it.

Prompt: *"For this company to reach meaningful scale, what would have to be true about market size, distribution, product moat, and timing? How many of those things are actually in my control?"*

## Simulating customer interviews

The best validation is talking to real customers. Claude cannot replace that — but it can help you prepare, and it can simulate what you might hear.

Set up a role-play prompt: *"You are a [specific job title] at a [specific company type]. You have [specific problem]. You are skeptical of new tools because the last three you tried did not stick. I am going to pitch you my product. Push back on anything that does not ring true. Ask the questions a real buyer would ask."*

Run this five times with different customer profiles. The objections Claude raises in character are often the same objections real customers will raise. You are not getting market research — you are getting prep.

Then, when you run real customer interviews, you will be sharper. You will know which objections to probe and which ones are surface-level noise.

## The competitive landscape

Claude's knowledge has a cutoff date, and the startup landscape moves fast. Do not rely on Claude alone for competitive research. But Claude is useful for two specific things:

**Framing the competitive categories.** *"What are the different ways someone might solve this problem today — including non-software solutions, workarounds, and just ignoring it?"* This gives you a map of the competitive space, not just a list of direct competitors.

**Finding the positioning gap.** *"Here is how the main alternatives position themselves. Where is the gap? What is the positioning claim that none of them are making, that would be both true and compelling?"*

## The go / no-go framework

After running Claude through these questions, you should have a clear read on four things:

1. **Problem specificity** — Do you know exactly who has this problem and when it hits them?
2. **Differentiated timing** — Do you understand why now, and why you?
3. **Credible first path** — Can you name the first ten customers and how you reach them?
4. **Reasonable economics** — Even roughly, do the numbers work?

If you can answer yes to all four with specifics, not just intuitions, you have something worth building toward. If any are shaky, you know what to fix before you write a line of code.

The goal is not to eliminate uncertainty — you cannot. The goal is to make sure the uncertainty you carry into building is about things you can learn by shipping, not things you should have found out before you started.`
  },

  // ── 3. Build, buy, or prompt: early-stage AI stack decision ──────────────
  {
    termSlug: 'build-vs-buy',
    slug: 'build-buy-prompt-early-stage',
    angle: 'process',
    title: 'Build, buy, or prompt: the early-stage AI stack decision',
    excerpt: 'Most founders overcomplicate this. For 90% of early-stage AI products, the right stack is simpler and cheaper than you think — and fine-tuning your own model is almost never the answer.',
    readTime: 6,
    cluster: 'Business Strategy & ROI',
    body: `There is a version of this conversation that founders have with themselves that sounds like: "Should we fine-tune our own model, or use an existing API?" And there is the version they should be having: "What problem are we actually solving, and what is the cheapest way to test whether we can solve it?"

Those are different conversations. The first one is about technology. The second one is about the business. At the earliest stage, almost every technical decision is really a business decision in disguise.

Here is the framework for making this decision clearly, without letting the interesting technical question crowd out the important business one.

## The three options

When founders say they are "building an AI product," they usually mean one of three things — and the distinction matters enormously for cost, speed, and what you can actually ship.

**Option 1: Claude.ai (or equivalent consumer product)**

You are using Claude through a web interface. No API, no code, no infrastructure. Your "product" is the workflow you design around the tool, not a piece of software.

This sounds like a toy. It is not. For a solo founder at the earliest stage — talking to customers, learning what the real problem is, figuring out if your insight is correct — this is the right setup. You can build and test an entire workflow, demonstrate value to customers, and iterate in days, not weeks.

The constraint: you cannot give this to customers directly. It is your tool, not their product.

**Option 2: Claude API (or equivalent)**

You are calling the API from code and building a product layer on top. Customers interact with something you built, not directly with Claude. You control the experience, the prompts, the data flow.

This is the right move when you have figured out what you are building and you are ready to give it to people. Not before. The overhead of building a real product — auth, data handling, error states, billing, the dozen things that are not the AI — is significant. Every week you spend building infrastructure is a week you are not learning from customers.

The signal that you are ready to go here: you have run the workflow manually enough times that you know exactly what good output looks like, and you know how to prompt for it reliably.

**Option 3: Fine-tuned or custom model**

You are training or fine-tuning a model on your data. This is expensive, slow, requires ML expertise, and for most early-stage products, it is solving a problem you do not yet have.

The case for doing this is real but narrow: you have a use case that requires performance that frontier models cannot deliver, you have enough proprietary data to train on, and you have validated with customers that the product is worth building. If all three of those are true, fine-tuning might make sense. If any one is missing — especially the third — you are building a technical solution to a business problem you have not solved yet.

## The cost reality

Let's be concrete about what the Claude API actually costs at early stage.

A typical customer interaction — a few hundred words in, a few hundred words out — costs roughly one to three cents at current API pricing. A power user doing fifty interactions a day is costing you a dollar or two per month. Your first hundred active users are costing you a couple hundred dollars a month in API costs.

This is not your biggest problem. Your biggest problem is that you do not have a hundred active users yet. By the time API costs become meaningful, you should have a business that can bear them.

The founders who spend significant time optimizing API costs at the early stage are optimizing the wrong thing. Optimize for learning speed instead.

## The real question: what are you actually building?

The build/buy/prompt decision is downstream of a more fundamental question: what is your product, really?

There are three honest answers:

**The product is the AI itself.** You are making the AI dramatically better at a specific domain — medical diagnosis, legal document review, code generation for a specific framework. The AI is the thing. This is where fine-tuning or custom models might eventually make sense, but even here, you should start with a prompt-engineered frontier model and see how far it gets you before going custom.

**The product is the workflow around the AI.** You are connecting AI to specific data sources, building the right interface, handling the edge cases, making it usable by people who would never go near a raw API. The AI is excellent already — you are making it accessible and reliable for a specific context. This is the Claude API path.

**The product is the insight, not the implementation.** You have a specific view on a market, a customer relationship, a distribution channel — and AI makes it possible to act on that insight at scale. The AI is a component, not the product. This is where many of the best early-stage AI companies actually are: the moat is the customer relationship or the data or the distribution, and the AI is what makes it economically viable.

Knowing which of these you are building changes your priorities completely. If you are building the first, you need ML expertise. If the second, you need product and engineering. If the third, you need customers and a distribution strategy.

## Decision framework

Answer these questions in order:

1. **Do you know what good output looks like?** If you cannot define what a successful output looks like, you are not ready to build anything. Spend more time with customers.

2. **Can you get there with a well-crafted [system prompt](/glossary/system-prompt)?** Try this first. Frontier models are remarkably capable with good prompting. Most teams discover they can get 80% of the way there without any code at all.

3. **Do you need to put this in customers' hands?** If yes, you need the API. If you are still testing whether the idea works, you do not.

4. **Is the performance gap real?** If frontier models with good prompting cannot deliver the quality you need, and you have validated that customers care enough to pay for the improvement, custom models become a real conversation. Not before.

The honest answer for most early-stage founders: start with Claude.ai, move to the API when you have ten customers who want the product, and do not think about custom models until you have a real business that depends on performance you cannot get from the API.

The fastest path to product-market fit is not the most technically sophisticated one. It is the one that lets you learn the fastest.`
  },

  // ── 4. AI product failure modes for founders ──────────────────────────────
  {
    termSlug: 'ai-adoption',
    slug: 'ai-product-failure-modes-founders',
    angle: 'failure',
    title: 'What goes wrong when founders build AI products',
    excerpt: 'The failure modes for AI startups are specific and predictable. Most of them have nothing to do with the AI.',
    readTime: 7,
    cluster: 'Business Strategy & ROI',
    body: `The pattern repeats often enough that it is worth naming: a founder builds an AI product that looks impressive in a demo, gets positive feedback early, raises a small round or gets accepted to a program — and then cannot grow past the initial cohort of early adopters.

The postmortem usually reveals that the AI was not the problem. The AI worked fine. What failed was everything around it.

Here are the specific failure modes that catch founders off guard when building AI products, and what to do about each one.

## The demo gap

The most dangerous moment in an AI startup's early life is a successful demo.

A demo works because you control the inputs. You have prepared the data, you know what to ask, you know what the output should look like. The AI delivers. The room is impressed. You leave feeling like you have built something.

Production is different. In production, users ask questions you did not anticipate. They upload documents in formats you did not test. They chain together prompts in ways that expose edge cases. They have expectations shaped by other products they use, not by your demo.

The gap between demo performance and production performance is the demo gap. Every AI product has it. The founders who survive it are the ones who find it early, on themselves and a small group of controlled users, before they have told the world it works.

The fix: before you tell anyone you are live, give five real users access with no assistance from you. Watch what they do. You will learn more in one hour of watching a confused user than in ten hours of testing it yourself.

## Hallucination in production

[Hallucination](/glossary/hallucination) — when the model generates confident-sounding information that is wrong — is well-known as a risk. What is less appreciated is where it actually shows up in product contexts and how catastrophically it can hit.

The high-risk scenarios:

**Factual claims in customer-facing outputs.** If your product generates anything that looks like a factual statement — summaries, reports, recommendations, research — and users act on those statements without verifying them, you are one confidently-wrong output away from a trust-destroying incident. This is especially acute in domains where errors have consequences: legal, medical, financial, anything with compliance implications.

**Long context degradation.** Models perform differently when given long inputs. Quality often degrades — not uniformly, but in specific and hard-to-predict ways. If your product involves long documents, long conversation histories, or many pieces of data fed simultaneously, you need to test quality across the full range of input lengths your users will actually produce.

**The confident wrong answer.** The most damaging hallucinations are not obviously wrong. They are plausible. They look right. Users do not check them. The damage accumulates before anyone notices.

Mitigation: build explicit uncertainty into your product where it matters. If the AI is not sure, it should say so. If a claim is derived from a specific source, cite it. If there is a class of question your product genuinely should not answer, route it somewhere else rather than generating a best-effort response that might be wrong.

## Building for the model you tested

Models change. Anthropic, OpenAI, and Google update their models regularly. Sometimes behavior changes meaningfully — outputs become more cautious, formatting shifts, instruction-following improves or degrades in specific ways.

If you built your product for a specific model version and that version is deprecated, you are rebuilding your [prompt](/glossary/prompt) infrastructure against a new model under time pressure. This is painful and avoidable.

Two things help:

**Version-pin your API calls** where the model provider allows it, and have a plan for when that version is retired.

**Build an eval suite** — even a basic one. A set of twenty to fifty representative inputs with known expected outputs. Run this every time you change your model or your prompts. You will catch regressions before your users do.

## The scope creep trap

Claude and other frontier models can do a remarkable number of things. This is their best feature and your biggest product risk.

The trap works like this: you build a focused product. A user asks the product to do something adjacent to its core purpose. Claude handles it reasonably well. You ship the adjacent feature. Another user asks for something else. You ship that too. Two months later, you have a product that does twelve things adequately instead of one thing exceptionally.

This is not a product problem — it is a prioritization failure driven by the model's capability. Claude's range makes it feel almost irresponsible not to use it. The discipline of saying "we don't do that" when the technology clearly could becomes counterintuitive.

The antidote is a clear product thesis stated in the negative: we are the best tool for X, and we specifically do not do Y and Z. Write it down. Point to it when scope creep appears.

## The "AI everywhere" mistake

A related failure: founders who were impressed by what Claude could do in general use apply it to every part of their product — even where it adds friction rather than value.

The example that comes up repeatedly: adding an AI chat interface to a product where users wanted a search box. Chat feels innovative. Search feels boring. But if your users know what they are looking for, making them express it as a natural-language conversation creates cognitive overhead. The "better" interface is worse for the job.

AI should go where it creates leverage — where a task is genuinely ambiguous, where outputs need to be generated rather than retrieved, where scale or personalization is the value. It should not go everywhere just because it can.

Before adding an AI component, ask: what is the user trying to accomplish at this moment, and is a generative AI the best tool for this specific moment? Sometimes the answer is yes. Sometimes a dropdown is better.

## Not defining what "good" looks like

This one is foundational and gets skipped constantly. If you cannot define what a good output looks like, you cannot systematically improve your product. You cannot catch regressions. You cannot hire someone to help you. You cannot measure whether a prompt change made things better or worse.

Good output definition does not require a formal [eval](/glossary/evals) system. It requires that you write down, for your specific product:

- Here is an example of an excellent output
- Here is an example of an acceptable output
- Here is an example of a failure
- Here is what distinguishes them

Do this for your five most common use cases. You will find that writing it down forces clarity you did not have when it lived only in your head.

## The retention cliff

AI products often see strong initial engagement followed by a sharp drop. The pattern: users try it because it is interesting, use it heavily for a week or two, and then stop. Usage falls off a cliff.

This is usually a sign that the product solved for the first interaction rather than the recurring need. The AI impressed the user. But the user did not have a habit-forming reason to come back.

The question to ask before you launch: what will bring a user back next Tuesday? If the answer is "they'll remember how good it was," you have a retention problem waiting to happen. If the answer is "they will have a specific task that only this product does well, and that task recurs regularly," you have a business.

## What actually works

The founders who navigate these failure modes share a few habits:

They are honest about what the AI gets wrong, and they build around the failure modes rather than hoping users won't notice. They define good output before they optimize for it. They treat the first ten users as a stress-test, not a validation. They resist the temptation to expand scope when the technology makes it easy. And they ask, at every step, whether the AI is creating real value for a specific person in a specific moment — not just doing something impressive.

The AI is not the hard part. The hard part is building a product that people need badly enough to change their behavior for.`
  },

]

async function main() {
  console.log(`Seeding ${ARTICLES.length} articles (batch 16 — solo founder content)…\n`)

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
