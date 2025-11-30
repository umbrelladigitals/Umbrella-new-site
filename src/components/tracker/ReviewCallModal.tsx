'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Check, Calendar, Clock, MessageSquare, Zap, ChevronLeft } from 'lucide-react';

interface ReviewCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectTitle: string;
  language?: string;
}

const translations = {
  EN: {
    syncProtocol: "SYNC PROTOCOL",
    scheduleReview: "Schedule a Review",
    alignWithTeam: "Align with the team on the next steps, review deliverables, and plan the trajectory for the upcoming phases.",
    estDuration: "Est. Duration: 30-45 Min",
    meetingDetails: "Meeting Details",
    yourName: "Your Name",
    emailAddress: "Email Address",
    preferredDate: "Preferred Date & Time",
    topics: "Topics to Discuss",
    topicsPlaceholder: "Any specific items you want to cover?",
    requestMeeting: "Request Meeting",
    sending: "Sending...",
    requestReceived: "Request Received",
    requestReceivedMsg: "We've received your meeting request. Our team will coordinate the schedule and send you a calendar invite shortly.",
    returnToTracker: "Return to Tracker"
  },
  TR: {
    syncProtocol: "SENKRONİZASYON PROTOKOLÜ",
    scheduleReview: "Değerlendirme Planla",
    alignWithTeam: "Sonraki adımlar için ekiple hizalanın, teslimatları gözden geçirin ve gelecek aşamalar için rotayı planlayın.",
    estDuration: "Tahmini Süre: 30-45 Dk",
    meetingDetails: "Toplantı Detayları",
    yourName: "Adınız",
    emailAddress: "E-posta Adresi",
    preferredDate: "Tercih Edilen Tarih & Saat",
    topics: "Görüşülecek Konular",
    topicsPlaceholder: "Özellikle değinmek istediğiniz konular?",
    requestMeeting: "Toplantı Talep Et",
    sending: "Gönderiliyor...",
    requestReceived: "Talep Alındı",
    requestReceivedMsg: "Toplantı talebiniz alındı. Ekibimiz takvimi ayarlayıp size kısa süre içinde bir davetiye gönderecek.",
    returnToTracker: "Takip Ekranına Dön"
  }
}

const ReviewCallModal: React.FC<ReviewCallModalProps> = ({ isOpen, onClose, projectTitle, language = 'EN' }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const t = translations[language as keyof typeof translations] || translations.EN;

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    preferredDate: '',
    topics: ''
  });

  const handleSubmit = async () => {
    setLoading(true);
    try {
        const summary = `
Project: ${projectTitle}
Preferred Date/Time: ${formData.preferredDate}
Topics: ${formData.topics}
        `.trim();

        await fetch('/api/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: formData.name,
                email: formData.email,
                subject: `Review Call Request: ${projectTitle}`,
                summary: summary
            })
        });

        setIsSubmitted(true);
    } catch (error) {
        console.error("Failed to submit request", error);
    } finally {
        setLoading(false);
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
        className="relative w-full max-w-4xl bg-neutral-900/90 border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-black/50 flex flex-col md:flex-row min-h-[500px]"
      >
        {/* Decorative Noise */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none"></div>

        {/* LEFT SIDEBAR */}
        <div className="md:w-1/3 bg-black/40 border-r border-white/5 p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-umbrella-main mb-8">
              <Zap size={20} />
              <span className="font-mono text-xs tracking-widest uppercase">{t.syncProtocol}</span>
            </div>
            
            <h2 className="text-3xl font-display font-bold text-white mb-4">
              {t.scheduleReview}
            </h2>
            <p className="text-neutral-500 text-sm leading-relaxed">
              {t.alignWithTeam}
            </p>
          </div>

          <div className="relative z-10 mt-12 md:mt-0">
             <div className="flex items-center gap-4 text-neutral-400 text-sm">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                    <Clock size={14} />
                </div>
                <span>{t.estDuration}</span>
             </div>
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
            <div className="flex-1 flex flex-col justify-center">
                <h3 className="text-2xl font-display font-bold mb-8">{t.meetingDetails}</h3>
                
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">{t.yourName}</label>
                            <input 
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="w-full bg-transparent border-b border-white/20 py-3 text-lg text-white placeholder-white/20 focus:outline-none focus:border-umbrella-main transition-colors"
                                placeholder="John Doe"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">{t.emailAddress}</label>
                            <input 
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className="w-full bg-transparent border-b border-white/20 py-3 text-lg text-white placeholder-white/20 focus:outline-none focus:border-umbrella-main transition-colors"
                                placeholder="john@company.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">{t.preferredDate}</label>
                        <input 
                            value={formData.preferredDate}
                            onChange={(e) => setFormData({...formData, preferredDate: e.target.value})}
                            className="w-full bg-transparent border-b border-white/20 py-3 text-lg text-white placeholder-white/20 focus:outline-none focus:border-umbrella-main transition-colors"
                            placeholder="e.g. Next Tuesday afternoon"
                        />
                    </div>

                    <div className="space-y-2 pt-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">{t.topics}</label>
                        <textarea 
                            value={formData.topics}
                            onChange={(e) => setFormData({...formData, topics: e.target.value})}
                            rows={2}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-umbrella-main transition-colors resize-none"
                            placeholder={t.topicsPlaceholder}
                        />
                    </div>
                </div>

                <div className="pt-8 mt-8 border-t border-white/10 flex justify-end">
                    <button 
                        onClick={handleSubmit}
                        disabled={!formData.name || !formData.email || loading}
                        className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-umbrella-main hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-white/10 hover:shadow-red-900/40"
                    >
                        {loading ? t.sending : t.requestMeeting}
                        {!loading && <ArrowRight size={16} />}
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
              <h2 className="text-4xl font-display font-bold mb-4">{t.requestReceived}</h2>
              <p className="text-neutral-400 max-w-md mb-12 text-lg">
                {t.requestReceivedMsg}
              </p>
              <button 
                onClick={onClose}
                className="text-white border-b border-white/30 pb-1 hover:border-white hover:text-umbrella-main transition-colors"
              >
                {t.returnToTracker}
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ReviewCallModal;
