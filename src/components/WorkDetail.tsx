'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft, ArrowRight, ExternalLink, Layers, Cpu, Globe, Calendar } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { uiEn, uiTr } from '../translations/ui';

// Define the interface for the expanded project data
export interface ProjectData {
    id: number;
    title: string;
    category: string;
    tags: string[];
    image: string;
    year: string;
    description: string;
    client: string;
    role: string;
    url?: string;
    challenge: string;
    solution: string;
    results: { label: string; value: string }[];
    galleryImages: string[];
}

interface WorkDetailProps {
    project: ProjectData;
    onBack: () => void;
    onNext?: () => void;
}

const WorkDetail: React.FC<WorkDetailProps> = ({ project, onBack, onNext }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll();
    const { language } = useLanguage();
    const t = language === 'en' ? uiEn : uiTr;

    // Hero Scroll Effects (Fade out / Blur / Parallax)
    const opacity = useTransform(scrollY, [0, 600], [1, 0]);
    const scale = useTransform(scrollY, [0, 600], [1, 0.95]);
    const blur = useTransform(scrollY, [0, 600], ["blur(0px)", "blur(10px)"]);
    const y = useTransform(scrollY, [0, 600], [0, 100]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full min-h-screen text-white"
            ref={containerRef}
        >
            {/* Back Navigation */}
            <div className="fixed top-24 left-6 md:left-12 z-50 mix-blend-difference">
                <button 
                    onClick={onBack}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-black transition-all duration-300 group shadow-lg"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-mono font-medium tracking-wide uppercase">{t.work.detail.back}</span>
                </button>
            </div>

            {/* Cinematic Hero */}
            <div className="relative h-[85vh] w-full overflow-hidden">
                <motion.div 
                    style={{ opacity, scale, filter: blur, y }} 
                    className="absolute inset-0 w-full h-full"
                >
                    <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-neutral-950" />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />
                    
                     <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 max-w-screen-2xl mx-auto z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.8, ease: "circOut" }}
                        >
                             <div className="flex items-center gap-4 mb-6">
                                <span className="px-3 py-1 border border-white/20 rounded-full text-xs font-mono uppercase text-umbrella-main bg-black/50 backdrop-blur-md">
                                    {project.category}
                                </span>
                                <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
                                    {project.year}
                                </span>
                            </div>
                            <h1 className="text-6xl md:text-9xl font-display font-black mb-6 leading-[0.9] text-white drop-shadow-2xl tracking-tighter">
                                {project.title}
                            </h1>
                            <p className="text-xl md:text-2xl text-neutral-300 max-w-2xl leading-relaxed drop-shadow-lg">
                                {project.description}
                            </p>
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* Project Metadata Bar */}
            <div className="border-b border-white/10 relative z-20 backdrop-blur-sm bg-neutral-900/20">
                <div className="max-w-screen-2xl mx-auto px-6 md:px-12 py-8 md:py-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div>
                            <div className="text-neutral-500 text-xs font-mono uppercase tracking-widest mb-2 flex items-center gap-2"><Globe size={12}/> {t.work.detail.client}</div>
                            <div className="text-lg md:text-xl font-display font-bold">{project.client}</div>
                        </div>
                        <div>
                            <div className="text-neutral-500 text-xs font-mono uppercase tracking-widest mb-2 flex items-center gap-2"><Layers size={12}/> {t.work.detail.role}</div>
                            <div className="text-lg md:text-xl font-display font-bold">{project.role}</div>
                        </div>
                         <div>
                            <div className="text-neutral-500 text-xs font-mono uppercase tracking-widest mb-2 flex items-center gap-2"><Cpu size={12}/> {t.work.detail.techStack}</div>
                            <div className="text-lg md:text-xl font-display font-bold">{project.tags.slice(0, 2).join(", ")}</div>
                        </div>
                         <div>
                            <div className="text-neutral-500 text-xs font-mono uppercase tracking-widest mb-2 flex items-center gap-2"><Calendar size={12}/> {t.work.detail.year}</div>
                            <div className="text-lg md:text-xl font-display font-bold">{project.year}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Narrative Section */}
            <div className="max-w-screen-2xl mx-auto px-6 md:px-12 py-24 md:py-32 space-y-32 relative z-20">
                
                {/* Challenge */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-4">
                        <div className="sticky top-32">
                            <h3 className="text-sm font-mono text-umbrella-main uppercase tracking-widest mb-4 flex items-center gap-3">
                                <span className="w-8 h-[1px] bg-umbrella-main"></span>
                                {t.work.detail.challenge.title}
                            </h3>
                            <h4 className="text-3xl font-display font-bold mb-6">{t.work.detail.challenge.subtitle}</h4>
                        </div>
                    </div>
                    <div className="lg:col-span-8">
                        <p className="text-xl md:text-2xl text-neutral-300 leading-relaxed font-light">
                            {project.challenge}
                        </p>
                    </div>
                </div>

                {/* Visual Break / Parallax Image */}
                <ParallaxImage src={project.galleryImages[0]} />

                {/* Approach/Solution */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-4">
                        <div className="sticky top-32">
                             <h3 className="text-sm font-mono text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-3">
                                <span className="w-8 h-[1px] bg-blue-400"></span>
                                {t.work.detail.approach.title}
                            </h3>
                             <h4 className="text-3xl font-display font-bold mb-6">{t.work.detail.approach.subtitle}</h4>
                        </div>
                    </div>
                    <div className="lg:col-span-8">
                        <p className="text-xl md:text-2xl text-neutral-300 leading-relaxed font-light">
                            {project.solution}
                        </p>
                    </div>
                </div>
                
                {/* Gallery Grid */}
                <div className="space-y-8">
                     <h3 className="text-4xl md:text-5xl font-display font-bold mb-12 text-center">{t.work.detail.visuals}</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {project.galleryImages.slice(1).map((img, i) => (
                             <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className={`rounded-2xl overflow-hidden border border-white/10 ${i === 2 ? 'md:col-span-2 aspect-[21/9]' : 'aspect-[4/3]'}`}
                             >
                                <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                             </motion.div>
                        ))}
                     </div>
                </div>

            </div>

            {/* Footer / Next Navigation */}
            <div className="py-32 relative overflow-hidden border-t border-white/10">
                 <div className="max-w-screen-2xl mx-auto px-6 md:px-12 text-center relative z-10">
                     <button onClick={onNext} className="group inline-flex flex-col items-center gap-6">
                        <span className="font-mono text-neutral-500 uppercase tracking-widest text-sm">{t.work.detail.next.label}</span>
                        <span className="text-5xl md:text-8xl font-display font-bold text-white group-hover:text-umbrella-main transition-colors duration-300">
                            {t.work.detail.next.button}
                        </span>
                        <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-300">
                            <ArrowRight size={24} />
                        </div>
                     </button>
                 </div>
            </div>
        </motion.div>
    );
};

const ParallaxImage = ({ src }: { src: string }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });
    const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

    return (
        <div ref={ref} className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden rounded-3xl border border-white/10 my-12">
            <motion.div style={{ y }} className="absolute inset-0 h-[120%] w-full -top-[10%]">
                <img src={src} alt="Detail" className="w-full h-full object-cover" />
            </motion.div>
        </div>
    )
}

export default WorkDetail;