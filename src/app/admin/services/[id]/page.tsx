import ServiceForm from '@/components/admin/ServiceForm'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const service = await prisma.service.findUnique({
    where: { id }
  })

  if (!service) notFound()

  return (
    <div className="min-h-screen text-white">
      <div>
        <h1 className="text-4xl font-bold mb-8 font-syne">Edit Service</h1>
        <ServiceForm service={service} />
      </div>
    </div>
  )
}
