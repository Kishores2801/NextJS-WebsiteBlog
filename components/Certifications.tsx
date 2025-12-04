"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";

interface Certification {
  title: string;
  issuer: string;
  date: string;
  logo?: any;
  credentialLink?: string;
  categories?: string[];
}

export default function Certifications() {
  const [certs, setCerts] = useState<Certification[]>([]);

  useEffect(() => {
    const fetchCerts = async () => {
      const data = await client.fetch(`
        *[_type == "certification" && featured == true] | order(date desc) {
          title,
          issuer,
          date,
          logo,
          credentialLink,
          categories
        }
      `);
      setCerts(data);
    };

    fetchCerts();
  }, []);

  if (!certs.length) return null;

  return (
    <section id="Certifications" className="max-w-6xl mx-auto px-6 py-14">
      
      {/* Heading */}
      <h2 className="text-3xl font-bold text-center text-[var(--color-primary)] mb-6">
        Certifications
      </h2>

      <p className="text-center text-sm sm:text-base text-[var(--muted-foreground)] max-w-2xl mx-auto mb-10">
        A curated list of certifications that reflect my ongoing learning,
        professional development, and commitment to mastering core technologies.
      </p>

      {/* Certifications Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {certs.map((cert, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            viewport={{ once: true }}
            className="bg-[var(--card)] border border-[var(--border)] opacity-25 rounded-xl p-6 shadow hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center"
          >
            {/* Logo */}
            {cert.logo && (
              <div className="relative w-16 h-16 mb-4">
                <Image
                  src={urlFor(cert.logo).width(200).height(200).url()}
                  alt={cert.title}
                  fill
                  className="object-contain"
                />
              </div>
            )}

            {/* Title */}
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-1">
              {cert.title}
            </h3>

            {/* Issuer */}
            <p className="text-sm text-[var(--muted-foreground)] mb-1">
              {cert.issuer}
            </p>

            {/* Year */}
            <p className="text-xs text-[var(--muted-foreground)] mb-4">
              {cert.date}
            </p>

            {/* Categories */}
            {cert.categories && cert.categories.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {cert.categories.map((cat, i) => (
                  <span
                    key={i}
                    className="px-2 py-[2px] text-xs rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            )}

            {/* Credential Link */}
            {cert.credentialLink && (
              <a
                href={cert.credentialLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-[var(--color-primary)] hover:underline"
              >
                View Credential
              </a>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
