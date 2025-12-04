import { client } from '@/sanity/lib/client'

/**
 * 📡 RSS Feed
 * Generates an RSS feed for blog subscribers.
 */
export async function GET() {
  const posts = await client.fetch(`
    *[_type == "post"] | order(publishedAt desc) {
      title,
      "slug": slug.current,
      publishedAt,
      "description": pt::text(body[0..2]) // Extract first few blocks as text
    }
  `)

  const siteUrl = 'https://kishore-portfolio.com'

  const feed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>Kishore's Blog</title>
    <link>${siteUrl}</link>
    <description>Thoughts on software engineering, design, and tech.</description>
    ${posts
      .map(
        (post: any) => `
      <item>
        <title>${post.title}</title>
        <link>${siteUrl}/blog/${post.slug}</link>
        <description>${post.description || ''}</description>
        <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      </item>
    `
      )
      .join('')}
  </channel>
</rss>`

  return new Response(feed, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
