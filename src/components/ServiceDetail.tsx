
'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft, Search, Rocket, CheckCircle2, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useUI } from '@/context/UIContext';

export interface ServiceItem {
    id: string;
    title: string;
    shortDescription: string;
    description: string;
    tags: string[];
    video: string;
    challenge: string;
    solution: string;
    deliverables: string[];
}

interface ServiceDetailProps {
    service: ServiceItem;
    onBack: () => void;
}

const ServiceDetail: React.FC<ServiceDetailProps> = ({ service, onBack }) => {
    const { scrollY } = useScroll();
    const { t } = useLanguage();
    const { openLetsTalk } = useUI();
    
    // Scroll Animations mimicking Hero.tsx
    // Fade out, slight scale down, and blur as user scrolls past the first 600px
    const opacity = useTransform(scrollY, [0, 600], [1, 0]);
    const scale = useTransform(scrollY, [0, 600], [1, 0.95]);
    const blur = useTransform(scrollY, [0, 600], ["blur(0px)", "blur(10px)"]);
    const y = useTransform(scrollY, [0, 600], [0, 100]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full min-h-screen"
        >
            {/* Navbar Placeholder / Back Button */}
            <div className="fixed top-24 left-6 md:left-12 z-50">
                <button 
                    onClick={onBack}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white hover:bg-umbrella-main hover:border-umbrella-main transition-all duration-300 group shadow-lg"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium">{t.serviceDetail.backButton}</span>
                </button>
            </div>

            {/* Hero Image Wrapper with Scroll Effects */}
            <div className="relative h-[70vh] md:h-[90vh] w-full overflow-hidden">
                <motion.div 
                    style={{ opacity, scale, filter: blur, y }} 
                    className="absolute inset-0 w-full h-full"
                >
                    <video 
                        autoPlay 
                        loop 
                        muted 
                        playsInline
                        className="w-full h-full object-cover"
                    >
                        <source src={service.video} type="video/webm" />
                    </video>
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-neutral-950" />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
                    
                     <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 max-w-screen-2xl mx-auto z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                        >
                            <div className="flex flex-wrap items-center gap-3 mb-6">
                                {service.tags.map((tag, i) => (
                                    <span key={i} className="px-3 py-1 border border-white/20 rounded-full text-xs font-mono uppercase text-neutral-300 bg-black/30 backdrop-blur-sm shadow-sm">{tag}</span>
                                ))}
                            </div>
                            <h1 className="text-5xl md:text-8xl font-display font-bold mb-6 leading-tight text-white drop-shadow-2xl">{service.title}</h1>
                            <p className="text-xl md:text-2xl text-neutral-200 max-w-3xl leading-relaxed drop-shadow-md">{service.description}</p>
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* Deep Dive Content */}
            <div className="max-w-screen-2xl mx-auto px-6 md:px-12 py-24 space-y-32 relative z-20">
                
                {/* Challenge & Solution Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="flex items-center gap-3 mb-6 text-umbrella-main">
                            <Search className="w-6 h-6" />
                            <span className="font-mono uppercase tracking-widest text-sm">{t.serviceDetail.challenge}</span>
                        </div>
                        <h3 className="text-3xl md:text-4xl font-display font-bold mb-6 leading-snug text-white">
                            {service.challenge}
                        </h3>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                         <div className="flex items-center gap-3 mb-6 text-blue-400">
                            <Rocket className="w-6 h-6" />
                            <span className="font-mono uppercase tracking-widest text-sm">{t.serviceDetail.solution}</span>
                        </div>
                        <p className="text-lg text-neutral-400 leading-relaxed">
                            {service.solution}
                        </p>
                    </motion.div>
                </div>

                {/* Deliverables */}
                <div className="border-t border-white/10 pt-24">
                    <div className="flex flex-col md:flex-row gap-16">
                        <div className="md:w-1/3">
                             <h3 className="text-4xl font-display font-bold mb-6 text-white">{t.serviceDetail.deliverables}</h3>
                             <p className="text-neutral-400">{t.serviceDetail.deliverablesDesc}</p>
                        </div>
                        <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {service.deliverables.map((item, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-center gap-4 p-6 rounded-xl bg-white/5 border border-white/5 hover:border-umbrella-main/50 hover:bg-white/10 transition-all duration-300 group"
                                >
                                    <div className="w-8 h-8 rounded-full bg-umbrella-main/20 flex items-center justify-center text-umbrella-main group-hover:bg-umbrella-main group-hover:text-white transition-colors">
                                        <CheckCircle2 size={18} />
                                    </div>
                                    <span className="font-medium text-lg text-neutral-200 group-hover:text-white transition-colors">{item}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Next Steps / Footer Area for Detail */}
            <div className="py-24 mt-12 relative overflow-hidden">
                 <div className="max-w-screen-2xl mx-auto px-6 md:px-12 text-center relative z-10">
                     <p className="font-mono text-neutral-500 mb-6 uppercase tracking-widest">{t.serviceDetail.ready}</p>
                     <h2 className="text-5xl md:text-8xl font-display font-bold mb-12 text-white">{t.serviceDetail.legendaryMain} <br/> <span className="text-umbrella-main">{t.serviceDetail.legendarySpan}</span></h2>
                     <button onClick={openLetsTalk} className="bg-umbrella-main text-white px-10 py-5 rounded-full font-bold text-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-900/40 inline-flex items-center gap-3">
                         {t.serviceDetail.bookButton} <ChevronRight />
                     </button>
                 </div>
            </div>

        </motion.div>
    );
};

export default ServiceDetail;
