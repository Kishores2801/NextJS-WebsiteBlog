import { DocumentTextIcon } from '@sanity/icons'
import { defineType, defineField, defineArrayMember } from 'sanity'

export const blogType = defineType({
  name: 'post',
  title: 'Blog',
  type: 'document',
  icon: DocumentTextIcon,



  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().min(5).max(100),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'excerpt',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      description: 'A short summary or introduction to the blog post (used in previews).',
    }),

    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          description: 'Used for accessibility and SEO.',
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'category' }],
        }),
      ],
      description: 'Categorize your blog post (e.g., AI, Data Science, Career).',
    }),

    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Additional tags for SEO and filtering (e.g., #AI #Python).',
      options: {
        layout: 'tags',
      },
    }),

    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'readingTime',
      title: 'Estimated Reading Time (mins)',
      type: 'number',
      description: 'Optional. Helps readers estimate how long it takes to read.',
    }),

    defineField({
      name: 'body',
      title: 'Content',
      type: 'blockContent',
      description: 'Main article content.',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'featured',
      title: 'Featured Post?',
      type: 'boolean',
      initialValue: false,
      description: 'Mark true to feature this post on the homepage.',
    }),

    // 🔥 New field — Must be ON to publish
    defineField({
      name: 'approved',
      title: 'Ready to Publish?',
      type: 'boolean',
      initialValue: false,
      description: 'Turn this ON only when the post is fully completed. Required to publish.',
    }),
  ],

  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
      featured: 'featured',
      approved: 'approved',
    },
    prepare({ title, author, media, featured, approved }) {
      return {
        title: title || 'Untitled Blog Post',
        subtitle: `${author ? `by ${author}` : ''} ${
          featured ? ' ⭐ Featured' : ''
        } ${approved ? '' : ' (Not Approved)'}`,
        media,
      }
    },
  },
})
