import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ExternalLink, Github } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";
import { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
  featured?: boolean;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const imageUrl = project.mainImage?.asset
    ? urlFor(project.mainImage).width(900).height(560).quality(85).auto("format").url()
    : null;

  const primaryCategory = project.categories?.[0]?.title;
  const projectUrl = project.slug?.current ? `/projects/${project.slug.current}` : "#";
  const visibleTech = (project.technologies || []).slice(0, 3);

  return (
    <article className="group flex flex-col rounded-xl border border-border/70 bg-card text-card-foreground overflow-hidden transition-all duration-300 hover:border-border hover:shadow-xs h-full">
      {/* 🖼️ Controlled Screenshot Showcase (Full Visibility, No Awkward Cropping) */}
      <Link
        href={projectUrl}
        tabIndex={-1}
        aria-hidden="true"
        className="block relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900/60 border-b border-border/40 p-2 sm:p-2.5"
      >
        <div className="relative w-full h-full rounded-md overflow-hidden border border-border/30 bg-background/50 flex items-center justify-center">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={project.mainImage?.alt || project.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-contain p-1 transition-transform duration-500 ease-out group-hover:scale-[1.02]"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[11px] text-muted-foreground/60">
              No Preview Available
            </div>
          )}
        </div>
      </Link>

      {/* 📄 Card Content (Compact 20% Reduction Layout) */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category Eyebrow & Completion Year */}
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
            {primaryCategory ? (
              <span className="font-semibold uppercase tracking-wider text-[10px] sm:text-[11px] text-primary">
                {primaryCategory}
              </span>
            ) : (
              <span className="font-semibold uppercase tracking-wider text-[10px] sm:text-[11px] text-muted-foreground/80">
                Analytics
              </span>
            )}
            {project.date && (
              <span className="text-[11px] text-muted-foreground/70">
                {new Date(project.date).getFullYear()}
              </span>
            )}
          </div>

          {/* Project Title */}
          <h3 className="text-base sm:text-[17px] font-bold tracking-tight text-foreground mb-1.5 group-hover:text-primary transition-colors leading-snug line-clamp-1">
            <Link href={projectUrl} className="focus:outline-none focus-visible:underline">
              {project.title}
            </Link>
          </h3>

          {/* Concise Description: Strictly clamped to 2 lines */}
          {project.shortDescription && (
            <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed line-clamp-2 mb-3">
              {project.shortDescription}
            </p>
          )}
        </div>

        <div>
          {/* Max 3 Technology Badges */}
          {visibleTech.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3.5">
              {visibleTech.map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 text-[10px] sm:text-[11px] font-medium bg-secondary text-secondary-foreground rounded border border-border/40"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}

          {/* Clear, Minimalist Action Pattern */}
          <div className="pt-2.5 border-t border-border/40 flex items-center justify-between text-xs">
            <Link
              href={projectUrl}
              className="inline-flex items-center gap-1 font-semibold text-primary hover:opacity-80 transition-opacity"
            >
              <span>Case Study</span>
              <ArrowUpRight size={13} />
            </Link>

            <div className="flex items-center gap-2.5">
              {project.links?.live && (
                <a
                  href={project.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-medium text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={`Visit live demo for ${project.title}`}
                >
                  <span>Demo</span>
                  <ExternalLink size={11} />
                </a>
              )}
              {project.links?.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-medium text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={`View GitHub source code for ${project.title}`}
                >
                  <Github size={12} />
                  <span>Code</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
