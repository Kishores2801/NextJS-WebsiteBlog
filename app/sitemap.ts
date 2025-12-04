import { MetadataRoute } from 'next'
import { client } from '@/sanity/lib/client'

/**
 * 🗺️ Sitemap
 * Generates a sitemap.xml for search engines.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://kishore-portfolio.com' // Replace with actual domain

  // Fetch all blog posts
  const posts = await client.fetch(`
    *[_type == "post"] {
      "slug": slug.current,
      publishedAt
    }
  `)

  const blogRoutes = posts.map((post: any) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.publishedAt || new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const routes = [
    '',
    '/blog',
    '/projects',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  return [...routes, ...blogRoutes]
}
