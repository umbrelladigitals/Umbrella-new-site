'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, X, Video, Globe, Layers, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import FileUpload from './FileUpload'
import TagInput from './form-inputs/TagInput'
import Notification, { NotificationType } from '../ui/Notification'

export default function ServiceForm({ service }: { service?: any }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [translating, setTranslating] = useState(false)
  const [activeTab, setActiveTab] = useState<'general' | 'en' | 'tr'>('general')
  
  const [notification, setNotification] = useState<{ message: string, type: NotificationType, isVisible: boolean }>({
    message: '',
    type: 'info',
    isVisible: false
  })

  const showNotification = (message: string, type: NotificationType = 'info') => {
    setNotification({ message, type, isVisible: true })
  }

  // Form State
  const [formData, setFormData] = useState({
    id: service?.id || '',
    video: service?.video || '',
    
    titleEn: service?.titleEn || '',
    shortDescEn: service?.shortDescEn || '',
    descEn: service?.descEn || '',
    challengeEn: service?.challengeEn || '',
    solutionEn: service?.solutionEn || '',
    deliverablesEn: service?.deliverablesEn || '[]',
    tagsEn: service?.tagsEn || '[]',

    titleTr: service?.titleTr || '',
    shortDescTr: service?.shortDescTr || '',
    descTr: service?.descTr || '',
    challengeTr: service?.challengeTr || '',
    solutionTr: service?.solutionTr || '',
    deliverablesTr: service?.deliverablesTr || '[]',
    tagsTr: service?.tagsTr || '[]',
  })

  const handleChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const handleTranslate = async () => {
    if (!formData.titleTr) {
        showNotification("Please fill in Turkish content first.", "warning")
        return
    }
    
    setTranslating(true)
    try {
        const res = await fetch('/api/admin/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'service',
                titleTr: formData.titleTr,
                shortDescTr: formData.shortDescTr,
                descTr: formData.descTr,
                challengeTr: formData.challengeTr,
                solutionTr: formData.solutionTr,
                tagsTr: formData.tagsTr,
                deliverablesTr: formData.deliverablesTr
            })
        })
        
        if (!res.ok) throw new Error("Translation failed")
        
        const translated = await res.json()
        
        setFormData(prev => ({
            ...prev,
            titleEn: translated.title,
            shortDescEn: translated.shortDesc,
            descEn: translated.desc,
            challengeEn: translated.challenge,
            solutionEn: translated.solution,
            tagsEn: JSON.stringify(translated.tags),
            deliverablesEn: JSON.stringify(translated.deliverables)
        }))
        
        showNotification("Translation completed successfully", "success")
        setActiveTab('en')
    } catch (error) {
        console.error(error)
        showNotification("Translation failed. Please check API key.", "error")
    } finally {
        setTranslating(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const data = new FormData()
    
    Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value)
    })

    try {
      const res = await fetch('/api/admin/services', {
        method: service ? 'PUT' : 'POST',
        body: data,
      })

      if (!res.ok) throw new Error('Failed to save')
      
      showNotification(service ? 'Service updated successfully' : 'Service created successfully', 'success')
      router.push('/admin/services')
      router.refresh()
    } catch (error) {
      console.error(error)
      showNotification('Error saving service', 'error')
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'general', label: 'General Info', icon: Layers },
    { id: 'en', label: 'English Content', icon: Globe },
    { id: 'tr', label: 'Turkish Content', icon: Globe },
  ]

  return (
    <>
      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
      />
      <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
      
      {/* Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10 w-fit">
            {tabs.map(tab => (
            <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === tab.id 
                    ? 'bg-umbrella-main text-white shadow-lg' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
                <tab.icon size={16} />
                {tab.label}
            </button>
            ))}
        </div>

        {activeTab === 'tr' && (
            <button
                type="button"
                onClick={handleTranslate}
                disabled={translating}
                className="bg-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-500 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-900/20"
            >
                <Sparkles size={18} className={translating ? "animate-spin" : ""} />
                {translating ? "Translating..." : "Auto-Translate to English"}
            </button>
        )}
      </div>

      <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 min-h-[600px]">
        <AnimatePresence mode="wait">
          {activeTab === 'general' && (
            <motion.div 
              key="general"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">ID (Slug)</label>
                        <input 
                            value={formData.id}
                            onChange={(e) => handleChange('id', e.target.value)}
                            required 
                            readOnly={!!service}
                            className={`w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-umbrella-main/50 outline-none transition-colors ${service ? 'opacity-50 cursor-not-allowed' : ''}`}
                            placeholder="web-design"
                        />
                    </div>
                </div>
                
                <div>
                    <FileUpload 
                        label="Service Video"
                        defaultValue={formData.video}
                        onUpload={(url) => handleChange('video', url)}
                        onError={(msg) => showNotification(msg, 'error')}
                        accept="video/*"
                        className="h-full"
                    />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'en' && (
            <motion.div 
              key="en"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">Title</label>
                <input value={formData.titleEn} onChange={(e) => handleChange('titleEn', e.target.value)} required className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-umbrella-main/50 outline-none transition-colors" />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">Short Description</label>
                <textarea value={formData.shortDescEn} onChange={(e) => handleChange('shortDescEn', e.target.value)} required rows={2} className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-umbrella-main/50 outline-none transition-colors" />
              </div>

              <TagInput name="tagsEn" defaultValue={formData.tagsEn} label="Tags" onChange={(v) => handleChange('tagsEn', v)} />
              <TagInput name="deliverablesEn" defaultValue={formData.deliverablesEn} label="Deliverables" onChange={(v) => handleChange('deliverablesEn', v)} />

              <div>
                <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">Description</label>
                <textarea value={formData.descEn} onChange={(e) => handleChange('descEn', e.target.value)} required rows={4} className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-umbrella-main/50 outline-none transition-colors" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">Challenge</label>
                    <textarea value={formData.challengeEn} onChange={(e) => handleChange('challengeEn', e.target.value)} required rows={4} className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-umbrella-main/50 outline-none transition-colors" />
                </div>
                <div>
                    <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">Solution</label>
                    <textarea value={formData.solutionEn} onChange={(e) => handleChange('solutionEn', e.target.value)} required rows={4} className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-umbrella-main/50 outline-none transition-colors" />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'tr' && (
            <motion.div 
              key="tr"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
               <div>
                <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">Title (TR)</label>
                <input value={formData.titleTr} onChange={(e) => handleChange('titleTr', e.target.value)} required className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-umbrella-main/50 outline-none transition-colors" />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">Short Description (TR)</label>
                <textarea value={formData.shortDescTr} onChange={(e) => handleChange('shortDescTr', e.target.value)} required rows={2} className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-umbrella-main/50 outline-none transition-colors" />
              </div>

              <TagInput name="tagsTr" defaultValue={formData.tagsTr} label="Tags (TR)" onChange={(v) => handleChange('tagsTr', v)} />
              <TagInput name="deliverablesTr" defaultValue={formData.deliverablesTr} label="Deliverables (TR)" onChange={(v) => handleChange('deliverablesTr', v)} />

              <div>
                <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">Description (TR)</label>
                <textarea value={formData.descTr} onChange={(e) => handleChange('descTr', e.target.value)} required rows={4} className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-umbrella-main/50 outline-none transition-colors" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">Challenge (TR)</label>
                    <textarea value={formData.challengeTr} onChange={(e) => handleChange('challengeTr', e.target.value)} required rows={4} className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-umbrella-main/50 outline-none transition-colors" />
                </div>
                <div>
                    <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">Solution (TR)</label>
                    <textarea value={formData.solutionTr} onChange={(e) => handleChange('solutionTr', e.target.value)} required rows={4} className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-umbrella-main/50 outline-none transition-colors" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex justify-end gap-4 sticky bottom-8">
        <button 
          type="button" 
          onClick={() => router.back()}
          className="px-8 py-4 rounded-full font-bold text-gray-400 hover:text-white bg-black/50 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2"
        >
          <X size={18} />
          <span>Cancel</span>
        </button>
        <button 
          type="submit" 
          disabled={loading}
          className="bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-umbrella-main hover:text-white transition-all duration-300 disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-white/10"
        >
          <Save size={18} />
          <span>{loading ? 'Saving...' : 'Save Service'}</span>
        </button>
        </div>
      </form>
    </>
  )
}