import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ProposalView from '@/components/proposal/ProposalView'

export default async function ProposalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const proposal = await prisma.proposal.findUnique({
    where: { slug }
  })

  if (!proposal) {
    notFound()
  }

  // Parse content JSON
  const parsedProposal = {
    ...proposal,
    content: JSON.parse(proposal.content)
  }

  return <ProposalView proposal={parsedProposal} />
}
