'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, X, Image as ImageIcon, Globe, Layers, Sparkles, FileText, Clock, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import FileUpload from './FileUpload'
import TagInput from './form-inputs/TagInput'
import InputModal from './InputModal'
import Notification, { NotificationType } from '../ui/Notification'

export default function PostForm({ post }: { post?: any }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [translating, setTranslating] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [regeneratingImage, setRegeneratingImage] = useState(false)
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false)
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
    slug: post?.slug || '',
    image: post?.image || '',
    author: post?.author || 'Umbrella Digital',
    readTime: post?.readTime || 5,
    published: post?.published || false,
    featured: post?.featured || false,
    
    titleEn: post?.titleEn || '',
    summaryEn: post?.summaryEn || '',
    contentEn: post?.contentEn || '',
    tagsEn: post?.tagsEn || '[]',

    titleTr: post?.titleTr || '',
    summaryTr: post?.summaryTr || '',
    contentTr: post?.contentTr || '',
    tagsTr: post?.tagsTr || '[]',
  })

  const handleChange = (key: string, value: any) => {
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
                type: 'post',
                titleTr: formData.titleTr,
                summaryTr: formData.summaryTr,
                contentTr: formData.contentTr,
                tagsTr: formData.tagsTr,
            })
        })
        
        if (!res.ok) throw new Error("Translation failed")
        
        const translated = await res.json()
        
        setFormData(prev => ({
            ...prev,
            titleEn: translated.title,
            summaryEn: translated.summary,
            contentEn: translated.content,
            tagsEn: JSON.stringify(translated.tags),
        }))
        
        setActiveTab('en')
        showNotification("Content translated successfully!", 'success')
    } catch (error) {
        console.error(error)
    } finally {
        setTranslating(false)
    }
  }

  const handleRegenerateImage = async () => {
    if (!formData.titleEn || !formData.slug) {
        showNotification("Title and Slug are required to regenerate image.", 'error');
        return;
    }

    setRegeneratingImage(true);
    try {
        const res = await fetch('/api/admin/regenerate-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                slug: formData.slug,
                title: formData.titleEn,
                summary: formData.summaryEn
            })
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.details || "Image regeneration failed");
        }

        const data = await res.json();
        setFormData(prev => ({ ...prev, image: data.image }));
        showNotification("Image regenerated successfully!", 'success');
    } catch (error: any) {
        console.error(error);
        showNotification(`Image regeneration failed: ${error.message}`, 'error');
    } finally {
        setRegeneratingImage(false);
    }
  }

  const handleGenerateClick = () => {
      setIsGenerateModalOpen(true);
  }

  const handleGenerateSubmit = async (topic: string) => {
    setGenerating(true);
    // Close modal immediately or keep it open with loading state? 
    // The modal has a loading state prop, let's use it.
    // But wait, the modal is controlled by isOpen. 
    // If I want to show loading inside the modal, I need to pass loading prop.
    // But my generate logic is here.
    
    try {
        const res = await fetch('/api/admin/generate-post', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ topic })
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.details || errorData.error || "Generation failed");
        }

        const generated = await res.json();

        setFormData(prev => ({
            ...prev,
            slug: generated.slug || prev.slug,
            readTime: generated.readTime || prev.readTime,
            titleEn: generated.titleEn,
            summaryEn: generated.summaryEn,
            contentEn: generated.contentEn,
            tagsEn: JSON.stringify(generated.tagsEn),
            titleTr: generated.titleTr,
            summaryTr: generated.summaryTr,
            contentTr: generated.contentTr,
            tagsTr: JSON.stringify(generated.tagsTr),
        }));

        setIsGenerateModalOpen(false);
        // Switch to English tab to show result
        setActiveTab('en');
        showNotification("Blog post generated successfully!", 'success')
    } catch (error: any) {
        console.error(error);
        showNotification(`Generation failed: ${error.message}`, 'error')
    } finally {
        setGenerating(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const data = { ...formData }
    
    try {
      const res = await fetch(post ? `/api/admin/posts/${post.id}` : '/api/admin/posts', {
        method: post ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error('Failed to save')
      
      router.push('/admin/posts')
      router.refresh()
    } catch (error) {
      console.error(error)
      showNotification('Error saving post', 'error')
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

        <div className="flex gap-4">
            <button
                type="button"
                onClick={handleGenerateClick}
                disabled={generating}
                className="group relative px-6 py-3 rounded-xl font-bold text-white overflow-hidden transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                <div className="relative flex items-center gap-2">
                    <Sparkles size={18} className={generating ? "animate-spin" : ""} />
                    {generating ? "Generating..." : "Generate with AI"}
                </div>
            </button>

            {activeTab === 'tr' && (
                <button
                    type="button"
                    onClick={handleTranslate}
                    disabled={translating}
                    className="group relative px-6 py-3 rounded-xl font-bold text-white overflow-hidden transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                    <div className="relative flex items-center gap-2">
                        <Globe size={18} className={translating ? "animate-spin" : ""} />
                        {translating ? "Translating..." : "Auto-Translate"}
                    </div>
                </button>
            )}
        </div>
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
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">Author</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input 
                                    value={formData.author} 
                                    onChange={(e) => handleChange('author', e.target.value)} 
                                    className="w-full bg-black/20 border border-white/10 rounded-xl p-4 pl-12 text-white focus:border-umbrella-main/50 outline-none transition-colors" 
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">Read Time (min)</label>
                            <div className="relative">
                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input 
                                    type="number"
                                    value={formData.readTime} 
                                    onChange={(e) => handleChange('readTime', parseInt(e.target.value))} 
                                    className="w-full bg-black/20 border border-white/10 rounded-xl p-4 pl-12 text-white focus:border-umbrella-main/50 outline-none transition-colors" 
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">Slug (Optional)</label>
                        <input 
                            value={formData.slug} 
                            onChange={(e) => handleChange('slug', e.target.value)} 
                            className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-umbrella-main/50 outline-none transition-colors" 
                            placeholder="auto-generated-from-title"
                        />
                    </div>

                    <div className="flex gap-6 pt-4">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${formData.published ? 'bg-green-500 border-green-500' : 'border-white/30 group-hover:border-white'}`}>
                                {formData.published && <Sparkles size={14} className="text-black" />}
                            </div>
                            <input 
                                type="checkbox" 
                                checked={formData.published} 
                                onChange={(e) => handleChange('published', e.target.checked)} 
                                className="hidden" 
                            />
                            <span className="text-sm font-bold text-white">Published</span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${formData.featured ? 'bg-yellow-500 border-yellow-500' : 'border-white/30 group-hover:border-white'}`}>
                                {formData.featured && <Sparkles size={14} className="text-black" />}
                            </div>
                            <input 
                                type="checkbox" 
                                checked={formData.featured} 
                                onChange={(e) => handleChange('featured', e.target.checked)} 
                                className="hidden" 
                            />
                            <span className="text-sm font-bold text-white">Featured</span>
                        </label>
                    </div>
                </div>
                
                <div className="space-y-4">
                    <FileUpload 
                        label="Cover Image"
                        defaultValue={formData.image}
                        onUpload={(url) => handleChange('image', url)}
                        onError={(msg) => showNotification(msg, 'error')}
                    />
                    
                    <button
                        type="button"
                        onClick={handleRegenerateImage}
                        disabled={regeneratingImage}
                        className="w-full bg-white/5 hover:bg-white/10 text-white px-4 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-sm border border-white/10"
                    >
                        <Sparkles size={16} className={regeneratingImage ? "animate-spin" : ""} />
                        {regeneratingImage ? "Regenerating Image..." : "Generate / Regenerate Image with AI"}
                    </button>
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

              <TagInput name="tagsEn" defaultValue={formData.tagsEn} label="Tags" onChange={(v) => handleChange('tagsEn', v)} />

              <div>
                <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">Summary</label>
                <textarea value={formData.summaryEn} onChange={(e) => handleChange('summaryEn', e.target.value)} required rows={3} className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-umbrella-main/50 outline-none transition-colors" />
              </div>
              
              <div className="h-[500px] flex flex-col">
                <label className="block text-xs font-mono text-gray-400 mb-2 uppercase flex items-center gap-2">
                    <FileText size={14} />
                    Content (Markdown)
                </label>
                <textarea 
                    value={formData.contentEn} 
                    onChange={(e) => handleChange('contentEn', e.target.value)} 
                    required 
                    className="w-full flex-1 bg-black/20 border border-white/10 rounded-xl p-4 text-white font-mono text-sm focus:border-umbrella-main/50 outline-none transition-colors resize-none" 
                    placeholder="# Title&#10;&#10;Write your post content here..."
                />
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

              <TagInput name="tagsTr" defaultValue={formData.tagsTr} label="Tags (TR)" onChange={(v) => handleChange('tagsTr', v)} />

              <div>
                <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">Summary (TR)</label>
                <textarea value={formData.summaryTr} onChange={(e) => handleChange('summaryTr', e.target.value)} required rows={3} className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-umbrella-main/50 outline-none transition-colors" />
              </div>
              
              <div className="h-[500px] flex flex-col">
                <label className="block text-xs font-mono text-gray-400 mb-2 uppercase flex items-center gap-2">
                    <FileText size={14} />
                    Content (TR) (Markdown)
                </label>
                <textarea 
                    value={formData.contentTr} 
                    onChange={(e) => handleChange('contentTr', e.target.value)} 
                    required 
                    className="w-full flex-1 bg-black/20 border border-white/10 rounded-xl p-4 text-white font-mono text-sm focus:border-umbrella-main/50 outline-none transition-colors resize-none" 
                    placeholder="# Başlık&#10;&#10;İçeriğinizi buraya yazın..."
                />
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
          <span>{loading ? 'Saving...' : 'Save Post'}</span>
        </button>
      </div>
    </form>

      <InputModal 
        isOpen={isGenerateModalOpen}
        onClose={() => !generating && setIsGenerateModalOpen(false)}
        onSubmit={handleGenerateSubmit}
        title="Neural Content Generation"
        description="Enter a topic or concept. The AI will generate a complete blog post in both English and Turkish, adhering to the Umbrella Digital tone."
        placeholder="e.g. The Future of Web3, AI in Design, Digital Alchemy..."
        buttonText="Initiate Generation"
        loading={generating}
      />

      <Notification 
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
      />
    </>
  )
}
