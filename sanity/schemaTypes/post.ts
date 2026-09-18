import { defineField, defineType } from "sanity";
import { seoFields } from "./shared";

export const post = defineType({
  name: "post",
  title: "Blog Post",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "locale", type: "string", initialValue: "en" }),
    defineField({ name: "excerpt", type: "text", rows: 3, validation: (Rule) => Rule.required() }),
    defineField({
      name: "content",
      type: "array",
      of: [
        { type: "block", styles: [{ title: "Normal", value: "normal" }, { title: "H2", value: "h2" }, { title: "H3", value: "h3" }, { title: "H4", value: "h4" }] },
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
    defineField({
      name: "featuredImage",
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
    defineField({ name: "author", type: "string" }),
    defineField({ name: "category", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "publishedAt", type: "datetime", validation: (Rule) => Rule.required() }),
    defineField({ name: "readingTimeMinutes", type: "number" }),
    ...seoFields,
  ],
});
