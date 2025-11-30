'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { Save, ArrowLeft, Plus, Trash2, Check, Activity, AlertCircle, ExternalLink, FileText } from 'lucide-react'
import Link from 'next/link'
import Notification, { NotificationType } from '@/components/ui/Notification'
import Select from '@/components/ui/Select'
import FileUpload from '@/components/admin/FileUpload'

interface Phase {
  phase: string
  description: string
  duration: string
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
}

interface Update {
  date: string
  title: string
  content: string
  type: 'MILESTONE' | 'UPDATE' | 'ALERT'
}

interface File {
  name: string
  url: string
  type: string
  size: string
  date: string
}

interface Tracker {
  id: string
  slug: string
  status: string
  progress: number
  phases: Phase[]
  updates: Update[]
  files: File[]
  vaultPassword?: string
  language: string
  proposal: {
    clientName: string
    projectTitle: string
  }
}

export default function EditTrackerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [tracker, setTracker] = useState<Tracker | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notification, setNotification] = useState<{ message: string, type: NotificationType, isVisible: boolean }>({
    message: '',
    type: 'info',
    isVisible: false
  })

  useEffect(() => {
    fetch(`/api/admin/tracker/${id}`)
      .then(res => res.json())
      .then(data => {
        setTracker(data)
        setLoading(false)
      })
      .catch(err => console.error(err))
  }, [id])

  const handleSave = async () => {
    if (!tracker) return
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/tracker/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tracker)
      })
      
      if (!res.ok) throw new Error('Failed to update')
      
      setNotification({ message: 'Tracker updated successfully', type: 'success', isVisible: true })
    } catch (error) {
      setNotification({ message: 'Failed to update tracker', type: 'error', isVisible: true })
    } finally {
      setSaving(false)
    }
  }

  const updatePhase = (index: number, field: keyof Phase, value: any) => {
    if (!tracker) return
    const newPhases = [...tracker.phases]
    newPhases[index] = { ...newPhases[index], [field]: value }
    
    // Auto-calculate progress
    const total = newPhases.length
    let calculatedProgress = 0
    if (total > 0) {
        const completed = newPhases.filter(p => p.status === 'COMPLETED').length
        const inProgress = newPhases.filter(p => p.status === 'IN_PROGRESS').length
        // Weight: Completed = 1, In Progress = 0.5
        calculatedProgress = Math.round(((completed + (inProgress * 0.5)) / total) * 100)
    }

    setTracker({ 
        ...tracker, 
        phases: newPhases, 
        progress: calculatedProgress,
        status: calculatedProgress === 100 ? 'COMPLETED' : tracker.status
    })
  }

  const addUpdate = () => {
    if (!tracker) return
    const newUpdate: Update = {
        date: new Date().toISOString(),
        title: 'New Update',
        content: '',
        type: 'UPDATE'
    }
    setTracker({ ...tracker, updates: [newUpdate, ...tracker.updates] })
  }

  const updateUpdateItem = (index: number, field: keyof Update, value: any) => {
    if (!tracker) return
    const newUpdates = [...tracker.updates]
    newUpdates[index] = { ...newUpdates[index], [field]: value }
    setTracker({ ...tracker, updates: newUpdates })
  }

  const removeUpdate = (index: number) => {
    if (!tracker) return
    const newUpdates = tracker.updates.filter((_, i) => i !== index)
    setTracker({ ...tracker, updates: newUpdates })
  }

  const addFile = () => {
    if (!tracker) return
    const newFile: File = {
        name: 'New File',
        url: '',
        type: 'DOCUMENT',
        size: '0 KB',
        date: new Date().toISOString()
    }
    setTracker({ ...tracker, files: [newFile, ...(tracker.files || [])] })
  }

  const updateFile = (index: number, field: keyof File, value: any) => {
    if (!tracker) return
    const newFiles = [...(tracker.files || [])]
    newFiles[index] = { ...newFiles[index], [field]: value }
    setTracker({ ...tracker, files: newFiles })
  }

  const removeFile = (index: number) => {
    if (!tracker) return
    const newFiles = (tracker.files || []).filter((_, i) => i !== index)
    setTracker({ ...tracker, files: newFiles })
  }

  if (loading) return <div className="text-white p-8">Loading...</div>
  if (!tracker) return <div className="text-white p-8">Tracker not found</div>

  return (
    <div className="space-y-8 pb-20">
      <Notification 
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
            <h1 className="text-4xl font-display font-bold text-white mb-2">{tracker.proposal.projectTitle}</h1>
            <p className="text-gray-500 font-mono text-sm tracking-widest uppercase">MANAGE PROJECT • {tracker.proposal.clientName}</p>
        </div>
        <div className="flex gap-4">
            <Link 
                href={`/tracker/${tracker.slug}`} 
                target="_blank"
                className="px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold flex items-center gap-2 transition-colors"
            >
                <ExternalLink size={18} /> Public View
            </Link>
            <button 
                onClick={handleSave}
                disabled={saving}
                className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-umbrella-main hover:text-white transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
            >
                <Save size={18} />
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
        </div>
      </div>

      {/* Status & Progress */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
            <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">Project Status</label>
            <Select 
                value={tracker.status}
                onChange={(e) => setTracker({ ...tracker, status: e.target.value })}
                options={[
                    { value: "ACTIVE", label: "Active", className: "bg-neutral-900 text-umbrella-main" },
                    { value: "COMPLETED", label: "Completed", className: "bg-neutral-900 text-green-500" },
                    { value: "PAUSED", label: "Paused", className: "bg-neutral-900 text-yellow-500" }
                ]}
                className="py-3"
            />
        </div>
        <div>
            <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">Language</label>
            <Select 
                value={tracker.language || 'EN'}
                onChange={(e) => setTracker({ ...tracker, language: e.target.value })}
                options={[
                    { value: "EN", label: "English", className: "bg-neutral-900 text-white" },
                    { value: "TR", label: "Turkish", className: "bg-neutral-900 text-white" }
                ]}
                className="py-3"
            />
        </div>
        <div className="md:col-span-2">
            <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">Overall Progress (Auto-Calculated)</label>
            <div className="flex items-center gap-4">
                <div className="flex-1 h-2 bg-black/50 rounded-lg overflow-hidden">
                    <div className="h-full bg-umbrella-main transition-all duration-500" style={{ width: `${tracker.progress}%` }}></div>
                </div>
                <span className="font-display font-bold text-xl">{tracker.progress}%</span>
            </div>
        </div>
      </div>

      {/* Phases */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white font-display">Project Phases</h2>
        <div className="space-y-4">
            {tracker.phases.map((phase, i) => (
                <div key={i} className="bg-black/20 border border-white/10 rounded-xl p-6 flex items-center gap-6">
                    <div className="font-mono text-gray-500 w-8">{i + 1}</div>
                    <div className="flex-1">
                        <div className="font-bold text-white text-lg mb-1">{phase.phase}</div>
                        <div className="text-sm text-gray-500">{phase.duration}</div>
                    </div>
                    <div className="w-48">
                        <Select 
                            value={phase.status}
                            onChange={(e) => updatePhase(i, 'status', e.target.value)}
                            options={[
                                { value: "PENDING", label: "Pending", className: "bg-neutral-900 text-gray-500" },
                                { value: "IN_PROGRESS", label: "In Progress", className: "bg-neutral-900 text-umbrella-main" },
                                { value: "COMPLETED", label: "Completed", className: "bg-neutral-900 text-green-500" }
                            ]}
                            className={`py-2 text-sm font-bold ${
                                phase.status === 'IN_PROGRESS' ? 'text-umbrella-main bg-umbrella-main/10 border-umbrella-main/20' :
                                phase.status === 'COMPLETED' ? 'text-green-500 bg-green-500/10 border-green-500/20' :
                                'text-gray-500'
                            }`}
                        />
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Updates */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white font-display">Project Updates</h2>
            <button onClick={addUpdate} className="text-xs font-bold text-umbrella-main hover:text-white transition-colors flex items-center gap-1 uppercase tracking-wider">
                <Plus size={16} /> Add Update
            </button>
        </div>
        
        <div className="space-y-4">
            {tracker.updates.map((update, i) => (
                <div key={i} className="bg-black/20 border border-white/10 rounded-xl p-6 relative group">
                    <button 
                        onClick={() => removeUpdate(i)}
                        className="absolute top-4 right-4 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                        <Trash2 size={18} />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-xs font-mono text-gray-500 mb-1 uppercase">Title</label>
                            <input 
                                type="text" 
                                value={update.title}
                                onChange={(e) => updateUpdateItem(i, 'title', e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white focus:border-umbrella-main/50 outline-none font-bold"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-mono text-gray-500 mb-1 uppercase">Type</label>
                            <Select 
                                value={update.type}
                                onChange={(e) => updateUpdateItem(i, 'type', e.target.value)}
                                options={[
                                    { value: "UPDATE", label: "General Update", className: "bg-neutral-900" },
                                    { value: "MILESTONE", label: "Milestone Reached", className: "bg-neutral-900" },
                                    { value: "ALERT", label: "Alert / Important", className: "bg-neutral-900" }
                                ]}
                                className="py-2"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-mono text-gray-500 mb-1 uppercase">Content</label>
                        <textarea 
                            value={update.content}
                            onChange={(e) => updateUpdateItem(i, 'content', e.target.value)}
                            rows={3}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-gray-300 text-sm focus:border-umbrella-main/50 outline-none resize-none"
                        />
                    </div>
                    <div className="mt-2 text-xs text-gray-600 font-mono">
                        {new Date(update.date).toLocaleString()}
                    </div>
                </div>
            ))}
            {tracker.updates.length === 0 && (
                <div className="text-center py-8 text-gray-500 italic border border-dashed border-white/10 rounded-xl">
                    No updates added yet.
                </div>
            )}
        </div>
      </div>

      {/* The Vault (Files) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white font-display">The Vault (Files)</h2>
            <button onClick={addFile} className="text-xs font-bold text-umbrella-main hover:text-white transition-colors flex items-center gap-1 uppercase tracking-wider">
                <Plus size={16} /> Add File
            </button>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
            <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">Vault Password (Optional)</label>
            <input 
                type="text" 
                value={tracker.vaultPassword || ''}
                onChange={(e) => setTracker({ ...tracker, vaultPassword: e.target.value })}
                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-umbrella-main outline-none font-mono"
                placeholder="Leave empty for public access"
            />
            <p className="text-xs text-gray-500 mt-2">If set, clients will need to enter this password to access the files tab.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(tracker.files || []).map((file, i) => (
                <div key={i} className="bg-black/20 border border-white/10 rounded-xl p-6 relative group">
                    <button 
                        onClick={() => removeFile(i)}
                        className="absolute top-4 right-4 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all z-10"
                    >
                        <Trash2 size={18} />
                    </button>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-mono text-gray-500 mb-1 uppercase">File Name</label>
                            <input 
                                type="text" 
                                value={file.name}
                                onChange={(e) => updateFile(i, 'name', e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white focus:border-umbrella-main/50 outline-none font-bold"
                            />
                        </div>
                        
                        <FileUpload 
                            label="Upload File"
                            defaultValue={file.url}
                            onUpload={(url) => updateFile(i, 'url', url)}
                            onMetadataChange={(meta) => {
                                updateFile(i, 'size', meta.size)
                                if (file.name === 'New File') {
                                    updateFile(i, 'name', meta.name)
                                }
                            }}
                            accept="*/*"
                        />

                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="block text-xs font-mono text-gray-500 mb-1 uppercase">Type</label>
                                <Select 
                                    value={file.type}
                                    onChange={(e) => updateFile(i, 'type', e.target.value)}
                                    options={[
                                        { value: "DOCUMENT", label: "Document", className: "bg-neutral-900" },
                                        { value: "DESIGN", label: "Design Asset", className: "bg-neutral-900" },
                                        { value: "CONTRACT", label: "Contract", className: "bg-neutral-900" },
                                        { value: "DELIVERABLE", label: "Final Deliverable", className: "bg-neutral-900" }
                                    ]}
                                    className="py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-mono text-gray-500 mb-1 uppercase">Size (Auto)</label>
                                <input 
                                    type="text" 
                                    value={file.size}
                                    onChange={(e) => updateFile(i, 'size', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-gray-300 text-sm focus:border-umbrella-main/50 outline-none"
                                    placeholder="Auto-calculated"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            {(!tracker.files || tracker.files.length === 0) && (
                <div className="col-span-2 text-center py-8 text-gray-500 italic border border-dashed border-white/10 rounded-xl">
                    No files in the vault.
                </div>
            )}
        </div>
      </div>

    </div>
  )
}
