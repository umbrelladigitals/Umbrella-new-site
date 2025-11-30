import PostForm from '@/components/admin/PostForm'

export default function NewPostPage() {
  return (
    <div className="min-h-screen text-white">
      <div>
        <div className="mb-12">
           <h1 className="text-4xl font-bold font-syne mb-2">New Entry</h1>
           <p className="text-gray-500 font-mono text-sm tracking-widest">ADD TO CHRONICLES</p>
        </div>
        <PostForm />
      </div>
    </div>
  )
}
