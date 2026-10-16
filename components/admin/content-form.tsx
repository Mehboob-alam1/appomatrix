"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveContent } from "@/lib/actions";
import { csrfTokenFromDocument } from "@/lib/csrf-client";
import { SERVICE_ICONS } from "@/components/site/service-icon";
import { GalleryField, ImageField } from "@/components/admin/media";
import { RichTextField } from "@/components/admin/rich-text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ContentForm({
  section,
  values,
  parents,
  categories = [],
}: {
  section: string;
  values: Record<string, string>;
  parents: { id: string; title: string }[];
  categories?: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const published = !values.id || values.published === "1";

  return (
    <form
      className="max-w-3xl space-y-5"
      onSubmit={async (event) => {
        event.preventDefault();
        setPending(true);
        setError("");
        const form = new FormData(event.currentTarget);
        form.set("csrf", csrfTokenFromDocument());
        const result = await saveContent(section, form);
        setPending(false);
        if (!result.ok) {
          setError(result.error);
          return;
        }
        router.push(`/admin/${section}?saved=1`);
        router.refresh();
      }}
    >
      <input type="hidden" name="id" value={values.id || ""} />
      {section === "portfolio" ? <input type="hidden" name="createdAt" value={values.createdAt || ""} /> : null}

      {section === "services" ? (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Title" name="title" defaultValue={values.title} required />
            <Field label="Slug" name="slug" defaultValue={values.slug} placeholder="Leave blank to generate" />
            <SelectField label="Parent service" name="parentId" defaultValue={values.parentId || ""}>
              <option value="">Top-level group</option>
              {parents.filter((parent) => parent.id !== values.id).map((parent) => (
                <option key={parent.id} value={parent.id}>{parent.title}</option>
              ))}
            </SelectField>
            <SelectField label="Icon" name="icon" defaultValue={values.icon || "globe"}>
              {SERVICE_ICONS.map((icon) => (
                <option key={icon} value={icon}>{icon}</option>
              ))}
            </SelectField>
          </div>
          <Area label="Short description" name="shortDescription" defaultValue={values.shortDescription} required />
          <RichTextField label="Full description" name="fullDescription" defaultValue={values.fullDescription} minHeight="260px" hint="Use headings, lists, highlight, and alignment." />
          <ImageField name="image" label="Service image" defaultValue={values.image} hint="Wide cover for the service page" aspect="wide" />
          <Field label="Image alt text" name="imageAlt" defaultValue={values.imageAlt} />
          <Area label="Process" name="processText" defaultValue={values.processText} hint="One step per line: Title | Description" />
          <Field label="Tech stack" name="techStack" defaultValue={values.techStack} placeholder="Comma separated" />
        </>
      ) : null}

      {section === "portfolio" ? (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Title" name="title" defaultValue={values.title} required />
            <Field label="Slug" name="slug" defaultValue={values.slug} />
            <Field label="Client" name="clientName" defaultValue={values.clientName} required />
            <Field label="Category" name="category" defaultValue={values.category} required placeholder="SaaS, Web, Mobile…" />
          </div>
          <Area label="Excerpt" name="excerpt" defaultValue={values.excerpt} />
          <ImageField name="coverImage" label="Cover image" defaultValue={values.coverImage} hint="Main project photo shown on listings" aspect="wide" />
          <Field label="Cover alt text" name="coverImageAlt" defaultValue={values.coverImageAlt} />
          <GalleryField defaultValue={values.gallery} />
          <RichTextField label="Problem" name="problem" defaultValue={values.problem} />
          <RichTextField label="Solution" name="solution" defaultValue={values.solution} />
          <RichTextField label="Result" name="result" defaultValue={values.result} />
          <Area label="Metrics" name="metricsText" defaultValue={values.metricsText} hint="One per line: Value | Label" />
          <Field label="Tech stack" name="techStack" defaultValue={values.techStack} />
          <Field label="Live product backlink" name="externalLink" defaultValue={values.externalLink} placeholder="https://" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="featured" defaultChecked={values.featured === "1"} />
            Feature on the homepage
          </label>
        </>
      ) : null}

      {section === "blog" ? (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Title" name="title" defaultValue={values.title} required />
            <Field label="Slug" name="slug" defaultValue={values.slug} />
            {categories.length > 0 ? (
              <SelectField label="Category" name="categoryId" defaultValue={values.categoryId || ""}>
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </SelectField>
            ) : (
              <Field label="Category" name="category" defaultValue={values.category} required />
            )}
            <Field label="Author" name="author" defaultValue={values.author} />
            <Field label="Published date" name="publishedAt" defaultValue={values.publishedAt?.slice(0, 10)} type="date" />
          </div>
          <Area label="Excerpt" name="excerpt" defaultValue={values.excerpt} required />
          <RichTextField label="Content" name="content" defaultValue={values.content} required minHeight="360px" hint="Headings, lists, highlight, links, and alignment are available in the toolbar." />
          <ImageField name="featuredImage" label="Featured image" defaultValue={values.featuredImage} hint="Cover photo for the post" aspect="wide" />
          <Field label="Image alt text" name="featuredImageAlt" defaultValue={values.featuredImageAlt} />
        </>
      ) : null}

      {section === "team" ? (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Name" name="name" defaultValue={values.name} required />
            <Field label="Role" name="role" defaultValue={values.role} required />
            <Field label="LinkedIn URL" name="linkedin" defaultValue={values.linkedin} />
          </div>
          <ImageField name="photo" label="Profile photo" defaultValue={values.photo} hint="Square or portrait photo works best" aspect="portrait" />
          <Field label="Photo alt text" name="photoAlt" defaultValue={values.photoAlt} />
          <RichTextField label="Bio" name="bio" defaultValue={values.bio} minHeight="180px" />
        </>
      ) : null}

      {section === "testimonials" ? (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Client name" name="clientName" defaultValue={values.clientName} required />
            <Field label="Role" name="role" defaultValue={values.role} required />
            <Field label="Company" name="company" defaultValue={values.company} required />
            <Field label="Rating" name="rating" type="number" defaultValue={values.rating || "5"} />
          </div>
          <Area label="Quote" name="quote" defaultValue={values.quote} required rows={4} />
        </>
      ) : null}

      {section === "careers" ? (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Title" name="title" defaultValue={values.title} required />
            <Field label="Slug" name="slug" defaultValue={values.slug} />
            <SelectField label="Kind" name="kind" defaultValue={values.kind || "Role"}>
              {["Role", "Internship", "Program"].map((kind) => (
                <option key={kind}>{kind}</option>
              ))}
            </SelectField>
            <Field label="Location" name="location" defaultValue={values.location} />
            <Field label="Department" name="department" defaultValue={values.department} />
            <Field label="Deadline" name="deadline" type="date" defaultValue={values.deadline} />
          </div>
          <Area label="Summary" name="summary" defaultValue={values.summary} required />
          <RichTextField label="Description" name="description" defaultValue={values.description} minHeight="280px" />
          <Area label="Requirements" name="requirements" defaultValue={values.requirements} hint="One requirement per line." />
        </>
      ) : null}

      {section === "scholarships" ? (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Title" name="title" defaultValue={values.title} required />
            <Field label="Slug" name="slug" defaultValue={values.slug} />
            <Field label="Award" name="award" defaultValue={values.award} />
            <Field label="Deadline" name="deadline" type="date" defaultValue={values.deadline} />
          </div>
          <Area label="Eligibility" name="eligibility" defaultValue={values.eligibility} />
          <Area label="Summary" name="summary" defaultValue={values.summary} required />
          <RichTextField label="Description" name="description" defaultValue={values.description} minHeight="280px" />
          <ImageField name="coverImage" label="Cover image" defaultValue={values.coverImage} hint="Scholarship listing photo" aspect="wide" />
          <Field label="Cover alt text" name="coverImageAlt" defaultValue={values.coverImageAlt} />
          <Field label="Application URL" name="applicationUrl" defaultValue={values.applicationUrl} placeholder="Leave blank to use the contact form" />
        </>
      ) : null}

      {section === "categories" ? (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Name" name="name" defaultValue={values.name} required />
            <Field label="Slug" name="slug" defaultValue={values.slug} placeholder="Leave blank to generate" />
          </div>
          <Area label="Description" name="description" defaultValue={values.description} />
        </>
      ) : null}

      {section === "navigation" ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Label" name="label" defaultValue={values.label} required />
          <Field label="Link" name="href" defaultValue={values.href} required placeholder="/about or https://" />
          <SelectField label="Placement" name="location" defaultValue={values.location || "header"}>
            <option value="header">Header</option>
            <option value="header_cta">Header button</option>
            <option value="footer">Footer</option>
          </SelectField>
        </div>
      ) : null}

      {section === "social" ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Label" name="label" defaultValue={values.label} required />
          <Field label="URL" name="url" defaultValue={values.url} required placeholder="https://" />
        </div>
      ) : null}

      {section === "sections" ? (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Section key" name="sectionKey" defaultValue={values.sectionKey} placeholder="services, portfolio, closing…" />
            <Field label="Kicker" name="kicker" defaultValue={values.kicker} />
          </div>
          <Field label="Title" name="title" defaultValue={values.title} />
          <RichTextField label="Body" name="body" defaultValue={values.body} />
          <ImageField name="image" label="Section image" defaultValue={values.image} aspect="wide" />
          <Field label="Image alt text" name="imageAlt" defaultValue={values.imageAlt} />
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Button label" name="ctaLabel" defaultValue={values.ctaLabel} />
            <Field label="Button link" name="ctaHref" defaultValue={values.ctaHref} placeholder="/contact" />
          </div>
        </>
      ) : null}

      {section === "pages" ? (
        <>
          <Field label="Path" name="path" defaultValue={values.path} required placeholder="/about" />
          <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
            Edit the page heading, introduction, rich content, and image here. SEO title and description are at the bottom.
            Homepage hero text and the hero photo are in Settings. Homepage block headings are in Homepage.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Kicker" name="kicker" defaultValue={values.kicker} placeholder="About Us" />
            <Field label="Second heading" name="secondaryTitle" defaultValue={values.secondaryTitle} placeholder="Used on About for the team block" />
          </div>
          <Field label="Page heading" name="heading" defaultValue={values.heading} placeholder="The large title on the page" />
          <Area label="Introduction" name="lead" defaultValue={values.lead} rows={3} />
          <RichTextField label="Page content" name="body" defaultValue={values.body} minHeight="280px" hint="Add headings, lists, highlighted text, and alignment." />
          <ImageField name="image" label="Page image" defaultValue={values.image} hint="Optional banner under the page title" aspect="wide" />
          <Field label="Image alt text" name="imageAlt" defaultValue={values.imageAlt} />
          <Field label="Browser title" name="title" defaultValue={values.title} required />
          <Area label="Browser description" name="description" defaultValue={values.description} required />
        </>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Sort order" name="sortOrder" type="number" defaultValue={values.sortOrder || "0"} />
        <label className="flex items-center gap-2 self-end text-sm">
          <input type="checkbox" name="published" defaultChecked={published} />
          Published on the site
        </label>
      </div>
      {error ? <p className="text-sm text-destructive" role="alert">{error}</p> : null}
      <div className="flex gap-3">
        <Button type="submit" className="h-10 px-4" disabled={pending}>{pending ? "Saving…" : "Save"}</Button>
        <Button type="button" variant="outline" className="h-10" onClick={() => router.push(`/admin/${section}`)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  required,
  placeholder,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="space-y-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} type={type} required={required} defaultValue={defaultValue} placeholder={placeholder} className="h-10" />
    </label>
  );
}

function Area({
  label,
  name,
  defaultValue,
  required,
  rows = 3,
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  rows?: number;
  hint?: string;
}) {
  return (
    <label className="block space-y-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Textarea id={name} name={name} required={required} defaultValue={defaultValue} rows={rows} />
      {hint ? <span className="block text-xs text-muted-foreground">{hint}</span> : null}
    </label>
  );
}

function SelectField({
  label,
  name,
  defaultValue,
  children,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="space-y-1.5">
      <Label htmlFor={name}>{label}</Label>
      <select id={name} name={name} defaultValue={defaultValue} className="h-10 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm">
        {children}
      </select>
    </label>
  );
}
