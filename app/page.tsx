import { sanityFetch } from "@/sanity/lib/fetch";
import NavBar from "@/components/NavBar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import CareerTimeline from "@/components/CareerTimeline";
import Certifications from "@/components/Certifications";
import { Settings, HeroData, Project, Skill } from "@/types";

/**
 * 🏠 Home Page (Server Component)
 * Fetches all data server-side for better SEO and performance (LCP).
 */
export default async function Home() {
  // 1. Fetch Site Settings
  const settings = await sanityFetch<Settings>({
    query: `*[_type == "siteSettings"][0]`,
    tags: ["siteSettings"],
  });

  // 2. Fetch Hero Data
  const heroData = await sanityFetch<HeroData>({
    query: `*[_type == "hero"][0]{
      name,
      typewriterTexts,
      tagline,
      profileImage{ asset->{url}, alt }
    }`,
    tags: ["hero"],
  });

  // 3. Fetch Featured Projects
  const projects = await sanityFetch<Project[]>({
    query: `*[_type == "project" && featured == true] | order(date desc) {
      _id,
      title,
      slug,
      shortDescription,
      mainImage{ asset->{url}, alt },
      technologies,
      links,
      categories[]->{ title, slug },
      date
    }`,
    tags: ["project"],
  });

  // 4. Fetch Skills
  const skills = await sanityFetch<Skill[]>({
    query: `*[_type == "skill"] | order(category asc, title asc) {
      _id,
      title,
      category,
      icon{ asset->{url}, alt }
    }`,
    tags: ["skill"],
  });

  return (
    <div className="bg-background text-foreground font-sans transition-colors duration-300 overflow-x-hidden">
      {/* 
        Pass settings to NavBar so it doesn't need to fetch client-side.
        (Note: NavBar needs to be updated to accept props)
      */}
      <NavBar settings={settings} />

      <main className="flex flex-col gap-16 sm:gap-24 px-4 sm:px-6 md:px-12 lg:px-16 py-10 max-w-7xl mx-auto w-full">
        
        {/* ========================= HERO ========================= */}
        {settings?.showHero && (
          <section id="Hero" className="min-h-[80vh] flex flex-col justify-center items-center scroll-mt-20">
            <Hero data={heroData} />
          </section>
        )}

        {/* ========================= ABOUT ========================= */}
        {settings?.showAbout && (
          <section id="About" className="w-full scroll-mt-24">
            <About />
          </section>
        )}


        {/* ========================= CAREER TIMELINE ========================= */}
        {settings?.showTimeline && (
          <section id="CareerTimeline" className="w-full scroll-mt-24">
            <CareerTimeline />
          </section>
        )}

        {/* ========================= SKILLS ========================= */}
        {settings?.showSkills && (
          <section id="Skills" className="w-full scroll-mt-24">
            <Skills data={skills} />
          </section>
        )}

        {/* ========================= PROJECTS ========================= */}
        {settings?.showProjects && (
          <section id="Projects" className="w-full scroll-mt-24">
            <Projects data={projects} />
          </section>
        )}

        {/* ========================= CERTIFICATIONS ========================= */}
        {settings?.showCertifications && (
          <section id="Certifications" className="w-full scroll-mt-24">
            <Certifications />
          </section>
        )}



        {/* ========================= CONTACT ========================= */}
        {settings?.showContact && (
          <section id="Contact" className="w-full scroll-mt-24">
            <Contact />
          </section>
        )}
      </main>
    </div>
  );
}
