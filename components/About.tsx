"use client";

import React from "react";
import Image from "next/image";
import {
  BarChart3,
  LineChart,
  PieChart,
  Brain,
  Cpu,
  Bot,
  Sparkles,
  ClipboardCheck,
  FileText,
  Database,
  Code2,
  Terminal,
  Globe,
  Cloud,
  Server,
  Search,
  Activity,
  Layers,
  ShieldCheck,
  Workflow,
  Target,
  LayoutDashboard,
  LucideIcon,
} from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { urlFor } from "@/sanity/lib/image";

// Preset icon registry mapping Sanity icon strings to Lucide components
const PRESET_ICONS: Record<string, LucideIcon> = {
  "bar-chart": BarChart3,
  "line-chart": LineChart,
  "pie-chart": PieChart,
  brain: Brain,
  cpu: Cpu,
  bot: Bot,
  sparkles: Sparkles,
  "clipboard-check": ClipboardCheck,
  "file-text": FileText,
  database: Database,
  code: Code2,
  terminal: Terminal,
  globe: Globe,
  cloud: Cloud,
  server: Server,
  search: Search,
  activity: Activity,
  layers: Layers,
  "shield-check": ShieldCheck,
  workflow: Workflow,
  target: Target,
  "layout-dashboard": LayoutDashboard,
};

export interface AboutItem {
  _key?: string;
  title: string;
  description: string;
  icon?: string;
  customIcon?: {
    asset?: { url?: string; _ref?: string };
    alt?: string;
  };
}

interface AboutProps {
  initialData?: {
    moreAbout?: {
      items?: AboutItem[];
    };
  };
}

export default function About({ initialData }: AboutProps) {
  if (!initialData) return null;

  const items = initialData.moreAbout?.items || [];

  // Match existing Sanity items by keywords if using legacy 5-item structure
  const surveyItem = items.find((i) => /survey/i.test(i.title));
  const mlItem = items.find((i) => /machine learning/i.test(i.title));
  const analyticsItems = items.filter((i) => /analys|visualiz|cleaning/i.test(i.title));
  const webItem = items.find((i) => /web|deploy|cloud/i.test(i.title));

  // Determine whether Sanity has directly configured 4+ modern items with custom icons
  const hasDirectConfig = items.length >= 4 && items.some((i) => i.icon || i.customIcon);

  // Define 4 Core Expertise Pillars adhering to user specifications
  const capabilities = hasDirectConfig
    ? items.map((item) => ({
        id: item._key || item.title,
        title: item.title,
        summary: item.description,
        iconKey: item.icon || "bar-chart",
        customIcon: item.customIcon,
      }))
    : [
        {
          id: "analytics",
          title: "Business Analytics & Data Visualization",
          summary:
            analyticsItems.length > 0
              ? analyticsItems.map((i) => i.description).join(" ")
              : "Transforming raw transactional and operational datasets into executive dashboards, automated reporting pipelines, and quantifiable KPIs using Power BI, Plotly, and SQL.",
          iconKey: analyticsItems.find((i) => i.icon)?.icon || "bar-chart",
          customIcon: analyticsItems.find((i) => i.customIcon)?.customIcon,
        },
        {
          id: "ml",
          title: "Machine Learning & AI",
          summary:
            mlItem?.description ||
            "Engineering predictive models, classification algorithms, customer segmentation frameworks, and LLM-assisted vector search applications using Python, scikit-learn, and TensorFlow.",
          iconKey: mlItem?.icon || "brain",
          customIcon: mlItem?.customIcon,
        },
        {
          id: "survey",
          title: "Survey Programming & Research Technology",
          summary:
            surveyItem?.description ||
            "Scripting advanced survey routing logic, complex validation algorithms, and data collection automation using JavaScript, HTML/CSS, and research platforms like Sawtooth and Lighthouse Studio.",
          iconKey: surveyItem?.icon || "clipboard-check",
          customIcon: surveyItem?.customIcon,
        },
        {
          id: "web",
          title: "Web Development & Deployment",
          summary:
            webItem?.description ||
            "Building responsive, high-performance web applications and containerized analytics services deployed to production environments using Next.js, TypeScript, Docker, and Google Cloud Run.",
          iconKey: webItem?.icon || "globe",
          customIcon: webItem?.customIcon,
        },
      ];

  return (
    <section id="About" className="w-full py-10 sm:py-14 scroll-mt-24">
      <SectionHeader
        eyebrow="Expertise"
        title="Core Expertise"
        subtitle="Analytical rigor, predictive modeling, research automation, and full-stack deployment."
      />

      {/* 4 Compact Capability Cards: 2-Column Responsive Desktop Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 max-w-5xl mx-auto">
        {capabilities.map((cap) => {
          const IconComponent = PRESET_ICONS[cap.iconKey] || BarChart3;
          const customUrl = cap.customIcon?.asset
            ? cap.customIcon.asset.url || urlFor(cap.customIcon).width(48).height(48).url()
            : null;

          return (
            <div
              key={cap.id}
              className="p-5 sm:p-6 rounded-xl border border-border/70 bg-card text-card-foreground flex flex-col justify-between transition-colors hover:border-border"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  {/* Mini Logo Container matching Apple HIG design */}
                  <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-primary shrink-0 border border-border/40 overflow-hidden">
                    {customUrl ? (
                      <Image
                        src={customUrl}
                        alt={cap.customIcon?.alt || `${cap.title} icon`}
                        width={20}
                        height={20}
                        className="object-contain"
                      />
                    ) : (
                      <IconComponent size={17} />
                    )}
                  </div>
                  <h3 className="text-base font-bold tracking-tight text-foreground">
                    {cap.title}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {cap.summary}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
