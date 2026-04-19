"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { motion, AnimatePresence } from "framer-motion";
import { IconArrowNarrowRight } from "@tabler/icons-react";
import { FaGithub, FaExternalLinkAlt, FaArrowRight } from "react-icons/fa";
import { Project } from "@/types";
import Link from "next/link";

/**
 * 🏗️ Projects Component
 * Displays a filtered list of projects with premium styling.
 */
export default function Projects({ data = [] }: { data?: Project[] }) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!data.length) return null;

  // Extract unique categories from featured projects only
  const categories = Array.from(
    new Map(
      data
        .filter((p) => p.featured)
        .flatMap((p) =>
          p.categories?.map((c) => [c.slug.current, c.title]) || []
        )
    ).entries()
  ).map(([slug, title]) => ({ slug, title }));

  // Filter logic
  const filteredProjects =
    activeCategory === "all"
      ? data
      : data.filter((p) =>
          p.categories?.some((cat) => cat.slug.current === activeCategory)
        );

  // Determine projects to display
  // If a category is selected, show all filtered projects.
  // Otherwise, show only 3 featured projects for the home section.
  const projectsToDisplay =
    activeCategory !== "all"
      ? filteredProjects
      : data.filter((p) => p.featured).slice(0, 3);

  // Scroll handler
  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      const amount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({
        left: dir === "left" ? -amount : amount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-20 relative overflow-hidden" id="Projects">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.02] -z-10" />
      <div className="absolute -left-20 top-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-10" />

      <div className="container-width">
        <div className="text-center mb-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-primary mb-2"
          >
            Featured Projects
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground max-w-2xl mx-auto text-lg"
          >
            A selection of my recent work, ranging from web apps to design systems.
          </motion.p>
        </div>

        {/* 🧩 Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-5">
          <button
            onClick={() => setActiveCategory("all")}
            className={`
              px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border
              ${
                activeCategory === "all"
                  ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25 scale-105"
                  : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
              }
            `}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setActiveCategory(cat.slug)}
              className={`
                px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border
                ${
                  activeCategory === cat.slug
                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25 scale-105"
                    : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                }
              `}
            >
              {cat.title}
            </button>
          ))}
        </div>

          {/* Cards Container */}
          <motion.div
            ref={scrollRef}
            layout
            className="flex gap-5 overflow-x-auto no-scrollbar py-10 px-4 snap-x snap-mandatory justify-center"
          >
            <AnimatePresence mode="popLayout">
              {projectsToDisplay.map((project) => (
                <motion.div
                  key={project._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ duration: 0.4 }}
                  className="
                    flex-none w-[85vw] sm:w-[340px] 
                    snap-center 
                    bg-card border border-border/40 rounded-3xl overflow-hidden 
                    shadow-soft hover:shadow-2xl hover:shadow-primary/5 
                    hover:-translate-y-2 transition-all duration-500
                    group
                  "
                >
                  {/* Image Container */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden">
                    {project.mainImage?.asset ? (
                      <Image
                        src={urlFor(project.mainImage).width(800).height(500).url()}
                        alt={project.mainImage.alt || project.title}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full bg-muted/30 flex items-center justify-center text-muted-foreground/50">
                        No Preview Available
                      </div>
                    )}
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Links Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-8 group-hover:translate-y-0">
                      {project.links?.live && (
                        <a
                          href={project.links.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 hover:bg-primary hover:text-white transition-all shadow-xl"
                          title="View Live"
                        >
                          <FaExternalLinkAlt size={18} />
                        </a>
                      )}
                      {project.links?.github && (
                        <a
                          href={project.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center hover:scale-110 hover:bg-primary transition-all shadow-xl border border-white/10"
                          title="Source Code"
                        >
                          <FaGithub size={20} />
                        </a>
                      )}
                    </div>

                    {/* Featured Tag (on image) */}
                    {project.featured && (
                      <div className="absolute top-4 left-4 z-10">
                        <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-primary/90 text-primary-foreground backdrop-blur-md rounded-full border border-white/10 shadow-lg">
                          Featured
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-foreground tracking-tight group-hover:text-primary transition-colors duration-300">
                        {project.title}
                      </h3>
                    </div>
                    
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-6 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                      {project.shortDescription}
                    </p>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2 mb-8">
                      {project.technologies?.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 text-[11px] font-medium bg-secondary text-secondary-foreground rounded-lg border border-border/50 group-hover:border-primary/20 transition-colors"
                        >
                          {tech}
                        </span>
                      ))}
                      {(project.technologies?.length || 0) > 3 && (
                        <span className="px-3 py-1 text-[11px] font-medium bg-muted/50 text-muted-foreground rounded-lg">
                          +{project.technologies!.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Action Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-border/40">
                      <Link 
                        href={`/projects/${project.slug.current}`}
                        className="flex items-center gap-2 text-sm font-bold text-primary group/btn"
                      >
                        Case Study 
                        <FaArrowRight size={12} className="group-hover/btn:translate-x-1.5 transition-transform duration-300" />
                      </Link>
                      
                      {/* Subtle Category Reveal */}
                      <span className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground/40 group-hover:text-primary/40 transition-colors">
                        {project.categories?.[0]?.title || "Development"}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

        <div className="mt-12 text-center">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-full font-bold hover:scale-105 transition-all shadow-lg shadow-primary/20 group"
          >
            View All Projects
            <IconArrowNarrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
