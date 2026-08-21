import Link from 'next/link'
import type { Metadata } from 'next'
import ComparisonPage, { comparisonLd, type SpecRow } from '@/components/ComparisonPage'

const TITLE = 'Claude vs GPT-5.6 for Document Analysis'
const DESC =
  'Claude and GPT-5.6 for reading contracts, filings, and long document sets in 2026. Context window economics, citation guarantees, page and image limits, and how to test retrieval accuracy on documents you already know the answers to.'

export const metadata: Metadata = { title: `${TITLE} — AI Codex`, description: DESC }

const SPECS: SpecRow[] = [
  {
    label: 'Context window and what it costs',
    claude: '1M tokens on Opus 5, Sonnet 5, and Fable 5, billed at standard rates across the entire window. A 900k-token request costs the same per token as a 9k one — no penalty for filling it.',
    other: 'Long context available across the GPT-5.6 family, but metered separately: Sol $10 / $45, Terra $4 / $18, Luna $0.40 / $1.80 — roughly double the headline rate. On document work this is the single largest cost difference between the two.',
  },
  {
    label: 'Citations',
    claude: 'The Citations API returns the specific source passage behind each claim. For legal, compliance, and diligence work this is the difference between an answer you can file and an answer you have to re-verify by hand.',
    other: 'Retrieval with source references is available. Confirm what the citation is actually guaranteeing — a document-level reference and a passage-level one are not the same artifact when a reviewer challenges you.',
  },
  {
    label: 'Pages and images per request',
    claude: 'Up to 600 images or PDF pages per request, raised from 100 in March 2026.',
    other: 'Check OpenAI’s current per-request limits; they differ by tier and by how the document is submitted.',
  },
  {
    label: 'File handling',
    claude: 'Files API went GA on August 19, 2026. Upload once, reference across requests, and set `expires_in_seconds` so your file store does not grow without bound.',
    other: 'File upload and retrieval available through the API and Assistants surfaces.',
  },
  {
    label: 'Whole-corpus vs retrieval',
    claude: 'With 1M tokens at flat pricing, many document sets that would traditionally need a RAG pipeline fit in context directly. That removes retrieval as a source of error, which is usually the largest source of error.',
    other: 'The long-context meter makes whole-corpus-in-context materially more expensive, which pushes designs toward retrieval — and back toward chunking and reranking as failure surfaces.',
  },
  {
    label: 'Spreadsheets and structured documents',
    claude: 'Claude for Excel, plus Claude for Word and PowerPoint. Agent Skills went GA on the API on August 19, 2026 for encoding document-type-specific procedure.',
    other: 'Code interpreter handles structured data well and has a longer track record for ad-hoc numerical work.',
  },
  {
    label: 'Compliance for regulated review',
    claude: 'Compliance API for retrieval and export, inference hooks to deny a prompt before the model sees it, and `inference_geo` to pin the jurisdiction at a 1.1x multiplier.',
    other: 'Enterprise controls through OpenAI and Azure, including data-zone options. Map them explicitly against your requirements.',
  },
]

export default function Page() {
  const ld = comparisonLd(TITLE, DESC, 'claude-vs-gpt5-document-analysis')
  return (
    <ComparisonPage
      title={TITLE}
      otherLabel="GPT-5.6"
      otherAccent="#5B8DD9"
      pricingVendors={['Anthropic', 'OpenAI']}
      intro={[
        <p key="1">
          This is the one category where the two families are not close, and the reason is billing
          rather than intelligence. Anthropic includes the full 1M-token window at standard pricing;
          OpenAI meters long context at roughly double its headline rate. On document work, that is
          the comparison.
        </p>,
        <p key="2">
          The second-order effect matters more than the first. Flat long-context pricing lets you
          put a whole document set in context and skip retrieval entirely — and retrieval is where
          most document pipelines actually go wrong. Below: the verified numbers, and a test using
          documents whose answers you already know.
        </p>,
      ]}
      specs={SPECS}
      claims={[
        {
          source: 'Verifiable from published documentation',
          items: [
            'Claude 4.6 and later include the full 1M-token context window at standard pricing, with caching and batch discounts applying across it.',
            'Claude raised the per-request media limit from 100 to 600 images or PDF pages in March 2026.',
            'GPT-5.6 publishes a separate long-context rate at roughly 2x the standard input price and 1.5x the output price.',
          ],
          caveat: 'These are documented product facts, not benchmark results. They are the ones that determine your bill on document work, which is why they lead.',
        },
        {
          source: 'What neither vendor measures for you',
          items: [
            'Extraction accuracy on your document format — scanned contracts behave nothing like clean filings.',
            'Whether the model notices the absence of a clause, as opposed to summarising the clauses present.',
            'How each behaves on a document that contradicts itself, which real document sets do constantly.',
          ],
          caveat: 'The third one is the most under-tested and the most consequential. A model that silently picks one side of a contradiction produces a confident answer that is wrong in a way no summary metric will show you.',
        },
      ]}
      evalHeading="Test on documents where you already know the answer"
      evalIntro={
        <p>
          Document analysis has the best evaluation property of any AI application: you can grade it
          exactly. Somebody in your organisation has already read these documents and written down
          what they say. Use that.
        </p>
      }
      evalSteps={[
        { bold: 'Pick 15 documents your team has already reviewed by hand.', rest: 'Contracts with a completed redline, filings with a written summary, reports someone already extracted figures from. The human output is your answer key.' },
        { bold: 'Write the 10 questions you actually ask of every document.', rest: 'Termination clause, liability cap, auto-renewal, governing law — whatever your real checklist is. Not interesting questions; routine ones.' },
        { bold: 'Include three documents where the answer is "not present."', rest: 'This is the test most people skip and the one that separates the models. A model that invents a liability cap because the question implied there should be one is unusable for diligence, no matter how good its summaries are.' },
        { bold: 'Include one document that contradicts itself.', rest: 'Real document sets do. Check whether the model surfaces the conflict or silently resolves it. Silent resolution is the dangerous failure, because the output looks identical to a correct one.' },
        { bold: 'Verify every citation by hand on the first run.', rest: 'Open the document, find the passage, confirm it says what the model claims. Do this once properly and you will know whether you can trust the citations thereafter — which determines how much review the pipeline still needs.' },
        { bold: 'Price it whole-corpus and retrieval-based, both ways.', rest: 'On Claude, whole-corpus is often cheaper than building and running a retrieval layer once you count engineering time. On GPT-5.6, the long-context meter usually pushes the other way. Run the arithmetic rather than assuming.' },
      ]}
      evalFooter={
        <p>
          <Link href="/articles/building-a-rag-pipeline-from-scratch" style={{ color: 'var(--accent)' }}>Building a RAG pipeline</Link> covers
          the retrieval path when the corpus genuinely will not fit, and{' '}
          <Link href="/articles/claude-hallucination-prevention" style={{ color: 'var(--accent)' }}>hallucination prevention</Link> covers
          the grounding setup that keeps "not present" answers honest.
        </p>
      }
      bottomLine={[
        {
          heading: 'Pick Claude',
          body: <>for almost any serious document work. Flat pricing across a 1M-token window, passage-level citations, 600 pages per request, and a compliance surface built for regulated review. The cost advantage on long documents is structural rather than promotional, and it compounds on every request.</>,
        },
        {
          heading: 'Pick GPT-5.6',
          body: <>if your documents are short enough that long-context metering never triggers, if you are doing heavy numerical work where code interpreter has a longer track record, or if you are already committed to the ecosystem and the volume does not justify a second integration.</>,
        },
        {
          heading: 'Either way, do not skip the "not present" tests',
          body: <>Every document pipeline that has embarrassed someone failed the same way: it answered a question the document did not answer. That is a property of how you evaluated, not of which vendor you chose, and no comparison page can fix it for you. See <Link href="/articles/how-to-evaluate-your-agents" style={{ color: 'var(--accent)' }}>how to evaluate your agents</Link>.</>,
        },
      ]}
      related={[
        { href: '/articles/building-a-rag-pipeline-from-scratch', label: 'Building a RAG pipeline', sub: 'For when the corpus genuinely will not fit.' },
        { href: '/articles/claude-for-legal-teams', label: 'Claude for legal teams', sub: 'Contract review, redlines, and what to keep human.' },
        { href: '/articles/context-window-practical', label: 'Using a 1M-token window well', sub: 'Bigger context is not automatically better context.' },
        { href: '/compare/claude-vs-gpt5-customer-support', label: 'Customer support', sub: 'The other grounding-critical comparison.' },
      ]}
      {...ld}
    />
  )
}
