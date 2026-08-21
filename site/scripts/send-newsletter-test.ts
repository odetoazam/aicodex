/**
 * Sends a test copy of issue #1 to a single address.
 * Usage: tsx --env-file=.env.local scripts/send-newsletter-test.ts azam@distru.com
 */
import { Resend } from 'resend'

const TO = process.argv[2]
if (!TO) {
  console.error('Usage: tsx --env-file=.env.local scripts/send-newsletter-test.ts <email>')
  process.exit(1)
}

const resend = new Resend(process.env.RESEND_API_KEY!)

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Why Claude keeps giving you generic answers</title>
</head>
<body style="margin:0;padding:0;background:#ffffff;font-family:Georgia,'Times New Roman',serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;">
  <tr>
    <td align="center" style="padding:40px 20px;">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="padding:0 0 32px;">
            <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;color:#888888;letter-spacing:0.05em;text-transform:uppercase;">AI Codex · Issue #1</p>
          </td>
        </tr>

        <!-- Subject / headline -->
        <tr>
          <td style="padding:0 0 24px;">
            <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:30px;font-weight:700;color:#111111;line-height:1.25;letter-spacing:-0.02em;">Why Claude keeps giving you generic answers</h1>
          </td>
        </tr>

        <!-- Preview -->
        <tr>
          <td style="padding:0 0 32px;border-bottom:1px solid #e5e5e5;">
            <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:16px;color:#555555;font-style:italic;">It's not the model. It's a briefing problem.</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px 0 0;">
            <p style="margin:0 0 20px;font-family:Georgia,'Times New Roman',serif;font-size:17px;color:#222222;line-height:1.7;">Most people have had this experience: you ask Claude something, you get a technically correct answer, and it's completely useless. Too formal, too generic, written for someone who doesn't work the way you do. You end up rewriting half of it anyway.</p>

            <p style="margin:0 0 20px;font-family:Georgia,'Times New Roman',serif;font-size:17px;color:#222222;line-height:1.7;">The answer sounds like it was written for anyone. Because it was.</p>

            <p style="margin:0 0 20px;font-family:Georgia,'Times New Roman',serif;font-size:17px;color:#222222;line-height:1.7;">Claude doesn't know you're a CS manager at a 40-person SaaS company. It doesn't know your clients are ops teams who communicate on Slack, not email. It doesn't know that a good message from you means under 100 words, no jargon, one clear ask. So it produces something for a hypothetical professional in a hypothetical situation.</p>

            <p style="margin:0 0 32px;font-family:Georgia,'Times New Roman',serif;font-size:17px;color:#222222;line-height:1.7;font-weight:bold;">This isn't a limitation of the model. It's a briefing problem.</p>

            <!-- Section heading -->
            <p style="margin:0 0 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:11px;font-weight:700;color:#888888;letter-spacing:0.1em;text-transform:uppercase;">The fix</p>
            <h2 style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:700;color:#111111;line-height:1.3;">Start with context, not the question.</h2>

            <p style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:17px;color:#222222;line-height:1.7;">Before you ask anything, spend two minutes giving Claude the information it needs to be useful for your specific job:</p>

            <ul style="margin:0 0 20px;padding-left:24px;">
              <li style="font-family:Georgia,'Times New Roman',serif;font-size:17px;color:#222222;line-height:1.7;margin-bottom:8px;">What you do and who you do it for</li>
              <li style="font-family:Georgia,'Times New Roman',serif;font-size:17px;color:#222222;line-height:1.7;margin-bottom:8px;">What you're working on right now</li>
              <li style="font-family:Georgia,'Times New Roman',serif;font-size:17px;color:#222222;line-height:1.7;">What "good output" looks like in your context (tone, length, format)</li>
            </ul>

            <p style="margin:0 0 32px;font-family:Georgia,'Times New Roman',serif;font-size:17px;color:#222222;line-height:1.7;">It's the difference between an answer calibrated to your actual role and an answer calibrated to nobody in particular.</p>

            <!-- Before/after examples -->
            <p style="margin:0 0 12px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;font-weight:600;color:#888888;text-transform:uppercase;letter-spacing:0.05em;">Without context:</p>
            <div style="background:#f5f5f5;border-left:3px solid #cccccc;padding:16px 20px;margin:0 0 20px;border-radius:0 4px 4px 0;">
              <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:15px;color:#444444;line-height:1.6;font-style:italic;">Write a follow-up email to a client who hasn't responded to our renewal proposal.</p>
            </div>
            <p style="margin:0 0 20px;font-family:Georgia,'Times New Roman',serif;font-size:17px;color:#222222;line-height:1.7;">Claude produces something formal and generic. Might work. You'll rewrite half of it.</p>

            <p style="margin:0 0 12px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;font-weight:600;color:#D4845A;text-transform:uppercase;letter-spacing:0.05em;">With context:</p>
            <div style="background:#fff8f5;border-left:3px solid #D4845A;padding:16px 20px;margin:0 0 20px;border-radius:0 4px 4px 0;">
              <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:15px;color:#444444;line-height:1.6;font-style:italic;">I'm a CS Manager at a SaaS company. Our clients are ops teams at mid-size logistics companies. We communicate informally — most conversations are on Slack, not email. A good message from us is short (under 100 words), plain language, no overselling, one clear ask at the end.<br><br>Write a follow-up to a client who hasn't responded to our renewal proposal sent 10 days ago. They've been a customer for 18 months. Had one support issue last quarter that we resolved without escalation.</p>
            </div>
            <p style="margin:0 0 32px;font-family:Georgia,'Times New Roman',serif;font-size:17px;color:#222222;line-height:1.7;">Now the output is something you can actually use.</p>

            <!-- Mistake -->
            <p style="margin:0 0 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:11px;font-weight:700;color:#888888;letter-spacing:0.1em;text-transform:uppercase;">The mistake most people make</p>
            <p style="margin:0 0 32px;font-family:Georgia,'Times New Roman',serif;font-size:17px;color:#222222;line-height:1.7;">Writing context that's long but vague. "I work at a B2B SaaS company and I want help with customer success tasks." That gives Claude volume without specificity. The useful context is: who your clients are, how you communicate, what good output looks like, and what you actually need right now.</p>

            <!-- CTA block -->
            <div style="background:#f9f9f9;border:1px solid #e5e5e5;border-radius:6px;padding:24px;margin:0 0 32px;">
              <p style="margin:0 0 12px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;font-weight:700;color:#111111;text-transform:uppercase;letter-spacing:0.05em;">Try this today</p>
              <p style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:16px;color:#333333;line-height:1.65;">Write a 3-sentence briefing for your role:</p>
              <div style="background:#ffffff;border:1px solid #dddddd;border-radius:4px;padding:14px 16px;margin:0 0 16px;">
                <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:14px;color:#555555;line-height:1.65;font-style:italic;">I'm a [your role] at [company type]. My work involves [one sentence: what you do and who you do it for]. When I ask for written communication, [describe good output: tone, length, format, who reads it].</p>
              </div>
              <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:16px;color:#333333;line-height:1.65;">Open Claude. Paste it. Then ask whatever you were going to ask anyway. See if the output changes.</p>
            </div>

            <p style="margin:0 0 20px;font-family:Georgia,'Times New Roman',serif;font-size:17px;color:#222222;line-height:1.7;">That's the briefing method. The people using Claude consistently at work have some version of this built into how they start sessions — either a saved message they paste, or a Project system prompt they set up once and never think about again.</p>

            <p style="margin:0 0 32px;font-family:Georgia,'Times New Roman',serif;font-size:17px;color:#222222;line-height:1.7;">If you want to set it up once for your whole team, <a href="https://www.aicodex.to/articles/system-prompt-role" style="color:#D4845A;text-decoration:none;border-bottom:1px solid #D4845A;">here's how to write a system prompt that actually works</a> — takes about 20 minutes and applies your context to every conversation automatically.</p>

            <!-- Footer -->
            <hr style="border:none;border-top:1px solid #e5e5e5;margin:0 0 24px;">
            <p style="margin:0 0 8px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;color:#888888;line-height:1.6;"><a href="https://www.aicodex.to" style="color:#888888;text-decoration:none;">AI Codex</a> — practical guides for people using Claude at work.</p>
            <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:12px;color:#aaaaaa;">You're receiving this because you subscribed at aicodex.to. <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:#aaaaaa;">Unsubscribe</a>.</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`

async function main() {
  console.log(`Sending test issue #1 to: ${TO}`)

  const { data, error } = await resend.emails.send({
    from: 'AI Codex <newsletter@aicodex.to>',
    to: [TO],
    subject: 'Why Claude keeps giving you generic answers',
    html,
    text: `Why Claude keeps giving you generic answers

It's not the model. It's a briefing problem.

Most people have had this experience: you ask Claude something, you get a technically correct answer, and it's completely useless. Too formal, too generic, written for someone who doesn't work the way you do.

The answer sounds like it was written for anyone. Because it was.

This isn't a limitation of the model. It's a briefing problem.

THE FIX: Start with context, not the question.

Before you ask anything, spend two minutes giving Claude the information it needs:
- What you do and who you do it for
- What you're working on right now
- What "good output" looks like in your context (tone, length, format)

Without context: "Write a follow-up email to a client who hasn't responded to our renewal proposal."
Claude produces something generic. You'll rewrite half of it.

With context: "I'm a CS Manager at a SaaS company. Our clients are ops teams at mid-size logistics companies. We communicate informally — Slack, not email. A good message from us is short (under 100 words), plain language, one clear ask at the end. Write a follow-up to a client who hasn't responded to our renewal proposal sent 10 days ago..."

Now the output is something you can actually use.

THE MISTAKE: Writing context that's long but vague. Specific beats comprehensive.

TRY THIS TODAY:
Write this for your role:
"I'm a [role] at [company type]. My work involves [what you do and who you do it for]. When I ask for written communication, [describe good output: tone, length, format]."

Open Claude. Paste it. Ask what you were going to ask. See what changes.

If you want to set it up once for your whole team:
https://www.aicodex.to/articles/system-prompt-role

---
AI Codex — practical guides for people using Claude at work.
aicodex.to

To unsubscribe: {{{RESEND_UNSUBSCRIBE_URL}}}`,
  })

  if (error) {
    console.error('Send failed:', error)
    process.exit(1)
  }

  console.log('Sent successfully. Email ID:', data?.id)
}

main()
