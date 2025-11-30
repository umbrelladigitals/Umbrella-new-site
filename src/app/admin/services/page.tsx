import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'
import { Plus, Edit2, Trash2 } from 'lucide-react'

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    orderBy: { createdAt: 'desc' }
  })

  async function deleteService(formData: FormData) {
    'use server'
    const id = formData.get('id')
    if (typeof id === 'string') {
      await prisma.service.delete({ where: { id } })
      revalidatePath('/admin/services')
    }
  }

  return (
    <div className="min-h-screen text-white">
      <div>
        <div className="flex justify-between items-center mb-12">
          <div>
             <h1 className="text-4xl font-bold font-syne mb-2">Services</h1>
             <p className="text-gray-500 font-mono text-sm tracking-widest">CORE CAPABILITIES MATRIX</p>
          </div>
          <Link 
            href="/admin/services/new" 
            className="bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-umbrella-main hover:text-white transition-all duration-300 flex items-center gap-2"
          >
            <Plus size={18} />
            <span>New Service</span>
          </Link>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-gray-400 font-mono text-xs uppercase tracking-wider">
              <tr>
                <th className="p-6">ID</th>
                <th className="p-6">Title (EN)</th>
                <th className="p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {services.map(service => (
                <tr key={service.id} className="hover:bg-white/5 transition-colors group">
                  <td className="p-6 font-mono text-gray-500">{service.id}</td>
                  <td className="p-6 font-bold font-syne text-lg">{service.titleEn}</td>
                  <td className="p-6 flex justify-end gap-3">
                    <Link 
                      href={`/admin/services/${service.id}`}
                      className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                      <Edit2 size={18} />
                    </Link>
                    <form action={deleteService}>
                      <input type="hidden" name="id" value={service.id} />
                      <button type="submit" className="p-2 rounded-full hover:bg-red-500/20 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {services.length === 0 && (
            <div className="p-12 text-center text-gray-500 font-mono">
              NO SERVICES DEPLOYED
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
