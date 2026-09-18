import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminFormSection } from "@/components/admin/admin-form-section";
import { ImageSeoField } from "@/components/admin/image-seo-field";
import { PostContentEditor } from "@/components/admin/post-content-editor";
import { SeoFieldGroup } from "@/components/admin/seo-field-group";
import { SlugField } from "@/components/admin/slug-field";
import { adminInputClass, adminLabelClass, adminPrimaryButtonClass } from "@/components/admin/admin-form-styles";
import { savePost } from "@/lib/admin/actions";
import { getDb } from "@/db/client";
import * as schema from "@/db/schema";
import { mapPost } from "@/db/mappers";

const FORM_ID = "edit-post-form";

type PageProps = { params: Promise<{ id: string }> };

export default async function AdminPostEditPage({ params }: PageProps) {
  const { id } = await params;
  const isNew = id === "new";
  let post = null;
  if (!isNew) {
    const row = getDb().select().from(schema.posts).where(eq(schema.posts.id, id)).get();
    post = row ? mapPost(row) : null;
    if (!post) notFound();
  }

  return (
    <AdminShell title={isNew ? "New blog post" : "Edit blog post"}>
      <form id={FORM_ID} action={savePost} className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
        <input type="hidden" name="id" value={isNew ? "" : post!._id} />

        <div className="space-y-6">
          <AdminFormSection title="Post details">
            <label className={adminLabelClass}>
              Title (H1 — one per page)
              <input name="title" required defaultValue={post?.title ?? ""} className={adminInputClass} />
            </label>
            <SlugField
              formId={FORM_ID}
              defaultSlug={post?.slug ?? ""}
              defaultTitle={post?.title ?? ""}
              pathPrefix="/blog/"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={adminLabelClass}>
                Category
                <input name="category" required defaultValue={post?.category ?? ""} className={adminInputClass} />
              </label>
              <label className={adminLabelClass}>
                Author
                <input name="author" defaultValue={post?.author ?? ""} className={adminInputClass} />
              </label>
            </div>
            <label className={adminLabelClass}>
              Published at (ISO)
              <input
                name="publishedAt"
                defaultValue={post?.publishedAt ?? new Date().toISOString()}
                className={adminInputClass}
              />
            </label>
          </AdminFormSection>

          <PostContentEditor
            defaultContent={post?.content ?? ""}
            defaultExcerpt={post?.excerpt ?? ""}
            defaultReadingTime={post?.readingTimeMinutes ?? 5}
          />

          <AdminFormSection title="Featured image" description="Used in blog cards, article header, and link previews.">
            <ImageSeoField
              urlName="featuredImage"
              altName="featuredImageAlt"
              urlDefault={post?.featuredImage ?? ""}
              altDefault={post?.featuredImageAlt ?? post?.title ?? ""}
            />
          </AdminFormSection>
        </div>

        <div className="space-y-6 xl:sticky xl:top-6 xl:self-start">
          <SeoFieldGroup
            formId={FORM_ID}
            pathPrefix="/blog/"
            defaultSeoTitle={post?.seoTitle ?? ""}
            defaultSeoDescription={post?.seoDescription ?? ""}
            defaultSlug={post?.slug ?? ""}
            defaultPageTitle={post?.title ?? ""}
          />
          <button type="submit" className={adminPrimaryButtonClass}>
            Publish / save post
          </button>
        </div>
      </form>
    </AdminShell>
  );
}
