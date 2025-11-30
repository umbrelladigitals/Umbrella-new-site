import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/utils';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const post = await prisma.post.findUnique({
      where: { id: parseInt(id) },
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    
    // If title changed and no slug provided, regenerate slug? 
    // Usually we keep slug stable unless explicitly changed, but let's handle slug updates if provided.
    
    const dataToUpdate: any = {
      image: body.image,
      titleEn: body.titleEn,
      titleTr: body.titleTr,
      summaryEn: body.summaryEn,
      summaryTr: body.summaryTr,
      contentEn: body.contentEn,
      contentTr: body.contentTr,
      tagsEn: body.tagsEn,
      tagsTr: body.tagsTr,
      published: body.published,
      featured: body.featured,
      author: body.author,
      readTime: body.readTime,
    };

    if (body.slug) {
      dataToUpdate.slug = body.slug;
    }

    const post = await prisma.post.update({
      where: { id: parseInt(id) },
      data: dataToUpdate,
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.post.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
