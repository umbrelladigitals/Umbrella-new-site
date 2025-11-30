
'use client';

import React, { useEffect, useRef, useState } from 'react';

interface AudioExperienceProps {
    isMuted: boolean;
}

const AudioExperience: React.FC<AudioExperienceProps> = ({ isMuted }) => {
  const [audioInitialized, setAudioInitialized] = useState(false);
  
  // Audio Context Refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const audioSourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const processingNodeRef = useRef<any>(null);

  // Initialize Audio Engine (Must happen on user gesture)
  const initAudio = () => {
    if (audioCtxRef.current) return;

    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    audioCtxRef.current = new AudioContext();
    
    // Master Gain (Volume Control)
    masterGainRef.current = audioCtxRef.current.createGain();
    // Start at almost 0 volume if muted, otherwise 0.4 (Avoid 0 for exponential ramp)
    masterGainRef.current.gain.value = isMuted ? 0.0001 : 0.4; 
    masterGainRef.current.connect(audioCtxRef.current.destination);

    // Initialize Background Audio from MP3
    if (!audioElementRef.current) {
        const audio = new Audio('/background-audio.mp3');
        audio.loop = true;
        audio.crossOrigin = "anonymous";
        audioElementRef.current = audio;

        // Create source node from audio element
        const source = audioCtxRef.current.createMediaElementSource(audio);
        source.connect(masterGainRef.current);
        audioSourceNodeRef.current = source;

        // Play the audio (it will be silent if masterGain is 0)
        audio.play().catch(e => console.log("Audio play failed (likely needs interaction):", e));
    }

    setAudioInitialized(true);
    
    if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
    }
  };

  // --- PROCEDURAL SOUND GENERATORS ---
  // (Removed procedural drone in favor of MP3)

  // 2. UI Hover Sound (Holographic "Blip")
  const playHoverSound = () => {
    if (!audioCtxRef.current || !masterGainRef.current || isMuted) return;
    const ctx = audioCtxRef.current;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.05);
    
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    
    osc.connect(gain);
    gain.connect(masterGainRef.current);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  };

  // 3. UI Click Sound (Mechanical "Click")
  const playClickSound = () => {
    if (!audioCtxRef.current || !masterGainRef.current || isMuted) return;
    const ctx = audioCtxRef.current;
    
    // Impact
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    
    // High freq tick
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(2000, ctx.currentTime);
    gain2.gain.setValueAtTime(0.02, ctx.currentTime);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(masterGainRef.current);
    osc2.connect(gain2);
    gain2.connect(masterGainRef.current);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
    osc2.start();
    osc2.stop(ctx.currentTime + 0.05);
  };

  // 3.5. Keyboard Typing Sound (Mechanical Switch)
  const playKeystrokeSound = () => {
    if (!audioCtxRef.current || !masterGainRef.current || isMuted) return;
    const ctx = audioCtxRef.current;
    const t = ctx.currentTime;

    // "Thock" body (Low frequency square wave)
    const osc = ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(300, t);
    osc.frequency.exponentialRampToValueAtTime(50, t + 0.05);
    
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.05, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    
    // "Click" transient (High frequency noise burst)
    const bufferSize = ctx.sampleRate * 0.01; // 10ms
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.05;
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.01);

    osc.connect(gain);
    gain.connect(masterGainRef.current);
    
    noise.connect(noiseGain);
    noiseGain.connect(masterGainRef.current);

    osc.start(t);
    osc.stop(t + 0.05);
    noise.start(t);
  };

  // 4. Neural Core Processing (Data Static)
  const startProcessingSound = () => {
     if (!audioCtxRef.current || !masterGainRef.current || isMuted || processingNodeRef.current) return;
     const ctx = audioCtxRef.current;

     const bufferSize = 4096;
     const processingNode = ctx.createScriptProcessor(bufferSize, 1, 1);
     
     processingNode.onaudioprocess = (e) => {
        const output = e.outputBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            // Random static glitches
            output[i] = (Math.random() * 2 - 1) * (Math.random() > 0.95 ? 0.1 : 0.01);
        }
     };

     const filter = ctx.createBiquadFilter();
     filter.type = 'highpass';
     filter.frequency.value = 2000;

     const gain = ctx.createGain();
     gain.gain.value = 0.05;

     processingNode.connect(filter);
     filter.connect(gain);
     gain.connect(masterGainRef.current);

     processingNodeRef.current = { node: processingNode, gain: gain };
  };

  const stopProcessingSound = () => {
      if (processingNodeRef.current) {
          processingNodeRef.current.gain.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current!.currentTime + 0.5);
          setTimeout(() => {
            if (processingNodeRef.current?.node) {
                processingNodeRef.current.node.disconnect();
                processingNodeRef.current = null;
            }
          }, 500);
      }
  };

  // --- EVENT LISTENERS ---
  
  useEffect(() => {
    // ONE TIME listener for First Interaction to initialize Audio Engine
    const handleFirstInteraction = () => {
        if (!audioCtxRef.current) {
            initAudio();
        }
    };
    
    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);

    return () => {
        window.removeEventListener('click', handleFirstInteraction);
        window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

  useEffect(() => {
    // Global UI Interaction Listeners
    const handleMouseOver = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.closest('button') || target.closest('a') || target.tagName === 'INPUT') {
            playHoverSound();
        }
    };

    const handleClick = (e: MouseEvent) => {
        playClickSound();
    };

    const handleKeydown = (e: KeyboardEvent) => {
        // Ignore modifier keys alone
        if (['Shift', 'Control', 'Alt', 'Meta'].includes(e.key)) return;
        playKeystrokeSound();
    };

    const handleProcessingStart = () => startProcessingSound();
    const handleProcessingEnd = () => stopProcessingSound();

    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('click', handleClick);
    window.addEventListener('keydown', handleKeydown);
    window.addEventListener('neural-processing-start', handleProcessingStart);
    window.addEventListener('neural-processing-end', handleProcessingEnd);

    return () => {
        window.removeEventListener('mouseover', handleMouseOver);
        window.removeEventListener('click', handleClick);
        window.removeEventListener('keydown', handleKeydown);
        window.removeEventListener('neural-processing-start', handleProcessingStart);
        window.removeEventListener('neural-processing-end', handleProcessingEnd);
    };
  }, []);

  // Handle Mute Toggle Logic
  useEffect(() => {
      if (masterGainRef.current && audioCtxRef.current) {
          const now = audioCtxRef.current.currentTime;
          masterGainRef.current.gain.cancelScheduledValues(now);
          
          // Ensure we have a valid starting value for the ramp
          const currentValue = Math.max(masterGainRef.current.gain.value, 0.0001);
          masterGainRef.current.gain.setValueAtTime(currentValue, now);

          if (isMuted) {
              // Fade out to near-zero (exponential ramp cannot go to 0)
              masterGainRef.current.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
          } else {
              // Fade in
              // If context was suspended (some browsers), resume it
              if (audioCtxRef.current.state === 'suspended') {
                  audioCtxRef.current.resume();
              }
              masterGainRef.current.gain.exponentialRampToValueAtTime(0.4, now + 0.5);
          }
      }
  }, [isMuted]);

  return null; // No UI rendered, purely functional component handled by App.tsx state
};

export default AudioExperience;
