'use client'

import { useState, useEffect } from 'react'
import { X, Plus } from 'lucide-react'

interface ResultItem {
  label: string
  value: string
}

interface ResultsInputProps {
  name: string
  defaultValue?: string // JSON string
  label: string
  onChange?: (value: string) => void
}

export default function ResultsInput({ name, defaultValue, label, onChange }: ResultsInputProps) {
  const [results, setResults] = useState<ResultItem[]>([])
  const [newLabel, setNewLabel] = useState('')
  const [newValue, setNewValue] = useState('')

  useEffect(() => {
    if (defaultValue) {
      try {
        const parsed = JSON.parse(defaultValue)
        if (Array.isArray(parsed)) setResults(parsed)
      } catch (e) {
        console.error('Failed to parse results', e)
      }
    }
  }, [defaultValue])

  const updateResults = (newResults: ResultItem[]) => {
      setResults(newResults)
      if (onChange) onChange(JSON.stringify(newResults))
  }

  const addResult = () => {
    if (newLabel.trim() && newValue.trim()) {
      updateResults([...results, { label: newLabel.trim(), value: newValue.trim() }])
      setNewLabel('')
      setNewValue('')
    }
  }

  const removeResult = (index: number) => {
    updateResults(results.filter((_, i) => i !== index))
  }

  return (
    <div>
      <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">{label}</label>
      
      <div className="space-y-3 mb-4">
        {results.map((item, index) => (
          <div key={index} className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/5">
            <div className="flex-1">
                <div className="text-xs text-gray-500 uppercase tracking-wider">Label</div>
                <div className="font-bold">{item.label}</div>
            </div>
            <div className="flex-1">
                <div className="text-xs text-gray-500 uppercase tracking-wider">Value</div>
                <div className="font-mono text-umbrella-main">{item.value}</div>
            </div>
            <button
              type="button"
              onClick={() => removeResult(index)}
              className="text-gray-500 hover:text-red-400 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-black/20 p-4 rounded-xl border border-white/10">
        <input
          type="text"
          value={newLabel}
          onChange={e => setNewLabel(e.target.value)}
          placeholder="Label (e.g. ROI)"
          className="bg-transparent border-b border-white/10 p-2 text-white focus:border-umbrella-main outline-none transition-colors"
        />
        <div className="flex gap-2">
            <input
            type="text"
            value={newValue}
            onChange={e => setNewValue(e.target.value)}
            placeholder="Value (e.g. 250%)"
            className="flex-1 bg-transparent border-b border-white/10 p-2 text-white focus:border-umbrella-main outline-none transition-colors"
            />
            <button
            type="button"
            onClick={addResult}
            className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-colors"
            >
            <Plus size={20} />
            </button>
        </div>
      </div>
      <input type="hidden" name={name} value={JSON.stringify(results)} />
    </div>
  )
}
