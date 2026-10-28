import React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
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
  metadataBase: new URL("https://kishore-portfolio.com"),
  title: {
    default: "Kishore Shanmugam | Lead Data Analyst & AI Engineer",
    template: "%s | Kishore Shanmugam",
  },
  description: "Portfolio of Kishore Shanmugam — Lead Data Analyst exploring the intersection of Business Analytics, Machine Learning, and AI Engineering.",
  keywords: ["Lead Data Analyst", "Business Analytics", "Machine Learning", "AI Engineering", "Python", "Data Science", "Next.js", "Sanity"],
  authors: [{ name: "Kishore Shanmugam" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://kishore-portfolio.com",
    title: "Kishore Shanmugam | Lead Data Analyst & AI Engineer",
    description: "Turning complex data into intelligent, actionable solutions.",
    siteName: "Kishore Shanmugam",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kishore Shanmugam | Lead Data Analyst & AI Engineer",
    description: "Turning complex data into intelligent, actionable solutions.",
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

  const primaryColor = settings?.primaryAccentColor;

  return (
    <html 
      lang="en" 
      suppressHydrationWarning 
      data-scroll-behavior="smooth" 
      style={primaryColor ? ({ '--primary': primaryColor } as React.CSSProperties) : undefined}
    >
      <head>
        <JsonLd />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground transition-colors duration-300 flex flex-col min-h-screen overflow-x-hidden`}
        suppressHydrationWarning
      >
        {/* Wrap everything inside ThemeProvider to prevent hydration mismatch */}
        <ThemeProvider 
          attribute="class" 
          defaultTheme="system" 
          enableSystem 
          disableTransitionOnChange
        >
          <FloatingNav settings={settings || undefined} />
          <main className="flex-1 flex flex-col w-full pb-16 md:pb-32 relative">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
