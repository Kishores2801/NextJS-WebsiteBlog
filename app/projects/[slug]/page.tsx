/* eslint-disable @typescript-eslint/no-explicit-any */
import { sanityFetch } from "@/sanity/lib/fetch";
import { urlFor } from "@/sanity/lib/image";
import CustomPortableText from "@/components/CustomPortableText";
import Image from "next/image";
import Link from "next/link";
import { Project } from "@/types";
import { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

/**
 * 🔍 Generate Metadata for SEO
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await sanityFetch<Project>({
    query: `*[_type == "project" && slug.current == $slug][0]`,
    params: { slug },
  });

  if (!project) return { title: "Project Not Found" };

  return {
    title: project.title,
    description: project.shortDescription,
    openGraph: {
      images: project.mainImage ? [urlFor(project.mainImage).width(1200).height(630).url()] : [],
    },
  };
}

/**
 * 📄 Project Detail Page (Server Component)
 */
export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;

  const project = await sanityFetch<Project>({
    query: `
      *[_type == "project" && slug.current == $slug][0]{
        title,
        slug,
        shortDescription,
        description,
        mainImage{ asset->{url}, alt },
        technologies,
        links,
        categories[]->{ title, slug },
        date,
        features
      }
    `,
    params: { slug },
    tags: [`project:${slug}`],
  });

  if (!project) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
        <Link href="/projects" className="text-primary hover:underline">
          ← Back to Projects
        </Link>
      </div>
    );
  }

  const readingTime = Math.ceil(
    (project.description?.reduce((acc: number, block: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      return acc + (block.children?.map((c: any) => c.text).join(" ").split(" ").length || 0); // eslint-disable-line @typescript-eslint/no-explicit-any
    }, 0) || 0) / 200
  );

  return (
    <article className="max-w-4xl mx-auto px-4 md:px-6 py-16">
      {/* Header */}
      <header className="mb-12 text-center md:text-left">
        <div className="flex flex-wrap gap-2 mb-4 justify-center md:justify-start">
          {project.categories?.map((cat) => (
            <span key={cat.slug.current} className="px-3 py-1 bg-secondary/10 text-secondary text-xs rounded-full font-medium">
              {cat.title}
            </span>
          ))}
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          {project.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-6 text-muted-foreground text-sm justify-center md:justify-start">
          {project.date && (
            <time dateTime={project.date}>
              {new Date(project.date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </time>
          )}
          
          <span>{readingTime} min read</span>
        </div>
      </header>

      {/* Main Image */}
      {project.mainImage?.asset?.url && (
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl mb-16 bg-muted">
          <Image
            src={urlFor(project.mainImage).width(1920).height(1080).url()}
            alt={project.mainImage.alt || project.title}
            fill
            className="object-cover"
            priority
            unoptimized
          />
        </div>
      )}

      {/* Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">
        
        {/* Main Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <CustomPortableText value={project.description} />
        </div>

        {/* Sidebar */}
        <aside className="space-y-8">
          {/* Links */}
          {(project.links?.live || project.links?.github || project.links?.demo) && (
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-4 text-foreground">Project Links</h3>
              <div className="flex flex-col gap-3">
                {project.links.live && (
                  <a href={project.links.live} target="_blank" rel="noopener noreferrer" className="btn-primary w-full text-center py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition">
                    Visit Live Site
                  </a>
                )}
                {project.links.github && (
                  <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="btn-secondary w-full text-center py-2 rounded-lg border border-border hover:bg-muted transition">
                    View Source Code
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Tech Stack */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-4 text-foreground">Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span key={tech} className="px-3 py-1 bg-muted text-foreground text-sm rounded-md border border-border/50">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* Back Button */}
      <div className="mt-16 pt-8 border-t border-border text-center">
        <Link href="/projects" className="text-primary font-medium hover:underline">
          ← Back to All Projects
        </Link>
      </div>
    </article>
  );
}
