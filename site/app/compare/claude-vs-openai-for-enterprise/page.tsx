import Link from 'next/link'
import type { Metadata } from 'next'
import ComparisonPage, { comparisonLd, type SpecRow } from '@/components/ComparisonPage'

const TITLE = 'Claude vs OpenAI for Enterprise'
const DESC =
  'Claude and OpenAI as enterprise vendors in 2026. Governance surfaces, compliance and audit access, deployment options, model retirement history, and the procurement questions that decide this long before anyone looks at a benchmark.'

export const metadata: Metadata = { title: `${TITLE} — AI Codex`, description: DESC }

const SPECS: SpecRow[] = [
  {
    label: 'Pre-inference controls',
    claude: 'Inference hooks, in beta since August 5, 2026: every governed prompt across claude.ai, Cowork, and Claude Code is sent to a security server your organization runs, which returns allow or deny before the model sees it. Shadow mode, rollout percentage, and role exclusions for staged deployment.',
    other: 'Controls are largely policy and post-hoc. Confirm directly whether an equivalent inline deny exists for your contract — do not assume parity here.',
  },
  {
    label: 'Audit and compliance access',
    claude: 'Compliance API returns activity, chats, files, and projects, and since August 11, 2026 the transcripts of Cowork and Claude Code sessions running on employees’ own machines. Plus 28 enterprise security integrations shipped May 2026.',
    other: 'Enterprise logging and admin APIs through OpenAI and Azure. Map the specific endpoints against your retention and eDiscovery requirements rather than reading the feature names as equivalent.',
  },
  {
    label: 'Identity and access management',
    claude: 'SCIM-synced user groups, role-based feature access, custom roles, per-user spend caps, and managed Claude Code policies. Admin API user management went GA on August 19, 2026.',
    other: 'SSO, SCIM, and workspace roles available. Mature, and the surfaces differ in detail.',
  },
  {
    label: 'Data residency',
    claude: '`inference_geo` pins where inference runs, per agent or per session, at a 1.1x pricing multiplier. Available on Claude 4.6 and later.',
    other: 'Azure data-zone deployments provide regional guarantees. Strong if you are already an Azure customer.',
  },
  {
    label: 'Where you can run it',
    claude: 'Claude API, Amazon Bedrock, Claude Platform on AWS, Google Cloud Vertex AI, Microsoft Foundry — including on Microsoft’s and Google’s own clouds. Self-hosted sandboxes for Managed Agents and self-hosted environments for Claude Code.',
    other: 'OpenAI API and Azure, with Codex on AWS Bedrock. Fewer independent surfaces, deeper Azure integration.',
  },
  {
    label: 'Third-party code you did not write',
    claude: 'Skill and plugin security scanning on Enterprise since August 6, 2026 — uploads and edits are checked for malicious content before they can run.',
    other: 'Review the equivalent control for whatever plugin or GPT surface you intend to enable. This is a real attack path and a common gap.',
  },
  {
    label: 'Cost governance',
    claude: 'Analytics dashboard by group and user, Analytics API for Datadog and CloudZero, model defaults and entitlements, spend threshold alerts, and hard per-session budgets on Managed Agents.',
    other: 'Usage dashboards and org-level limits. Verify whether a hard cap exists or only an alert — the difference matters at the end of a quarter.',
  },
  {
    label: 'Model retirement track record',
    claude: 'Sonnet 4 and Opus 4 retired June 2026, Opus 4.1 August 2026. Fable 5 and Mythos 5 were suspended worldwide for nineteen days in June by government order. Deprecations are published in advance.',
    other: 'o3 scheduled for ChatGPT retirement August 2026; GPT-4.5 retired June 2026. Both vendors retire models on roughly annual cycles.',
  },
  {
    label: 'Corporate stability',
    claude: 'Series H, $65B raised at a $965B valuation (May 2026), confidential IPO filing.',
    other: 'Confidential S-1 filed June 2026.',
  },
]

export default function Page() {
  const ld = comparisonLd(TITLE, DESC, 'claude-vs-openai-for-enterprise')
  return (
    <ComparisonPage
      title={TITLE}
      otherLabel="OpenAI"
      otherAccent="#5B8DD9"
      pricingVendors={['Anthropic', 'OpenAI']}
      intro={[
        <p key="1">
          Enterprise selection is not a model comparison. By the time a deal reaches procurement,
          both vendors clear the capability bar and the decision turns on governance surfaces,
          auditability, deployment flexibility, and what happens when something goes wrong.
        </p>,
        <p key="2">
          Anthropic has shipped harder on the governance surface through 2026 — inference hooks,
          Compliance API coverage down to local sessions, plugin scanning, jurisdiction pinning. If
          your security review has previously rejected an AI vendor, that is the material difference.
          If your organisation runs on Azure, OpenAI’s integration depth may still outweigh it.
        </p>,
      ]}
      specs={SPECS}
      claims={[
        {
          source: 'Verifiable from release notes and vendor documentation',
          items: [
            'Anthropic shipped inference hooks (Aug 5), plugin security scanning (Aug 6), Compliance API coverage of local Cowork and Claude Code sessions (Aug 11), and Admin API user management GA (Aug 19) — all in 2026.',
            'Claude models run on the Claude API, Bedrock, Claude Platform on AWS, Google Cloud, and Microsoft Foundry.',
            'Three Claude models were retired or suspended in the first half of 2026.',
          ],
          caveat: 'The shipping cadence is a fact; whether it maps to your specific control requirements is not. Take this list to your security team as a starting question set, not as an answer.',
        },
        {
          source: 'What we deliberately are not claiming',
          items: [
            'That one vendor is more secure than the other.',
            'That either vendor’s certifications satisfy your regulator.',
            'That published controls behave as documented under your configuration.',
          ],
          caveat: 'Nobody outside your organisation can make those claims responsibly, and any comparison page that does is guessing. Security posture is a function of your configuration and your threat model, not the vendor’s feature list.',
        },
      ]}
      evalHeading="The procurement questions that actually settle it"
      evalIntro={
        <p>
          Run these before any technical evaluation. Two of them have ended vendor selections at
          organisations we have worked with, and both were answerable in week one rather than
          month four.
        </p>
      }
      evalSteps={[
        { bold: 'Can you block a prompt before the model sees it?', rest: 'If your DLP requirements need inline prevention rather than after-the-fact detection, ask both vendors this directly and get the answer in writing. It is the sharpest current differentiator.' },
        { bold: 'Can you retrieve a transcript of a session that ran on an employee’s laptop?', rest: 'Local sessions are the blind spot in most AI audit stories. Ask specifically about desktop and CLI sessions, not just the web app.' },
        { bold: 'What is the hard spend cap, and who can raise it?', rest: 'An alert is not a cap. Establish whether an unattended agent can run up an unbounded bill and what stops it.' },
        { bold: 'Where does inference physically run, and can you pin it?', rest: 'Get the mechanism and the price multiplier, not a general assurance about regions.' },
        { bold: 'What is the deprecation notice period, contractually?', rest: 'Both vendors retire models roughly annually. The question is not whether it will happen but how much warning you get and what your migration path costs. This belongs in the contract, not in a blog post.' },
        { bold: 'Run one real workload end to end, with security in the room.', rest: 'Not a demo. A workload with your actual data, your actual permissions, and the people who will have to sign off watching it. Most objections surface in the first hour of this and never in a slide deck.' },
      ]}
      evalFooter={
        <p>
          <Link href="/articles/getting-it-approval-for-claude" style={{ color: 'var(--accent)' }}>Getting IT approval</Link> covers
          the internal path, <Link href="/articles/claude-compliance-api" style={{ color: 'var(--accent)' }}>the Compliance API</Link> covers
          the audit surface in detail, and <Link href="/articles/when-your-ai-model-disappears" style={{ color: 'var(--accent)' }}>when your model disappears</Link> covers
          the deprecation risk you are underwriting either way.
        </p>
      }
      bottomLine={[
        {
          heading: 'Pick Claude',
          body: <>if governance is the binding constraint. Inference hooks, Compliance API coverage reaching local sessions, plugin scanning, jurisdiction pinning, and hard session budgets are a more developed control surface than the alternative in 2026, and the five deployment surfaces mean you are not underwriting a single cloud relationship.</>,
        },
        {
          heading: 'Pick OpenAI',
          body: <>if your organisation is deeply committed to Azure and the integration depth is worth more than the control-surface difference, or if your teams are already productive on the tooling and the switching cost is real. Familiarity is a legitimate procurement input, not a weak one.</>,
        },
        {
          heading: 'Plan for both, whichever you sign',
          body: <>Both vendors retired models in 2026, and one had two models suspended worldwide by government order for nineteen days. An abstraction layer over your model calls is a few days of work and it is the cheapest insurance available against a decision neither you nor your vendor controls.</>,
        },
      ]}
      related={[
        { href: '/articles/claude-compliance-api', label: 'The Compliance API', sub: 'What it retrieves and what it does not.' },
        { href: '/articles/claude-inference-hooks', label: 'Inference hooks', sub: 'Blocking a prompt before the model sees it.' },
        { href: '/articles/getting-it-approval-for-claude', label: 'Getting IT approval', sub: 'The internal path through a security review.' },
        { href: '/compare/claude-vs-gemini-for-business', label: 'Claude vs Gemini', sub: 'The third vendor in most enterprise shortlists.' },
      ]}
      {...ld}
    />
  )
}
