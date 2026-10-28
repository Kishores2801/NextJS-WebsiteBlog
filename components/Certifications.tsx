"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Award, ExternalLink } from "lucide-react";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import SectionHeader from "@/components/ui/SectionHeader";

export interface Certification {
  title: string;
  issuer: string;
  date: string;
  logo?: any;
  credentialLink?: string;
  categories?: string[];
}

interface CertificationsProps {
  initialData?: Certification[];
}

export default function Certifications({ initialData }: CertificationsProps) {
  const [certs, setCerts] = useState<Certification[]>(initialData || []);

  useEffect(() => {
    if (initialData && initialData.length > 0) {
      setCerts(initialData);
      return;
    }

    const fetchCerts = async () => {
      try {
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
      } catch (err) {
        console.error("Failed to load certifications:", err);
      }
    };

    fetchCerts();
  }, [initialData]);

  if (!certs || certs.length === 0) return null;

  return (
    <section id="Certifications" className="w-full py-10 sm:py-14 scroll-mt-24">
      {/* Section Header */}
      <SectionHeader
        eyebrow="Credentials"
        title="Verified Certifications"
        subtitle="Professional credentials and specialized accreditations reinforcing core domain proficiency."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
        {certs.map((cert, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-border/70 bg-card text-card-foreground p-5 sm:p-6 flex flex-col justify-between text-left"
          >
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                {cert.logo?.asset ? (
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-muted/30 border border-border/50 shrink-0 p-1">
                    <Image
                      src={urlFor(cert.logo).width(96).height(96).url()}
                      alt={cert.title}
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-primary border border-border/50 shrink-0">
                    <Award size={22} />
                  </div>
                )}

                {cert.date && (
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border/40">
                    {cert.date}
                  </span>
                )}
              </div>

              <h3 className="text-lg font-bold tracking-tight text-foreground mb-1">
                {cert.title}
              </h3>

              <p className="text-sm font-medium text-muted-foreground mb-4">
                {cert.issuer}
              </p>

              {cert.categories && cert.categories.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {cert.categories.map((cat, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-secondary text-secondary-foreground border border-border/40"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {cert.credentialLink && (
              <div className="pt-4 border-t border-border/50">
                <a
                  href={cert.credentialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                >
                  <span>Verify Credential</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
