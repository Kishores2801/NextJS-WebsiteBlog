import { defineField, defineType } from 'sanity'
import { FolderIcon } from '@sanity/icons'

/**
 * 📂 Project Schema
 * Defines the structure for portfolio projects.
 */
export const projectType = defineType({
  name: 'project',
  title: 'Projects',
  type: 'document',
  icon: FolderIcon,
  fields: [
    // 🧠 Basic Info
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'The name of the project.',
      validation: (Rule) => Rule.required().min(3).warning('Title should be descriptive.'),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'Unique URL identifier for the project.',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required().error('Slug is required for routing.'),
    }),

    // 💬 Short Summary
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      description: 'Brief summary shown on the project card (approx. 20-30 words).',
      validation: (Rule) => Rule.max(200).warning('Keep it short for better UI.'),
    }),

    // 🧾 Detailed Description (Rich Text)
    defineField({
      name: 'description',
      title: 'Full Description',
      type: 'array',
      of: [
        { type: 'block' }, // portable text
        { type: 'image', options: { hotspot: true } },
      ],
      description: 'Full case study: Problem, Solution, Tech Stack, and Outcome.',
    }),

    // 🖼️ Main Image
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Cover image for the project card and detail page.',
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Important for SEO and accessibility.',
          validation: (Rule) => Rule.required(),
        },
      ],
    }),

    // ⚙️ Tech Stack
    defineField({
      name: 'technologies',
      title: 'Tech Stack',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List of technologies used (e.g., React, Next.js, Tailwind).',
      options: {
        layout: 'tags',
      },
    }),

    // 🔗 Links
    defineField({
      name: 'links',
      title: 'Links',
      type: 'object',
      fields: [
        { name: 'live', title: 'Live Site URL', type: 'url' },
        { name: 'github', title: 'GitHub Repo URL', type: 'url' },
        { name: 'demo', title: 'Demo Video URL', type: 'url' },
      ],
    }),

    // 🌟 Featured Toggle
    defineField({
      name: 'featured',
      title: 'Featured Project',
      type: 'boolean',
      initialValue: false,
      description: 'Toggle ON to show this project on the Home page.',
    }),

    // 🏷️ Categories
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
      description: 'Categorize the project (e.g., Web App, Mobile, Design).',
    }),

    // 📅 Completion Date
    defineField({
      name: 'date',
      title: 'Completion Date',
      type: 'date',
      options: { dateFormat: 'YYYY-MM-DD' },
      description: 'When was this project completed?',
    }),

    // 🧩 Key Highlights / Features
    defineField({
      name: 'features',
      title: 'Key Features',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Bullet points highlighting key features.',
    }),
  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'shortDescription',
      media: 'mainImage',
    },
  },
})
