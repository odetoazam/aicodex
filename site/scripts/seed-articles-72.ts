/**
 * Batch 72 — Anthropic announcement: Claude for Creative Work (April 28, 2026)
 *
 * 1. claude-for-creative-work
 *    On April 28, 2026 Anthropic announced Claude for Creative Work — an
 *    initiative bundling 9 new creative-tool connectors (Ableton, Adobe for
 *    creativity, Affinity by Canva, Autodesk Fusion, Blender, Resolume Arena,
 *    Resolume Wire, SketchUp, Splice) along with educational partnerships and
 *    a positioning frame around using Claude with professional creative
 *    software. Distinct from claude-design (April 17), which is the visual
 *    output product. PRODUCTIVITY_SLUGS. Cluster: Features & Updates. Angle: update.
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-72.ts
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

const articles = [
  {
    slug: 'claude-for-creative-work',
    angle: 'update',
    title: 'Claude for Creative Work: connectors for Adobe, Blender, Ableton, and more',
    excerpt: "On April 28, 2026 Anthropic announced Claude for Creative Work — a set of nine connectors that let Claude work alongside professional creative software, plus partnerships with three art schools. Here's what shipped, what each connector enables, and what it changes for marketing, agency, and product teams that aren't full-time designers.",
    readTime: 7,
    cluster: 'Features & Updates',
    audience: ['operator'],
    termSlug: 'connector',
    body: `On April 28, 2026 Anthropic announced **Claude for Creative Work**. It is not a new product. It is an initiative that ships nine connectors for professional creative tools, three university partnerships, and a positioning frame for how Claude fits into design, music, video, and 3D pipelines.

This is a separate launch from [Claude Design](/articles/claude-design), the April 17 product that generates designs and prototypes from prompts. Claude Design produces visuals on its own. Claude for Creative Work connects Claude into the apps creative pros already use.

The launch quote captures the framing: *"Claude can't replace taste or imagination, but it can open up new ways of working — faster and more ambitious ideation, a more expansive skill set, and the ability for creatives to take on larger-scale projects."*

## The nine new connectors

A connector is an integration Claude can call mid-conversation. You enable it once, authenticate, and Claude can read or act in that tool when the conversation calls for it. Same plumbing as the [everyday connectors](/articles/claude-everyday-connectors) shipped April 23 — different category of tools.

The creative set:

- **Ableton** — music production. Claude can reference Ableton Live's documentation and help build, debug, and explain sessions, MIDI mappings, and devices.
- **Adobe for creativity** — covers 50+ tools across the Creative Cloud suite, including Photoshop, Premiere, After Effects, Illustrator, and Lightroom. Claude can read project state and assist with edits, scripts, and pipeline tasks.
- **Affinity by Canva** — production automation for the Affinity suite (Designer, Photo, Publisher).
- **Autodesk Fusion** — 3D modeling, parametric CAD, and CAM workflows.
- **Blender** — full 3D creation suite. Connector uses Blender's Python API, which means Claude can write and execute scripts that build geometry, drive animations, set up renders, and modify scenes programmatically.
- **Resolume Arena** — live VJ and visual performance.
- **Resolume Wire** — node-based effect and patch authoring for Arena.
- **SketchUp** — 3D modeling for architects, interior designers, and woodworkers.
- **Splice** — royalty-free sample library and creator marketplace.

The Blender integration is the deepest of the set. Anthropic also announced ongoing financial support of the Blender Foundation as part of the launch.

## Three patterns for using these

Anthropic groups the use cases into a few clear patterns. The framing is useful even if you only ever use one of these tools.

**1. Claude as a tutor.** Creative software is famously deep. Photoshop has menus inside menus; Blender has a 200-key shortcut sheet; Ableton's signal flow can take years to internalize. With a connector enabled, Claude can answer "how do I do X in this tool" with the tool's actual current state in scope, not generic tutorial text. *"How do I add a parametric chamfer to this edge in Fusion?"* gets an answer that references the part you're looking at.

**2. Claude as an extension.** Most professional creative software exposes a scripting surface — Blender's Python API, After Effects ExtendScript, Photoshop scripting, Fusion's API. With a connector, Claude can write and run scripts inside the tool. The classic example: "rename every layer in this PSD by removing the trailing date stamp" becomes a one-message ask instead of a 20-minute manual pass or a custom script you have to write and debug.

**3. Claude as a bridge.** Creative pipelines almost always span multiple apps — model in SketchUp, texture in Photoshop, render in Blender, edit in Premiere, score in Ableton. With multiple connectors enabled, Claude can move state and assets across tools in a single conversation. Take this asset from app A, transform it, hand it to app B.

The fourth pattern Anthropic emphasizes is **rapid exploration** — pairing these connectors with [Claude Design](/articles/claude-design) so Claude generates a first-pass visual, you iterate, then send the chosen direction into your real production tool through a connector.

## Educational partnerships

Three art schools are running Claude-integrated curriculum:

- Rhode Island School of Design — *Art and Computation*
- Ringling College of Art and Design — *Fundamentals of AI for Creatives*
- Goldsmiths, University of London — *MA/MFA Computational Arts*

These are not just access deals. The schools are co-developing curriculum with Anthropic. Worth watching for what kind of teaching materials come out of this — early signal for what AI literacy looks like inside design education.

## Availability

The announcement does not call out a research-preview or GA status the way [Claude Design](/articles/claude-design)'s launch did. Connectors typically ship as available to all plans where connectors are supported, including Pro. Check the connector directory in **Settings → Connectors** in the Claude apps to confirm what your account can enable.

If you're on **Team or Enterprise**, your admin controls which connectors appear. The creative connectors may be off by default — request the ones your team actually uses.

## What this changes for non-designer teams

AI Codex readers are mostly not full-time designers. A few honest takes:

**1. The Adobe connector is the one most office teams will use.** Marketing teams, agencies, product teams, and consultants all touch Photoshop, Illustrator, or Premiere occasionally. The Adobe connector turns *"resize this hero image for our six channel sizes"* or *"strip the background from these 30 product shots"* from a 90-minute task into a five-minute one. That's a real productivity gain even if no one on the team is a designer.

**2. The Blender connector matters if you make any 3D content.** Product teams shipping 3D assets in apps, marketers building 3D ads, anyone touching a 3D pipeline. The Python-API access means Claude can drive entire scene-building workflows, not just answer questions about them. This is the connector with the highest ceiling.

**3. The rest are professional tools.** Ableton, Resolume, Autodesk Fusion, SketchUp — these are tools you use because the work demands them, not casually. If your team uses them, the connectors are worth enabling. Otherwise skip.

**4. The connector pattern itself is the news.** This release is Anthropic putting connectors squarely into the *do work in another app* lane, not just the *read data from another app* lane. Expect more apps in this category — and the same pattern (read state, run scripts, bridge tools) to land for non-creative software over the next few quarters.

## What to read next

- [Claude Design](/articles/claude-design) — the visual-generation product (April 17, 2026)
- [Claude's everyday connectors](/articles/claude-everyday-connectors) — consumer connectors shipped April 23
- [Connectors best practices](/articles/connectors-best-practices) — how to think about connectors in general
- [How to write precise connector instructions](/articles/how-to-write-precise-connector-instructions) — getting consistent output once a connector is in scope

---

*Source: [Claude for Creative Work](https://www.anthropic.com/news/claude-for-creative-work), Anthropic newsroom, April 28, 2026.*`,
  },
]

async function seed() {
  console.log('Seeding Batch 72 — Claude for Creative Work...\n')

  for (const a of articles) {
    const term = await getTermId(a.termSlug)
    if (!term) {
      console.error(`  ✗ Term not found: ${a.termSlug}`)
      continue
    }

    const payload = {
      slug:      a.slug,
      angle:     a.angle,
      title:     a.title,
      excerpt:   a.excerpt,
      body:      a.body,
      read_time: a.readTime,
      cluster:   a.cluster,
      term_id:   term.id,
      term_name: term.name,
      term_slug: a.termSlug,
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
