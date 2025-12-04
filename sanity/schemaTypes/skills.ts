import { defineField, defineType } from "sanity";
import { StarIcon } from "@sanity/icons";

export const skillType = defineType({
  name: "skill",
  title: "Skill",
  type: "document",
  icon: StarIcon,

  fields: [
    // Skill Name
    defineField({
      name: "title",
      title: "Skill Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    // Slug
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),

    // Category Dropdown
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Programming", value: "programming" },
          { title: "Frontend", value: "frontend" },
          { title: "Backend", value: "backend" },
          { title: "Database", value: "database" },
          { title: "Cloud & DevOps", value: "cloud" },
          { title: "Data Science", value: "datascience" },
          { title: "Machine Learning", value: "ml" },
          { title: "Tools & Platforms", value: "tools" },
          { title: "Other (Custom)", value: "other" }, // ⭐ NEW OPTION
        ],
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required(),
    }),

    // Custom Category Name (only if "Other" is chosen)
    defineField({
      name: "customCategory",
      title: "Custom Category Name",
      type: "string",
      hidden: ({ parent }) => parent?.category !== "other", // ⭐ Only shows when needed
      description: "Enter a custom category only if not in the predefined list.",
    }),

    // Icon Image
    defineField({
      name: "icon",
      title: "Icon",
      type: "image",
      options: { hotspot: true },
      description: "Upload logo or icon (Python, React, AWS, etc.)",
    }),
  ],

  preview: {
    select: {
      title: "title",
      subtitle: "category",
      media: "icon",
    },
    prepare(selection) {
      const { title, subtitle } = selection;
      return {
        ...selection,
        subtitle:
          subtitle === "other"
            ? "Custom Category"
            : subtitle.charAt(0).toUpperCase() + subtitle.slice(1),
      };
    },
  },
});
