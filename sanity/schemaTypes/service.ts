import { defineField, defineType } from "sanity";
import { seoFields } from "./shared";

export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "shortDescription", type: "text", rows: 2, validation: (Rule) => Rule.required() }),
    defineField({ name: "fullDescription", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "icon", type: "string", description: "Icon key: globe, smartphone, layers, compass" }),
    defineField({
      name: "image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: "processSteps",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", type: "string" }),
            defineField({ name: "description", type: "text", rows: 2 }),
          ],
        },
      ],
    }),
    defineField({
      name: "techStack",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "relatedProjects",
      type: "array",
      of: [{ type: "reference", to: [{ type: "project" }] }],
    }),
    ...seoFields,
  ],
});
