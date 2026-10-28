/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { sanityFetch } from "@/sanity/lib/fetch";
import { urlFor } from "@/sanity/lib/image";
import CustomPortableText from "@/components/CustomPortableText";
import ProjectCard from "@/components/ui/ProjectCard";
import { Project } from "@/types";
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Calendar,
  Clock,
  Sparkles,
  Layers,
  ChevronRight,
} from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await sanityFetch<Project>({
    query: `*[_type == "project" && slug.current == $slug][0]`,
    params: { slug },
  }).catch(() => null);

  if (!project) return { title: "Project Not Found" };

  return {
    title: `${project.title} | Case Study`,
    description: project.shortDescription || "Technical case study by Kishore Shanmugam.",
    openGraph: {
      title: `${project.title} | Case Study`,
      description: project.shortDescription || "Technical case study by Kishore Shanmugam.",
      images: project.mainImage?.asset
        ? [urlFor(project.mainImage).width(1200).height(630).url()]
        : [],
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;

  // Fetch project and related projects in parallel
  const [project, relatedProjects] = await Promise.all([
    sanityFetch<Project>({
      query: `
        *[_type == "project" && slug.current == $slug][0]{
          title,
          slug,
          shortDescription,
          description,
          mainImage{ asset->{url}, alt },
          technologies,
          links,
          categories[]->{ title, "slug": slug.current },
          date,
          features
        }
      `,
      params: { slug },
      tags: [`project:${slug}`],
    }).catch(() => null),

    sanityFetch<Project[]>({
      query: `
        *[_type == "project" && slug.current != $slug][0...2]{
          _id,
          title,
          slug,
          shortDescription,
          mainImage{ asset->{url}, alt },
          technologies,
          categories[]->{ title, "slug": slug.current },
          date,
          features,
          featured
        }
      `,
      params: { slug },
      tags: ["project"],
    }).catch(() => []),
  ]);

  if (!project) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-bold mb-4">Project Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The requested case study could not be located.
        </p>
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <ArrowLeft size={16} />
          <span>Back to Projects Directory</span>
        </Link>
      </div>
    );
  }

  // Calculate estimated reading time
  const readingTime = Math.max(
    2,
    Math.ceil(
      (project.description?.reduce((acc: number, block: any) => {
        return (
          acc +
          (block.children?.map((c: any) => c.text).join(" ").split(" ").length || 0)
        );
      }, 0) || 0) / 200
    )
  );

  const heroImageUrl = project.mainImage?.asset
    ? urlFor(project.mainImage).width(1800).height(1000).quality(90).auto("format").url()
    : null;

  return (
    <article className="w-full py-10 sm:py-16 px-4 sm:px-6 md:px-10 lg:px-12 max-w-5xl mx-auto">
      {/* 🧭 Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-8">
        <Link href="/projects" className="hover:text-foreground transition-colors">
          Projects
        </Link>
        <ChevronRight size={12} />
        <span className="text-foreground line-clamp-1">{project.title}</span>
      </nav>

      {/* 🏷️ Case Study Header */}
      <header className="mb-10 sm:mb-12">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {project.categories?.map((cat: any) => (
            <span
              key={cat.slug || cat.title}
              className="px-3 py-1 bg-secondary text-secondary-foreground text-xs rounded-full font-semibold border border-border/50"
            >
              {cat.title}
            </span>
          ))}
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight leading-[1.1] mb-6">
          {project.title}
        </h1>

        {project.shortDescription && (
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-3xl mb-6">
            {project.shortDescription}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-muted-foreground">
          {project.date && (
            <span className="inline-flex items-center gap-1.5">
              <Calendar size={13} />
              <time dateTime={project.date}>
                {new Date(project.date).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
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

      {/* 🖼️ Hero Image Showcase */}
      {heroImageUrl && (
        <div className="relative w-full aspect-[16/9] rounded-2xl sm:rounded-3xl overflow-hidden border border-border/60 bg-muted/20 shadow-md mb-12 sm:mb-16">
          <Image
            src={heroImageUrl}
            alt={project.mainImage?.alt || project.title}
            fill
            sizes="(max-width: 1024px) 100vw, 1024px"
            priority
            className="object-cover"
          />
        </div>
      )}

      {/* 📊 Project Metadata & Action Sidebar Grid */}
      <div className="apple-card p-6 sm:p-8 mb-12 sm:mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Role & Scope
            </h4>
            <p className="text-sm font-semibold text-foreground">
              Lead Architecture & Implementation
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Primary Focus
            </h4>
            <p className="text-sm font-semibold text-foreground">
              {project.categories?.[0]?.title || "Data Analytics & ML"}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Deliverables
            </h4>
            <p className="text-sm font-semibold text-foreground">
              Production Service & Dashboard
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Live Deliverables
            </h4>
            <div className="flex items-center gap-2">
              {project.links?.live && (
                <a
                  href={project.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                >
                  <span>Launch Live</span>
                  <ExternalLink size={12} />
                </a>
              )}
              {project.links?.live && project.links?.github && <span>•</span>}
              {project.links?.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-foreground hover:text-primary hover:underline"
                >
                  <Github size={12} />
                  <span>GitHub</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Technology Stack Tags */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="mt-6 pt-6 border-t border-border/50">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">
              Technologies & Infrastructure
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded-md text-xs font-medium bg-secondary text-secondary-foreground border border-border/40"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 🌟 Verified Highlights / Key Features */}
      {project.features && project.features.length > 0 && (
        <div className="apple-card p-6 sm:p-8 mb-12 sm:mb-16 border-l-4 border-l-primary">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={18} className="text-primary" />
            <h3 className="text-base font-bold text-foreground">
              Key Metrics & Architecture Highlights
            </h3>
          </div>
          <ul className="space-y-2.5">
            {project.features.map((feature, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-foreground/90">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                <span className="leading-relaxed">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 📖 Rich Text Case Study Content */}
      {project.description && (
        <div className="prose prose-neutral dark:prose-invert max-w-none text-foreground/90 leading-relaxed mb-16">
          <CustomPortableText value={project.description} />
        </div>
      )}

      {/* 🔗 Primary Action Callouts */}
      {(project.links?.live || project.links?.github) && (
        <div className="flex flex-col sm:flex-row items-center gap-4 py-8 my-12 border-y border-border/50">
          {project.links.live && (
            <a
              href={project.links.live}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-sm"
            >
              <span>Visit Live Deployment</span>
              <ExternalLink size={15} />
            </a>
          )}
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold bg-secondary hover:bg-muted text-foreground border border-border/80 transition-colors shadow-xs"
            >
              <Github size={16} />
              <span>Explore Source Code</span>
            </a>
          )}
        </div>
      )}

      {/* 📚 Related Projects */}
      {relatedProjects && relatedProjects.length > 0 && (
        <section className="mt-16 pt-12 border-t border-border/60">
          <h3 className="text-2xl font-bold tracking-tight text-foreground mb-8">
            Related Projects
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {relatedProjects.map((rel) => (
              <ProjectCard key={rel._id} project={rel} featured={rel.featured} />
            ))}
          </div>
        </section>
      )}

      {/* Footer Back Link */}
      <div className="mt-16 text-center">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
        >
          <ArrowLeft size={16} />
          <span>Back to All Projects</span>
        </Link>
      </div>
    </article>
  );
}
