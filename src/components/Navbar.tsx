'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, Hammer, Volume2, VolumeX, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useUI } from '@/context/UIContext';

interface NavbarProps {
  isMuted: boolean;
  onToggleMute: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isMuted, onToggleMute }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, language, setLanguage } = useLanguage();
  const { openLetsTalk } = useUI();
  const pathname = usePathname();
  const router = useRouter();

  // Determine current view based on path
  const getCurrentView = (path: string) => {
    if (path === '/') return 'home';
    if (path.includes('/services') || path.includes('/hizmetler')) return 'services';
    if (path.includes('/workshop') || path.includes('/atolye')) return 'workshop';
    if (path.includes('/work') || path.includes('/projeler')) return 'work';
    if (path.includes('/chronicles') || path.includes('/gunlukler')) return 'chronicles';
    if (path.includes('/contact') || path.includes('/iletisim')) return 'contact';
    if (path.includes('/manifesto')) return 'manifesto';
    return 'home';
  };

  const currentView = getCurrentView(pathname);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigation = (view: string) => {
    setMobileMenuOpen(false);
    
    let path = '/';
    // Simple mapping, can be improved with a centralized route config
    if (language === 'en') {
        if (view === 'home') path = '/';
        else path = `/${view}`;
    } else {
        // Turkish mappings
        if (view === 'home') path = '/';
        else if (view === 'services') path = '/hizmetler';
        else if (view === 'work') path = '/projeler';
        else if (view === 'chronicles') path = '/gunlukler';
        else if (view === 'workshop') path = '/atolye';
        else if (view === 'contact') path = '/iletisim';
        else if (view === 'manifesto') path = '/manifesto-tr'; // Assuming separate route or handled via param
    }

    router.push(path);
  };

  const toggleLanguage = () => {
      const newLang = language === 'en' ? 'tr' : 'en';
      setLanguage(newLang);
      // Optional: Redirect to translated path
      // For now, just switching context. The page might need to reload or redirect if paths are strict.
      // In a real Next.js app with localized routing, we'd redirect here.
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'py-4' : 'py-6'
        }`}
      >
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
          <div className={`backdrop-blur-xl border border-white/5 rounded-full px-6 py-3 flex items-center justify-between transition-all duration-300 ${isScrolled ? 'bg-black/60 shadow-lg shadow-black/20' : 'bg-transparent'}`}>
            
            {/* Logo */}
            <button onClick={() => handleNavigation('home')} className="flex items-center gap-2 group">
              <img src="/logo.svg" alt="Umbrella Digital" className="h-10 w-auto" />
            </button>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <button
                onClick={() => handleNavigation('home')}
                className={`text-sm font-medium transition-colors relative group ${currentView === 'home' ? 'text-white' : 'text-neutral-400 hover:text-white'}`}
              >
                {t.nav.home}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-umbrella-main transition-all duration-300 ${currentView === 'home' ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </button>

              <button
                onClick={() => handleNavigation('manifesto')}
                className={`text-sm font-medium transition-colors relative group ${currentView === 'manifesto' ? 'text-white' : 'text-neutral-400 hover:text-white'}`}
              >
                {t.nav.manifesto}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-umbrella-main transition-all duration-300 ${currentView === 'manifesto' ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </button>
              
              <button
                onClick={() => handleNavigation('services')}
                className={`text-sm font-medium transition-colors relative group ${currentView === 'services' ? 'text-white' : 'text-neutral-400 hover:text-white'}`}
              >
                {t.nav.services}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-umbrella-main transition-all duration-300 ${currentView === 'services' ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </button>
              
              <button
                onClick={() => handleNavigation('work')}
                className={`text-sm font-medium transition-colors relative group ${currentView === 'work' ? 'text-white' : 'text-neutral-400 hover:text-white'}`}
              >
                {t.nav.work}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-umbrella-main transition-all duration-300 ${currentView === 'work' ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </button>

              <button
                onClick={() => handleNavigation('chronicles')}
                className={`text-sm font-medium transition-colors relative group ${currentView === 'chronicles' ? 'text-white' : 'text-neutral-400 hover:text-white'}`}
              >
                {t.nav.chronicles}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-umbrella-main transition-all duration-300 ${currentView === 'chronicles' ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </button>
              
              {/* Forge Link (Formerly Workshop) */}
              <button
                onClick={() => handleNavigation('workshop')}
                className={`text-sm font-medium transition-all relative group flex items-center gap-2 ${currentView === 'workshop' ? 'text-umbrella-main' : 'text-neutral-400 hover:text-umbrella-main'}`}
              >
                <Hammer size={14} className={currentView === 'workshop' ? 'animate-pulse' : ''}/>
                {t.nav.forge}
              </button>

              {/* Contact Link */}
               <button
                onClick={() => handleNavigation('contact')}
                className={`text-sm font-medium transition-colors relative group ${currentView === 'contact' ? 'text-white' : 'text-neutral-400 hover:text-white'}`}
              >
                {t.nav.contact}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-umbrella-main transition-all duration-300 ${currentView === 'contact' ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </button>
            </div>

            {/* CTA & Volume */}
            <div className="hidden md:flex items-center gap-4">
              
              {/* Language Switcher */}
              <button
                onClick={toggleLanguage}
                className="text-xs font-mono font-bold text-neutral-400 hover:text-white transition-colors flex items-center gap-1 px-2"
              >
                  <span className={language === 'tr' ? 'text-umbrella-main' : ''}>TR</span>
                  <span className="opacity-30">|</span>
                  <span className={language === 'en' ? 'text-umbrella-main' : ''}>EN</span>
              </button>

              {/* Volume Toggle */}
              <button
                onClick={onToggleMute}
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 ${isMuted ? 'border-white/10 text-neutral-500 hover:text-white hover:border-white/30' : 'border-umbrella-main/50 text-umbrella-main bg-umbrella-main/10'}`}
                title={isMuted ? "Unmute Audio" : "Mute Audio"}
              >
                 {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>

              <button 
                onClick={openLetsTalk}
                className="bg-white text-black px-5 py-2 rounded-full text-sm font-semibold hover:bg-umbrella-main hover:text-white transition-all duration-300 flex items-center gap-2 group"
              >
                {t.nav.letsTalk}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden text-white p-2"
            >
              <Menu />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-2xl flex flex-col justify-center items-center"
          >
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
            >
              <X size={32} />
            </button>

            <div className="flex flex-col items-center gap-8">
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  onClick={() => handleNavigation('home')}
                  className={`font-display text-4xl font-bold hover:text-umbrella-main transition-colors ${currentView === 'home' ? 'text-white' : 'text-neutral-400'}`}
                >
                  {t.nav.home}
                </motion.button>
                
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  onClick={() => handleNavigation('manifesto')}
                  className={`font-display text-4xl font-bold hover:text-umbrella-main transition-colors ${currentView === 'manifesto' ? 'text-white' : 'text-neutral-400'}`}
                >
                  {t.nav.manifesto}
                </motion.button>
                
                 <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  onClick={() => handleNavigation('services')}
                   className={`font-display text-4xl font-bold hover:text-umbrella-main transition-colors ${currentView === 'services' ? 'text-white' : 'text-neutral-400'}`}
                >
                  {t.nav.services}
                </motion.button>
                
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  onClick={() => handleNavigation('work')}
                  className={`font-display text-4xl font-bold hover:text-umbrella-main transition-colors ${currentView === 'work' ? 'text-white' : 'text-neutral-400'}`}
                >
                  {t.nav.work}
                </motion.button>

                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.42 }}
                  onClick={() => handleNavigation('chronicles')}
                  className={`font-display text-4xl font-bold hover:text-umbrella-main transition-colors ${currentView === 'chronicles' ? 'text-white' : 'text-neutral-400'}`}
                >
                  {t.nav.chronicles}
                </motion.button>
                
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.45 }}
                  onClick={() => handleNavigation('workshop')}
                  className={`font-display text-4xl font-bold hover:text-umbrella-main transition-colors flex items-center gap-3 ${currentView === 'workshop' ? 'text-white' : 'text-neutral-400'}`}
                >
                  <Hammer size={24} /> {t.nav.forge}
                </motion.button>

                 <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  onClick={() => handleNavigation('contact')}
                  className={`font-display text-4xl font-bold hover:text-umbrella-main transition-colors ${currentView === 'contact' ? 'text-white' : 'text-neutral-400'}`}
                >
                  {t.nav.contact}
                </motion.button>
              
               {/* Mobile Language Switcher */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.55 }}
                >
                    <button onClick={toggleLanguage} className="flex items-center gap-3 text-2xl font-mono text-neutral-400 border border-white/10 px-6 py-2 rounded-full">
                       <Globe size={20} />
                       <span className={language === 'tr' ? 'text-umbrella-main' : ''}>TR</span>
                       /
                       <span className={language === 'en' ? 'text-umbrella-main' : ''}>EN</span>
                    </button>
                </motion.div>

              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                 onClick={() => {
                    setMobileMenuOpen(false);
                    openLetsTalk();
                 }}
                className="mt-4 bg-umbrella-main text-white px-8 py-4 rounded-full text-lg font-bold"
              >
                {t.nav.letsTalk}
              </motion.button>
              
               {/* Mobile Volume Toggle */}
               <button
                onClick={onToggleMute}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 ${isMuted ? 'border-white/10 text-neutral-500' : 'border-umbrella-main/50 text-umbrella-main'}`}
              >
                 {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                 <span className="text-sm font-medium">{isMuted ? "Unmute Audio" : "Mute Audio"}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
