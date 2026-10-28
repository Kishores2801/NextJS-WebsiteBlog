"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, Mail } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";
import { HeroData } from "@/types";

interface HeroProps {
  data?: HeroData;
}

export default function Hero({ data }: HeroProps) {
  if (!data) return null;

  const { name, tagline, profileImage } = data;

  // Generate crisp, high-resolution retina-ready image URL via Sanity CDN pipeline
  let imageUrl: string | null = null;
  if (profileImage) {
    try {
      imageUrl = urlFor(profileImage)
        .width(800)
        .height(800)
        .quality(100)
        .fit("crop")
        .auto("format")
        .url();
    } catch {
      imageUrl = profileImage.asset?.url || null;
    }
  }

  const headline = tagline || "Turning complex data into intelligent, actionable solutions.";
  const professionalRole = "Lead Data Analyst";
  const professionalSubhead =
    "Lead Data Analyst exploring the intersection of Business Analytics, Machine Learning, and AI Engineering.";

  return (
    <section 
      aria-label="Introduction" 
      className="w-full pt-6 pb-6 sm:pt-10 sm:pb-10 flex flex-col items-center justify-center text-center"
    >
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        {/* 1. Understated Professional Eyebrow with Blinking Blue Dot */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 mb-5 rounded-full text-xs font-semibold tracking-wide bg-secondary text-muted-foreground border border-border/60">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping motion-reduce:animate-none absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          <span>{name || "Kishore Shanmugam"} • {professionalRole}</span>
        </div>

        {/* 2. Profile Photograph (+35% larger, positioned directly after name & role eyebrow) */}
        {imageUrl && (
          <div className="relative mb-6">
            <div className="relative w-32 h-32 sm:w-[152px] sm:h-[152px] rounded-full overflow-hidden border-2 border-border/80 shadow-md bg-muted">
              <Image
                src={imageUrl}
                alt={profileImage?.alt || `${name || "Kishore"} Profile`}
                fill
                sizes="(max-width: 640px) 256px, 304px"
                quality={95}
                priority
                className="object-cover"
              />
            </div>
          </div>
        )}

        {/* 3. Headline (Reduced, elegant editorial font size for balanced hierarchy) */}
        <h1 className="text-2xl sm:text-3xl md:text-[40px] font-bold tracking-tight text-foreground leading-[1.2] max-w-2xl mb-3 sm:mb-4">
          {headline}
        </h1>

        {/* 4. Subhead */}
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-lg font-normal mb-7">
          {professionalSubhead}
        </p>

        {/* 5. Primary & Secondary CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Link
            href="#Projects"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-foreground text-background hover:opacity-90 active:scale-[0.98] transition-all shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <span>Explore Projects</span>
            <ArrowDown size={14} />
          </Link>

          <Link
            href="#Contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-secondary hover:bg-muted text-foreground border border-border/80 active:scale-[0.98] transition-all shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <span>Contact Me</span>
            <Mail size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
