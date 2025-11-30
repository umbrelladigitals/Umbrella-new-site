
'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { Project } from '@prisma/client';

interface SelectedWorkProps {
  projects?: Project[];
}

const SelectedWork: React.FC<SelectedWorkProps> = ({ projects: dbProjects }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { t, language } = useLanguage();

  // Use DB projects if available, otherwise fallback to static (or empty)
  // We map the DB project to the display format
  const projects = dbProjects ? dbProjects.map(p => ({
    id: p.id,
    title: language === 'en' ? p.titleEn : p.titleTr,
    category: language === 'en' ? p.categoryEn : p.categoryTr,
    year: p.year,
    image: p.image,
    // We don't need other fields for the card view
  })) : t.projects.slice(0, 4);

  return (
    <section id="work" className="py-24" ref={containerRef}>
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
        <div className="flex justify-between items-end mb-20">
             <div>
                <h2 className="text-sm font-semibold text-umbrella-main uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-8 h-[1px] bg-umbrella-main"></span>
                    {t.work.label}
                </h2>
                <h3 className="text-4xl md:text-5xl font-display font-bold text-white">
                    {t.work.heading}
                </h3>
             </div>
             <button className="hidden md:block border border-white/20 px-6 py-2 rounded-full hover:bg-white hover:text-black transition-all duration-300">
                 {t.work.viewAll}
             </button>
        </div>

        <div className="space-y-32">
            {projects.map((project, index) => (
                <ProjectCard key={index} project={project} index={index} viewCaseText={t.work.viewCase} />
            ))}
        </div>
      </div>
    </section>
  );
};

const ProjectCard: React.FC<{ project: any; index: number; viewCaseText: string }> = ({ project, index, viewCaseText }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9]);
    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.8, 1], [0.5, 1, 1, 0.5]);

    const isEven = index % 2 === 0;

    return (
        <motion.div 
            ref={ref}
            style={{ opacity, scale }}
            className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 items-center`}
        >
            <div className="w-full md:w-3/5 relative group cursor-none overflow-hidden rounded-xl">
                 <div className="absolute inset-0 bg-umbrella-main/0 group-hover:bg-umbrella-main/20 z-20 transition-colors duration-500"></div>
                 <motion.div style={{ scale: 1.1 }} className="aspect-[4/3] overflow-hidden">
                    <img 
                        src={project.image} 
                        alt={project.title} 
                        className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                    />
                 </motion.div>
            </div>

            <div className="w-full md:w-2/5 md:py-10">
                <motion.div style={{ y: isEven ? y : useTransform(scrollYProgress, [0, 1], [50, -50]) }}>
                    <div className="flex items-center gap-4 mb-4">
                        <span className="text-sm font-mono text-umbrella-main">0{index + 1}</span>
                        <div className="h-[1px] w-12 bg-white/20"></div>
                        <span className="text-sm font-mono text-neutral-400">{project.year}</span>
                    </div>
                    <h3 className="text-4xl md:text-5xl font-display font-bold mb-4">{project.title}</h3>
                    <p className="text-xl text-neutral-400 mb-8">{project.category}</p>
                    <button className="text-white border-b border-white/30 pb-1 hover:border-umbrella-main hover:text-umbrella-main transition-colors duration-300">
                        {viewCaseText}
                    </button>
                </motion.div>
            </div>
        </motion.div>
    )
}

export default SelectedWork;
