import ServiceForm from '@/components/admin/ServiceForm'

export default function NewServicePage() {
  return (
    <div className="min-h-screen text-white">
      <div>
        <h1 className="text-4xl font-bold mb-8 font-syne">New Service</h1>
        <ServiceForm />
      </div>
    </div>
  )
}
