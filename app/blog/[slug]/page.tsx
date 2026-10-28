/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { sanityFetch } from '@/sanity/lib/fetch'
import { urlFor } from '@/sanity/lib/image'
import CustomPortableText from '@/components/CustomPortableText'
import Link from 'next/link'
import Image from 'next/image'
import { Post } from '@/types'
import { codeToHtml } from 'shiki'
import { ArrowLeft, Calendar, Clock, ChevronRight, BookOpen } from 'lucide-react'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const post = await sanityFetch<Post>({
    query: `*[_type == "post" && slug.current == $slug][0]`,
    params: { slug },
  }).catch(() => null)

  if (!post) return { title: 'Post Not Found' }
  return {
    title: `${post.title} | Engineering Blog`,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} | Engineering Blog`,
      description: post.excerpt,
      images: post.mainImage?.asset
        ? [urlFor(post.mainImage).width(1200).height(630).url()]
        : [],
    },
  }
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params

  const [post, relatedPosts] = await Promise.all([
    sanityFetch<any>({
      query: `*[_type == "post" && slug.current == $slug][0]{
        _id,
        title,
        publishedAt,
        mainImage{asset->{url}, alt},
        body,
        excerpt,
        categories[]->{title, "slug": slug.current}
      }`,
      params: { slug },
      tags: [`post:${slug}`],
    }).catch(() => null),

    sanityFetch<any[]>({
      query: `*[_type == "post" && approved == true && slug.current != $slug][0...2]{
        _id,
        title,
        slug,
        excerpt,
        publishedAt,
        mainImage{asset->{url}, alt},
        categories[]->{title, "slug": slug.current}
      }`,
      params: { slug },
      tags: ['post'],
    }).catch(() => []),
  ])

  if (!post) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The requested article could not be located.
        </p>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <ArrowLeft size={16} />
          <span>Back to Blog</span>
        </Link>
      </div>
    )
  }

  // Calculate reading time
  const wordCount =
    post.body?.reduce((acc: number, block: any) => {
      return (
        acc +
        (block.children?.map((c: any) => c.text).join(' ').split(' ').length || 0)
      );
    }, 0) || 0
  const readingTime = Math.max(1, Math.ceil(wordCount / 200))

  // Build Table of Contents
  const headings =
    post.body
      ?.filter((block: any) => block._type === 'block' && /^h[1-3]$/.test(block.style))
      .map((block: any) => {
        const text = block.children?.map((c: any) => c.text).join('')
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        return { text, id, level: block.style }
      }) || []

  const heroImageUrl = post.mainImage?.asset
    ? urlFor(post.mainImage).width(1600).height(800).quality(85).auto('format').url()
    : null

  return (
    <div className="w-full py-10 sm:py-16 px-4 sm:px-6 md:px-10 lg:px-12 max-w-6xl mx-auto">
      {/* 🧭 Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-8">
        <Link href="/blog" className="hover:text-foreground transition-colors">
          Engineering Blog
        </Link>
        <ChevronRight size={12} />
        <span className="text-foreground line-clamp-1">{post.title}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* 🧭 Table of Contents (Sticky Sidebar on Desktop) */}
        {headings.length > 0 && (
          <aside className="hidden lg:block w-64 shrink-0 sticky top-28">
            <div className="apple-card p-6">
              <h3 className="font-bold text-foreground mb-4 uppercase text-xs tracking-wider">
                Contents
              </h3>
              <nav className="flex flex-col gap-2">
                {headings.map((h: any, i: number) => (
                  <a
                    key={i}
                    href={`#${h.id}`}
                    className={`
                      text-xs text-muted-foreground hover:text-primary transition-colors line-clamp-1
                      ${h.level === 'h3' ? 'pl-3' : 'font-medium'}
                    `}
                  >
                    {h.text}
                  </a>
                ))}
              </nav>
            </div>
          </aside>
        )}

        {/* 📰 Main Article Content */}
        <article className="flex-1 min-w-0 max-w-3xl">
          <header className="mb-8 sm:mb-10">
            {post.categories && post.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.categories.map((cat: any) => (
                  <span
                    key={cat.slug || cat.title}
                    className="px-3 py-1 bg-secondary text-secondary-foreground text-xs rounded-full font-semibold border border-border/50"
                  >
                    {cat.title}
                  </span>
                ))}
              </div>
            )}

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground leading-[1.15] tracking-tight mb-5">
              {post.title}
            </h1>

            <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
              {post.publishedAt && (
                <span className="inline-flex items-center gap-1.5">
                  <Calendar size={13} />
                  <time dateTime={post.publishedAt}>
                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                      dateStyle: 'long',
                    })}
                  </time>
                </span>
              )}
              <span>•</span>
              <span className="inline-flex items-center gap-1.5">
                <Clock size={13} />
                <span>{readingTime} min read</span>
              </span>
            </div>
          </header>

          {heroImageUrl && (
            <div className="relative w-full aspect-[2/1] rounded-2xl sm:rounded-3xl overflow-hidden mb-12 border border-border/60 bg-muted/20 shadow-md">
              <Image
                src={heroImageUrl}
                alt={post.mainImage?.alt || post.title}
                fill
                sizes="(max-width: 1024px) 100vw, 800px"
                priority
                className="object-cover"
              />
            </div>
          )}

          <div className="prose prose-neutral dark:prose-invert max-w-none text-foreground/90 leading-relaxed">
            <CustomPortableText
              value={await preHighlightCodeBlocks(addIdsToHeadings(post.body || []))}
            />
          </div>

          <hr className="my-12 border-border/60" />

          {/* Navigation link back to blog */}
          <div className="flex justify-between items-center mb-16">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold bg-secondary hover:bg-muted text-foreground border border-border/70 transition-all shadow-xs"
            >
              <ArrowLeft size={14} />
              <span>Back to All Articles</span>
            </Link>
          </div>

          {/* 📚 Related Articles */}
          {relatedPosts.length > 0 && (
            <section className="pt-8 border-t border-border/60">
              <h3 className="text-xl font-bold tracking-tight text-foreground mb-6">
                Related Articles
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {relatedPosts.map((rel: any) => (
                  <article key={rel._id} className="apple-card p-5 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-semibold text-primary uppercase">
                        {rel.categories?.[0]?.title || 'Insight'}
                      </span>
                      <h4 className="text-base font-bold text-foreground mt-1 mb-2 line-clamp-2">
                        <Link href={`/blog/${rel.slug?.current}`} className="hover:underline">
                          {rel.title}
                        </Link>
                      </h4>
                      {rel.excerpt && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                          {rel.excerpt}
                        </p>
                      )}
                    </div>
                    <Link
                      href={`/blog/${rel.slug?.current}`}
                      className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                    >
                      <span>Read Article</span>
                      <ChevronRight size={12} />
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          )}
        </article>
      </div>
    </div>
  )
}

// Helper to inject IDs into Portable Text blocks for TOC linking
function addIdsToHeadings(blocks: any[]) {
  return blocks?.map((block) => {
    if (block._type === 'block' && /^h[1-3]$/.test(block.style)) {
      const text = block.children?.map((c: any) => c.text).join('')
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      return { ...block, id }
    }
    return block
  })
}

// Helper to pre-render Shiki highlighting on the server
async function preHighlightCodeBlocks(blocks: any[]) {
  if (!blocks) return []
  return Promise.all(
    blocks.map(async (block) => {
      if (block._type === 'codeBlock' && block.code) {
        try {
          const html = await codeToHtml(block.code.trim(), {
            lang: block.language || 'javascript',
            theme: 'one-dark-pro',
          })
          return { ...block, html }
        } catch (e) {
          console.error('Shiki error', e)
        }
      }
      return block
    })
  )
}
