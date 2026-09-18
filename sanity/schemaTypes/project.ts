import { defineField, defineType } from "sanity";
import { seoFields } from "./shared";

export const project = defineType({
  name: "project",
  title: "Case Study / Project",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "clientName", title: "Client name", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "category", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "excerpt", type: "text", rows: 2 }),
    defineField({
      name: "coverImage",
      title: "Cover image",
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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "gallery",
      type: "array",
      of: [
        {
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
        },
      ],
    }),
    defineField({ name: "problem", title: "Problem", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "solution", title: "Solution", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "result", title: "Result", type: "array", of: [{ type: "block" }] }),
    defineField({
      name: "metrics",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "label", type: "string" }),
            defineField({ name: "value", type: "string" }),
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
    defineField({ name: "externalLink", type: "url" }),
    defineField({ name: "featured", type: "boolean", initialValue: false }),
    ...seoFields,
  ],
});
