'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Search, FileText, Eye, Trash2, ExternalLink, Sparkles, Edit2 } from 'lucide-react'
import { motion } from 'framer-motion'
import Notification, { NotificationType } from '@/components/ui/Notification'
import Select from '@/components/ui/Select'

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [notification, setNotification] = useState<{ message: string, type: NotificationType, isVisible: boolean }>({
    message: '',
    type: 'info',
    isVisible: false
  })

  const showNotification = (message: string, type: NotificationType = 'info') => {
    setNotification({ message, type, isVisible: true })
  }

  useEffect(() => {
    fetchProposals()
  }, [])

  const fetchProposals = async () => {
    try {
      const res = await fetch('/api/admin/proposals')
      if (!res.ok) throw new Error('Failed to fetch')
      
      const data = await res.json()
      if (Array.isArray(data)) {
        setProposals(data)
      } else {
        setProposals([])
      }
    } catch (error) {
      console.error(error)
      showNotification('Failed to fetch proposals', 'error')
      setProposals([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this proposal?')) return

    try {
      const res = await fetch(`/api/admin/proposals/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      
      setProposals(prev => prev.filter(p => p.id !== id))
      showNotification('Proposal deleted successfully', 'success')
    } catch (error) {
      showNotification('Failed to delete proposal', 'error')
    }
  }

  const filteredProposals = Array.isArray(proposals) ? proposals.filter(p => 
    (statusFilter === 'ALL' || p.status === statusFilter) &&
    (p.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.projectTitle?.toLowerCase().includes(searchQuery.toLowerCase()))
  ) : []

  return (
    <div className="min-h-screen text-white">
      <Notification 
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
      />

      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold font-syne mb-2">Proposals</h1>
          <p className="text-gray-500 font-mono text-sm tracking-widest">MANAGE CLIENT VISIONS</p>
        </div>
        <Link 
          href="/admin/proposals/new"
          className="bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-umbrella-main hover:text-white transition-all duration-300 flex items-center gap-2"
        >
          <Plus size={18} />
          <span>New Proposal</span>
        </Link>
      </div>

      <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden min-h-[600px]">
        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input 
              type="text" 
              placeholder="Search proposals..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:border-umbrella-main/50 outline-none transition-colors"
            />
          </div>

          <div className="relative min-w-[200px]">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: 'ALL', label: 'All Status', className: 'bg-neutral-900' },
                { value: 'DRAFT', label: 'Draft', className: 'bg-neutral-900 text-yellow-500' },
                { value: 'PUBLISHED', label: 'Published', className: 'bg-neutral-900 text-green-500' },
                { value: 'ACCEPTED', label: 'Accepted', className: 'bg-neutral-900 text-blue-500' },
                { value: 'NEGOTIATION', label: 'Negotiation', className: 'bg-neutral-900 text-purple-500' },
                { value: 'REJECTED', label: 'Rejected', className: 'bg-neutral-900 text-red-500' }
              ]}
              className="uppercase tracking-wider h-full"
            />
          </div>
        </div>

        {loading ? (
            <div className="text-center py-12 text-gray-500 font-mono">LOADING VISIONS...</div>
        ) : (
            <table className="w-full text-left">
                <thead className="bg-white/5 text-gray-400 font-mono text-xs uppercase tracking-wider">
                <tr>
                    <th className="p-6">Status</th>
                    <th className="p-6">Client</th>
                    <th className="p-6">Project</th>
                    <th className="p-6">Date</th>
                    <th className="p-6 text-right">Actions</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                {filteredProposals.length === 0 ? (
                    <tr>
                        <td colSpan={5} className="p-12 text-center text-gray-500 font-mono">
                            NO PROPOSALS FOUND
                        </td>
                    </tr>
                ) : (
                    filteredProposals.map((proposal) => (
                    <tr key={proposal.id} className="hover:bg-white/5 transition-colors group">
                        <td className="p-6">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-mono uppercase border ${
                                proposal.status === 'PUBLISHED' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                proposal.status === 'ACCEPTED' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                proposal.status === 'REJECTED' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                proposal.status === 'NEGOTIATION' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' :
                                'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                            }`}>
                                {proposal.status}
                            </span>
                        </td>
                        <td className="p-6 font-bold font-syne text-lg">{proposal.clientName}</td>
                        <td className="p-6 font-mono text-sm text-gray-400">{proposal.projectTitle}</td>
                        <td className="p-6 font-mono text-sm text-gray-400">
                            {new Date(proposal.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-6 flex justify-end gap-3">
                            <Link 
                                href={`/proposal/${proposal.slug}`}
                                target="_blank"
                                className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                                title="View Public Link"
                            >
                                <ExternalLink size={18} />
                            </Link>
                            <Link 
                                href={`/admin/proposals/${proposal.id}`}
                                className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                                title="Edit"
                            >
                                <Edit2 size={18} />
                            </Link>
                            <button 
                                onClick={() => handleDelete(proposal.id)}
                                className="p-2 rounded-full hover:bg-red-500/20 text-gray-400 hover:text-red-500 transition-colors"
                                title="Delete"
                            >
                                <Trash2 size={18} />
                            </button>
                        </td>
                    </tr>
                    ))
                )}
                </tbody>
            </table>
        )}
      </div>
    </div>
  )
}
