'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

import Navbar from './Navbar';
import Footer from './Footer';
import VoiceAssistant from './VoiceAssistant';
import AudioExperience from './AudioExperience';
import IntroAnimation from './IntroAnimation';
import MagneticCursor from './MagneticCursor';
import LetsTalkModal from './LetsTalkModal';
import { useLanguage } from '@/context/LanguageContext';
import { useUI } from '@/context/UIContext';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isNeuralCoreActive, setIsNeuralCoreActive] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const pathname = usePathname();
  const router = useRouter();
  const { language } = useLanguage();
  const { isLetsTalkOpen, closeLetsTalk } = useUI();

  // Determine current view based on path
  const getCurrentView = (path: string) => {
    if (path === '/') return 'home';
    if (path.includes('/services') || path.includes('/hizmetler')) return 'services';
    if (path.includes('/workshop') || path.includes('/atolye')) return 'workshop';
    if (path.includes('/work') || path.includes('/projeler')) return 'work';
    if (path.includes('/contact') || path.includes('/iletisim')) return 'contact';
    if (path.includes('/manifesto')) return 'manifesto';
    if (path.includes('/team') || path.includes('/ekip')) return 'team';
    if (path.includes('/privacy') || path.includes('/gizlilik')) return 'privacy';
    if (path.includes('/terms') || path.includes('/sartlar')) return 'terms';
    return 'home';
  };

  const currentView = getCurrentView(pathname);
  const isAdmin = pathname?.startsWith('/admin');
  const isProposal = pathname?.startsWith('/proposal');
  const isTracker = pathname?.startsWith('/tracker');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (view: string) => {
    let path = '/';
    // Simple mapping logic - can be expanded
    if (language === 'en') {
        if (view === 'home') path = '/';
        else path = `/${view}`;
    } else {
        if (view === 'home') path = '/';
        else if (view === 'services') path = '/hizmetler';
        else if (view === 'work') path = '/projeler';
        else if (view === 'workshop') path = '/atolye';
        else if (view === 'contact') path = '/iletisim';
        else if (view === 'manifesto') path = '/manifesto-tr';
        else if (view === 'team') path = '/ekip';
        else if (view === 'privacy') path = '/privacy';
        else if (view === 'terms') path = '/terms';
    }
    router.push(path);
  };

  return (
    <div className="bg-neutral-950 min-h-screen text-white selection:bg-umbrella-main selection:text-white relative overflow-x-hidden cursor-none">
      
      {/* CUSTOM MAGNETIC CURSOR */}
      <MagneticCursor />

      {/* SYSTEM BOOT INTRO */}
      <AnimatePresence mode="wait">
        {showIntro && (
            <IntroAnimation onComplete={() => setShowIntro(false)} />
        )}
      </AnimatePresence>

      {/* GLOBAL SONIC BRANDING ENGINE */}
      <AudioExperience isMuted={isMuted} />

      {/* LIVING ATMOSPHERE BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Roaming Aurora Orb 1 */}
        <motion.div 
            animate={{ 
                x: [0, 100, -50, 0], 
                y: [0, -50, 50, 0],
                scale: [1, 1.2, 0.9, 1],
                opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-10%] right-[-10%] w-[70vw] h-[70vw] bg-umbrella-main/10 rounded-full blur-[120px]" 
        />
        
        {/* Roaming Aurora Orb 2 */}
        <motion.div 
            animate={{ 
                x: [0, -100, 50, 0], 
                y: [0, 100, -50, 0],
                scale: [1, 1.5, 0.8, 1],
                opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 2 }}
            className="absolute bottom-[-10%] left-[-20%] w-[80vw] h-[80vw] bg-blue-900/10 rounded-full blur-[150px]" 
        />

        {/* Roaming Aurora Orb 3 (Accent) */}
         <motion.div 
            animate={{ 
                x: [0, 200, -200, 0], 
                y: [0, 200, -200, 0],
            }}
            transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[40%] left-[30%] w-[40vw] h-[40vw] bg-purple-900/10 rounded-full blur-[100px]" 
        />

        {/* Grain Noise Overlay - High Contrast */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay"></div>
      </div>

      {/* HOLOGRAPHIC SYSTEM OVERLAY (Active when Voice Assistant is On) */}
      <AnimatePresence>
        {isNeuralCoreActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[40] pointer-events-none mix-blend-screen"
          >
             {/* CRT Scanlines */}
             <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none" />
             {/* Red Vignette */}
             <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_60%,rgba(225,29,72,0.15)_100%)] z-20 pointer-events-none" />
             {/* Screen Flicker Animation */}
             <div className="absolute inset-0 bg-white/5 animate-pulse opacity-5 z-30 pointer-events-none" />
          </motion.div>
        )}
      </AnimatePresence>
      
      {!showIntro && (
        <>
            {!isAdmin && !isProposal && !isTracker && (
              <Navbar 
                  isMuted={isMuted}
                  onToggleMute={() => setIsMuted(!isMuted)}
              />
            )}
            
            <main className="relative z-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={pathname}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Voice Assistant Integration with Navigation & State Control */}
            {!isAdmin && !isProposal && !isTracker && (
              <VoiceAssistant 
                  onNavigate={handleNavigate} 
                  currentView={currentView}
                  onStateChange={setIsNeuralCoreActive}
              />
            )}

            {!isAdmin && !isProposal && !isTracker && <Footer onNavigate={handleNavigate} />}

            <AnimatePresence>
                {showScrollTop && !isAdmin && !isProposal && !isTracker && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 z-50 bg-white text-black p-3 rounded-full shadow-lg shadow-white/20 hover:bg-umbrella-main hover:text-white transition-colors duration-300"
                >
                    <ArrowUp size={24} />
                </motion.button>
                )}
            </AnimatePresence>

            {/* Global Modal */}
            <AnimatePresence>
                {isLetsTalkOpen && !isAdmin && !isProposal && !isTracker && (
                <LetsTalkModal isOpen={isLetsTalkOpen} onClose={closeLetsTalk} />
                )}
            </AnimatePresence>
        </>
      )}
    </div>
  );
}
