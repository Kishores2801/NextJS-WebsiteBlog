"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import Fuse from "fuse.js";
import { urlFor } from "@/sanity/lib/image";
import { Search, Calendar, ArrowRight, BookOpen } from "lucide-react";

interface Category {
  title: string;
  slug: { current: string };
  description?: string;
  count?: number;
}

interface PostItem {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  publishedAt: string;
  mainImage?: any;
  categories?: Array<{ title: string; slug: { current: string } }>;
}

interface BlogGalleryProps {
  initialPosts: PostItem[];
  categories: Category[];
}

const PAGE_SIZE = 6;

export default function BlogGallery({
  initialPosts,
  categories,
}: BlogGalleryProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);

  // Fuse.js fuzzy search setup
  const fuse = useMemo(() => {
    return new Fuse(initialPosts, {
      keys: ["title", "excerpt", "categories.title"],
      threshold: 0.35,
    });
  }, [initialPosts]);

  // Combined search and category filtering
  const filteredPosts = useMemo(() => {
    let result = initialPosts;

    if (searchQuery.trim().length > 0) {
      result = fuse.search(searchQuery).map((r) => r.item);
    }

    if (activeCategory !== "all") {
      result = result.filter((p) =>
        p.categories?.some((cat) => cat.slug?.current === activeCategory)
      );
    }

    return result;
  }, [initialPosts, searchQuery, activeCategory, fuse]);

  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPosts.length;

  const activeCategoryInfo =
    activeCategory === "all"
      ? null
      : categories.find((c) => c.slug?.current === activeCategory);

  return (
    <div className="w-full">
      {/* 🧭 Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 max-w-5xl mx-auto">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 w-full sm:w-auto">
          <button
            onClick={() => {
              setActiveCategory("all");
              setVisibleCount(PAGE_SIZE);
            }}
            type="button"
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeCategory === "all"
                ? "bg-foreground text-background shadow-xs"
                : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted border border-border/50"
            }`}
          >
            All Articles ({initialPosts.length})
          </button>

          {categories.map((cat) => (
            <button
              key={cat.slug?.current || cat.title}
              onClick={() => {
                setActiveCategory(cat.slug?.current);
                setVisibleCount(PAGE_SIZE);
              }}
              type="button"
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeCategory === cat.slug?.current
                  ? "bg-foreground text-background shadow-xs"
                  : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted border border-border/50"
              }`}
            >
              {cat.title} {cat.count !== undefined ? `(${cat.count})` : ""}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64 shrink-0">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setVisibleCount(PAGE_SIZE);
            }}
            className="w-full h-9 pl-9 pr-3.5 rounded-full border border-border/80 bg-background text-foreground text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/60 transition-all"
          />
        </div>
      </div>

      {/* Category Description Banner if selected */}
      {activeCategoryInfo?.description && (
        <div className="apple-card p-4 sm:p-5 mb-8 max-w-3xl mx-auto border-l-4 border-l-primary text-xs sm:text-sm text-muted-foreground">
          {activeCategoryInfo.description}
        </div>
      )}

      {/* 📚 Articles Grid */}
      {visiblePosts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {visiblePosts.map((post) => {
              const imageUrl = post.mainImage?.asset
                ? urlFor(post.mainImage).width(800).height(450).quality(85).auto("format").url()
                : null;

              const category = post.categories?.[0]?.title;
              const articleUrl = `/blog/${post.slug?.current}`;

              return (
                <article
                  key={post._id}
                  className="apple-card group flex flex-col overflow-hidden h-full"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted/30 border-b border-border/40">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={post.mainImage?.alt || post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground/40 bg-secondary">
                        <BookOpen size={32} />
                      </div>
                    )}

                    {category && (
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider bg-background/90 dark:bg-card/90 text-foreground backdrop-blur-md rounded-full border border-border/60 shadow-xs">
                          {category}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                    <div>
                      {post.publishedAt && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3 font-medium">
                          <Calendar size={12} />
                          <time dateTime={post.publishedAt}>
                            {new Date(post.publishedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </time>
                        </div>
                      )}

                      <h3 className="text-xl font-bold tracking-tight text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2 mb-3">
                        <Link href={articleUrl} className="focus:outline-none focus-visible:underline">
                          {post.title}
                        </Link>
                      </h3>

                      {post.excerpt && (
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-6">
                          {post.excerpt}
                        </p>
                      )}
                    </div>

                    <div className="pt-4 border-t border-border/50">
                      <Link
                        href={articleUrl}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary group/link hover:opacity-80 transition-opacity"
                      >
                        <span>Read Full Article</span>
                        <ArrowRight
                          size={13}
                          className="transition-transform group-hover/link:translate-x-1"
                        />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Load More Pagination */}
          {hasMore && (
            <div className="text-center mt-12">
              <button
                onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                type="button"
                className="px-6 py-2.5 rounded-full text-xs font-semibold bg-secondary hover:bg-muted text-foreground border border-border/70 hover:border-border transition-all shadow-xs"
              >
                Load More Articles
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="apple-card p-12 text-center max-w-md mx-auto my-12">
          <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-muted-foreground mx-auto mb-4">
            <BookOpen size={24} />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">No Articles Found</h3>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            No articles match your query. Try a different search term or category.
          </p>
          <button
            onClick={() => {
              setActiveCategory("all");
              setSearchQuery("");
            }}
            type="button"
            className="px-5 py-2 text-xs font-semibold rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
