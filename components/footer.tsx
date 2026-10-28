import React from "react";
import Link from "next/link";
import { Github, Linkedin, Instagram, Mail, ArrowUp } from "lucide-react";
import { SiFiverr, SiUpwork } from "react-icons/si";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border/60 bg-secondary/30 mt-auto py-12 px-4 sm:px-6 md:px-10 lg:px-12 text-sm text-muted-foreground">
      <div className="max-w-6xl mx-auto flex flex-col gap-10">
        {/* Top: Identity & Navigation */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-border/40">
          <div>
            <h3 className="text-base font-bold text-foreground tracking-tight">
              Kishore Shanmugam
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Lead Data Analyst • Business Analytics, ML & AI Engineering
            </p>
          </div>

          {/* Quick links */}
          <nav aria-label="Footer Navigation" className="flex flex-wrap items-center gap-5 text-xs font-medium">
            <Link href="/#Hero" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <Link href="/projects" className="hover:text-foreground transition-colors">
              Projects
            </Link>
            <Link href="/#About" className="hover:text-foreground transition-colors">
              Capabilities
            </Link>
            <Link href="/#Career" className="hover:text-foreground transition-colors">
              Experience
            </Link>
            <Link href="/#Skills" className="hover:text-foreground transition-colors">
              Stack
            </Link>
            <Link href="/blog" className="hover:text-foreground transition-colors">
              Blog
            </Link>
            <Link href="/#Contact" className="hover:text-foreground transition-colors">
              Contact
            </Link>
          </nav>
        </div>

        {/* Bottom: Social Profiles & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Social Profiles */}
          <div className="flex items-center gap-3">
            <a
              href="https://www.linkedin.com/in/kishore-shan"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-muted border border-border/60 transition-all shadow-xs"
            >
              <Linkedin size={15} />
            </a>

            <a
              href="https://github.com/Kishores2801"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted border border-border/60 transition-all shadow-xs"
            >
              <Github size={15} />
            </a>

            <a
              href="mailto:kishoreshan2801@gmail.com"
              aria-label="Send Email"
              className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-muted border border-border/60 transition-all shadow-xs"
            >
              <Mail size={15} />
            </a>

            <a
              href="https://www.fiverr.com/users/kishore_data"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Fiverr Freelance Profile"
              className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-muted-foreground hover:text-emerald-500 hover:bg-muted border border-border/60 transition-all shadow-xs"
            >
              <SiFiverr size={16} />
            </a>

            <a
              href="https://www.upwork.com/freelancers/~01ed5351b55a5e345c"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Upwork Freelance Profile"
              className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-muted-foreground hover:text-emerald-500 hover:bg-muted border border-border/60 transition-all shadow-xs"
            >
              <SiUpwork size={15} />
            </a>

            <a
              href="https://www.instagram.com/kishore_shan_28/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram Profile"
              className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-muted-foreground hover:text-pink-500 hover:bg-muted border border-border/60 transition-all shadow-xs"
            >
              <Instagram size={15} />
            </a>
          </div>

          {/* Copyright & Sitemap */}
          <div className="flex items-center gap-4 text-xs">
            <span>© {currentYear} Kishore Shanmugam. All rights reserved.</span>
            <span>•</span>
            <Link href="/sitemap.xml" className="hover:text-foreground transition-colors underline-offset-4 hover:underline">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}