
'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowRight, Zap, Eye, Cpu, Heart } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useUI } from '@/context/UIContext';

interface ManifestoPageProps {}

const ManifestoPage: React.FC<ManifestoPageProps> = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const { openLetsTalk } = useUI();
  
  const principles = t.manifestoPage.principles;

  return (
    <div ref={containerRef} className="min-h-screen text-white relative overflow-hidden pt-32 pb-20">
      <div className="relative z-10 max-w-screen-2xl mx-auto px-6 md:px-12">
        
        {/* Header Section */}
        <header className="mb-40">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-4 mb-8"
          >
             <div className="h-[1px] w-12 bg-umbrella-main"></div>
             <span className="font-mono text-umbrella-main tracking-widest uppercase text-sm">{t.manifestoPage.subtitle}</span>
          </motion.div>
          
          <h1 className="text-6xl md:text-9xl font-display font-black leading-[0.9] tracking-tighter mb-12 mix-blend-difference">
            <motion.div 
                initial={{ x: -100, opacity: 0 }} 
                animate={{ x: 0, opacity: 1 }} 
                transition={{ duration: 0.8, ease: "circOut" }}
            >
              {t.manifestoPage.titlePart1}
            </motion.div>
            <motion.div 
                initial={{ x: 100, opacity: 0 }} 
                animate={{ x: 0, opacity: 1 }} 
                transition={{ duration: 0.8, delay: 0.1, ease: "circOut" }}
                className="text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-600"
            >
              {t.manifestoPage.titlePart2}
            </motion.div>
            <motion.div 
                initial={{ y: 100, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }} 
                transition={{ duration: 0.8, delay: 0.2, ease: "circOut" }}
            >
              {t.manifestoPage.titlePart3}
            </motion.div>
          </h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="text-xl md:text-2xl text-neutral-400 max-w-2xl leading-relaxed border-l-2 border-white/10 pl-8"
          >
            {t.manifestoPage.descriptionPart1} <span className="text-white font-bold">{t.manifestoPage.descriptionBold}</span>{t.manifestoPage.descriptionPart2}
          </motion.p>
        </header>

        {/* Core Principles - Stacking Cards */}
        <div className="space-y-40 mb-40">
            <PrincipleSection 
                number={principles[0].number} 
                title={principles[0].title} 
                icon={<Zap size={32} />}
                description={principles[0].description}
            />
            <PrincipleSection 
                number={principles[1].number} 
                title={principles[1].title} 
                icon={<Cpu size={32} />}
                description={principles[1].description}
            />
            <PrincipleSection 
                number={principles[2].number} 
                title={principles[2].title} 
                icon={<Eye size={32} />}
                description={principles[2].description}
            />
            <PrincipleSection 
                number={principles[3].number} 
                title={principles[3].title} 
                icon={<Heart size={32} />}
                description={principles[3].description}
            />
        </div>

        {/* Big Statement */}
        <div className="py-20 border-t border-b border-white/10 relative overflow-hidden mb-40 group">
            <div className="absolute inset-0 bg-umbrella-main/5 transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-out"></div>
            <h2 className="text-4xl md:text-7xl font-display font-bold text-center relative z-10">
                "{t.manifestoPage.quote.text}<br/>
                <span className="text-umbrella-main">{t.manifestoPage.quote.span}"</span>
            </h2>
        </div>

        {/* Final Call */}
        <div className="flex flex-col items-center justify-center text-center">
            <p className="font-mono text-neutral-500 mb-6 uppercase tracking-widest">{t.manifestoPage.cta.subtitle}</p>
            <button 
                onClick={openLetsTalk} 
                className="group relative inline-flex items-center justify-center px-12 py-6 overflow-hidden font-bold text-white rounded-full bg-neutral-900 border border-white/10 transition-all duration-300 hover:bg-neutral-800 hover:border-umbrella-main hover:scale-105"
            >
                <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-umbrella-main rounded-full group-hover:w-80 group-hover:h-80 opacity-20 blur-xl"></span>
                <span className="relative text-2xl md:text-4xl font-display flex items-center gap-4">
                    {t.manifestoPage.cta.button} <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300"/>
                </span>
            </button>
        </div>

      </div>
    </div>
  );
};

interface PrincipleSectionProps {
    number: string;
    title: string;
    description: string;
    icon: React.ReactNode;
}

const PrincipleSection: React.FC<PrincipleSectionProps> = ({ number, title, description, icon }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "center center"]
    });
    
    const opacity = useTransform(scrollYProgress, [0, 0.5], [0.2, 1]);
    const x = useTransform(scrollYProgress, [0, 0.5], [100, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);

    return (
        <motion.div 
            ref={ref}
            style={{ opacity, scale }}
            className="flex flex-col md:flex-row items-start gap-8 md:gap-16 p-8 md:p-12 border border-white/5 rounded-3xl bg-white/[0.02] backdrop-blur-sm hover:border-umbrella-main/30 transition-colors duration-500"
        >
             <div className="relative">
                {/* Glowing Red Number Effect */}
                <div className="text-8xl font-display font-black text-transparent bg-clip-text bg-gradient-to-br from-umbrella-main to-red-900 select-none relative z-10 drop-shadow-[0_0_15px_rgba(225,29,72,0.4)]">
                    {number}
                </div>
                <div className="absolute inset-0 text-8xl font-display font-black text-umbrella-main blur-2xl opacity-40 select-none pointer-events-none">
                    {number}
                </div>
             </div>
             <div className="flex-1">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-white/5 rounded-full text-umbrella-main border border-white/10">
                        {icon}
                    </div>
                    <h3 className="text-4xl font-display font-bold">{title}</h3>
                </div>
                <p className="text-xl text-neutral-400 leading-relaxed">{description}</p>
             </div>
        </motion.div>
    );
}

export default ManifestoPage;
