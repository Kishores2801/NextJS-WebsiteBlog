'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Fuse from 'fuse.js'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid'
import { motion, AnimatePresence } from 'framer-motion'

export default function BlogHomePage() {
  const [categories, setCategories] = useState<any[]>([])
  const [posts, setPosts] = useState<any[]>([])
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Pagination
  const PAGE_SIZE = 6
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE)

  // 🔥 Fetch categories WITH post count + only used categories
  useEffect(() => {
    const fetchData = async () => {
      const [cats, blogPosts] = await Promise.all([
        client.fetch(`
          *[_type == "category" &&
            count(*[_type == "post" && approved == true && references(^._id)]) > 0
          ] | order(title asc){
            title,
            slug,
            description,
            "count": count(*[_type == "post" && approved == true && references(^._id)])
          }
        `),
        client.fetch(`
          *[_type == "post" && approved == true] | order(publishedAt desc){
            title,
            slug,
            excerpt,
            mainImage{
              asset->{url},
              alt
            },
            categories[]->{title, slug}
          }
        `),
      ])

      setCategories(cats)
      setPosts(blogPosts)
    }

    fetchData()
  }, [])

  // 🧠 Fuzzy search setup
  const fuse = useMemo(() => {
    return new Fuse(posts, {
      keys: ['title', 'excerpt', 'categories.title'],
      threshold: 0.3, // good balance
    })
  }, [posts])

  // 🧠 Apply search → category filter → pagination
  const processedPosts = useMemo(() => {
    let result = posts

    // 🔍 Search filter
    if (searchQuery.trim().length > 0) {
      result = fuse.search(searchQuery).map((r) => r.item)
    }

    // 🏷 Category filter
    if (activeCategory !== 'all') {
      result = result.filter((p: any) =>
        p.categories?.some(
          (cat: any) => cat.slug.current === activeCategory
        )
      )
    }

    return result
  }, [posts, searchQuery, activeCategory, fuse])

  // 📝 Apply pagination
  const visiblePosts = processedPosts.slice(0, visibleCount)

  const loadMore = () => setVisibleCount((prev) => prev + PAGE_SIZE)

  const activeCategoryInfo =
    activeCategory === 'all'
      ? null
      : categories.find((c) => c.slug.current === activeCategory)

  return (
    <main className="max-w-7xl min-h-screen mx-auto px-6 py-16 flex flex-col gap-10 md:flex-row md:gap-12">
      <div className="flex-1">

        {/* 🔍 Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search posts..."
            className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--card)]"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setVisibleCount(PAGE_SIZE) // reset pagination
            }}
          />
        </div>

        {/* 📰 Blog Grid */}
        <section>
          <h2 className="text-3xl font-bold mb-4 text-[var(--color-primary)] tracking-tight">
            {activeCategory === 'all'
              ? 'All Blog Posts'
              : `Category: ${activeCategoryInfo?.title}`}
          </h2>

          {/* Category Description */}
          <AnimatePresence mode="wait">
            {activeCategoryInfo?.description && (
              <motion.p
                key={activeCategory}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
                className="text-sm text-[var(--muted-foreground)] mb-8 border-l-2 border-[var(--color-primary)] pl-3 italic"
              >
                {activeCategoryInfo.description}
              </motion.p>
            )}
          </AnimatePresence>

          {/* 📚 Posts */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory + searchQuery}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              {visiblePosts.length > 0 ? (
                <>
                  <BentoGrid className="max-w-5xl mx-auto md:auto-rows-[18rem]">
                    {visiblePosts.map((post: any) => (
                      <BentoGridItem
                        key={post.slug.current}
                        title={post.title}
                        description={post.excerpt || 'Read more...'}
                        image={
                          post.mainImage?.asset?.url
                            ? urlFor(post.mainImage)
                                .width(1000)
                                .height(600)
                                .quality(90)
                                .fit('crop')
                                .auto('format')
                                .url()
                            : '/images/blog-placeholder.jpg'
                        }
                        href={`/blog/${post.slug.current}`}
                      />
                    ))}
                  </BentoGrid>

                  {/* Pagination */}
                  {visibleCount < processedPosts.length && (
                    <div className="text-center mt-6">
                      <button
                        onClick={loadMore}
                        className="px-6 py-2 rounded-full bg-[var(--color-primary)] text-white font-medium hover:opacity-90 transition"
                      >
                        Load More
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-center text-[var(--muted-foreground)] mt-10">
                  No posts found.
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </section>
      </div>

      {/* 🧭 Sidebar: Categories */}
      <aside className="w-full md:w-64 md:sticky md:top-28 h-fit p-4 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-md">
        <h2 className="text-lg font-semibold mb-4 text-[var(--color-primary)]">
          Categories
        </h2>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => {
              setActiveCategory('all')
              setVisibleCount(PAGE_SIZE)
            }}
            className={`text-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              activeCategory === 'all'
                ? 'bg-[var(--color-primary)] text-white'
                : 'hover:bg-[var(--muted)] text-[var(--foreground)]'
            }`}
          >
            All ({posts.length})
          </button>

          {/* Only categories with at least 1 post → with post count */}
          {categories.map((cat) => (
            <button
              key={cat.slug.current}
              onClick={() => {
                setActiveCategory(cat.slug.current)
                setVisibleCount(PAGE_SIZE)
              }}
              className={`text-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === cat.slug.current
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'hover:bg-[var(--muted)] text-[var(--foreground)]'
              }`}
            >
              {cat.title} ({cat.count})
            </button>
          ))}
        </div>
      </aside>
    </main>
  )
}
