import { defineType, defineField } from "sanity";
import { BriefcaseIcon } from "lucide-react";

export const careerType = defineType({
  name: "career",
  title: "Career Highlights",
  type: "document",
  icon: BriefcaseIcon,

  fields: [
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Work Experience", value: "work" },
          { title: "Education", value: "education" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "E.g., 'Data Analyst at Stax' or 'MSc in Data Science'",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "organization",
      title: "Organization / Institution",
      type: "string",
      description: "Company or University name",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description: "E.g., Colombo, Sri Lanka",
    }),

    defineField({
      name: "skills",
      title: "Skills / Technologies",
      type: "array",
      of: [{ type: "string" }],
      description: "List of key technologies or skills used in this role",
    }),

    // 🕒 Start & End Dates
    defineField({
      name: "startDate",
      title: "Start Date",
      type: "date",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "endDate",
      title: "End Date",
      type: "date",
      hidden: ({ parent }) => parent?.isCurrent === true, // hide when still current
    }),

    defineField({
      name: "isCurrent",
      title: "Currently Working / Studying Here?",
      type: "boolean",
      initialValue: false,
    }),

    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description: "Brief overview of your role, research, or achievements.",
    }),

    defineField({
      name: "logo",
      title: "Logo / Image",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Alt Text" }],
    }),
  ],

  preview: {
    select: {
      title: "title",
      subtitle: "organization",
      media: "logo",
    },
  },
});
