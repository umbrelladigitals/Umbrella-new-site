import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const tracker = await prisma.projectTracker.findUnique({
      where: { slug },
      include: {
        proposal: {
            select: {
                clientName: true,
                projectTitle: true,
                content: true
            }
        }
      }
    })
    
    if (!tracker) {
        return NextResponse.json({ error: 'Project Tracker not found' }, { status: 404 })
    }

    const isVaultProtected = !!tracker.vaultPassword;

    return NextResponse.json({
        ...tracker,
        phases: JSON.parse(tracker.phases),
        updates: JSON.parse(tracker.updates),
        files: isVaultProtected ? [] : JSON.parse(tracker.files),
        isVaultProtected,
        proposal: {
            ...tracker.proposal,
            content: JSON.parse(tracker.proposal.content)
        }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tracker' }, { status: 500 })
  }
}
