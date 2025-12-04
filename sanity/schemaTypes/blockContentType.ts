// /schemas/blockContentType.ts
import { defineType, defineArrayMember, defineField } from 'sanity'
import { ImageIcon, CodeIcon } from '@sanity/icons'
import { PiMathOperationsBold } from 'react-icons/pi'

/**
 * Extended Block Content Schema
 * - Supports rich text, code, callouts, video embeds, tables, and LaTeX (block + inline)
 */

export const blockContentType = defineType({
  name: 'blockContent',
  title: 'Block Content',
  type: 'array',
  of: [
    // 🧱 Text Blocks
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H1', value: 'h1' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'H4', value: 'h4' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Numbered', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Bold', value: 'strong' },
          { title: 'Italic', value: 'em' },
          { title: 'Underline', value: 'underline' },
          { title: 'Code', value: 'code' },
          { title: 'Highlight', value: 'highlight' },
        ],
        annotations: [
          {
            title: 'URL',
            name: 'link',
            type: 'object',
            fields: [
              { name: 'href', title: 'URL', type: 'url' },
              {
                name: 'openInNewTab',
                title: 'Open in new tab',
                type: 'boolean',
                initialValue: true,
              },
            ],
          },
        ],
      },
    }),

    // 🖼️ Images
    defineArrayMember({
      type: 'image',
      icon: ImageIcon,
      options: { hotspot: false },
      fields: [
        { name: 'alt', title: 'Alternative Text', type: 'string' },
        {
          name: 'caption',
          title: 'Caption',
          type: 'string',
          description: 'Optional caption displayed below the image',
        },
      ],
    }),

    // 💻 Code Blocks
    defineArrayMember({
      name: 'codeBlock',
      title: 'Code Block',
      type: 'code',
      icon: CodeIcon,
      options: {
        withFilename: true,
        language: 'javascript',
        languageAlternatives: [
          { title: 'JavaScript', value: 'javascript' },
          { title: 'TypeScript', value: 'typescript' },
          { title: 'Python', value: 'python' },
          { title: 'HTML', value: 'html' },
          { title: 'CSS', value: 'css' },
          { title: 'SQL', value: 'sql' },
          { title: 'JSON', value: 'json' },
        ],
      },
    }),

    // ⚠️ Callouts
    defineArrayMember({
      name: 'callout',
      title: 'Callout Box',
      type: 'object',
      fields: [
        {
          name: 'tone',
          title: 'Tone',
          type: 'string',
          options: {
            list: [
              { title: 'Info', value: 'info' },
              { title: 'Warning', value: 'warning' },
              { title: 'Success', value: 'success' },
              { title: 'Error', value: 'error' },
            ],
            layout: 'radio',
          },
          initialValue: 'info',
        },
        {
          name: 'body',
          title: 'Body',
          type: 'text',
          description: 'Main content of the callout box',
        },
      ],
    }),

    // 🎥 Video Embeds
    defineArrayMember({
      name: 'videoEmbed',
      title: 'Video Embed',
      type: 'object',
      fields: [
        { name: 'url', title: 'Video URL (YouTube/Vimeo)', type: 'url' },
        {
          name: 'caption',
          title: 'Caption',
          type: 'string',
          description: 'Optional caption displayed below the video',
        },
      ],
    }),

    // 📊 Tables
    defineArrayMember({
      name: 'table',
      title: 'Table',
      type: 'table',
    }),

    // 🧮 LaTeX Block Formulas
    defineArrayMember({
      name: 'latex',
      title: 'LaTeX Formula (Block)',
      type: 'object',
      icon: PiMathOperationsBold,
      fields: [
        defineField({
          name: 'formula',
          title: 'LaTeX Expression',
          type: 'text',
          rows: 3,
          description:
            'Use $$...$$ for block math. Appears centered on its own line.',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'caption',
          title: 'Caption (Optional)',
          type: 'string',
          description: 'Caption displayed below the formula.',
        }),
      ],
      preview: {
        select: { formula: 'formula' },
        prepare({ formula }) {
          return {
            title: '🧮 Block Formula',
            subtitle: formula ? formula.slice(0, 80) : 'No content',
          }
        },
      },
    }),

    // ✏️ Inline LaTeX Formulas
    defineArrayMember({
      name: 'latexInline',
      title: 'Inline LaTeX Formula',
      type: 'object',
      icon: PiMathOperationsBold,
      fields: [
        defineField({
          name: 'formula',
          title: 'Inline LaTeX',
          type: 'string',
          description:
            'Use $...$ syntax for inline math (renders within a paragraph).',
          validation: (Rule) => Rule.required(),
        }),
      ],
      preview: {
        select: { formula: 'formula' },
        prepare({ formula }) {
          return {
            title: '🔢 Inline Formula',
            subtitle: formula ? formula.slice(0, 80) : 'No content',
          }
        },
      },
    }),
  ],
})
