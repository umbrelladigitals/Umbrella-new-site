'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, ArrowRight, Loader2, User } from 'lucide-react'
import { motion } from 'framer-motion'
import Notification, { NotificationType } from '@/components/ui/Notification'
import Select from '@/components/ui/Select'

export default function NewProposalPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'input' | 'generating' | 'preview'>('input')
  const [customers, setCustomers] = useState<any[]>([])
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('')
  
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    projectType: 'UI/UX Design',
    projectDetails: '',
    language: 'tr'
  })

  useEffect(() => {
    fetch('/api/admin/customers')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCustomers(data)
        } else {
          setCustomers([])
        }
      })
      .catch(err => {
        console.error('Failed to fetch customers', err)
        setCustomers([])
      })
  }, [])

  const handleCustomerSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const customerId = e.target.value
    setSelectedCustomerId(customerId)
    if (customerId) {
        const customer = customers.find(c => c.id === customerId)
        if (customer) {
            setFormData(prev => ({
                ...prev,
                clientName: customer.name,
                clientEmail: customer.email
            }))
        }
    }
  }

  const [generatedContent, setGeneratedContent] = useState<any>(null)

  const [notification, setNotification] = useState<{ message: string, type: NotificationType, isVisible: boolean }>({
    message: '',
    type: 'info',
    isVisible: false
  })

  const showNotification = (message: string, type: NotificationType = 'info') => {
    setNotification({ message, type, isVisible: true })
  }

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStep('generating')

    try {
      const res = await fetch('/api/admin/proposals/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!res.ok) throw new Error('Generation failed')
      
      const data = await res.json()
      setGeneratedContent(data)
      setStep('preview')
    } catch (error) {
      console.error(error)
      showNotification('Failed to generate proposal', 'error')
      setStep('input')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: formData.clientName,
          clientEmail: formData.clientEmail,
          projectTitle: formData.projectType,
          content: generatedContent,
          status: 'PUBLISHED',
          customerId: selectedCustomerId || undefined
        })
      })

      if (!res.ok) throw new Error('Failed to save')
      
      const savedProposal = await res.json()
      showNotification('Proposal created successfully!', 'success')
      router.push('/admin/proposals')
    } catch (error) {
      showNotification('Failed to save proposal', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Notification 
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
      />

      <div className="mb-8">
        <h1 className="text-4xl font-display font-bold text-white mb-2">
            {step === 'input' ? 'New Proposal' : step === 'generating' ? 'Alchemy in Progress...' : 'Review Proposal'}
        </h1>
        <p className="text-gray-400">
            {step === 'input' ? 'Enter project details to generate a magical proposal.' : step === 'generating' ? 'Our AI is crafting the perfect vision.' : 'Review and publish your proposal.'}
        </p>
      </div>

      {step === 'input' && (
        <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleGenerate} 
            className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 space-y-6"
        >
            {/* Customer Selection */}
            <div className="bg-black/20 p-4 rounded-xl border border-white/5 mb-6">
                <Select
                    label="Select Existing Customer (Optional)"
                    icon={<User size={14} />}
                    value={selectedCustomerId}
                    onChange={(e) => handleCustomerSelect(e as any)}
                    options={[
                        { value: "", label: "-- Create New / Manual Input --" },
                        ...customers.map(c => ({
                            value: c.id,
                            label: `${c.name} (${c.company || 'No Company'})`
                        }))
                    ]}
                    className="bg-white/5 border-white/10"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">Client Name</label>
                    <input 
                        required
                        value={formData.clientName}
                        onChange={e => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                        className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-umbrella-main/50 outline-none transition-colors"
                        placeholder="Acme Corp"
                    />
                </div>
                <div>
                    <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">Client Email (Optional)</label>
                    <input 
                        type="email"
                        value={formData.clientEmail}
                        onChange={e => setFormData(prev => ({ ...prev, clientEmail: e.target.value }))}
                        className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-umbrella-main/50 outline-none transition-colors"
                        placeholder="contact@acme.com"
                    />
                </div>
            </div>

            <div>
                <Select
                    label="Project Type"
                    value={formData.projectType}
                    onChange={e => setFormData(prev => ({ ...prev, projectType: e.target.value }))}
                    options={[
                        { value: "UI/UX Design", label: "UI/UX Design" },
                        { value: "Web Development", label: "Web Development" },
                        { value: "Mobile App", label: "Mobile App" },
                        { value: "Branding", label: "Branding" },
                        { value: "Full Digital Transformation", label: "Full Digital Transformation" }
                    ]}
                    className="bg-black/20 border-white/10"
                />
            </div>

            <div>
                <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">Project Details & Requirements</label>
                <textarea 
                    required
                    rows={6}
                    value={formData.projectDetails}
                    onChange={e => setFormData(prev => ({ ...prev, projectDetails: e.target.value }))}
                    className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-umbrella-main/50 outline-none transition-colors"
                    placeholder="Describe the project goals, target audience, specific features needed, and any other relevant information..."
                />
            </div>

            <div>
                <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">Language</label>
                <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="lang" value="tr" checked={formData.language === 'tr'} onChange={() => setFormData(prev => ({ ...prev, language: 'tr' }))} />
                        <span className="text-white">Turkish</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="lang" value="en" checked={formData.language === 'en'} onChange={() => setFormData(prev => ({ ...prev, language: 'en' }))} />
                        <span className="text-white">English</span>
                    </label>
                </div>
            </div>

            <div className="pt-4 flex justify-end">
                <button 
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-full font-bold hover:scale-105 transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-purple-900/20"
                >
                    <Sparkles size={20} />
                    <span>Generate Proposal</span>
                </button>
            </div>
        </motion.form>
      )}

      {step === 'generating' && (
        <div className="flex flex-col items-center justify-center py-20 space-y-8">
            <div className="relative w-32 h-32">
                <div className="absolute inset-0 border-4 border-white/10 rounded-full animate-[spin_10s_linear_infinite]"></div>
                <div className="absolute inset-2 border-4 border-t-umbrella-main border-r-transparent border-b-transparent border-l-transparent rounded-full animate-[spin_1s_linear_infinite]"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="text-umbrella-main animate-pulse" size={48} />
                </div>
            </div>
            <p className="text-xl font-mono text-white animate-pulse">Consulting the digital oracle...</p>
        </div>
      )}

      {step === 'preview' && generatedContent && (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
        >
            <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 space-y-8">
                <div>
                    <h3 className="text-xs font-mono text-gray-400 uppercase mb-2">The Vision</h3>
                    <p className="text-lg text-white leading-relaxed">{generatedContent.vision}</p>
                </div>

                <div>
                    <h3 className="text-xs font-mono text-gray-400 uppercase mb-4">Scope of Work</h3>
                    <div className="space-y-4">
                        {generatedContent.scope.map((item: any, i: number) => (
                            <div key={i} className="bg-black/20 p-6 rounded-xl border border-white/5">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-white">{item.title}</h4>
                                </div>
                                <p className="text-gray-400 text-sm">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {generatedContent.pricing && (
                    <div>
                        <h3 className="text-xs font-mono text-gray-400 uppercase mb-4">Pricing Breakdown</h3>
                        <div className="space-y-4">
                            {generatedContent.pricing.map((item: any, i: number) => (
                                <div key={i} className="flex justify-between items-center bg-black/20 p-4 rounded-xl border border-white/5">
                                    <span className="font-bold text-white">{item.item}</span>
                                    <span className="font-mono text-umbrella-main">{item.price} {generatedContent.currency}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div>
                    <h3 className="text-xs font-mono text-gray-400 uppercase mb-4">Timeline</h3>
                    <div className="space-y-4">
                        {generatedContent.timeline.map((item: any, i: number) => (
                            <div key={i} className="flex gap-4 items-center bg-black/20 p-4 rounded-xl border border-white/5">
                                <div className="w-24 font-mono text-sm text-gray-400">{item.duration}</div>
                                <div className="w-px h-8 bg-white/10"></div>
                                <div>
                                    <h4 className="font-bold text-white text-sm">{item.phase}</h4>
                                    <p className="text-gray-500 text-xs">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-8 border-t border-white/10 flex justify-between items-center">
                    <div>
                        <p className="text-gray-400 text-sm">Total Investment</p>
                        <p className="text-3xl font-bold text-white font-display">{generatedContent.totalPrice} {generatedContent.currency}</p>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-4">
                <button 
                    onClick={() => setStep('input')}
                    className="px-8 py-4 rounded-full font-bold text-gray-400 hover:text-white bg-black/50 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all"
                >
                    Back to Edit
                </button>
                <button 
                    onClick={handleSave}
                    disabled={loading}
                    className="bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-umbrella-main hover:text-white transition-all flex items-center gap-2 shadow-lg shadow-white/10"
                >
                    {loading ? <Loader2 className="animate-spin" /> : <ArrowRight />}
                    <span>Publish Proposal</span>
                </button>
            </div>
        </motion.div>
      )}
    </div>
  )
}
