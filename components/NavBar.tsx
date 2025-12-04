"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import NavLink from "@/components/NavLink";
import { Settings } from "@/types";

/**
 * 🧭 NavBar Component
 * Displays the top navigation bar.
 * - Accepts `settings` as a prop to avoid client-side fetching (flicker fix).
 * - Handles mobile menu and theme toggling.
 */
interface NavBarProps {
  settings?: Settings;
}

const NavBar: React.FC<NavBarProps> = ({ settings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => setMounted(true), []);

  // Show/Hide navbar on scroll
  const controlNavbar = () => {
    if (typeof window !== "undefined") {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(window.scrollY);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY]);

  // Lock background when mobile menu opens
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  // 🧭 Nav Items (Conditional based on settings)
  const navItems = [
    { label: "Home", href: "#Hero" },
    settings?.showAbout && { label: "About Me", href: "#About" },
    settings?.showSkills && { label: "Skills", href: "#Skills" },
    settings?.showProjects && { label: "Projects", href: "#Projects" },
    settings?.showBlog && { label: "Blog", href: "/blog" },
    settings?.showContact && { label: "Contact Me", href: "#Contact" },
  ].filter(Boolean);

  return (
    <nav
      className={`
        fixed top-0 left-0 w-full z-[70] h-[60px]
        bg-white dark:bg-background 
        border-b border-border/40 shadow-sm
        transition-transform duration-300
        ${isVisible ? "translate-y-0" : "-translate-y-full"}
      `}
    >
      <div className="container-width flex items-center justify-between h-full">
        {/* Logo */}
        <NavLink
          href="#Hero"
          className="text-xl font-bold text-primary tracking-tight"
        >
          KS Portfolio<span className="text-accent">.</span>
        </NavLink>

        {/* Desktop Nav */}
        <ul className="hidden md:flex gap-8 items-center">
          {navItems.map((item: any) => (
            <li key={item.href}>
              <NavLink
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {item.label}
              </NavLink>
            </li>
          ))}
          
          {/* Theme Toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-muted transition-colors text-foreground"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          )}
        </ul>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-4 md:hidden">
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-muted transition-colors text-foreground"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-foreground touch-target"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="fixed inset-0 top-[60px] z-[100] bg-white dark:bg-background h-100 opacity-100 animate-slideDown flex flex-col items-center justify-center">
          <ul className="flex flex-col items-center gap-8">
            {navItems.map((item: any) => (
              <li key={item.href}>
                <NavLink
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="text-2xl font-bold text-foreground hover:text-primary transition-colors"
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
