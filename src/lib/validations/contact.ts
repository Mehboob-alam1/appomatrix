import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().optional(),
  projectType: z.enum(["web", "mobile", "saas", "consulting"], {
    message: "Select a project type",
  }),
  budget: z.enum(["under-10k", "10k-25k", "25k-50k", "50k-plus"], {
    message: "Select a budget range",
  }),
  timeline: z.enum(["asap", "1-3-months", "3-6-months", "flexible"], {
    message: "Select a timeline",
  }),
  details: z.string().min(20, "Tell us a bit more about your project (20+ characters)"),
  source: z.string().optional(),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export const newsletterSchema = z.object({
  email: z.string().email("Enter a valid email"),
});
