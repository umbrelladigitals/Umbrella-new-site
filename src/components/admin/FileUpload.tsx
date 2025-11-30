'use client'

import { useState, useRef, useEffect } from 'react'
import { Upload, X, Loader2, Grid } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import MediaModal from './MediaModal'

interface FileUploadProps {
  onUpload: (url: string) => void
  onError?: (message: string) => void
  onMetadataChange?: (metadata: { size: string, type: string, name: string }) => void
  defaultValue?: string
  label?: string
  className?: string
  accept?: string
}

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export default function FileUpload({ 
  onUpload, 
  onError,
  onMetadataChange,
  defaultValue = '', 
  label = 'File', 
  className = '',
  accept = 'image/*'
}: FileUploadProps) {
  const [preview, setPreview] = useState(defaultValue)
  const [uploading, setUploading] = useState(false)
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setPreview(defaultValue)
  }, [defaultValue])

  const isVideo = (url: string) => {
    return url.match(/\.(mp4|webm|ogg|mov)$/i)
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (onMetadataChange) {
        onMetadataChange({
            size: formatBytes(file.size),
            type: file.type,
            name: file.name
        })
    }

    setUploading(true)

    try {
      const contentType = file.type || 'application/octet-stream'
      
      // 1. Get Presigned URL
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          contentType,
        }),
      })

      if (!res.ok) throw new Error('Failed to get upload URL')

      const { uploadUrl, fileUrl } = await res.json()
      console.log('Uploading to:', uploadUrl)

      // 2. Upload File to R2
      const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': contentType,
        },
      })

      if (!uploadRes.ok) {
        console.error('Upload response:', uploadRes.status, uploadRes.statusText)
        throw new Error(`Failed to upload file: ${uploadRes.statusText}`)
      }

      // 3. Update State
      setPreview(fileUrl)
      onUpload(fileUrl)
    } catch (error) {
      console.error('Upload error:', error)
      if (onError) {
        onError('Upload failed. Please try again.')
      } else {
        alert('Upload failed. Please try again.')
      }
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemove = () => {
    setPreview('')
    onUpload('')
  }

  const handleMediaSelect = (url: string) => {
    setPreview(url)
    onUpload(url)
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-xs font-mono text-gray-400 uppercase">{label}</label>
      
      <div className="relative group">
        <AnimatePresence mode="wait">
          {preview ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative aspect-video w-full rounded-xl overflow-hidden border border-white/10 bg-black/20"
            >
              {isVideo(preview) ? (
                <video src={preview} className="w-full h-full object-cover" controls />
              ) : (
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              )}
              
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => setIsMediaModalOpen(true)}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                  title="Select from Library"
                >
                  <Grid size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                  title="Change File"
                >
                  <Upload size={20} />
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="p-2 bg-red-500/20 hover:bg-red-500/40 text-red-500 rounded-full transition-colors"
                  title="Remove File"
                >
                  <X size={20} />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`
                aspect-video w-full rounded-xl border-2 border-dashed border-white/10 bg-white/5 
                flex flex-col items-center justify-center gap-4
                hover:border-umbrella-main/50 hover:bg-white/10 transition-all
                ${uploading ? 'pointer-events-none opacity-50' : ''}
              `}
            >
              {uploading ? (
                <Loader2 className="animate-spin text-umbrella-main" size={32} />
              ) : (
                <>
                  <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-white/5 transition-colors"
                    >
                        <div className="p-3 rounded-full bg-white/5">
                            <Upload className="text-gray-400" size={24} />
                        </div>
                        <span className="text-xs font-bold text-white">Upload New</span>
                    </button>

                    <div className="w-px bg-white/10 my-2"></div>

                    <button
                        type="button"
                        onClick={() => setIsMediaModalOpen(true)}
                        className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-white/5 transition-colors"
                    >
                        <div className="p-3 rounded-full bg-white/5">
                            <Grid className="text-gray-400" size={24} />
                        </div>
                        <span className="text-xs font-bold text-white">Select Media</span>
                    </button>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">
                        {accept === 'image/*' ? 'SVG, PNG, JPG or GIF' : 'Video or Image'}
                    </p>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      <MediaModal 
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelect={handleMediaSelect}
      />
    </div>
  )
}
