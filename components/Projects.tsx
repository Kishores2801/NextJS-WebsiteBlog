"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Project } from "@/types";
import SectionHeader from "@/components/ui/SectionHeader";
import ProjectCard from "@/components/ui/ProjectCard";

interface ProjectsProps {
  data?: Project[];
}

export default function Projects({ data = [] }: ProjectsProps) {
  if (!data || data.length === 0) return null;

  // Filter featured projects; fallback to first projects if none marked featured
  const featured = data.filter((p) => p.featured);
  // Optimal 3-column desktop count: 6 or 3
  const displayProjects =
    featured.length >= 6
      ? featured.slice(0, 6)
      : featured.length >= 3
      ? featured.slice(0, 3)
      : data.slice(0, Math.min(6, data.length));

  return (
    <section id="Projects" className="w-full py-10 sm:py-14 scroll-mt-24">
      <SectionHeader
        eyebrow="Portfolio"
        title="Featured Projects"
        subtitle="Selected production analytics platforms, predictive models, and intelligent web applications."
      />

      {/* 3-Column Desktop Grid / 2-Column Tablet / 1-Column Mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-10 max-w-5xl mx-auto">
        {displayProjects.map((project) => (
          <ProjectCard
            key={project._id}
            project={project}
            featured={project.featured}
          />
        ))}
      </div>

      {/* View All Projects Action */}
      <div className="text-center">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-semibold bg-secondary hover:bg-muted text-foreground border border-border/70 hover:border-border transition-all shadow-xs group"
        >
          <span>View All Projects ({data.length})</span>
          <ArrowRight
            size={13}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </div>
    </section>
  );
}
