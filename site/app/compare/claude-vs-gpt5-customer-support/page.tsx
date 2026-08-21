import Link from 'next/link'
import type { Metadata } from 'next'
import ComparisonPage, { comparisonLd, type SpecRow } from '@/components/ComparisonPage'

const TITLE = 'Claude vs GPT-5.6 for Customer Support'
const DESC =
  'Claude and GPT-5.6 for support automation in 2026. Verified pricing at ticket volume, tone and escalation behaviour, grounding and citations, compliance surfaces, and how to run a shadow-mode test before you put either in front of a customer.'

export const metadata: Metadata = { title: `${TITLE} — AI Codex`, description: DESC }

const SPECS: SpecRow[] = [
  {
    label: 'The tier you would actually run',
    claude: 'Haiku 4.5 at $1 / $5 for tier-one deflection; Sonnet 5 at $2 / $10 when the answer needs reasoning over policy. Anthropic’s own worked example puts 10,000 support conversations at roughly $37 on Haiku 4.5.',
    other: 'Luna at $0.20 / $1.20 is the cheapest credible option on the market for high-volume deflection. Terra at $2 / $12 for harder tickets.',
  },
  {
    label: 'Cost at 100k tickets/month',
    claude: 'On Haiku 4.5, in the region of $370/month in tokens at ~3,700 tokens per conversation, before caching. Cache hits cost 10% of input, and your policy documents are the same on every ticket — so real-world cost lands well below the arithmetic.',
    other: 'Luna is roughly a fifth of Haiku 4.5’s input rate, so the token line is materially cheaper. Check whether your context length crosses OpenAI’s long-context threshold, which doubles the rate.',
  },
  {
    label: 'Grounding answers in your help centre',
    claude: 'The Citations API returns the exact source passage behind a claim. For support that is not a nicety — it is how an agent tells the difference between quoting your refund policy and inventing one.',
    other: 'Retrieval and file search are available; verify what the citation guarantees are for your setup rather than assuming parity.',
  },
  {
    label: 'Escalation and refusal behaviour',
    claude: 'Constitutional AI training produces a model that declines and escalates comparatively readily. In support that is usually the behaviour you want; in sales it can read as unhelpful.',
    other: 'Generally more willing to attempt an answer. Better completion rates, and a larger surface for confidently wrong answers reaching a customer.',
  },
  {
    label: 'Compliance and audit trail',
    claude: 'Compliance API returns activity, chats, files, projects, and since August 11, 2026 the transcripts of Cowork and Claude Code sessions running on employees’ own machines. Inference hooks can deny a prompt before the model sees it.',
    other: 'Enterprise admin and logging available through OpenAI and Azure. Map the specific controls against your retention and DLP requirements — the surfaces are not equivalent.',
  },
  {
    label: 'Where the model runs',
    claude: 'Claude API, Bedrock, Claude Platform on AWS, Google Cloud, Microsoft Foundry. `inference_geo` pins the jurisdiction at a 1.1x multiplier.',
    other: 'OpenAI API and Azure, with Azure data-zone options.',
  },
  {
    label: 'Helpdesk integration',
    claude: 'Connectors and MCP for Intercom, Zendesk, and similar. Claude Tag puts Claude in Slack as a tagged participant for internal escalation threads.',
    other: 'Broader catalogue of off-the-shelf helpdesk integrations, and more vendors ship an OpenAI connector by default.',
  },
]

export default function Page() {
  const ld = comparisonLd(TITLE, DESC, 'claude-vs-gpt5-customer-support')
  return (
    <ComparisonPage
      title={TITLE}
      otherLabel="GPT-5.6"
      otherAccent="#5B8DD9"
      pricingVendors={['Anthropic', 'OpenAI']}
      intro={[
        <p key="1">
          Support is the one application where the cheapest capable model usually wins, because
          volume dominates everything else. It is also the application where a confidently wrong
          answer costs the most, because it reaches a customer with your name on it.
        </p>,
        <p key="2">
          Those two facts pull in opposite directions, and that tension — not benchmark scores — is
          what should decide this. Below: verified pricing at real ticket volume, the behavioural
          differences that matter for escalation, and a shadow-mode test to run before either model
          touches a live conversation.
        </p>,
      ]}
      specs={SPECS}
      claims={[
        {
          source: 'Anthropic, published cost guidance',
          items: [
            'A worked example of 10,000 support conversations on Haiku 4.5 at roughly 3,700 tokens each totals about $37 in tokens.',
            'Cache reads are billed at 10% of the standard input rate, and the Batch API takes 50% off both directions.',
          ],
          caveat: 'These are Anthropic’s own figures for an illustrative workload. Your token-per-conversation number is the variable that matters, and it is usually higher than you expect once policy documents and conversation history are in context.',
        },
        {
          source: 'What neither vendor publishes',
          items: [
            'Deflection rate on your ticket mix.',
            'How often the model escalates when it should have answered, and answered when it should have escalated.',
            'CSAT on AI-handled tickets versus human-handled ones.',
          ],
          caveat: 'These are the only three numbers that decide whether support automation works, and no vendor can produce them for you. They come out of a shadow-mode run, which is why the section below exists.',
        },
      ]}
      evalHeading="Run it in shadow mode before a customer sees it"
      evalIntro={
        <p>
          Support is the wrong place to learn from production. The good news is that support is
          unusually easy to test safely, because you have a backlog of resolved tickets with known
          correct answers and a human already graded them.
        </p>
      }
      evalSteps={[
        { bold: 'Take 200 resolved tickets from the last quarter.', rest: 'Weight them the way your real queue is weighted, not toward the interesting ones. The boring repetitive tickets are where the ROI lives.' },
        { bold: 'Run both models against them with no customer in the loop.', rest: 'Same prompt, same retrieved context, same tools. Log the answer and the escalate/answer decision.' },
        { bold: 'Grade three things separately.', rest: 'Was the answer correct? Was it grounded in a real source passage? Did it make the right escalate-or-answer call? A model can score well on the first and badly on the third, and the third is what gets you in trouble.' },
        { bold: 'Count the confidently wrong answers specifically.', rest: 'Not the refusals — the answers that were fluent, plausible, and wrong. That number, not the average, is your risk. One wrong refund policy quote outweighs fifty good deflections.' },
        { bold: 'Price it on cost per resolved ticket.', rest: 'Include the escalated ones, which cost you tokens and a human. A model that is cheaper per token and escalates twice as often is not cheaper.' },
      ]}
      evalFooter={
        <p>
          <Link href="/articles/how-to-evaluate-your-agents" style={{ color: 'var(--accent)' }}>How to evaluate your agents</Link> has
          the test-set design, and <Link href="/articles/claude-hallucination-prevention" style={{ color: 'var(--accent)' }}>hallucination prevention</Link> covers
          the grounding setup that keeps the confidently-wrong number down.
        </p>
      }
      bottomLine={[
        {
          heading: 'Pick Claude',
          body: <>if the cost of a wrong answer is high — regulated industries, financial or medical information, anything where a customer could act on bad guidance. The citation behaviour and the readier escalation are worth real money in those settings, and the compliance surface is more developed.</>,
        },
        {
          heading: 'Pick GPT-5.6',
          body: <>if you are running very high volume on low-stakes tickets, where Luna at $0.20 / $1.20 changes the unit economics outright, or if your helpdesk already ships a first-class OpenAI integration and building the equivalent is a quarter of engineering time you do not have.</>,
        },
        {
          heading: 'Route between them',
          body: <>which is what most mature support deployments end up doing. Cheap model for tier-one deflection, stronger model for anything touching policy, money, or a frustrated customer. The routing rule is the product; the model is a component. See <Link href="/articles/claude-for-customer-support" style={{ color: 'var(--accent)' }}>Claude for customer support</Link> for the full build.</>,
        },
      ]}
      related={[
        { href: '/articles/claude-for-customer-support', label: 'Claude for customer support', sub: 'The full build — routing, grounding, escalation.' },
        { href: '/articles/claude-cs-team-playbook', label: 'CS team playbook', sub: 'Running a support team with AI in the loop.' },
        { href: '/compare/claude-vs-gpt5-document-analysis', label: 'Document analysis', sub: 'The comparison for contracts and long documents.' },
        { href: '/tools/cost-calculator', label: 'Cost calculator', sub: 'Model spend at your ticket volume.' },
      ]}
      {...ld}
    />
  )
}
