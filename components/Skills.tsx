"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { urlFor } from "@/sanity/lib/image";
import { Skill } from "@/types";

/**
 * 🧠 Skills Component
 * Redesigned Layout: Compact Skill Cards
 * - Displays skills grouped by category in small, easy-to-scan cards.
 */
export default function Skills({ data = [] }: { data?: Skill[] }) {
  if (!data.length) return null;

  // Group skills by category
  const groupedSkills = data.reduce((acc, skill) => {
    const category = skill.category || "Other";
    // Capitalize category for display
    const displayCategory = category.charAt(0).toUpperCase() + category.slice(1);
    if (!acc[displayCategory]) acc[displayCategory] = [];
    acc[displayCategory].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const categories = Object.entries(groupedSkills);

  return (
    <section className="py-20" id="Skills">
      <div className="container-width px-4 md:px-6">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-primary mb-4"
          >
            Technical Arsenal
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            My expertise across various domains and technologies.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {categories.map(([category, skills], idx) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="bg-card border border-border/50 rounded-xl p-5 hover:shadow-md hover:border-primary/30 transition-all duration-300 flex flex-col h-full"
            >
              <h3 className="text-base font-bold text-primary mb-4 border-b border-border/40 pb-2 uppercase tracking-wide">
                {category}
              </h3>
              
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <div 
                    key={skill._id} 
                    className="flex items-center gap-1.5 bg-secondary/10 px-2.5 py-1.5 rounded-md border border-transparent hover:border-primary/20 transition-colors"
                  >
                    {skill.icon?.asset?.url && (
                      <div className="relative w-4 h-4 shrink-0">
                        <Image
                          src={urlFor(skill.icon).width(32).height(32).url()}
                          alt={skill.title}
                          fill
                          className="object-contain"
                          unoptimized
                        />
                      </div>
                    )}
                    <span className="text-xs font-medium text-foreground/80">
                      {skill.title}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}