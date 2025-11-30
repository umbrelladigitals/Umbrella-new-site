
'use client';

import React, { FormEvent } from 'react';
import { Linkedin, ArrowUpRight, MonitorPlay } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

interface FooterProps {
    onNavigate?: (view: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  
  const handleNav = (view: string, e: React.MouseEvent) => {
      if (onNavigate) {
          e.preventDefault();
          onNavigate(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
      }
  };

  return (
    <footer className="pt-24 pb-12 relative overflow-hidden border-t border-white/5">
        
      {/* Decorative */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-red-900/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* LevelUp Ecosystem Banner */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-24 relative group rounded-3xl overflow-hidden bg-gradient-to-br from-neutral-900 to-black border border-white/10 shadow-2xl shadow-black/50"
        >
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
            <div className="absolute -right-20 -top-20 w-96 h-96 bg-green-600/20 rounded-full blur-[100px] group-hover:bg-green-600/30 transition-colors duration-500" />
            
            <div className="relative z-10 p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-10">
                 <div className="max-w-xl">
                     <div className="flex items-center gap-3 mb-4">
                         <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs font-medium border border-green-500/20 tracking-wider">
                             {t.footer.ecosystem}
                         </span>
                     </div>
                     <h3 className="text-3xl md:text-4xl font-display font-bold mb-4 text-white">{t.footer.ecosystemTitle}</h3>
                     <p className="text-neutral-400 text-lg leading-relaxed">
                         {t.footer.ecosystemDesc}
                     </p>
                 </div>
                 <a 
                    href="https://levelupagency.app/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-green-500 hover:text-white transition-all duration-300 whitespace-nowrap flex items-center gap-2 group/btn shadow-xl"
                 >
                     {t.footer.visitLevelUp}
                     <ArrowUpRight className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform duration-300" />
                 </a>
            </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">
            <div>
                <h2 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-8 text-white">
                    {t.footer.revolutionTitle} <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-500">{t.footer.revolutionSpan}</span>
                </h2>
                <div className="flex flex-col gap-4">
                     <a href="mailto:hello@umbrelladigitals.com" className="text-2xl md:text-3xl text-neutral-300 hover:text-umbrella-main transition-colors duration-300 font-medium">
                        hello@umbrelladigitals.com
                     </a>
                     <a href="tel:+905413438192" className="text-xl text-neutral-500 hover:text-white transition-colors">
                        +90 541 343 8192
                     </a>
                </div>
            </div>

            <div className="flex flex-col justify-end items-start md:items-end">
                <div className="bg-neutral-900/50 p-8 rounded-2xl border border-white/5 w-full max-w-md backdrop-blur-sm hover:border-white/10 transition-colors duration-300">
                    <form className="space-y-4" onSubmit={(e: FormEvent) => e.preventDefault()}>
                        <div>
                            <label className="block text-sm text-neutral-400 mb-2 font-medium">{t.footer.formName}</label>
                            <input type="text" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 focus:outline-none focus:border-umbrella-main text-white transition-colors" placeholder="John Doe" />
                        </div>
                        <div>
                            <label className="block text-sm text-neutral-400 mb-2 font-medium">{t.footer.formEmail}</label>
                            <input type="email" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 focus:outline-none focus:border-umbrella-main text-white transition-colors" placeholder="john@company.com" />
                        </div>
                        <button className="w-full bg-umbrella-main text-white font-bold py-4 rounded-lg hover:bg-red-700 transition-all duration-300 mt-4 shadow-lg shadow-red-900/30">
                            {t.footer.formButton}
                        </button>
                    </form>
                </div>
            </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
                 <img src="/logo.svg" alt="Umbrella Digital" className="h-8 w-auto" />
            </div>

            <div className="flex gap-8 text-sm text-neutral-500 mb-4 md:mb-0">
                <a href="#" onClick={(e) => handleNav('team', e)} className="hover:text-white transition-colors">{t.footer.links.team}</a>
                <a href="#" onClick={(e) => handleNav('privacy', e)} className="hover:text-white transition-colors">{t.footer.links.privacy}</a>
                <a href="#" onClick={(e) => handleNav('terms', e)} className="hover:text-white transition-colors">{t.footer.links.terms}</a>
            </div>

            <div className="flex gap-6">
                <a href="https://www.linkedin.com/in/yunusakts/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 text-neutral-400">
                    <Linkedin size={18} />
                </a>
                <a href="https://www.behance.net/yunusakts/projects" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 text-neutral-400">
                    <MonitorPlay size={18} />
                </a>
            </div>
        </div>
        
        <div className="text-center mt-8">
            <p className="text-neutral-700 text-sm">{t.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
