import { prisma } from '@/lib/prisma'
import ChroniclesList from '@/components/ChroniclesList'

export const metadata = {
  title: 'Chronicles | Umbrella Digital',
  description: 'Alchemy logs and digital insights from the void.',
}

export default async function ChroniclesPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <main className="min-h-screen text-white selection:bg-umbrella-main selection:text-white">
      <ChroniclesList posts={posts} />
    </main>
  )
}
