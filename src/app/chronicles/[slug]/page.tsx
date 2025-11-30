
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import PostDetail from '@/components/PostDetail'
import { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await prisma.post.findUnique({
    where: { slug }
  })

  if (!post) {
    return {
      title: 'Not Found | Umbrella Digital',
    }
  }

  return {
    title: `${post.titleEn} | Chronicles`,
    description: post.summaryEn,
    openGraph: {
      images: [post.image],
    },
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = await prisma.post.findUnique({
    where: { slug }
  })

  if (!post || !post.published) {
    notFound()
  }

  return <PostDetail post={post} />
}
