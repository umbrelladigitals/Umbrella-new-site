'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useVelocity, useAnimationFrame } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

// --- Text Decoder Component ---
const GlitchText: React.FC<{ text: string; delay?: number }> = ({ text, delay = 0 }) => {
    const [displayText, setDisplayText] = useState("");
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%&";
  
    useEffect(() => {
        let iteration = 0;
        const startDelay = setTimeout(() => {
            const interval = setInterval(() => {
                setDisplayText(
                    text
                        .split("")
                        .map((char, index) => {
                            if (index < iteration) return text[index];
                            return chars[Math.floor(Math.random() * chars.length)];
                        })
                        .join("")
                );
        
                if (iteration >= text.length) clearInterval(interval);
                iteration += 1 / 3;
            }, 30);
            return () => clearInterval(interval);
        }, delay);
        return () => clearTimeout(startDelay);
    }, [text, delay]);
  
    return <span>{displayText}</span>;
};

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

interface ParallaxProps {
  children: string;
  baseVelocity: number;
}

const ParallaxText: React.FC<ParallaxProps> = ({ children, baseVelocity = 100 }) => {
  const baseX = useSpring(0, { stiffness: 1000, damping: 50, mass: 0.1 });
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false
  });

  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

  const directionFactor = useRef<number>(1);
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="overflow-hidden m-0 whitespace-nowrap flex flex-nowrap">
      <motion.div className="flex whitespace-nowrap gap-10" style={{ x }}>
        {[...Array(8)].map((_, i) => (
           <span key={i} className="text-2xl md:text-4xl font-display font-bold text-white/20 uppercase tracking-tighter hover:text-white transition-colors duration-300 cursor-default select-none px-4">
             {children} 
           </span>
        ))}
      </motion.div>
    </div>
  );
}

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  // Scroll Animation Logic
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 800], [1, 0]);
  const scale = useTransform(scrollY, [0, 800], [1, 0.85]);
  const blur = useTransform(scrollY, [0, 800], ["blur(0px)", "blur(15px)"]);
  const y = useTransform(scrollY, [0, 800], [0, 200]);

  // Mouse movement for RGB Split Effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Springs for smooth movement
  const springConfig = { damping: 20, stiffness: 200, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // RGB Split Transforms
  const xRed = useTransform(smoothX, [-1, 1], [-15, 15]);
  const yRed = useTransform(smoothY, [-1, 1], [-15, 15]);
  const xBlue = useTransform(smoothX, [-1, 1], [15, -15]);
  const yBlue = useTransform(smoothY, [-1, 1], [15, -15]);

  // Tilt/Skew
  const rotateX = useTransform(smoothY, [-1, 1], [10, -10]);
  const rotateY = useTransform(smoothX, [-1, 1], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const { width, height, left, top } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width * 2 - 1; // -1 to 1
    const y = (e.clientY - top) / height * 2 - 1; // -1 to 1
    mouseX.set(x);
    mouseY.set(y);
  };

  return (
    <section 
      ref={containerRef} 
      onMouseMove={handleMouseMove}
      className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-center perspective-1000 bg-black"
    >
      {/* Global Scroll Wrapper */}
      <motion.div 
        style={{ opacity, scale, filter: blur, y }}
        className="relative w-full h-full flex flex-col items-center justify-center"
      >
          {/* Background Video / Atmosphere */}
          <div className="absolute inset-0 z-0">
             <video 
                autoPlay 
                muted 
                playsInline
                poster="/hero-poster.jpg"
                className="w-full h-full object-cover opacity-60 mix-blend-screen scale-110"
             >
                <source src="/hero-background.webm" type="video/webm" />
             </video>
             
             {/* Digital Grid Overlay */}
             <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none" />
             
             {/* Scanline */}
             <div className="absolute inset-0 z-20 pointer-events-none bg-[linear-gradient(to_bottom,transparent,rgba(255,255,255,0.05)_50%,transparent)] bg-[length:100%_4px] animate-scanline" />

             {/* Vignette */}
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_90%)] z-10"></div>
          </div>

          {/* Central Content */}
          <div className="relative z-30 flex flex-col items-center justify-center w-full px-4 perspective-text group">
            
            {/* Top Data Line */}
            <motion.div 
               initial={{ opacity: 0, width: 0 }}
               animate={{ opacity: 1, width: "auto" }}
               transition={{ delay: 0.5, duration: 1 }}
               className="flex items-center gap-4 mb-12 overflow-hidden whitespace-nowrap"
            >
                <div className="h-[1px] w-12 bg-umbrella-main/50"></div>
                <span className="font-display font-bold text-sm text-umbrella-main uppercase tracking-[0.3em]">
                    <GlitchText text={t.hero.umbrella} delay={500} />
                </span>
                <div className="h-[1px] w-12 bg-umbrella-main/50"></div>
            </motion.div>

            {/* Main Typography with RGB Split */}
            <div className="relative">
               {/* RED CHANNEL (Ghost) */}
               <motion.h1 
                  style={{ x: xRed, y: yRed, opacity: 0.6 }}
                  className="absolute inset-0 text-[13vw] md:text-[14rem] font-display font-black leading-[0.8] tracking-tighter text-red-600 mix-blend-screen select-none blur-[2px] pointer-events-none"
               >
                  {t.hero.mainTitle}
               </motion.h1>

               {/* BLUE CHANNEL (Ghost) */}
               <motion.h1 
                  style={{ x: xBlue, y: yBlue, opacity: 0.6 }}
                  className="absolute inset-0 text-[13vw] md:text-[14rem] font-display font-black leading-[0.8] tracking-tighter text-cyan-600 mix-blend-screen select-none blur-[2px] pointer-events-none"
               >
                  {t.hero.mainTitle}
               </motion.h1>

               {/* MAIN WHITE CHANNEL */}
               <motion.h1 
                  style={{ rotateX, rotateY }}
                  className="relative text-[13vw] md:text-[14rem] font-display font-black leading-[0.8] tracking-tighter text-white text-center mix-blend-normal select-none z-20"
               >
                  <motion.div
                     initial={{ y: "100%", clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" }}
                     animate={{ y: "0%", clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
                     transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {t.hero.mainTitle}
                  </motion.div>
               </motion.h1>
            </div>

            {/* Subtext with Decoding Effect */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="mt-12 text-neutral-300 text-lg md:text-xl max-w-xl text-center leading-relaxed font-light tracking-wide"
            >
              <span className="text-umbrella-main mr-2">&gt;</span>
              <GlitchText text={t.hero.subText} delay={1500} />
            </motion.p>
          </div>
      </motion.div>
      
      {/* Trusted By Marquee */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-0 left-0 w-full z-40 pb-8"
      >
          <div className="mb-4 text-center">
             <h3 className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest inline-flex items-center gap-2">
                  <span className="w-1 h-1 bg-umbrella-main rounded-full"></span>
                  {t.trustedBy?.title || "TRUSTED BY THE BOLD"}
             </h3>
          </div>
          <div className="relative flex overflow-hidden w-full mask-linear-fade">
             <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent z-10"></div>
             <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent z-10"></div>
             <ParallaxText baseVelocity={-1}>
                 KL YAPI / SN GROUP / HANN INDUSTRIAL / BAIE / DIMES / TELCON / bakıyem / shopalm /
             </ParallaxText>
          </div>
      </motion.div>

      {/* CSS for Scanline Animation */}
      <style>{`
        @keyframes scanline {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100vh); }
        }
        .animate-scanline {
            animation: scanline 4s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default Hero;
