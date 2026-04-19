import { NextRequest, NextResponse } from 'next/server'
import { subscribeToNewsletter } from '@/lib/db'
import { addContactToAudience } from '@/lib/resend'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }

    const normalizedEmail = email.trim().toLowerCase()

    // 1) Always write to Supabase (source of truth).
    const result = await subscribeToNewsletter(normalizedEmail)
    if (!result.success) {
      return NextResponse.json({ error: result.error ?? 'Subscription failed' }, { status: 500 })
    }

    // 2) Best-effort add to Resend audience. If Resend isn't configured or
    //    the API is down, we still consider the signup successful — the
    //    Supabase row is the durable record and can be re-synced later.
    await addContactToAudience(normalizedEmail)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
