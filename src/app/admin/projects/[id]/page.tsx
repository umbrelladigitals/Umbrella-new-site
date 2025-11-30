import ProjectForm from '@/components/admin/ProjectForm'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = await prisma.project.findUnique({
    where: { id: parseInt(id) }
  })

  if (!project) notFound()

  return (
    <div className="min-h-screen text-white">
      <div>
        <h1 className="text-4xl font-bold mb-8 font-syne">Edit Project</h1>
        <ProjectForm project={project} />
      </div>
    </div>
  )
}
