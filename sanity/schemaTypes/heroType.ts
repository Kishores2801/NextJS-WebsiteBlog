import { defineType, defineField } from 'sanity'
import { UserIcon } from '@sanity/icons'

export const heroType = defineType({
  name: 'hero',
  title: 'Hero Section',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name (Typewriter Main Text)',
      type: 'string',
      description: 'Your display name — shown as the main heading.',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'typewriterTexts',
      title: 'Typewriter Phrases',
      type: 'array',
      of: [{ type: 'string' }],
      description:
        'Phrases that loop in the typewriter effect (e.g., “Data Analyst”, “ML Engineer”).',
      validation: (Rule) => Rule.required().min(1),
    }),

    defineField({
      name: 'about',
      title: 'About Section (Short Bio)',
      type: 'array',
      of: [{ type: 'block' }],
      description:
        'Optional short paragraph about yourself, displayed near the hero section.',
    }),

    defineField({
      name: 'profileImage',
      title: 'Profile Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Upload your hero/profile image.',
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Describe the image for accessibility and SEO.',
        },
      ],
      validation: (Rule) => Rule.required(),
    }),

    // 🟦 New Fields
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
      description: 'Your contact email — shown in the contact section or hero area.',
      validation: (Rule) =>
        Rule.required()
          .regex(
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            { name: 'email', invert: false }
          )
          .error('Please enter a valid email address.'),
    }),

    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'Your current location (e.g., Colombo, Sri Lanka).',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'resume',
      title: 'Resume (PDF)',
      type: 'file',
      description: 'Upload your latest resume in PDF format.',
      options: {
        accept: '.pdf',
      },
      
    }),
  ],

  preview: {
    select: {
      title: 'name',
      subtitle: 'location',
      media: 'profileImage',
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || 'Hero Section',
        subtitle: subtitle || 'No location set',
        media,
      }
    },
  },
})
