import Link from 'next/link'
import type { Metadata } from 'next'
import ComparisonPage, { comparisonLd, type SpecRow } from '@/components/ComparisonPage'

const TITLE = 'Claude vs GPT-5.6 for Writing'
const DESC =
  'Claude and GPT-5.6 for writing work in 2026. What each is actually like to edit with, house-style adherence, long-document coherence, the output-length ceilings, and a blind test that settles it for your voice rather than an average reader’s.'

export const metadata: Metadata = { title: `${TITLE} — AI Codex`, description: DESC }

const SPECS: SpecRow[] = [
  {
    label: 'Max output in one pass',
    claude: '128k tokens on the Messages API — roughly a short book. Up to 300k on the Batch API with the `output-300k-2026-03-24` beta header.',
    other: 'Varies by tier. If you generate long-form in single passes, check the current per-tier ceiling rather than assuming parity.',
  },
  {
    label: 'Context for long documents',
    claude: '1M tokens on Opus 5, Sonnet 5, and Fable 5, at standard pricing across the whole window. You can put an entire manuscript and a style guide in context without a retrieval layer.',
    other: 'Long context available across the GPT-5.6 family, metered at roughly double the headline rate.',
  },
  {
    label: 'Encoding your house style',
    claude: 'Skills package a style guide as reusable instructions Claude applies automatically to matching tasks — versioned in a repo, shared across a team. Projects hold standing instructions and reference documents.',
    other: 'Custom instructions and project-level configuration. Comparable in intent; the packaging and distribution story differs.',
  },
  {
    label: 'Knowledge cutoff',
    claude: 'Opus 5 reaches May 2026 — the most recent of any Claude model. Sonnet 5 is January 2026.',
    other: 'Check OpenAI’s per-tier cutoff. Matters for anything referencing recent events, products, or terminology.',
  },
  {
    label: 'Price for a heavy writing workload',
    claude: 'Sonnet 5 at $2 / $10 is the sensible default. Output is where writing costs land, and $10/MTok output is the number to model against.',
    other: 'Terra at $2 / $12 is the closest equivalent; Sol at $5 / $30 for the hardest work. Output rates run higher than Claude’s at every tier.',
  },
  {
    label: 'The tokenizer footnote',
    claude: 'Claude 4.7 and later produce roughly 30% more tokens for the same text than earlier models. A per-word cost comparison against an older Claude model, or across vendors, will mislead you.',
    other: 'Unchanged across the 5.6 family.',
  },
  {
    label: 'Working surface',
    claude: 'Artifacts for live side-by-side editing, Claude for Word with tracked changes on Mac and Windows, Cowork for handing over a whole document task, Claude Design for anything that ends up as a deck.',
    other: 'Canvas for structured writing and editing, plus the broader ChatGPT surface.',
  },
]

export default function Page() {
  const ld = comparisonLd(TITLE, DESC, 'claude-vs-gpt5-writing')
  return (
    <ComparisonPage
      title={TITLE}
      otherLabel="GPT-5.6"
      otherAccent="#5B8DD9"
      pricingVendors={['Anthropic', 'OpenAI']}
      intro={[
        <p key="1">
          Writing is the hardest thing to compare honestly, because quality here is taste and taste
          is not a benchmark. Anyone telling you one model is definitively the better writer is
          telling you about their own ear.
        </p>,
        <p key="2">
          What can be stated plainly: the output ceilings, the context available for long documents,
          how each one lets you encode a house style, and what a heavy writing workload costs. Then
          a blind test, because on this particular question a twenty-minute experiment genuinely
          does beat any amount of reading.
        </p>,
      ]}
      specs={SPECS}
      claims={[
        {
          source: 'What writers consistently report',
          items: [
            'Claude is described as more restrained by default — less inclined to open with a summary of the question or close with an offer to help further.',
            'GPT is described as more eager to produce structure: headers, bullets, and framing scaffolds even when the prompt did not ask for them.',
            'Both are reported to converge substantially once given a strong style guide and a few examples.',
          ],
          caveat: 'This is aggregated practitioner sentiment, not measurement, and it is the kind of claim that ages badly across model versions. It is here because it is the most common thing people ask, not because it is evidence. That third point is the one to take seriously: the prompt matters more than the model.',
        },
      ]}
      evalHeading="Run a blind test, because taste is the whole question"
      evalIntro={
        <p>
          Twenty minutes settles this better than any comparison page, including this one. The
          critical detail is <em>blind</em> — knowing which model produced which draft contaminates
          the judgement completely, and people who skip this step reliably pick the vendor they
          already preferred.
        </p>
      }
      evalSteps={[
        { bold: 'Take five pieces you have already written and were happy with.', rest: 'Real work, not test prompts. Your own published writing is the only benchmark that encodes your taste.' },
        { bold: 'Write one brief per piece and give both models the identical brief.', rest: 'Include your style guide if you have one. If you do not have one, write it first — it will improve both outputs more than switching models would.' },
        { bold: 'Strip the labels before you read.', rest: 'Have someone else shuffle them, or paste them into a document with the sources removed. This step is the entire experiment.' },
        { bold: 'Score on edit distance, not first impression.', rest: 'How much would you have to change before you would publish it under your name? A draft that reads well but needs a full rewrite of the argument is worse than a plain one that is structurally right.' },
        { bold: 'Test the second turn as well as the first.', rest: 'Most writing work is revision. "Cut this by a third and lose the hedging" is a more revealing prompt than the initial brief, and the models differ more on it.' },
      ]}
      evalFooter={
        <p>
          <Link href="/articles/claude-for-writing-and-editing" style={{ color: 'var(--accent)' }}>Claude for writing and editing</Link> covers
          the prompting patterns, and <Link href="/articles/building-ai-skills-for-your-team" style={{ color: 'var(--accent)' }}>building Skills for your team</Link> covers
          packaging a house style so everyone gets the same voice.
        </p>
      }
      bottomLine={[
        {
          heading: 'Pick Claude',
          body: <>if you work on long documents in one piece rather than in fragments, if you want a style guide encoded once and applied automatically across a team, or if you edit in Word and want tracked changes rather than copy-paste. The 1M-token window at flat pricing means an entire manuscript plus your style guide fits in context, which changes what is possible on a book-length edit.</>,
        },
        {
          heading: 'Pick GPT-5.6',
          body: <>if your writing workflow already lives in the OpenAI ecosystem, or if you write in short high-volume bursts where Luna’s pricing makes a difference at scale. On a single 800-word draft with a good brief, you will struggle to reliably pick the winner blind — which is itself the finding.</>,
        },
        {
          heading: 'Neither, first',
          body: <>if you have not written down your style guide. The gap between a briefed model and an unbriefed one is far larger than the gap between these two vendors, and it costs nothing to close. Switching models to fix a prompt problem is the most common wasted migration in this category.</>,
        },
      ]}
      related={[
        { href: '/articles/claude-for-writing-and-editing', label: 'Writing and editing with Claude', sub: 'The prompting patterns that actually change output.' },
        { href: '/articles/claude-for-word', label: 'Claude for Word', sub: 'Tracked changes in the tool you already edit in.' },
        { href: '/compare/claude-vs-gpt5-document-analysis', label: 'Document analysis', sub: 'Reading long documents rather than producing them.' },
        { href: '/articles/how-to-write-a-good-prompt', label: 'Writing a good prompt', sub: 'The lever that beats model choice.' },
      ]}
      {...ld}
    />
  )
}
