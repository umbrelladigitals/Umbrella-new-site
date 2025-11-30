import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface SelectOption {
  value: string
  label: string
  className?: string
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size' | 'onChange'> {
  label?: string
  options: SelectOption[]
  containerClassName?: string
  icon?: React.ReactNode
  variant?: 'default' | 'pill'
  onChange?: (e: { target: { value: string } }) => void
}

export default function Select({ 
  label, 
  options, 
  className = '', 
  containerClassName = '', 
  icon,
  variant = 'default',
  value,
  onChange,
  disabled,
  ...props 
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find(opt => opt.value === value) || options[0]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (newValue: string) => {
    if (onChange) {
      onChange({ target: { value: newValue } })
    }
    setIsOpen(false)
  }
  
  const baseStyles = "w-full outline-none transition-all cursor-pointer font-mono flex items-center justify-between"
  
  const variants = {
    default: "bg-black/20 border border-white/10 rounded-xl pl-4 pr-4 py-3 text-white hover:border-umbrella-main/50 text-sm",
    pill: "rounded-full pl-4 pr-4 py-2 text-xs font-bold uppercase tracking-wider border border-transparent hover:border-white/20"
  }

  // Extract custom text color classes from className if present to apply to the trigger
  // This is a bit of a hack to support the dynamic coloring in the proposals page
  const triggerClassName = className

  return (
    <div className={`relative ${containerClassName}`} ref={containerRef}>
      {label && <label className="block text-xs font-mono text-gray-500 mb-1 uppercase">{label}</label>}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none z-10">
            {icon}
          </div>
        )}
        
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`${baseStyles} ${variants[variant]} ${icon ? 'pl-10' : ''} ${triggerClassName} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={disabled}
        >
          <span className="truncate">{selectedOption?.label || value}</span>
          <ChevronDown size={14} className={`text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.1 }}
              className="absolute top-full left-0 right-0 mt-2 z-50 min-w-[200px]"
            >
              <div className="bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl max-h-[300px] overflow-y-auto">
                {options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    className={`w-full text-left px-4 py-3 text-sm font-mono transition-colors flex items-center justify-between group ${
                      option.value === value 
                        ? 'bg-white/10 text-white' 
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    } ${option.className || ''}`}
                  >
                    <span className={option.className?.includes('text-') ? '' : ''}>{option.label}</span>
                    {option.value === value && (
                      <Check size={14} className="text-umbrella-main" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
