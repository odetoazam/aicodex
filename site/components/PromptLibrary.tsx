'use client'

import { useState, useCallback } from 'react'

type Category = 'summarize' | 'draft' | 'research' | 'analyze' | 'extract' | 'review' | 'plan' | 'compare'

type Prompt = {
  id: string
  title: string
  category: Category
  description: string
  prompt: string
  whenToUse: string
  tips: string
}

const CATEGORIES: { id: Category; label: string; icon: string; color: string }[] = [
  { id: 'summarize', label: 'Summarize',  icon: '◈', color: '#D4845A' },
  { id: 'draft',     label: 'Draft',      icon: '◧', color: '#5B8DD9' },
  { id: 'research',  label: 'Research',   icon: '◇', color: '#4CAF7D' },
  { id: 'analyze',   label: 'Analyze',    icon: '◐', color: '#7B8FD4' },
  { id: 'extract',   label: 'Extract',    icon: '▤', color: '#D4A45A' },
  { id: 'review',    label: 'Review',     icon: '◎', color: '#D45A7B' },
  { id: 'plan',      label: 'Plan',       icon: '◬', color: '#5AAFD4' },
  { id: 'compare',   label: 'Compare',    icon: '◫', color: '#9B7BD4' },
]

const PROMPTS: Prompt[] = [
  // ── Summarize ─────────────────────────────────────────────────────────
  {
    id: 'summarize-document',
    title: 'Summarize a document',
    category: 'summarize',
    description: 'Condenses a long document into key points without losing what matters.',
    prompt: `Read the following document carefully. Then provide:

1. A one-paragraph executive summary (3-4 sentences max)
2. The 5 most important points, each in one sentence
3. Any action items or decisions mentioned
4. Anything that seems unclear or contradictory

Be specific — use names, numbers, and dates from the document. Don't generalize.

[Paste your document here]`,
    whenToUse: 'When you receive a long report, proposal, or memo and need the key takeaways fast.',
    tips: 'Works best when you paste the actual document rather than describing it. For PDFs, upload the file directly.',
  },
  {
    id: 'summarize-meeting',
    title: 'Summarize meeting notes',
    category: 'summarize',
    description: 'Turns messy meeting notes or a transcript into structured action items.',
    prompt: `Here are notes from a meeting. Turn them into a structured summary:

1. **Meeting purpose** — one sentence on what this meeting was about
2. **Key decisions made** — list each decision and who made it
3. **Action items** — for each: what needs to be done, who owns it, and any deadline mentioned
4. **Open questions** — anything raised but not resolved
5. **Next steps** — what happens next and when

Keep it factual. If something is unclear from the notes, say so rather than guessing.

[Paste meeting notes or transcript here]`,
    whenToUse: 'After any meeting where you took rough notes or have a transcript. Especially useful for catching commitments you might miss.',
    tips: 'If you have a Zoom/Teams transcript, paste the whole thing — Claude handles messy transcripts well.',
  },
  {
    id: 'summarize-email-thread',
    title: 'Summarize an email thread',
    category: 'summarize',
    description: 'Catches you up on a long email chain in 30 seconds.',
    prompt: `Read this email thread from oldest to newest. Tell me:

1. **What started this** — what's the original question or issue?
2. **What's been agreed** — any decisions or commitments made so far
3. **What's unresolved** — what still needs a decision or response
4. **What I need to do** — if I need to reply, what should I address?

Be brief. Use the actual names of the people involved.

[Paste email thread here]`,
    whenToUse: 'When you\'re cc\'d on a 15-message email chain and need to catch up without reading every reply.',
    tips: 'Include the full thread with headers (From, To, Date) if possible — it helps Claude track who said what.',
  },

  // ── Draft ─────────────────────────────────────────────────────────────
  {
    id: 'draft-email-reply',
    title: 'Draft an email reply',
    category: 'draft',
    description: 'Writes a professional email response based on what you want to say.',
    prompt: `I need to reply to this email. Here's the original:

[Paste the email you're replying to]

Here's what I want to say (rough notes, doesn't need to be polished):

[Your rough points here]

Draft a reply that:
- Is professional but not stiff
- Is concise (under 150 words unless the topic requires more)
- Addresses every point raised in the original
- Ends with a clear next step

Don't add filler phrases like "I hope this email finds you well."`,
    whenToUse: 'When you know what you want to say but don\'t want to spend 15 minutes wordsmithing it.',
    tips: 'The more specific your rough notes, the better the draft. "Say yes but push the timeline to next month" is better than "reply positively."',
  },
  {
    id: 'draft-slack-message',
    title: 'Draft a Slack message',
    category: 'draft',
    description: 'Writes a clear, well-structured Slack message for team communication.',
    prompt: `I need to post a message in Slack to [channel/person]. Here's the context:

[Describe the situation]

What I need to communicate:
[Your key points]

Draft a Slack message that:
- Gets to the point in the first line
- Uses bullet points if there are multiple items
- Is casual but clear (this is Slack, not email)
- Includes any @mentions or action items at the end
- Is scannable — someone should get the gist in 5 seconds`,
    whenToUse: 'When you need to announce something, ask for input, or share an update and want it to be clear the first time.',
    tips: 'Specify the channel type (leadership, engineering, general) — tone should match the audience.',
  },
  {
    id: 'draft-proposal',
    title: 'Draft a one-page proposal',
    category: 'draft',
    description: 'Creates a concise proposal document from your rough thinking.',
    prompt: `I need a one-page proposal for the following:

**What I'm proposing:** [Describe the idea]
**Who it's for:** [The decision-maker or audience]
**Why now:** [What prompted this]
**What I know about constraints:** [Budget, timeline, team size, etc.]

Write a proposal that includes:
1. **Problem** — what's the current pain (2-3 sentences)
2. **Proposed solution** — what to do (be specific)
3. **Expected outcome** — what success looks like (with numbers if possible)
4. **What it costs** — time, money, or resources needed
5. **Next step** — one clear action to move forward

Keep it under 400 words. The reader should be able to decide yes/no in 3 minutes.`,
    whenToUse: 'When you need to pitch an idea internally and want a clean, compelling one-pager.',
    tips: 'Include any specific numbers you have (budget, timeline, team size) — proposals with specifics get approved faster than vague ones.',
  },

  // ── Research ──────────────────────────────────────────────────────────
  {
    id: 'research-topic',
    title: 'Research a topic from scratch',
    category: 'research',
    description: 'Gives you a structured overview of any topic you need to get smart on fast.',
    prompt: `I need to get up to speed on [topic]. Give me a structured overview:

1. **What it is** — plain-English explanation (assume I know nothing)
2. **Why it matters** — why should someone in [my role/industry] care?
3. **Key concepts** — the 5 most important things to understand, each in 2-3 sentences
4. **Common misconceptions** — what do people usually get wrong about this?
5. **What to read next** — 3 specific things I should look into to go deeper

Be direct. Don't pad with caveats. If something is genuinely uncertain or debated, say so.`,
    whenToUse: 'When you\'re walking into a meeting about something you don\'t fully understand, or starting work in a new area.',
    tips: 'Replace [my role/industry] with your actual role — "product manager at a SaaS company" gets better answers than just "professional."',
  },
  {
    id: 'research-competitive',
    title: 'Competitive landscape overview',
    category: 'research',
    description: 'Maps out the competitive landscape for a product, market, or approach.',
    prompt: `I need a competitive landscape overview for [market/product area].

For each major player:
1. **Name and what they do** (one sentence)
2. **Target customer** — who are they built for?
3. **Pricing** — what does it cost? (ballpark is fine)
4. **Strengths** — what are they genuinely good at?
5. **Weaknesses** — where do they fall short?

Then add:
- **Trends** — what direction is this market moving?
- **Gaps** — what's nobody doing well yet?
- **My takeaway** — if I were entering this market, where would I position?

Use web search if you need current information. Cite sources where possible.`,
    whenToUse: 'Before making a build-vs-buy decision, entering a new market, or preparing a strategy presentation.',
    tips: 'Use this with Claude\'s web search turned on for the most current pricing and feature data.',
  },

  // ── Analyze ───────────────────────────────────────────────────────────
  {
    id: 'analyze-data',
    title: 'Analyze a dataset',
    category: 'analyze',
    description: 'Finds patterns, outliers, and insights in your data without you writing formulas.',
    prompt: `Here's a dataset I need help analyzing:

[Paste your data — CSV, table, or describe the spreadsheet]

Tell me:
1. **Summary stats** — totals, averages, ranges for the key columns
2. **Patterns** — any trends over time, correlations between columns, or clusters
3. **Outliers** — anything that looks unusual or doesn't fit the pattern
4. **Top and bottom performers** — the best and worst rows by [metric]
5. **So what?** — what should I actually do with this information?

Show your work — I want to see the numbers, not just conclusions.`,
    whenToUse: 'When you have a spreadsheet export and want insights without opening Excel. Works with CSV data, pasted tables, or uploaded files.',
    tips: 'For best results, upload the actual file (CSV or Excel) rather than pasting. If pasting, include column headers.',
  },
  {
    id: 'analyze-decision',
    title: 'Decision analysis',
    category: 'analyze',
    description: 'Structures a complex decision by mapping out options, tradeoffs, and risks.',
    prompt: `I need to make a decision and I want to think it through properly.

**The decision:** [What are you choosing between?]
**Context:** [What's the situation? What constraints exist?]
**What I care about most:** [Speed? Cost? Quality? Risk? Team morale?]

For each option:
1. **What happens if we do this** — realistic best case
2. **What could go wrong** — realistic worst case
3. **What we give up** — the tradeoffs
4. **Reversibility** — how hard is it to undo this decision?

Then give me:
- **Your recommendation** — what would you do and why?
- **What I should validate before deciding** — what assumption, if wrong, would change the answer?

Be direct. I want your actual opinion, not a balanced "it depends."`,
    whenToUse: 'When facing a significant decision with multiple options and you want to pressure-test your thinking before committing.',
    tips: 'Turn on Extended Thinking for this one — Claude does much better on complex tradeoff analysis when it can reason step-by-step.',
  },

  // ── Extract ───────────────────────────────────────────────────────────
  {
    id: 'extract-key-info',
    title: 'Extract key information from a document',
    category: 'extract',
    description: 'Pulls out specific data points from contracts, reports, or dense documents.',
    prompt: `Read this document and extract the following information:

[List the specific things you need — for example:]
- All dates and deadlines mentioned
- All dollar amounts and who pays what
- Names and roles of people mentioned
- Any obligations or commitments
- Any conditions or contingencies

Format the output as a structured list. If something isn't explicitly stated in the document, say "not specified" — don't infer.

[Paste document here]`,
    whenToUse: 'When reviewing contracts, legal docs, policy documents, or any dense text where you need specific facts pulled out.',
    tips: 'Be specific about what you need extracted. "All the important stuff" gives worse results than "all dates, dollar amounts, and obligations."',
  },
  {
    id: 'extract-action-items',
    title: 'Extract action items from any text',
    category: 'extract',
    description: 'Finds every commitment, task, and follow-up buried in long text.',
    prompt: `Read the following text and find every action item, commitment, or follow-up. For each one:

- **What** needs to be done (specific, not vague)
- **Who** is responsible (name the person if mentioned)
- **When** it's due (date/deadline if mentioned, or "no deadline stated")
- **Status** — is it done, in progress, or not started?

Group them by person if possible. If a commitment is vague ("we should look into that"), still include it but flag it as "vague — needs clarification."

[Paste text here — meeting notes, email thread, Slack conversation, document]`,
    whenToUse: 'After meetings, long Slack threads, or email chains where commitments were made but nobody wrote them down cleanly.',
    tips: 'This works on any text format — meeting notes, email threads, Slack exports, even voice transcripts.',
  },

  // ── Review ────────────────────────────────────────────────────────────
  {
    id: 'review-writing',
    title: 'Review and improve writing',
    category: 'review',
    description: 'Gives you specific, actionable feedback on a piece of writing.',
    prompt: `Review the following piece of writing. I want honest feedback, not compliments.

**What this is for:** [Blog post / email / proposal / internal doc / etc.]
**Target audience:** [Who will read this?]
**What I'm most worried about:** [Tone? Clarity? Length? Missing something?]

Give me:
1. **Overall impression** — does it work? (2 sentences)
2. **What's strong** — specific parts that are effective
3. **What's weak** — specific parts that need work, and why
4. **Line-level edits** — 3-5 specific sentences or phrases to rewrite (show the before and after)
5. **Structure** — is anything in the wrong order or missing?

Don't rewrite the whole thing. Help me see what to fix so I can improve it myself.

[Paste your writing here]`,
    whenToUse: 'Before sending important writing — proposals, blog posts, client communications, presentations.',
    tips: 'Including your target audience and what you\'re worried about dramatically improves the quality of feedback.',
  },
  {
    id: 'review-process',
    title: 'Review a process or workflow',
    category: 'review',
    description: 'Pressure-tests a business process for gaps, inefficiencies, and risks.',
    prompt: `Here's a process my team follows. I want you to review it for problems.

**The process:**
[Describe the step-by-step workflow]

**What it's supposed to achieve:** [The goal]
**How often it runs:** [Daily / weekly / per-project / etc.]
**Known pain points:** [What already frustrates people about it?]

Tell me:
1. **Bottlenecks** — where does this process slow down or depend on one person?
2. **Failure points** — where is it most likely to break?
3. **Redundancies** — is anyone doing work that doesn't need to happen?
4. **Missing steps** — what's not here that should be?
5. **Quick wins** — what one change would make the biggest difference?

Be blunt. "This looks fine" is not useful feedback.`,
    whenToUse: 'When a workflow feels inefficient but you can\'t pinpoint why, or before formalizing a process.',
    tips: 'Include the actual steps, not a summary. "Step 3: Sarah reviews in Notion and approves via Slack" is better than "manager approval."',
  },

  // ── Plan ──────────────────────────────────────────────────────────────
  {
    id: 'plan-project',
    title: 'Create a project plan',
    category: 'plan',
    description: 'Turns a vague idea into a structured plan with milestones and owners.',
    prompt: `I need a project plan for the following:

**What we're doing:** [Describe the project]
**Timeline:** [When does it need to be done?]
**Team:** [Who's available? What are their roles?]
**Constraints:** [Budget, dependencies, risks]

Create a plan that includes:
1. **Goal** — what "done" looks like (specific, measurable)
2. **Phases** — break it into 3-5 phases with clear deliverables per phase
3. **Key milestones** — the 4-5 dates that matter most
4. **Dependencies** — what has to happen before something else can start
5. **Risks** — what's most likely to go wrong, and what's the mitigation
6. **First week** — specifically what should happen in the first 5 days

Keep it practical. I want something I can share with my team on Monday, not a 20-page document.`,
    whenToUse: 'When you\'ve been told to "figure out the plan" for a new initiative and need a structured starting point.',
    tips: 'Include team members\' actual names and roles — Claude will assign tasks to specific people rather than generic roles.',
  },
  {
    id: 'plan-agenda',
    title: 'Create a meeting agenda',
    category: 'plan',
    description: 'Designs a focused meeting agenda that respects everyone\'s time.',
    prompt: `I need to run a meeting. Help me create an agenda.

**Purpose:** [Why are we meeting?]
**Attendees:** [Who's in the room and their roles]
**Time:** [How long is the meeting?]
**What needs to happen:** [Decisions needed, updates to share, problems to solve]

Create an agenda with:
- **Time blocks** for each item (total should equal meeting duration)
- **Owner** for each agenda item
- **Goal** for each item (decision, input, update, or brainstorm)
- A **pre-read** section if anything should be reviewed before the meeting
- **Last 5 minutes** reserved for action items and next steps

Design it so the meeting could end 10 minutes early if everything goes well.`,
    whenToUse: 'Before any meeting with 3+ people, especially recurring meetings that tend to go off track.',
    tips: 'Including the meeting duration forces Claude to make hard tradeoffs about what actually fits.',
  },

  // ── Compare ───────────────────────────────────────────────────────────
  {
    id: 'compare-options',
    title: 'Compare options side by side',
    category: 'compare',
    description: 'Creates a structured comparison of tools, vendors, approaches, or products.',
    prompt: `I need to compare these options:

**Option A:** [Name and brief description]
**Option B:** [Name and brief description]
**Option C:** [Name and brief description, if applicable]

Compare them on:
[List your criteria — e.g., cost, ease of setup, scalability, team fit, long-term risk]

For each option, score it on each criterion (Strong / Adequate / Weak) and explain why in one sentence.

Then give me:
1. **Summary table** — options as columns, criteria as rows
2. **Your recommendation** — which one and why
3. **When you'd pick a different one** — under what circumstances does the runner-up win?

Use web search if you need current pricing or feature data.`,
    whenToUse: 'When evaluating tools, vendors, job candidates, approaches, or any decision with multiple options and criteria.',
    tips: 'Name your specific criteria rather than asking Claude to choose them. Your criteria reflect what actually matters to your team.',
  },
  {
    id: 'compare-before-after',
    title: 'Before/after analysis',
    category: 'compare',
    description: 'Documents what changed and whether the change was worth it.',
    prompt: `I want to compare a before-and-after for something we changed.

**What changed:** [Describe the change — new tool, new process, reorganization, etc.]
**When it changed:** [Timeline]
**Before:** [How things worked before — be specific]
**After:** [How things work now — be specific]

Analyze:
1. **What got better** — specific improvements with evidence
2. **What got worse** — honest about downsides
3. **What's the same** — things that didn't change (this is useful to note)
4. **Net assessment** — was the change worth it?
5. **What to adjust** — if we keep the change, what should we tweak?

Don't sugarcoat. A balanced assessment is more useful than a positive one.`,
    whenToUse: 'When reviewing the impact of a change — new tool adoption, process update, team restructuring, AI implementation.',
    tips: 'Include specific metrics if you have them (response time, cost, satisfaction scores). Claude will work with hard data if you provide it.',
  },
]

export default function PromptLibrary() {
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [openIds, setOpenIds] = useState<Set<string>>(new Set())

  const filtered = activeCategory === 'all'
    ? PROMPTS
    : PROMPTS.filter(p => p.category === activeCategory)

  const copyPrompt = useCallback(async (id: string, text: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }, [])

  function togglePrompt(id: string) {
    setOpenIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function countForCategory(cat: Category | 'all') {
    if (cat === 'all') return PROMPTS.length
    return PROMPTS.filter(p => p.category === cat).length
  }

  return (
    <>
      {/* Category filter */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' as const }}>
          <button
            onClick={() => setActiveCategory('all')}
            style={{
              fontFamily: 'var(--font-sans)', fontSize: '13px',
              fontWeight: activeCategory === 'all' ? 600 : 400,
              color: activeCategory === 'all' ? 'var(--text-primary)' : 'var(--text-muted)',
              background: activeCategory === 'all' ? 'var(--bg-subtle)' : 'none',
              border: '1px solid',
              borderColor: activeCategory === 'all' ? 'var(--border-base)' : 'var(--border-muted)',
              borderRadius: '6px', padding: '6px 14px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px',
              transition: 'all 0.15s ease',
            }}
          >
            All
            <span style={{
              fontSize: '11px', color: 'var(--text-muted)',
              background: 'var(--bg-subtle)', border: '1px solid var(--border-muted)',
              borderRadius: '4px', padding: '0 5px', lineHeight: '18px',
            }}>
              {PROMPTS.length}
            </span>
          </button>
          {CATEGORIES.map(cat => {
            const isActive = cat.id === activeCategory
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  fontFamily: 'var(--font-sans)', fontSize: '13px',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? cat.color : 'var(--text-muted)',
                  background: isActive ? `${cat.color}10` : 'none',
                  border: '1px solid',
                  borderColor: isActive ? cat.color : 'var(--border-muted)',
                  borderRadius: '6px', padding: '6px 14px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '6px',
                  transition: 'all 0.15s ease',
                }}
              >
                <span style={{ fontSize: '12px' }}>{cat.icon}</span>
                {cat.label}
                <span style={{
                  fontSize: '11px', color: isActive ? cat.color : 'var(--text-muted)',
                  background: isActive ? `${cat.color}15` : 'var(--bg-subtle)',
                  border: '1px solid var(--border-muted)',
                  borderRadius: '4px', padding: '0 5px', lineHeight: '18px',
                }}>
                  {countForCategory(cat.id)}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Prompt cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {filtered.map(prompt => {
          const cat = CATEGORIES.find(c => c.id === prompt.category)!
          const isOpen = openIds.has(prompt.id)
          const isCopied = copiedId === prompt.id

          return (
            <div key={prompt.id} style={{
              borderRadius: '10px',
              border: '1px solid var(--border-base)',
              borderLeft: `3px solid ${cat.color}`,
              background: 'var(--bg-surface)',
              overflow: 'hidden',
            }}>
              {/* Header — click to expand */}
              <button
                onClick={() => togglePrompt(prompt.id)}
                style={{
                  width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                  padding: '14px 18px',
                  display: 'flex', alignItems: 'center', gap: '12px',
                  textAlign: 'left' as const,
                }}
              >
                <span style={{ fontSize: '16px', color: cat.color, flexShrink: 0 }}>{cat.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {prompt.title}
                  </span>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)', marginLeft: '10px' }}>
                    {prompt.description}
                  </span>
                </div>
                <span style={{
                  fontFamily: 'var(--font-sans)', fontSize: '10px', fontWeight: 600,
                  color: cat.color, background: `${cat.color}12`,
                  padding: '2px 8px', borderRadius: '4px',
                  letterSpacing: '0.05em', textTransform: 'uppercase' as const,
                  flexShrink: 0,
                }}>
                  {cat.label}
                </span>
                <span style={{
                  color: 'var(--text-muted)', fontSize: '12px', flexShrink: 0,
                  transition: 'transform 0.2s ease',
                  display: 'inline-block',
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                }}>
                  ▾
                </span>
              </button>

              {/* Expanded content */}
              {isOpen && (
                <div style={{ padding: '0 18px 18px', borderTop: '1px solid var(--border-muted)' }}>
                  {/* The prompt itself */}
                  <div style={{
                    marginTop: '16px', marginBottom: '16px',
                    position: 'relative',
                    background: 'var(--bg-base)',
                    border: '1px solid var(--border-muted)',
                    borderRadius: '8px',
                    padding: '16px 18px',
                  }}>
                    <pre style={{
                      fontFamily: 'var(--font-sans)', fontSize: '13px',
                      color: 'var(--text-secondary)', lineHeight: 1.65,
                      whiteSpace: 'pre-wrap' as const, wordBreak: 'break-word' as const,
                      margin: 0,
                    }}>
                      {prompt.prompt}
                    </pre>
                    <button
                      onClick={(e) => { e.stopPropagation(); copyPrompt(prompt.id, prompt.prompt) }}
                      style={{
                        position: 'absolute', top: '10px', right: '10px',
                        fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 600,
                        color: isCopied ? '#4CAF7D' : 'var(--accent)',
                        background: isCopied ? 'rgba(76,175,125,0.1)' : 'var(--bg-surface)',
                        border: '1px solid',
                        borderColor: isCopied ? '#4CAF7D' : 'var(--border-base)',
                        borderRadius: '6px', padding: '5px 12px', cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {isCopied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>

                  {/* When to use + tips */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="prompt-meta-grid">
                    <div>
                      <p style={{
                        fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600,
                        letterSpacing: '0.05em', textTransform: 'uppercase' as const,
                        color: cat.color, marginBottom: '6px',
                      }}>
                        When to use
                      </p>
                      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.55, margin: 0 }}>
                        {prompt.whenToUse}
                      </p>
                    </div>
                    <div>
                      <p style={{
                        fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600,
                        letterSpacing: '0.05em', textTransform: 'uppercase' as const,
                        color: cat.color, marginBottom: '6px',
                      }}>
                        Tips
                      </p>
                      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.55, margin: 0 }}>
                        {prompt.tips}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div style={{
        marginTop: '40px', padding: '18px 22px', borderRadius: '10px',
        border: '1px solid var(--border-muted)', background: 'var(--bg-surface)',
      }}>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
          These prompts are generic by design — they work for anyone regardless of role or industry.
          Paste them into Claude and fill in the [bracketed placeholders] with your actual content.
          For role-specific prompts tailored to your job, check back — those are coming soon.
        </p>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .prompt-meta-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
