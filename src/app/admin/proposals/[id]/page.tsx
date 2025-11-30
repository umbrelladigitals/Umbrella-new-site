'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { Save, ArrowLeft, Plus, Trash2, DollarSign, Clock, Layers, X, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'
import Notification, { NotificationType } from '@/components/ui/Notification'
import Select from '@/components/ui/Select'
import FileUpload from '@/components/admin/FileUpload'
import { formatPrice } from '@/lib/utils'

interface ProposalContent {
  vision: string
  scope: { title: string; description: string }[]
  pricing: { item: string; price: number }[]
  timeline: { phase: string; duration: string; description: string }[]
  totalPrice: number
  currency: string
  language?: 'en' | 'tr'
  images?: string[]
}

interface Proposal {
  id: string
  clientName: string
  projectTitle: string
  slug: string
  status: string
  content: ProposalContent
}

export default function EditProposalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [proposal, setProposal] = useState<Proposal | null>(null)
  const [notification, setNotification] = useState<{ message: string, type: NotificationType, isVisible: boolean }>({
    message: '',
    type: 'info',
    isVisible: false
  })

  useEffect(() => {
    fetchProposal()
  }, [id])

  const fetchProposal = async () => {
    try {
      const res = await fetch(`/api/admin/proposals/${id}`)
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setProposal(data)
    } catch (error) {
      console.error(error)
      setNotification({ message: 'Failed to load proposal', type: 'error', isVisible: true })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!proposal) return
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/proposals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(proposal)
      })
      
      if (!res.ok) throw new Error('Failed to update')
      
      setNotification({ message: 'Proposal updated successfully', type: 'success', isVisible: true })
    } catch (error) {
      setNotification({ message: 'Failed to update proposal', type: 'error', isVisible: true })
    } finally {
      setSaving(false)
    }
  }

  const updateContent = (field: keyof ProposalContent, value: any) => {
    if (!proposal) return
    setProposal({
      ...proposal,
      content: { ...proposal.content, [field]: value }
    })
  }

  const updateScopeItem = (index: number, field: string, value: any) => {
    if (!proposal) return
    const newScope = [...proposal.content.scope]
    newScope[index] = { ...newScope[index], [field]: value }
    updateContent('scope', newScope)
  }

  const addScopeItem = () => {
    if (!proposal) return
    const newScope = [...proposal.content.scope, { title: 'New Item', description: '' }]
    updateContent('scope', newScope)
  }

  const removeScopeItem = (index: number) => {
    if (!proposal) return
    const newScope = proposal.content.scope.filter((_, i) => i !== index)
    updateContent('scope', newScope)
  }

  const updatePricingItem = (index: number, field: string, value: any) => {
    if (!proposal) return
    const newPricing = [...(proposal.content.pricing || [])]
    newPricing[index] = { ...newPricing[index], [field]: value }
    updateContent('pricing', newPricing)
  }

  const addPricingItem = () => {
    if (!proposal) return
    const newPricing = [...(proposal.content.pricing || []), { item: 'New Service', price: 0 }]
    updateContent('pricing', newPricing)
  }

  const removePricingItem = (index: number) => {
    if (!proposal) return
    const newPricing = (proposal.content.pricing || []).filter((_, i) => i !== index)
    updateContent('pricing', newPricing)
  }

  const updateTimelineItem = (index: number, field: string, value: any) => {
    if (!proposal) return
    const newTimeline = [...proposal.content.timeline]
    newTimeline[index] = { ...newTimeline[index], [field]: value }
    updateContent('timeline', newTimeline)
  }

  const addTimelineItem = () => {
    if (!proposal) return
    const newTimeline = [...proposal.content.timeline, { phase: 'New Phase', duration: '1 week', description: '' }]
    updateContent('timeline', newTimeline)
  }

  const removeTimelineItem = (index: number) => {
    if (!proposal) return
    const newTimeline = proposal.content.timeline.filter((_, i) => i !== index)
    updateContent('timeline', newTimeline)
  }

  const addImage = () => {
    if (!proposal) return
    const newImages = [...(proposal.content.images || []), '']
    updateContent('images', newImages)
  }

  const updateImage = (index: number, value: string) => {
    if (!proposal) return
    const newImages = [...(proposal.content.images || [])]
    newImages[index] = value
    updateContent('images', newImages)
  }

  const removeImage = (index: number) => {
    if (!proposal) return
    const newImages = (proposal.content.images || []).filter((_, i) => i !== index)
    updateContent('images', newImages)
  }

  if (loading) return <div className="text-white p-8">Loading...</div>
  if (!proposal) return <div className="text-white p-8">Proposal not found</div>

  return (
    <div className="space-y-8 pb-20">
      <Notification 
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
      />

      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-display font-bold text-white">Edit Proposal</h1>
            <div className="relative group min-w-[140px]">
                <Select
                    variant="pill"
                    value={proposal.status}
                    onChange={(e) => setProposal({ ...proposal, status: e.target.value })}
                    options={[
                        { value: "DRAFT", label: "Draft", className: "bg-neutral-900 text-yellow-500" },
                        { value: "PUBLISHED", label: "Published", className: "bg-neutral-900 text-green-500" },
                        { value: "ACCEPTED", label: "Accepted", className: "bg-neutral-900 text-blue-500" },
                        { value: "NEGOTIATION", label: "Negotiation", className: "bg-neutral-900 text-purple-500" },
                        { value: "REJECTED", label: "Rejected", className: "bg-neutral-900 text-red-500" }
                    ]}
                    className={
                        proposal.status === 'PUBLISHED' ? 'bg-green-500/20 text-green-500' :
                        proposal.status === 'ACCEPTED' ? 'bg-blue-500/20 text-blue-500' :
                        proposal.status === 'REJECTED' ? 'bg-red-500/20 text-red-500' :
                        proposal.status === 'NEGOTIATION' ? 'bg-purple-500/20 text-purple-500' :
                        'bg-yellow-500/20 text-yellow-500'
                    }
                />
            </div>
        </div>
        <p className="text-gray-500 font-mono text-sm tracking-widest uppercase">MODIFY CLIENT VISION • {proposal.clientName}</p>
      </div>

      {/* Basic Info */}
      <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
            <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">Client Name</label>
            <input 
                type="text" 
                value={proposal.clientName}
                onChange={(e) => setProposal({ ...proposal, clientName: e.target.value })}
                className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-umbrella-main/50 outline-none transition-colors"
            />
            </div>
            <div>
            <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">Project Title</label>
            <input 
                type="text" 
                value={proposal.projectTitle}
                onChange={(e) => setProposal({ ...proposal, projectTitle: e.target.value })}
                className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-umbrella-main/50 outline-none transition-colors"
            />
            </div>
            <div>
                <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">Proposal Language</label>
                <Select 
                    value={proposal.content.language || 'en'}
                    onChange={(e) => updateContent('language', e.target.value)}
                    options={[
                        { value: "en", label: "English", className: "bg-neutral-900" },
                        { value: "tr", label: "Turkish", className: "bg-neutral-900" }
                    ]}
                    className="py-4"
                />
            </div>
        </div>

        {/* Vision */}
        <div>
            <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">Vision Statement</label>
            <textarea 
            value={proposal.content.vision}
            onChange={(e) => updateContent('vision', e.target.value)}
            rows={4}
            className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-umbrella-main/50 outline-none resize-none"
            />
        </div>

        {/* Visual References */}
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 font-display">
                <ImageIcon size={20} className="text-umbrella-main" />
                Visual References
            </h2>
            <button onClick={addImage} className="text-xs font-bold text-umbrella-main hover:text-white transition-colors flex items-center gap-1 uppercase tracking-wider">
                <Plus size={16} /> Add Image
            </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(proposal.content.images || []).map((url, i) => (
                <div key={i} className="bg-black/20 border border-white/10 rounded-xl p-4">
                    <FileUpload 
                        defaultValue={url}
                        onUpload={(newUrl) => {
                            if (newUrl) {
                                updateImage(i, newUrl)
                            } else {
                                removeImage(i)
                            }
                        }}
                        label={`Reference Image ${i + 1}`}
                    />
                </div>
            ))}
            </div>
        </div>

        {/* Scope */}
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 font-display">
                <Layers size={20} className="text-umbrella-main" />
                Scope of Work
            </h2>
            <button onClick={addScopeItem} className="text-xs font-bold text-umbrella-main hover:text-white transition-colors flex items-center gap-1 uppercase tracking-wider">
                <Plus size={16} /> Add Item
            </button>
            </div>
            
            <div className="space-y-4">
            {proposal.content.scope.map((item, i) => (
                <div key={i} className="bg-black/20 border border-white/10 rounded-xl p-6 space-y-4 relative group hover:border-umbrella-main/30 transition-colors">
                <button 
                    onClick={() => removeScopeItem(i)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                >
                    <Trash2 size={18} />
                </button>
                
                <div className="space-y-4 pr-8">
                    <div>
                        <label className="block text-xs font-mono text-gray-500 mb-1 uppercase">Item Title</label>
                        <input 
                            type="text" 
                            value={item.title}
                            onChange={(e) => updateScopeItem(i, 'title', e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-umbrella-main/50 outline-none font-bold"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-mono text-gray-500 mb-1 uppercase">Description</label>
                        <textarea 
                            value={item.description}
                            onChange={(e) => updateScopeItem(i, 'description', e.target.value)}
                            rows={2}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-gray-300 text-sm focus:border-umbrella-main/50 outline-none resize-none"
                        />
                    </div>
                </div>
                </div>
            ))}
            </div>
        </div>

        {/* Pricing Breakdown */}
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 font-display">
                <DollarSign size={20} className="text-umbrella-main" />
                Pricing Breakdown
            </h2>
            <button onClick={addPricingItem} className="text-xs font-bold text-umbrella-main hover:text-white transition-colors flex items-center gap-1 uppercase tracking-wider">
                <Plus size={16} /> Add Item
            </button>
            </div>
            
            <div className="space-y-4">
            {(proposal.content.pricing || []).map((item, i) => (
                <div key={i} className="bg-black/20 border border-white/10 rounded-xl p-6 relative group hover:border-umbrella-main/30 transition-colors flex items-center gap-4">
                <button 
                    onClick={() => removePricingItem(i)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                >
                    <Trash2 size={18} />
                </button>
                
                <div className="flex-1">
                    <label className="block text-xs font-mono text-gray-500 mb-1 uppercase">Service / Item</label>
                    <input 
                        type="text" 
                        value={item.item}
                        onChange={(e) => updatePricingItem(i, 'item', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-umbrella-main/50 outline-none font-bold"
                    />
                </div>
                <div className="w-48">
                    <label className="block text-xs font-mono text-gray-500 mb-1 uppercase">Price</label>
                    <div className="relative">
                        <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input 
                        type="text" 
                        value={item.price === 0 ? '' : formatPrice(item.price)}
                        onChange={(e) => {
                            const val = e.target.value.replace(/\./g, '');
                            if (!isNaN(Number(val))) {
                                updatePricingItem(i, 'price', Number(val));
                            }
                        }}
                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 p-3 text-white focus:border-umbrella-main/50 outline-none font-mono"
                        placeholder="0"
                        />
                    </div>
                </div>
                </div>
            ))}
            </div>
        </div>

        {/* Timeline */}
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 font-display">
                <Clock size={20} className="text-umbrella-main" />
                Timeline
            </h2>
            <button onClick={addTimelineItem} className="text-xs font-bold text-umbrella-main hover:text-white transition-colors flex items-center gap-1 uppercase tracking-wider">
                <Plus size={16} /> Add Phase
            </button>
            </div>
            
            <div className="space-y-4">
            {proposal.content.timeline.map((item, i) => (
                <div key={i} className="bg-black/20 border border-white/10 rounded-xl p-6 space-y-4 relative group hover:border-umbrella-main/30 transition-colors">
                <button 
                    onClick={() => removeTimelineItem(i)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                >
                    <Trash2 size={18} />
                </button>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pr-8">
                    <div className="md:col-span-2 space-y-4">
                    <div>
                        <label className="block text-xs font-mono text-gray-500 mb-1 uppercase">Phase Name</label>
                        <input 
                            type="text" 
                            value={item.phase}
                            onChange={(e) => updateTimelineItem(i, 'phase', e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-umbrella-main/50 outline-none font-bold"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-mono text-gray-500 mb-1 uppercase">Description</label>
                        <textarea 
                            value={item.description}
                            onChange={(e) => updateTimelineItem(i, 'description', e.target.value)}
                            rows={2}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-gray-300 text-sm focus:border-umbrella-main/50 outline-none resize-none"
                        />
                    </div>
                    </div>
                    <div>
                    <label className="block text-xs font-mono text-gray-500 mb-1 uppercase">Duration</label>
                    <input 
                        type="text" 
                        value={item.duration}
                        onChange={(e) => updateTimelineItem(i, 'duration', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-umbrella-main/50 outline-none font-mono"
                    />
                    </div>
                </div>
                </div>
            ))}
            </div>
        </div>

        {/* Total Price */}
        <div className="bg-black/40 border border-white/10 rounded-xl p-8 flex items-center justify-between">
            <div>
            <h3 className="text-lg font-bold text-white font-display">Total Investment</h3>
            <p className="text-gray-400 text-xs font-mono uppercase">Calculated total for the project</p>
            </div>
            <div className="flex items-center gap-4">
            <input 
                type="text" 
                value={proposal.content.totalPrice === 0 ? '' : formatPrice(proposal.content.totalPrice)}
                onChange={(e) => {
                    const val = e.target.value.replace(/\./g, '');
                    if (!isNaN(Number(val))) {
                        updateContent('totalPrice', Number(val));
                    }
                }}
                className="bg-white/5 border border-white/10 rounded-lg p-4 text-3xl font-bold text-white focus:border-umbrella-main/50 outline-none w-48 text-right font-display"
                placeholder="0"
            />
            <div className="w-32">
                <Select 
                    value={proposal.content.currency}
                    onChange={(e) => updateContent('currency', e.target.value)}
                    options={[
                        { value: "USD", label: "USD", className: "bg-neutral-900" },
                        { value: "TRY", label: "TRY", className: "bg-neutral-900" },
                        { value: "EUR", label: "EUR", className: "bg-neutral-900" }
                    ]}
                    className="bg-white/5 rounded-lg py-4 text-xl font-bold"
                />
            </div>
            </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex justify-end gap-4 sticky bottom-8 z-50">
        <button 
          type="button" 
          onClick={() => router.back()}
          className="px-8 py-4 rounded-full font-bold text-gray-400 hover:text-white bg-black/50 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2"
        >
          <X size={18} />
          <span>Cancel</span>
        </button>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-umbrella-main hover:text-white transition-all duration-300 disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-white/10"
        >
          <Save size={18} />
          <span>{saving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>

    </div>
  )
}
