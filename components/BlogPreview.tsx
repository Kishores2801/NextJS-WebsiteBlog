import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, BookOpen } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";
import SectionHeader from "@/components/ui/SectionHeader";

export interface BlogPostPreview {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  excerpt?: string;
  mainImage?: any;
  categories?: Array<{ title: string; slug: { current: string } }>;
  readingTime?: number;
}

interface BlogPreviewProps {
  posts?: BlogPostPreview[];
}

export default function BlogPreview({ posts = [] }: BlogPreviewProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <section id="Blog" className="w-full py-12 sm:py-16 scroll-mt-24">
      {/* Section Header */}
      <SectionHeader
        eyebrow="Writing"
        title="Technical Articles & Insights"
        subtitle="In-depth walkthroughs on data mining, algorithmic recommendation engines, and modern analytics engineering."
      />

      {/* Editorial Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
        {posts.map((post) => {
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
              {/* Thumbnail */}
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

              {/* Content */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3 font-medium">
                    {post.publishedAt && (
                      <span className="inline-flex items-center gap-1">
                        <Calendar size={12} />
                        <time dateTime={post.publishedAt}>
                          {new Date(post.publishedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </time>
                      </span>
                    )}
                    <span>•</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock size={12} />
                      <span>{post.readingTime || 5} min read</span>
                    </span>
                  </div>

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

                {/* Card Footer Link */}
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

      {/* View All Posts Button */}
      <div className="text-center pt-2">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-secondary hover:bg-muted text-foreground border border-border/70 hover:border-border transition-all shadow-xs group"
        >
          <span>Visit Engineering Blog</span>
          <ArrowRight
            size={15}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>
      </div>
    </section>
  );
}
