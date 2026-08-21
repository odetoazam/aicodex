import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Patch = {
  slug: string
  marker: string // a unique phrase to check for idempotency (if present, skip)
  anchor: string // an exact substring in the body to replace
  replacement: string // the new content (includes the anchor)
}

const PATCHES: Patch[] = [

  // 1. claude-operator-habits — callout block under the intro, before Habit 1
  {
    slug: 'claude-operator-habits',
    marker: 'THE FIVE HABITS',
    anchor: 'Here are the five that make the biggest difference.',
    replacement: `Here are the five that make the biggest difference.

> **THE FIVE HABITS OF PEOPLE WHO ACTUALLY GET VALUE FROM CLAUDE:**
>
> 1. Give it **context**, not just tasks
> 2. **Iterate** quickly instead of prompting perfectly
> 3. Write one good **system prompt** and maintain it
> 4. Be specific about what you **don't** want
> 5. Use Claude to **improve your Claude usage**
>
> Most people struggle with 3 of these. The people who seem "naturally good at AI" are doing all 5.`,
  },

  // 2. claude-common-mistakes — callout block under the intro, before Mistake 1
  {
    slug: 'claude-common-mistakes',
    marker: 'THE TEN MISTAKES',
    anchor: 'Here are the mistakes that come up again and again, and exactly what to change.',
    replacement: `Here are the mistakes that come up again and again, and exactly what to change.

> **THE 10 MISTAKES THAT QUIETLY DESTROY CLAUDE OUTPUT QUALITY:**
>
> 1. Being **vague** about what you want
> 2. Starting a **new conversation** every time
> 3. Accepting the first response **without iterating**
> 4. Asking for **too many things** at once
> 5. Not giving Claude **permission to push back**
> 6. Using Claude for things it's **actually bad at**
> 7. Treating long documents as **too big to share**
> 8. Not using a **system prompt** for recurring tasks
> 9. Asking **closed questions** when open ones would work
> 10. Giving up after **one bad response**
>
> If you recognize more than four of these in your own workflow, you're not hitting Claude's ceiling — you're hitting your prompting ceiling.`,
  },

  // 3. running-your-first-ai-pilot — callout block under the intro, before Before Day 1
  {
    slug: 'running-your-first-ai-pilot',
    marker: 'THE 30-DAY AI PILOT',
    anchor: 'Here\'s a 30-day plan that produces a real answer.',
    replacement: `Here's a 30-day plan that produces a real answer.

> **THE 30-DAY AI PILOT, IN ONE VIEW:**
>
> - **Before Day 1** — agree on the specific question the pilot will answer
> - **Week 1** — build the smallest thing that works end-to-end
> - **Week 2** — fix the obvious failures, start measuring
> - **Week 3** — real users, supervised
> - **Week 4** — unsupervised, with monitoring
> - **Day 30** — the go / no-go / extend decision
>
> The pilots that fail are the ones that skip "define the question" and try to explore instead of decide.`,
  },

]

async function run() {
  for (const p of PATCHES) {
    const { data, error } = await sb.from('articles').select('slug, body').eq('slug', p.slug).single()
    if (error || !data) { console.log(`  ✗ ${p.slug}: fetch failed — ${error?.message}`); continue }
    if (data.body.includes(p.marker)) { console.log(`  - ${p.slug}: already has callout, skipping`); continue }
    if (!data.body.includes(p.anchor)) { console.log(`  ✗ ${p.slug}: anchor not found, skipping`); continue }
    const updated = data.body.replace(p.anchor, p.replacement)
    const { error: upErr } = await sb.from('articles').update({ body: updated }).eq('slug', p.slug)
    if (upErr) { console.log(`  ✗ ${p.slug}: update failed — ${upErr.message}`); continue }
    console.log(`  ✓ ${p.slug}: callout added`)
  }
}

run().then(() => process.exit(0))
