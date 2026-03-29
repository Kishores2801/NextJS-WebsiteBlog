"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "./ui/moving-border";
import NavLink from "./NavLink";
import { motion, AnimatePresence } from "motion/react";
import { urlFor } from "@/sanity/lib/image";
import { HeroData } from "@/types";

export default function Hero({ data }: { data?: HeroData }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!data?.typewriterTexts?.length) return;
    const interval = setInterval(() => {
      setIndex((prev: number) => (prev + 1) % data!.typewriterTexts!.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [data?.typewriterTexts]);

  if (!data) return null;

  const { name, typewriterTexts, tagline, profileImage } = data;

  const imageUrl =
    profileImage?.asset?.url ??
    (profileImage ? urlFor(profileImage).width(600).height(600).quality(100).auto("format").fit("max").url() : "/fallback.jpg");

  const firstName = name?.split(" ")[0] || "Your";
  const lastName = name?.split(" ").slice(1).join(" ") || "Name";

  return (
    <section className="w-full flex flex-col-reverse md:flex-row items-center justify-between gap-6 md:gap-12">
      
      {/* 📝 Left Column: Text Content */}
      <motion.div
        className="flex flex-col gap-9 text-center md:text-left max-w-xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="leading-tight flex flex-col gap-1">
          {/* <span className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground transition-colors">
            Architecting High-Performance Web Experiences.
          </span> */}
          <span className="text-xl md:text-2xl text-muted-foreground font-medium mt-2">
            Hi, I'm <span className="text-[var(--accent)]">{firstName}</span> {lastName}.
          </span>
        </h1>

        <div className="relative h-[3.5rem] overflow text-xl md:text-2xl text-secondary font-semibold">
          {typewriterTexts?.length ? (
            <AnimatePresence mode="popLayout">
              <motion.div
                key={index}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -40, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-[120%]"
              >
                {typewriterTexts[index]}
              </motion.div>
            </AnimatePresence>
          ) : (
            <p>{tagline}</p>
          )}
        </div>

        {tagline && (
          <p className="text-lg text-muted-foreground leading-relaxed">
            {tagline}
          </p>
        )}

        <div className="flex flex-wrap justify-center md:justify-start gap-4">
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
            w-[300px] h-[300px] 
            md:w-[450px] md:h-[450px]
            rounded-full 
            overflow-hidden 
            border-4 border-background 
            shadow-2xl
            hover:scale-105 transition-transform duration-500
          "
        >
          <Image
            src={imageUrl}
            alt={profileImage?.alt || `${name} profile`}
            fill
            className="object-cover"
            priority
            quality={100}
            unoptimized
            sizes="(max-width: 768px) 280px, 400px"
          />
        </div>
      </motion.div>
    </section>
  );
}
