/**
 * Batch 29 — "Day in the life" role articles + Claude + Tool guides (Jira, Intercom)
 * cs-manager-ai-workflow, marketing-manager-claude-workflow, claude-plus-jira, claude-plus-intercom
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-29.ts
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

  // ── 1. Day in the life: CS Manager ────────────────────────────────────────
  {
    termSlug: 'ai-agent',
    slug: 'cs-manager-ai-workflow',
    angle: 'field-note',
    title: 'What using Claude actually looks like for a CS manager',
    excerpt: "Not a guide to features — a look at where Claude shows up in a real CS manager's day. The repetitive tasks it absorbs, the ones it doesn't, and how the workflow actually changes.",
    readTime: 8,
    cluster: 'Role Workflows',
    audience: ['operator'],
    body: `Most "AI for customer success" content describes what Claude can do in theory. This is what it looks like in practice, on a normal day, for a CS manager running a book of 40 mid-market accounts.

The honest answer is that Claude does not transform every part of the job. It absorbs specific categories of work entirely — and has no meaningful impact on others.

## Where Claude shows up first thing in the morning

The first thing most CS managers do each morning is check their inbox and flag what needs a response. Claude does not help you decide what matters — you still have to read and triage. But once you know what you need to write, drafting is where Claude earns its keep.

A customer sent a long complaint overnight. Three paragraphs of frustration, some valid, some rooted in a misunderstanding. Writing a response that is empathetic, accurate, and does not over-promise takes 20 to 30 minutes if you write it yourself. With Claude, it takes about 5.

The prompt: "A customer is frustrated about [specific situation]. They believe [their interpretation]. The actual situation is [what happened]. Write a response that: acknowledges their frustration specifically, corrects the misunderstanding without making them feel stupid, explains what we are doing about it, and sets clear next steps. Tone: direct and warm, not corporate."

The first draft is usually 80 to 90 percent there. You edit the pieces that are specific to your relationship with that account, and you send it.

## The QBR and renewal prep stack

Quarterly business reviews are the highest-stakes recurring output in most CS roles. The prep alone — pulling usage data, writing the narrative, building the deck — takes 3 to 4 hours per account if you are doing it from scratch.

Claude does not pull the data. You still need to go into your product analytics, your support history, your CRM. But once you have the raw material, the assembly is fast.

The workflow most CS managers use:
1. Export usage data and any relevant notes from your CRM into a text doc
2. Paste into Claude with: "I am preparing a QBR for [account]. Here is their usage data and our interaction history this quarter: [paste]. Write a QBR narrative that covers: what they have accomplished, where they are underutilizing the product, what we recommend for next quarter, and the business case for renewal. Tone: consultative, not salesy."
3. Review and add the account-specific context Claude cannot know — relationship dynamics, the thing you said at the last call, the stakeholder who is skeptical

The deck outline emerges from the narrative. Writing the talking points takes minutes rather than an hour.

For renewal prep specifically, Claude is useful for writing the case for expansion. You describe the account's situation, their current plan, and what they could accomplish with the next tier. Claude writes the commercial narrative. You validate it against what you actually know about the account.

## Escalation handling

When a customer is genuinely upset — not just frustrated, but at risk of churning — the response matters more than usual. CS managers often spend more time than they want trying to find exactly the right phrasing.

Claude is useful here specifically because you can iterate quickly. Write a draft, paste it back in and say "this feels too defensive in the second paragraph — make it warmer without backing down on the timeline," and get an improved version in seconds. The editing loop is faster than writing from scratch.

The one thing to watch: Claude defaults to a warmly professional tone that is sometimes too polished for accounts where you have a casual, candid relationship. If you have built that kind of rapport with a customer, you may want to paste in a previous email exchange and say "match the tone of these prior messages."

## Where Claude has almost no impact

**Discovery calls and relationship calls.** These are conversations. The preparation (agenda, talking points, background on the account) takes maybe 15 minutes to draft with Claude. But the call itself — reading the room, asking the right follow-up, knowing when to push and when to listen — is entirely human work. Claude does not change this.

**Complex escalations that require judgment.** When an account is considering churning because of a product failure that hit them hard, the right response involves knowing your company's actual ability to fix the problem, the relationship history, and what matters most to that specific buyer. Claude can help you phrase things, but the judgment about what to commit to and what not to promise is yours.

**Internal political situations.** When a customer is unhappy because of something that happened in an internal handoff — sales over-promised, implementation botched something — the CS manager is navigating internal relationships as much as external ones. Claude cannot help you figure out how to handle your VP of Sales.

## The compound effect over a quarter

The clearest way to see Claude's impact is to look at the time it absorbs over a quarter, not just on any given day.

Most CS managers who adopt Claude consistently report that the writing work — responses, follow-up emails, QBR narratives, renewal cases, internal summaries — compresses from something that takes 30 to 40 percent of their week to something closer to 15 to 20 percent. That reclaimed time goes to the relationship work that actually drives retention: more account check-ins, better executive engagement, earlier signals on accounts that are drifting.

The ROI for CS is not about dramatic transformation. It is about compressing the administrative overhead enough that you can do more of the work that is uniquely human — and that is actually where renewals are won or lost.

## The practical setup

If you are a CS manager just starting with Claude, the setup that gives you the most leverage fastest:

1. Create a Project in Claude.ai. Load it with: your product FAQ, your support escalation playbook, any style or tone guidelines your team uses for customer communication, and a paragraph describing your customer base (who they are, what they care about, their typical level of technical sophistication).

2. With that context loaded, Claude answers customer questions from your actual product docs rather than making things up. It writes in your communication style rather than its default corporate voice.

3. Start with QBR prep and draft responses for your most active accounts. The time savings will be obvious within a week.`,
  },

  // ── 2. Day in the life: Marketing Manager ────────────────────────────────
  {
    termSlug: 'ai-agent',
    slug: 'marketing-manager-claude-workflow',
    angle: 'field-note',
    title: 'What using Claude actually looks like for a marketing manager',
    excerpt: "Where Claude genuinely saves hours for marketing managers, where it falls flat, and what the actual workflow looks like.",
    readTime: 8,
    cluster: 'Role Workflows',
    audience: ['operator'],
    body: `Marketing managers have more AI hype aimed at them than almost any other role. Content generation, campaign ideation, social copy, SEO writing — the use cases sound compelling in demos and sometimes underwhelm in practice.

This is what Claude actually does in a typical marketing manager's week, with specifics.

## The content production shift

The biggest change for most marketing managers is not that Claude writes their content. It is that Claude compresses the distance between a rough idea and a usable first draft.

Before: you have a topic, maybe an outline in your head, and you need to sit down and write. The blank page problem is real, and so is the time cost of structuring something from scratch.

With Claude: you brain-dump. Literally. A paragraph of half-formed thoughts about what you want to communicate, who it is for, and what you want them to do after reading. Then: "Turn this into a structured blog outline with a headline and 5-6 sections." The outline is back in 20 seconds. You refine it, add or remove sections, then say "write section 2 in full." You edit what comes back. You repeat.

The total time for a 1,000-word post goes from 3 to 4 hours to about 45 minutes to an hour — but only if you stay in the editing mindset rather than treating Claude's draft as finished. The first drafts are almost always too generic unless you give very specific context. The more you tell Claude about your product, your audience's actual language, and what specific angle you want to take, the more useful the output.

## Research and competitive monitoring

This is where Claude punches above its weight for marketing managers who do not have a dedicated analyst.

The workflow: you want to understand a competitor's positioning, how a market is moving, or whether a message you are testing matches how your target customers describe their own problems. You could spend an afternoon reading through websites, G2 reviews, and LinkedIn posts. Or you can ask Claude with web search on.

A prompt that actually works: "Search for [competitor name] and summarize their current positioning, the problems they say they solve, and the language they use to describe their customer. Then tell me where their messaging focuses versus where ours does."

This is not a replacement for genuine competitive strategy — Claude will miss the nuance that comes from talking to prospects and win/loss conversations. But for a first-pass picture of the competitive landscape, it is faster than anything else.

## Campaign briefs and creative direction

Marketing managers who manage agencies or work with creative teams spend significant time writing briefs. A good brief — one that gets the creative back you actually wanted — takes a couple of hours to write well.

Claude helps by structuring the brief from your notes. You describe what the campaign is for, what you want people to do, what you know about the audience, and what you want to communicate. Claude turns it into a properly structured brief with objective, audience, key message, tone, deliverables, and success metrics.

The honest caveat: Claude does not know your brand deeply unless you tell it. Load your brand guidelines, past campaign examples, and tone of voice doc into a Project first. Without that context, the brief will be well-structured but generically branded.

## Email and lifecycle copy

This is probably the highest-ROI use case for most B2B marketing managers. Email copy for nurture sequences, product announcements, event invites, and follow-ups is high-volume, repetitive, and time-consuming to write well.

What works: give Claude a specific scenario. "A prospect signed up for our trial 7 days ago but has not completed the key action [describe the action]. Write a follow-up email that: acknowledges they signed up, explains the value of completing that action in concrete terms, and has a clear CTA. Tone: direct and human. 150 words max."

Give it that level of specificity and you will usually get something you can send with minimal editing. Give it vague direction ("write a follow-up email for cold prospects") and you will get bland, generic copy that needs significant rewriting.

## Where it falls flat

**Anything requiring your institutional knowledge.** Claude does not know what your customers actually said in the last 10 sales calls, what failed last quarter, or the specific positioning battle you are fighting with your main competitor. It will write plausible-sounding content about your market without any of that context unless you tell it. The output is as good as the context you provide.

**Genuinely original creative concepts.** Breakthrough campaign ideas come from understanding your market more deeply than your competitors, spotting a tension or insight nobody else has articulated, and taking a creative risk on it. Claude can generate options and variations on a direction you have already chosen. It is not good at finding the original insight.

**Anything visual.** Claude cannot design, produce, or meaningfully review visual creative. For campaigns where the creative itself is the differentiator, Claude's contribution is limited to the copy layer.

## What a typical week actually looks like

Monday: weekly planning email to stakeholders — drafted in Claude in 5 minutes from your notes.
Mid-week: blog post for a campaign — rough idea to publishable draft in 90 minutes.
Thursday: competitive brief for a sales enablement doc — 45 minutes instead of 3 hours.
Friday: email sequence for next month's nurture — 4 emails drafted, each edited for tone, done in an afternoon instead of two days.

The cumulative time savings in a week: roughly 5 to 8 hours for a marketing manager running a full content and campaign load. That reclaimed time goes to the work that actually moves the needle — customer conversations, strategy, relationships with sales and product.

## The setup that makes a difference

The single most impactful change most marketing managers make:

Load a Project in Claude.ai with:
- Your positioning doc or core messaging framework
- Your brand voice guidelines (or a few paragraphs describing your tone)
- 2 to 3 examples of content you have already published that you consider "on brand"
- One paragraph describing your primary customer — who they are, what they care about, the language they use

With that context loaded, everything Claude produces sounds less generic. The difference between Claude with no context and Claude with your brand loaded is significant — it is the difference between AI-smooth generic copy and something you might actually publish.`,
  },

  // ── 3. Claude + Jira ──────────────────────────────────────────────────────
  {
    termSlug: 'connector',
    slug: 'claude-plus-jira',
    angle: 'process',
    title: 'How to use Claude with Jira: a practical guide',
    excerpt: "Jira tracks your engineering work. Claude helps you write better issues, generate release notes, summarize sprint status for stakeholders, and turn customer language into engineer-readable tickets. Here's the practical guide.",
    readTime: 7,
    cluster: 'Tools & Ecosystem',
    audience: ['developer', 'operator'],
    body: `Jira is where engineering work lives — issues, sprints, backlogs, roadmaps. Claude is useful alongside it for the writing work that engineers find tedious and non-engineers find hard to do well: writing clear issues, generating changelogs, summarizing sprint status for people who do not live in Jira, and translating customer-reported problems into actionable tickets.

There is a native Jira connector inside Claude.ai (for Claude for Teams and Claude Enterprise users), which lets Claude query your Jira workspace directly. There is also the copy-paste + API approach for teams without the connector. Both are covered here.

## With the Jira connector (Claude for Teams / Enterprise)

If you have connected Jira to Claude, you can query your workspace directly in conversation.

Useful prompts:
- "What issues are currently blocked in the [project name] sprint?"
- "List all open bugs assigned to [engineer name] that are unresolved"
- "Summarize the status of epic [name or key] — what is done, in progress, and not started?"
- "What did we close in the last sprint in [project]?"

The connector is most valuable for sprint reviews, release preparation, and for project managers who need to pull status updates without bothering engineers.

**What it does not do well:** It cannot write back to Jira, create issues, or update status. It reads. For anything that changes data, you need to do that in Jira directly.

## Without the connector (copy-paste and API approach)

**Writing issue descriptions that engineers will actually use**

The most common Jira failure mode is issues that contain only a title. "Fix login bug." "Update onboarding flow." These create unnecessary back-and-forth and slow down sprint planning.

Claude can turn a rough description into a proper issue in under a minute.

How to do it:
- Write the issue in plain language: "Users are hitting a 500 error when they apply a promo code at checkout after adding items from different currencies. Seems to only affect EU accounts. Started happening after the last deploy."
- Prompt: "Write a Jira issue description from this. Include: Summary (1-2 sentences), Steps to reproduce (numbered), Expected vs actual behavior, Impact (who is affected and how many users approximately), Priority context. Technical and specific. No filler."

This is especially valuable when issues come from customer support tickets or Slack messages — written in customer language, not engineer language.

**Generating release notes from a sprint**

At the end of a sprint or before a release, someone has to write the release notes. This involves reading through every closed issue, deciding what is user-visible, grouping by type, and writing in plain English.

How to do it:
- In Jira, filter by completed issues in the sprint and export or copy the list (key + title)
- Paste into Claude: "These are the issues we closed in sprint [name]. Write release notes. Group by: Features, Bug Fixes, Performance improvements. Plain language — written for customers who are not engineers. Skip purely internal or infrastructure work. Flag any issues that might need a separate announcement."

**Writing sprint summaries for stakeholders**

Product managers, executives, and CS teams regularly need to know what engineering shipped — but Jira is noise to anyone who does not live in it.

How to do it:
- Copy the sprint board (list view is cleanest) — done column and in-progress column
- Prompt: "This is our current sprint status. Write a 5-bullet summary for our Monday product sync. What shipped, what is still in progress, what is blocked and why. Written for a non-technical audience."

**Turning customer-reported bugs into Jira issues**

If you receive bug reports through support, Intercom, or email, someone has to translate customer language ("the thing I clicked didn't work") into an engineer-readable issue. This is a frequent bottleneck at companies where support and engineering use different tools.

How to do it:
- Copy the customer's raw report
- Prompt: "This is a customer-reported bug. Write a Jira issue. Extract: (1) what the user was trying to do, (2) what happened, (3) what they expected to happen, (4) any details about their environment or account type if mentioned. Fill in missing information with '[unknown — needs investigation]'. Technical and concise."

## What does not work well

**Claude cannot update Jira.** Whether you use the connector or copy-paste, Claude only reads and writes text — it does not create issues, change status, or update fields. All Jira operations still happen in Jira.

**Acceptance criteria still need engineering review.** Claude generates reasonable acceptance criteria from a feature description, but it will miss edge cases specific to your architecture, data model, or existing behavior. Treat it as a starting draft.

**Sprint velocity and capacity planning.** Claude can summarize what is in a sprint, but it does not understand your team's historical velocity, individual engineer capacity, or the hidden complexity in specific tickets. Do not use it to plan sprint capacity.

## The automation worth building

If your team has a developer: a webhook on new Jira issues created in a specific project that sends the title and description to Claude with a "write a fuller description and add acceptance criteria" prompt, then patches the issue via the Jira API. High value for teams where issues are created by people outside engineering.`,
  },

  // ── 4. Claude + Intercom ──────────────────────────────────────────────────
  {
    termSlug: 'connector',
    slug: 'claude-plus-intercom',
    angle: 'process',
    title: 'How to use Claude with Intercom: a practical guide',
    excerpt: "Intercom handles your customer conversations. Claude helps write better responses, triage incoming volume, build knowledge base content from resolved tickets, and reduce time-to-response without burning out your support team. Here's how.",
    readTime: 7,
    cluster: 'Tools & Ecosystem',
    audience: ['operator'],
    body: `Intercom is where most growth-stage SaaS companies handle customer support, onboarding conversations, and proactive messaging. Claude is useful at several points in the support workflow — particularly anywhere that involves writing, classification, or turning raw conversation data into structured content.

There is no native Claude connector inside Intercom (Intercom has its own AI features, Fin, built in). So the approaches here are either copy-paste workflows or Zapier/Make automations that move data between the two tools.

## Writing better responses faster

The most immediate use case: you are in the middle of a support queue and need to write a clear, accurate, empathetic response to a customer who is frustrated or confused.

The workflow:
- Read the customer's message and understand what they need
- Paste the key context into Claude: what the customer is asking, what the actual answer is (or what you know about their situation), and any tone constraints
- Prompt: "A customer sent this message: [paste]. The actual situation is: [what you know]. Write a response that: answers their question directly, acknowledges their frustration if appropriate, and sets clear next steps. Tone: warm and direct. No corporate language."
- Edit the response for any account-specific details and send from Intercom

This is fastest when you are writing from knowledge — you know the answer, you just need to write it well quickly. It is less useful when you are still investigating the issue, because Claude cannot investigate for you.

## Summarizing long conversations

Intercom conversations sometimes run for days or weeks, with multiple agents handling them at different points. When you pick up a conversation mid-stream, getting up to speed can take 5 to 10 minutes of reading.

How to do it:
- Copy the full conversation thread (Ctrl+A in the conversation, or export via Intercom's conversation export)
- Paste into Claude: "Summarize this customer support conversation. Include: what the customer originally needed, what has been tried so far, what is still unresolved, and what the next step should be. 5 bullets max."
- Use the summary to get current, then respond

This is especially useful for team handoffs and for managers reviewing escalations.

## Building and improving your knowledge base

One of the highest-leverage things you can do with Intercom data is turn frequently asked questions into knowledge base articles. Most teams know they should do this but find the writing work too slow.

How to do it:
- Look at your Intercom conversations over the last 30 to 60 days and identify the questions that came up 3 or more times
- Copy 2 to 3 versions of the same question asked by different customers
- Prompt: "Customers keep asking about [topic]. Here are three examples of how they ask it: [paste]. Write a help center article that answers this question. Format: short direct answer first, then explanation, then step-by-step instructions if applicable, then related questions. Plain language — written for non-technical users."
- Publish to your Intercom knowledge base or help center

This converts existing support conversations into content that prevents future support volume. It also gives Intercom's AI features (Fin) better source material to answer from.

## Classifying and routing incoming conversations

If your Intercom inbox receives high volume from different customer types — technical questions, billing issues, bug reports, general feedback — you may spend time manually triaging and routing before the actual support work starts.

How to do it with Zapier:
- Trigger: new conversation opened in Intercom
- Action: send the conversation opener to Claude with: "Classify this support message into one of: [billing, technical-bug, how-to question, feature request, general feedback]. Return only the category name."
- Action: use Zapier to apply the corresponding Intercom tag based on Claude's response

This is not perfect — Claude misclassifies ambiguous messages — but it handles 70 to 80 percent of straightforward volume correctly and reduces the time humans spend on routing.

## Writing proactive outreach messages

Intercom is also used for proactive messaging — reaching out to users who hit a milestone, started a trial, or have not returned in a while. Writing these messages at scale is tedious.

How to do it:
- Define the trigger: user has been on the free plan for 14 days and has not used [key feature]
- Prompt: "Write a short in-app message for a user who has been on our free trial for 14 days but has not [done the key action]. We want to encourage them to try it. Max 3 sentences. Tone: helpful and direct, not pushy. No 'just checking in' phrasing."
- Use the result in Intercom's message composer

For onboarding sequences specifically, write each message for the specific moment — what the user has done, what they have not done, and what one thing would move them forward. Claude writes better messages when you give it behavioral context, not just "write a nurture email."

## What does not work well

**Claude cannot send messages through Intercom.** All Claude-written content needs to be copied into Intercom manually or via automation. There is no live integration that writes back to Intercom.

**High-sensitivity customer situations need human judgment.** When a customer is threatening churn, reporting legal issues, or is genuinely distressed, the response needs human judgment about what to commit to and what not to. Claude can help you write the response once you know what you want to say, but the judgment call is yours.

**Intercom Fin already handles common questions if you have a good knowledge base.** If you have invested in your Intercom knowledge base, Fin (Intercom's built-in AI) covers most of the easy, common-answer questions. Claude's value in Intercom is highest for complex responses, knowledge base authoring, and conversation summarization — not for the routine Q&A that Fin can handle.

## The setup that gives you the most leverage

For support teams without a developer: start with conversation summarization for handoffs and use Claude for drafting responses to complex or frustrated customers. Both of these are high-value, low-setup.

For teams with a developer: the Zapier classification + tagging flow is worth building once volume justifies it. More impactful long-term: a scheduled job that pulls Intercom conversations tagged as "common question" once a week and drafts knowledge base articles from them, which a human then reviews and publishes.`,
  },

]

async function main() {
  console.log('Seeding batch 29 articles...\n')

  for (const article of ARTICLES) {
    const term = await getTermId(article.termSlug)
    if (!term) {
      console.error(`  ✗ Term not found: ${article.termSlug}`)
      continue
    }

    const payload = {
      slug:      article.slug,
      title:     article.title,
      excerpt:   article.excerpt,
      body:      article.body,
      read_time: article.readTime,
      cluster:   article.cluster,
      angle:     article.angle,
      term_id:   term.id,
      term_name: term.name,
      term_slug: article.termSlug,
      published: true,
    }

    const { error } = await sb
      .from('articles')
      .upsert(payload, { onConflict: 'slug' })

    if (error) {
      console.error(`  ✗ ${article.slug}: ${error.message}`)
    } else {
      console.log(`  ✓ ${article.slug}`)
    }
  }

  console.log('\nDone.')
}

main()
