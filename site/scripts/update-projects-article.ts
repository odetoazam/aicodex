/**
 * Update claude-projects-role article — persona-aware rewrite, adds Chat/Cowork/Code clarity,
 * team sharing requirements, large file reassurance.
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/update-projects-article.ts
 */

import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const body = `Most people use Claude the hard way.

Every conversation starts blank. Each person prompts differently. One person figures out the perfect way to get Claude to write a great brief — and that knowledge stays with them. Nobody else can reproduce it. The team has been "using AI" for months and has nothing to show for it beyond scattered individual wins.

[Claude Projects](/glossary/claude-projects) are the fix. A Project is a persistent workspace with its own instructions, uploaded files, and conversation history. Write your context once, and it's there for every conversation inside that project, for everyone on the team.

## Where Projects actually live

Projects exist in Chat and Cowork — not in Code.

When you're in the **Chat** tab, every conversation inside your project automatically loads your instructions and files. When you're in **Cowork**, it has its own local projects that work similarly but live on your desktop.

The **Code** tab doesn't use Projects. Code has direct access to your filesystem — your codebase is already the context. You don't need a knowledge base when Claude can just read the files directly.

Quick note on naming: Cowork Projects (desktop, local) and Claude.ai Projects (cloud, shareable) are related but different things. This article is about the Claude.ai version.

## Who actually uses this

**Marketing manager**: uploads brand guidelines, campaign briefs, past copy. Every new conversation knows the voice, the audience, the product positioning. No more "here's our brand, now write me..." preamble every single time.

**Customer success manager**: one project per major account. Client background, past QBR notes, renewal history, stakeholder names. When a new CSM takes over an account, they're not starting from scratch.

**Ops or HR manager**: employee handbook, policy docs, SOP templates — all uploaded once. A project for people questions, a project for vendor comms. Consistent outputs across the team.

**Developer**: mostly working in the Code tab, so Projects aren't the main tool. But useful for non-code work — architecture planning docs, writing technical specs, research.

**Executive**: one project per initiative. Strategy docs, research, board prep. Context that persists week over week instead of being rebuilt every Monday.

## One thing most people worry about

"What happens when I upload too many files?"

Nothing breaks. When a project's knowledge base grows large, Claude automatically switches to [RAG](/glossary/rag) mode — it retrieves only what's relevant to each question rather than loading everything at once. In practice, this means more files is fine. Upload the 80-page handbook. Upload the whole research archive. Claude figures out what to use.

## Sharing requires a Team or Enterprise plan

On a Free or Pro plan, Projects are yours alone. You can set them up and use them personally, but you can't invite teammates.

On Team or Enterprise, you can share a project with specific people or make it visible to your whole organisation. You set the permission level: view only, full edit access, or owner. This is where the real compounding happens — one well-configured project becomes a shared resource rather than a personal shortcut.

## The thing worth doing first

Don't build a general "work project". Build one for a specific use case: writing customer emails, running discovery calls, drafting performance reviews.

The narrower the scope, the easier it is to write instructions that actually work. Broaden it later if you need to. Start specific.
`

async function main() {
  const { error } = await sb
    .from('articles')
    .update({
      body,
      updated_at: new Date().toISOString(),
    })
    .eq('slug', 'claude-projects-role')

  if (error) {
    console.error('✗ claude-projects-role:', error.message)
  } else {
    console.log('✓ claude-projects-role updated')
  }
}

main().catch(console.error)
