'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import ServiceDetail, { ServiceItem } from './ServiceDetail';
import { useLanguage } from '@/context/LanguageContext';
import { Service } from '@prisma/client';

interface ServicesPageProps {
    externalServiceId: string | null;
    onServiceSelect: (id: string | null) => void;
    services?: Service[];
}

const ServicesPage: React.FC<ServicesPageProps> = ({ externalServiceId, onServiceSelect, services: dbServices }) => {
  const { t, language } = useLanguage();

  // Reset scroll when switching views
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [externalServiceId]);

  // --- Extended Service Data ---
  const services: ServiceItem[] = dbServices ? dbServices.map(s => {
      let tags: string[] = [];
      let deliverables: string[] = [];
      
      try {
          tags = JSON.parse(language === 'en' ? s.tagsEn : s.tagsTr);
      } catch (e) { tags = [] }

      try {
          deliverables = JSON.parse(language === 'en' ? s.deliverablesEn : s.deliverablesTr);
      } catch (e) { deliverables = [] }

      return {
        id: s.id,
        title: language === 'en' ? s.titleEn : s.titleTr,
        shortDescription: language === 'en' ? s.shortDescEn : s.shortDescTr,
        description: language === 'en' ? s.descEn : s.descTr,
        tags: tags,
        video: s.video || "", 
        challenge: language === 'en' ? s.challengeEn : s.challengeTr,
        solution: language === 'en' ? s.solutionEn : s.solutionTr,
        deliverables: deliverables
      };
  }) : [
    {
      id: 'mobile',
      title: t.servicesPage.items[0].title,
      shortDescription: t.servicesPage.items[0].shortDescription,
      description: t.servicesPage.items[0].description,
      tags: ["React Native", "Flutter", "iOS & Android", "App Store Optimization"],
      video: "/service-mobile.webm", 
      challenge: t.servicesPage.items[0].challenge,
      solution: t.servicesPage.items[0].solution,
      deliverables: t.servicesPage.items[0].deliverables
    },
    // ... (rest of static data omitted for brevity, but logic handles fallback if dbServices is undefined)
    // Actually, I should probably keep the static data as fallback if I want to be safe, 
    // but since I'm replacing the whole block, I'll just use the mapped data if available.
    // If dbServices is not passed, I'll use the static array I had before.
    // To save tokens and space, I will just assume dbServices is passed or I'll copy the static array back.
    // Since I can't easily copy the huge static array back without reading it again or pasting it, 
    // I will try to keep the old code structure but use a conditional.
    // However, replace_string_in_file requires exact match.
    // I will replace the whole `const services: ServiceItem[] = [...]` block.
    // I'll use the static array from the previous read_file output.
    {
      id: 'identity',
      title: t.servicesPage.items[1].title,
      shortDescription: t.servicesPage.items[1].shortDescription,
      description: t.servicesPage.items[1].description,
      tags: ["Logo Design", "Typography Systems", "Brand Books", "Art Direction"],
      video: "/service-identity.webm", 
      challenge: t.servicesPage.items[1].challenge,
      solution: t.servicesPage.items[1].solution,
      deliverables: t.servicesPage.items[1].deliverables
    },
    {
      id: 'uiux',
      title: t.servicesPage.items[2].title,
      shortDescription: t.servicesPage.items[2].shortDescription,
      description: t.servicesPage.items[2].description,
      tags: ["Wireframing", "Prototyping", "User Testing", "Design Systems"],
      video: "/service-uiux.webm", 
      challenge: t.servicesPage.items[2].challenge,
      solution: t.servicesPage.items[2].solution,
      deliverables: t.servicesPage.items[2].deliverables
    },
    {
      id: 'web',
      title: t.servicesPage.items[3].title,
      shortDescription: t.servicesPage.items[3].shortDescription,
      description: t.servicesPage.items[3].description,
      tags: ["Frontend", "React / Next.js", "WebGL", "CMS Integration"],
      video: "/service-web.webm", 
      challenge: t.servicesPage.items[3].challenge,
      solution: t.servicesPage.items[3].solution,
      deliverables: t.servicesPage.items[3].deliverables
    },
    {
      id: 'marketing',
      title: t.servicesPage.items[4].title,
      shortDescription: t.servicesPage.items[4].shortDescription,
      description: t.servicesPage.items[4].description,
      tags: ["SEO / SEM", "Social Strategy", "Content Creation", "Analytics"],
      video: "/service-marketing.webm", 
      challenge: t.servicesPage.items[4].challenge,
      solution: t.servicesPage.items[4].solution,
      deliverables: t.servicesPage.items[4].deliverables
    },
    {
      id: '3d',
      title: t.servicesPage.items[5].title,
      shortDescription: t.servicesPage.items[5].shortDescription,
      description: t.servicesPage.items[5].description,
      tags: ["3D Modeling", "Motion Graphics", "Product Rendering", "Spline / Blender"],
      video: "/service-3d.webm", 
      challenge: t.servicesPage.items[5].challenge,
      solution: t.servicesPage.items[5].solution,
      deliverables: t.servicesPage.items[5].deliverables
    }
  ];

  const selectedService = services.find(s => s.id === externalServiceId);

  return (
    <div className="min-h-screen text-white relative">
       <AnimatePresence mode="wait">
         {!selectedService ? (
             <ServicesList key="list" onSelect={onServiceSelect} services={services} />
         ) : (
             <ServiceDetail 
                key="detail" 
                service={selectedService} 
                onBack={() => onServiceSelect(null)} 
             />
         )}
       </AnimatePresence>
    </div>
  );
};

// --- Sub Component: Main List View ---
const ServicesList: React.FC<{ onSelect: (id: string) => void; services: ServiceItem[] }> = ({ onSelect, services }) => {
    const [activeServiceId, setActiveServiceId] = useState<string>(services[0].id);
    const { t } = useLanguage();
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

    const currentService = services.find(s => s.id === activeServiceId) || services[0];

    return (
        <div className="pt-32 pb-20">
             <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
                <header className="mb-24">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex items-center gap-4 mb-8"
                  >
                     <div className="h-[1px] w-12 bg-umbrella-main"></div>
                     <span className="font-mono text-umbrella-main tracking-widest uppercase text-sm">Service Protocols</span>
                  </motion.div>
                  
                  <h1 className="text-6xl md:text-9xl font-display font-black leading-[0.9] tracking-tighter mb-12 text-white">
                    {t.servicesPage.titleLine1} <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-600">{t.servicesPage.titleLine2}</span>
                  </h1>
                </header>

                {/* TWO COLUMN LAYOUT - Services Section */}
                <section className="relative" ref={containerRef}>
                    <div className="flex flex-col lg:flex-row lg:gap-12">
                        
                        {/* LEFT: Services List */}
                        <div className="lg:w-1/2 mb-32">
                            {services.map((service, index) => (
                                <ServiceCard 
                                    key={service.id} 
                                    service={service} 
                                    index={index} 
                                    onSelect={() => onSelect(service.id)} 
                                    onHover={() => setActiveServiceId(service.id)}
                                    isActive={activeServiceId === service.id}
                                />
                            ))}
                        </div>

                        {/* RIGHT: Sticky Video Container */}
                        <div className="hidden lg:block lg:w-1/2 relative">
                            <motion.div 
                                style={{ opacity }}
                                className="sticky top-24"
                            >
                                <div 
                                    style={{ 
                                        height: 'min(calc(100vh - 120px), 700px)',
                                    }}
                                    className="w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50 bg-neutral-900 relative"
                                >
                                    {/* Noise Overlay */}
                                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay z-20 pointer-events-none"></div>
                                    
                                    {/* Video Content */}
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={currentService.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.4 }}
                                            className="absolute inset-0"
                                        >
                                            <video 
                                                autoPlay 
                                                loop 
                                                muted 
                                                playsInline
                                                key={currentService.video}
                                                className="w-full h-full object-cover"
                                            >
                                                <source src={currentService.video} type="video/webm" />
                                            </video>
                                            
                                            {/* Gradient */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />

                                            {/* Info */}
                                            <div className="absolute bottom-6 left-6 right-6 z-20">
                                                <div className="flex flex-wrap gap-2 mb-3">
                                                    {currentService.tags.slice(0,3).map(tag => (
                                                        <span key={tag} className="px-2 py-1 bg-white/10 backdrop-blur border border-white/10 rounded-full text-xs font-mono text-white/80">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                                <h3 className="text-2xl font-display font-bold text-white">
                                                    {currentService.title}
                                                </h3>
                                            </div>
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Process & FAQ - Below the services */}
                <ProcessSection data={t.servicesPage.process} />
                <FAQSection data={t.servicesPage.faq} />
             </div>
        </div>
    )
}

interface ServiceCardProps { 
    service: ServiceItem; 
    index: number; 
    onSelect: () => void;
    onHover: () => void;
    isActive?: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, index, onSelect, onHover, isActive }) => {
     const ref = useRef<HTMLDivElement>(null);
     const isInView = useInView(ref, { margin: "-45% 0px -45% 0px" });

     useEffect(() => {
        if (isInView) {
            onHover();
        }
     }, [isInView]);

     return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
            onMouseEnter={onHover}
            onClick={onSelect}
            className={`group relative border-t border-white/10 py-12 cursor-pointer overflow-hidden transition-all duration-300 ${isActive ? 'bg-white/[0.03] border-l-2 border-l-umbrella-main' : ''}`}
        >
            {/* Animated Background Highlight */}
            <motion.div 
                className="absolute inset-0 bg-white/5 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out z-0 pointer-events-none"
            />
            
            <div className="flex flex-col md:flex-row items-baseline gap-8 md:gap-16 relative z-10 px-4 md:px-8">
                 <div className="text-xl font-mono text-neutral-600 group-hover:text-umbrella-main transition-colors duration-300 w-12">
                    0{index + 1}
                 </div>
                 
                 <div className="flex-1">
                     <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-white group-hover:translate-x-2 transition-transform duration-300">
                        {service.title}
                     </h2>
                     <p className="text-neutral-400 text-lg max-w-xl group-hover:text-white/80 transition-colors">
                        {service.shortDescription}
                     </p>
                 </div>
                 
                 <div className="md:w-auto flex justify-end">
                     <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-umbrella-main group-hover:border-umbrella-main group-hover:rotate-45 transition-all duration-300">
                         <ArrowRight className="text-white -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                     </div>
                 </div>
            </div>
        </motion.div>
     )
}

// --- Process Section ---
const ProcessSection = ({ data }: { data: any }) => {
    return (
        <section className="py-32 relative border-t border-white/10">
             <div className="mb-20">
                 <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-4 mb-6"
                 >
                    <div className="h-[1px] w-12 bg-umbrella-main"></div>
                    <span className="font-mono text-umbrella-main tracking-widest uppercase text-sm">Methodology</span>
                 </motion.div>
                 
                 <motion.h3 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-6xl font-display font-bold text-white uppercase tracking-tight"
                 >
                    {data.title}
                 </motion.h3>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-5 border-l border-white/10 border-t md:border-t-0">
                 {data.steps.map((step: any, index: number) => (
                     <ProcessStep key={index} step={step} index={index} />
                 ))}
             </div>
        </section>
    )
}

const ProcessStep = ({ step, index }: { step: any, index: number }) => {
    return (
        <div className="group relative border-r border-b border-white/10 p-8 h-[400px] flex flex-col justify-between hover:bg-white/5 transition-colors duration-500">
            <div className="flex justify-between items-start">
                 <span className="font-mono text-xs text-neutral-500 group-hover:text-white transition-colors">0{index + 1}</span>
            </div>
            
            <div className="relative z-10">
                <div className="mb-6 w-12 h-12 rounded-full border border-white/10 flex items-center justify-center bg-black group-hover:border-umbrella-main group-hover:scale-110 transition-all duration-500">
                     <div className="w-2 h-2 bg-white rounded-full group-hover:bg-umbrella-main transition-colors"></div>
                </div>
                
                <h4 className="text-xl font-display font-bold text-white mb-4 group-hover:text-umbrella-main transition-colors">
                    {step.title}
                </h4>
                <p className="text-sm text-neutral-400 leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity">
                    {step.desc}
                </p>
            </div>

            {/* Background noise on hover */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-0 group-hover:opacity-10 mix-blend-overlay transition-opacity duration-500 pointer-events-none"></div>
        </div>
    )
}

// --- FAQ Section ---
const FAQSection = ({ data }: { data: any }) => {
    return (
        <div className="py-20 md:py-32 border-t border-white/10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
                <div className="lg:col-span-4">
                     <motion.h2 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-display font-bold mb-6 sticky top-32"
                     >
                         {data.title}
                     </motion.h2>
                </div>
                <div className="lg:col-span-8 space-y-4">
                     {data.items.map((item: any, i: number) => (
                         <FAQItem key={i} item={item} i={i} />
                     ))}
                </div>
            </div>
        </div>
    )
}

const FAQItem = ({ item, i }: { item: any, i: number }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="border-b border-white/10 last:border-none"
        >
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-6 flex items-center justify-between text-left group"
            >
                <h3 className="text-lg md:text-xl font-medium text-white group-hover:text-umbrella-main transition-colors pr-8">
                    {item.q}
                </h3>
                <div className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-umbrella-main text-white rotate-180' : 'text-neutral-400 group-hover:border-white'}`}>
                    <ChevronDown size={16} />
                </div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <p className="pb-8 text-neutral-400 leading-relaxed max-w-2xl">
                            {item.a}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

export default ServicesPage;
