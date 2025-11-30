'use client'

import { useLanguage } from '@/context/LanguageContext'
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'
import Link from 'next/link'
import { ArrowUpRight, Calendar, Clock, Hash } from 'lucide-react'
import { useRef, useState } from 'react'

export default function ChroniclesList({ posts }: { posts: any[] }) {
  const { language } = useLanguage()

  const t = {
    en: {
      title: "THE CHRONICLES",
      subtitle: "Digital Alchemy Logs",
      readMore: "Read Entry",
      noPosts: "The void is silent yet."
    },
    tr: {
      title: "GÜNLÜKLER",
      subtitle: "Dijital Simya Kayıtları",
      readMore: "Okumaya Başla",
      noPosts: "Boşluk henüz sessiz."
    }
  }

  const content = t[language]
  const titleParts = content.title.split(' ');
  const firstPart = titleParts[0];
  const secondPart = titleParts.slice(1).join(' ');

  return (
    <div className="pt-32 pb-20 relative min-h-screen">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header */}
        <header className="mb-24">
            <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-4 mb-8"
            >
                <div className="h-[1px] w-12 bg-umbrella-main"></div>
                <span className="font-mono text-umbrella-main tracking-widest uppercase text-sm">{content.subtitle}</span>
            </motion.div>
            
            <h1 className="text-6xl md:text-9xl font-display font-black leading-[0.9] tracking-tighter mb-12 text-white">
            {firstPart} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-600">
                {secondPart}
            </span>
            </h1>
        </header>

        {/* Grid Layout */}
        {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post, index) => (
                    <PostCard 
                        key={post.id} 
                        post={post} 
                        index={index} 
                        language={language} 
                        content={content}
                    />
                ))}
            </div>
        ) : (
            <div className="text-center py-20">
                <p className="text-gray-500 font-mono text-lg">{content.noPosts}</p>
            </div>
        )}
      </div>
    </div>
  )
}

function PostCard({ post, index, language, content }: { post: any, index: number, language: 'en' | 'tr', content: any }) {
    const title = language === 'en' ? post.titleEn : post.titleTr
    const summary = language === 'en' ? post.summaryEn : post.summaryTr
    const tags = JSON.parse(language === 'en' ? post.tagsEn : post.tagsTr || '[]').slice(0, 2)

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <Link href={`/chronicles/${post.slug}`} className="block h-full">
            <div 
                onMouseMove={handleMouseMove}
                className="group relative h-full rounded-3xl border border-white/10 bg-neutral-900/50 overflow-hidden"
            >
                <motion.div
                    className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
                    style={{
                        background: useMotionTemplate`
                            radial-gradient(
                                650px circle at ${mouseX}px ${mouseY}px,
                                rgba(255, 255, 255, 0.1),
                                transparent 80%
                            )
                        `,
                    }}
                />
                
                <div className="relative h-full flex flex-col">
                    {/* Image Area */}
                    <div className="aspect-[16/9] w-full overflow-hidden border-b border-white/5">
                        <img 
                            src={post.image || '/placeholder.jpg'} 
                            alt={title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>

                    {/* Content Area */}
                    <div className="p-8 flex flex-col flex-1">
                        <div className="flex items-center gap-4 text-xs font-mono text-neutral-500 mb-4 uppercase tracking-wider">
                            <span className="flex items-center gap-1">
                                <Calendar size={12} />
                                {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                            <span className="w-[1px] h-3 bg-white/10"></span>
                            <span className="flex items-center gap-1">
                                <Clock size={12} />
                                {post.readTime} min
                            </span>
                        </div>

                        <h2 className="text-2xl font-display font-bold mb-4 text-white group-hover:text-umbrella-main transition-colors duration-300">
                            {title}
                        </h2>
                        
                        <p className="text-neutral-400 text-sm leading-relaxed line-clamp-3 mb-6 flex-1">
                            {summary}
                        </p>

                        <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                            <div className="flex gap-2">
                                {tags.map((tag: string) => (
                                    <span key={tag} className="text-[10px] font-mono text-neutral-500 px-2 py-1 rounded border border-white/5 bg-white/5">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                            <div className="flex items-center gap-2 text-sm font-medium text-white opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                {content.readMore} <ArrowUpRight size={16} className="text-umbrella-main" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
