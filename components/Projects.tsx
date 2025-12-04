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

  // Extract unique categories
  const categories = Array.from(
    new Map(
      data.flatMap((p) =>
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
              {filteredProjects.map((project) => (
                <motion.div
                  key={project._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ duration: 0.4 }}
                  className="
                    flex-none w-[75vw] sm:w-[280px] 
                    snap-center 
                    bg-card border border-border/50 rounded-2xl overflow-hidden 
                    shadow-soft hover:shadow-lg hover:shadow-primary/10 
                    hover:-translate-y-1 transition-all duration-500
                    group
                  "
                >
                  {/* Image Container */}
                  <div className="relative h-25 w-full overflow-hidden">
                    {project.mainImage?.asset ? (
                      <Image
                        src={urlFor(project.mainImage).width(600).height(400).url()}
                        alt={project.mainImage.alt || project.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                        No Image
                      </div>
                    )}
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                    {/* Links Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                      {project.links?.live && (
                        <a
                          href={project.links.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-white text-black rounded-full hover:scale-110 hover:bg-primary hover:text-white transition-all shadow-lg"
                          title="Live Site"
                        >
                          <FaExternalLinkAlt size={16} />
                        </a>
                      )}
                      {project.links?.github && (
                        <a
                          href={project.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-black text-white rounded-full hover:scale-110 hover:bg-primary transition-all shadow-lg border border-white/20"
                          title="GitHub Repo"
                        >
                          <FaGithub size={18} />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                    </div>
                    
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-4 leading-relaxed">
                      {project.shortDescription}
                    </p>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies?.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 text-[10px] font-semibold bg-secondary/5 text-secondary border border-secondary/10 rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                      {(project.technologies?.length || 0) > 3 && (
                        <span className="px-2 py-1 text-[10px] font-semibold bg-muted text-muted-foreground rounded-full">
                          +{project.technologies!.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Details Link */}
                    <Link 
                      href={`/projects/${project.slug.current}`}
                      className="w-full flex items-center justify-center gap-2 py-2 text-sm font-semibold text-primary border border-primary/20 rounded-lg hover:bg-primary hover:text-white transition-all group/btn"
                    >
                      View Details <FaArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

        <div className="mt-6 text-center">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-lg font-semibold text-foreground hover:text-primary transition-colors group"
          >
            View All Projects 
            <IconArrowNarrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
