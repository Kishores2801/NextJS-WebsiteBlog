"use client";

import React from "react";
import Image from "next/image";
import { Button } from "./ui/moving-border"; // Keeping existing UI component
import NavLink from "./NavLink";
import Typewriter from "typewriter-effect";
import { motion } from "framer-motion";
import { urlFor } from "@/sanity/lib/image";
import { HeroData } from "@/types";

/**
 * 🦸 Hero Component
 * Displays the main introduction.
 * - Accepts `data` as props (SSR).
 * - Responsive layout with Gestalt principles (Proximity, Figure/Ground).
 */
export default function Hero({ data }: { data?: HeroData }) {
  if (!data) return null;

  const { name, typewriterTexts, tagline, profileImage } = data;

  const imageUrl =
    profileImage?.asset?.url ??
    (profileImage ? urlFor(profileImage).width(600).height(600).url() : "/fallback.jpg");

  const firstName = name?.split(" ")[0] || "Your";
  const lastName = name?.split(" ").slice(1).join(" ") || "Name";

  return (
    <section className="w-full flex flex-col-reverse md:flex-row items-center justify-between gap-10 md:gap-15">
      
      {/* 📝 Left Column: Text Content */}
      <motion.div
        className="flex flex-col gap-6 text-center md:text-left max-w-xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Name */}
        <h1 className="leading-tight">
          <span className="text-primary">{firstName}</span>{" "}
          <span className="text-foreground">{lastName}</span>
        </h1>

        {/* Typewriter */}
        <div className="text-xl md:text-2xl text-secondary font-medium min-h-[3rem]">
          {typewriterTexts?.length ? (
            <Typewriter
              options={{
                strings: typewriterTexts,
                autoStart: true,
                loop: true,
                delay: 50,
                deleteSpeed: 30,
              }}
            />
          ) : (
            <p>{tagline}</p>
          )}
        </div>

        {/* Tagline */}
        {tagline && (
          <p className="text-lg text-muted-foreground leading-relaxed">
            {tagline}
          </p>
        )}

        {/* CTA Buttons */}
        <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
          <Button
            borderRadius="1.75rem"
            className="bg-background text-foreground border-neutral-200 dark:border-slate-800 font-semibold"
          >
            <NavLink href="#Contact">Contact Me</NavLink>
          </Button>
          <Button
            borderRadius="1.75rem"
            className="bg-background text-foreground border-neutral-200 dark:border-slate-800 font-semibold"
          >
            <NavLink href="#Projects">My Projects</NavLink>
          </Button>
        </div>
      </motion.div>

      {/* 🖼️ Right Column: Image */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <div
          className="
            relative 
            w-[280px] h-[280px] 
            md:w-[400px] md:h-[400px]
            rounded-full 
            overflow-hidden 
            border-4 border-background 
            shadow-glow
            hover:scale-105 transition-transform duration-500
          "
        >
          <Image
            src={imageUrl}
            alt={profileImage?.alt || `${name} profile`}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 280px, 400px"
            unoptimized
          />
        </div>
        
        {/* Decorative Circle behind */}
        <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-full blur-2xl -z-10" />
      </motion.div>
    </section>
  );
}
