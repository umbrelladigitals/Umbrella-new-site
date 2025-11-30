
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Twitter, Linkedin, Brain, Terminal, Palette, X, Fingerprint, Dna, Code2, Award, Quote, Database, Feather, Server } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

// Define the interface for a team member
interface TeamMember {
    id: string;
    name: string;
    role: string;
    element: string;
    icon: string;
    image: string;
    bio: string;
    fullBio: string;
    quote: string;
    stats: { label: string; val: number }[];
    expertises: string[];
}

// Icon Mapping Helper
const getIcon = (key: string) => {
    switch(key) {
        case 'brain': return <Brain size={20} />;
        case 'terminal': return <Terminal size={20} />;
        case 'database': return <Database size={20} />;
        case 'server': return <Server size={20} />;
        case 'feather': return <Feather size={20} />;
        case 'palette': return <Palette size={20} />;
        default: return <Brain size={20} />;
    }
}

const TeamPage: React.FC = () => {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const { t } = useLanguage();
  
  const members = t.teamPage.members;

  return (
    <div className="min-h-screen text-white pt-32 pb-20 relative">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header */}
        <header className="mb-24 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center gap-4 mb-8"
          >
             <div className="h-[1px] w-12 bg-umbrella-main"></div>
             <span className="font-mono text-umbrella-main tracking-widest uppercase text-sm">{t.teamPage.header.subtitle}</span>
             <div className="h-[1px] w-12 bg-umbrella-main"></div>
          </motion.div>
          
          <h1 className="text-6xl md:text-9xl font-display font-black leading-[0.9] tracking-tighter mb-8">
            {t.teamPage.header.titleMain} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-600">{t.teamPage.header.titleSub}</span>
          </h1>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              {t.teamPage.header.description}
          </p>
        </header>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 justify-center">
            {members.map((member: TeamMember, index: number) => (
                <TeamCard 
                    key={index} 
                    member={member} 
                    index={index} 
                    onClick={() => setSelectedMember(member)}
                    expandText={t.teamPage.card.expand}
                />
            ))}
        </div>

      </div>

      {/* Modal Overlay */}
      <AnimatePresence>
        {selectedMember && (
            <TeamMemberModal member={selectedMember} onClose={() => setSelectedMember(null)} labels={t.teamPage.modal} />
        )}
      </AnimatePresence>
    </div>
  );
};

const TeamCard: React.FC<{ member: TeamMember, index: number, onClick: () => void, expandText: string }> = ({ member, index, onClick, expandText }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            onClick={onClick}
            className="group relative h-[500px] perspective-1000 cursor-pointer"
        >
            <div className="relative w-full h-full bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden transition-all duration-500 hover:border-umbrella-main/50 hover:shadow-[0_0_30px_rgba(225,29,72,0.2)]">
                
                {/* Image */}
                <div className="absolute inset-0 h-3/5 overflow-hidden">
                    <div className="absolute inset-0 bg-umbrella-main/20 mix-blend-overlay z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <img 
                        src={member.image} 
                        alt={member.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent z-10"></div>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 w-full h-2/5 p-6 flex flex-col justify-between bg-neutral-900/90 backdrop-blur-sm border-t border-white/5 group-hover:bg-neutral-900/95 transition-colors">
                    <div>
                         <div className="flex justify-between items-start mb-2">
                             <div>
                                 <h3 className="text-2xl font-display font-bold text-white">{member.name}</h3>
                                 <p className="text-umbrella-main font-mono text-xs uppercase tracking-widest">{member.role}</p>
                             </div>
                             <div className="p-2 bg-white/5 rounded-lg text-neutral-400 group-hover:text-white transition-colors border border-white/5">
                                 {getIcon(member.icon)}
                             </div>
                         </div>
                    </div>

                    {/* Simple Stats for Card View */}
                    <div className="space-y-3">
                         {member.stats.slice(0, 2).map((stat, i) => (
                             <div key={i} className="flex items-center gap-3 text-xs font-mono">
                                 <span className="w-16 text-neutral-500">{stat.label}</span>
                                 <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                                     <motion.div 
                                        className="h-full bg-umbrella-main"
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${stat.val}%` }}
                                        transition={{ delay: 0.5 + (i * 0.1), duration: 1 }}
                                     />
                                 </div>
                             </div>
                         ))}
                         <div className="text-right text-xs text-neutral-500 group-hover:text-white transition-colors mt-2">
                             {expandText}
                         </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

// --- Detailed Modal Component ---
const TeamMemberModal: React.FC<{ member: TeamMember, onClose: () => void, labels: any }> = ({ member, onClose, labels }) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            
            {/* Backdrop */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />

            {/* Modal Content */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-5xl bg-neutral-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
            >
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-white hover:text-black rounded-full text-white transition-colors border border-white/10"
                >
                    <X size={20} />
                </button>

                {/* Left: Visuals */}
                <div className="w-full md:w-2/5 relative h-64 md:h-auto overflow-hidden bg-black shrink-0">
                    <img 
                        src={member.image} 
                        alt={member.name} 
                        className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent opacity-90" />
                    <div className="absolute inset-0 bg-umbrella-main/10 mix-blend-overlay" />
                    
                    {/* Data Overlay */}
                    <div className="absolute bottom-6 left-6 right-6">
                        <div className="flex items-center gap-2 text-umbrella-main font-mono text-xs uppercase tracking-widest mb-2">
                             <Fingerprint size={16} /> {labels.idPrefix}: {member.name.split(' ')[0].toUpperCase()}_00{Math.floor(Math.random() * 99)}
                        </div>
                        {/* Reduced Font Size to prevent overflow */}
                        <div className="text-2xl sm:text-3xl md:text-4xl font-display font-black text-white leading-tight mb-2">
                            {member.name.toUpperCase()}
                        </div>
                        <div className="text-neutral-400 font-mono text-sm leading-tight">
                            {member.role} // {labels.classPrefix}: {member.element}
                        </div>
                    </div>
                </div>

                {/* Right: Info */}
                <div className="w-full md:w-3/5 p-8 md:p-12 overflow-y-auto custom-scrollbar relative">
                    {/* Noise Texture */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none"></div>

                    <div className="relative z-10 space-y-10">
                        
                        {/* Quote */}
                        <div className="border-l-2 border-umbrella-main pl-6 italic text-xl md:text-2xl text-white font-light opacity-90">
                            <Quote size={24} className="text-umbrella-main mb-2 opacity-50" />
                            "{member.quote}"
                        </div>

                        {/* Bio */}
                        <div>
                             <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4 flex items-center gap-2">
                                <Dna size={16} /> {labels.bioHeader}
                             </h4>
                             <p className="text-neutral-300 leading-relaxed text-lg">
                                 {member.fullBio}
                             </p>
                        </div>

                        {/* Expertise Tags */}
                        <div>
                             <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4 flex items-center gap-2">
                                <Code2 size={16} /> {labels.skillsHeader}
                             </h4>
                             <div className="flex flex-wrap gap-2">
                                 {member.expertises.map(skill => (
                                     <span key={skill} className="px-3 py-1.5 border border-white/10 bg-white/5 rounded-lg text-sm text-neutral-300 font-mono">
                                         {skill}
                                     </span>
                                 ))}
                             </div>
                        </div>

                        {/* Stats Visualization */}
                        <div>
                             <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4 flex items-center gap-2">
                                <Award size={16} /> {labels.statsHeader}
                             </h4>
                             <div className="space-y-4">
                                {member.stats.map((stat, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between text-xs font-mono mb-1">
                                            <span className="text-white">{stat.label}</span>
                                            <span className="text-umbrella-main">{stat.val}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                            <motion.div 
                                                className="h-full bg-gradient-to-r from-umbrella-main to-red-900"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${stat.val}%` }}
                                                transition={{ delay: 0.2 + (i * 0.1), duration: 1, ease: "circOut" }}
                                            />
                                        </div>
                                    </div>
                                ))}
                             </div>
                        </div>

                        {/* Social Footer */}
                        <div className="pt-8 border-t border-white/10 flex gap-4">
                            <a href="#" className="flex items-center gap-2 text-neutral-500 hover:text-white transition-colors text-sm uppercase tracking-wider">
                                <Twitter size={16} /> @{member.name.split(' ')[0].toLowerCase().replace(' ', '')}
                            </a>
                            <a href="#" className="flex items-center gap-2 text-neutral-500 hover:text-white transition-colors text-sm uppercase tracking-wider">
                                <Linkedin size={16} /> {labels.connect}
                            </a>
                        </div>

                    </div>
                </div>

            </motion.div>
        </div>
    );
}

export default TeamPage;
