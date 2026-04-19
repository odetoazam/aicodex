/**
 * Adds the Diaz skill module to building-a-business-case-for-claude.
 * Retro 1 rule #10: one full skill module per session.
 * Most-deferred binding item — first shipped on influencing-ai-adoption-without-authority,
 * now retrofitting to the business case article.
 */

import { createClient } from '@supabase/supabase-js'

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

const SKILL_MODULE = `
## Skill module: writing the Friday proposal

**The scenario:** Your manager just replied to your five-minute check-in with: "That sounds worth exploring — put something together for me by Friday." You have three days, a real business problem in mind, and a manager who's cautiously open but not yet invested.

**Your task:** Write the one-page proposal from this article for your actual situation. Not a hypothetical — your real team, your real problem, your real manager. Fill in every section of the format above with specifics. At least one number must appear in the Problem section (a current metric, a headcount, a dollar figure, a time estimate). If you can't name a number, the problem isn't concrete enough yet — that's the work.

**What good looks like:**

> **Problem:** Our CS team is resolving tickets at an average of 11 hours — up from 6 hours last quarter — with the same headcount and 30% more volume.
>
> **Root cause:** Most resolution time is spent on research and drafting: finding the right policy, writing the customer-facing response, and locating account history across three systems.
>
> **Proposed solution:** Roll out Claude to the 8-person CS team with a shared Project containing our policies and standard response templates.
>
> **What this involves:** IT review (2 hours, handled by me), a 30-minute team onboarding session, a one-page usage policy, and a 90-day check-in.
>
> **Expected outcome:** Reduce average resolution time from 11 hours to 7 hours within 60 days.
>
> **Cost:** $240/month for 8 seats on the Team plan. Less than one hour of saved time per week per person pays for itself.
>
> **What I need from you:** Budget approval and a 15-minute intro to IT so I can get their sign-off in parallel.

**The common mistake:** Starting with the solution. The most common first draft opens with "I want to propose rolling out Claude to our team" — and immediately tells the manager they're being asked to approve a technology decision, not fix a business problem. The first sentence of any proposal that works describes something your manager already knows is true and already wants to change. Start there.`

async function run() {
  const { data: article, error: fetchErr } = await sb
    .from('articles')
    .select('body')
    .eq('slug', 'building-a-business-case-for-claude')
    .single()

  if (fetchErr || !article) {
    console.error('Could not fetch article:', fetchErr)
    process.exit(1)
  }

  // Insert the skill module before "The conversation before the proposal" section
  const INSERTION_MARKER = '\n## The conversation before the proposal'
  const idx = article.body.indexOf(INSERTION_MARKER)

  if (idx === -1) {
    console.error('Could not find insertion marker. Body may have changed.')
    process.exit(1)
  }

  const updatedBody = article.body.slice(0, idx) + SKILL_MODULE + '\n' + article.body.slice(idx)

  const { error: updateErr } = await sb
    .from('articles')
    .update({ body: updatedBody })
    .eq('slug', 'building-a-business-case-for-claude')

  if (updateErr) {
    console.error('Update failed:', updateErr)
    process.exit(1)
  }

  console.log('✓ Skill module added to building-a-business-case-for-claude')
  console.log(`  Inserted before "The conversation before the proposal" (~${idx} chars in)`)
}

run().then(() => process.exit(0))
