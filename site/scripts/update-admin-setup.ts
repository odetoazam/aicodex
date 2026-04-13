/**
 * Update claude-admin-setup article:
 * - Remove "Someone handed you this job" framing
 * - Clarify Projects are one approach, not the only one
 * - Add plugin-as-onboarding as alternative to Projects for individual context
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/update-admin-setup.ts
 */

import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const body = `Setting up Claude for a team means making two decisions: how to give people access, and how to give Claude context about your organisation. Access is straightforward. Context is where most admins spend their time — and where there is more than one valid approach.

## What "setting up Claude" actually means

**Access** is the easy part. Get everyone on the [Team plan](https://www.anthropic.com/claude/team), provision seats, people log in with their work email. The admin console handles billing and user management centrally.

**Context** is what makes Claude useful rather than just available. Without it, everyone starts every conversation from zero — explaining who they are, what they do, what they need. With context in place, Claude already knows your company, your tone, and the work.

There are two main ways to provide that context:

### Option A: Projects (shared context per team)
A [Project](/glossary/claude-projects) is a shared workspace with persistent instructions (a [system prompt](/glossary/system-prompt)), uploaded reference documents, and team access. Everyone in the Project starts from the same configured baseline.

Projects work well when a team has a shared task they all do the same way — CS responding to tickets, marketing writing in a consistent brand voice, ops following the same process documentation format.

### Option B: Personalised context per person
Instead of shared Projects, some teams set context individually — through an onboarding plugin (a short interview that teaches Claude about each person's role and work), through personal project instructions, or through individual system prompts.

This works well when people's work is varied, when you want to let individuals discover their own use cases, or when you are rolling out wide rather than deep.

You do not have to choose one or the other. Many teams start with individual personalisation and layer in shared Projects later when a specific team identifies a shared knowledge need.

## The four decisions to make before you configure anything

**1. Which teams or individuals do you start with?**
Look for where the work is high-volume, repetitive, and text-heavy: customer success, marketing, operations, HR. These teams typically see results fastest. Identify one enthusiastic person per team — the early adopter who will work out the rough edges and report back.

**2. Who is responsible for configuration quality?**
The admin sets up access and governance. Someone else needs to own the configuration for each team or use case — the person who knows the work and can judge what good output looks like. For shared Projects, this is the Project owner. For individual rollouts, managers should know what skills are being built and help surface the ones worth sharing.

**3. What context does Claude actually need?**
Before configuring anything, ask: what would a new hire on this team need to read before doing the work well? That is roughly what Claude needs too. For a CS team: the product FAQ, tone guide, escalation process. For marketing: brand voice guide, ICP description. For individual setup: role, typical tasks, preferred working style.

**4. What is the rollout sequence?**
Start small, even if your goal is wide. A handful of early adopters will find things you could not predict from planning. Their learnings — what prompts work, what the instructions should say, what to watch out for — are more valuable than any training doc. Then expand.

## If you are going with Projects: building one well

1. **Create the Project** in the Claude sidebar. Name it clearly: "Customer Success — Ticket Drafts" not "CS Team."

2. **Write the system prompt** with the team lead, not for them. A tight 300-word prompt beats a sprawling 2,000-word one:
   > You are a customer support assistant for [Company]. Your job is to help draft responses to customer tickets. Always acknowledge the customer's frustration before addressing the issue. Be concise and specific. If you are unsure about a product detail, say so rather than guessing. Tone: professional and warm.

3. **Upload 3–5 documents** Claude actually needs — not everything that might be useful. Product FAQ, tone guide, known issues list. Not the entire employee handbook.

4. **Test before sharing.** Run 10 representative tasks through it. Fix the instructions before the team sees it.

5. **Invite the team.** Run a 20-minute walkthrough showing two or three concrete prompts that work.

## What to monitor in the first month

- Are people using it? If not, the workflow is not clear enough — talk to users, not their manager.
- Are there consistent output quality problems? Fix the configuration, not the users.
- Is anyone using it in ways that produce risk? Customer-facing outputs and anything involving personal data should have a human review step built into the workflow.

## The thing that matters most

Whether you go with Projects, individual personalisation, or a mix — the leverage comes from specificity. A tight, focused setup for one team's actual work will always outperform a generic one that is supposed to work for everyone.

Start specific. Expand deliberately.
`

async function main() {
  const { error } = await sb
    .from('articles')
    .update({
      body,
      excerpt: 'The two ways to give Claude context about your organisation — shared Projects and individual personalisation — and how to decide which fits your rollout.',
      updated_at: new Date().toISOString(),
    })
    .eq('slug', 'claude-admin-setup')

  if (error) {
    console.error('✗ claude-admin-setup:', error.message)
  } else {
    console.log('✓ claude-admin-setup updated')
  }
}

main().catch(console.error)
