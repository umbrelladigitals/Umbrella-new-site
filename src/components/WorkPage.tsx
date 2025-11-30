'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import WorkDetail, { ProjectData } from './WorkDetail';
import { useLanguage } from '@/context/LanguageContext';
import { Project } from '@prisma/client';
import LetsTalkModal from './LetsTalkModal';

// --- Data ---
// Categories updated to match the new mix of Web, Software, and Catalog work
// const categories = ["All", "Web", "Software", "Catalog", "Branding", "Industrial"];

interface WorkPageProps {
  projects?: Project[];
}

const WorkPage: React.FC<WorkPageProps> = ({ projects: dbProjects }) => {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();
  const { t, language } = useLanguage();
  
  const selectedProjectSlug = slug || null;

  // Scroll to top when switching views
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedProjectSlug]);

  // Map DB projects to UI format
  const projects = dbProjects ? dbProjects.map(p => {
      let tags: string[] = [];
      let gallery: string[] = [];
      let results: any[] = [];
      
      try {
          tags = JSON.parse(language === 'en' ? p.tagsEn : p.tagsTr);
      } catch (e) { tags = [] }

      try {
          gallery = JSON.parse(p.gallery);
      } catch (e) { gallery = [] }

      try {
          results = JSON.parse(language === 'en' ? p.resultsEn : p.resultsTr);
      } catch (e) { results = [] }

      return {
        id: p.id,
        slug: p.slug,
        title: language === 'en' ? p.titleEn : p.titleTr,
        category: language === 'en' ? p.categoryEn : p.categoryTr,
        year: p.year,
        image: p.image,
        description: language === 'en' ? p.descEn : p.descTr,
        tags: tags,
        client: p.client,
        role: language === 'en' ? p.roleEn : p.roleTr,
        challenge: language === 'en' ? p.challengeEn : p.challengeTr,
        solution: language === 'en' ? p.solutionEn : p.solutionTr,
        galleryImages: gallery,
        results: results
      };
  }) : t.projects.map((p: any) => ({
      ...p,
      slug: p.slug || p.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
  }));

  const selectedProject = projects.find(p => p.slug === selectedProjectSlug);

  // Redirect if project not found
  useEffect(() => {
      if (selectedProjectSlug && !selectedProject) {
          const basePath = language === 'en' ? '/work' : '/projeler';
          router.replace(basePath);
      }
  }, [selectedProjectSlug, selectedProject, language, router]);

  // Logic to find next project
  const handleNextProject = () => {
      if (selectedProjectSlug) {
          const currentIndex = projects.findIndex(p => p.slug === selectedProjectSlug);
          const nextIndex = (currentIndex + 1) % projects.length;
          const nextSlug = projects[nextIndex].slug;
          const basePath = language === 'en' ? '/work' : '/projeler';
          router.push(`${basePath}/${nextSlug}`);
      }
  }

  const handleSelectProject = (slug: string) => {
      const basePath = language === 'en' ? '/work' : '/projeler';
      router.push(`${basePath}/${slug}`);
  }

  const handleBack = () => {
      const basePath = language === 'en' ? '/work' : '/projeler';
      router.push(basePath);
  }

  return (
    <div className="min-h-screen text-white relative">
       <AnimatePresence mode="wait">
         {!selectedProjectSlug ? (
             <WorkList key="list" onSelect={handleSelectProject} projects={projects} />
         ) : (
             <WorkDetail 
                key="detail" 
                project={selectedProject!} 
                onBack={handleBack} 
                onNext={handleNextProject}
             />
         )}
       </AnimatePresence>
    </div>
  );
};

// --- Sub Component: Main List View ---
const WorkList: React.FC<{ onSelect: (slug: string) => void; projects: any[] }> = ({ onSelect, projects }) => {
  const { t } = useLanguage();
  const categories = t.work.page.categories;
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const containerRef = useRef(null);

  // Filter Logic
  // We need to map the translated category back to English or use a key-based system if the data categories are in English.
  // Assuming project data categories are translated in t.projects, we can filter directly.
  // However, if t.projects categories are translated, we need to make sure they match t.work.page.categories.
  // Let's assume for now that the filtering logic needs to be robust.
  // If activeCategory is the first item (All/Tümü), show all.
  
  const isAll = activeCategory === categories[0];

  const filteredProjects = isAll 
    ? projects 
    : projects.filter(p => p.category.includes(activeCategory) || p.tags.includes(activeCategory));

  return (
    <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.5 }}
        ref={containerRef} 
        className="pt-32 pb-20 relative"
    >
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
             <span className="font-mono text-umbrella-main tracking-widest uppercase text-sm">{t.work.page.label}</span>
          </motion.div>
          
          <h1 className="text-6xl md:text-9xl font-display font-black leading-[0.9] tracking-tighter mb-12">
            {t.work.page.titleMain} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-600">{t.work.page.titleSpan}</span>
          </h1>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 md:gap-8 border-b border-white/10 pb-8">
            {categories.map((cat, i) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-sm md:text-base font-mono uppercase tracking-widest transition-colors duration-300 relative group px-2 py-1 ${
                  activeCategory === cat ? 'text-umbrella-main' : 'text-neutral-500 hover:text-white'
                }`}
              >
                {cat}
                {activeCategory === cat && (
                    <motion.div 
                        layoutId="activeFilter"
                        className="absolute -bottom-[33px] left-0 right-0 h-[2px] bg-umbrella-main"
                    />
                )}
              </button>
            ))}
          </div>
        </header>

        {/* Project Grid */}
        <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-24"
        >
            <AnimatePresence mode="popLayout">
                {filteredProjects.map((project, index) => (
                    <ProjectItem key={project.id} project={project} index={index} onSelect={() => onSelect(project.slug)} />
                ))}
            </AnimatePresence>
        </motion.div>

        {/* CTA Footer */}
        <div className="mt-48 pt-24 border-t border-white/10 text-center">
             <h2 className="text-4xl md:text-6xl font-display font-bold mb-8">{t.work.page.vision}</h2>
             <button 
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-4 text-xl md:text-2xl border border-white/20 rounded-full px-8 py-4 hover:bg-white hover:text-black transition-all duration-300 group"
             >
                {t.work.page.start} <ArrowRight className="group-hover:translate-x-1 transition-transform"/>
             </button>
        </div>

        <LetsTalkModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      </div>
    </motion.div>
  );
}

interface ProjectItemProps {
    project: any;
    index: number;
    onSelect: () => void;
}

const ProjectItem: React.FC<ProjectItemProps> = ({ project, index, onSelect }) => {
    const { t } = useLanguage();
    const isEven = index % 2 === 0;
    
    return (
        <motion.div 
            layout
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.7, delay: index * 0.1, ease: [0.215, 0.61, 0.355, 1] }}
            className={`flex flex-col gap-6 group relative ${!isEven ? 'md:mt-32' : ''}`}
        >
            {/* Alchemical Connector Line (Decorative) */}
            <div className="absolute -left-8 top-1/2 w-[1px] h-32 bg-gradient-to-b from-transparent via-umbrella-main/20 to-transparent hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            {/* Image Section */}
            <div className="w-full relative z-10" onClick={onSelect}>
                {/* Glow Effect */}
                <div className="absolute -inset-4 bg-umbrella-main/20 rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                
                <div className="relative aspect-[4/3] cursor-pointer overflow-hidden rounded-xl border border-white/10 group-hover:border-umbrella-main/50 transition-colors duration-500">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 z-10" />
                    
                    <motion.img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:contrast-125 grayscale group-hover:grayscale-0"
                    />
                    
                    {/* Alchemical Overlay */}
                    <div className="absolute inset-0 bg-umbrella-main/10 mix-blend-color-dodge opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-20" />

                    {/* Floating Year - Styled as Element */}
                    <div className="absolute top-4 right-4 z-30">
                        <div className="backdrop-blur-md bg-black/30 border border-white/10 px-4 py-2 rounded-lg font-mono text-xs tracking-widest group-hover:border-umbrella-main/50 group-hover:text-umbrella-main transition-colors duration-500">
                            {project.year}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="w-full relative z-20 flex flex-col flex-1 px-2">
                {/* Header with "Element" styling */}
                <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4 group-hover:border-umbrella-main/30 transition-colors duration-500">
                    <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-umbrella-main">
                            {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="text-neutral-500 font-mono text-xs uppercase tracking-widest group-hover:text-white transition-colors duration-300">
                            {project.category}
                        </span>
                    </div>
                </div>
                
                <h2 onClick={onSelect} className="text-3xl md:text-5xl font-display font-bold mb-4 leading-[0.9] cursor-pointer text-white group-hover:text-umbrella-main transition-colors duration-300">
                    {project.title}
                </h2>
                
                <p className="text-sm text-neutral-400 mb-6 leading-relaxed line-clamp-3 group-hover:text-neutral-300 transition-colors duration-500">
                    {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mt-auto">
                    {project.tags.slice(0, 3).map((tag: string) => (
                        <span key={tag} className="px-3 py-1 border border-white/5 bg-white/5 rounded text-[10px] font-mono text-neutral-400 group-hover:border-white/20 transition-colors duration-300">
                            {tag}
                        </span>
                    ))}
                </div>
                
                <button onClick={onSelect} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mt-4 group/btn w-fit text-neutral-500 hover:text-white transition-colors">
                    <span>{t.work.viewCase}</span>
                    <ArrowUpRight size={12} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </button>
            </div>
        </motion.div>
    );
};

export default WorkPage;
