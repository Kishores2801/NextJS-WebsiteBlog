"use client";

import React, { useState, useMemo } from "react";
import { Project } from "@/types";
import ProjectCard from "@/components/ui/ProjectCard";
import { Search, FolderKanban } from "lucide-react";

interface ProjectsGalleryProps {
  initialProjects: Project[];
  categories: { title: string; slug: string }[];
}

export default function ProjectsGallery({
  initialProjects,
  categories,
}: ProjectsGalleryProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filter projects dynamically
  const filteredProjects = useMemo(() => {
    return initialProjects.filter((project) => {
      // Category match
      const matchesCategory =
        activeCategory === "all" ||
        project.categories?.some((c) => c.slug.current === activeCategory);

      // Search match
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        project.title.toLowerCase().includes(query) ||
        project.shortDescription?.toLowerCase().includes(query) ||
        project.technologies?.some((t) => t.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [initialProjects, activeCategory, searchQuery]);

  return (
    <div className="w-full">
      {/* 🧭 Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 max-w-5xl mx-auto">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 w-full sm:w-auto">
          <button
            onClick={() => setActiveCategory("all")}
            type="button"
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeCategory === "all"
                ? "bg-foreground text-background shadow-xs"
                : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted border border-border/50"
            }`}
          >
            All ({initialProjects.length})
          </button>
          {categories.map((cat) => {
            const count = initialProjects.filter((p) =>
              p.categories?.some((c) => c.slug.current === cat.slug)
            ).length;

            return (
              <button
                key={cat.slug}
                onClick={() => setActiveCategory(cat.slug)}
                type="button"
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeCategory === cat.slug
                    ? "bg-foreground text-background shadow-xs"
                    : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted border border-border/50"
                }`}
              >
                {cat.title} ({count})
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64 shrink-0">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder="Search projects or tech..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-3.5 rounded-full border border-border/80 bg-background text-foreground text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/60 transition-all"
          />
        </div>
      </div>

      {/* 🖼️ Responsive 3-Column Project Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 max-w-5xl mx-auto">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              featured={project.featured}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="apple-card p-12 text-center max-w-md mx-auto my-12">
          <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-muted-foreground mx-auto mb-4">
            <FolderKanban size={24} />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">No Projects Found</h3>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            No projects match the selected category or search query. Try clearing your filters.
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
