import { prisma } from '@/lib/prisma'
import PostForm from '@/components/admin/PostForm'
import { notFound } from 'next/navigation'

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = await prisma.post.findUnique({
    where: { id: parseInt(id) }
  })

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen text-white">
      <div>
        <div className="mb-12">
           <h1 className="text-4xl font-bold font-syne mb-2">Edit Entry</h1>
           <p className="text-gray-500 font-mono text-sm tracking-widest">MODIFY CHRONICLES</p>
        </div>
        <PostForm post={post} />
      </div>
    </div>
  )
}
