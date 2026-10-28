"use client";

import React from "react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { Skill } from "@/types";
import SectionHeader from "@/components/ui/SectionHeader";
import { BarChart, Code2, Cpu, ClipboardList, Globe } from "lucide-react";

interface SkillsProps {
  data?: Skill[];
}

interface StackCategory {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  matchFn: (skill: Skill) => boolean;
}

export default function Skills({ data = [] }: SkillsProps) {
  if (!data || data.length === 0) return null;

  // Strict 5-category definition adhering directly to the user brief
  const categories: StackCategory[] = [
    {
      id: "analytics",
      label: "Analytics & Visualization",
      icon: BarChart,
      matchFn: (s) => {
        const title = s.title.toLowerCase();
        const cat = (s.category || "").toLowerCase();
        return (
          cat.includes("visualization") ||
          cat.includes("data science") ||
          ["powerbi", "plotly", "dash", "streamlit", "d3", "matplotlib", "seaborn"].some(
            (t) => title.includes(t)
          )
        );
      },
    },
    {
      id: "programming",
      label: "Programming & Data Engineering",
      icon: Code2,
      matchFn: (s) => {
        const title = s.title.toLowerCase();
        const cat = (s.category || "").toLowerCase();
        return (
          (cat.includes("programming") || cat.includes("database")) &&
          !title.includes("sawtooth")
        );
      },
    },
    {
      id: "ml",
      label: "Machine Learning & AI",
      icon: Cpu,
      matchFn: (s) => {
        const title = s.title.toLowerCase();
        const cat = (s.category || "").toLowerCase();
        return (
          cat.includes("machine learning") ||
          cat.includes("ai") ||
          ["scikit", "tensorflow", "pytorch", "hugging face"].some((t) =>
            title.includes(t)
          )
        );
      },
    },
    {
      id: "survey",
      label: "Survey Programming & Research Tools",
      icon: ClipboardList,
      // Sawtooth strictly placed under survey tools
      matchFn: (s) => {
        const title = s.title.toLowerCase();
        const cat = (s.category || "").toLowerCase();
        return (
          title.includes("sawtooth") ||
          title.includes("lighthouse") ||
          cat.includes("survey")
        );
      },
    },
    {
      id: "web",
      label: "Web Development & Deployment",
      icon: Globe,
      matchFn: (s) => {
        const title = s.title.toLowerCase();
        const cat = (s.category || "").toLowerCase();
        // Exclude sawtooth which is survey software
        if (title.includes("sawtooth")) return false;
        return (
          cat.includes("cloud") ||
          cat.includes("tools") ||
          cat.includes("web") ||
          ["git", "firebase", "docker", "cloud run", "next"].some((t) =>
            title.includes(t)
          )
        );
      },
    },
  ];

  // Group skills while ensuring each skill appears in its primary appropriate category
  const assigned = new Set<string>();
  const categorized = categories.map((cat) => {
    const matched = data.filter((s) => !assigned.has(s._id) && cat.matchFn(s));
    matched.forEach((s) => assigned.add(s._id));
    return {
      ...cat,
      skills: matched,
    };
  });

  // Any remaining skills fall back to web/tools
  const unassigned = data.filter((s) => !assigned.has(s._id));
  if (unassigned.length > 0) {
    categorized[categorized.length - 1].skills.push(...unassigned);
  }

  return (
    <section id="Skills" className="w-full py-10 sm:py-14 scroll-mt-24">
      <SectionHeader
        eyebrow="Stack"
        title="Technical Stack"
        subtitle="Core programming languages, analytical platforms, machine learning libraries, and deployment tools."
      />

      {/* Compact Categories Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
        {categorized.map((group) => {
          const Icon = group.icon;
          return (
            <div
              key={group.id}
              className="p-5 rounded-xl border border-border/70 bg-card text-card-foreground flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2.5 mb-3.5 pb-2.5 border-b border-border/50">
                  <div className="text-primary">
                    <Icon size={16} />
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                    {group.label}
                  </h3>
                </div>

                {/* Small Technology Badges */}
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <div
                      key={skill._id}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-medium border border-border/40"
                    >
                      {skill.icon?.asset && (
                        <div className="relative w-3.5 h-3.5 shrink-0">
                          <Image
                            src={urlFor(skill.icon).width(28).height(28).quality(85).url()}
                            alt={skill.title}
                            width={14}
                            height={14}
                            className="object-contain"
                          />
                        </div>
                      )}
                      <span>{skill.title}</span>
                    </div>
                  ))}
                  {group.skills.length === 0 && (
                    <span className="text-xs text-muted-foreground/60 italic">
                      Configured in CMS
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}