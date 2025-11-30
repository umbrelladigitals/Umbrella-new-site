
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Hammer, Cpu, Send, Palette, Mic2, Lightbulb, ChevronRight, Activity, Signal, Lock, Terminal, Database, Fingerprint, Globe, Megaphone, Layout, Layers, Box } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { useLanguage } from '@/context/LanguageContext';

// --- Types & Configuration ---

type ForgeMode = 'IDENTITY' | 'WEB' | 'GROWTH' | null;

// Dynamic Options based on Mode
const STYLE_OPTIONS = {
    IDENTITY: ["Minimalist", "Heritage", "Rebellious", "Futuristic", "Luxury", "Playful"],
    WEB: ["Editorial", "Brutalist", "SaaS/Clean", "Immersive 3D", "E-Commerce", "Dark Mode"],
    GROWTH: ["Aggressive", "Educational", "Viral/Meme", "Premium", "Community-Led", "Data-Driven"]
};

const STRUCTURE_OPTIONS = {
    IDENTITY: ["The Hero", "The Sage", "The Creator", "The Ruler", "The Explorer", "The Outlaw"], // Archetypes
    WEB: ["Landing Page", "Corporate Site", "Web App (SaaS)", "E-Commerce", "Portfolio", "Portal"], // Site Types
    GROWTH: ["Social Media", "SEO/Content", "Paid Ads", "Email Drip", "Influencer", "Guerrilla"] // Channels
};

const WorkshopPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [mode, setMode] = useState<ForgeMode>(null);
  const { t } = useLanguage();
  
  // Form State
  const [formData, setFormData] = useState({
    brief: "",
    style: [] as string[],
    structure: [] as string[], // Archetype / Type / Channel
  });
  
  const [contactForm, setContactForm] = useState({ name: "", email: "", phone: "" });
  const [aiResult, setAiResult] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isSent, setIsSent] = useState(false);

  // --- Dynamic Mode Data ---
  const FORGE_MODES = [
    { 
        id: 'IDENTITY', 
        title: t.workshop.modes[0].title, 
        icon: <Fingerprint size={32} />,
        desc: t.workshop.modes[0].desc,
        color: 'from-red-500 to-orange-600'
    },
    { 
        id: 'WEB', 
        title: t.workshop.modes[1].title, 
        icon: <Globe size={32} />,
        desc: t.workshop.modes[1].desc,
        color: 'from-blue-500 to-cyan-600'
    },
    { 
        id: 'GROWTH', 
        title: t.workshop.modes[2].title, 
        icon: <Megaphone size={32} />,
        desc: t.workshop.modes[2].desc,
        color: 'from-green-500 to-emerald-600'
    }
  ];

  // Reset form when mode changes
  const selectMode = (newMode: ForgeMode) => {
      setMode(newMode);
      setFormData({ brief: "", style: [], structure: [] });
      setCurrentStep(1); // Advance to input
  };
  
  // Gemini Streaming Integration
  const generateBlueprint = async () => {
    if (!mode) return;
    
    setIsStreaming(true);
    setAiResult("");
    setCurrentStep(3); // Move to result step

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        let systemPrompt = "";
        
        if (mode === 'IDENTITY') {
            systemPrompt = `Act as a World-Class Brand Strategist. Create a "Brand Identity Protocol" for a client described as: "${formData.brief}". 
            Brand Archetype: ${formData.structure.join(", ")}. Visual Style: ${formData.style.join(", ")}.
            Output Format (Markdown):
            ## Brand Essence (The Soul)
            ## Visual Identity System (Colors, Typography, Imagery)
            ## Tone of Voice Protocol`;
        } else if (mode === 'WEB') {
            systemPrompt = `Act as a UX Architect & Technical Director. Create a "Digital Experience Blueprint" for a web project described as: "${formData.brief}". 
            Project Type: ${formData.structure.join(", ")}. Design Language: ${formData.style.join(", ")}.
            Output Format (Markdown):
            ## UX Core Concept (The Hook)
            ## Information Architecture & Key Features
            ## UI/Visual Direction & Interaction Model`;
        } else {
            systemPrompt = `Act as a Growth Hacker. Create a "Market Penetration Strategy" for a campaign described as: "${formData.brief}". 
            Primary Channel: ${formData.structure.join(", ")}. Campaign Vibe: ${formData.style.join(", ")}.
            Output Format (Markdown):
            ## Campaign Hook (The Big Idea)
            ## Strategic Rollout Plan
            ## Key Performance Indicators (Success Metrics)`;
        }

        const responseStream = await ai.models.generateContentStream({
            model: 'gemini-2.5-flash',
            contents: systemPrompt,
        });

        for await (const chunk of responseStream) {
            const text = chunk.text;
            if (text) {
                setAiResult(prev => prev + text);
            }
        }
    } catch (error) {
        console.error("AI Error:", error);
        setAiResult("Connection to the Neural Core interrupted. Please try again.");
    } finally {
        setIsStreaming(false);
    }
  };

  const nextStep = () => {
      setCurrentStep(prev => prev + 1);
  };

  const toggleSelection = (category: 'style' | 'structure', item: string) => {
    setFormData(prev => {
      const current = prev[category];
      if (current.includes(item)) {
        return { ...prev, [category]: current.filter(i => i !== item) };
      } else {
        if (current.length >= 2) return prev; // Max 2 selections
        return { ...prev, [category]: [...current, item] };
      }
    });
  };

  const handleTransmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsStreaming(true);

      const messageBody = `
FORGE PROTOCOL INITIATED
Mode: ${mode}

BRIEF:
${formData.brief}

PARAMETERS:
Structure: ${formData.structure.join(', ')}
Style: ${formData.style.join(', ')}

BLUEPRINT GENERATED:
${aiResult}
      `.trim();

      try {
        const response = await fetch('/api/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: contactForm.name,
                email: contactForm.email,
                phone: contactForm.phone,
                subject: `Forge Request: ${mode}`,
                summary: messageBody,
                message: messageBody // Fallback for API route logic
            }),
        });

        if (response.ok) {
            setIsSent(true);
        } else {
            console.error("Transmission failed");
            // Optional: Handle error UI
        }
      } catch (error) {
          console.error("Transmission error:", error);
      } finally {
          setIsStreaming(false);
      }
  }

  // Helper to get labels based on mode
  const getBriefTitle = () => {
      if (mode === 'IDENTITY') return t.workshop.steps.briefTitleIdentity;
      if (mode === 'WEB') return t.workshop.steps.briefTitleWeb;
      return t.workshop.steps.briefTitleGrowth;
  }
  const getBriefDesc = () => {
      if (mode === 'IDENTITY') return t.workshop.steps.briefDescIdentity;
      if (mode === 'WEB') return t.workshop.steps.briefDescWeb;
      return t.workshop.steps.briefDescGrowth;
  }
  const getStructureLabel = () => {
      if (mode === 'IDENTITY') return t.workshop.steps.structureLabelIdentity;
      if (mode === 'WEB') return t.workshop.steps.structureLabelWeb;
      return t.workshop.steps.structureLabelGrowth;
  }
  const getStyleLabel = () => {
      if (mode === 'IDENTITY') return t.workshop.steps.styleLabelIdentity;
      if (mode === 'WEB') return t.workshop.steps.styleLabelWeb;
      return t.workshop.steps.styleLabelGrowth;
  }


  return (
    <div className="min-h-screen text-white relative pt-32 pb-20 overflow-hidden">
      


      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header */}
        <header className="mb-16 md:mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-4 mb-8"
          >
             <div className="h-[1px] w-12 bg-umbrella-main"></div>
             <span className="font-mono text-umbrella-main tracking-widest uppercase text-sm">{t.workshop.header.subtitle}</span>
          </motion.div>
          
          <h1 className="text-6xl md:text-9xl font-display font-black leading-[0.9] tracking-tighter mb-12">
            {t.workshop.header.titleMain} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-600">{t.workshop.header.titleSub}</span>
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
            
            {/* LEFT COLUMN: WORKSPACE */}
            <div className="lg:col-span-7 min-h-[60vh]">
                <AnimatePresence mode="wait">
                    
                    {/* STEP 0: MODE SELECTION */}
                    {currentStep === 0 && (
                        <motion.div 
                            key="mode"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <h2 className="text-4xl font-display font-bold mb-8">{t.workshop.steps.select}</h2>
                            <div className="grid grid-cols-1 gap-6">
                                {FORGE_MODES.map((m) => (
                                    <button
                                        key={m.id}
                                        onClick={() => selectMode(m.id as ForgeMode)}
                                        className="group relative overflow-hidden bg-white/5 border border-white/10 hover:border-white/30 rounded-2xl p-8 text-left transition-all duration-300 hover:bg-white/10 backdrop-blur-sm"
                                    >
                                        <div className={`absolute inset-0 bg-gradient-to-r ${m.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                                        <div className="flex items-start justify-between relative z-10">
                                            <div className="flex items-center gap-6">
                                                <div className="p-4 bg-black/40 rounded-xl text-white border border-white/10 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                                    {m.icon}
                                                </div>
                                                <div>
                                                    <h3 className="text-2xl font-display font-bold mb-2">{m.title}</h3>
                                                    <p className="text-neutral-400 font-light">{m.desc}</p>
                                                </div>
                                            </div>
                                            <ArrowRight className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-white" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 1: BRIEFING */}
                    {currentStep === 1 && mode && (
                        <motion.div 
                            key="brief"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <button onClick={() => setCurrentStep(0)} className="text-neutral-500 hover:text-white transition-colors text-sm uppercase tracking-widest font-mono">{t.workshop.steps.changeProtocol}</button>
                                <div className="h-[1px] flex-1 bg-white/10"></div>
                                <span className="text-umbrella-main font-bold font-mono">{t.workshop.steps.phase1}</span>
                            </div>

                            <h3 className="text-3xl font-display font-bold mb-2">
                                {getBriefTitle()}
                            </h3>
                            <p className="text-neutral-400 mb-8 font-light">
                                {getBriefDesc()}
                            </p>

                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-white/10 to-neutral-800 rounded-3xl opacity-20 group-focus-within:opacity-50 transition duration-500 blur"></div>
                                <textarea 
                                    value={formData.brief}
                                    onChange={(e) => setFormData({...formData, brief: e.target.value})}
                                    placeholder={t.workshop.steps.placeholder}
                                    className="relative w-full h-64 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-xl font-mono text-white placeholder-neutral-600 focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all resize-none leading-relaxed shadow-2xl"
                                    autoFocus
                                />
                            </div>

                            <div className="flex justify-end mt-8">
                                <button 
                                    onClick={nextStep}
                                    disabled={formData.brief.length < 10}
                                    className="px-10 py-4 rounded-full bg-white text-black font-bold hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 font-display tracking-wide"
                                >
                                    {t.workshop.steps.nextButton} <ChevronRight size={18} />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: PARAMETERS (Structure & Style) */}
                    {currentStep === 2 && mode && (
                        <motion.div 
                            key="params"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                             <div className="flex items-center gap-4 mb-8">
                                <button onClick={() => setCurrentStep(1)} className="text-neutral-500 hover:text-white transition-colors text-sm uppercase tracking-widest font-mono">{t.workshop.steps.backButton}</button>
                                <div className="h-[1px] flex-1 bg-white/10"></div>
                                <span className="text-umbrella-main font-bold font-mono">{t.workshop.steps.phase2}</span>
                            </div>

                            {/* Structure Selection */}
                            <div className="mb-12">
                                <h3 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
                                    {mode === 'IDENTITY' ? <Layout size={20}/> : mode === 'WEB' ? <Layers size={20}/> : <Activity size={20}/>}
                                    {getStructureLabel()}
                                    <span className="text-xs text-neutral-500 font-mono ml-2 font-normal">(Select up to 2)</span>
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {STRUCTURE_OPTIONS[mode].map(opt => (
                                        <button
                                            key={opt}
                                            onClick={() => toggleSelection('structure', opt)}
                                            className={`px-6 py-3 rounded-full border text-sm font-bold uppercase tracking-wide transition-all font-display ${
                                                formData.structure.includes(opt) 
                                                ? 'bg-umbrella-main border-umbrella-main text-white shadow-[0_0_20px_rgba(225,29,72,0.4)] scale-105' 
                                                : 'bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10 hover:text-white hover:border-white/30'
                                            }`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Style Selection */}
                            <div className="mb-12">
                                <h3 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
                                    <Palette size={20}/>
                                    {getStyleLabel()}
                                    <span className="text-xs text-neutral-500 font-mono ml-2 font-normal">(Select up to 2)</span>
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {STYLE_OPTIONS[mode].map(opt => (
                                        <button
                                            key={opt}
                                            onClick={() => toggleSelection('style', opt)}
                                            className={`px-6 py-3 rounded-full border text-sm font-bold uppercase tracking-wide transition-all font-display ${
                                                formData.style.includes(opt) 
                                                ? 'bg-white border-white text-black shadow-[0_0_20px_rgba(255,255,255,0.4)] scale-105' 
                                                : 'bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10 hover:text-white hover:border-white/30'
                                            }`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end mt-8">
                                <button 
                                    onClick={generateBlueprint}
                                    disabled={formData.style.length === 0 || formData.structure.length === 0}
                                    className="px-10 py-4 rounded-full bg-gradient-to-r from-umbrella-main to-red-800 text-white font-bold hover:shadow-lg hover:shadow-red-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 font-display tracking-wide"
                                >
                                    {t.workshop.steps.synthesisButton} <Cpu size={18} />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: BLUEPRINT RESULT */}
                    {currentStep === 3 && (
                         <motion.div 
                            key="result"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-neutral-900/80 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-12 min-h-[60vh] relative overflow-hidden shadow-2xl"
                        >
                            <div className="absolute top-0 right-0 p-6 opacity-20">
                                <Database size={64} />
                            </div>
                            
                            <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-4">
                                <div className={`p-2 rounded-lg bg-gradient-to-br ${mode && FORGE_MODES.find(m => m.id === mode)?.color}`}>
                                    {mode === 'IDENTITY' ? <Fingerprint size={24}/> : mode === 'WEB' ? <Globe size={24}/> : <Megaphone size={24}/>}
                                </div>
                                <div>
                                    <h2 className="text-sm font-mono text-neutral-400 uppercase tracking-widest">{t.workshop.steps.blueprintGenerated}</h2>
                                    <div className="text-xl font-bold text-white">{mode && FORGE_MODES.find(m => m.id === mode)?.title}</div>
                                </div>
                            </div>

                            <div className="prose prose-invert prose-lg max-w-none prose-headings:font-display prose-headings:text-white prose-p:text-neutral-300 prose-strong:text-umbrella-main">
                                {aiResult.split('\n').map((line, i) => {
                                    if (line.startsWith('## ')) return <h3 key={i} className="text-2xl font-bold mt-8 mb-4 text-white border-b border-white/10 pb-2 flex items-center gap-2"><Box size={18} className="text-umbrella-main"/> {line.replace('## ', '')}</h3>;
                                    return <p key={i} className="mb-2 leading-relaxed font-light">{line}</p>;
                                })}
                            </div>
                            {isStreaming && (
                                <div className="flex items-center gap-2 mt-4 text-umbrella-main font-mono text-sm animate-pulse">
                                    <span className="w-2 h-2 bg-umbrella-main rounded-full"></span>
                                    {t.workshop.steps.synthesizing}
                                </div>
                             )}
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
            
            {/* RIGHT COLUMN: TELEMETRY SIDEBAR */}
            <div className="lg:col-span-5">
                <div className="sticky top-32">
                    <AnimatePresence mode="wait">
                        {currentStep < 3 ? (
                            <motion.div 
                                key="telemetry"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 font-mono text-sm shadow-2xl relative overflow-hidden"
                            >
                                {/* Noise Overlay for Card */}
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none"></div>

                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-6">
                                        <div>
                                            <span className="text-umbrella-main font-display font-bold text-2xl tracking-tight block">ALCHEMY CORE</span>
                                            <span className="text-[10px] text-neutral-500 tracking-[0.2em] uppercase">System Status</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                                            <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                            </span>
                                            <span className="tracking-widest text-[10px] font-bold">ONLINE</span>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {/* Active Module Indicator */}
                                        <div className="p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors group">
                                            <div className="text-neutral-500 text-[10px] uppercase tracking-widest mb-3 flex items-center gap-2">
                                                <Activity size={12} /> Active Rune
                                            </div>
                                            <div className="text-white font-bold text-xl flex items-center gap-3 font-display">
                                                {mode ? (
                                                    <>
                                                        <div className={`p-2 rounded-lg bg-gradient-to-br ${FORGE_MODES.find(m => m.id === mode)?.color} text-white shadow-lg`}>
                                                            {mode === 'IDENTITY' ? <Fingerprint size={18}/> : 
                                                            mode === 'WEB' ? <Globe size={18}/> : 
                                                            <Megaphone size={18}/>}
                                                        </div>
                                                        {FORGE_MODES.find(m => m.id === mode)?.title}
                                                    </>
                                                ) : (
                                                    <span className="text-neutral-600 italic text-sm font-mono">AWAITING INPUT</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Brief Preview */}
                                        <div className="p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                                            <div className="text-neutral-500 text-[10px] uppercase tracking-widest mb-3 flex items-center gap-2">
                                                <Signal size={12} /> Intent Stream
                                            </div>
                                            <div className="text-white/80 text-sm font-light leading-relaxed line-clamp-3">
                                                {formData.brief ? formData.brief : <span className="text-neutral-700 italic">--</span>}
                                            </div>
                                        </div>

                                        {/* Configuration Grid */}
                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                                                <div className="text-neutral-500 text-[10px] uppercase tracking-widest mb-3 flex items-center gap-2">
                                                    <Layout size={12} /> Archetype Matrix
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {formData.structure.length > 0 ? formData.structure.map(s => (
                                                        <span key={s} className="text-[10px] font-bold border border-white/10 px-3 py-1 rounded-full text-neutral-300 bg-white/5 uppercase tracking-wide">{s}</span>
                                                    )) : <span className="text-neutral-700 italic text-xs">--</span>}
                                                </div>
                                            </div>
                                            <div className="p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                                                <div className="text-neutral-500 text-[10px] uppercase tracking-widest mb-3 flex items-center gap-2">
                                                    <Palette size={12} /> Aesthetic Vector
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {formData.style.length > 0 ? formData.style.map(s => (
                                                        <span key={s} className="text-[10px] font-bold border border-white/10 px-3 py-1 rounded-full text-neutral-300 bg-white/5 uppercase tracking-wide">{s}</span>
                                                    )) : <span className="text-neutral-700 italic text-xs">--</span>}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="pt-6 border-t border-white/5 text-neutral-600 text-[10px] flex justify-between items-center font-mono mt-4">
                                            <span className="flex items-center gap-2"><Terminal size={10} /> RITUAL_ID: {Math.floor(Math.random() * 100000)}</span>
                                            <span className="opacity-50">V.2.5.0</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="contact"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-umbrella-main text-white rounded-xl p-8 shadow-2xl shadow-red-900/50 relative overflow-hidden"
                            >
                                {/* Background texture */}
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>

                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-6 text-white/80 font-mono text-sm tracking-widest border-b border-white/20 pb-4">
                                        <Signal size={16} /> {t.workshop.telemetry.uplinkReady}
                                    </div>

                                    {!isSent ? (
                                        <form onSubmit={handleTransmit} className="space-y-4">
                                            <h3 className="text-2xl font-display font-bold mb-2">{t.workshop.telemetry.executeTitle}</h3>
                                            <p className="text-white/70 text-sm mb-6">{t.workshop.telemetry.executeDesc}</p>
                                            
                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-80">{t.workshop.telemetry.agentName}</label>
                                                <input 
                                                    required
                                                    type="text" 
                                                    placeholder="Identify Yourself"
                                                    value={contactForm.name}
                                                    onChange={e => setContactForm({...contactForm, name: e.target.value})}
                                                    className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 placeholder-white/40 focus:outline-none focus:bg-black/30 transition-colors"
                                                />
                                            </div>
                                             <div>
                                                <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-80">{t.workshop.telemetry.commsFreq}</label>
                                                <input 
                                                    required
                                                    type="email" 
                                                    placeholder="Email Address"
                                                    value={contactForm.email}
                                                    onChange={e => setContactForm({...contactForm, email: e.target.value})}
                                                    className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 placeholder-white/40 focus:outline-none focus:bg-black/30 transition-colors"
                                                />
                                            </div>

                                            <button 
                                                type="submit"
                                                disabled={isStreaming}
                                                className="w-full bg-white text-umbrella-main font-bold py-4 rounded-lg mt-4 hover:bg-neutral-100 transition-colors flex items-center justify-center gap-2"
                                            >
                                                {t.workshop.telemetry.transmitButton} <Send size={18} />
                                            </button>
                                        </form>
                                    ) : (
                                        <motion.div 
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="text-center py-12"
                                        >
                                            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                                <Lock size={40} className="text-white" />
                                            </div>
                                            <h3 className="text-2xl font-bold mb-4">{t.workshop.telemetry.secureTitle}</h3>
                                            <p className="text-white/80">{t.workshop.telemetry.secureDesc}</p>
                                            <button onClick={() => window.location.reload()} className="mt-8 text-sm font-mono border-b border-white/30 pb-1 hover:text-white">{t.workshop.telemetry.resetButton}</button>
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default WorkshopPage;
