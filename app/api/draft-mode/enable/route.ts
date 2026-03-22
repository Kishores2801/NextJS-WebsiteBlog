import { validatePreviewUrl } from '@sanity/preview-url-secret'
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { client } from '@/sanity/lib/client'

const token = process.env.SANITY_API_READ_TOKEN

export async function GET(request: Request) {
  if (!token) {
    return new Response('A secret is required to enable preview mode', { status: 401 })
  }

  const { isValid, redirectTo = '/' } = await validatePreviewUrl(client.withConfig({ token }), request.url)

  if (!isValid) {
    return new Response('Invalid secret', { status: 401 })
  }

  const draft = await draftMode()
  draft.enable()

  redirect(redirectTo)
}
