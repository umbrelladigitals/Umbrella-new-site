import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react'

export default async function PostsPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' }
  })

  async function deletePost(formData: FormData) {
    'use server'
    const id = formData.get('id')
    if (typeof id === 'string') {
      await prisma.post.delete({ where: { id: parseInt(id) } })
      revalidatePath('/admin/posts')
    }
  }

  async function togglePublish(formData: FormData) {
    'use server'
    const id = formData.get('id')
    if (typeof id === 'string') {
      const post = await prisma.post.findUnique({ where: { id: parseInt(id) } })
      if (post) {
        await prisma.post.update({
          where: { id: parseInt(id) },
          data: { published: !post.published }
        })
        revalidatePath('/admin/posts')
      }
    }
  }

  return (
    <div className="min-h-screen text-white">
      <div>
        <div className="flex justify-between items-center mb-12">
          <div>
             <h1 className="text-4xl font-bold font-syne mb-2">Chronicles</h1>
             <p className="text-gray-500 font-mono text-sm tracking-widest">MANAGE ALCHEMY LOGS</p>
          </div>
          <Link 
            href="/admin/posts/new" 
            className="bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-umbrella-main hover:text-white transition-all duration-300 flex items-center gap-2"
          >
            <Plus size={18} />
            <span>New Entry</span>
          </Link>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-gray-400 font-mono text-xs uppercase tracking-wider">
              <tr>
                <th className="p-6">Status</th>
                <th className="p-6">Title (EN)</th>
                <th className="p-6">Author</th>
                <th className="p-6">Date</th>
                <th className="p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {posts.map(post => (
                <tr key={post.id} className="hover:bg-white/5 transition-colors group">
                  <td className="p-6">
                    <form action={togglePublish}>
                      <input type="hidden" name="id" value={post.id} />
                      <button type="submit" className="cursor-pointer hover:opacity-80 transition-opacity" title="Click to toggle status">
                        {post.published ? (
                            <span className="flex items-center gap-2 text-green-400 text-xs font-mono uppercase bg-green-400/10 px-3 py-1 rounded-full border border-green-400/20">
                                <Eye size={14} /> Published
                            </span>
                        ) : (
                            <span className="flex items-center gap-2 text-gray-400 text-xs font-mono uppercase bg-white/5 px-3 py-1 rounded-full border border-white/10">
                                <EyeOff size={14} /> Draft
                            </span>
                        )}
                      </button>
                    </form>
                  </td>
                  <td className="p-6 font-bold font-syne text-lg">{post.titleEn || post.titleTr || 'Untitled'}</td>
                  <td className="p-6 font-mono text-sm text-gray-400">{post.author}</td>
                  <td className="p-6 font-mono text-sm text-gray-400">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-6 flex justify-end gap-3">
                    <Link 
                      href={`/admin/posts/${post.id}`}
                      className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                      <Edit2 size={18} />
                    </Link>
                    <form action={deletePost}>
                      <input type="hidden" name="id" value={post.id} />
                      <button type="submit" className="p-2 rounded-full hover:bg-red-500/20 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {posts.length === 0 && (
            <div className="p-12 text-center text-gray-500 font-mono">
              NO ENTRIES FOUND IN CHRONICLES
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
