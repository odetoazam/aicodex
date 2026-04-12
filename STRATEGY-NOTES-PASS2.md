# Strategy Notes — Pass 2
*Autonomous run, ~5 hours after Pass 1. Date: 2026-04-12*

---

## 1. What Pass 1 Did

Pass 1 notes file was not present (STRATEGY-NOTES-PASS1.md did not exist). Reconstructed from seed scripts and memory inventory:

- **Batch 11** (likely Pass 1): ai-usage-policy-for-teams, writing-system-prompts-that-work, claude-for-finance-teams, claude-for-product-teams, when-not-to-use-claude, measuring-ai-roi, prompt-engineering-for-operators, claude-for-legal-teams
- **Batch 12** (also Pass 1 or prior): ai-change-management, claude-for-data-teams, context-window-practical, claude-memory-practical, deep-research-practical, extended-thinking-practical

Pass 1 focused on: admin guides, team-level how-to, and practical guides for individual features. It **did not** produce a dedicated CS or HR role-type deep dive beyond what already existed in batches 1–15.

---

## 2. What Existed Before Pass 2 (CS/HR content)

Already in the DB:
- `ai-for-customer-success` (batches 1–9, shorter overview)
- `ai-for-hr` (batches 1–9, shorter overview)
- `cs-qbr-and-renewal-prep-with-claude` (batch 15)
- `claude-for-new-hire-onboarding` (batch 15)
- `cs-manager-ai-workflow` (batch 29, day in the life)
- `claude-plus-intercom` (batch 29)

The gap: no team-level CS infrastructure article (the CS *leader* angle, not individual rep), and no deep HR role article beyond the shorter batch 1–9 piece.

---

## 3. CS/HR Content Landscape — What the Research Found

### Customer Success

**What CS teams actually want to know (from web research + platform landscape):**
- Gainsight just opened MCP support (April 2, 2026) for AI retention workflows — CS teams are being pulled toward agentic AI workflows inside their existing platforms
- Intercom Copilot reports 31% more conversations closed per agent — the benchmark CS leaders cite when justifying AI investment
- CS teams reclaim 5–10 hours per CSM per week when AI handles prep and documentation (widely cited figure)
- The trend: "calendar-driven outreach" → "behavior-driven action" (AI reads signals, not just dates)
- Key questions CS pros are asking: how do I build consistent outputs across my team? How do I run a QBR in half the time? How do I write renewal outreach that doesn't sound generic?

**Content gap identified:** Most existing content (including our own) covers individual CSM workflows. The team-infrastructure angle — how a CS *leader* builds shared prompts, trains new reps, and raises the team floor — is underserved.

### HR Teams

**What HR teams actually want (from web research):**
- 68% of organizations use AI in hiring/onboarding (2026 stat)
- New hires through AI-assisted onboarding are 30% more likely to stay past year 1
- Companies save $18K/year average from AI onboarding
- HR's biggest time sinks: JD writing (no one updates them), policy Q&A (same questions, every week), performance review season (8+ reviews per manager), onboarding materials (different for every hire)
- Questions HR is asking: can AI answer policy questions so I'm not on Slack all day? Can it help write JDs without hiring manager involvement? Can it help managers write better performance reviews?

**Content gap identified:** `ai-for-hr` (batch 1–9) is a short overview. A real field note with specific workflows, prompts, and what Claude shouldn't do for HR is missing.

---

## 4. What Pass 2 Built

### Seed Script: `site/scripts/seed-articles-32.ts` ✓ SEEDED

**Article 1: `claude-cs-team-playbook`**
- Angle: CS leader building team AI infrastructure (not individual workflows)
- Covers: team Project setup, system prompt for CS, what documents to upload, the prompt library concept, training new reps with Claude-generated scenarios, measuring impact at team level
- Key insight: the prompt library is the compound-interest asset — every tested prompt that gets shared makes every future rep better
- ~1,600 words, 8 min read

**Article 2: `claude-for-hr-teams`**
- Angle: field note going deep on every major HR workflow
- Covers: JD writing (with system prompt), interview question generation, policy Q&A Project setup, performance review season (frameworks + manager drafts), culture/comms content
- Key "don't" section: hiring decisions, sensitive issues, employment contracts as final outputs, benefits specifics from memory
- Includes the exact system prompt for an HR Project
- ~1,700 words, 8 min read

Both articles seeded and confirmed in Supabase (`✓ claude-cs-team-playbook`, `✓ claude-for-hr-teams`).

### CS Learning Path: `/learn/claude-for-cs` ✓ CREATED

8-step path using confirmed existing + new articles:
1. `ai-for-customer-success` — why CS gets fast ROI
2. `cs-manager-ai-workflow` — daily workflow reality
3. `claude-projects-org-structure` — building the shared foundation
4. `writing-system-prompts-that-work` — writing the CS system prompt
5. `cs-qbr-and-renewal-prep-with-claude` — QBR/renewal workflow
6. `claude-plus-intercom` — connecting CS tools
7. `claude-cs-team-playbook` (new) — team playbook infrastructure
8. `measuring-ai-roi` — measuring what's working

Total: ~53 min. Accent color: `#C45E8A` (rose, distinct from all 6 existing path colors).

### Learn Page: `/learn/page.tsx` ✓ UPDATED

Added the CS path as path #7. Updated heading from "6 structured paths" to "7 structured paths."

---

## 5. Course Structure: "Claude for Customer Success" ($199)

**The premise:** CS teams have the highest density of high-stakes, time-consuming text work in most companies. A focused course gives them: the exact workflows, the exact prompts, the system to build, and confidence that they're not missing anything.

**Why $199 works:**
- One CSM reclaims 5 hours/week → ~$10K/year in time at $40/hr loaded cost
- $199 is less than one hour of their time at billing rates
- Decision sits with a CS manager or director who has budget authority

---

### Full Course Outline

**Module 1: Why CS is the Right Place to Start with AI** (~20 min)
- What CS work is actually made of (text-heavy, high-volume, pattern-driven)
- The math: 5–8 hours/week reclaimed × team size
- What CS teams get wrong when they start (individual adoption vs. team infrastructure)
- *Free article teaser:* [ai-for-customer-success] — included in free content, sets up the course

**Module 2: The CS Manager's Daily Workflow** (~30 min)
- Morning inbox and escalation response workflow (exact prompt included)
- The escalation response framework: acknowledgment → correction → next step → tone
- *Template included:* Escalation Response Prompt Template (editable Google Doc)
- *Free article:* [cs-manager-ai-workflow] — free, but course adds templates + worked examples

**Module 3: QBR and Renewal Prep from Scratch** (~45 min)
- The 4-step QBR workflow with Claude
- Renewal case: at-risk vs. healthy account approaches
- *Template included:* QBR Narrative Prompt Pack (5 templates for different account situations)
- *Free article:* [cs-qbr-and-renewal-prep-with-claude] — free, course adds templates + video walkthrough

**Module 4: Building the CS Team's Project** (~30 min)
- The system prompt that encodes your team standard (framework provided)
- What documents to upload and what not to (checklist)
- Project architecture for teams of 3 vs. teams of 20
- *Free article:* [claude-projects-org-structure] — free overview; course adds CS-specific build

**Module 5: The Prompt Library** (~40 min)
- The 12 prompts every CS team should have (all provided as templates)
- Escalation, renewal, health score commentary, at-risk outreach, post-churn debrief, QBR narrative, expansion outreach, internal handoff note, exec escalation request, new account intro email, champion change response, executive sponsor communication
- *Template pack included:* CS Prompt Library (12-prompt editable doc)
- Not available in free content — this is the highest-value asset in the course

**Module 6: Connecting Claude to Your CS Tools** (~20 min)
- Claude + Intercom, Gainsight, Salesforce, HubSpot
- What changes when Claude can read the ticket vs. having to paste it
- What still needs to stay in the human workflow
- *Free article:* [claude-plus-intercom] — free; course adds Gainsight/Salesforce coverage

**Module 7: Training New CS Reps with Claude** (~25 min)
- The scenario practice framework (how to run it in onboarding week 1–2)
- Calibration sessions: using Claude to close the gap between new and senior rep quality
- Ramp time benchmarks before/after AI onboarding
- *New article:* [claude-cs-team-playbook] covers this, but course goes deeper with worked examples

**Module 8: Measuring Whether It's Working** (~20 min)
- Time savings: how to measure (methodology provided)
- Quality consistency: the simple monthly rubric (provided)
- New rep ramp time tracking
- The 30-day check-in survey (template included)
- *Free article:* [measuring-ai-roi] — free; course adds CS-specific metrics and benchmarks

---

**What makes it worth $199 (beyond the articles):**
1. **12-prompt CS Prompt Library** (editable, with context notes on when to use each)
2. **QBR Narrative Prompt Pack** (5 templates for different account scenarios)
3. **CS Project Setup Checklist** (system prompt template, document upload checklist)
4. **New Rep Onboarding Framework** (2-week AI ramp plan)
5. **CS ROI Measurement Kit** (30-day check-in survey, monthly rubric, time-tracking template)
6. Video walkthroughs for the QBR workflow and prompt library setup (~90 min total video)

---

## 6. Recommendation: Build the CS Course First?

**Yes. Build CS first.** Reasons:

1. **Demand signal is clearest.** CS teams are already using Claude (or have tried to). They want structured guidance, not a reason to start. The course converts existing intent.

2. **The asset overlap is highest.** We already have 6+ articles covering CS from multiple angles. The course adds templates and structure around existing content — lower production cost than HR or sales would be.

3. **The buyer is identifiable.** CS managers and directors at SaaS companies with 20–500 employees. They have budget, they have pain, they have a team that needs to scale. Easy to reach on LinkedIn, in Gainsight/ChurnZero communities, in CS-specific Slack groups (Customer Success Collective, etc.).

4. **Gainsight's MCP launch (April 2026) is a live news hook.** CS teams are evaluating how their AI stack fits together right now. A structured guide to Claude in that context lands in a moment of active consideration.

**Alternative if the team wants shorter build time:** HR. The HR buyer is also clear (HR directors, HRBPs), the content gaps are filled by Pass 2's new article, and there's less competition in "Claude for HR" search results than "Claude for CS." But the CS course has a cleaner ROI narrative — CS leaders are used to measuring efficiency and already understand the cost-per-rep math.

---

## 7. What the Next Human Session Should Focus On

**Priority 1: Decide on the CS course.** If building it, the prompt library (Module 5) is the highest-value asset and requires a human to curate and test 12 real prompts against real CS scenarios. This is the part that takes human judgment and CS experience — not an automated task.

**Priority 2: Azam's real onboarding experience.** The memory file flags "team-onboarding" as high-priority, waiting on Azam's real experience. This would make for the most authentic article in the site — and it feeds the course narrative. When is he ready to share it?

**Priority 3: Day-in-the-life: ops manager + founder.** Both flagged as gaps. These follow the same pattern as `cs-manager-ai-workflow` and can be automated, but benefit from review of the AI-generated output.

**Priority 4: claude-plus-salesforce.** High search intent, large CS/sales audience, no article yet. Can be automated.

**Priority 5: CS course landing page.** If we're building toward $199 paid content, the /courses or /courses/claude-for-cs page needs a design. Not an automated task — needs Azam's input on pricing page structure and what the paid access experience looks like.

---

*Pass 2 complete. Articles seeded, CS learning path live, strategy documented.*
