'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState } from 'react'
import { ArrowRight, Check, Sparkles, Clock, Layers, DollarSign, X, MessageSquare, ArrowLeft, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

interface ProposalViewProps {
  proposal: any
}

const translations = {
  en: {
    backToUmbrella: "Back to Umbrella",
    viewWork: "View Our Work",
    digitalAlchemyProposal: "Digital Alchemy Proposal",
    preparedFor: "Prepared exclusively for",
    scrollToExplore: "Scroll to Explore",
    visionTitle: "01. The Vision",
    strategicOverview: "Strategic",
    overview: "Overview",
    visualsTitle: "01.5 Visual Direction",
    moodboard: "Moodboard",
    visualReferences: "Visual References",
    scopeTitle: "02. The Scope",
    projectDeliverables: "Project",
    deliverables: "Deliverables",
    timelineTitle: "03. The Timeline",
    executionRoadmap: "Execution",
    roadmap: "Roadmap",
    timelineDesc: "A phased approach to ensure precision and quality at every step of the transformation.",
    duration: "Duration",
    investmentTitle: "04. Investment",
    valueBreakdown: "Value",
    breakdown: "Breakdown",
    module: "Module",
    totalInvestment: "Total Investment",
    protocolInitiated: "PROTOCOL INITIATED",
    pathDeclined: "PATH DECLINED",
    refinementRequested: "REFINEMENT REQUESTED",
    initiateProtocol: "INITIATE PROTOCOL",
    refineVision: "Refine Vision",
    decline: "Decline",
    terms: "By initiating this protocol, you agree to the terms outlined in the scope. This proposal is valid for 14 days.",
    footerSlogan: "Digital Alchemy & Creative Engineering",
    viewVault: "Track Project"
  },
  tr: {
    backToUmbrella: "Umbrella'ya Dön",
    viewWork: "Projelerimizi İncele",
    digitalAlchemyProposal: "Dijital Simya Teklifi",
    preparedFor: "Özel olarak hazırlanmıştır:",
    scrollToExplore: "Keşfetmek için Kaydır",
    visionTitle: "01. Vizyon",
    strategicOverview: "Stratejik",
    overview: "Genel Bakış",
    visualsTitle: "01.5 Görsel Yönelim",
    moodboard: "Moodboard",
    visualReferences: "Görsel Referanslar",
    scopeTitle: "02. Kapsam",
    projectDeliverables: "Proje",
    deliverables: "Teslimatları",
    timelineTitle: "03. Zaman Çizelgesi",
    executionRoadmap: "Uygulama",
    roadmap: "Yol Haritası",
    timelineDesc: "Dönüşümün her adımında hassasiyet ve kaliteyi sağlamak için aşamalı bir yaklaşım.",
    duration: "Süre",
    investmentTitle: "04. Yatırım",
    valueBreakdown: "Fiyat",
    breakdown: "Detayları",
    module: "Modül",
    totalInvestment: "Toplam Yatırım",
    protocolInitiated: "PROTOKOL BAŞLATILDI",
    pathDeclined: "YOL REDDEDİLDİ",
    refinementRequested: "İYİLEŞTİRME İSTENDİ",
    initiateProtocol: "PROTOKOLÜ BAŞLAT",
    refineVision: "Vizyonu İyileştir",
    decline: "Reddet",
    terms: "Bu protokolü başlatarak, kapsamda belirtilen şartları kabul etmiş olursunuz. Bu teklif 14 gün geçerlidir.",
    footerSlogan: "Dijital Simya & Yaratıcı Mühendislik",
    viewVault: "Projeyi Takip Et"
  }
}

export default function ProposalView({ proposal }: ProposalViewProps) {
  const content = proposal.content // Already parsed JSON
  const lang = (content.language as 'en' | 'tr') || 'en'
  const t = translations[lang]

  const { scrollY, scrollYProgress } = useScroll()
  const heroOpacity = useTransform(scrollY, [0, 800], [1, 0])
  const heroScale = useTransform(scrollY, [0, 800], [1, 0.85])
  const heroBlur = useTransform(scrollY, [0, 800], ["blur(0px)", "blur(15px)"])
  const heroY = useTransform(scrollY, [0, 800], [0, 200])
  
  const [status, setStatus] = useState(proposal.status)

  const handleStatusUpdate = async (newStatus: string) => {
    try {
        const res = await fetch(`/api/admin/proposals/${proposal.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...proposal, status: newStatus })
        })
        if (res.ok) setStatus(newStatus)
    } catch (error) {
        console.error(error)
    }
  }

  return (
    <div className="min-h-screen text-white selection:bg-umbrella-main selection:text-white overflow-x-hidden">
      
      {/* Custom Proposal Header */}
      <header className="fixed top-0 left-0 right-0 z-40 p-6 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 text-white hover:text-umbrella-main transition-colors group bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 hover:border-umbrella-main/50">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold font-syne text-sm">{t.backToUmbrella}</span>
        </Link>

        <Link href="/work" target="_blank" className="flex items-center gap-3 text-white hover:text-umbrella-main transition-colors group bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 hover:border-umbrella-main/50">
            <span className="font-bold font-syne text-sm">{t.viewWork}</span>
            <ExternalLink size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </Link>
      </header>

      {/* Progress Bar */}
      <motion.div 
        style={{ scaleX: scrollYProgress }}
        className="fixed top-0 left-0 right-0 h-1 bg-umbrella-main origin-left z-50"
      />

      {/* Hero Section */}
      <section 
        className="h-screen flex flex-col items-center justify-center relative overflow-hidden sticky top-0"
      >
        <motion.div 
            style={{ opacity: heroOpacity, scale: heroScale, filter: heroBlur, y: heroY }}
            className="w-full h-full flex flex-col items-center justify-center relative"
        >
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
            <video 
                autoPlay 
                muted 
                loop
                playsInline
                className="w-full h-full object-cover opacity-20 mix-blend-screen grayscale"
            >
                <source src="/hero-background.webm" type="video/webm" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/80"></div>
        </div>

        {/* Subtle gradient to ensure text readability over global background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80 pointer-events-none"></div>
        
        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center z-10 px-4"
        >
            <div className="flex items-center justify-center gap-2 mb-6 text-umbrella-main">
                <Sparkles size={24} />
                <span className="font-mono tracking-[0.5em] text-sm uppercase">{t.digitalAlchemyProposal}</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-display font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500 drop-shadow-2xl">
                {proposal.projectTitle}
            </h1>
            <p className="text-xl text-gray-300 font-light tracking-wide">
                {t.preparedFor} <span className="text-white font-bold">{proposal.clientName}</span>
            </p>
        </motion.div>

        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400"
        >
            <span className="text-xs uppercase tracking-widest">{t.scrollToExplore}</span>
            <div className="w-px h-12 bg-gradient-to-b from-gray-400 to-transparent"></div>
        </motion.div>
        </motion.div>
      </section>

      <div className="relative z-10 backdrop-blur-3xl border-t border-white/10 shadow-[0_-50px_100px_rgba(0,0,0,1)]">
      {/* The Vision */}
      <section className="py-32 border-b border-white/10 relative">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24"
            >
                <div className="lg:col-span-4">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-[1px] w-12 bg-umbrella-main"></div>
                        <span className="font-mono text-umbrella-main tracking-widest uppercase text-sm">{t.visionTitle}</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-8">
                        {t.strategicOverview} <span className="text-gray-500">{t.overview}</span>
                    </h2>
                </div>
                <div className="lg:col-span-8">
                    <p className="text-xl md:text-3xl leading-relaxed font-light text-gray-200 border-l-2 border-white/10 pl-8">
                        {content.vision}
                    </p>
                </div>
            </motion.div>
        </div>
      </section>

      {/* Visual References (Optional) */}
      {content.images && content.images.length > 0 && (
        <section className="py-32 border-b border-white/10 relative">
            <div className="max-w-screen-2xl mx-auto px-4 md:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mb-16"
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-[1px] w-12 bg-umbrella-main"></div>
                        <span className="font-mono text-umbrella-main tracking-widest uppercase text-sm">{t.visualsTitle}</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-display font-bold text-white">
                        {t.moodboard} <span className="text-gray-500">{t.visualReferences}</span>
                    </h2>
                </motion.div>

                <div className="space-y-8">
                    {/* Hero Image */}
                    {content.images[0] && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="w-full aspect-video md:aspect-[21/9] rounded-3xl overflow-hidden border border-white/10 relative group shadow-2xl shadow-black/50"
                        >
                            <img src={content.images[0]} alt="Main Visual Reference" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500"></div>
                            <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12">
                                <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-mono uppercase tracking-widest text-white">
                                    Primary Direction
                                </span>
                            </div>
                        </motion.div>
                    )}

                    {/* Grid for remaining images */}
                    {content.images.length > 1 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {content.images.slice(1).map((url: string, i: number) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="aspect-video rounded-2xl overflow-hidden border border-white/10 relative group"
                                >
                                    <img src={url} alt={`Visual Reference ${i+2}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
      )}

      {/* The Scope */}
      <section className="py-32 border-b border-white/10 relative">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-8">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-20"
            >
                <div className="flex items-center gap-4 mb-6">
                    <div className="h-[1px] w-12 bg-umbrella-main"></div>
                    <span className="font-mono text-umbrella-main tracking-widest uppercase text-sm">{t.scopeTitle}</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-display font-bold text-white">
                    {t.projectDeliverables} <span className="text-gray-500">{t.deliverables}</span>
                </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-l border-t border-white/10">
                {content.scope.map((item: any, i: number) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="group relative border-r border-b border-white/10 p-8 hover:bg-white/5 transition-colors duration-500 min-h-[300px] flex flex-col"
                    >
                        <div className="flex justify-between items-start mb-8">
                            <span className="font-mono text-xs text-neutral-500 group-hover:text-white transition-colors">0{i + 1}</span>
                            <Layers size={20} className="text-neutral-600 group-hover:text-umbrella-main transition-colors" />
                        </div>
                        
                        <div className="mt-auto relative z-10">
                            <h3 className="text-xl font-display font-bold text-white mb-4 group-hover:text-umbrella-main transition-colors">
                                {item.title}
                            </h3>
                            <p className="text-sm text-neutral-400 leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity">
                                {item.description}
                            </p>
                        </div>

                        {/* Background noise on hover */}
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-0 group-hover:opacity-10 mix-blend-overlay transition-opacity duration-500 pointer-events-none"></div>
                    </motion.div>
                ))}
            </div>
        </div>
      </section>

      {/* The Timeline */}
      <section className="py-32 border-b border-white/10 relative">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
                <div className="lg:col-span-4">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="sticky top-32"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-[1px] w-12 bg-umbrella-main"></div>
                            <span className="font-mono text-umbrella-main tracking-widest uppercase text-sm">{t.timelineTitle}</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-8">
                            {t.executionRoadmap} <span className="text-gray-500">{t.roadmap}</span>
                        </h2>
                        <p className="text-gray-400 font-light">
                            {t.timelineDesc}
                        </p>
                    </motion.div>
                </div>

                <div className="lg:col-span-8">
                    <div className="space-y-0 border-l border-white/10">
                        {content.timeline.map((item: any, i: number) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group relative pl-12 py-12 border-b border-white/10 last:border-b-0"
                            >
                                {/* Timeline Dot */}
                                <div className="absolute left-[-5px] top-16 w-2.5 h-2.5 bg-[#0a0a0a] border border-white/30 rounded-full group-hover:border-umbrella-main group-hover:bg-umbrella-main transition-colors z-10"></div>

                                <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 mb-4">
                                    <h4 className="text-2xl font-display font-bold text-white group-hover:text-umbrella-main transition-colors">{item.phase}</h4>
                                    <span className="font-mono text-umbrella-main font-bold text-sm bg-umbrella-main/10 px-3 py-1 rounded-full border border-umbrella-main/20">{item.duration}</span>
                                </div>
                                <p className="text-gray-400 font-light leading-relaxed max-w-2xl">{item.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Investment Protocol (Unified) */}
      <section className="py-32 relative">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
                
                {/* Left: Breakdown */}
                <div className="lg:col-span-7">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-16"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-[1px] w-12 bg-umbrella-main"></div>
                            <span className="font-mono text-umbrella-main tracking-widest uppercase text-sm">{t.investmentTitle}</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-display font-bold text-white">
                            {t.valueBreakdown} <span className="text-gray-500">{t.breakdown}</span>
                        </h2>
                    </motion.div>

                    <div className="space-y-6">
                        {content.pricing && content.pricing.map((item: any, i: number) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 }}
                                className="group flex items-end justify-between border-b border-white/10 pb-4 hover:border-umbrella-main/50 transition-colors"
                            >
                                <div className="flex flex-col">
                                    <span className="text-xl font-display font-bold text-gray-300 group-hover:text-white transition-colors">{item.item}</span>
                                    <span className="text-xs font-mono text-gray-600 uppercase tracking-wider mt-1">{t.module} 0{i+1}</span>
                                </div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-mono text-white group-hover:text-umbrella-main transition-colors">{formatPrice(item.price)}</span>
                                    <span className="text-sm font-mono text-gray-500">{content.currency}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Right: Total & Actions (Sticky Card) */}
                <div className="lg:col-span-5">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="sticky top-32 bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-xl overflow-hidden"
                    >
                        {/* Noise & Gradient */}
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-umbrella-main/20 rounded-full blur-3xl pointer-events-none"></div>

                        <h3 className="font-mono text-sm text-gray-400 uppercase tracking-widest mb-2">{t.totalInvestment}</h3>
                        <div className="flex items-baseline gap-2 mb-8">
                            <span className="text-6xl md:text-7xl font-display font-bold text-white tracking-tighter">{formatPrice(content.totalPrice)}</span>
                            <span className="text-2xl font-mono text-umbrella-main">{content.currency}</span>
                        </div>

                        <div className="h-px w-full bg-white/10 mb-8"></div>

                        <div className="space-y-4">
                            {status === 'ACCEPTED' ? (
                                <div className="space-y-4">
                                    <div className="w-full bg-green-500/20 border border-green-500/50 text-green-500 py-4 rounded-xl font-bold text-center flex items-center justify-center gap-2">
                                        <Check size={20} />
                                        {t.protocolInitiated}
                                    </div>
                                    <Link 
                                        href={`/tracker/${proposal.slug}`}
                                        className="w-full group relative flex items-center justify-center gap-3 bg-white text-black py-4 rounded-xl font-bold text-lg hover:bg-umbrella-main hover:text-white transition-all duration-300 overflow-hidden"
                                    >
                                        <span className="relative z-10">{t.viewVault}</span>
                                        <ArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" size={20} />
                                    </Link>
                                </div>
                            ) : status === 'REJECTED' ? (
                                <div className="w-full bg-red-500/20 border border-red-500/50 text-red-500 py-4 rounded-xl font-bold text-center flex items-center justify-center gap-2">
                                    <X size={20} />
                                    {t.pathDeclined}
                                </div>
                            ) : status === 'NEGOTIATION' ? (
                                <div className="w-full bg-purple-500/20 border border-purple-500/50 text-purple-500 py-4 rounded-xl font-bold text-center flex items-center justify-center gap-2">
                                    <MessageSquare size={20} />
                                    {t.refinementRequested}
                                </div>
                            ) : (
                                <>
                                    <button 
                                        onClick={() => handleStatusUpdate('ACCEPTED')}
                                        className="w-full group relative flex items-center justify-center gap-3 bg-white text-black py-5 rounded-xl font-bold text-lg hover:bg-umbrella-main hover:text-white transition-all duration-300 overflow-hidden"
                                    >
                                        <span className="relative z-10">{t.initiateProtocol}</span>
                                        <ArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" size={20} />
                                    </button>

                                    <div className="grid grid-cols-2 gap-4">
                                        <button 
                                            onClick={() => handleStatusUpdate('NEGOTIATION')}
                                            className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 py-4 rounded-xl font-medium text-sm hover:bg-white/10 transition-colors"
                                        >
                                            <MessageSquare size={16} />
                                            {t.refineVision}
                                        </button>
                                        <button 
                                            onClick={() => handleStatusUpdate('REJECTED')}
                                            className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 py-4 rounded-xl font-medium text-sm hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-500 transition-colors"
                                        >
                                            <X size={16} />
                                            {t.decline}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>

                        <p className="mt-8 text-xs text-gray-500 text-center leading-relaxed">
                            {t.terms}
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center text-gray-600 text-sm font-mono">
        <p>UMBRELLA DIGITAL &copy; {new Date().getFullYear()}</p>
        <p className="mt-2">{t.footerSlogan}</p>
      </footer>

      </div>
    </div>
  )
}