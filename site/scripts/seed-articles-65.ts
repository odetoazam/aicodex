/**
 * Batch 65 — Raj's long-outstanding influence article (April 19, 2026)
 *
 * 1. influencing-ai-adoption-without-authority
 *    Raj's #1 recommendation since Retro 1. The reader: a middle IC or junior person
 *    who uses Claude personally and wants their team or boss to get value — but doesn't
 *    have Priya's authority. The pre-Priya article. First site article with a full
 *    Diaz skill module (Scenario → Task → What good looks like → Common mistake).
 *
 *    Angle: role. Cluster: Change Management. PINNED_OPERATOR candidate (demote
 *    adoption-plateau if we re-curate).
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-65.ts
 */

import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const ARTICLES = [

  {
    slug: 'influencing-ai-adoption-without-authority',
    angle: 'role',
    title: 'Bringing Claude to your team when you\'re not the decision-maker',
    excerpt: 'You use Claude. You can see the value. But you don\'t run the team and you can\'t mandate anything. Here\'s the three levers you actually have and the moves that work.',
    readTime: 7,
    cluster: 'Change Management',
    body: `Most Claude rollouts inside companies aren't driven by a manager. They're driven by someone three rungs below who used Claude on their own, saw what it could do, and wanted their team to get the same lift.

That person is usually the least prepared for what comes next. You can't schedule a rollout. You can't approve a budget. You can't tell people to change their workflows. The change-management playbooks are all written for Priya — the manager who decides. This is for the person who decides *nothing* but wants to change *something*.

> **You have three levers, not one.** Demonstration (show the output, not the tool). Advocacy (make someone with authority the hero of your story). Proximity (be the person people ask when they're curious). Authority isn't on this list because you don't have it.

## The three levers

**Demonstration.** The shortest path from "nobody cares" to "everyone wants it" is a piece of output that would have taken someone on the team four hours and took you twenty minutes. Not a screenshot of Claude. The *output*. A draft, a brief, a one-pager, a code diff — something that exists in the medium your team already uses. Share it in the normal channel. Let people ask how.

**Advocacy.** You cannot make decisions. Someone can. That person needs a story where they come out looking smart, not where you come out looking smart. If your manager's boss says "I heard your team is moving fast on the customer research," the right next step is your manager getting credit — not you getting credit. Your job is to give them the story.

**Proximity.** The person who gets consulted in the hallway is the person who influences adoption. That means being visible, findable, and generous with time. "Can you show me how you did that?" is the question you want to get asked four times a week. Answering it fast and well — without requiring a meeting — is the work.

Authority isn't on this list because you don't have it. Trying to act with authority you don't have is the fastest way to shut down adoption: the one manager you threaten says no and the door closes.

## The moves that work

### 1. Ship one visible output per week

Not AI-generated content labeled "made with AI." Actual work product that's measurably better or faster because you used Claude. The team doesn't need to know how it was made — they need to notice it's different.

The rule: if you replaced Claude with a junior colleague doing the same task for four hours, would the output be comparable? If yes, the demonstration works. If no, you're showing off a prompt, not producing value.

### 2. Make your manager the hero

When something you built with Claude lands well, credit the manager when you can. "The customer deep-dive went great — [manager's name] pushed us to go deeper on the churn patterns, that unlocked everything." The manager repeats the story upward. Eventually the story includes AI. Eventually the authority you don't have is unnecessary because the manager has acquired it on your behalf.

This is not sycophancy. It's the reality of how credit flows in organizations. The person who benefited from your work needs the upward narrative to include them. Give them that narrative in exchange for the latitude to keep going.

### 3. The one-on-one pitch (not the team pitch)

Never pitch Claude to "the team." Pitch to one person at a time, in a conversation where they asked. Group pitches lose. They trigger "is this what we're doing now?" objections from the quietest person in the room, and the loudest objection defines the answer for everyone else.

One-on-one is different. Someone asks how you're faster on ticket triage. You show them. They try it. Now they're an adopter. Adopters compound — they become proximity nodes for other people in their part of the organization.

### 4. The document, not the evangelism

At some point — usually around the third or fourth person asking — you need a document. Not because people need training, but because the next manager who hears about it needs something to read. A shared doc called "How I use Claude for [specific workflow]" — three paragraphs, one example, one gotcha. Easy to forward.

When Priya gets forwarded this document by her boss, she doesn't need to know who you are. She needs to know what the workflow is and whether it fits her team. That document is your quiet manager-adoption tool.

### 5. When someone says no, stop pushing that person

You will hit people who are not going to adopt. Skeptical senior engineer, cautious ops director, someone who had a bad Copilot experience in 2023. Do not try to convert them. Their "no" in a meeting will set the tone for their team. Route around them. Influence flows in the organization in many directions — you don't need everyone, you need enough of the right ones.

## The failure modes

**The evangelist trap.** You start talking about Claude in every meeting. People start rolling their eyes. You become "the AI person," which sounds good but is actually a ceiling: you're typecast as the enthusiast, and no one takes enthusiast recommendations seriously. Fix: demonstrate, don't evangelize. Let other people bring it up first.

**The policy trap.** You get into a debate about what the team's AI policy should be. You have no authority to set policy. Trying to influence a policy conversation you can't own will make you look like you're overreaching. Fix: let IT, legal, or the manager lead that conversation. Provide input when asked, not before.

**The tooling trap.** You spend your energy picking the "right" AI tool for the team (Claude vs. ChatGPT vs. Copilot). Nobody cares which tool you picked. They care whether your output is better. Fix: use what works, stop arguing tools.

**The over-sharing trap.** You share everything you make with Claude. The team sees 40 documents a week. They stop reading. Fix: share the 2 that matter most, in the places they already look.

## Try this today

Pick one workflow you already do with Claude that your team does the manual way. Spend 30 minutes producing one piece of real output using that workflow — not a demo, not a template, actual work. Share it in the channel your team uses for that kind of work.

Do not caption it "made with AI." Do not explain your process unless someone asks. Wait 48 hours.

One of three things happens: nobody notices (the output wasn't differentiated enough — go back and make it sharper), one person asks how (start a one-on-one conversation), or a manager notices (now you have the demonstration story without having to tell it).

If nothing happens in two weeks after trying this three times, the thing blocking adoption probably isn't the manager. It's the demonstration quality. Adjust the output, not the pitch.

## Skill module — the hallway conversation

*A full practice rep for the most common adoption moment: someone asks how you did something with Claude. Run this with yourself, or with a friend role-playing.*

**Scenario**
You're at your desk. A coworker (not on your immediate team) walks up: "Hey — I saw your customer research doc. That was fast. How'd you put it together?"

They have maybe four minutes before their next meeting. They're curious but not committed. They want to know what to try, not learn a new tool.

**Your task**
In under 90 seconds, give them: (1) what you actually did, (2) one specific thing they could try with their own work, (3) a soft opener for a follow-up. No more. If they want more, they'll ask.

**What good looks like**
> "I pasted in the last ten customer interview transcripts and asked Claude to pull out the top three themes plus the quote that best represents each. It's the kind of thing I'd normally spend an afternoon on. You deal with survey responses — if you paste in a batch and ask for the three most common complaints with example quotes, you'll get something usable in five minutes. If you try it and want to compare notes, grab me later."

Notice: specific input, specific output, a workflow they already do, no "Claude is amazing" framing, a low-commitment followup ("if you try it").

**The common mistake**
Turning the 90 seconds into a Claude demo. "Let me show you — here's the interface, and you click here, and then you paste, and..." You're now 4 minutes in, they're late for their meeting, and the takeaway is "that looked complicated." You've converted a curious person into a skeptical one.

The fix is a one-sentence self-check before you start: *am I describing what I did, or demoing the tool?* Describe what you did. Let them go try it. That's the skill.

---

*For the manager-level business case, see [building-a-business-case-for-claude](/articles/building-a-business-case-for-claude). For what happens after your manager says yes, see [after-your-manager-approves-claude](/articles/after-your-manager-approves-claude).*

## Further reading

- [Claude common mistakes](/articles/claude-common-mistakes) — what the person you just influenced will hit first, so you can warn them
- [Claude operator habits](/articles/claude-operator-habits) — the habits worth demonstrating, not just explaining`,
  },

]

async function seed() {
  console.log('Seeding Batch 65 — Influence without authority (Raj\'s article)...\n')

  for (const a of ARTICLES) {
    const payload = {
      slug:      a.slug,
      angle:     a.angle,
      title:     a.title,
      excerpt:   a.excerpt,
      body:      a.body,
      read_time: a.readTime,
      cluster:   a.cluster,
      published: true,
    }

    const { error } = await sb.from('articles').upsert(payload, { onConflict: 'slug' })

    if (error) {
      console.error(`  ✗ ${a.slug}: ${error.message}`)
    } else {
      console.log(`  ✓ ${a.slug}`)
    }
  }

  console.log('\nDone.')
}

seed().catch(console.error)
