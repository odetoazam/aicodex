/**
 * Batch 48 — Claude Code vs. web app decision guide
 * 1. claude-code-vs-web-app — Lena's open question: "when should I use Claude
 *    in the terminal (Claude Code) vs. in the web app?"
 *    Broadly useful for non-developers and semi-technical founders.
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-48.ts
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
  {
    termSlug: 'claude-code',
    slug: 'claude-code-vs-web-app',
    angle: 'process',
    title: 'Claude Code vs. the web app: which one should you use?',
    excerpt: "They are different tools for different jobs. The web app is for thinking, writing, and analysis. Claude Code is for working inside your codebase. Here is the decision guide — including when neither is the right answer.",
    readTime: 5,
    cluster: 'Claude Code',
    body: `Anthropic ships two products that both involve talking to Claude, and they are not interchangeable. Picking the wrong one does not break anything, but it makes the work slower and the experience worse.

Here is the breakdown.

## Claude web app (claude.ai)

**What it is:** A browser-based interface. You type, Claude responds. You can upload files, use Projects to maintain persistent context, and access tools depending on your plan.

**What it is for:**
- Writing and editing — emails, documents, reports, first drafts
- Research and synthesis — summarising sources, answering questions, working through ideas
- Analysis — reviewing a document, spreadsheet, or data file you upload
- Planning — thinking through decisions, drafting plans, reviewing your thinking
- Any task where you want to interact conversationally and the output is text you will use somewhere else

**Who should default to it:** Everyone. If you are not a developer, the web app is where you should spend most of your Claude time.

**The important limitation:** The web app does not have access to your local files, your codebase, or your terminal. You can upload individual files, but you cannot tell Claude "look at my project folder" and have it read everything. Each thing you share needs to be explicitly pasted or uploaded.

## Claude Code (the CLI tool)

**What it is:** A command-line tool you install and run in your terminal. It has direct access to your file system — it can read, write, and edit files in your project. It can run commands. It understands your codebase as a whole, not just the snippet you paste in.

**What it is for:**
- Writing code and features — making changes across multiple files in one go
- Debugging — reading error messages and the relevant code together and fixing both
- Refactoring — renaming things, restructuring files, updating patterns across a codebase
- Running tasks — "run the tests, fix what fails, show me what changed"
- Understanding a codebase — "explain how the auth system works" with access to the actual files

**Who should use it:** Developers, and non-developers who are spending significant time writing code. If you open a code editor regularly and work with files directly, Claude Code is worth setting up.

**The important limitation:** You need to be comfortable with the command line to use it well. If you have never run a terminal command before, the web app with copy-pasted code is probably a better starting point.

## The question that helps you decide

The clearest signal: **are you working with files that live on your computer, or are you generating content that will go somewhere else?**

Working with files on your computer → Claude Code.
Generating content that you will use somewhere else → web app.

Examples:
- "Edit my README.md to add installation instructions" → Claude Code (the file is on your computer)
- "Write installation instructions for my product" → web app (you will paste the result somewhere)
- "Find the bug in my auth.py file" → Claude Code (it can read the whole file and surrounding context automatically)
- "Here is my auth code [paste] — what is wrong with it?" → web app (works fine, just requires more manual copying)
- "Run my test suite and fix the failing tests" → Claude Code (it can execute commands and iterate)
- "Explain what a test suite is" → web app

## The semi-technical founder situation

If you can code but it's not your primary mode — you're a founder who writes Python to automate things, or you're building a product side-project in React — Claude Code is worth setting up even if you don't use it every day.

The reason: Claude Code's value compounds. It learns the structure of your codebase over time (via CLAUDE.md) and can make changes across files without you explaining the context every time. A task that requires copying four files into the web app and explaining how they connect becomes a single instruction in Claude Code.

The setup cost is about 20 minutes. The [Claude Code setup guide](/articles/claude-code-project-setup) walks through installation and the CLAUDE.md configuration that makes it actually useful.

## What Claude Code is not

**It is not a replacement for the web app.** Writing emails, doing research, drafting documents — the web app is better for these. Claude Code in a terminal is worse for conversational tasks than the web interface.

**It is not magic for non-developers.** If you are not comfortable editing files and running commands, adding Claude Code to the mix does not make those things easier. It makes them faster once you know how to do them, but it does not remove the learning curve.

**It is not a code generation service.** You still need to review what it produces and understand what it is changing. Using it as a "generate code I don't understand" tool works fine for small tasks and builds up significant maintenance debt for larger ones.

## The third option: building with the Claude API

If neither of these fits — you want to build something that uses Claude as a component (a chatbot, an automated workflow, an internal tool) — neither the web app nor Claude Code is the right answer. You want the [Claude API](/articles/your-first-claude-api-call), which lets you build Claude into your own applications.

The three options are genuinely different tools for genuinely different jobs. Most people start with the web app, add Claude Code when they are working on code regularly, and reach for the API when they want to build something custom. That is the normal progression and it is a sensible one.

---

*To set up Claude Code: [the project setup guide](/articles/claude-code-project-setup) covers installation and CLAUDE.md. To understand what to write in CLAUDE.md: [the templates article](/articles/claude-md-templates) has four annotated starting points. For the API route: [the developer path starts here](/articles/your-first-claude-api-call).*`,
  },
]

async function seed() {
  console.log('Seeding batch 48...\n')

  for (const article of ARTICLES) {
    const term = await getTermId(article.termSlug)
    if (!term) {
      console.error(`  Term not found: ${article.termSlug} (for ${article.slug})`)
      continue
    }

    const { error } = await sb.from('articles').upsert({
      slug: article.slug,
      term_id: term.id,
      term_name: term.name,
      term_slug: article.termSlug,
      cluster: article.cluster,
      title: article.title,
      angle: article.angle,
      body: article.body.trim(),
      excerpt: article.excerpt,
      read_time: article.readTime,
      tier: 1,
      published: true,
    }, { onConflict: 'slug' })

    if (error) {
      console.error(`  ${article.slug}:`, error.message)
    } else {
      console.log(`  ${article.slug} — seeded`)
    }
  }

  console.log('\nDone.')
}

seed().then(() => process.exit(0))
