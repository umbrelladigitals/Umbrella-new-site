'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, X, Image as ImageIcon, Globe, Type, Layers, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import TagInput from './form-inputs/TagInput'
import GalleryInput from './form-inputs/GalleryInput'
import ResultsInput from './form-inputs/ResultsInput'
import FileUpload from './FileUpload'
import Notification, { NotificationType } from '../ui/Notification'

export default function ProjectForm({ project }: { project?: any }) {
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
    slug: project?.slug || '',
    image: project?.image || '',
    year: project?.year || '',
    client: project?.client || '',
    gallery: project?.gallery || '[]',
    
    titleEn: project?.titleEn || '',
    categoryEn: project?.categoryEn || '',
    roleEn: project?.roleEn || '',
    tagsEn: project?.tagsEn || '[]',
    descEn: project?.descEn || '',
    challengeEn: project?.challengeEn || '',
    solutionEn: project?.solutionEn || '',
    resultsEn: project?.resultsEn || '[]',

    titleTr: project?.titleTr || '',
    categoryTr: project?.categoryTr || '',
    roleTr: project?.roleTr || '',
    tagsTr: project?.tagsTr || '[]',
    descTr: project?.descTr || '',
    challengeTr: project?.challengeTr || '',
    solutionTr: project?.solutionTr || '',
    resultsTr: project?.resultsTr || '[]',
  })

  const handleChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const handleTranslate = async () => {
    if (!formData.titleTr) {
        showNotification("Please fill in Turkish content first.", 'error')
        return
    }
    
    setTranslating(true)
    try {
        const res = await fetch('/api/admin/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                titleTr: formData.titleTr,
                categoryTr: formData.categoryTr,
                roleTr: formData.roleTr,
                descTr: formData.descTr,
                challengeTr: formData.challengeTr,
                solutionTr: formData.solutionTr,
                tagsTr: formData.tagsTr,
                resultsTr: formData.resultsTr
            })
        })
        
        if (!res.ok) throw new Error("Translation failed")
        
        const translated = await res.json()
        
        setFormData(prev => ({
            ...prev,
            titleEn: translated.title,
            categoryEn: translated.category,
            roleEn: translated.role,
            descEn: translated.desc,
            challengeEn: translated.challenge,
            solutionEn: translated.solution,
            tagsEn: JSON.stringify(translated.tags),
            resultsEn: JSON.stringify(translated.results)
        }))
        
        setActiveTab('en')
        showNotification("Content translated successfully!", 'success')
    } catch (error) {
        console.error(error)
        showNotification("Translation failed. Please check API key.", 'error')
    } finally {
        setTranslating(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const data = new FormData()
    
    if (project) data.append('id', project.id)
    
    Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value)
    })

    try {
      const res = await fetch('/api/admin/projects', {
        method: project ? 'PUT' : 'POST',
        body: data,
      })

      if (!res.ok) throw new Error('Failed to save')
      
      showNotification('Project saved successfully!', 'success')
      
      // Wait a bit before redirecting to show the success message
      setTimeout(() => {
          router.push('/admin/projects')
          router.refresh()
      }, 1000)
    } catch (error) {
      console.error(error)
      showNotification('Error saving project', 'error')
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
                        <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">Slug (Optional)</label>
                        <input 
                            value={formData.slug} 
                            onChange={(e) => handleChange('slug', e.target.value)} 
                            className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-umbrella-main/50 outline-none transition-colors" 
                            placeholder="auto-generated-from-title"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">Year</label>
                        <input value={formData.year} onChange={(e) => handleChange('year', e.target.value)} required className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-umbrella-main/50 outline-none transition-colors" placeholder="2024" />
                    </div>
                    <div>
                        <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">Client</label>
                        <input value={formData.client} onChange={(e) => handleChange('client', e.target.value)} required className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-umbrella-main/50 outline-none transition-colors" placeholder="Client Name" />
                    </div>
                </div>
                
                <div>
                    <FileUpload 
                        label="Main Project Image"
                        defaultValue={formData.image}
                        onUpload={(url) => handleChange('image', url)}
                        onError={(msg) => showNotification(msg, 'error')}
                        className="h-full"
                    />
                </div>
              </div>

              <div className="pt-8 border-t border-white/10">
                 <GalleryInput name="gallery" defaultValue={formData.gallery} onChange={(v) => handleChange('gallery', v)} />
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">Title</label>
                    <input value={formData.titleEn} onChange={(e) => handleChange('titleEn', e.target.value)} required className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-umbrella-main/50 outline-none transition-colors" />
                </div>
                <div>
                    <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">Category</label>
                    <input value={formData.categoryEn} onChange={(e) => handleChange('categoryEn', e.target.value)} required className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-umbrella-main/50 outline-none transition-colors" />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">Role</label>
                <input value={formData.roleEn} onChange={(e) => handleChange('roleEn', e.target.value)} required className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-umbrella-main/50 outline-none transition-colors" />
              </div>

              <TagInput name="tagsEn" defaultValue={formData.tagsEn} label="Tags" onChange={(v) => handleChange('tagsEn', v)} />

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

              <ResultsInput name="resultsEn" defaultValue={formData.resultsEn} label="Key Results" onChange={(v) => handleChange('resultsEn', v)} />
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
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">Title (TR)</label>
                    <input value={formData.titleTr} onChange={(e) => handleChange('titleTr', e.target.value)} required className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-umbrella-main/50 outline-none transition-colors" />
                </div>
                <div>
                    <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">Category (TR)</label>
                    <input value={formData.categoryTr} onChange={(e) => handleChange('categoryTr', e.target.value)} required className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-umbrella-main/50 outline-none transition-colors" />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">Role (TR)</label>
                <input value={formData.roleTr} onChange={(e) => handleChange('roleTr', e.target.value)} required className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-umbrella-main/50 outline-none transition-colors" />
              </div>

              <TagInput name="tagsTr" defaultValue={formData.tagsTr} label="Tags (TR)" onChange={(v) => handleChange('tagsTr', v)} />

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

              <ResultsInput name="resultsTr" defaultValue={formData.resultsTr} label="Key Results (TR)" onChange={(v) => handleChange('resultsTr', v)} />
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
          <span>{loading ? 'Saving...' : 'Save Project'}</span>
        </button>
      </div>
    </form>

    <Notification 
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
    />
    </>
  )
}
