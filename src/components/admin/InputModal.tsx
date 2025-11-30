'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ArrowRight } from 'lucide-react';

interface InputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (value: string) => void;
  title: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
  loading?: boolean;
}

const InputModal: React.FC<InputModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  title, 
  description, 
  placeholder = "Enter text...", 
  buttonText = "Submit",
  loading = false
}) => {
  const [value, setValue] = useState('');

  // Reset value when modal opens
  useEffect(() => {
    if (isOpen) setValue('');
  }, [isOpen]);

  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
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
        className="relative w-full max-w-lg bg-neutral-900/90 border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-black/50 flex flex-col"
      >
        {/* Decorative Noise */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none"></div>

        {/* Header */}
        <div className="p-8 pb-0 relative z-10">
            <div className="flex items-center gap-2 text-umbrella-main mb-4">
              <Sparkles size={20} />
              <span className="font-mono text-xs tracking-widest uppercase">AI GENERATION PROTOCOL</span>
            </div>
            
            <h2 className="text-3xl font-display font-bold text-white mb-2">
              {title}
            </h2>
            {description && (
                <p className="text-neutral-500 text-sm leading-relaxed">
                {description}
                </p>
            )}
            
            <button 
                onClick={onClose}
                className="absolute top-8 right-8 text-neutral-500 hover:text-white transition-colors"
            >
                <X size={24} />
            </button>
        </div>

        {/* Content */}
        <div className="p-8 relative z-10">
            <div className="space-y-6">
                <div className="space-y-2">
                    <input 
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-umbrella-main transition-colors text-lg"
                    placeholder={placeholder}
                    autoFocus
                    />
                </div>

                <button 
                    type="button"
                    onClick={handleSubmit}
                    disabled={!value.trim() || loading}
                    className="w-full bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-umbrella-main hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-white/10 hover:shadow-umbrella-main/40"
                >
                    {loading ? (
                        <>
                            <Sparkles size={18} className="animate-spin" />
                            Processing...
                        </>
                    ) : (
                        <>
                            {buttonText}
                            <ArrowRight size={18} />
                        </>
                    )}
                </button>
            </div>
        </div>

        {/* Glow Decor */}
        <div className="absolute bottom-[-50%] left-[-50%] w-full h-full bg-umbrella-main/10 blur-[80px] rounded-full pointer-events-none"></div>
      </motion.div>
    </div>
  );
};

export default InputModal;
