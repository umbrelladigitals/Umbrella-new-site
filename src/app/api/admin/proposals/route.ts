import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const proposals = await prisma.proposal.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(proposals)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch proposals' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    
    // Generate a unique slug if not provided
    let slug = data.slug
    if (!slug) {
        slug = `${data.clientName}-${data.projectTitle}`.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        // Add random suffix to ensure uniqueness
        slug += `-${Math.random().toString(36).substring(2, 7)}`
    }

    const proposal = await prisma.proposal.create({
      data: {
        slug,
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        projectTitle: data.projectTitle,
        content: JSON.stringify(data.content),
        status: data.status || 'DRAFT',
        customerId: data.customerId
      }
    })

    return NextResponse.json(proposal)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to create proposal' }, { status: 500 })
  }
}
