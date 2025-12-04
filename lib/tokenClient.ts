import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '@/sanity/env'


export const tokenClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN, // 🔒 secure token for preview
  stega: {
    studioUrl: '/studio',
  },
})
