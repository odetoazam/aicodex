# aicodex.to — Brand Guidelines

## Identity

**Name:** AI Codex
**Domain:** aicodex.to
**Tagline:** *The knowledge graph for building with AI*
**Voice:** Operator, not observer. Direct, precise, no fluff. The person who's actually deployed this — not the consultant who theorized about it.

---

## Typography

### Typefaces

**Display / Headings:** [Instrument Serif](https://fonts.google.com/specimen/Instrument+Serif)
- Gives the site editorial gravitas — feels like an authoritative reference, not a blog
- Italic variant for pull quotes and callouts
- Used for: H1, H2, article titles, glossary term names

**Body / UI:** [Inter](https://fonts.google.com/specimen/Inter) (variable font)
- Industry standard for clarity and readability at all sizes
- Used for: body text, navigation, labels, captions, metadata

**Code / Technical:** [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono)
- Used for: code blocks, technical strings, API references

### Type Scale (fluid, clamp-based)

```css
--text-xs:    clamp(0.75rem,  0.7rem  + 0.25vw, 0.875rem);
--text-sm:    clamp(0.875rem, 0.82rem + 0.28vw, 1rem);
--text-base:  clamp(1rem,     0.95rem + 0.3vw,  1.125rem);
--text-lg:    clamp(1.125rem, 1.05rem + 0.38vw, 1.375rem);
--text-xl:    clamp(1.375rem, 1.2rem  + 0.88vw, 1.875rem);
--text-2xl:   clamp(1.875rem, 1.5rem  + 1.88vw, 2.75rem);
--text-3xl:   clamp(2.75rem,  2rem    + 3.75vw, 4.5rem);
```

Line height: 1.6 body, 1.2 headings
Measure (line length): 65ch max for body text

---

## Color System

### Dark Mode (Primary)

```css
/* Backgrounds */
--bg-base:      #0C0C0B;   /* Near-black with warm undertone */
--bg-surface:   #141413;   /* Cards, elevated surfaces */
--bg-subtle:    #1C1C1A;   /* Hover states, subtle distinction */
--bg-overlay:   #242422;   /* Modals, popovers */

/* Borders */
--border-base:  #262624;   /* Default borders */
--border-muted: #1E1E1C;   /* Subtle dividers */

/* Text */
--text-primary:   #E8E6E1; /* Warm off-white — not pure white */
--text-secondary: #9A9891; /* Secondary content */
--text-muted:     #5C5A56; /* Placeholders, disabled */
--text-inverse:   #0C0C0B; /* Text on accent bg */

/* Accent — Warm Amber */
--accent:         #D4845A; /* Primary accent — warm, distinct from Anthropic's terracotta */
--accent-muted:   #2A1F18; /* Accent background tint */
--accent-hover:   #E09070; /* Hover state */

/* Semantic */
--success:   #4CAF7D;
--warning:   #D4A45A;
--error:     #D45A5A;

/* Cluster Colors (for tags) */
--cluster-foundation:   #7B8FD4; /* Blue-purple */
--cluster-agents:       #D4845A; /* Amber — primary accent */
--cluster-retrieval:    #4CAF7D; /* Green */
--cluster-prompts:      #D4C45A; /* Yellow */
--cluster-infra:        #9B7BD4; /* Purple */
--cluster-safety:       #D45A7B; /* Rose */
--cluster-business:     #5AAFD4; /* Teal */
--cluster-tools:        #D4845A; /* Amber */
```

### Light Mode

```css
--bg-base:      #F7F6F3;
--bg-surface:   #FFFFFF;
--bg-subtle:    #F0EEE9;
--text-primary:   #1A1916;
--text-secondary: #6B6964;
--border-base:  #E4E2DC;
--accent:       #C4704A;
```

---

## Logo & Mark

**Wordmark:** "AI Codex" — Instrument Serif, tracking -0.02em
**Mark:** A minimal node-and-edge glyph suggesting a knowledge graph — two or three connected nodes. Single color. Works at 16px favicon size.

**Don't:** Rainbow gradients, heavy drop shadows, bubble letters, anything that looks like a startup from 2019.

---

## UI Patterns

### Cards
```
border-radius: 8px
border: 1px solid var(--border-base)
background: var(--bg-surface)
padding: 20px 24px
transition: border-color 150ms ease
hover: border-color → var(--accent) at 40% opacity
```

### Tags / Cluster Badges
```
border-radius: 4px
padding: 2px 8px
font-size: var(--text-xs)
font-weight: 500
letter-spacing: 0.04em
text-transform: uppercase
background: cluster color at 12% opacity
color: cluster color
```

### Links
```
color: var(--accent)
text-decoration: none
border-bottom: 1px solid var(--accent) at 30% opacity
hover: border-bottom-color → var(--accent) at 100%
transition: 120ms ease
```

### Focus States
```
outline: 2px solid var(--accent)
outline-offset: 3px
border-radius: 3px
```

---

## Motion

- Transitions: 120–200ms, ease-out
- Page transitions: fade, 150ms
- No bounces, no springs, no parallax
- Respect `prefers-reduced-motion`

---

## Voice & Tone

**Do:**
- Short sentences. Declarative.
- "This is how it works" not "This is generally thought to be how it works"
- Name the failure mode. Name the tradeoff.
- "At Distru, we learned..." — first-person operator voice in dispatches

**Don't:**
- Hype language ("revolutionary", "game-changing", "unlock")
- Hedging ("it depends", "it varies", "it can be used for many things")
- Passive voice
- Vendor marketing framing

---

## What it Looks Like

Imagine: Linear's restraint + Anthropic's warmth + the authority of an encyclopedia.

Dark, warm, precise. The kind of site where you feel like the information is trustworthy before you've read a word.
