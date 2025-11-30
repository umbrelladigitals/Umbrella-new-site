'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MousePointer2, Layout, Smartphone, Globe, BarChart3, PenTool, ArrowUpRight, Box } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Service } from '@prisma/client';

interface ServicesProps {
  services?: Service[];
}

const Services: React.FC<ServicesProps> = ({ services: dbServices }) => {
  const { t, language } = useLanguage();

  const iconMap: Record<string, React.ReactNode> = {
    'mobile': <Smartphone className="w-6 h-6" />,
    'web': <Globe className="w-6 h-6" />,
    'uiux': <Layout className="w-6 h-6" />,
    'identity': <PenTool className="w-6 h-6" />,
    'marketing': <BarChart3 className="w-6 h-6" />,
    '3d': <Box className="w-6 h-6" />
  };

  const getClassForId = (id: string) => {
    switch(id) {
        case 'mobile': return "md:col-span-2";
        case 'web': return "md:col-span-1";
        case 'uiux': return "md:col-span-1";
        case 'identity': return "md:col-span-2";
        case 'marketing': return "md:col-span-2";
        case '3d': return "md:col-span-1";
        default: return "md:col-span-1";
    }
  };

  // Sort order to match the design: Mobile, Web, UI/UX, Identity, Marketing, 3D
  const sortOrder = ['mobile', 'web', 'uiux', 'identity', 'marketing', '3d'];

  const services = dbServices ? 
    sortOrder.map(id => {
        const s = dbServices.find(service => service.id === id);
        if (!s) return null;
        return {
            icon: iconMap[s.id],
            title: language === 'en' ? s.titleEn : s.titleTr,
            description: language === 'en' ? s.shortDescEn : s.shortDescTr,
            className: getClassForId(s.id)
        };
    }).filter(Boolean) as any[]
    : [
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: t.services.items[0].title, // Mobile App (Now First)
      description: t.services.items[0].description,
      className: "md:col-span-2" // Large Card
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: t.services.items[1].title, // Web Dev
      description: t.services.items[1].description,
      className: "md:col-span-1"
    },
    {
      icon: <Layout className="w-6 h-6" />,
      title: t.services.items[2].title, // UI/UX
      description: t.services.items[2].description,
      className: "md:col-span-1"
    },
    {
      icon: <PenTool className="w-6 h-6" />,
      title: t.services.items[3].title, // Branding
      description: t.services.items[3].description,
      className: "md:col-span-2"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: t.services.items[4].title, // Growth
      description: t.services.items[4].description,
      className: "md:col-span-2"
    },
    {
      icon: <Box className="w-6 h-6" />,
      title: t.services.items[5].title, // 3D & Product
      description: t.services.items[5].description,
      className: "md:col-span-1"
    }
  ];

  return (
    <section id="services" className="py-32 relative overflow-hidden">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 relative z-10">
        <div className="mb-20">
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <h2 className="text-sm font-semibold text-umbrella-main uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-8 h-[1px] bg-umbrella-main"></span>
                    {t.services.label}
                </h2>
            </motion.div>
            <motion.h3 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-4xl md:text-5xl font-display font-bold text-white max-w-2xl"
            >
                {t.services.heading}
            </motion.h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <BentoCard key={index} service={service} index={index} learnMoreText={t.services.learnMore} />
          ))}
        </div>
      </div>
    </section>
  );
};

interface BentoCardProps {
    service: any;
    index: number;
    learnMoreText: string;
}

const BentoCard: React.FC<BentoCardProps> = ({ service, index, learnMoreText }) => {
    const divRef = useRef<HTMLDivElement>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!divRef.current) return;

        const div = divRef.current;
        const rect = div.getBoundingClientRect();

        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleFocus = () => {
        setIsFocused(true);
        setOpacity(1);
    };

    const handleBlur = () => {
        setIsFocused(false);
        setOpacity(0);
    };

    const handleMouseEnter = () => {
        setOpacity(1);
    };

    const handleMouseLeave = () => {
        setOpacity(0);
    };

    return (
        <motion.div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`relative overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/50 backdrop-blur-md ${service.className} group min-h-[300px] flex flex-col`}
        >
            <div
                className="pointer-events-none absolute -inset-px transition duration-300 z-0"
                style={{
                    opacity,
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.06), transparent 40%)`,
                }}
            />
            <div className="relative h-full p-8 flex flex-col justify-between z-10">
                <div>
                     <div className="w-12 h-12 bg-neutral-800/50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-umbrella-main group-hover:text-white transition-colors duration-300 border border-white/5">
                         {service.icon}
                     </div>
                     <h3 className="text-2xl font-display font-bold mb-4 text-white">{service.title}</h3>
                     <p className="text-neutral-400 leading-relaxed">{service.description}</p>
                </div>
                 <div className="mt-8 flex items-center gap-2 text-sm font-medium text-umbrella-main opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    {learnMoreText} <ArrowUpRight size={16} />
                </div>
            </div>
        </motion.div>
    );
};

export default Services;
