/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import { PortableText } from "@portabletext/react";
import { motion } from "framer-motion";

// ✅ Reusable fade animation
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function AboutSection() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both Hero (for bio) and About (for cards)
        const result = await client.fetch(`{
          "hero": *[_type == "hero"][0]{ about },
          "moreAbout": *[_type == "about"][0]{ items }
        }`);
        setData(result);
      } catch (error) {
        console.error("Error fetching about section:", error);
      }
    };

    fetchData();
  }, []);

  if (!data?.hero?.about) return null;

  return (
    <section
      id="about"
      className="w-full min-h-screen flex flex-col justify-center px-6 md:px-10 py-12 bg-transparent overflow-hidden"
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full">
        
        {/* LEFT: About Me Text */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="flex flex-col justify-center h-full"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            About <span className="text-[var(--primary)]">Me</span>
          </h2>

          <div className="prose prose-lg dark:prose-invert text-[var(--foreground)]/90 leading-relaxed">
            <PortableText
              value={data.hero.about}
              components={{
                block: {
                  normal: ({ children }) => (
                    <p className="mb-2 text-base md:text-10px">{children}</p>
                  ),
                },
              }}
            />
          </div>
        </motion.div>

        {/* RIGHT: More About Cards (Flip Effect) */}
        {data.moreAbout?.items && (
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full content-center"
          >
            {data.moreAbout.items.map((item: any, index: number) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="group h-32 [perspective:1000px]"
              >
                <div className="relative w-full h-full transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                  
                  {/* FRONT */}
                  <div className="absolute inset-0 bg-[var(--card)] border border-[var(--border)] rounded-xl flex items-center justify-center p-4 shadow-sm [backface-visibility:hidden]">
                    <h3 className="text-lg font-semibold text-center">{item.title}</h3>
                  </div>

                  {/* BACK */}
                  <div className="absolute inset-0 bg-[var(--primary)] text-white rounded-xl flex items-center justify-center p-4 [transform:rotateY(180deg)] [backface-visibility:hidden]">
                    <p className="text-[10px] sm:text-xs text-center leading-snug font-medium">
                      {item.description}
                    </p>
                  </div>

                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
