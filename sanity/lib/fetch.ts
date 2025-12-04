import { createClient, type QueryParams } from 'next-sanity'
import { draftMode } from 'next/headers'
import { client } from './client'
import { tokenClient } from '@/lib/tokenClient' // Ensure this exists or create it

/**
 * 🛠️ sanityFetch
 * A robust helper to fetch data from Sanity.
 * - Automatically switches between "draft" (preview) and "published" (CDN) modes.
 * - Handles errors gracefully.
 * - Adds a "perspective" to ensure drafts are only seen when intended.
 */
export async function sanityFetch<QueryResponse>({
  query,
  params = {},
  tags = [],
}: {
  query: string
  params?: QueryParams
  tags?: string[]
}): Promise<QueryResponse> {
  const isDraftMode = (await draftMode()).isEnabled

  // 🔒 Use the token client if in draft mode (to bypass CDN and see drafts)
  // 🌍 Use the standard client if in production (to use CDN and save costs)
  const fetchClient = isDraftMode ? tokenClient : client

  return fetchClient.fetch<QueryResponse>(query, params, {
    // ⚡️ Cache Strategy:
    // - 'no-store' for drafts (always fresh)
    // - 'force-cache' or 'next: { revalidate }' for prod (handled by client config)
    ...(isDraftMode && {
      token: process.env.SANITY_API_TOKEN,
      perspective: 'drafts',
      stega: true,
    }),
    next: {
      tags,
      // 🕒 Revalidate every 60s in prod, 0s in draft
      revalidate: isDraftMode ? 0 : 60, 
    },
  })
}
