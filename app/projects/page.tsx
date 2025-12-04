"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { client } from "@/sanity/lib/client"
import { urlFor } from "@/sanity/lib/image"
import { motion, AnimatePresence } from "framer-motion"
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa"

interface Project {
  title: string
  slug?: { current: string }
  shortDescription?: string
  mainImage?: { asset?: { url?: string }; alt?: string }
  technologies?: string[]
  links?: { live?: string; github?: string }
  categories?: { title: string; slug: { current: string } }[]
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [categories, setCategories] = useState<{ title: string; slug: string }[]>([])
  const [activeCategory, setActiveCategory] = useState("all")

  useEffect(() => {
    const load = async () => {
      const data: Project[] = await client.fetch(`
        *[_type == "project" && featured == true] | order(date desc) {
          title,
          slug,
          shortDescription,
          mainImage { asset->{url}, alt },
          technologies,
          links,
          categories[]->{ title, slug }
        }
      `)

      setProjects(data)

      // Extract unique categories
      const catMap = new Map<string, string>()
      data.forEach((p) =>
        p.categories?.forEach((c) => {
          if (c?.slug?.current) catMap.set(c.slug.current, c.title)
        })
      )

      setCategories(Array.from(catMap, ([slug, title]) => ({ slug, title })))
    }

    load()
  }, [])

  const filtered =
    activeCategory === "all"
      ? projects
      : projects.filter((p) =>
          p.categories?.some((c) => c.slug.current === activeCategory)
        )

  return (
    <section className="max-w-4xl max-h-screen mx-auto px-4 py-14 h-screen">
      <h2 className="text-xl sm:text-2xl font-bold text-center text-[var(--color-primary)] mb-6">
        Featured Projects
      </h2>

      {/* Categories */}
      <div className="flex gap-2 mb-6 flex-wrap justify-center">
        <button
          onClick={() => setActiveCategory("all")}
          className={`px-3 py-1 text-xs rounded-full border ${
            activeCategory === "all"
              ? "bg-[var(--color-primary)] text-white"
              : "border-[var(--border)] text-[var(--foreground)]"
          }`}
        >
          All
        </button>

        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => setActiveCategory(cat.slug)}
            className={`px-3 py-1 text-xs rounded-full border ${
              activeCategory === cat.slug
                ? "bg-[var(--color-primary)] text-white"
                : "border-[var(--border)] text-[var(--foreground)]"
            }`}
          >
            {cat.title}
          </button>
        ))}
      </div>

      {/* Cards */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-6"
        >
          {filtered.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="w-[85%] max-w-[330px] sm:w-[240px] rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--card)] shadow hover:-translate-y-1 hover:shadow-lg transition"
            >
              <div className="relative w-full h-32 bg-[var(--muted)]">
                {p.mainImage?.asset?.url && (
                  <Image
                    src={urlFor(p.mainImage).width(700).height(450).url()}
                    alt={p.mainImage.alt || p.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/50 opacity-0 hover:opacity-100 transition">
                  {p.links?.live && (
                    <a
                      href={p.links.live}
                      target="_blank"
                      className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[var(--color-primary)]"
                    >
                      <FaExternalLinkAlt size={14} />
                    </a>
                  )}
                  {p.links?.github && (
                    <a
                      href={p.links.github}
                      target="_blank"
                      className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[var(--color-primary)]"
                    >
                      <FaGithub size={14} />
                    </a>
                  )}
                </div>
              </div>

              <div className="p-3 text-center">
                {p.slug?.current ? (
                  <Link href={`/projects/${p.slug.current}`}>
                    <h3 className="text-sm font-semibold text-[var(--color-primary)] hover:underline">
                      {p.title}
                    </h3>
                  </Link>
                ) : (
                  <h3 className="text-sm font-semibold text-[var(--color-primary)]">
                    {p.title}
                  </h3>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  )
}
