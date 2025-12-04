/* eslint-disable @typescript-eslint/no-explicit-any */
import { draftMode } from 'next/headers'
import { sanityFetch } from '@/sanity/lib/fetch'
import { urlFor } from '@/sanity/lib/image'
import CustomPortableText from '@/components/CustomPortableText'
import Link from 'next/link'
import Image from 'next/image'
import { Post } from '@/types'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const post = await sanityFetch<Post>({
    query: `*[_type == "post" && slug.current == $slug][0]`,
    params: { slug },
  })
  if (!post) return { title: 'Post Not Found' }
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      images: post.mainImage ? [urlFor(post.mainImage).width(1200).height(630).url()] : [],
    },
  }
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params

  const post = await sanityFetch<Post>({
    query: `*[_type == "post" && slug.current == $slug][0]{
      title,
      publishedAt,
      mainImage{asset->{url}, alt},
      body,
      excerpt
    }`,
    params: { slug },
    tags: [`post:${slug}`],
  })

  if (!post) {
    return <div className="text-center py-20">Post not found</div>
  }

  // Calculate reading time
  const wordCount = post.body?.reduce((acc: number, block: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    return acc + (block.children?.map((c: any) => c.text).join(' ').split(' ').length || 0) // eslint-disable-line @typescript-eslint/no-explicit-any
  }, 0) || 0
  const readingTime = Math.max(1, Math.ceil(wordCount / 200))

  // Build TOC
  const headings = post.body
    ?.filter((block: any) => block._type === 'block' && /^h[1-3]$/.test(block.style)) // eslint-disable-line @typescript-eslint/no-explicit-any
    .map((block: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      const text = block.children?.map((c: any) => c.text).join('') // eslint-disable-line @typescript-eslint/no-explicit-any
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      return { text, id, level: block.style }
    }) || []

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 flex flex-col lg:flex-row gap-12">
      
      {/* 🧭 Table of Contents (Sticky Sidebar) */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-24 p-6 rounded-xl border border-border bg-card/50 backdrop-blur-sm">
          <h3 className="font-bold text-foreground mb-4 uppercase text-xs tracking-wider">Table of Contents</h3>
          <nav className="flex flex-col gap-2">
            {headings.map((h: any, i: number) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
              <a 
                key={i} 
                href={`#${h.id}`} 
                className={`
                  text-sm text-muted-foreground hover:text-primary transition-colors line-clamp-1
                  ${h.level === 'h3' ? 'pl-4' : ''}
                `}
              >
                {h.text}
              </a>
            ))}
          </nav>
        </div>
      </aside>

      {/* 📰 Main Content */}
      <article className="flex-1 min-w-0">
        <header className="mb-10">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString('en-US', { dateStyle: 'long' })}
            </time>
            <span>•</span>
            <span>{readingTime} min read</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight mb-6">
            {post.title}
          </h1>
        </header>

        {post.mainImage?.asset?.url && (
          <div className="relative w-full aspect-[2/1] rounded-2xl overflow-hidden mb-12 shadow-lg">
            <Image
              src={urlFor(post.mainImage).width(1600).height(800).url()}
              alt={post.mainImage.alt || post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <CustomPortableText value={addIdsToHeadings(post.body || [])} />
        </div>

        <hr className="my-12 border-border" />

        <div className="flex justify-between items-center">
          <Link href="/blog" className="btn-secondary px-6 py-3 rounded-full border border-border hover:bg-muted transition font-medium">
            ← Back to Blog
          </Link>
        </div>
      </article>
    </div>
  )
}

// Helper to inject IDs into Portable Text blocks for TOC linking
function addIdsToHeadings(blocks: any[]) { // eslint-disable-line @typescript-eslint/no-explicit-any
  return blocks?.map(block => {
    if (block._type === 'block' && /^h[1-3]$/.test(block.style)) {
      const text = block.children?.map((c: any) => c.text).join('') // eslint-disable-line @typescript-eslint/no-explicit-any
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      return { ...block, id }
    }
    return block
  })
}
