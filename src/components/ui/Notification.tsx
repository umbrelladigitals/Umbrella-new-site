'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Check, AlertCircle, X, Info, AlertTriangle } from 'lucide-react'
import { useEffect } from 'react'

export type NotificationType = 'success' | 'error' | 'info' | 'warning'

interface NotificationProps {
  message: string
  type?: NotificationType
  isVisible: boolean
  onClose: () => void
}

export default function Notification({ message, type = 'info', isVisible, onClose }: NotificationProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 5000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-8 right-8 z-[200] flex items-center gap-4 px-6 py-4 rounded-2xl bg-neutral-900/90 border border-white/10 backdrop-blur-xl shadow-2xl shadow-black/50 max-w-md"
        >
          <div className={`p-2 rounded-full ${
            type === 'success' ? 'bg-emerald-500/20 text-emerald-500' :
            type === 'error' ? 'bg-red-500/20 text-red-500' :
            type === 'warning' ? 'bg-yellow-500/20 text-yellow-500' :
            'bg-blue-500/20 text-blue-500'
          }`}>
            {type === 'success' && <Check size={18} />}
            {type === 'error' && <AlertCircle size={18} />}
            {type === 'warning' && <AlertTriangle size={18} />}
            {type === 'info' && <Info size={18} />}
          </div>
          
          <p className="text-sm font-medium text-white">{message}</p>
          
          <button 
            onClick={onClose}
            className="ml-auto p-1 text-neutral-500 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
          
          {/* Progress bar for auto-dismiss */}
          <motion.div 
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: 5, ease: "linear" }}
            className={`absolute bottom-0 left-6 right-6 h-[2px] origin-left ${
                type === 'success' ? 'bg-emerald-500/50' :
                type === 'error' ? 'bg-red-500/50' :
                type === 'warning' ? 'bg-yellow-500/50' :
                'bg-blue-500/50'
            }`}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
