import React from "react";
import { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/fetch";
import BlogGallery from "@/components/BlogGallery";
import SectionHeader from "@/components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "Engineering Blog & Technical Insights | Kishore Shanmugam",
  description:
    "Articles, tutorials, and algorithmic deep dives on data mining, machine learning, and analytics engineering by Kishore Shanmugam.",
  openGraph: {
    title: "Engineering Blog & Technical Insights | Kishore Shanmugam",
    description: "Data mining, machine learning, and analytics engineering articles.",
  },
};

export default async function BlogPage() {
  const [categories, posts] = await Promise.all([
    sanityFetch<any[]>({
      query: `
        *[_type == "category" &&
          count(*[_type == "post" && approved == true && references(^._id)]) > 0
        ] | order(title asc){
          title,
          slug,
          description,
          "count": count(*[_type == "post" && approved == true && references(^._id)])
        }
      `,
      tags: ["category", "post"],
    }).catch(() => []),

    sanityFetch<any[]>({
      query: `
        *[_type == "post" && approved == true] | order(publishedAt desc){
          _id,
          title,
          slug,
          excerpt,
          publishedAt,
          mainImage{
            asset->{url},
            alt
          },
          categories[]->{title, slug}
        }
      `,
      tags: ["post"],
    }).catch(() => []),
  ]);

  return (
    <div className="w-full min-h-screen py-10 sm:py-16 px-4 sm:px-6 md:px-10 lg:px-12 max-w-6xl mx-auto">
      {/* Header */}
      <SectionHeader
        eyebrow="Journal"
        title="Engineering Blog"
        subtitle="Technical articles, algorithmic teardowns, and mathematical principles behind intelligent systems and business analytics."
      />

      <BlogGallery
        initialPosts={posts}
        categories={categories}
      />
    </div>
  );
}
