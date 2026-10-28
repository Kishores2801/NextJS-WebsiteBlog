"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, Sun, Moon, ArrowLeft } from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import NavLink from "@/components/NavLink";
import { Settings } from "@/types";

export default function FloatingNav({ settings }: { settings?: Settings }) {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  const isBlog = pathname?.startsWith("/blog");
  const isStudio = pathname?.startsWith("/studio");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Handle escape key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  if (isStudio) {
    return (
      <div className="fixed top-4 left-4 z-[100]">
        <NavLink
          href="/"
          className="flex items-center gap-2 px-4 py-2 bg-background/80 backdrop-blur-md border border-border/60 shadow-md rounded-full text-xs font-semibold hover:bg-muted transition-colors text-foreground"
        >
          <ArrowLeft size={14} />
          <span>Back to Portfolio</span>
        </NavLink>
      </div>
    );
  }

  const navItems = [
    { label: "Home", href: "/#Hero", active: pathname === "/" },
    (settings?.showProjects ?? true) && {
      label: "Projects",
      href: "/projects",
      active: pathname.startsWith("/projects"),
    },
    (settings?.showAbout ?? true) && {
      label: "Capabilities",
      href: "/#About",
      active: false,
    },
    (settings?.showTimeline ?? true) && {
      label: "Experience",
      href: "/#Career",
      active: false,
    },
    (settings?.showSkills ?? true) && {
      label: "Stack",
      href: "/#Skills",
      active: false,
    },
    (settings?.showBlog ?? true) && {
      label: "Blog",
      href: "/blog",
      active: pathname.startsWith("/blog"),
    },
    (settings?.showContact ?? true) && {
      label: "Contact",
      href: "/#Contact",
      active: false,
    },
  ].filter(Boolean) as Array<{ label: string; href: string; active: boolean }>;

  return (
    <header className="sticky top-4 z-[100] w-full flex justify-center px-4 mb-4">
      <nav
        aria-label="Main Navigation"
        className="w-full max-w-[820px] apple-glass rounded-full px-4 sm:px-6 py-2 flex items-center justify-between shadow-xs transition-all"
      >
        {/* Brand / Logo */}
        <NavLink
          href="/#Hero"
          className="font-bold tracking-tight text-foreground text-sm sm:text-base flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full px-2 py-1"
        >
          <span className="w-2 h-2 rounded-full bg-primary" />
          <span>Kishore Shanmugam</span>
        </NavLink>

        {/* Desktop Nav Items */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                item.active
                  ? "bg-foreground text-background font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
              }`}
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Right Actions: Theme Toggle & Mobile Menu */}
        <div className="flex items-center gap-1.5">
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              type="button"
              className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="md:hidden w-9 h-9 rounded-full flex items-center justify-center text-foreground hover:bg-muted transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary touch-target"
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Dropdown */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 top-[76px] z-[90] bg-background/80 backdrop-blur-xl p-6 flex flex-col justify-between animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <ul className="flex flex-col gap-2 pt-4">
            {navItems.map((item) => (
              <li key={item.href}>
                <NavLink
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center h-12 px-4 rounded-xl text-base font-semibold transition-colors ${
                    item.active
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="py-6 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
            <span>© {new Date().getFullYear()} Kishore Shanmugam</span>
            <span className="text-[11px] font-medium">Apple HIG UI</span>
          </div>
        </div>
      )}
    </header>
  );
}
