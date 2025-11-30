'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles } from 'lucide-react'
import MediaLibrary from './MediaLibrary'

interface MediaModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (url: string) => void
}

export default function MediaModal({ isOpen, onClose, onSelect }: MediaModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-neutral-950/90 backdrop-blur-xl"
      />

      {/* Modal Container */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative w-full max-w-5xl h-[80vh] bg-neutral-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-black/50 flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-neutral-900/50 backdrop-blur-md z-10">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-umbrella-main/10 rounded-lg text-umbrella-main">
                    <Sparkles size={20} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white">Media Center</h2>
                    <p className="text-xs text-gray-500 font-mono uppercase tracking-wider">Select or Upload Assets</p>
                </div>
            </div>
            
            <button 
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"
            >
                <X size={24} />
            </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden p-6 bg-neutral-900/50">
            <MediaLibrary 
                onSelect={(url) => {
                    onSelect(url)
                    onClose()
                }} 
                className="h-full"
            />
        </div>
      </motion.div>
    </div>
  )
}
