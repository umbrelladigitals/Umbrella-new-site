
'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue, useSpring, useVelocity, useAnimationFrame } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

const About: React.FC = () => {
  const element = useRef(null);
  const { scrollYProgress } = useScroll({
    target: element,
    offset: ['start 0.9', 'start 0.25']
  });
  const { t } = useLanguage();

  const words = t.about.scrollingText.split(" ");

  return (
    <section id="about" className="py-24 md:py-40 relative overflow-hidden">
        {/* Background typographic decoration */}
        <div className="absolute -top-20 -right-20 text-[20rem] font-bold text-white/[0.02] font-display select-none pointer-events-none leading-none">
            01
        </div>

      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col md:flex-row gap-16">
          <div className="md:w-1/3">
            <div className="sticky top-32">
              <h2 className="text-sm font-semibold text-umbrella-main uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-8 h-[1px] bg-umbrella-main"></span>
                {t.about.manifestoTitle}
              </h2>
              <h3 className="text-3xl font-display font-bold text-white mb-6">
                {t.about.heading}
              </h3>
              <p className="text-neutral-400 leading-relaxed text-sm">
                {t.about.subHeading}
              </p>
            </div>
          </div>

          <div className="md:w-2/3" ref={element}>
            <p className="text-3xl md:text-5xl lg:text-6xl font-display font-medium leading-[1.2] flex flex-wrap gap-x-3 gap-y-1">
              {words.map((word, i) => {
                const start = i / words.length;
                const end = start + (1 / words.length);
                return (
                  <Word key={i} progress={scrollYProgress} range={[start, end] as [number, number]}>
                    {word}
                  </Word>
                )
              })}
            </p>
          </div>
        </div>
      </div>
        
      {/* Velocity Reactive Marquee */}
      <div className="mt-32 w-full border-y border-white/5 py-12 overflow-hidden relative z-10 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <VelocityMarquee baseVelocity={-2}>
             {t.about.marquee}
          </VelocityMarquee>
      </div>
    </section>
  );
};

// --- Word Component ---
interface WordProps {
  children: React.ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
}

const Word: React.FC<WordProps> = ({ children, progress, range }) => {
  const opacity = useTransform(progress, range, [0.2, 1]);
  const color = useTransform(progress, range, ["#525252", "#ffffff"]);
  return (
    <span className="relative inline-block">
      <motion.span style={{ opacity, color }} className="transition-colors duration-200">
        {children}
      </motion.span>
    </span>
  )
}

// --- Velocity Marquee Component ---
interface ParallaxProps {
  children: string;
  baseVelocity: number;
}

const VelocityMarquee: React.FC<ParallaxProps> = ({ children, baseVelocity = 100 }) => {
  const baseX = useSpring(0, { stiffness: 1000, damping: 50, mass: 0.1 });
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });
  
  // Transform scroll velocity to skew
  const skewVelocity = useTransform(smoothVelocity, [-1000, 1000], [-5, 5]);
  
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
      <motion.div 
        className="flex whitespace-nowrap flex-nowrap items-center gap-16"
        style={{ x, skewX: skewVelocity }}
      >
        {/* Repeating text blocks */}
        {[...Array(8)].map((_, i) => (
           <span key={i} className="text-4xl md:text-8xl font-display font-black text-white/10 hover:text-umbrella-main transition-colors duration-300 uppercase block px-4">
             {children} 
           </span>
        ))}
      </motion.div>
    </div>
  );
}

export default About;
