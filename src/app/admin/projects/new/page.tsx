import ProjectForm from '@/components/admin/ProjectForm'

export default function NewProjectPage() {
  return (
    <div className="min-h-screen text-white">
      <div>
        <h1 className="text-4xl font-bold mb-8 font-syne">New Project</h1>
        <ProjectForm />
      </div>
    </div>
  )
}
