'use client'

import { useState, useEffect } from 'react'
import { X, Plus } from 'lucide-react'

interface TagInputProps {
  name: string
  defaultValue?: string // JSON string
  label: string
  onChange?: (value: string) => void
}

export default function TagInput({ name, defaultValue, label, onChange }: TagInputProps) {
  const [tags, setTags] = useState<string[]>([])
  const [input, setInput] = useState('')

  useEffect(() => {
    if (defaultValue) {
      try {
        const parsed = JSON.parse(defaultValue)
        if (Array.isArray(parsed)) setTags(parsed)
      } catch (e) {
        console.error('Failed to parse tags', e)
      }
    }
  }, [defaultValue])

  const updateTags = (newTags: string[]) => {
      setTags(newTags)
      if (onChange) onChange(JSON.stringify(newTags))
  }

  const addTag = () => {
    if (input.trim() && !tags.includes(input.trim())) {
      updateTags([...tags, input.trim()])
      setInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    updateTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  return (
    <div>
      <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">{label}</label>
      <div className="flex flex-wrap gap-2 mb-3">
        {tags.map(tag => (
          <span key={tag} className="bg-white/10 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
            {tag}
            <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-400">
              <X size={14} />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type and press Enter..."
          className="flex-1 bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-umbrella-main/50 outline-none transition-colors"
        />
        <button
          type="button"
          onClick={addTag}
          className="bg-white/10 hover:bg-white/20 text-white p-4 rounded-xl transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>
      <input type="hidden" name={name} value={JSON.stringify(tags)} />
    </div>
  )
}
