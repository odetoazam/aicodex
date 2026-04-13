/**
 * Update claude-admin-zero-to-one article:
 * - Add plugin-as-onboarding rollout model (wide-first)
 * - Add skill assignment approach
 * - Add "do you need Projects?" section
 * - Soften "do less, better" to account for both rollout models
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/update-admin-zero-to-one.ts
 */

import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const body = `Setting up Claude for a company is not a one-size-fits-all job. The right approach depends on your team's culture, how much appetite there is for experimentation, and what the admin's role actually is. Here is what the first two weeks look like — and two different paths depending on how you want to run it.

## Two rollout models

Most guides assume you should go slowly and methodically — configure one thing, get it right, move on. That works. But it is not the only way, and it is not even the best way for every team.

**Model A: Sequential (careful and controlled)**
Configure Projects one team at a time. Write system prompts before anyone starts. Roll out to 1–2 early adopters, fix what breaks, then expand. This is the right model when your team is skeptical, when stakes are high (legal, finance, compliance), or when you genuinely do not know yet what they need Claude for.

**Model B: Wide (fast and distributed)**
Set up the account and shared infrastructure, then push ownership to individuals early. Let people figure out where they create value — because they know their own work better than you do. This is the right model when your team is eager, when you have manager buy-in across departments, and when you trust people to experiment without breaking things.

Neither is wrong. The mistake is applying the sequential model when your team is ready to move fast, or applying the wide model when your team needs more structure.

## The plugin-as-onboarding approach

If you go wide, one of the most effective first moves is building an onboarding plugin — a short multiple-choice interview that each person goes through when they first start using Claude at work.

The plugin asks them about their role, what they spend most of their time on, what kind of writing or analysis they do, and what they want Claude to help with. Claude learns about each person automatically, without you having to configure individual accounts. One setup, personalised context for everyone.

This solves the biggest wide-rollout risk: Claude being useful to someone in marketing is different from Claude being useful to someone in CS. An onboarding plugin bridges that gap at scale.

After the interview, a useful next move is giving everyone a small assignment: build one skill that would actually help your work. It does not need to be perfect. The goal is getting people to find their own point of value, not to get everything right the first time. People who build something — even something rough — understand what Claude can do for them far better than people who just read about it.

## Week one: understand before you configure (both models)

Whether you go sequential or wide, the first week is still about understanding the work before you configure anything.

The biggest mistake new admins make is building Projects and writing system prompts before they know what each team actually does. Spend week one asking real questions:

- "What do you do most that is repetitive and takes longer than it should?"
- "What kind of writing do you produce in a typical week?"
- "What information do you spend time looking up or gathering?"
- "What have you already tried with AI, and what happened?"

That last question matters most. Most teams have already experimented informally — some people are on personal accounts, others tried it and stopped. Understanding what they tried and why it worked or didn't is the fastest path to knowing what setup will actually help.

## The four things to figure out in week one

**1. Which teams have the clearest use cases?**
Look for high-volume, repetitive, text-heavy work: customer success, marketing, operations, HR. These are where Claude delivers fastest. Engineering is valuable but complex. Sales is high-value but needs more setup. Start where the clarity is.

**2. Who will own each team's configuration?**
You cannot write every team's [system prompt](/glossary/system-prompt) — you do not know their work well enough. Identify one person per team who understands the work and cares about quality. In the sequential model, that person becomes the Project owner. In the wide model, department managers need to know what skills are being built and by whom — not to approve everything, but to help advise and spot where something good should be shared with the rest of the team.

**3. What plan do you actually need?**
If you are deploying to 5+ people, you need the [Team plan](/glossary/claude-plans) — not individual Pro accounts. The admin console alone is worth it. See the full plan comparison in [Which Claude plan is right for your organisation?](/articles/choosing-your-claude-plan)

**4. What is off-limits?**
Before anyone sends a customer email drafted by Claude, decide: what outputs require human review? For most organisations, customer-facing content, anything involving personal data, and legal or financial commitments should have a human in the loop. Write this down. Tell the team before they start, not after someone sends something they should not have.

## Week two: build the shared infrastructure

Once you know what you are building toward, set up the shared foundation:

- [Connectors](/glossary/connector) that most people will need (Google Drive, Slack, your ticketing system)
- The onboarding plugin if you are going wide
- [Projects](/glossary/claude-projects) if teams need shared context (see below)
- A skills-sharing process — once people build useful skills, how do others find them?

If you are going wide, week two is also when the skill assignments start coming back. When someone builds something genuinely useful, your job is to surface it for the rest of the team, not to evaluate whether it is perfect.

## Do you actually need Projects?

[Projects](/glossary/claude-projects) are shared context spaces — a system prompt, a set of uploaded documents, and a set of enabled tools — that every team member works from. They are most valuable when a team needs consistent, shared grounding: the same product FAQ, the same tone guide, the same escalation process.

Classic cases where Projects make sense:
- CS team where everyone needs to query the same product knowledge base
- Marketing team where everyone needs to write in the same brand voice
- Ops team where everyone references the same SOPs

**If your rollout is individual-first** — where each person is personalised through an onboarding plugin and building their own skills — Projects may not add much initially. You would be layering shared context on top of people who already have personalised context, and the overhead rarely pays off at first.

Projects become useful later, when a specific team identifies a shared knowledge need: "we all keep asking Claude the same questions about our product, and we keep getting different answers." That is when you create a Project for that team, load in the reference docs, and give everyone the same starting point.

The short answer: start without Projects if you are running an individual-first rollout. Add them when a specific team has a shared-context problem worth solving.

## What good looks like at 30 days

At one month in, you should have:
- Real usage across multiple teams, not just early adopters
- At least one team that has noticeably changed how they work
- A process for surfacing skills worth sharing across the org
- A list of what is working, what is not, and what to fix next

What matters less than you think: whether every Project is perfectly configured, whether everyone is using Claude the "right" way, whether you have a usage policy that covers every edge case.

The teams that get the most out of Claude are not the ones with the most technically sophisticated setup. They are the ones where someone took the time to understand the work — and then gave people the space to figure out where they create value.

That someone is you.
`

async function main() {
  const { error } = await sb
    .from('articles')
    .update({
      body,
      updated_at: new Date().toISOString(),
    })
    .eq('slug', 'claude-admin-zero-to-one')

  if (error) {
    console.error('✗ claude-admin-zero-to-one:', error.message)
  } else {
    console.log('✓ claude-admin-zero-to-one updated')
  }
}

main().catch(console.error)
