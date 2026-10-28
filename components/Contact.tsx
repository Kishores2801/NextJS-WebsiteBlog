"use client";

import React, { useState, useEffect } from "react";
import { Mail, MapPin, FileText, Send, Check } from "lucide-react";
import { client } from "@/sanity/lib/client";
import SectionHeader from "@/components/ui/SectionHeader";

interface HeroContactData {
  email?: string;
  location?: string;
  resumeUrl?: string;
}

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [heroData, setHeroData] = useState<HeroContactData>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const data = await client.fetch(`
          *[_type == "hero"][0]{
            email,
            location,
            "resumeUrl": resume.asset->url
          }
        `);
        setHeroData(data || {});
      } catch (error) {
        console.error("Failed to fetch hero contact data:", error);
      }
    };

    fetchHeroData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const recipient = heroData?.email || "kishoreshan2801@gmail.com";
    const subject = encodeURIComponent(
      formData.subject || `Inquiry from ${formData.name}`
    );
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    );

    setSubmitted(true);
    setTimeout(() => {
      window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
      setSubmitted(false);
    }, 300);
  };

  return (
    <section id="Contact" className="w-full py-10 sm:py-14 scroll-mt-24">
      <SectionHeader
        eyebrow="Connect"
        title="Get in Touch"
        subtitle="Available for data analytics consulting, machine learning initiatives, and technical roles."
      />

      <div className="max-w-4xl mx-auto rounded-xl border border-border/70 bg-card text-card-foreground p-6 sm:p-8 md:p-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-10 items-start">
          {/* Form (3 Cols) */}
          <div className="md:col-span-3">
            <h3 className="text-lg font-bold tracking-tight text-foreground mb-1">
              Send a Message
            </h3>
            <p className="text-xs text-muted-foreground mb-5 leading-relaxed">
              Fill in your details below to draft an email directly to my inbox.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label
                  htmlFor="contact-name"
                  className="block text-xs font-semibold text-foreground mb-1"
                >
                  Your Name <span className="text-primary">*</span>
                </label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  required
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full h-10 px-3 rounded-lg border border-border/70 bg-background text-foreground text-xs sm:text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground focus:border-foreground transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="block text-xs font-semibold text-foreground mb-1"
                >
                  Email Address <span className="text-primary">*</span>
                </label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  required
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full h-10 px-3 rounded-lg border border-border/70 bg-background text-foreground text-xs sm:text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground focus:border-foreground transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-subject"
                  className="block text-xs font-semibold text-foreground mb-1"
                >
                  Subject
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  name="subject"
                  placeholder="Project Collaboration / Discussion"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full h-10 px-3 rounded-lg border border-border/70 bg-background text-foreground text-xs sm:text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground focus:border-foreground transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-xs font-semibold text-foreground mb-1"
                >
                  Message <span className="text-primary">*</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={4}
                  required
                  placeholder="Project scope, objectives, or questions..."
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg border border-border/70 bg-background text-foreground text-xs sm:text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground focus:border-foreground transition-all resize-none"
                />
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={submitted}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold bg-foreground text-background hover:opacity-90 active:scale-[0.98] transition-all shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {submitted ? (
                    <>
                      <Check size={14} />
                      <span>Opening Client...</span>
                    </>
                  ) : (
                    <>
                      <Send size={13} />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Direct Details Sidebar (2 Cols) */}
          <div className="md:col-span-2 flex flex-col gap-5 md:pl-6 md:border-l border-border/50">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                Direct Contact
              </h4>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-primary shrink-0 border border-border/40">
                <Mail size={15} />
              </div>
              <div>
                <h5 className="text-[11px] font-semibold text-muted-foreground uppercase">Email</h5>
                <a
                  href={`mailto:${heroData.email || "kishoreshan2801@gmail.com"}`}
                  className="text-xs sm:text-sm font-medium text-foreground hover:text-primary transition-colors break-all"
                >
                  {heroData.email || "kishoreshan2801@gmail.com"}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-primary shrink-0 border border-border/40">
                <MapPin size={15} />
              </div>
              <div>
                <h5 className="text-[11px] font-semibold text-muted-foreground uppercase">Location</h5>
                <p className="text-xs sm:text-sm font-medium text-foreground">
                  {heroData.location || "Colombo, Sri Lanka"}
                </p>
              </div>
            </div>

            {heroData.resumeUrl && (
              <div className="flex items-start gap-3 pt-1">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-primary shrink-0 border border-border/40">
                  <FileText size={15} />
                </div>
                <div>
                  <h5 className="text-[11px] font-semibold text-muted-foreground uppercase">Resume</h5>
                  <a
                    href={heroData.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs sm:text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1 mt-0.5"
                  >
                    Download CV (PDF)
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
