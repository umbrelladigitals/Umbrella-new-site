'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useVelocity, useAnimationFrame } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

const TrustedBy: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 border-b border-white/5 bg-black overflow-hidden relative z-20">
       <div className="max-w-screen-2xl mx-auto px-6 md:px-12 mb-12">
           <h3 className="text-sm font-mono text-neutral-500 uppercase tracking-widest flex items-center gap-3">
                <span className="w-2 h-2 bg-umbrella-main rounded-full"></span>
                {t.trustedBy?.title || "TRUSTED BY THE BOLD"}
           </h3>
       </div>

       <div className="relative flex overflow-hidden">
           <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent z-10"></div>
           <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent z-10"></div>
           
           <ParallaxText baseVelocity={-1}>
               Google / Nike / Spotify / Netflix / Tesla / Airbnb / Vercel / Linear /
           </ParallaxText>
       </div>
    </section>
  );
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
           <span key={i} className="text-4xl md:text-6xl font-display font-bold text-neutral-800 uppercase tracking-tighter hover:text-white transition-colors duration-300 cursor-default select-none px-4">
             {children} 
           </span>
        ))}
      </motion.div>
    </div>
  );
}

export default TrustedBy;