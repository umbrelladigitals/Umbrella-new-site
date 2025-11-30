import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, subject, summary, message } = body;

    // Map 'message' from Contact form to 'summary' in DB if summary is missing
    const content = summary || message;

    const newMessage = await prisma.message.create({
      data: {
        name,
        phone,
        email,
        subject,
        summary: content,
      },
    });

    return NextResponse.json(newMessage);
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json({ error: 'Failed to create message' }, { status: 500 });
  }
}

export async function GET() {
    try {
        const messages = await prisma.message.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
        return NextResponse.json(messages);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
    }
}
