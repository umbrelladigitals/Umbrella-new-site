
'use client';

import React from 'react';
import { motion } from 'framer-motion';

const TransitionShutter: React.FC = () => {
  return (
    <motion.div
      initial={{ height: "0%", top: 0 }}
      animate={{ height: "100%", top: 0 }}
      exit={{ height: "0%", top: "100%" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 z-[100] bg-neutral-950 flex flex-col items-center justify-center overflow-hidden border-b-2 border-umbrella-main shadow-[0_0_50px_rgba(225,29,72,0.5)]"
    >
        {/* Scanline Texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20" />

        {/* Status Text */}
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-2"
        >
            <div className="flex items-center gap-3">
                <span className="w-2 h-2 bg-umbrella-main animate-ping rounded-full"></span>
                <span className="font-mono text-umbrella-main tracking-[0.3em] text-xs uppercase font-bold">Transmuting</span>
            </div>
            <div className="h-[1px] w-24 bg-white/20 relative overflow-hidden">
                <motion.div 
                    className="absolute inset-0 bg-white"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ repeat: Infinity, duration: 0.5, ease: "linear" }}
                />
            </div>
        </motion.div>
    </motion.div>
  );
};

export default TransitionShutter;
