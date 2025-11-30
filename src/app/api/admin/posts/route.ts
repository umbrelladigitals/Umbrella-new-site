import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/utils';

// Force re-compile
export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Generate slug from English title if not provided
    let slug = body.slug;
    if (!slug && body.titleEn) {
      slug = slugify(body.titleEn);
    }

    // Ensure slug is unique
    let uniqueSlug = slug;
    let counter = 1;
    while (await prisma.post.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    const post = await prisma.post.create({
      data: {
        slug: uniqueSlug,
        image: body.image,
        titleEn: body.titleEn,
        titleTr: body.titleTr,
        summaryEn: body.summaryEn,
        summaryTr: body.summaryTr,
        contentEn: body.contentEn,
        contentTr: body.contentTr,
        tagsEn: body.tagsEn || '[]',
        tagsTr: body.tagsTr || '[]',
        published: body.published || false,
        featured: body.featured || false,
        author: body.author || 'Umbrella Digital',
        readTime: body.readTime || 5,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
