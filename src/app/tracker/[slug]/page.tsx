'use client'

import { useState, useEffect, use } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Clock, AlertCircle, Activity, Calendar, ArrowLeft, ExternalLink, Layers, Zap, ArrowUpRight, FileText, FileCheck, Download } from 'lucide-react'
import Link from 'next/link'
import ReviewCallModal from '@/components/tracker/ReviewCallModal'

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

interface TrackerData {
  id: string
  slug: string
  status: string
  progress: number
  phases: Phase[]
  updates: Update[]
  files: File[]
  isVaultProtected?: boolean
  language?: string
  proposal: {
    clientName: string
    projectTitle: string
    content: any
  }
  updatedAt: string
}

const translations = {
  EN: {
    backToUmbrella: "Back to Umbrella",
    viewOurWork: "View Our Work",
    status: "Status",
    lastUpdated: "Last Updated",
    complete: "Complete",
    currentFocus: "Current Focus",
    upNext: "Up Next",
    bookReviewCall: "Book Review Call",
    scheduleSync: "Schedule a sync with the team",
    projectTimeline: "Project Timeline",
    liveUpdates: "Live Updates",
    theVault: "The Vault",
    restrictedAccess: "Restricted Access",
    vaultProtected: "This vault is protected. Please enter your access credentials to view the files.",
    enterPassword: "Enter Password",
    verifying: "Verifying...",
    unlockVault: "Unlock Vault",
    vaultEmpty: "The Vault is currently empty.",
    noUpdates: "No updates logged yet.",
    projectCompleted: "Project Completed",
    initiation: "Initiation",
    finalDelivery: "Final Delivery & Launch",
    statusLabels: {
        ACTIVE: "Active",
        COMPLETED: "Completed",
        PAUSED: "Paused"
    },
    phaseStatus: {
        PENDING: "Pending",
        IN_PROGRESS: "In Progress",
        COMPLETED: "Completed"
    },
    fileTypes: {
        DOCUMENT: "Document",
        DESIGN: "Design",
        CONTRACT: "Contract",
        DELIVERABLE: "Deliverable"
    },
    projectTypes: {
        "UI/UX Design": "UI/UX Design",
        "Web Development": "Web Development",
        "Mobile App": "Mobile App",
        "Branding": "Branding",
        "Full Digital Transformation": "Full Digital Transformation"
    }
  },
  TR: {
    backToUmbrella: "Umbrella'ya Dön",
    viewOurWork: "İşlerimizi Gör",
    status: "Durum",
    lastUpdated: "Son Güncelleme",
    complete: "Tamamlandı",
    currentFocus: "Şu Anki Odak",
    upNext: "Sırada",
    bookReviewCall: "Değerlendirme Toplantısı",
    scheduleSync: "Ekiple bir görüşme planlayın",
    projectTimeline: "Proje Zaman Çizelgesi",
    liveUpdates: "Canlı Güncellemeler",
    theVault: "Kasa (Dosyalar)",
    restrictedAccess: "Kısıtlı Erişim",
    vaultProtected: "Bu kasa korumalıdır. Dosyaları görüntülemek için lütfen erişim bilgilerinizi girin.",
    enterPassword: "Şifre Girin",
    verifying: "Doğrulanıyor...",
    unlockVault: "Kasayı Aç",
    vaultEmpty: "Kasa şu anda boş.",
    noUpdates: "Henüz güncelleme girilmedi.",
    projectCompleted: "Proje Tamamlandı",
    initiation: "Başlangıç",
    finalDelivery: "Final Teslimat & Lansman",
    statusLabels: {
        ACTIVE: "Aktif",
        COMPLETED: "Tamamlandı",
        PAUSED: "Duraklatıldı"
    },
    phaseStatus: {
        PENDING: "Beklemede",
        IN_PROGRESS: "Devam Ediyor",
        COMPLETED: "Tamamlandı"
    },
    fileTypes: {
        DOCUMENT: "Doküman",
        DESIGN: "Tasarım",
        CONTRACT: "Sözleşme",
        DELIVERABLE: "Teslimat"
    },
    projectTypes: {
        "UI/UX Design": "UI/UX Tasarım",
        "Web Development": "Web Geliştirme",
        "Mobile App": "Mobil Uygulama",
        "Branding": "Marka Kimliği",
        "Full Digital Transformation": "Dijital Dönüşüm"
    }
  }
}

export default function TrackerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [data, setData] = useState<TrackerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'timeline' | 'updates' | 'vault'>('timeline')
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  
  // Vault Security
  const [vaultPassword, setVaultPassword] = useState('')
  const [isVaultUnlocked, setIsVaultUnlocked] = useState(false)
  const [vaultError, setVaultError] = useState('')
  const [unlocking, setUnlocking] = useState(false)

  const lang = (data?.language || 'EN') as keyof typeof translations
  const t = translations[lang] || translations.EN

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/tracker/${slug}`)
        if (!res.ok) throw new Error('Not found')
        const json = await res.json()
        setData(json)
        if (!json.isVaultProtected) {
            setIsVaultUnlocked(true)
        } else {
            // Check local storage for saved password
            const savedPwd = localStorage.getItem(`vault_pwd_${slug}`)
            if (savedPwd) {
                try {
                    const unlockRes = await fetch(`/api/tracker/${slug}/vault`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ password: savedPwd })
                    })
                    if (unlockRes.ok) {
                        const unlockJson = await unlockRes.json()
                        setData(prev => prev ? { ...prev, files: unlockJson.files } : { ...json, files: unlockJson.files })
                        setIsVaultUnlocked(true)
                        setVaultPassword(savedPwd)
                    } else {
                        localStorage.removeItem(`vault_pwd_${slug}`)
                    }
                } catch (e) {
                    // ignore
                }
            }
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [slug])

  const handleUnlockVault = async (e: React.FormEvent) => {
    e.preventDefault()
    setUnlocking(true)
    setVaultError('')

    try {
        const res = await fetch(`/api/tracker/${slug}/vault`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: vaultPassword })
        })

        if (!res.ok) throw new Error('Invalid password')
        
        const json = await res.json()
        if (data) {
            setData({ ...data, files: json.files })
            setIsVaultUnlocked(true)
            // Save to local storage
            localStorage.setItem(`vault_pwd_${slug}`, vaultPassword)
        }
    } catch (error) {
        setVaultError('Access Denied: Invalid Credentials')
    } finally {
        setUnlocking(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-umbrella-main border-t-transparent rounded-full animate-spin"></div>
            <div className="font-mono text-sm tracking-widest animate-pulse">ESTABLISHING UPLINK...</div>
        </div>
    </div>
  )

  if (!data) return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">404</h1>
            <p className="text-gray-500 font-mono">SIGNAL LOST. PROJECT NOT FOUND.</p>
        </div>
    </div>
  )

  return (
    <div className="min-h-screen text-white selection:bg-umbrella-main selection:text-white overflow-x-hidden">
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 p-6">
        <div className="max-w-screen-2xl mx-auto flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3 text-white hover:text-umbrella-main transition-colors group bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 hover:border-umbrella-main/50">
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-bold font-syne text-sm">{t.backToUmbrella}</span>
            </Link>

            <Link href="/work" target="_blank" className="flex items-center gap-3 text-white hover:text-umbrella-main transition-colors group bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 hover:border-umbrella-main/50">
                <span className="font-bold font-syne text-sm">{t.viewOurWork}</span>
                <ExternalLink size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
        </div>
      </header>

      <main className="pt-32 pb-20 px-6 max-w-screen-2xl mx-auto">
        
        {/* Project Header */}
        <div className="mb-12">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-2">
                {t.projectTypes[data.proposal.projectTitle as keyof typeof t.projectTypes] || data.proposal.projectTitle}
            </h1>
            <p className="text-xl text-gray-400 font-light">for <span className="text-white font-medium">{data.proposal.clientName}</span></p>
        </div>

        {/* Status Hero */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Progress Card */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="md:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-8 relative overflow-hidden group"
            >
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none"></div>
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Zap size={120} />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8">
                        <span className="text-xs font-mono text-umbrella-main uppercase tracking-widest border border-umbrella-main/30 px-3 py-1 rounded-full bg-umbrella-main/10">
                            {t.status}: {t.statusLabels[data.status as keyof typeof t.statusLabels] || data.status}
                        </span>
                        <span className="text-xs font-mono text-gray-500">{t.lastUpdated}: {new Date(data.updatedAt).toLocaleDateString()}</span>
                    </div>

                    <div className="mb-2 flex items-end gap-4">
                        <span className="text-7xl font-display font-bold">{data.progress}%</span>
                        <span className="text-gray-400 mb-4 font-light">{t.complete}</span>
                    </div>

                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${data.progress}%` }}
                            transition={{ duration: 1.5, ease: "circOut" }}
                            className="h-full bg-gradient-to-r from-umbrella-main to-red-600"
                        />
                    </div>
                </div>
            </motion.div>

            {/* Quick Stats & Actions */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col justify-between"
            >
                <div className="space-y-8">
                    <div>
                        <div className="text-gray-500 text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Activity size={14} className="text-umbrella-main" />
                            {t.currentFocus}
                        </div>
                        <div className="text-2xl font-bold text-white leading-tight">
                            {data.phases.find(p => p.status === 'IN_PROGRESS')?.phase || (data.progress === 100 ? t.projectCompleted : t.initiation)}
                        </div>
                    </div>
                    
                    <div>
                        <div className="text-gray-500 text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Clock size={14} />
                            {t.upNext}
                        </div>
                        <div className="text-lg font-medium text-gray-400">
                             {data.phases.find(p => p.status === 'PENDING')?.phase || t.finalDelivery}
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10">
                    <button 
                        onClick={() => setIsReviewModalOpen(true)}
                        className="flex items-center justify-center gap-2 w-full bg-white text-black py-4 rounded-xl font-bold text-sm hover:bg-umbrella-main hover:text-white transition-all group"
                    >
                        <Calendar size={16} />
                        <span>{t.bookReviewCall}</span>
                        <ArrowUpRight size={16} className="opacity-50 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                    <p className="text-center text-xs text-gray-600 mt-3">
                        {t.scheduleSync}
                    </p>
                </div>
            </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-white/10 mb-12">
            <button 
                onClick={() => setActiveTab('timeline')}
                className={`pb-4 text-sm font-bold uppercase tracking-widest transition-colors relative ${activeTab === 'timeline' ? 'text-white' : 'text-gray-600 hover:text-gray-400'}`}
            >
                {t.projectTimeline}
                {activeTab === 'timeline' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-umbrella-main" />}
            </button>
            <button 
                onClick={() => setActiveTab('updates')}
                className={`pb-4 text-sm font-bold uppercase tracking-widest transition-colors relative ${activeTab === 'updates' ? 'text-white' : 'text-gray-600 hover:text-gray-400'}`}
            >
                {t.liveUpdates}
                {activeTab === 'updates' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-umbrella-main" />}
            </button>
            <button 
                onClick={() => setActiveTab('vault')}
                className={`pb-4 text-sm font-bold uppercase tracking-widest transition-colors relative ${activeTab === 'vault' ? 'text-white' : 'text-gray-600 hover:text-gray-400'}`}
            >
                {t.theVault}
                {activeTab === 'vault' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-umbrella-main" />}
            </button>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
            {activeTab === 'timeline' ? (
                <motion.div 
                    key="timeline"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                >
                    {data.phases.map((phase, i) => (
                        <div 
                            key={i} 
                            className={`
                                relative p-6 rounded-2xl border transition-all duration-300
                                ${phase.status === 'IN_PROGRESS' 
                                    ? 'bg-white/5 border-umbrella-main/50 shadow-[0_0_30px_-10px_rgba(225,29,72,0.3)]' 
                                    : phase.status === 'COMPLETED'
                                    ? 'bg-black/40 border-green-500/30'
                                    : 'bg-black/20 border-white/5 opacity-60'
                                }
                            `}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className={`
                                        w-10 h-10 rounded-full flex items-center justify-center border
                                        ${phase.status === 'IN_PROGRESS' ? 'bg-umbrella-main text-white border-umbrella-main' : 
                                          phase.status === 'COMPLETED' ? 'bg-green-500/20 text-green-500 border-green-500/50' : 
                                          'bg-white/5 text-gray-500 border-white/10'}
                                    `}>
                                        {phase.status === 'COMPLETED' ? <Check size={20} /> : 
                                         phase.status === 'IN_PROGRESS' ? <Activity size={20} className="animate-pulse" /> : 
                                         <span className="font-mono text-sm">{i + 1}</span>}
                                    </div>
                                    <div>
                                        <h3 className={`font-bold text-lg ${phase.status === 'COMPLETED' ? 'text-gray-400 line-through' : 'text-white'}`}>
                                            {phase.phase}
                                        </h3>
                                        <p className="text-sm text-gray-500 font-mono">{phase.duration}</p>
                                    </div>
                                </div>
                                <div className="hidden md:block">
                                    <span className={`
                                        text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border
                                        ${phase.status === 'IN_PROGRESS' ? 'bg-umbrella-main/10 text-umbrella-main border-umbrella-main/20' : 
                                          phase.status === 'COMPLETED' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                                          'bg-white/5 text-gray-500 border-white/10'}
                                    `}>
                                        {t.phaseStatus[phase.status as keyof typeof t.phaseStatus] || phase.status.replace('_', ' ')}
                                    </span>
                                </div>
                            </div>
                            
                            {phase.description && (
                                <p className="mt-4 ml-14 text-gray-400 text-sm leading-relaxed max-w-2xl">
                                    {phase.description}
                                </p>
                            )}
                        </div>
                    ))}
                </motion.div>
            ) : activeTab === 'updates' ? (
                <motion.div 
                    key="updates"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-8 border-l border-white/10 ml-4 pl-8"
                >
                    {data.updates.length > 0 ? data.updates.map((update, i) => (
                        <div key={i} className="relative">
                            <div className="absolute -left-[39px] top-0 w-5 h-5 rounded-full bg-black border-2 border-white/20 flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                            <div className="text-xs font-mono text-gray-500 mb-2">{new Date(update.date).toLocaleDateString()}</div>
                            <h3 className="text-xl font-bold text-white mb-2">{update.title}</h3>
                            <p className="text-gray-400 leading-relaxed">{update.content}</p>
                        </div>
                    )) : (
                        <div className="text-gray-500 italic">{t.noUpdates}</div>
                    )}
                </motion.div>
            ) : (
                <motion.div 
                    key="vault"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                >
                    {!isVaultUnlocked ? (
                        <div className="max-w-md mx-auto bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
                            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500 border border-red-500/20">
                                <AlertCircle size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">{t.restrictedAccess}</h3>
                            <p className="text-gray-400 mb-8">{t.vaultProtected}</p>
                            
                            <form onSubmit={handleUnlockVault} className="space-y-4">
                                <input 
                                    type="password" 
                                    value={vaultPassword}
                                    onChange={(e) => setVaultPassword(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-center text-white placeholder-gray-600 focus:border-umbrella-main outline-none transition-colors"
                                    placeholder={t.enterPassword}
                                />
                                {vaultError && <p className="text-red-500 text-sm font-mono">{vaultError}</p>}
                                <button 
                                    type="submit"
                                    disabled={unlocking || !vaultPassword}
                                    className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-umbrella-main hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {unlocking ? t.verifying : t.unlockVault}
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {data.files && data.files.length > 0 ? data.files.map((file, i) => (
                                <a 
                                    key={i} 
                                    href={file.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="group bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-6 hover:bg-white/10 transition-all hover:border-umbrella-main/50"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-black/50 flex items-center justify-center text-umbrella-main group-hover:scale-110 transition-transform">
                                        {file.type === 'DOCUMENT' ? <FileText size={24} /> :
                                        file.type === 'DESIGN' ? <Layers size={24} /> :
                                        file.type === 'CONTRACT' ? <FileCheck size={24} /> :
                                        <Download size={24} />}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-white text-lg mb-1 group-hover:text-umbrella-main transition-colors">{file.name}</h3>
                                        <div className="flex items-center gap-3 text-xs font-mono text-gray-500">
                                            <span>{t.fileTypes[file.type as keyof typeof t.fileTypes] || file.type}</span>
                                            <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                                            <span>{file.size}</span>
                                            <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                                            <span>{new Date(file.date).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-500 group-hover:text-white group-hover:border-white/30 transition-all">
                                        <Download size={18} />
                                    </div>
                                </a>
                            )) : (
                                <div className="col-span-2 text-center py-12 text-gray-500 italic border border-dashed border-white/10 rounded-2xl">
                                    {t.vaultEmpty}
                                </div>
                            )}
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>

      </main>

      {data && (
        <ReviewCallModal 
            isOpen={isReviewModalOpen} 
            onClose={() => setIsReviewModalOpen(false)} 
            projectTitle={data.proposal.projectTitle} 
            language={lang}
        />
      )}

      {/* Footer */}
      <footer className="py-12 text-center text-gray-600 text-sm font-mono flex flex-col items-center gap-6">
        <img src="/logo.svg" alt="Umbrella Digital" className="h-8 w-auto opacity-20 hover:opacity-100 transition-opacity duration-300" />
        <div>
            <p>&copy; {new Date().getFullYear()}</p>
            <p className="mt-2">Digital Alchemy & Creative Engineering</p>
        </div>
      </footer>
    </div>
  )
}
