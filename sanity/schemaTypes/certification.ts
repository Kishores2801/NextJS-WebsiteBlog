import { defineType, defineField } from "sanity";

export default defineType({
  name: "certification",
  title: "Certifications",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Certification Title",
      type: "string",
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: "issuer",
      title: "Issuer / Organization",
      type: "string",
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: "date",
      title: "Year Earned",
      type: "string",
      description: "Example: 2024",
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: "logo",
      title: "Organization Logo",
      type: "image",
      options: { hotspot: true },
    }),

    defineField({
      name: "credentialLink",
      title: "Credential URL",
      type: "url",
    }),

    // ⭐ Unlimited category tags
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    }),

    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: true,
    }),
  ],

  preview: {
    select: {
      title: "title",
      media: "logo",
      subtitle: "issuer",
    },
  },
});
