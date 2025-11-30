import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const trackers = await prisma.projectTracker.findMany({
      include: {
        proposal: {
            select: {
                clientName: true,
                projectTitle: true,
                content: true
            }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })
    return NextResponse.json(trackers)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch trackers' }, { status: 500 })
  }
}
