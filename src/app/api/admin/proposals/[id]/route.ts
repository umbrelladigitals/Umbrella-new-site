import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendProposalAcceptedEmail, sendClientTrackerEmail } from '@/lib/email'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const proposal = await prisma.proposal.findUnique({
      where: { id }
    })
    
    if (!proposal) {
        return NextResponse.json({ error: 'Proposal not found' }, { status: 404 })
    }

    return NextResponse.json({
        ...proposal,
        content: JSON.parse(proposal.content)
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch proposal' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const data = await req.json()
    
    const proposal = await prisma.proposal.update({
      where: { id },
      data: {
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        projectTitle: data.projectTitle,
        content: JSON.stringify(data.content),
        status: data.status,
        slug: data.slug
      }
    })

    // --- Tracker Sync Logic ---
    if (data.status === 'ACCEPTED') {
        const existingTracker = await prisma.projectTracker.findUnique({
            where: { proposalId: id }
        })

        if (!existingTracker) {
            // Initialize Tracker from Proposal Content
            const content = data.content
            const phases = content.timeline ? content.timeline.map((t: any) => ({
                phase: t.phase,
                description: t.description,
                duration: t.duration,
                status: 'PENDING', // PENDING, IN_PROGRESS, COMPLETED
            })) : []

            await prisma.projectTracker.create({
                data: {
                    proposalId: id,
                    slug: proposal.slug,
                    phases: JSON.stringify(phases),
                    status: 'ACTIVE',
                    progress: 0
                }
            })

            // Send notification email
            await sendProposalAcceptedEmail(proposal)
            
            // Send notification email to Client
            await sendClientTrackerEmail(proposal, proposal.slug)
        }
    } else {
        // If status is changed from ACCEPTED to anything else (e.g. REJECTED, DRAFT), remove the tracker
        await prisma.projectTracker.deleteMany({
            where: { proposalId: id }
        })
    }
    // --------------------------

    return NextResponse.json(proposal)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update proposal' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
      const { id } = await params
      await prisma.proposal.delete({
        where: { id }
      })
      return NextResponse.json({ success: true })
    } catch (error) {
      return NextResponse.json({ error: 'Failed to delete proposal' }, { status: 500 })
    }
  }
