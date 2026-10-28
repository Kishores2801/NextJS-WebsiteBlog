import { sanityFetch } from "@/sanity/lib/fetch";
import Hero from "@/components/Hero";
import ProfessionalSummary from "@/components/ProfessionalSummary";
import Projects from "@/components/Projects";
import About from "@/components/About";
import CareerTimeline, { CareerItem } from "@/components/CareerTimeline";
import Skills from "@/components/Skills";
import Certifications, { Certification } from "@/components/Certifications";
import Contact from "@/components/Contact";
import { Settings, HeroData, Project, Skill } from "@/types";
import { PortableTextBlock } from "next-sanity";

interface AboutQueryData {
  heroAbout?: { about?: PortableTextBlock[] };
  moreAbout?: {
    items?: Array<{
      _key?: string;
      title: string;
      description: string;
      icon?: string;
      customIcon?: { asset?: { url?: string }; alt?: string };
    }>;
  };
}

/**
 * 🏠 Home Page (Server Component)
 * Strict Apple HIG-inspired portfolio architecture:
 * 1. Hero
 * 2. Professional Summary
 * 3. Featured Projects (Compact 20% Reduction)
 * 4. Core Expertise (4 Clean Pillars with Mini Logos)
 * 5. Career Journey
 * 6. Technical Stack
 * 7. Contact
 */
export default async function Home() {
  // Parallel fetch to eliminate waterfall delays
  const [
    settings,
    heroData,
    projects,
    skills,
    careerData,
    aboutData,
    certifications,
  ] = await Promise.all([
    // 1. Site Settings
    sanityFetch<Settings>({
      query: `*[_type == "siteSettings"][0]`,
      tags: ["siteSettings"],
    }).catch(() => null),

    // 2. Hero Data
    sanityFetch<HeroData>({
      query: `*[_type == "hero"][0]{
        name,
        typewriterTexts,
        tagline,
        profileImage{
          ...,
          asset->{
            _id,
            url
          }
        }
      }`,
      tags: ["hero"],
    }).catch(() => null),

    // 3. Projects
    sanityFetch<Project[]>({
      query: `*[_type == "project"] | order(date desc) {
        _id,
        title,
        slug,
        shortDescription,
        mainImage{ asset->{url}, alt },
        technologies,
        links,
        categories[]->{ title, slug },
        date,
        featured,
        features
      }`,
      tags: ["project"],
    }).catch(() => []),

    // 4. Skills (Technical Stack)
    sanityFetch<Skill[]>({
      query: `*[_type == "skill"] | order(category asc, title asc) {
        _id,
        title,
        category,
        icon{ asset->{url}, alt }
      }`,
      tags: ["skill"],
    }).catch(() => []),

    // 5. Career & Education Timeline
    sanityFetch<CareerItem[]>({
      query: `*[_type == "career"] | order(startDate asc) {
        _id, type, title, organization, startDate, endDate, isCurrent, logo, description, skills
      }`,
      tags: ["career"],
    }).catch(() => []),

    // 6. About / Capabilities Details with Mini Logo Schema
    sanityFetch<AboutQueryData>({
      query: `{
        "heroAbout": *[_type == "hero"][0]{ about },
        "moreAbout": *[_type == "about"][0]{
          items[]{
            _key,
            title,
            icon,
            customIcon{ asset->{url}, alt },
            description
          }
        }
      }`,
      tags: ["hero", "about"],
    }).catch(() => null),

    // 7. Verified Certifications
    sanityFetch<Certification[]>({
      query: `*[_type == "certification" && featured == true] | order(date desc) {
        title,
        issuer,
        date,
        logo,
        credentialLink,
        categories
      }`,
      tags: ["certification"],
    }).catch(() => []),
  ]);

  return (
    <div className="bg-background text-foreground font-sans transition-colors duration-300 overflow-x-hidden">
      <main className="flex flex-col gap-10 sm:gap-14 md:gap-16 px-4 sm:px-6 md:px-10 lg:px-12 py-6 sm:py-10 max-w-5xl mx-auto w-full">
        {/* 1. HERO */}
        {(settings?.showHero ?? true) && (
          <section id="Hero" className="w-full flex flex-col justify-center items-center scroll-mt-20">
            <Hero data={heroData || undefined} />
          </section>
        )}

        {/* 2. PROFESSIONAL SUMMARY (Clean Editorial Narrative from Sanity) */}
        {aboutData?.heroAbout?.about && (
          <ProfessionalSummary data={aboutData.heroAbout.about} />
        )}

        {/* 3. FEATURED PROJECTS (Compact 3-column desktop showcase, 20% size reduction) */}
        {(settings?.showProjects ?? true) && (
          <Projects data={projects} />
        )}

        {/* 4. CORE EXPERTISE (4 Clean Pillars with Mini Logos from Sanity) */}
        {(settings?.showAbout ?? true) && (
          <About initialData={aboutData || undefined} />
        )}

        {/* 5. CAREER JOURNEY */}
        {(settings?.showTimeline ?? true) && (
          <CareerTimeline initialData={careerData} />
        )}

        {/* 6. TECHNICAL STACK (5 Clean Categories) */}
        {(settings?.showSkills ?? true) && (
          <Skills data={skills} />
        )}

        {/* VERIFIED CERTIFICATIONS */}
        {(settings?.showCertifications ?? true) && certifications.length > 0 && (
          <Certifications initialData={certifications} />
        )}

        {/* 7. CONTACT ME */}
        {(settings?.showContact ?? true) && (
          <Contact />
        )}
      </main>
    </div>
  );
}
