"use client";

import React, { useState, useEffect } from "react";
import { Mail, MapPin, FileText } from "lucide-react";
import { client } from "@/sanity/lib/client";

// -----------------------------
// Types
// -----------------------------
interface HeroContactData {
  email?: string;
  location?: string;
  resumeUrl?: string;
}

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [heroData, setHeroData] = useState<HeroContactData>({});
  const [loading, setLoading] = useState(true);

  // -----------------------------
  // Fetch Hero Contact Info
  // -----------------------------
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

        setHeroData(data);
      } catch (error) {
        console.error("Failed to fetch hero contact data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  // -----------------------------
  // Form Handlers
  // -----------------------------
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const recipient = heroData?.email || "info@example.com";
    const subject = encodeURIComponent(
      formData.subject || `Message from ${formData.name}`
    );
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    );

    window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
  };

  if (loading) {
    return (
      <p className="text-center text-[var(--muted-foreground)]">Loading…</p>
    );
  }

  return (
    <section
      id="Contact"
      className="relative flex w-full flex-col justify-center py-12 px-5 sm:px-8 lg:px-12 
                 bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300"
    >
      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
        {/* ------------------------- */}
        {/* LEFT COLUMN – FORM */}
        {/* ------------------------- */}
        <div className="flex flex-col gap-5 justify-center">
          <h1 className="text-2xl md:text-3xl font-extrabold">
            Let&apos;s Connect
          </h1>

          <p className="text-[var(--muted-foreground)] text-sm leading-relaxed max-w-sm">
            Feel free to reach out for collaborations, job opportunities, or
            just to say hello! I&apos;m always open to meaningful conversations.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              label="Name"
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
            />

            <InputField
              label="Email"
              type="email"
              name="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={handleChange}
            />

            <InputField
              label="Subject"
              type="text"
              name="subject"
              placeholder="What is this about?"
              value={formData.subject}
              onChange={handleChange}
            />

            <TextAreaField
              label="Message"
              name="message"
              placeholder="Write your message here..."
              value={formData.message}
              onChange={handleChange}
            />

            <button
              type="submit"
              className="mt-2 w-full sm:w-auto rounded-md 
                         bg-[var(--color-primary)] px-6 py-2.5 font-semibold text-[var(--primary-foreground)]
                         shadow-[0_0_8px_var(--color-primary)] hover:bg-[var(--color-accent)] 
                         hover:shadow-[0_0_14px_var(--color-primary)]
                         transition-all duration-300"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* ------------------------- */}
        {/* RIGHT COLUMN – CONTACT INFO */}
        {/* ------------------------- */}
        <div className="flex flex-col gap-6 h-full md:pl-8 md:border-l border-[var(--border)] pt-10">
          <ContactInfo
            icon={<Mail size={20} />}
            title="Email"
            text={heroData.email || "Not provided"}
          />

          <ContactInfo
            icon={<MapPin size={20} />}
            title="Location"
            text={heroData.location || "Not provided"}
          />

          {heroData.resumeUrl && (
            <ContactInfo
              icon={<FileText size={20} />}
              title="Resume"
              text={
                <a
                  href={heroData.resumeUrl}
                  target="_blank"
                  className="text-[var(--color-primary)] hover:text-[var(--color-accent)] hover:underline"
                >
                  Download Resume
                </a>
              }
            />
          )}
        </div>
      </div>
    </section>
  );
};

// -----------------------------
// Subcomponents
// -----------------------------
const InputField = ({ label, ...props }: any) => (
  <label className="flex flex-col w-full">
    <p className="text-xs font-medium pb-1 text-[var(--muted-foreground)]">
      {label}
    </p>
    <input
      {...props}
      required
      className="h-10 rounded-md border border-[var(--border)] 
                 bg-[var(--input)] px-3 text-sm text-[var(--foreground)] 
                 placeholder:text-[var(--muted-foreground)]
                 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/60"
    />
  </label>
);

const TextAreaField = ({ label, ...props }: any) => (
  <label className="flex flex-col w-full">
    <p className="text-xs font-medium pb-1 text-[var(--muted-foreground)]">
      {label}
    </p>
    <textarea
      rows={3}
      {...props}
      required
      className="rounded-md border border-[var(--border)] 
                 bg-[var(--input)] px-3 py-2 text-sm text-[var(--foreground)]
                 placeholder:text-[var(--muted-foreground)]
                 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/60 resize-none"
    />
  </label>
);

const ContactInfo = ({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: React.ReactNode;
}) => (
  <div className="flex items-start gap-3">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md 
                    bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
      {icon}
    </div>
    <div>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="text-sm text-[var(--muted-foreground)]">{text}</p>
    </div>
  </div>
);

export default Contact;
