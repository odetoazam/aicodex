import { Resend } from 'resend'

// Server-side Resend client. Returns null when RESEND_API_KEY is missing —
// callers should treat that as "Resend not configured yet" and fall back to
// Supabase-only behavior rather than throwing.
let _client: Resend | null | undefined

export function getResend(): Resend | null {
  if (_client !== undefined) return _client
  const key = process.env.RESEND_API_KEY
  if (!key) {
    _client = null
    return null
  }
  _client = new Resend(key)
  return _client
}

export function getAudienceId(): string | null {
  return process.env.RESEND_AUDIENCE_ID ?? null
}

/**
 * Add a contact to the configured Resend audience.
 * Safe to call even when Resend isn't configured — returns { skipped: true }.
 * Errors are swallowed (logged) because signup should not fail if Resend is down.
 */
export async function addContactToAudience(email: string): Promise<
  { ok: true } | { skipped: true; reason: string } | { ok: false; error: string }
> {
  const resend = getResend()
  const audienceId = getAudienceId()
  if (!resend) return { skipped: true, reason: 'RESEND_API_KEY not set' }
  if (!audienceId) return { skipped: true, reason: 'RESEND_AUDIENCE_ID not set' }

  try {
    const res = await resend.contacts.create({
      email,
      audienceId,
      unsubscribed: false,
    })
    if (res.error) {
      const msg = typeof res.error === 'object' && 'message' in res.error ? String(res.error.message) : 'unknown'
      // Duplicate contact is fine — treat as success
      if (msg.toLowerCase().includes('already exists')) return { ok: true }
      console.error('resend.contacts.create error:', res.error)
      return { ok: false, error: msg }
    }
    return { ok: true }
  } catch (e) {
    console.error('resend.contacts.create threw:', e)
    return { ok: false, error: e instanceof Error ? e.message : 'unknown' }
  }
}
