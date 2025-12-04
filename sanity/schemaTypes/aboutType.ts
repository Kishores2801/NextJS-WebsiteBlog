import { defineType, defineField, defineArrayMember } from 'sanity'
import { UserIcon, ImageIcon } from '@sanity/icons'

export const aboutType = defineType({
  name: 'about',
  title: 'About / What I Do',
  type: 'document',
  icon: UserIcon,

  fields: [
    defineField({
      name: 'items',
      title: 'About Cards',
      type: 'array',
      description: 'Add each area of expertise with image, title, and description.',
      of: [
        defineArrayMember({
          type: 'object',
          icon: ImageIcon,
          fields: [
            {
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
              description: 'E.g., “Data Analysis”',
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 3,
              validation: (Rule) => Rule.required(),
              description: 'E.g., “I specialize in converting data into insights…”',
            },
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'description',
            },
          },
        }),
      ],
    }),
  ],

  preview: {
    prepare() {
      return {
        title: 'About Section',
        subtitle: 'Contains service/expertise cards',
      }
    },
  },
})
