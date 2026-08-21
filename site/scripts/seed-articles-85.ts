import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const articles = [
  {
    slug: 'claude-cowork-adoption-metrics',
    angle: 'failure',
    title: 'Six metrics that tell you if Claude Cowork is actually working',
    excerpt: 'Most teams measure adoption by asking "is anyone using it?" That question misses everything that matters. Here are the six numbers that tell you whether your Cowork rollout is working — and what each one is hiding when it looks fine.',
    cluster: 'Business Strategy & ROI',
    readTime: 7,
    publishedAt: new Date('2026-06-17').toISOString(),
    body: `Most teams measure Claude Cowork adoption one way: they ask if people are using it. Sometimes they add a monthly active user count. Then they report "strong adoption" to leadership and move on.

Six months later, usage is flat. A few people rely on it. Most have quietly stopped. Nobody knows why.

The problem is the measurement, not the adoption. "Is anyone using it?" tells you nothing about whether it's working. These six metrics do.

---

## Why the standard measurement fails

Usage counts tell you that someone opened Cowork. They don't tell you whether Claude actually helped them do something useful.

The difference matters because adoption curves are deceptive. People try new tools in week one. They keep using tools that make their work faster. Usage at week one looks the same as usage at week twelve — but the underlying reality is completely different.

The metrics below track depth of use, cost efficiency, and reliability — the three things that determine whether Claude becomes part of how your team works or gets quietly abandoned.

---

## The six metrics

### 1. Weekly active users (WAU) — the headline number

**What it is:** The number of people who sent at least one message to Claude in a given week.

**What it tells you:** Whether adoption is growing, holding, or dying. WAU is your OKR number — the one worth tracking weekly and putting in a Slack update.

**What to watch for:** A plateau is expected after the initial launch surge. What you're looking for is the *floor*: the number of people who use Claude every week without prompting. If that floor is above 30% of your licensed users, adoption is real. Below 20%, you have a retention problem, not an awareness problem.

**Warning sign:** WAU looks healthy but the same three people are driving it. Pull usage by user — if your top five users account for more than half of all sessions, you don't have team adoption, you have individual champions holding up the numbers.

---

### 2. Session depth — how agentic is the use?

**What it is:** The average number of tool calls per user prompt in a session. In practice: how many times did Claude call an MCP tool, run a search, or take an action, per question a user asked?

**What it tells you:** Whether people are using Claude as a search box or as an agent.

Low session depth (under 1.5 tool calls per prompt) means users are asking Claude questions and getting text back. Medium depth (2–5) means Claude is reaching into connectors to get real data. High depth (5+) means agentic chains are running — Claude is doing multiple things per request.

**What to watch for:** Most rollouts start with low session depth. That's fine — users learn. What you want to see is the average climbing over 90 days as users discover skills and connectors.

**Warning sign:** Session depth is high for one or two people and near-zero for everyone else. That's the "champion bottleneck" — a small group has figured out the agentic patterns and nobody else has. It means your onboarding isn't transferring the skill, just the access.

---

### 3. Cache hit rate — the cost efficiency signal

**What it is:** The percentage of input tokens that are served from cache rather than processed fresh. If your system prompt is 2,000 tokens and your cache hit rate is 70%, you're only paying to process 30% of those tokens on each request.

**What it tells you:** Whether you've configured Claude efficiently for your team. This is the single biggest cost lever most operators don't touch.

**What to watch for:** A healthy cache hit rate for a well-configured Cowork deployment is above 60%. Below 30% usually means your system prompts are inconsistent (slightly different for each user, or changing frequently) or you're not using Projects correctly.

**Warning sign:** You're spending 3x what you expected on tokens but usage seems modest. Almost always a cache hit rate problem. Fix the system prompt consistency and costs drop dramatically.

*Practical check: your Claude Admin console shows token consumption. If the input token count is high relative to the number of prompts, caching isn't working.*

---

### 4. MCP tool success rate — the reliability signal

**What it is:** For each MCP connector your team uses, the percentage of tool calls that succeed versus fail.

**What it tells you:** Whether Claude can actually do the things users are asking it to do. A tool with a 60% success rate means roughly half of Claude's attempts to use that tool silently fail.

**What to watch for:** Tool failures are invisible to users. Claude doesn't say "HubSpot returned an error." It just produces a less complete answer, or hallucinates data it couldn't retrieve. Users blame Claude. They don't know a connector is broken.

Target success rate for any MCP tool you're relying on: above 90%. Below 80%, treat it as broken and investigate.

**Warning sign:** Users stop asking Claude about a specific topic — CRM data, billing, support tickets — even though you set up a connector for exactly that. Check the tool success rate for that connector. It's probably the problem.

---

### 5. Skills used vs. skills built — the inventory trap

**What it is:** The ratio of skills that are actively invoked to skills that are registered in your library.

**What it tells you:** Whether you're building a real skill library or a graveyard.

Most teams build skills when they have a good idea. They register them, announce them, and move on. Three months later, two or three skills are used constantly. The rest were invoked once and forgotten.

**What to watch for:** Track not just total invocations, but last-used-at per skill. Any skill that hasn't been used in 30 days is a candidate for retirement or redesign.

**Warning sign:** Your skill count is growing but your per-skill invocation count is falling. You're building skills faster than you're validating them. Slow down and fix the existing library before adding more.

---

### 6. Cost per active user — the ROI signal

**What it is:** Your total monthly Claude spend divided by your monthly active users.

**What it tells you:** Whether you're getting value relative to what you're paying. And whether the cost is concentrated or spread.

**What to watch for:** A reasonable cost per active user for a well-configured Cowork deployment is $10–40/month per person, depending on role and use intensity. Analysts and operators using Claude for data work will be higher. If you're at $80+ per active user, something is misconfigured — usually cache hit rate or a missing scope limit on a connector.

**Warning sign:** Cost per user is rising but active users are flat. That means a small group is driving high consumption, often because of a skills design problem — a skill that makes too many tool calls per invocation, or a connector that fetches far more data than needed.

---

## The 20-minute adoption check

You don't need custom telemetry to answer these questions. Here's the quick version:

**From your Claude Admin console:**
- Pull token consumption for the last 30 days. Divide by number of active users. That's your cost per active user.
- Look at the input vs. cache_read token split. If input tokens dominate, cache hit rate is low.

**From conversation with users:**
- Ask three people who haven't used Cowork this week why. "Didn't think of it" is a discovery problem. "Tried it, didn't work" is a tool or skill problem. "Not sure what to ask" is an onboarding problem.

**From your skill library:**
- List every skill. Mark each one as Used This Week, Used This Month, or Not Used Recently. Retire or rebuild the Not Used Recently ones before building new skills.

**The one question worth asking your top users:**
"What do you use Claude for every day?" Their answer is your onboarding template. Whatever they've figured out, the rest of your team hasn't yet.

---

## Try this today

Pick one metric from this list — just one — and check it this week. If you don't have telemetry set up, start with cost per active user (admin console) and the skills audit (your own list). Those two require no infrastructure and take under an hour.

Then ask: what does this number suggest about where the adoption problem actually is? The answer tells you which lever to pull next.`,
  },
  {
    slug: 'cowork-skills-graveyard',
    angle: 'failure',
    title: 'Why the skills you build stop getting used',
    excerpt: 'Most teams build more skills than they use. The inventory grows; the invocation count per skill falls. Here\'s why skills die after the first week — and what to do instead.',
    cluster: 'Business Strategy & ROI',
    readTime: 6,
    publishedAt: new Date('2026-06-17').toISOString(),
    body: `There's a pattern in almost every Claude Cowork rollout that's been running for more than two months.

The team has a skill library. Some skills in that library are used constantly — people run them every day, they've become part of how work gets done. Most skills in that library haven't been touched in weeks. Nobody remembers they exist.

This is the skills graveyard problem. It's not a failure of ambition. It's a failure of design, discovery, and timing.

---

## What the data shows

When you query your skill invocation logs and sort by last_used_at, you almost always see the same shape: 20% of your skills account for 80% of all invocations. The rest sit there.

Skills built but never used fall into a predictable pattern. They were created when someone had a good idea. They were announced once — usually in Slack, usually on the day they launched. They got used for the first two weeks while the idea was fresh. Then something else came up, the novelty wore off, and the skill stopped appearing in anyone's working memory.

This isn't unique to Claude skills. It happens with Notion templates, Slack workflows, Zapier automations, and every other "build it once, use it forever" tool. The difference with Claude skills is that the failure is invisible. A broken Zapier automation sends you an error. An unused skill just sits there silently, making your skill library look bigger than it is.

---

## The three reasons skills die

### 1. Too narrow a use case

The skill was built for a task that comes up once a month, not once a day. When the task finally arrives, nobody remembers the skill exists. They do it manually.

Skills with daily or weekly natural recurrence survive. Skills built for monthly or quarterly tasks usually don't — not because they're bad skills, but because they're not embedded in a habit.

The fix: before building a skill, ask "how often will someone naturally reach for this?" If the honest answer is "once a month," consider whether a documented prompt template in Notion serves the same purpose with less maintenance overhead.

### 2. Discovery failure

The skill exists but people don't think to use it at the moment they need it. Cowork's skill surface is a slash command — you have to know the skill name to invoke it. If someone wasn't in the meeting where the skill was announced, they may not know it exists.

This is different from the skill being bad. The skill might be excellent. The problem is that people can't recall it at the moment they need it.

The fix: onboarding shouldn't list skills — it should *invoke* them. Instead of "here are the skills available to you," give new users a prompt: "Try typing /[skill-name] right now, with your most recent customer call in mind." The skill only exists in someone's workflow once they've run it and seen what it does.

### 3. The skill is too slow or too complicated

A skill that takes 45 seconds to run and produces a dense report doesn't get used, even if the output is valuable. People will reach for it when they have time. They rarely have time.

The best-used skills produce a result in under 15 seconds and surface one clear thing. The weekly briefing that gives you five bullet points beats the comprehensive analysis that gives you a 12-section report.

---

## The audit

Run this quarterly. It takes about an hour and it's more valuable than building three new skills.

**Step 1: Pull invocation data**

For each skill in your library, find: total lifetime invocations, number of distinct users who've invoked it, and last invoked date.

If you don't have telemetry yet, you can do this by asking your team directly: "Which Cowork skills do you use regularly?" The ones that come up without prompting are the keepers. The ones nobody mentions need investigation.

**Step 2: Classify each skill**

- **Active:** Used by multiple people in the last 30 days. Keep as is.
- **Dormant:** Used occasionally but not regularly. Investigate why — is it a timing problem, a discovery problem, or is the use case genuinely infrequent?
- **Dead:** Not used in 60+ days. Retire it or redesign it. Don't leave it in the library.

**Step 3: Retire before building**

For every skill you want to add, retire one dead skill first. This keeps the library small enough to be discoverable. A skill library with 30 entries is unusable. A library with 8 entries, all actively used, is powerful.

---

## What makes a skill stick

The skills that survive have four things in common:

**1. They solve a daily problem.** Not a quarterly one. The person using them knows exactly when to reach for them because they hit the trigger every day.

**2. They produce something shareable.** A morning briefing someone can paste into Slack. A customer summary someone can paste into a handoff note. A draft someone can send. Output that immediately goes somewhere is output people remember they got.

**3. They were introduced through use, not announcement.** The first time someone used the skill, another person walked them through it. Or they were onboarded to Cowork via a skill invocation, not a doc.

**4. They fail fast and informatively.** When a skill can't complete its task — because a connector is down, or the data isn't there — it says so clearly instead of producing a half-baked result. Skills that fail silently erode trust faster than almost anything else.

---

## The skill you should build next

Before you add anything new to your library, answer this question: "What's the one thing my highest-usage person does manually every week that Claude could handle?"

That person has already proven the workflow is real and recurring. They've already solved the discovery problem (they'd use the skill because they do the task every week). The only design work is turning their current manual process into a skill that runs in under 15 seconds.

Start there. Then audit what you have. Then — and only then — build something new.

---

## Try this today

Open your Cowork and run your most-used skill. If you don't know what your most-used skill is without checking, that's the answer — you have a discovery problem that training won't fix, because you manage the system and even you can't recall it.

The fix is almost never "build another skill." The fix is usually "make the existing skills harder to forget."`,
  },
]

async function main() {
  console.log(`Seeding batch 85 — ${articles.length} articles\n`)

  for (const a of articles) {
    const payload = {
      slug:      a.slug,
      published: true,
      angle:     a.angle,
      title:     a.title,
      excerpt:   a.excerpt,
      cluster:   a.cluster,
      read_time: a.readTime,
      body:      a.body,
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

main()
