'use client'

import { useLanguage } from '@/context/LanguageContext'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, Share2, Hash } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { useRef } from 'react'

export default function PostDetail({ post }: { post: any }) {
  const { language } = useLanguage()
  const containerRef = useRef<HTMLDivElement>(null)
  
  const t = {
    en: {
      back: "Back to Chronicles",
      share: "Share Transmission",
      writtenBy: "Transmitted by",
      publishedOn: "Logged on"
    },
    tr: {
      back: "Günlüklere Dön",
      share: "İletiyi Paylaş",
      writtenBy: "İleten",
      publishedOn: "Kayıt Tarihi"
    }
  }

  const content = t[language]
  const title = language === 'en' ? post.titleEn : post.titleTr
  const body = language === 'en' ? post.contentEn : post.contentTr
  const tags = JSON.parse(language === 'en' ? post.tagsEn : post.tagsTr || '[]')

  return (
    <article ref={containerRef} className="min-h-screen text-white selection:bg-umbrella-main selection:text-white overflow-hidden">
      
      <div className="relative z-10 max-w-screen-xl mx-auto px-6 md:px-12 pt-32 pb-20">
        
        {/* Header Section (No Background Image) */}
        <header className="mb-16">
            <Link href="/chronicles" className="inline-flex items-center gap-2 text-sm font-mono text-umbrella-main mb-8 hover:text-white transition-colors uppercase tracking-widest">
                <ArrowLeft size={16} />
                {content.back}
            </Link>

            <div className="flex flex-wrap gap-3 mb-8">
                {tags.map((tag: string) => (
                    <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-mono text-white/80 flex items-center gap-1">
                        <Hash size={10} className="text-umbrella-main" />
                        {tag}
                    </span>
                ))}
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black leading-[0.9] tracking-tighter mb-12 text-white">
                {title}
            </h1>

            <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12 text-sm font-mono text-neutral-400 border-y border-white/10 py-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-umbrella-main/20 flex items-center justify-center border border-umbrella-main/50 text-umbrella-main font-bold">
                        {post.author.charAt(0)}
                    </div>
                    <div>
                        <span className="block text-xs uppercase tracking-wider opacity-50">{content.writtenBy}</span>
                        <span className="text-white">{post.author}</span>
                    </div>
                </div>
                <div className="flex items-center gap-8">
                    <div>
                        <span className="block text-xs uppercase tracking-wider opacity-50 mb-1">{content.publishedOn}</span>
                        <span className="flex items-center gap-2 text-white">
                            <Calendar size={14} />
                            {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                    <div>
                        <span className="block text-xs uppercase tracking-wider opacity-50 mb-1">Read Time</span>
                        <span className="flex items-center gap-2 text-white">
                            <Clock size={14} />
                            {post.readTime} min
                        </span>
                    </div>
                </div>
            </div>
        </header>

        {/* Featured Image */}
        <div className="mb-16 rounded-3xl overflow-hidden border border-white/10 aspect-video relative group">
             <img 
                src={post.image || '/placeholder.jpg'} 
                alt={title}
                className="w-full h-full object-cover"
            />
            {/* Optional: Scanline or overlay effect for theme consistency */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Sidebar / Share */}
            <div className="lg:col-span-2 hidden lg:block">
                <div className="sticky top-32 flex flex-col gap-4">
                    <button className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-umbrella-main hover:border-umbrella-main transition-all duration-300 group">
                        <Share2 size={20} className="text-neutral-400 group-hover:text-white" />
                    </button>
                    <div className="w-[1px] h-24 bg-gradient-to-b from-white/10 to-transparent mx-auto"></div>
                </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-8">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="prose prose-invert prose-lg md:prose-xl max-w-none
                    prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight
                    prose-h1:text-5xl prose-h2:text-4xl prose-h3:text-2xl
                    prose-p:text-neutral-300 prose-p:leading-relaxed prose-p:font-light
                    prose-strong:text-white prose-strong:font-bold
                    prose-a:text-umbrella-main prose-a:no-underline hover:prose-a:underline
                    prose-blockquote:border-l-umbrella-main prose-blockquote:bg-white/5 prose-blockquote:p-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
                    prose-code:text-umbrella-main prose-code:bg-white/5 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                    prose-img:rounded-2xl prose-img:border prose-img:border-white/10
                    "
                >
                    <ReactMarkdown>{body}</ReactMarkdown>
                </motion.div>

                {/* Mobile Share */}
                <div className="mt-16 pt-8 border-t border-white/10 lg:hidden">
                    <button className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors">
                        <Share2 size={20} />
                        <span>{content.share}</span>
                    </button>
                </div>
            </div>

        </div>
      </div>

    </article>
  )
}
