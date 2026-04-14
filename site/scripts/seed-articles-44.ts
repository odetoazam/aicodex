/**
 * Batch 44 — Templates and practical tools
 * 1. ai-usage-policy-template — actual policy template, not just framework
 *
 * Run: ./node_modules/.bin/tsx --env-file=.env.local scripts/seed-articles-44.ts
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
    termSlug: 'claude-plans',
    slug: 'ai-usage-policy-template',
    angle: 'process',
    title: 'AI usage policy template (copy, edit, send to legal)',
    excerpt: "A complete, one-page AI usage policy template for company-wide Claude deployments — with three variants: general company, professional services, and healthcare-adjacent. Fill in the bracketed fields and you have a policy ready for legal review.",
    readTime: 5,
    cluster: 'Business Strategy & ROI',
    body: `The article on [how to write an AI usage policy](/articles/ai-usage-policy-for-teams) covers the framework. This article is the template — something you can copy, fill in the brackets, and send to your legal team without starting from scratch.

Three variants below: a general company version, a professional services version (legal, consulting, financial advisory), and a healthcare-adjacent version. Use the one closest to your situation and have your legal team review it before finalizing.

---

## Template A: General company

**[Company Name] — AI Tool Usage Policy**
*Effective date: [Date] | Policy owner: [Name, Title] | Review date: [6 months from effective date]*

---

**Purpose**

This policy covers how team members may use Claude (Anthropic) and similar AI tools in their work. The goal is to enable effective use while protecting company and customer data.

**What you can use AI for (use freely)**

- Drafting, editing, and improving internal documents and communications
- Summarising information and research
- Brainstorming and generating options for your own review
- Reformatting, organizing, or restructuring data and text
- Preparing talking points, notes, or outlines

In all of the above, a human reviews and makes the final decision on what is used.

**What requires human review before sending or acting (use with approval)**

- External communications to customers, partners, or vendors
- Formal reports or documents that will be submitted, published, or shared outside the company
- Any content that will be attributed to [Company Name] or a specific employee

**What is not permitted without specific sign-off**

- Using AI to prepare legally binding documents or commitments
- Using AI to make or recommend HR decisions about individual employees
- Using AI to provide advice that would normally require professional licensure

For any of the above, contact [Name / Department] before proceeding.

**Data you must not share with AI tools**

- Personal data about employees or customers (names, contact details, ID numbers, salary, health information)
- Passwords, credentials, or security information
- Legally privileged communications
- Confidential financial information not intended for public disclosure
- Anything covered by NDA

**When Claude gets something wrong**

Report problems to [Slack channel / email]. Include what you asked, what Claude produced, and what was wrong. This helps us improve guidance and catch patterns.

**Questions**

Contact [Name] with questions about whether a specific use case is covered.

---

*Signed: [Authorized signature, title]*

---

## Template B: Professional services (legal, consulting, financial advisory)

**[Firm Name] — AI Tool Usage Policy**
*Effective date: [Date] | Policy owner: [Name, Title] | Review date: [6 months from effective date]*

---

**Purpose**

This policy covers use of Claude and similar AI tools by [Firm Name] staff. Given the nature of our client work, many standard uses require additional care. This policy clarifies where AI can help, where additional oversight is required, and where AI should not be used without explicit partner approval.

**Use freely (internal, non-client work)**

- Internal communications, summaries, and drafts
- Research and background information gathering
- Formatting and organizing your own notes
- Preparing internal documents not intended for client delivery

**Use with review (client-facing work)**

- First drafts of client deliverables — must be reviewed and substantially edited by the responsible professional before delivery
- Research memos — must be independently verified for accuracy before reliance
- Meeting preparation and follow-up summaries

In all cases: the professional responsible for the work is responsible for the output. AI does not reduce professional liability.

**Not without partner/supervisor approval**

- Any work where AI-generated content would be presented as the professional's independent analysis
- Advice that could constitute a legal, financial, or professional opinion
- Contracts, engagement letters, or binding client commitments
- Matters covered by client confidentiality agreements that restrict use of AI tools

For the above, obtain explicit approval from [partner/supervisor] and confirm with the client if required under your engagement letter.

**Data restrictions**

Do not share with AI tools:
- Client personal data
- Confidential client information
- Information subject to privilege
- Any information where your engagement letter restricts AI tool use

When in doubt: treat all client information as restricted unless you have confirmed otherwise.

**Professional responsibility**

AI tools do not alter your professional obligations. You remain responsible for the quality, accuracy, and professional judgment of your work product. If you would not sign your name to something Claude produced without reviewing it, do not send it.

**Questions**

Contact [Name] for guidance on specific situations.

---

*Signed: [Authorized signature, title]*

---

## Template C: Healthcare-adjacent (not a HIPAA compliance document)

*Note: If your organization handles PHI, work with your compliance and legal teams directly. This template is for organizations that handle health-related information but are not covered entities — e.g., health tech companies, wellness programs, health benefits administrators.*

**[Company Name] — AI Tool Usage Policy (Health Data Environments)**
*Effective date: [Date] | Policy owner: [Name, Title] | Review date: [6 months from effective date]*

---

**Purpose**

This policy covers AI tool use at [Company Name]. Given our handling of health-related data, additional restrictions apply beyond our general guidelines.

**Permitted use**

- Internal administrative work that does not involve health data
- Drafting non-PHI communications and documents
- Research and background information (publicly available information only)

**Requires explicit approval**

Any use case involving health-related data must be approved by [Name/Title] before use. This includes:
- Summaries or analyses of health records, claims, or outcomes data
- Patient or member communications
- Clinical documentation or care coordination tasks

**Never permitted**

- Sharing identifiable health information with any AI tool not covered under a signed BAA
- Using AI-generated content in clinical decision-making without licensed professional review
- Any use case your legal or compliance team has not reviewed

**If you are unsure**

Contact [Name] before using AI for any health-data adjacent task. "I was not sure" is not a defense — ask first.

---

*Signed: [Authorized signature, title]*

---

## How to use these templates

1. Pick the variant closest to your industry
2. Fill in all bracketed fields
3. Have your legal/compliance team review it — these are starting points, not legal opinions
4. Date it, sign it, and put it somewhere your team will find it (not a wiki nobody visits — your Slack pinned resources, a shared drive folder in every team's home, a page in your admin console)
5. Set a calendar reminder to review it in six months

The policy review cadence matters. AI tools change, your usage changes, and a policy that was accurate when you wrote it may be meaningfully wrong six months later. Build the review into your calendar when you publish it, not as a good intention.

---

*For the framework behind these templates, including the three-zone model and the five things every policy must cover, [see the usage policy guide](/articles/ai-usage-policy-for-teams). For data privacy specifics on Claude Enterprise, [see the admin security guide](/articles/claude-admin-security-privacy).*`,
  },
]

async function seed() {
  console.log('Seeding batch 44...\n')

  for (const article of ARTICLES) {
    const term = await getTermId(article.termSlug)
    if (!term) {
      console.error(`  ✗ Term not found: ${article.termSlug} (for ${article.slug})`)
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
      tier: 2,
      published: true,
    }, { onConflict: 'slug' })

    if (error) {
      console.error(`  ✗ ${article.slug}:`, error.message)
    } else {
      console.log(`  ✓ ${article.slug}`)
    }
  }

  console.log('\nDone.')
}

seed().then(() => process.exit(0))
