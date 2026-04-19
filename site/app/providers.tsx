'use client'

import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { useEffect } from 'react'

export function PHProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    posthog.init('phc_qHa9VgmYfgyDqEbvpq55jj4Q65SS4DRXsdk6939PnzrY', {
      api_host: 'https://us.i.posthog.com',
      person_profiles: 'identified_only',
      capture_pageview: false, // handled by PostHogPageView
    })
  }, [])

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}
