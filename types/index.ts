/**
 * 📦 Types
 * Centralized type definitions for the application.
 */

// 🖼️ Sanity Image
export interface SanityImage {
  asset?: {
    url?: string
    _ref?: string
  }
  alt?: string
}

// 📂 Project
export interface Project {
  _id: string
  title: string
  slug: { current: string }
  shortDescription?: string
  description?: any[] // Portable Text
  mainImage?: SanityImage
  technologies?: string[]
  links?: {
    live?: string
    github?: string
    demo?: string
  }
  featured?: boolean
  categories?: { title: string; slug: { current: string } }[]
  date?: string
  features?: string[]
}

// 🛠️ Skill
export interface Skill {
  _id: string
  title: string
  category: string
  icon?: SanityImage
}

// 🦸 Hero Data
export interface HeroData {
  name?: string
  typewriterTexts?: string[]
  tagline?: string
  profileImage?: SanityImage
}

// ⚙️ Site Settings
export interface Settings {
  showHero: boolean
  showAbout: boolean
  showSkills: boolean
  showProjects: boolean
  showContact: boolean
  showBlog: boolean
  showTimeline?: boolean
  showCarousel?: boolean
  showCertifications?: boolean
  showTestimonials?: boolean
}

// 📝 Blog Post
export interface Post {
  _id: string
  title: string
  slug: { current: string }
  publishedAt: string
  mainImage?: SanityImage
  body?: any[] // Portable Text
  excerpt?: string
  author?: {
    name: string
    image?: SanityImage
  }
}
