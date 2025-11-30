
'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface IntroAnimationProps {
  onComplete: () => void;
}

const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete }) => {
  const [count, setCount] = useState(0);
  const [status, setStatus] = useState("GATHERING ELEMENTS");

  useEffect(() => {
    // Counter Animation
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Faster, more erratic increment for "processing" feel
        return prev + Math.floor(Math.random() * 5) + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
      // Status Text Updates based on percentage
      if (count < 30) setStatus("GATHERING ELEMENTS");
      else if (count < 60) setStatus("FUSING MATERIALS");
      else if (count < 90) setStatus("POLISHING SURFACES");
      else setStatus("TRANSMUTATION COMPLETE");

      // Trigger completion when finished
      if (count === 100) {
          const timer = setTimeout(() => {
              onComplete();
          }, 500); // Reduced delay for snappier feel
          return () => clearTimeout(timer);
      }
  }, [count, onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-neutral-950 flex flex-col items-center justify-center overflow-hidden"
      initial={{ y: 0 }}
      exit={{ 
        y: "-100%", 
        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
      }}
    >
      {/* Ambient Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-umbrella-main/5 rounded-full blur-[120px] pointer-events-none opacity-50 animate-pulse" />
      
      {/* Alchemy Ring Animation */}
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vh] h-[40vh] md:w-[60vh] md:h-[60vh] border border-white/5 rounded-full pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, ease: "linear", repeat: Infinity }}
      >
         <div className="absolute inset-4 border border-white/5 rounded-full border-dashed opacity-50" />
         <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-umbrella-main rounded-full shadow-[0_0_10px_rgba(255,0,0,0.8)]" />
         <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1 h-1 bg-white rounded-full" />
      </motion.div>

      {/* Grain Texture */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-screen-2xl px-6 md:px-12 flex flex-col items-center">
        
        {/* Massive Counter */}
        <div className="relative mb-8">
            <h1 className="text-[15vw] md:text-[20vw] leading-none font-display font-black text-white mix-blend-difference select-none tracking-tighter tabular-nums">
                {count}%
            </h1>
            {/* Overlay Gradient to give depth to text */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-neutral-950/50 mix-blend-overlay pointer-events-none"></div>
        </div>

        {/* Status Bar & Text */}
        <div className="w-full max-w-md flex flex-col gap-4">
            <div className="flex justify-between items-end border-b border-white/20 pb-2">
                <span className="font-mono text-xs text-umbrella-main uppercase tracking-[0.2em] animate-pulse">{status}</span>
                <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest">v2.5.0</span>
            </div>
            
            {/* Progress Line */}
            <div className="h-[2px] w-full bg-white/10 overflow-hidden">
                <motion.div 
                    className="h-full bg-umbrella-main shadow-[0_0_10px_rgba(255,0,0,0.5)]"
                    initial={{ width: "0%" }}
                    animate={{ width: `${count}%` }}
                    transition={{ ease: "linear" }}
                />
            </div>
        </div>
      </div>
      
      {/* Bottom Legal/Copyright style text */}
      <div className="absolute bottom-12 left-0 w-full text-center">
          <p className="text-[10px] text-neutral-600 font-mono uppercase tracking-widest">Umbrella Digital © 2025</p>
      </div>

    </motion.div>
  );
};

export default IntroAnimation;
