import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        slug: true,
        titleEn: true,
        titleTr: true,
        summaryEn: true,
        summaryTr: true,
        image: true,
        tagsEn: true,
        tagsTr: true,
        createdAt: true,
        readTime: true,
        author: true,
      }
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}
