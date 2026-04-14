/**
 * Batch 57 — Anthropic announcements (April 8–11, 2026)
 *
 * 1. ant-cli
 *    The ant CLI: a command-line client for the Claude API released April 8.
 *    Exposes every API endpoint as a subcommand, supports YAML/JSON input,
 *    --transform output filtering, and native Claude Code integration.
 *    Audience: developer. Cluster: APIs & SDKs.
 *
 * 2. claude-for-word
 *    Claude for Word launched April 11 (beta), completing the Microsoft Office
 *    suite (Excel + PowerPoint shipped February 2026). Sidebar add-in with
 *    document awareness and tracked-changes output. Requires Team/Enterprise.
 *    Audience: operator, productivity. Cluster: Claude + Tools.
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-57.ts
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

  // ── 1. ant CLI ────────────────────────────────────────────────────────────
  {
    termSlug: 'tool-use',
    slug: 'ant-cli',
    angle: 'process',
    title: 'The ant CLI: interact with the Claude API from your terminal',
    excerpt: "Anthropic's ant CLI gives you direct access to every Claude API endpoint from the command line — messages, models, batch jobs, agents. Install it, set your API key, and run API calls without writing application code.",
    readTime: 7,
    cluster: 'APIs & SDKs',
    body: `The \`ant\` CLI is a command-line client for the Claude API. It gives you access to every API endpoint — messages, models, batch jobs, files, agents, sessions — directly from your terminal without writing any code.

Released April 8, 2026.

## How it differs from Claude Code

Claude Code is an AI coding assistant that runs in your terminal and helps you write, debug, and navigate code. The \`ant\` CLI is different: it is a low-level API client, like \`curl\`, but with typed flags, YAML input support, and automatic pagination. You use it to call API endpoints directly — inspect models, send messages, manage agents, check batch results.

The two tools are complementary. Claude Code knows how to use \`ant\` natively, so you can ask Claude Code to run API operations by describing them in natural language.

## Installation

**macOS (Homebrew):**

\`\`\`bash
brew install anthropics/tap/ant

# Unquarantine the binary on macOS
xattr -d com.apple.quarantine "$(brew --prefix)/bin/ant"
\`\`\`

**Linux / WSL:**

\`\`\`bash
VERSION=1.0.0
OS=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m | sed -e 's/x86_64/amd64/' -e 's/aarch64/arm64/')
curl -fsSL "https://github.com/anthropics/anthropic-cli/releases/download/v\${VERSION}/ant_\${VERSION}_\${OS}_\${ARCH}.tar.gz" \\
  | sudo tar -xz -C /usr/local/bin ant
\`\`\`

**Go (from source, requires Go 1.22+):**

\`\`\`bash
go install github.com/anthropics/anthropic-cli/cmd/ant@latest
\`\`\`

Check the installation: \`ant --version\`

## Authentication

Set your API key as an environment variable. Get a key from [platform.claude.com/settings/keys](https://platform.claude.com/settings/keys).

\`\`\`bash
# zsh
echo 'export ANTHROPIC_API_KEY=sk-ant-api03-...' >> ~/.zshrc && source ~/.zshrc
\`\`\`

## Send your first message

\`\`\`bash
ant messages create \\
  --model claude-sonnet-4-6 \\
  --max-tokens 1024 \\
  --message '{role: user, content: "What is the capital of France?"}'
\`\`\`

The response is the full API JSON object, pretty-printed in the terminal. When piped or redirected, it emits compact JSON automatically.

\`\`\`json
{
  "model": "claude-sonnet-4-6",
  "id": "msg_01YMmR5XodC5nTqMxLZMKaq6",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "The capital of France is Paris."
    }
  ],
  "stop_reason": "end_turn",
  "usage": { "input_tokens": 18, "output_tokens": 9 }
}
\`\`\`

## Command structure

Commands follow a \`resource action\` pattern:

\`\`\`
ant <resource>[:<subresource>] <action> [flags]
\`\`\`

\`\`\`bash
ant models list                                    # list available models
ant messages create --model ...                    # send a message
ant beta:agents list                               # list agents (managed agents beta)
ant beta:sessions:events list --session-id ...     # list events in a session
\`\`\`

Resources in beta — agents, sessions, deployments, environments, skills — use the \`beta:\` prefix. The CLI sends the required beta header automatically; you do not need to pass it yourself.

Run \`ant --help\` for the full resource list. Append \`--help\` to any subcommand for its flags.

## Transform and filter output

The \`--transform\` flag takes a [GJSON path](https://github.com/tidwall/gjson) and reshapes the response before printing. For list endpoints, the transform runs against each item individually:

\`\`\`bash
# Print only the ID and model for each agent
ant beta:agents list \\
  --transform "{id,name,model}" \\
  --format jsonl
\`\`\`

\`\`\`jsonl
{"id": "agent_011CYm1BLqPX...", "name": "Research Agent", "model": "claude-sonnet-4-6"}
{"id": "agent_011CYkVwfaEt...", "name": "Support Agent", "model": "claude-haiku-4-5"}
\`\`\`

To capture a scalar into a shell variable, pair \`--transform\` with \`--format yaml\` — YAML emits scalars without quotes:

\`\`\`bash
AGENT_ID=$(ant beta:agents create \\
  --name "My Agent" \\
  --model '{id: claude-sonnet-4-6}' \\
  --transform id --format yaml)

printf '%s\\n' "$AGENT_ID"
# agent_011CYm1BLqPXpQRk5khsSXrs
\`\`\`

## Passing request bodies

Three mechanisms, depending on the shape of your data:

**Flags** for scalar fields and short structured values (unquoted YAML keys work):

\`\`\`bash
ant beta:sessions create \\
  --agent '{type: agent, id: agent_011CYm1BLqPXpQRk5khsSXrs, version: 1}' \\
  --environment-id env_01595EKxaaTTGwwY3kyXdtbs \\
  --title "Research session"
\`\`\`

**Stdin** for full request bodies as JSON or YAML. Heredocs work cleanly for multi-line YAML; quote the delimiter to disable variable expansion:

\`\`\`bash
ant beta:agents create <<'YAML'
name: Research Agent
model: claude-opus-4-6
system: |
  You are a research assistant. Cite sources for every claim.
tools:
  - type: agent_toolset_20260401
YAML
\`\`\`

**@file references** to inline a file's contents into a string field — useful for system prompts:

\`\`\`bash
ant beta:agents create \\
  --name "Researcher" \\
  --model '{id: claude-sonnet-4-6}' \\
  --system @./prompts/researcher.txt
\`\`\`

For binary files (PDFs, images), the CLI base64-encodes them automatically when you use \`@file\` inside a structured field.

## Version-controlling API resources

YAML input makes \`ant\` useful for keeping API resources in version control. Define an agent, environment, or skill as a YAML file, check it in, and sync it from CI:

\`\`\`yaml
# summarizer.agent.yaml
name: Summarizer
model: claude-sonnet-4-6
system: |
  You are a helpful assistant that writes concise summaries.
tools:
  - type: agent_toolset_20260401
\`\`\`

Create it:

\`\`\`bash
ant beta:agents create < summarizer.agent.yaml
\`\`\`

Update from CI (pass agent ID and current version as flags):

\`\`\`bash
ant beta:agents update \\
  --agent-id agent_011CYm1BLqPXpQRk5khsSXrs \\
  --version 1 \\
  < summarizer.agent.yaml
\`\`\`

This is infrastructure-as-code for prompts and agent configurations.

## Claude Code integration

With \`ant\` on your PATH and \`ANTHROPIC_API_KEY\` set, Claude Code can operate on your API resources directly. Examples of what you can ask Claude Code:

- "List my recent agent sessions and tell me which ones errored."
- "Upload every PDF in ./reports to the Files API and print the resulting IDs."
- "Pull the events for session_01... and tell me where the agent got stuck."

Claude Code shells out to \`ant\`, parses the structured output, and reasons over the results without any custom integration code from you.

## Debugging

Add \`--debug\` to any command to print the full HTTP request and response (including headers) to stderr. API keys are redacted.

\`\`\`bash
ant --debug beta:agents list
\`\`\`

## When ant makes sense vs. the SDK

The Python or TypeScript SDK is the right choice when you're writing production application code — it handles types, async, and integrates into your codebase.

\`ant\` is better for:

- Exploring the API interactively before writing code
- Shell scripts and CI pipelines that call API endpoints
- Syncing agent/environment/skill definitions from YAML in version control
- Debugging a specific request — \`--debug\` shows you exactly what was sent and received

## Official docs

Full reference: [platform.claude.com/docs/en/api/sdks/cli](https://platform.claude.com/docs/en/api/sdks/cli)

GitHub releases: [github.com/anthropics/anthropic-cli/releases](https://github.com/anthropics/anthropic-cli/releases)`,
  },

  // ── 2. Claude for Word ────────────────────────────────────────────────────
  {
    termSlug: 'tool-use',
    slug: 'claude-for-word',
    angle: 'process',
    title: 'Claude for Word: what the add-in does and how to install it',
    excerpt: "Anthropic's Word add-in puts Claude in a sidebar that reads your whole document, suggests edits as tracked changes you accept or reject, and works without leaving Word. Requires a Team or Enterprise plan.",
    readTime: 4,
    cluster: 'Claude + Tools',
    body: `Claude for Word is an add-in for Microsoft Word that launched in beta on April 11, 2026. It puts a Claude sidebar inside Word so you can draft, edit, and rewrite document content without switching to a separate tab or copy-pasting between apps.

It completes Anthropic's Microsoft Office suite. Claude for Excel and Claude for PowerPoint launched in February 2026; Word is the third.

## What it requires

A Claude Team or Enterprise plan. Free and Pro plans are not included.

## How to install it

1. Open Microsoft Word
2. Go to **Insert** → **Get Add-ins**
3. Search for **"Claude by Anthropic"**
4. Click Install
5. Click the Claude icon in your Home ribbon once installed
6. Sign in with your Anthropic credentials

The sidebar loads on the right side of the document and reads the contents of your current file on load.

## What it actually does

**Document awareness.** The add-in reads your entire open document, not just a selected passage. When you ask for a change or feedback, Claude has the full context — headings, paragraphs, tables, all of it.

**Tracked changes.** When Claude makes edits, they appear as Word's native tracked changes — the same format you see when a human collaborator edits your file. You accept or reject each suggestion individually with one click.

**Formatting preservation.** Claude's edits keep your document's existing structure: bold, heading levels, alignment. It does not strip formatting to plain text and reinsert.

**Chat interface.** The sidebar has a conversation panel where you type instructions. You can ask it to rewrite a section, adjust tone across the whole document, add a summary paragraph, or explain why a passage is unclear. It returns suggestions you can apply or discard.

## What it's good for

- Getting a working first revision of a dense or wordy section without rewriting from scratch
- Tone adjustments across an entire document ("make this more formal" applies to the full document, not just a selection)
- Structure changes — break a paragraph into bullets, merge two sections, add a transition
- A quick pass before sharing — ask what a reader might find unclear or missing

## What to be realistic about

The add-in is in beta. Like Claude's other Office integrations, the feature set will expand.

It works best on document-structured content: reports, proposals, policies, memos. For heavily formatted materials — complex tables, form-heavy documents, mail merges — test your specific workflow before committing to it.

As with all Claude outputs: review before accepting. Claude for Word helps you produce a better first draft faster; it is not a proofreader you can rubber-stamp.

## Comparison to using claude.com directly

The functional difference is round-trip friction. Without the add-in: copy text, switch to claude.com, paste, copy result, switch back, paste, reformat. With the add-in: type an instruction in the sidebar, review the tracked changes, accept what you want.

For one-off questions the friction is manageable. For editing-heavy workflows — documents you revise in multiple passes — the add-in is meaningfully faster.

---

*Related: [Claude for Google Docs](/articles/claude-plus-google-docs) — similar sidebar workflow in Google Workspace. [Weekly review with Claude](/articles/weekly-review-with-claude) — using Claude for regular document and planning workflows.*`,
  },

]

async function main() {
  console.log(`Seeding ${ARTICLES.length} articles (batch 57 — ant CLI + Claude for Word)...\n`)

  for (const art of ARTICLES) {
    const term = await getTermId(art.termSlug)
    if (!term) {
      console.error(`  ✗ Term not found: ${art.termSlug}`)
      continue
    }

    const { error } = await sb.from('articles').upsert({
      slug:      art.slug,
      term_id:   term.id,
      term_name: term.name,
      term_slug: art.termSlug,
      cluster:   art.cluster,
      title:     art.title,
      angle:     art.angle,
      body:      art.body.trim(),
      excerpt:   art.excerpt,
      read_time: art.readTime,
      tier:      3,
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
