"use client";

import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";

type Testimonial = {
  quote: string;
  name: string;
  designation: string;
  company?: string;
  src: string; // image URL
};

export default function Testimonials({ autoplay = true }: { autoplay?: boolean }) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [active, setActive] = useState(0);

  // 🌐 Fetch from Sanity
  useEffect(() => {
    const fetchTestimonials = async () => {
      const data = await client.fetch(`
        *[_type == "testimonial" && featured == true] | order(_createdAt desc) {
          name,
          designation,
          company,
          message,
          avatar
        }
      `);

      const mapped = data.map((t: any) => ({
        name: t.name,
        designation: t.designation + (t.company ? ` • ${t.company}` : ""),
        quote: t.message,
        src: t.avatar ? urlFor(t.avatar).width(700).height(700).url() : "/placeholder.png",
      }));

      setTestimonials(mapped);
    };

    fetchTestimonials();
  }, []);

  // If no testimonials, avoid rendering
  if (!testimonials.length) return null;

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const isActive = (index: number) => index === active;

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(handleNext, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay]);

  const randomRotateY = () => Math.floor(Math.random() * 21) - 10;

  return (
    <section id="Testimonials" className="py-20 max-w-6xl mx-auto px-6">
      <h2 className="text-3xl font-bold text-center text-[var(--color-primary)] mb-6">
        Testimonials
      </h2>

      <p className="text-center text-sm text-[var(--muted-foreground)] max-w-xl mx-auto mb-12">
        What colleagues, mentors, and clients say about working with me.
      </p>

      <div className="mx-auto max-w-sm px-4 md:max-w-4xl md:px-8 lg:px-12">
        <div className="relative grid grid-cols-1 gap-20 md:grid-cols-2">

          {/* ========== LEFT: Animated Avatar Cards ========== */}
          <div className="relative h-80 w-full">
            <AnimatePresence>
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.src + index}
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                    z: -100,
                    rotate: randomRotateY(),
                  }}
                  animate={{
                    opacity: isActive(index) ? 1 : 0.7,
                    scale: isActive(index) ? 1 : 0.95,
                    z: isActive(index) ? 0 : -100,
                    rotate: isActive(index) ? 0 : randomRotateY(),
                    zIndex: isActive(index)
                      ? 40
                      : testimonials.length + 2 - index,
                    y: isActive(index) ? [0, -80, 0] : 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    z: 100,
                    rotate: randomRotateY(),
                  }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="absolute inset-0 origin-bottom"
                >
                  <img
                    src={testimonial.src}
                    alt={testimonial.name}
                    width={500}
                    height={500}
                    draggable={false}
                    className="h-full w-full rounded-3xl object-cover object-center shadow-xl"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* ========== RIGHT: Text, Name, Role, Navigation ========== */}
          <div className="flex flex-col justify-between py-4">
            <motion.div
              key={active}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <h3 className="text-2xl font-bold">{testimonials[active].name}</h3>

              <p className="text-sm text-[var(--muted-foreground)]">
                {testimonials[active].designation}
              </p>

              <motion.p className="mt-8 text-lg text-gray-700 dark:text-neutral-300 leading-relaxed">
                {testimonials[active].quote.split(" ").map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{
                      filter: "blur(10px)",
                      opacity: 0,
                      y: 5,
                    }}
                    animate={{
                      filter: "blur(0px)",
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.2,
                      ease: "easeInOut",
                      delay: 0.02 * i,
                    }}
                    className="inline-block"
                  >
                    {word}&nbsp;
                  </motion.span>
                ))}
              </motion.p>
            </motion.div>

            {/* Buttons */}
            <div className="flex gap-4 pt-12 md:pt-0">
              <button
                onClick={handlePrev}
                className="group/button flex h-7 w-7 items-center justify-center rounded-full bg-[var(--muted)]"
              >
                <IconArrowLeft className="h-5 w-5 text-[var(--foreground)] group-hover/button:rotate-12 transition-transform duration-300" />
              </button>

              <button
                onClick={handleNext}
                className="group/button flex h-7 w-7 items-center justify-center rounded-full bg-[var(--muted)]"
              >
                <IconArrowRight className="h-5 w-5 text-[var(--foreground)] group-hover/button:-rotate-12 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
