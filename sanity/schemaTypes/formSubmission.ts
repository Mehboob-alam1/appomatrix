import { defineField, defineType } from "sanity";

export const formSubmission = defineType({
  name: "formSubmission",
  title: "Form Submission",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string" }),
    defineField({ name: "email", type: "string" }),
    defineField({ name: "phone", type: "string" }),
    defineField({ name: "projectType", type: "string" }),
    defineField({ name: "budget", type: "string" }),
    defineField({ name: "timeline", type: "string" }),
    defineField({ name: "details", type: "text" }),
    defineField({ name: "source", type: "string" }),
    defineField({ name: "submittedAt", type: "datetime" }),
  ],
  readOnly: true,
});
