import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const SLUG = 'after-your-manager-approves-claude'

const SKILL_MODULE = `

---

**Try it now — write your system prompt**

**Scenario:** You manage a 4-person customer success team at a B2B SaaS company. You have 20 minutes before the working session starts.

**Task:** Using the template above, write the system prompt for your team Project. Don't wait for it to be perfect — write a version that's accurate.

**What good looks like:**
\`\`\`
You are assisting the Customer Success team at Acme Software.

Context: We manage post-sale relationships for 150 B2B clients, primarily SMBs in the logistics industry. Our main responsibilities are onboarding new clients, handling support escalations, and driving renewals. Our stakeholders are the account owners at each client company.

Our terminology: MRR (monthly recurring revenue), QBR (quarterly business review), churn risk (client flagged as likely to cancel), NPS (net promoter score), CSP (customer success plan).

When helping with written communication, match our company's tone: professional but conversational — not formal, not casual.

Do not: make up client names, usage data, or contract details you don't have. If I ask you to help with a specific client, I'll provide the relevant context in the message.
\`\`\`

**Common mistake:** Writing "We do customer success" in the context section instead of specifying who your clients are, what stage of the relationship you own, and what you're measured on. Claude uses context to calibrate. Vague context produces generic answers — which is what makes people give up on it after the first session.

---`

async function run() {
  const { data, error } = await sb
    .from('articles')
    .select('body')
    .eq('slug', SLUG)
    .single()

  if (error || !data) {
    console.error('fetch error', error)
    process.exit(1)
  }

  const MARKER = '\n\n**2. One concrete use case for the first session.**'
  if (!data.body.includes(MARKER)) {
    console.error('Marker not found — check article body')
    process.exit(1)
  }

  const newBody = data.body.replace(MARKER, SKILL_MODULE + MARKER)

  const { error: updateError } = await sb
    .from('articles')
    .update({ body: newBody })
    .eq('slug', SLUG)

  if (updateError) {
    console.error('update error', updateError)
    process.exit(1)
  }

  console.log('Done — skill module inserted into', SLUG)
}

run()
