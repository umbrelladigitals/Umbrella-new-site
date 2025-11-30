
'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Mic, Activity, Command, Cpu } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const NeuralInvite: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0.1, 0.3, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0.1, 0.5], [0.8, 1]);
  const y = useTransform(scrollYProgress, [0.1, 0.5], [100, 0]);

  const triggerVoiceAssistant = () => {
    window.dispatchEvent(new Event('activate-neural-core'));
  };

  return (
    <section ref={containerRef} className="py-32 md:py-48 relative overflow-hidden flex flex-col items-center justify-center min-h-[80vh]">
        
        {/* Cinematic Atmosphere (Transparent, blending with global BG) */}
        <div className="absolute inset-0 pointer-events-none">
            {/* Rotating Red Nebula - Kept as accent but no solid background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-gradient-to-r from-umbrella-main/5 to-purple-900/5 rounded-full blur-[100px] animate-[spin_30s_linear_infinite] opacity-30"></div>
            
            {/* Grid Floor - Subtle Depth */}
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-[linear-gradient(to_bottom,transparent_0%,rgba(225,29,72,0.03)_100%)] [mask-image:linear-gradient(to_bottom,transparent,black)]"></div>
        </div>

        <motion.div 
            style={{ opacity, scale, y }}
            className="relative z-10 flex flex-col items-center text-center max-w-4xl px-6"
        >
            {/* THE NEURAL CORE VISUALIZATION */}
            <div className="relative mb-16 group cursor-pointer" onClick={triggerVoiceAssistant}>
                {/* Outer Rings */}
                <div className="absolute inset-0 -m-8 border border-white/5 rounded-full animate-[spin_10s_linear_infinite_reverse]"></div>
                <div className="absolute inset-0 -m-4 border border-white/10 rounded-full animate-[spin_15s_linear_infinite]"></div>
                
                {/* Core Glow */}
                <div className="absolute inset-0 bg-umbrella-main blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 animate-pulse"></div>

                {/* The Button / Orb */}
                <div className="w-32 h-32 rounded-full bg-black/50 border border-white/20 flex items-center justify-center relative overflow-hidden backdrop-blur-md group-hover:scale-110 transition-transform duration-500 hover:border-umbrella-main/50">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"></div>
                    <Mic size={40} className="text-white relative z-10 group-hover:text-umbrella-main transition-colors duration-300" />
                    
                    {/* Audio Waveform Simulation */}
                    <div className="absolute bottom-0 left-0 right-0 h-1/2 flex items-end justify-center gap-1 pb-4 opacity-50">
                        {[...Array(5)].map((_, i) => (
                            <motion.div 
                                key={i}
                                animate={{ height: [10, 20 + Math.random() * 20, 10] }}
                                transition={{ repeat: Infinity, duration: 1 + Math.random(), ease: "easeInOut" }}
                                className="w-1 bg-umbrella-main rounded-full"
                            />
                        ))}
                    </div>
                </div>

                {/* Satellite Text */}
                <div className="absolute -right-24 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-2 text-[10px] font-mono text-neutral-500 tracking-widest uppercase">
                    <div className="w-8 h-[1px] bg-neutral-700"></div>
                    {t.neuralInvite.status}
                </div>
            </div>

            {/* Typography */}
            <h2 className="text-5xl md:text-8xl font-display font-black text-white leading-[0.9] tracking-tighter mb-8 mix-blend-difference">
                {t.neuralInvite.title} <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-umbrella-main to-red-900">
                    {t.neuralInvite.titleHighlight}
                </span>
            </h2>

            <p className="text-lg md:text-xl text-neutral-400 max-w-lg leading-relaxed mb-12 font-light">
                {t.neuralInvite.description}
            </p>

            {/* Action Trigger */}
            <button 
                onClick={triggerVoiceAssistant}
                className="group relative flex items-center gap-4 px-8 py-4 bg-transparent border border-white/20 rounded-full hover:border-umbrella-main/50 transition-all duration-300 overflow-hidden"
            >
                <div className="absolute inset-0 bg-umbrella-main/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                
                <span className="font-mono text-sm tracking-widest uppercase text-white group-hover:text-umbrella-main transition-colors relative z-10">
                    {t.neuralInvite.button}
                </span>
                
                <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center relative z-10 group-hover:bg-umbrella-main group-hover:text-white transition-colors">
                    <Command size={14} />
                </div>
            </button>

            {/* Tech Decoration */}
            <div className="mt-16 flex items-center gap-8 opacity-30">
                <Cpu size={24} className="text-neutral-500" />
                <div className="h-4 w-[1px] bg-white"></div>
                <Activity size={24} className="text-neutral-500" />
                <div className="h-4 w-[1px] bg-white"></div>
                <div className="font-mono text-xs">{t.neuralInvite.command}</div>
            </div>

        </motion.div>
    </section>
  );
};

export default NeuralInvite;
