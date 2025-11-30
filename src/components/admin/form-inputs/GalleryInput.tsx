'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import FileUpload from '../FileUpload'

interface GalleryInputProps {
  name: string
  defaultValue?: string // JSON string
  onChange?: (value: string) => void
}

export default function GalleryInput({ name, defaultValue, onChange }: GalleryInputProps) {
  const [images, setImages] = useState<string[]>([])
  const [uploadKey, setUploadKey] = useState(0)

  useEffect(() => {
    if (defaultValue) {
      try {
        const parsed = JSON.parse(defaultValue)
        if (Array.isArray(parsed)) setImages(parsed)
      } catch (e) {
        console.error('Failed to parse gallery', e)
      }
    }
  }, [defaultValue])

  const updateImages = (newImages: string[]) => {
      setImages(newImages)
      if (onChange) onChange(JSON.stringify(newImages))
  }

  const removeImage = (index: number) => {
    updateImages(images.filter((_, i) => i !== index))
  }

  return (
    <div>
      <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">Project Gallery</label>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {images.map((url, index) => (
          <div key={index} className="relative group aspect-video bg-black/40 rounded-xl overflow-hidden border border-white/10">
            <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <FileUpload 
            key={uploadKey}
            label="Add Image to Gallery"
            onUpload={(url) => {
                if (url) {
                    updateImages([...images, url])
                    setUploadKey(prev => prev + 1)
                }
            }}
        />
      </div>
      <input type="hidden" name={name} value={JSON.stringify(images)} />
    </div>
  )
}
