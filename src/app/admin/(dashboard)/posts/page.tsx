import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { getPosts } from "@/lib/data";
import { deletePost } from "@/lib/admin/actions";

export default async function AdminPostsPage() {
  const posts = await getPosts();

  return (
    <AdminShell title="Blog posts">
      <Link href="/admin/posts/new" className="rounded-full bg-blue-500 px-4 py-2 text-sm font-medium">
        Add post
      </Link>
      <div className="mt-6 overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-slate-400">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post._id} className="border-t border-white/10">
                <td className="px-4 py-3">{post.title}</td>
                <td className="px-4 py-3 text-slate-400">{post.category}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/posts/${post._id}`} className="text-blue-300 hover:underline">
                    Edit
                  </Link>
                  <form action={deletePost.bind(null, post._id)} className="ml-3 inline">
                    <button type="submit" className="text-red-300 hover:underline">
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
