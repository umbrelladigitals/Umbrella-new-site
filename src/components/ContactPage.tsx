
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Phone, MapPin, Globe, Send, Clock, Linkedin, MonitorPlay } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import Select from './ui/Select';

const ContactPage: React.FC = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSent, setIsSent] = useState(false);
  const { t, language } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
        await fetch('/api/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formState)
        });
        
        setIsSent(true);
        setTimeout(() => setIsSent(false), 3000);
        setFormState({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
        console.error("Failed to send message", error);
    }
  };

  return (
    <div className="min-h-screen text-white pt-32 pb-20 relative">
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
             <span className="font-mono text-umbrella-main tracking-widest uppercase text-sm">{t.contact.header}</span>
          </motion.div>
          
          <h1 className="text-6xl md:text-9xl font-display font-black leading-[0.9] tracking-tighter mb-12">
            {t.contact.titleMain} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-600">{t.contact.titleSub}</span>
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32">
            
            {/* LEFT COLUMN: INFO & LOCATIONS */}
            <div className="space-y-24">
                
                {/* Big Links */}
                <div className="space-y-8">
                    <a href="mailto:hello@umbrelladigitals.com" className="block group">
                        <div className="text-sm text-neutral-500 mb-2 font-mono uppercase tracking-widest">{t.contact.general}</div>
                        <div className="text-xl md:text-3xl lg:text-3xl font-display font-bold border-b border-white/20 pb-4 group-hover:text-umbrella-main group-hover:border-umbrella-main transition-all duration-300 flex items-center justify-between break-all">
                            hello@umbrelladigitals.com
                            <ArrowRight className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 flex-shrink-0 ml-4" />
                        </div>
                    </a>
                    <a href="tel:+905413438192" className="block group">
                        <div className="text-sm text-neutral-500 mb-2 font-mono uppercase tracking-widest">{t.contact.direct}</div>
                        <div className="text-2xl md:text-4xl lg:text-5xl font-display font-bold border-b border-white/20 pb-4 group-hover:text-umbrella-main group-hover:border-umbrella-main transition-all duration-300 flex items-center justify-between">
                            +90 541 343 8192
                            <Phone className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                        </div>
                    </a>
                </div>

                {/* Locations */}
                <div>
                    <h3 className="text-2xl font-display font-bold mb-8 flex items-center gap-3">
                        <Globe size={24} className="text-umbrella-main" /> 
                        {t.contact.base}
                    </h3>
                    <div className="grid grid-cols-1 gap-8">
                        <LocationCard 
                          city={t.contact.locations.ankara.city} 
                          country={t.contact.locations.ankara.country} 
                          timezone="TRT" 
                          address={t.contact.locations.ankara.address} 
                          offset={3}
                        />
                        <LocationCard 
                          city={t.contact.locations.uk.city} 
                          country={t.contact.locations.uk.country} 
                          timezone="GMT" 
                          address={t.contact.locations.uk.address} 
                          offset={0}
                        />
                    </div>
                </div>

                 {/* Socials */}
                 <div className="flex flex-wrap gap-8 pt-8 border-t border-white/10">
                    <a href="https://www.linkedin.com/in/yunusakts/" target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-white font-mono text-sm uppercase tracking-wider hover:underline decoration-umbrella-main underline-offset-4 transition-all flex items-center gap-2">
                        <Linkedin size={16} /> LinkedIn
                    </a>
                    <a href="https://www.behance.net/yunusakts/projects" target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-white font-mono text-sm uppercase tracking-wider hover:underline decoration-umbrella-main underline-offset-4 transition-all flex items-center gap-2">
                        <MonitorPlay size={16} /> Behance
                    </a>
                 </div>
            </div>

            {/* RIGHT COLUMN: FORM */}
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="relative"
            >
                <div className="bg-neutral-900/50 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-sm">
                    <h3 className="text-3xl font-display font-bold mb-8">{t.contact.formTitle}</h3>
                    
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">{t.contact.name}</label>
                                <input 
                                    required
                                    type="text" 
                                    value={formState.name}
                                    onChange={(e) => setFormState({...formState, name: e.target.value})}
                                    className="w-full bg-black/20 border-b border-white/20 py-4 text-lg text-white placeholder-white/20 focus:outline-none focus:border-umbrella-main transition-colors"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">{t.contact.email}</label>
                                <input 
                                    required
                                    type="email" 
                                    value={formState.email}
                                    onChange={(e) => setFormState({...formState, email: e.target.value})}
                                    className="w-full bg-black/20 border-b border-white/20 py-4 text-lg text-white placeholder-white/20 focus:outline-none focus:border-umbrella-main transition-colors"
                                    placeholder="john@company.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Select 
                                label={t.contact.subject}
                                value={formState.subject}
                                onChange={(e) => setFormState({...formState, subject: e.target.value})}
                                options={[
                                    { value: "", label: t.contact.subjects.select },
                                    { value: "project", label: t.contact.subjects.project },
                                    { value: "career", label: t.contact.subjects.career },
                                    { value: "press", label: t.contact.subjects.press },
                                    { value: "other", label: t.contact.subjects.other }
                                ]}
                                className="!bg-black/20 !border-t-0 !border-x-0 !border-b !border-white/20 !rounded-none !px-0 !py-4 !text-lg !text-white focus:!border-umbrella-main hover:!border-umbrella-main/50"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">{t.contact.message}</label>
                            <textarea 
                                required
                                rows={5}
                                value={formState.message}
                                onChange={(e) => setFormState({...formState, message: e.target.value})}
                                className="w-full bg-black/20 border-b border-white/20 py-4 text-lg text-white placeholder-white/20 focus:outline-none focus:border-umbrella-main transition-colors resize-none"
                                placeholder="..."
                            />
                        </div>

                        <button 
                            type="submit"
                            className="w-full bg-white text-black font-bold py-5 rounded-xl hover:bg-umbrella-main hover:text-white transition-all duration-300 flex items-center justify-center gap-3 group"
                        >
                            {isSent ? t.contact.sent : t.contact.send}
                            {isSent ? <div className="w-2 h-2 bg-green-500 rounded-full"></div> : <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>
                </div>
                
                {/* Decor */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-umbrella-main/10 rounded-full blur-3xl pointer-events-none"></div>
            </motion.div>

        </div>
      </div>
    </div>
  );
};

const LocationCard: React.FC<{ city: string; country: string; timezone: string; address: string; offset: number }> = ({ city, country, timezone, address, offset }) => {
    const [time, setTime] = useState('');

    useEffect(() => {
        const updateTime = () => {
            const date = new Date();
            const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
            const localDate = new Date(utc + (3600000 * offset));
            
            setTime(localDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        };
        
        updateTime();
        const interval = setInterval(updateTime, 60000);
        return () => clearInterval(interval);
    }, [city, offset]);

    return (
        <div className="p-6 border border-white/10 rounded-xl bg-white/5 hover:border-umbrella-main/50 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h4 className="text-xl font-display font-bold text-white group-hover:text-umbrella-main transition-colors">{city}</h4>
                    <span className="text-sm text-neutral-500">{country}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 bg-black/30 px-2 py-1 rounded">
                    <Clock size={12} /> {time} {timezone}
                </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-neutral-400">
                <MapPin size={14} className="flex-shrink-0" />
                {address}
            </div>
        </div>
    )
}

export default ContactPage;
