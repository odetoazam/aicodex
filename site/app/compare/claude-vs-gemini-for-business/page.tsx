import Link from 'next/link'
import type { Metadata } from 'next'
import ComparisonPage, { comparisonLd, type SpecRow } from '@/components/ComparisonPage'

const TITLE = 'Claude vs Gemini for Business'
const DESC =
  'Claude and Google Gemini for business work in 2026. Gemini 3.7 Flash pricing and the 2027 increase nobody is modelling, the Workspace integration question, deployment surfaces, and how to decide when both models are good enough.'

export const metadata: Metadata = { title: `${TITLE} — AI Codex`, description: DESC }

const SPECS: SpecRow[] = [
  {
    label: 'Current models',
    claude: 'Opus 5 ($5 / $25), Sonnet 5 ($2 / $10), Haiku 4.5 ($1 / $5), Fable 5 ($10 / $50) at the frontier.',
    other: 'Gemini 3.7 Flash (GA August 13, 2026), 3.6 Flash, 3.5 Flash, 3.5 Flash-Lite. Gemini Omni for multimodal work including video.',
  },
  {
    label: 'Price today',
    claude: 'Sonnet 5 at $2 / $10 is the everyday tier.',
    other: 'Gemini 3.7 Flash at $0.75 / $3.75 — materially cheaper than Sonnet 5 today.',
  },
  {
    label: 'Price in 2027',
    claude: 'Sonnet 5’s $2 / $10 is the standard rate; the scheduled September 2026 increase was cancelled.',
    other: 'Gemini 3.7 and 3.6 Flash are on introductory pricing through December 31, 2026, then double to $1.50 / $7.50. Model that number, not today’s.',
  },
  {
    label: 'Where it already lives',
    claude: 'Claude for Word, Excel, and PowerPoint. Claude Tag in Slack. Connectors and MCP for everything else — capable, but integration you configure.',
    other: 'Native across Gmail, Drive, Docs, Sheets, and Calendar. If your company runs on Workspace, Gemini is already there and already permissioned. This is Google’s real advantage and it is a large one.',
  },
  {
    label: 'Cross-tool search',
    claude: 'Ask Your Org searches Slack, Microsoft 365, Google Workspace, and custom MCP connectors, returning one synthesised answer with citations. Permission-aware. Team and Enterprise, after owner setup.',
    other: 'Workspace-native search across Gmail, Drive, and Calendar, with Ask Gemini surfacing it as a command line inside Chat.',
  },
  {
    label: 'Multimodal',
    claude: 'Text and image input across all current models, up to 600 images or PDF pages per request. No image or video generation.',
    other: 'Gemini Omni handles text, image, audio, and video, including video generation, understanding, and editing. If your work involves video, this is not a close call.',
  },
  {
    label: 'Agent and developer surface',
    claude: 'Claude Code, Managed Agents with session budgets and self-hosted sandboxes, Agent Skills and MCP both GA, computer use and browser use GA on the API.',
    other: 'Gemini CLI and Code, Computer Use on the 3.5 family, Vertex AI for deployment. Claude models also run on Vertex, so this is not either/or.',
  },
  {
    label: 'Deployment surfaces',
    claude: 'Claude API, Amazon Bedrock, Claude Platform on AWS, Google Cloud Vertex AI, Microsoft Foundry. `inference_geo` pins jurisdiction at a 1.1x multiplier.',
    other: 'Google Cloud and Vertex AI. Deep if you are already on GCP, narrow if you are not.',
  },
]

export default function Page() {
  const ld = comparisonLd(TITLE, DESC, 'claude-vs-gemini-for-business')
  return (
    <ComparisonPage
      title={TITLE}
      otherLabel="Gemini"
      otherAccent="#4CAF7D"
      pricingVendors={['Anthropic', 'Google']}
      intro={[
        <p key="1">
          For most business work in 2026, both of these are good enough, and pretending otherwise
          wastes your time. The decision is almost never about model quality. It is about which
          suite your company already runs, what your data residency requirements are, and whether
          you are budgeting past December.
        </p>,
        <p key="2">
          Two facts do most of the work here. Gemini is native inside Google Workspace in a way
          Claude cannot be, which is worth more than a benchmark point to a company living in Gmail
          and Docs. And Gemini Flash’s current price is introductory — it doubles on January 1,
          2027, which almost nobody is modelling.
        </p>,
      ]}
      specs={SPECS}
      claims={[
        {
          source: 'Verifiable from published pricing and release notes',
          items: [
            'Gemini 3.7 Flash went GA on August 13, 2026 at $0.75 / $3.75, with introductory pricing stated as running through December 31, 2026 and rising to $1.50 / $7.50 thereafter.',
            'Gemini 3.6 Flash and 3.5 Flash-Lite went GA on July 21, 2026.',
            'Claude Sonnet 5’s $2 / $10 became the standard rate on August 10, 2026, with the planned increase cancelled.',
            'Claude models are available on Google Cloud Vertex AI alongside Gemini.',
          ],
          caveat: 'These are documented facts rather than performance claims. On the 2027 Gemini increase in particular: it is published, it is eighteen weeks away at the time of writing, and it changes a twelve-month TCO comparison completely.',
        },
        {
          source: 'What no benchmark will tell you',
          items: [
            'Whether your finance team will actually use a tool that is not already in the sheet they have open.',
            'How much engineering time the integration you do not need is worth.',
            'Whether your legal team will accept the data-handling posture of either vendor.',
          ],
          caveat: 'In business deployments these three consistently outweigh model quality. A slightly weaker model people use beats a better one they have to switch tabs for — which is the strongest argument in Gemini’s favour and has nothing to do with the model.',
        },
      ]}
      evalHeading="Decide this on integration and TCO, not on a bake-off"
      evalIntro={
        <p>
          A quality bake-off between these two will most likely come back inconclusive, and you will
          have spent a week to learn that. Run these checks instead — they produce an answer.
        </p>
      }
      evalSteps={[
        { bold: 'Name where the work actually happens.', rest: 'If 80% of the documents in question live in Google Drive and the people doing the work live in Gmail all day, Gemini starts with an advantage no model comparison can overturn.' },
        { bold: 'Model twelve months, not one.', rest: 'Gemini Flash at $0.75 / $3.75 becomes $1.50 / $7.50 on January 1, 2027. Against Sonnet 5’s fixed $2 / $10, the gap in the back half of your budget year is much smaller than the gap today.' },
        { bold: 'Test the two or three workflows you would actually deploy.', rest: 'Not a general capability comparison. Pick your real use cases — the weekly report, the contract review, the support triage — and run both end to end, including the integration work each would need.' },
        { bold: 'Count the integration you would have to build.', rest: 'For a Workspace company this is often the deciding line item. For an AWS or Microsoft company it points the other way, and Claude’s five deployment surfaces start to matter.' },
        { bold: 'Get the compliance answer in writing early.', rest: 'Data residency, retention, and audit access differ meaningfully. Getting a "no" from legal in month four is the most expensive way to run this evaluation.' },
        { bold: 'Check whether you need video.', rest: 'Gemini Omni generates and edits video; Claude does not do image or video generation at all. If that is on your roadmap it settles the question for that workload regardless of everything above.' },
      ]}
      evalFooter={
        <p>
          <Link href="/articles/ai-platform-landscape-2026" style={{ color: 'var(--accent)' }}>The 2026 AI platform landscape</Link> has
          the wider vendor picture, and <Link href="/articles/building-a-business-case-for-claude" style={{ color: 'var(--accent)' }}>building a business case</Link> covers
          presenting a TCO comparison that survives a finance review.
        </p>
      }
      bottomLine={[
        {
          heading: 'Pick Gemini',
          body: <>if your company runs on Google Workspace. The native presence in Gmail, Drive, Docs, and Sheets removes the adoption problem that kills most AI rollouts, and it is cheaper today. Also pick it if you need video generation or editing, where Claude does not compete.</>,
        },
        {
          heading: 'Pick Claude',
          body: <>if you are on Microsoft 365 or AWS, if you need to deploy across more than one cloud, if long-document work is central (1M tokens at flat pricing is a structural advantage), or if your compliance requirements need inference hooks, the Compliance API, and jurisdiction pinning. Also pick it if budget stability past December matters — Claude’s pricing is standard, Gemini Flash’s is introductory.</>,
        },
        {
          heading: 'Do not agonise over quality',
          body: <>Both are capable enough for essentially all business work in 2026. Teams that spend a quarter on a bake-off usually end up choosing on integration anyway, and could have arrived there in a week. Decide on suite, cost over twelve months, and compliance — then run the shortlist of one.</>,
        },
      ]}
      related={[
        { href: '/articles/ai-platform-landscape-2026', label: 'The 2026 platform landscape', sub: 'Every major vendor, and who is actually competing on what.' },
        { href: '/compare/claude-vs-openai-for-enterprise', label: 'Claude vs OpenAI for enterprise', sub: 'The other enterprise procurement comparison.' },
        { href: '/articles/building-a-business-case-for-claude', label: 'Building a business case', sub: 'Presenting a TCO comparison that survives finance.' },
        { href: '/articles/ask-your-org-guide', label: 'Ask Your Org', sub: 'Claude’s answer to cross-tool search.' },
      ]}
      {...ld}
    />
  )
}
