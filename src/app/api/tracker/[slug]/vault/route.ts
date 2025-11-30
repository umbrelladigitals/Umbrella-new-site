import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const { password } = await req.json()

    const tracker = await prisma.projectTracker.findUnique({
      where: { slug },
    })
    
    if (!tracker) {
        return NextResponse.json({ error: 'Project Tracker not found' }, { status: 404 })
    }

    if (tracker.vaultPassword !== password) {
        return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    return NextResponse.json({
        files: JSON.parse(tracker.files)
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to verify password' }, { status: 500 })
  }
}
