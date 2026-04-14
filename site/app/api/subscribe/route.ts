import { NextRequest, NextResponse } from 'next/server'
import { subscribeToNewsletter } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }
    const result = await subscribeToNewsletter(email.trim().toLowerCase())
    if (!result.success) {
      return NextResponse.json({ error: result.error ?? 'Subscription failed' }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
