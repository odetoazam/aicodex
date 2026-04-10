# AI Field Guide — Vision

## What This Is

A semantic knowledge graph and content hub that maps AI concepts to business decisions — built for founders, operators, and teams who need to understand and adopt AI without wading through academic papers or vendor marketing.

Not another newsletter. Not a flat glossary. A living knowledge system where every concept connects to the decisions it informs.

## The Gap This Fills

| Existing Options | Problem |
|---|---|
| a16z AI Glossary | Flat, VC-agenda-shaped, no cross-entity depth |
| AI newsletters (The Rundown, Ben's Bites) | Daily news, zero structure |
| Ethan Mollick / Simon Willison | Blog format — no graph, developer-heavy |
| Vendor docs | Self-serving, siloed |

Nobody is doing: structured knowledge graph + practitioner voice + startup-accessible framing + Claude-specific depth.

## Who This Is For

**Primary:** Startups — from solo founders to 50-person teams — who need to adopt AI without wasting months on the wrong tools, architectures, or assumptions.

**Secondary (later):** Enterprise operators and executives making AI strategy decisions.

**Not for:** Researchers, academics, ML engineers who want papers.

## Positioning

**The voice:** An operator who has deployed AI inside a real B2B company under real constraints — compliance, messy data, skeptical stakeholders, budget pressure.

**Not:** a consultant theorizing, a researcher summarizing papers, a journalist covering announcements.

**The proof:** Building AI systems across a regulated cannabis ERP — where hallucinations have compliance consequences and "let's run a pilot" has real stakes.

## Content Architecture

### Five-Tier System (same as CannabisHub)

- **Tier 1 — Glossary Definitions:** Single-term explanations (200-300 words). "What is RAG?" — precise, no fluff, links to related terms.
- **Tier 2 — Entity Hubs:** Deep dives on major nodes — multiple angles per concept. "RAG: Core Definition", "RAG: When Not to Use It", "RAG: The Architecture Decisions Nobody Talks About"
- **Tier 3 — Cross-Entity Articles:** Where the real value is. "Why RAG Fails When You Need a Knowledge Graph", "The Real Difference Between Fine-Tuning and Prompt Engineering for Startups"
- **Tier 4 — Journey Articles:** Follow a concept across the full adoption lifecycle. "The Founder's Path from 'What is AI' to Production Deployment"
- **Tier 5 — Absence Articles:** What the AI industry doesn't measure or say. "Why Nobody Tracks AI ROI Correctly", "The Missing Layer Between AI Demos and Production"

### The Angle System (prevents duplication)

Each entity can be written about from multiple angles — never two articles from the same angle on the same term:
- `def` — Core definition
- `process` — How it works / workflow
- `failure` — Common failure modes
- `cross` — Cross-entity relationship
- `role` — Role-specific (Founder, CTO, Operator, Developer)
- `absence` — What's missing / not measured
- `history` — How it evolved

### Eight Knowledge Clusters

1. Foundation Models & LLMs
2. Agents & Orchestration
3. Retrieval & Knowledge
4. Prompt Engineering
5. Infrastructure & Deployment
6. Evaluation & Safety
7. Business Strategy & ROI
8. Tools & Ecosystem

## Claude-Centric Positioning

This hub is explicitly Claude-first. Not because Claude is the only tool — it isn't — but because:

1. Deep expertise in one tool beats shallow coverage of ten
2. Anthropic's partner program rewards demonstrated Claude expertise
3. Distru's internal AI education runs on Claude — this doubles as internal curriculum
4. Claude's Constitutional AI, long context, and agent SDK create genuine differentiation worth explaining in depth

Every cluster has Claude-specific angles. The `claude_specific` flag in the knowledge graph marks which terms have Claude-particular depth.

## Content Mix

### AI-Generated (Knowledge Graph Base)
- Tier 1 glossary definitions — AI-written, human-curated backlog
- Cross-entity articles — AI-drafted with human editorial judgment on which connections matter
- Journey articles — AI-structured, human voice on real examples

### Human-Written ("From the Field")
- "What I'm building" dispatches — real decisions, real tradeoffs, real outcomes from Distru AI work
- Opinion pieces — takes on AI strategy that only an operator would have
- Newsletter — weekly, blending knowledge graph highlights with field notes

The human voice is injected selectively. Even 2-3 personal dispatches per month gives the site a soul that pure knowledge graphs lack.

## Revenue Model

**Free tier:** The knowledge graph — SEO engine, credibility foundation, newsletter acquisition
**Course tier ($X):** Structured learning paths built on the knowledge graph
  - "AI for Startup Founders" — strategy, use case discovery, build vs. buy decisions
  - "Claude in Production" — practical architecture, prompt engineering, agent workflows
  - "AI for Non-Technical Operators" — literacy, governance, change management
**Advisory (inbound):** The hub proves the thinking. Businesses find the site, see the depth, engage for strategy work.

## The Moat

Same logic as CannabisHub:

> "The moat is not 150 definitions. It's the density of connections between them, and the editorial judgment about which connections matter."

Plus: the lived experience layer. Nobody else has built multi-agent retrieval systems across Quranic text, cannabis operations, and company intelligence — and is now explaining AI to startups. That's not a background. That's a point of view.

## Knowledge State

`knowledge-state.md` — to be maintained after each content sprint:
- What's published (by cluster and tier)
- What implicit cross-entity connections exist but aren't yet written
- Highest-value untouched territory
- Which absence articles would most differentiate the hub

## Domain

**aifieldguide.io** (confirmed available)

## Stack

Next.js + Supabase + Vercel — same pattern as AyahGuide and CannabisHub.
