
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Check, Rocket, MessageSquare, Zap, Briefcase, Clock, DollarSign, ChevronLeft } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface LetsTalkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LetsTalkModal: React.FC<LetsTalkModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { t } = useLanguage();
  
  // Steps Data
  const STEPS = [
    { id: 'objective', title: t.letsTalkModal.steps.objective },
    { id: 'details', title: t.letsTalkModal.steps.details },
    { id: 'contact', title: t.letsTalkModal.steps.contact }
  ];

  // Form State
  const [formData, setFormData] = useState({
    objective: '',
    budget: '',
    timeline: '',
    name: '',
    email: '',
    details: ''
  });

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setDirection(1);
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
        const summary = `
Objective: ${formData.objective}
Budget: ${formData.budget}
Timeline: ${formData.timeline}
Details: ${formData.details}
        `.trim();

        await fetch('/api/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: formData.name,
                email: formData.email,
                subject: `Project Inquiry: ${formData.objective}`,
                summary: summary
            })
        });

        setIsSubmitted(true);
    } catch (error) {
        console.error("Failed to submit inquiry", error);
    }
  };

  // Animation Variants
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0
    })
  };
  
  // Icon Mapping Helper
  const getIcon = (id: string) => {
      switch(id) {
          case 'project': return <Rocket />;
          case 'retainer': return <Briefcase />;
          case 'general': return <MessageSquare />;
          default: return <Rocket />;
      }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
      
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-neutral-950/80 backdrop-blur-xl"
      />

      {/* Modal Container */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-4xl bg-neutral-900/90 border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-black/50 flex flex-col md:flex-row min-h-[600px]"
      >
        {/* Decorative Noise */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none"></div>

        {/* LEFT SIDEBAR (Progress & Info) */}
        <div className="md:w-1/3 bg-black/40 border-r border-white/5 p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-umbrella-main mb-8">
              <Zap size={20} />
              <span className="font-mono text-xs tracking-widest uppercase">{t.letsTalkModal.sidebar.protocol}</span>
            </div>
            
            <h2 className="text-3xl font-display font-bold text-white mb-2">
              {t.letsTalkModal.sidebar.title}
            </h2>
            <p className="text-neutral-500 text-sm leading-relaxed">
              {t.letsTalkModal.sidebar.desc}
            </p>
          </div>

          {/* Steps Indicator */}
          <div className="relative z-10 space-y-6 mt-12 md:mt-0">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-all duration-300 ${
                  index === currentStep 
                    ? 'bg-umbrella-main border-umbrella-main text-white' 
                    : index < currentStep 
                      ? 'bg-green-500/20 border-green-500 text-green-500'
                      : 'border-white/10 text-neutral-600'
                }`}>
                  {index < currentStep ? <Check size={14} /> : index + 1}
                </div>
                <span className={`text-sm font-medium transition-colors duration-300 ${
                  index === currentStep ? 'text-white' : 'text-neutral-600'
                }`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>

          {/* Red Glow Decor */}
          <div className="absolute bottom-[-50%] left-[-50%] w-full h-full bg-umbrella-main/10 blur-[80px] rounded-full pointer-events-none"></div>
        </div>

        {/* RIGHT CONTENT AREA */}
        <div className="flex-1 p-8 md:p-12 relative flex flex-col">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-neutral-500 hover:text-white transition-colors z-50"
          >
            <X size={24} />
          </button>

          {!isSubmitted ? (
            <div className="flex-1 flex flex-col">
              <div className="flex-1 relative">
                <AnimatePresence custom={direction} mode="wait">
                  
                  {/* STEP 1: OBJECTIVE */}
                  {currentStep === 0 && (
                    <motion.div
                      key="step1"
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0 flex flex-col justify-center"
                    >
                      <h3 className="text-2xl font-display font-bold mb-8">{t.letsTalkModal.step1.title}</h3>
                      <div className="grid grid-cols-1 gap-4">
                        {t.letsTalkModal.step1.options.map((option) => (
                          <button
                            key={option.id}
                            onClick={() => setFormData({...formData, objective: option.id})}
                            className={`group flex items-center gap-6 p-6 rounded-2xl border text-left transition-all duration-300 ${
                              formData.objective === option.id 
                                ? 'bg-white text-black border-white shadow-lg' 
                                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-neutral-300'
                            }`}
                          >
                            <div className={`p-3 rounded-full transition-colors ${
                              formData.objective === option.id ? 'bg-black text-white' : 'bg-black/30 text-white'
                            }`}>
                              {getIcon(option.id)}
                            </div>
                            <div>
                              <div className="font-bold text-lg">{option.label}</div>
                              <div className={`text-sm ${formData.objective === option.id ? 'text-neutral-600' : 'text-neutral-500'}`}>
                                {option.desc}
                              </div>
                            </div>
                            <div className={`ml-auto w-4 h-4 rounded-full border transition-colors ${
                              formData.objective === option.id ? 'border-black bg-black' : 'border-neutral-500'
                            }`} />
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2: DETAILS */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step2"
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0 flex flex-col justify-center"
                    >
                      <h3 className="text-2xl font-display font-bold mb-8">{t.letsTalkModal.step2.title}</h3>
                      
                      <div className="space-y-8">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-4 flex items-center gap-2">
                            <DollarSign size={14}/> {t.letsTalkModal.step2.budgetLabel}
                          </label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {t.letsTalkModal.step2.budgetOptions.map(b => (
                              <button
                                key={b}
                                onClick={() => setFormData({...formData, budget: b})}
                                className={`py-3 px-4 rounded-lg border text-sm font-medium transition-all ${
                                  formData.budget === b 
                                    ? 'bg-umbrella-main border-umbrella-main text-white' 
                                    : 'bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10'
                                }`}
                              >
                                {b}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                           <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-4 flex items-center gap-2">
                            <Clock size={14}/> {t.letsTalkModal.step2.timelineLabel}
                          </label>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {t.letsTalkModal.step2.timelineOptions.map(t_opt => (
                              <button
                                key={t_opt}
                                onClick={() => setFormData({...formData, timeline: t_opt})}
                                className={`py-3 px-4 rounded-lg border text-sm font-medium transition-all ${
                                  formData.timeline === t_opt 
                                    ? 'bg-white border-white text-black' 
                                    : 'bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10'
                                }`}
                              >
                                {t_opt}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3: CONTACT */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step3"
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0 flex flex-col justify-center"
                    >
                      <h3 className="text-2xl font-display font-bold mb-8">{t.letsTalkModal.step3.title}</h3>
                      
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">{t.letsTalkModal.step3.nameLabel}</label>
                              <input 
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="w-full bg-transparent border-b border-white/20 py-3 text-xl text-white placeholder-white/20 focus:outline-none focus:border-umbrella-main transition-colors"
                                placeholder={t.letsTalkModal.step3.namePlaceholder}
                              />
                           </div>
                           <div className="space-y-2">
                              <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">{t.letsTalkModal.step3.emailLabel}</label>
                              <input 
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className="w-full bg-transparent border-b border-white/20 py-3 text-xl text-white placeholder-white/20 focus:outline-none focus:border-umbrella-main transition-colors"
                                placeholder={t.letsTalkModal.step3.emailPlaceholder}
                              />
                           </div>
                        </div>

                        <div className="space-y-2 pt-4">
                           <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">{t.letsTalkModal.step3.detailsLabel}</label>
                           <textarea 
                              value={formData.details}
                              onChange={(e) => setFormData({...formData, details: e.target.value})}
                              rows={3}
                              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-umbrella-main transition-colors resize-none"
                              placeholder={t.letsTalkModal.step3.detailsPlaceholder}
                           />
                        </div>
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>

              {/* Actions Footer */}
              <div className="pt-8 mt-4 border-t border-white/10 flex items-center justify-between">
                {currentStep > 0 ? (
                   <button 
                    onClick={handleBack}
                    className="text-neutral-500 hover:text-white transition-colors flex items-center gap-2"
                   >
                     <ChevronLeft size={16} /> {t.letsTalkModal.buttons.back}
                   </button>
                ) : <div />}

                <button 
                  onClick={handleNext}
                  disabled={
                    (currentStep === 0 && !formData.objective) || 
                    (currentStep === 1 && (!formData.budget || !formData.timeline)) ||
                    (currentStep === 2 && (!formData.name || !formData.email))
                  }
                  className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-umbrella-main hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-white/10 hover:shadow-red-900/40"
                >
                  {currentStep === STEPS.length - 1 ? t.letsTalkModal.buttons.launch : t.letsTalkModal.buttons.next}
                  {currentStep === STEPS.length - 1 ? <Rocket size={16} /> : <ArrowRight size={16} />}
                </button>
              </div>
            </div>
          ) : (
            /* SUCCESS STATE */
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col items-center justify-center text-center"
            >
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(34,197,94,0.4)]">
                <Check size={48} className="text-black" />
              </div>
              <h2 className="text-4xl font-display font-bold mb-4">{t.letsTalkModal.success.title}</h2>
              <p className="text-neutral-400 max-w-md mb-12 text-lg">
                {t.letsTalkModal.success.desc}
              </p>
              <button 
                onClick={onClose}
                className="text-white border-b border-white/30 pb-1 hover:border-white hover:text-umbrella-main transition-colors"
              >
                {t.letsTalkModal.buttons.return}
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default LetsTalkModal;
