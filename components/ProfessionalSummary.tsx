"use client";

import React from "react";
import { PortableText, PortableTextBlock } from "next-sanity";

interface ProfessionalSummaryProps {
  data?: PortableTextBlock[];
}

export default function ProfessionalSummary({ data }: ProfessionalSummaryProps) {
  if (!data || data.length === 0) return null;

  return (
    <section 
      id="Summary" 
      aria-label="Professional Summary" 
      className="w-full pt-2 pb-8 sm:pb-12 scroll-mt-24 border-b border-border/40"
    >
      <div className="max-w-3xl mx-auto">
        {/* Subtle Apple-style Eyebrow with Blinking Blue Dot */}
        <div className="flex items-center gap-2 mb-3">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping motion-reduce:animate-none absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Professional Summary
          </span>
        </div>

        {/* Clean Editorial Typography */}
        <div className="prose prose-neutral dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed text-foreground/85 [&>p]:mb-3 [&>p:last-child]:mb-0">
          <PortableText value={data} />
        </div>
      </div>
    </section>
  );
}
