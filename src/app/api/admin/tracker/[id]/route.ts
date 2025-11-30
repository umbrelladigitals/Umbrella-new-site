import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const tracker = await prisma.projectTracker.findUnique({
      where: { id },
      include: {
        proposal: true
      }
    })
    
    if (!tracker) {
        return NextResponse.json({ error: 'Tracker not found' }, { status: 404 })
    }

    return NextResponse.json({
        ...tracker,
        phases: JSON.parse(tracker.phases),
        updates: JSON.parse(tracker.updates),
        files: tracker.files ? JSON.parse(tracker.files) : []
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tracker' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const data = await req.json()
    
    // Auto-complete if progress is 100
    if (data.progress === 100) {
      data.status = 'COMPLETED'
    }
    
    const tracker = await prisma.projectTracker.update({
      where: { id },
      data: {
        status: data.status,
        progress: data.progress,
        phases: JSON.stringify(data.phases),
        updates: JSON.stringify(data.updates),
        files: JSON.stringify(data.files),
        vaultPassword: data.vaultPassword,
        language: data.language
      }
    })

    return NextResponse.json(tracker)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update tracker' }, { status: 500 })
  }
}
