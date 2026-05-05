export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-10-31'

export const dataset =
  process.env.SANITY_STUDIO_DATASET || 'production'

export const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID || 'upj9dth5'

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}
