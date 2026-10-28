import React from "react";
import { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/fetch";
import { Project } from "@/types";
import ProjectsGallery from "@/components/ProjectsGallery";
import SectionHeader from "@/components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "Projects & Engineering Portfolio | Kishore Shanmugam",
  description:
    "Explore production-grade data analytics platforms, machine learning applications, and full-stack software built by Kishore Shanmugam.",
  openGraph: {
    title: "Projects & Engineering Portfolio | Kishore Shanmugam",
    description: "Production data dashboards, ML models, and intelligent AI apps.",
  },
};

export default async function ProjectsPage() {
  // Fetch projects from Sanity server-side
  const projects = await sanityFetch<Project[]>({
    query: `
      *[_type == "project"] | order(date desc) {
        _id,
        title,
        slug,
        shortDescription,
        mainImage { asset->{url}, alt },
        technologies,
        links,
        categories[]->{ title, "slug": slug.current },
        date,
        featured,
        features
      }
    `,
    tags: ["project"],
  }).catch(() => []);

  // Extract unique categories dynamically from server data
  const catMap = new Map<string, string>();
  projects.forEach((p) =>
    p.categories?.forEach((c: any) => {
      const slugVal = typeof c.slug === "string" ? c.slug : c.slug?.current;
      if (slugVal && c.title) catMap.set(slugVal, c.title);
    })
  );

  const categories = Array.from(catMap, ([slug, title]) => ({ slug, title }));

  return (
    <div className="w-full min-h-screen py-10 sm:py-16 px-4 sm:px-6 md:px-10 lg:px-12 max-w-6xl mx-auto">
      {/* Header */}
      <SectionHeader
        eyebrow="Directory"
        title="Project Showcase"
        subtitle="A comprehensive index of interactive dashboards, predictive machine learning pipelines, and intelligent AI engineering projects."
      />

      {/* Interactive Gallery */}
      <ProjectsGallery
        initialProjects={projects}
        categories={categories}
      />
    </div>
  );
}
