"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, Sun, Moon, ArrowLeft } from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import NavLink from "@/components/NavLink";
import { Settings } from "@/types";
import { motion, AnimatePresence } from "motion/react";

export default function FloatingNav({ settings }: { settings?: Settings }) {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  
  const isBlog = pathname?.startsWith("/blog");
  const isStudio = pathname?.startsWith("/studio");

  useEffect(() => setMounted(true), []);

  if (isStudio) {
    return (
      <div className="fixed top-4 left-4 z-[100]">
        <NavLink 
          href="/" 
          className="flex items-center gap-2 px-4 py-2 bg-background/80 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-md rounded-full text-sm font-medium hover:bg-muted transition-colors text-foreground"
        >
          <ArrowLeft size={16} />
          Back to Portfolio
        </NavLink>
      </div>
    );
  }

  const navItems = [
    { label: "Home", href: "/#Hero" },
    settings?.showAbout && { label: "About", href: "/#About" },
    settings?.showSkills && { label: "Skills", href: "/#Skills" },
    settings?.showProjects && { label: "Projects", href: "/#Projects" },
    settings?.showBlog && { label: "Blog", href: "/blog" },
    settings?.showContact && { label: "Contact", href: "/#Contact" },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <div className="sticky top-4 mt-6 z-[100] w-full flex justify-center mb-6">
      <div className="w-[90%] max-w-[800px]">
        <motion.nav
          initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="flex items-center justify-between px-6 md:px-8 py-2 bg-background/60 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-md rounded-full"
        >
        <NavLink href="/#Hero" className="font-bold text-foreground text-xl">
          {isBlog ? "KS.Blog" : "KS.Portfolio"}
        </NavLink>
        
        <div className="flex items-center gap-2">
           {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex items-center justify-center h-12 w-12 rounded-full hover:bg-muted transition-colors text-foreground"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-center h-12 w-12 rounded-full hover:bg-muted transition-colors text-foreground"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute top-full left-0 w-full mt-2 bg-background/80 backdrop-blur-lg border border-white/20 dark:border-white/10 p-6 shadow-xl rounded-3xl"
            >
            <ul className="flex flex-col gap-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <NavLink
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center h-12 px-4 text-lg font-medium text-muted-foreground hover:bg-muted hover:text-foreground rounded-xl transition-colors"
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
