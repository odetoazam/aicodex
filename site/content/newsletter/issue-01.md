# Issue #1 — Draft

**Subject:** Why Claude keeps giving you generic answers

**Preview text:** It's not the model. It's a briefing problem.

---

Most people have had this experience: you ask Claude something, you get a technically correct answer, and it's completely useless. It's too formal, or too generic, or written for someone who doesn't work the way you do. You end up rewriting half of it anyway.

The answer sounds like it was written for anyone. Because it was.

Claude doesn't know you're a CS manager at a 40-person SaaS company. It doesn't know your clients are operations teams who communicate on Slack, not email. It doesn't know that "a good message" for you means under 100 words, no jargon, and one clear ask at the end. So it produces something for a hypothetical professional in a hypothetical situation.

This isn't a limitation of the model. It's a briefing problem.

---

**The fix: start with context, not the question.**

Before you ask anything, spend two minutes giving Claude the information it needs to be useful specifically for your job:

- What you do and who you do it for
- What you're working on right now
- What "good output" looks like in your context (tone, length, format)

Takes longer than just asking the question. But it's the difference between an answer calibrated to your actual role and an answer calibrated to nobody in particular.

Here's what that looks like:

**Without context:**

> Write a follow-up email to a client who hasn't responded to our renewal proposal.

Claude produces something formal and generic. Might work. You'll rewrite half of it.

**With context:**

> I'm a CS Manager at a SaaS company. Our clients are ops teams at mid-size logistics companies. We communicate informally — most conversations are on Slack, not email. A good message from us is short (under 100 words), plain language, no overselling, one clear ask at the end.
>
> Write a follow-up to a client who hasn't responded to our renewal proposal sent 10 days ago. They've been a customer for 18 months. Had one support issue last quarter that we resolved without escalation.

Now the output is something you can actually use.

---

**The mistake most people make with this:**

Writing context that's long but vague. "I work at a B2B SaaS company and I want help with customer success tasks." That gives Claude volume without specificity. The useful context is: who your clients are, how you communicate, what good output looks like, and what you actually need right now.

---

**Try this today.**

Write a 3-sentence briefing for your role:

> I'm a [your role] at [company type]. My work involves [one sentence: what you do and who you do it for]. When I ask for written communication, [describe good output: tone, length, format, who reads it].

Open Claude. Paste it. Then ask whatever you were going to ask anyway. See if the output changes.

That's the briefing method. The people using Claude consistently at work have some version of this built into how they start sessions — either a saved message they paste, or a Project system prompt they set up once and never think about again.

If you want to set it up once for your whole team, [here's how to write a system prompt that actually works](https://www.aicodex.to/articles/system-prompt-role) — takes about 20 minutes and applies your context to every conversation automatically.

---

*AI Codex — practical guides for people using Claude at work.*

[Unsubscribe] · [View in browser]

---

## Send notes

- **Target send date:** When aicodex.to DNS is verified on Resend
- **From:** newsletter@aicodex.to
- **Audience:** All subscribers (currently 0 — first send)
- **Word count:** ~530 words
- **Read time:** ~2.5 min
