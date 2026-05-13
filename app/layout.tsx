import React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import FloatingNav from "@/components/FloatingNav";
import Footer from "@/components/footer";
import JsonLd from "@/components/JsonLd"; 
import { sanityFetch } from "@/sanity/lib/fetch";
import { Settings } from "@/types";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 🌍 SEO Metadata
export const metadata: Metadata = {
  metadataBase: new URL("https://kishore-portfolio.com"), // Replace with actual domain
  title: {
    default: "Kishore Portfolio & Blog",
    template: "%s | Kishore Portfolio",
  },
  description: "Marvel/DC themed portfolio showcasing skills, projects, and blog.",
  keywords: ["Portfolio", "Software Engineer", "Web Developer", "React", "Next.js", "Sanity"],
  authors: [{ name: "Kishore" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://kishore-portfolio.com",
    title: "Kishore Portfolio & Blog",
    description: "Marvel/DC themed portfolio showcasing skills, projects, and blog.",
    siteName: "Kishore Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kishore Portfolio & Blog",
    description: "Marvel/DC themed portfolio showcasing skills, projects, and blog.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.png",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await sanityFetch<Settings>({
    query: `*[_type == "siteSettings"][0]`,
    tags: ["siteSettings"],
  }).catch(() => null);

  const accentColor = settings?.primaryAccentColor || "#3b82f6";

  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth" style={{ '--accent': accentColor } as React.CSSProperties}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground transition-colors duration-300`}
        suppressHydrationWarning
      >
        <JsonLd />
        {/* Wrap everything inside ThemeProvider to prevent hydration mismatch */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <FloatingNav settings={settings || undefined} />
          <main className="min-h-screen flex flex-col pb-32">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
