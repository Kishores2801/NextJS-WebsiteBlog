import { defineField, defineType } from "sanity";

export default defineType({
  name: "testimonial",
  title: "Testimonials",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Person Name",
      type: "string",
      validation: Rule => Rule.required(),
    }),

      defineField({
      name: "designation",
      title: "Role / Position",
      type: "string",
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: "company",
      title: "Company",
      type: "string",
    }),

    defineField({
      name: "message",
      title: "Testimonial Message",
      type: "text",
      rows: 4,
      validation: Rule => Rule.required().min(10),
    }),

    defineField({
      name: "avatar",
      title: "Avatar Image",
      type: "image",
      options: { hotspot: true },
    }),

    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: true,
    }),

    defineField({
      name: "rating",
      title: "Rating (1–5 stars)",
      type: "number",
      validation: Rule =>
        Rule.min(1).max(5),
      initialValue: 5,
    }),
  ],

  preview: {
    select: {
      title: "name",
      subtitle: "company",
      media: "avatar",
    },
  },
});
