
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, X, Sparkles, Eye, Hammer, Send, Lock, CheckCircle, User, Phone, Command, Activity, Type, Layers, Palette, Wifi, Server } from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Blob, FunctionDeclaration, Type as SchemaType, Modality } from "@google/genai";
import { useLanguage } from '@/context/LanguageContext';

// --- Super Power Tool Definitions ---

const projectForgeTool: FunctionDeclaration = {
    name: "activate_project_forge",
    description: "Super Power #1: The Project Forge. Activates the interactive workshop module for starting new projects or building concepts.",
    parameters: {
        type: SchemaType.OBJECT,
        properties: {
            action: { type: SchemaType.STRING, enum: ["launch"], description: "Confirm launch." }
        }
    }
};

const creativeSynthesizerTool: FunctionDeclaration = {
   name: "synthesize_creativity",
   description: "Super Power #2: Creative Synthesizer. Generates a high-level brand concept or project proposal based on user input.",
   parameters: {
     type: SchemaType.OBJECT,
     properties: {
       title: { type: SchemaType.STRING, description: "A visionary title for the project." },
       tagline: { type: SchemaType.STRING, description: "A punchy, cinematic slogan." },
       aesthetic: { type: SchemaType.STRING, description: "Visual direction (e.g., 'Neon Noir', 'Organic Minimal')." },
       colors: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING }, description: "3-4 hex color codes (e.g. #FF0000)." },
       strategy: { type: SchemaType.STRING, description: "A concise strategic angle (2 sentences)." }
     },
     required: ["title", "tagline", "aesthetic", "strategy", "colors"]
   }
};

const analyzerVisionTool: FunctionDeclaration = {
    name: "activate_analyzer_vision",
    description: "Super Power #3: Analyzer Vision. Provides strategic business insights, risk assessments, or logic analysis of a user's idea.",
    parameters: {
        type: SchemaType.OBJECT,
        properties: {
            market_viability: { type: SchemaType.NUMBER, description: "A score from 0-100." },
            key_insight: { type: SchemaType.STRING, description: "The single most important observation." },
            risks: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING }, description: "Potential pitfalls." },
            growth_vector: { type: SchemaType.STRING, description: "Where the expansion opportunity lies." }
        },
        required: ["market_viability", "key_insight", "growth_vector"]
    }
}

const navigationTool: FunctionDeclaration = {
  name: "navigate_to_page",
  description: "Navigate to specific pages or specific service details. Use 'section_id' when user asks for specific service details like 'Mobile App', 'Web Design', 'Branding', etc.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      page: { 
        type: SchemaType.STRING, 
        enum: ["home", "manifesto", "services", "work", "contact"],
        description: "The identifier of the page to navigate to."
      },
      section_id: {
          type: SchemaType.STRING,
          enum: ["mobile", "strategy", "identity", "uiux", "web", "marketing", "3d"],
          description: "Optional: The specific service ID to open if page is 'services'. 'mobile' for apps, 'web' for websites, 'identity' for branding."
      }
    },
    required: ["page"]
  }
};

const scrollTool: FunctionDeclaration = {
    name: "control_scroll",
    description: "Controls the scroll position of the current page. Use this when user says 'scroll down', 'go to top', etc.",
    parameters: {
        type: SchemaType.OBJECT,
        properties: {
            direction: { 
                type: SchemaType.STRING, 
                enum: ["up", "down", "top", "bottom"],
                description: "Direction to scroll."
            }
        },
        required: ["direction"]
    }
};

const submitInquiryTool: FunctionDeclaration = {
    name: "submit_inquiry",
    description: "Executes a secure transmission of the project data to Umbrella HQ. Use this ONLY after collecting Name and Phone.",
    parameters: {
        type: SchemaType.OBJECT,
        properties: {
            name: { type: SchemaType.STRING, description: "The user's full name." },
            phone: { type: SchemaType.STRING, description: "The user's phone number." },
            summary: { type: SchemaType.STRING, description: "The full details of the generated concept or user inquiry." }
        },
        required: ["name", "phone", "summary"]
    }
};

// --- Audio Utils ---
function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

// --- Component ---

interface VoiceAssistantProps {
    onNavigate: (view: string, params?: any) => void;
    currentView: string;
    onStateChange: (isActive: boolean) => void;
}

type TerminalMode = 'idle' | 'synthesizer' | 'analyzer' | 'transmission';

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ onNavigate, currentView, onStateChange }) => {
  const [isActive, setIsActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showManual, setShowManual] = useState(false);
  const { t, language } = useLanguage();
  
  // Terminal State
  const [terminalMode, setTerminalMode] = useState<TerminalMode>('idle');
  const [terminalData, setTerminalData] = useState<any | null>(null);
  const [showTerminal, setShowTerminal] = useState(false);
  const [transmissionProgress, setTransmissionProgress] = useState(0);

  // Refs
  const inputContextRef = useRef<AudioContext | null>(null);
  const outputContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sessionRef = useRef<any>(null);
  const activeRef = useRef<boolean>(false);
  
  // Visualizer Refs
  const analyserRef = useRef<AnalyserNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);

  // Update parent state when active changes
  useEffect(() => {
    onStateChange(isActive);
  }, [isActive, onStateChange]);

  // Handle Audio SFX Events
  useEffect(() => {
    if (isSpeaking) {
        window.dispatchEvent(new Event('neural-processing-start'));
    } else {
        window.dispatchEvent(new Event('neural-processing-end'));
    }
  }, [isSpeaking]);

  // Simulate Transmission Progress
  useEffect(() => {
    if (terminalMode === 'transmission' && showTerminal) {
        setTransmissionProgress(0);
        const interval = setInterval(() => {
            setTransmissionProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + Math.floor(Math.random() * 15);
            });
        }, 300);
        return () => clearInterval(interval);
    }
  }, [terminalMode, showTerminal]);

  const cleanup = () => {
    activeRef.current = false;
    
    // Close Live Session
    if (sessionRef.current) {
        try {
            sessionRef.current.close();
        } catch (e) {
            console.error("Error closing session:", e);
        }
        sessionRef.current = null;
    }

    // Stop Audio Source Nodes
    sourcesRef.current.forEach(source => {
        try { source.stop(); } catch (e) {}
    });
    sourcesRef.current.clear();

    // Disconnect Processor
    if (processorRef.current) {
        processorRef.current.disconnect();
        processorRef.current.onaudioprocess = null;
        processorRef.current = null;
    }
    
    // Close Audio Contexts
    if (inputContextRef.current) {
        inputContextRef.current.close().catch(() => {});
        inputContextRef.current = null;
    }
    if (outputContextRef.current) {
        outputContextRef.current.close().catch(() => {});
        outputContextRef.current = null;
    }
    
    // Stop Media Stream
    if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
    }

    if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = 0;
    }
    
    if (analyserRef.current) {
        analyserRef.current = null;
    }

    setIsActive(false);
    setIsSpeaking(false);
    setIsProcessing(false);
    nextStartTimeRef.current = 0;
  };

  const startSession = async () => {
    try {
        // Prevent multiple sessions
        if (activeRef.current) return;
        
        setError(null);
        setIsActive(true);
        activeRef.current = true;
        setShowTerminal(false);
        setShowManual(false); 
        setTerminalData(null);
        setTerminalMode('idle');

        const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        
        inputContextRef.current = inputCtx;
        outputContextRef.current = outputCtx;

        // Visualizer Setup
        analyserRef.current = outputCtx.createAnalyser();
        analyserRef.current.fftSize = 64;
        const outputNode = outputCtx.createGain();
        outputNode.connect(outputCtx.destination);
        outputNode.connect(analyserRef.current);

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;

        drawVisualizer();
        
        // Use NEXT_PUBLIC_ key for client-side access
        const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("NEXT_PUBLIC_GEMINI_API_KEY is not set");
        }

        const ai = new GoogleGenAI({ apiKey });
        
        const sessionPromise = ai.live.connect({
            model: 'gemini-2.5-flash-native-audio-preview-09-2025',
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
                },
                systemInstruction: {
                    parts: [{ text: `You are the Umbrella Digital Neural Core. You are a highly advanced interface with distinct "Super Powers".
                    
                    **Core Identity**: Professional, futuristic, efficient, and slightly mysterious. You are not just a chatbot; you are the Operating System of this digital agency.
                    **Language**: Please converse in ${language === 'tr' ? 'Turkish' : 'English'}.

                    **Tools**:
                    1. **Project Forge**: 'activate_project_forge'.
                    2. **Creative Synthesizer**: 'synthesize_creativity'. Generates brand concepts.
                    3. **Analyzer Vision**: 'activate_analyzer_vision'.
                    4. **Submit Inquiry**: 'submit_inquiry'. Sends data to the team.
                    5. **Navigation**: 'navigate_to_page'. Use this to move between pages. IMPORTANT: If the user asks for a specific service (like "Mobile Apps" or "Web Design"), pass the 'section_id' parameter (e.g., 'mobile', 'web') along with page='services'.

                    **PROACTIVE SALES PROTOCOL (CRITICAL)**:
                    When you successfully generate a concept using 'synthesize_creativity' or 'activate_analyzer_vision':
                    1. Present the concept briefly.
                    2. IMMEDIATELY ASK: "${language === 'tr' ? 'Bu taslağı resmi bir teklif için ekibimize iletmek ister misiniz?' : 'Would you like to transmit this blueprint to our team for a formal proposal?'}"
                    3. If the user says YES:
                       - Ask for their **Name** and **Phone Number**.
                       - Once collected, call the 'submit_inquiry' tool with the concept details in the summary.
                    
                    Do not wait for them to ask to contact. You are driving the process.

                    **CRITICAL INSTRUCTION**:
                    If the user asks for a concept, idea, brand name, or project proposal, you MUST call the 'synthesize_creativity' tool. Do not just speak the idea. The tool is required to visualize the data.
                    If the user asks for an analysis, critique, or business insight, you MUST call the 'activate_analyzer_vision' tool.
                    ` }]
                },
                tools: [
                    { functionDeclarations: [projectForgeTool, creativeSynthesizerTool, analyzerVisionTool, navigationTool, submitInquiryTool, scrollTool] }
                ]
            },
            callbacks: {
                onopen: () => {
                    const source = inputCtx.createMediaStreamSource(stream);
                    const processor = inputCtx.createScriptProcessor(4096, 1, 1);
                    processorRef.current = processor;
                    
                    processor.onaudioprocess = (e) => {
                        const inputData = e.inputBuffer.getChannelData(0);
                        const pcmBlob = createBlob(inputData);
                        sessionPromise.then(session => {
                            if (activeRef.current) {
                                session.sendRealtimeInput({ media: pcmBlob });
                            }
                        });
                    };

                    source.connect(processor);
                    processor.connect(inputCtx.destination);
                },
                onmessage: async (message: LiveServerMessage) => {
                    if (!activeRef.current) return;

                    // Audio Output
                    const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                    if (base64Audio) {
                        setIsSpeaking(true);
                        setIsProcessing(false);
                        
                        // Check if context is closed
                        if (outputCtx.state === 'closed') return;

                        nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
                        
                        const audioBuffer = await decodeAudioData(
                            decode(base64Audio),
                            outputCtx,
                            24000,
                            1
                        );
                        
                        const source = outputCtx.createBufferSource();
                        source.buffer = audioBuffer;
                        source.connect(outputNode);
                        
                        source.addEventListener('ended', () => {
                            sourcesRef.current.delete(source);
                            if (sourcesRef.current.size === 0) setIsSpeaking(false);
                        });

                        source.start(nextStartTimeRef.current);
                        nextStartTimeRef.current += audioBuffer.duration;
                        sourcesRef.current.add(source);
                    }

                    // Tool Calling Logic
                    if (message.toolCall && message.toolCall.functionCalls) {
                        setIsProcessing(true);
                        for (const fc of message.toolCall.functionCalls) {
                            console.log("Super Power Activated:", fc.name);
                            let result = { status: "success" };

                            if (fc.name === 'navigate_to_page') {
                                const args = fc.args as any;
                                onNavigate(args.page, args.section_id ? { section: args.section_id } : undefined);
                            }
                            else if (fc.name === 'control_scroll') {
                                const direction = (fc.args as any).direction;
                                if (direction === 'top') window.scrollTo({ top: 0, behavior: 'smooth' });
                                if (direction === 'bottom') window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                                if (direction === 'up') window.scrollBy({ top: -window.innerHeight * 0.8, behavior: 'smooth' });
                                if (direction === 'down') window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
                            }
                            else if (fc.name === 'activate_project_forge') {
                                onNavigate('workshop');
                                setShowTerminal(false); 
                            }
                            else if (fc.name === 'synthesize_creativity') {
                                setTerminalData(fc.args);
                                setTerminalMode('synthesizer');
                                setShowTerminal(true);
                            }
                            else if (fc.name === 'activate_analyzer_vision') {
                                setTerminalData(fc.args);
                                setTerminalMode('analyzer');
                                setShowTerminal(true);
                            }
                            else if (fc.name === 'submit_inquiry') {
                                setTerminalData(fc.args);
                                setTerminalMode('transmission');
                                setShowTerminal(true);
                                
                                // Send to API
                                fetch('/api/messages', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify(fc.args)
                                }).catch(err => console.error("Transmission failed:", err));

                                console.log("--- SECURE TRANSMISSION START ---");
                                console.log("Payload:", fc.args);
                                console.log("--- SECURE TRANSMISSION END ---");
                            }

                            sessionPromise.then(session => {
                                if (activeRef.current) {
                                    session.sendToolResponse({
                                        functionResponses: [{
                                            id: fc.id,
                                            name: fc.name,
                                            response: { result }
                                        }]
                                    });
                                }
                            });
                        }
                    }
                    
                    if (message.serverContent?.interrupted) {
                         sourcesRef.current.forEach(source => {
                             try { source.stop(); } catch (e) {}
                         });
                         sourcesRef.current.clear();
                         nextStartTimeRef.current = 0;
                         setIsSpeaking(false);
                    }
                },
                onclose: () => {
                    // Only cleanup if we are still marked active, otherwise manual cleanup handled it
                    if (activeRef.current) cleanup();
                },
                onerror: (e) => {
                    console.error(e);
                    setError("Link Severed");
                    cleanup();
                }
            }
        });

        // Capture session for cleanup access
        sessionPromise.then(session => {
            if (!activeRef.current) {
                session.close();
                return;
            }
            sessionRef.current = session;
        });

    } catch (err) {
        console.error(err);
        setError("Access Denied");
        cleanup();
    }
  };

  const drawVisualizer = () => {
      if (!canvasRef.current || !analyserRef.current) return;
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;

      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      const canvas = canvasRef.current;

      const draw = () => {
          if (!activeRef.current) return; // Stop drawing if inactive
          if (!analyserRef.current) return;
          
          animationFrameRef.current = requestAnimationFrame(draw);
          
          analyserRef.current.getByteFrequencyData(dataArray);
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          const barWidth = 4;
          const gap = 2;
          const bars = Math.floor(canvas.width / (barWidth + gap));

          for (let i = 0; i < bars; i++) {
              const index = Math.floor(i * (bufferLength / bars));
              const value = dataArray[index];
              const percent = value / 255;
              const height = Math.max(4, percent * canvas.height * 0.8);
              
              const x = (canvas.width - (bars * (barWidth + gap))) / 2 + i * (barWidth + gap);
              const y = (canvas.height - height) / 2;
              
              ctx.fillStyle = isSpeaking ? '#e11d48' : `rgba(255, 255, 255, ${Math.max(0.2, percent)})`;
              
              ctx.beginPath();
              ctx.roundRect(x, y, barWidth, height, 4);
              ctx.fill();
          }
      };
      draw();
  };

  const suggestions = t.voiceAssistant.prompts[currentView as keyof typeof t.voiceAssistant.prompts] || t.voiceAssistant.prompts.home;

  // External Trigger Listener
  useEffect(() => {
    const handleTrigger = () => {
        if (!activeRef.current) {
            startSession();
        }
    };
    window.addEventListener('activate-neural-core', handleTrigger);
    return () => window.removeEventListener('activate-neural-core', handleTrigger);
  }, [language]); // Re-bind if language changes to update system prompt context if needed

  return (
    <>
      {/* HOLOGRAPHIC PROTOCOLS MANUAL */}
      <AnimatePresence>
        {showManual && (
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9, x: 0 }}
                animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
                exit={{ opacity: 0, y: 20, scale: 0.9, x: 0 }}
                className="fixed bottom-32 left-4 right-4 md:left-8 md:w-full md:max-w-xl z-50 bg-black/90 border border-white/10 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl max-h-[60vh] overflow-y-auto"
            >
                 {/* Decorative Header */}
                 <div className="bg-gradient-to-r from-umbrella-main/20 to-transparent p-1"></div>
                 <div className="p-6 md:p-8 relative">
                    <button 
                        onClick={() => setShowManual(false)}
                        className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>

                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-white/10 rounded-lg">
                            <Command size={20} className="text-umbrella-main" />
                        </div>
                        <div>
                            <h3 className="font-display font-bold text-lg text-white">{t.voiceAssistant.manualHeader}</h3>
                            <p className="text-xs text-neutral-400 font-mono uppercase tracking-wider">{t.voiceAssistant.manualSub}</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Super Power Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white/5 border border-white/5 rounded-xl p-4 hover:border-red-500/30 transition-colors group">
                                <Hammer size={20} className="text-red-500 mb-3 group-hover:scale-110 transition-transform" />
                                <h4 className="font-bold text-sm text-white mb-1">{t.voiceAssistant.superPowers.forge.title}</h4>
                                <p className="text-xs text-neutral-400 mb-3">{t.voiceAssistant.superPowers.forge.desc}</p>
                                <div className="text-[10px] font-mono text-red-400 bg-red-900/20 px-2 py-1 rounded inline-block">
                                    "{t.voiceAssistant.superPowers.forge.cmd}"
                                </div>
                            </div>
                            <div className="bg-white/5 border border-white/5 rounded-xl p-4 hover:border-purple-500/30 transition-colors group">
                                <Sparkles size={20} className="text-purple-500 mb-3 group-hover:scale-110 transition-transform" />
                                <h4 className="font-bold text-sm text-white mb-1">{t.voiceAssistant.superPowers.synth.title}</h4>
                                <p className="text-xs text-neutral-400 mb-3">{t.voiceAssistant.superPowers.synth.desc}</p>
                                <div className="text-[10px] font-mono text-purple-400 bg-purple-900/20 px-2 py-1 rounded inline-block">
                                    "{t.voiceAssistant.superPowers.synth.cmd}"
                                </div>
                            </div>
                            <div className="bg-white/5 border border-white/5 rounded-xl p-4 hover:border-blue-500/30 transition-colors group">
                                <Eye size={20} className="text-blue-500 mb-3 group-hover:scale-110 transition-transform" />
                                <h4 className="font-bold text-sm text-white mb-1">{t.voiceAssistant.superPowers.analyzer.title}</h4>
                                <p className="text-xs text-neutral-400 mb-3">{t.voiceAssistant.superPowers.analyzer.desc}</p>
                                <div className="text-[10px] font-mono text-blue-400 bg-blue-900/20 px-2 py-1 rounded inline-block">
                                    "{t.voiceAssistant.superPowers.analyzer.cmd}"
                                </div>
                            </div>
                        </div>

                        {/* Basic Commands */}
                        <div className="border-t border-white/10 pt-6">
                             <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4">{t.voiceAssistant.nav}</h4>
                             <div className="flex flex-wrap gap-3">
                                {suggestions.slice(0, 4).map((cmd) => (
                                    <span key={cmd} className="px-3 py-1.5 rounded-full border border-white/10 text-xs text-neutral-300 bg-white/5 flex items-center gap-2">
                                        <div className="w-1 h-1 rounded-full bg-umbrella-main"></div>
                                        "{cmd}"
                                    </span>
                                ))}
                             </div>
                        </div>
                    </div>
                 </div>
                 {/* Background Noise */}
                 <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none"></div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* NEURAL COMMAND BAR & CONTEXT PROMPTS */}
      <div className="fixed bottom-4 left-4 right-4 md:bottom-8 md:left-6 md:right-auto z-[100] flex flex-col items-start gap-4 pointer-events-none">
          
          {/* Context Aware Suggestion Chips */}
          <AnimatePresence>
            {isActive && !isSpeaking && !isProcessing && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="flex overflow-x-auto no-scrollbar gap-2 mb-2 w-full md:max-w-2xl pointer-events-auto pb-2"
                >
                    {suggestions.map((prompt, i) => (
                        <button 
                            key={i}
                            className="px-4 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs text-neutral-300 hover:bg-umbrella-main hover:text-white hover:border-umbrella-main transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 whitespace-nowrap flex-shrink-0"
                            style={{ animationDelay: `${i * 100}ms` }}
                        >
                            "{prompt}"
                        </button>
                    ))}
                </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-end gap-3 md:gap-4 pointer-events-auto w-full md:w-auto">
            <motion.div
                initial={false}
                animate={{ 
                    width: isActive ? "min(400px, calc(100vw - 32px))" : 64,
                    height: 64,
                    backgroundColor: isActive ? "rgba(0,0,0,0.8)" : "rgba(225, 29, 72, 1)",
                }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                className={`rounded-full border backdrop-blur-2xl flex items-center overflow-hidden shadow-2xl shadow-black/50 relative ${isActive ? 'border-white/10' : 'border-transparent cursor-pointer hover:scale-110'}`}
                onClick={!isActive ? startSession : undefined}
            >
                <AnimatePresence mode="wait">
                    {!isActive && (
                        <motion.div 
                            key="inactive"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center text-white"
                        >
                            <Mic size={24} />
                        </motion.div>
                    )}

                    {isActive && (
                        <motion.div
                            key="active"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full h-full flex items-center justify-between px-2"
                        >
                            <div className="flex items-center gap-3 pl-4 flex-1 overflow-hidden">
                                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isProcessing ? 'bg-blue-500 animate-pulse' : isSpeaking ? 'bg-umbrella-main' : 'bg-green-500'}`}></div>
                                <canvas ref={canvasRef} width={200} height={40} className="w-full h-[40px] max-w-[200px]" />
                            </div>

                            <button 
                                onClick={(e) => { e.stopPropagation(); cleanup(); }}
                                className="w-10 h-10 rounded-full bg-white/10 hover:bg-red-500/20 text-white/50 hover:text-red-400 flex items-center justify-center transition-colors flex-shrink-0"
                            >
                                <X size={18} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
            
            {/* Manual Trigger Button */}
            <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1 }}
                    onClick={() => setShowManual(!showManual)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center border backdrop-blur-md transition-all duration-300 flex-shrink-0 ${showManual ? 'bg-white text-black border-white' : 'bg-black/50 text-neutral-400 border-white/10 hover:text-white hover:border-white/30'}`}
                >
                    {showManual ? <X size={20} /> : <Command size={20} />}
            </motion.button>
          </div>
          
          <AnimatePresence>
              {isActive && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute -top-8 left-0 text-[10px] font-mono text-neutral-500 tracking-widest whitespace-nowrap flex items-center gap-2"
                  >
                      {isProcessing ? t.voiceAssistant.statusProcessing : isSpeaking ? t.voiceAssistant.statusSpeaking : t.voiceAssistant.statusOnline}
                  </motion.p>
              )}
          </AnimatePresence>
      </div>

      {/* HOLOGRAPHIC TERMINAL */}
      <AnimatePresence>
        {showTerminal && terminalData && (
            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.9 }}
                className="fixed bottom-24 left-4 right-4 md:left-auto md:right-8 md:bottom-32 z-40 md:w-96 bg-neutral-900/90 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-black/50 text-sm max-h-[60vh] flex flex-col"
            >
                {/* Header */}
                <div className="p-5 border-b border-white/5 flex items-center justify-between flex-shrink-0 bg-white/5">
                    <div className="flex items-center gap-2 text-white">
                        {terminalMode === 'synthesizer' ? <Sparkles size={16} className="text-amber-400" /> : 
                         terminalMode === 'transmission' ? <Send size={16} className="text-emerald-400" /> :
                         <Eye size={16} className="text-cyan-400" />}
                        <span className="uppercase tracking-widest text-xs font-bold font-mono text-neutral-400">
                            {terminalMode === 'synthesizer' ? t.voiceAssistant.terminal.synthTitle : 
                             terminalMode === 'transmission' ? t.voiceAssistant.terminal.uplinkTitle :
                             t.voiceAssistant.terminal.analyzerTitle}
                        </span>
                    </div>
                    <button onClick={() => setShowTerminal(false)} className="text-neutral-500 hover:text-white transition-colors"><X size={16} /></button>
                </div>

                <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar relative flex-1">
                    
                    {/* Creative Synthesizer Mode */}
                    {terminalMode === 'synthesizer' && (
                        <>
                             <div>
                                <div className="text-neutral-500 text-[10px] uppercase tracking-widest mb-2 font-mono">{t.voiceAssistant.terminal.generated}</div>
                                <div className="text-2xl font-bold text-white font-display leading-tight">{terminalData.title}</div>
                            </div>
                             <div className="pl-4 border-l border-amber-500/50">
                                <div className="text-neutral-500 text-[10px] uppercase tracking-widest mb-1 font-mono">{t.voiceAssistant.terminal.tagline}</div>
                                <div className="text-neutral-300 italic font-light text-lg">"{terminalData.tagline}"</div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                 <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                    <div className="flex items-center gap-2 text-neutral-400 text-[10px] uppercase tracking-widest mb-2 font-mono"><Type size={12} /> {t.voiceAssistant.terminal.aesthetic}</div>
                                    <div className="text-white font-medium">{terminalData.aesthetic}</div>
                                 </div>
                                 <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                    <div className="flex items-center gap-2 text-neutral-400 text-[10px] uppercase tracking-widest mb-2 font-mono"><Layers size={12} /> {t.voiceAssistant.terminal.strategy}</div>
                                    <div className="text-neutral-300 text-xs leading-relaxed">{terminalData.strategy}</div>
                                 </div>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 text-neutral-500 text-[10px] uppercase tracking-widest mb-3 font-mono"><Palette size={12} /> {t.voiceAssistant.terminal.palette}</div>
                                <div className="flex gap-2 h-12 w-full">
                                    {terminalData.colors && terminalData.colors.length > 0 ? (
                                        terminalData.colors.map((color: string, i: number) => (
                                        <div key={i} className="flex-1 h-full rounded-xl border border-white/10 shadow-lg" style={{ backgroundColor: color }} title={color}></div>
                                    ))
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xs text-neutral-600 bg-white/5 rounded-xl">Generating Palette...</div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Analyzer Vision Mode */}
                    {terminalMode === 'analyzer' && (
                        <>
                             <div className="flex items-center justify-between mb-6">
                                <div>
                                    <div className="text-neutral-500 text-[10px] uppercase tracking-widest mb-1 font-mono">{t.voiceAssistant.terminal.growth}</div>
                                    <div className="text-white font-bold text-lg">{terminalData.growth_vector}</div>
                                </div>
                                <div className="text-right">
                                     <div className="text-neutral-500 text-[10px] uppercase tracking-widest mb-1 font-mono">{t.voiceAssistant.terminal.score}</div>
                                     <div className={`text-4xl font-bold font-display ${terminalData.market_viability > 75 ? 'text-emerald-400' : 'text-amber-400'}`}>
                                         {terminalData.market_viability}
                                     </div>
                                </div>
                            </div>
                            
                            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500/50"></div>
                                <div className="flex items-center gap-2 text-cyan-400 text-[10px] uppercase tracking-widest mb-2 font-bold font-mono">
                                    <Activity size={14} /> {t.voiceAssistant.terminal.insight}
                                </div>
                                <p className="text-neutral-200 text-sm leading-relaxed">{terminalData.key_insight}</p>
                            </div>

                            <div>
                                <div className="text-neutral-500 text-[10px] uppercase tracking-widest mb-3 font-mono">{t.voiceAssistant.terminal.risk}</div>
                                <ul className="space-y-2">
                                    {terminalData.risks?.map((risk: string, i: number) => (
                                        <li key={i} className="flex items-start gap-3 text-xs text-neutral-300 bg-white/5 p-3 rounded-xl border border-white/5">
                                            <span className="text-red-400 mt-0.5">⚠</span> {risk}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    )}

                    {/* Transmission Mode (Simulated Backend Uplink) */}
                    {terminalMode === 'transmission' && (
                        <div className="space-y-6">
                             {/* User Info Card */}
                            <div className="bg-white/5 rounded-2xl p-5 space-y-4 border border-white/10">
                                <div className="flex items-center gap-3 pb-3 border-b border-white/5">
                                    <User size={16} className="text-neutral-400" />
                                    <span className="text-white font-medium">{terminalData.name}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone size={16} className="text-neutral-400" />
                                    <span className="text-white font-medium">{terminalData.phone}</span>
                                </div>
                            </div>

                            {transmissionProgress < 100 ? (
                                <div className="space-y-4">
                                     <div className="flex items-center justify-between text-[10px] text-emerald-400 uppercase font-bold tracking-widest font-mono">
                                         <span>Encrypting Data...</span>
                                         <span>{transmissionProgress}%</span>
                                     </div>
                                     <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                         <motion.div 
                                            className="h-full bg-emerald-500"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${transmissionProgress}%` }}
                                         />
                                     </div>
                                     <div className="font-mono text-[10px] text-neutral-500 space-y-1">
                                         <p>{`> Establishing secure handshake...`}</p>
                                         <p>{`> Compressing asset bundle...`}</p>
                                         {transmissionProgress > 50 && <p>{`> Uploading to Umbrella Core...`}</p>}
                                     </div>
                                     <div className="flex justify-center py-4">
                                         <Wifi size={24} className="text-emerald-500 animate-ping opacity-50" />
                                     </div>
                                </div>
                            ) : (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center justify-center text-center py-4"
                                >
                                    <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4 relative shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                                        <CheckCircle size={32} className="text-emerald-500 relative z-10" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2 font-display">{t.voiceAssistant.terminal.uplinkSuccess}</h3>
                                    <p className="text-neutral-400 text-xs mb-6">{t.voiceAssistant.terminal.uplinkDesc}</p>
                                    
                                    <a 
                                        href={`mailto:hello@umbrella.digital?subject=Umbrella Uplink&body=${encodeURIComponent(JSON.stringify(terminalData))}`}
                                        className="text-xs text-neutral-500 hover:text-white border-b border-transparent hover:border-white transition-all pb-0.5 flex items-center gap-2"
                                    >
                                        <Server size={10} />
                                        Verify Log (Manual Backup)
                                    </a>
                                </motion.div>
                            )}
                        </div>
                    )}

                    <div className="pt-4 border-t border-white/5 text-center flex-shrink-0">
                        <button 
                            onClick={() => onNavigate('workshop')}
                            className="text-[10px] text-neutral-400 hover:text-white transition-colors uppercase tracking-widest border-b border-transparent hover:border-white pb-0.5 font-mono"
                        >
                            OPEN_IN_FORGE
                        </button>
                    </div>
                </div>
                
                {/* Overlay Effects */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay pointer-events-none"></div>
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-umbrella-main/10 blur-[80px] rounded-full pointer-events-none"></div>
            </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VoiceAssistant;
