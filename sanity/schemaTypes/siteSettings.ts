import { defineField, defineType } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    // ===============================
    // HERO SECTION
    // ===============================
    defineField({
      name: "showHero",
      title: "Show Hero Section",
      type: "boolean",
      initialValue: true,
    }),

    // ===============================
    // ABOUT SECTION
    // ===============================
    defineField({
      name: "showAbout",
      title: "Show About Section",
      type: "boolean",
      initialValue: true,
    }),

    // ===============================
    // CAROUSEL / HIGHLIGHTS
    // ===============================
    defineField({
      name: "showCarousel",
      title: "Show Carousel Section",
      type: "boolean",
      initialValue: true,
    }),

    // ===============================
    // CAREER TIMELINE SECTION
    // ===============================
    defineField({
      name: "showTimeline",
      title: "Show Career Timeline Section",
      type: "boolean",
      initialValue: true,
    }),

    // ===============================
    // SKILLS SECTION
    // ===============================
    defineField({
      name: "showSkills",
      title: "Show Skills Section",
      type: "boolean",
      initialValue: true,
    }),

    // ===============================
    // PROJECTS SECTION
    // ===============================
    defineField({
      name: "showProjects",
      title: "Show Projects Section",
      type: "boolean",
      initialValue: true,
    }),

    // ===============================
    // CERTIFICATIONS SECTION
    // ===============================
    defineField({
      name: "showCertifications",
      title: "Show Certifications Section",
      type: "boolean",
      initialValue: true,
    }),

    // ===============================
    // CONTACT SECTION
    // ===============================
    defineField({
      name: "showContact",
      title: "Show Contact Section",
      type: "boolean",
      initialValue: true,
    }),

    // ===============================
    // FOOTER (optional)
    // ===============================
    defineField({
      name: "showFooter",
      title: "Show Footer",
      type: "boolean",
      initialValue: true,
    }),
    // ===============================
    // BLOG (NEW)
    // ===============================
    defineField({
      name: "showBlog",
      title: "Show Blog Link",
      type: "boolean",
      initialValue: true,
    }),

    // ===============================
    // Testimonial SECTION
    // ===============================
    defineField({
      name: "showTestimonial",
      title: "Show Testimonial Section",
      type: "boolean",
      initialValue: true,
    }),
  ],

  preview: {
    prepare() {
      return {
        title: "Site Settings",
      };
    },
  },
});
