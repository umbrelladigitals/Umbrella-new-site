'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Trash2, Search, Image as ImageIcon, File, Loader2, Check, X } from 'lucide-react'
import Notification, { NotificationType } from '../ui/Notification'

interface MediaFile {
  key: string
  url: string
  lastModified: string
  size: number
}

interface MediaLibraryProps {
  onSelect?: (url: string) => void
  className?: string
}

export default function MediaLibrary({ onSelect, className = '' }: MediaLibraryProps) {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [notification, setNotification] = useState<{ message: string, type: NotificationType, isVisible: boolean }>({
    message: '',
    type: 'info',
    isVisible: false
  })

  const showNotification = (message: string, type: NotificationType = 'info') => {
    setNotification({ message, type, isVisible: true })
  }

  const fetchFiles = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/media')
      if (!res.ok) throw new Error('Failed to fetch files')
      const data = await res.json()
      setFiles(data.files)
    } catch (error) {
      console.error(error)
      showNotification('Failed to load media library', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFiles()
  }, [])

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0])
    }
  }

  const handleUpload = async (file: File) => {
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

      // 2. Upload File to R2
      const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': contentType,
        },
      })

      if (!uploadRes.ok) throw new Error('Failed to upload file')

      showNotification('File uploaded successfully', 'success')
      fetchFiles() // Refresh list
    } catch (error) {
      console.error(error)
      showNotification('Upload failed', 'error')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (key: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent selection when clicking delete
    if (!confirm('Are you sure you want to delete this file?')) return

    try {
      const res = await fetch('/api/admin/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key }),
      })

      if (!res.ok) throw new Error('Failed to delete file')

      setFiles(prev => prev.filter(f => f.key !== key))
      showNotification('File deleted successfully', 'success')
    } catch (error) {
      console.error(error)
      showNotification('Failed to delete file', 'error')
    }
  }

  const filteredFiles = files.filter(file => 
    file.key.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const isImage = (url: string) => {
    return url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)
  }

  const isVideo = (url: string) => {
    return url.match(/\.(mp4|webm|ogg|mov)$/i)
  }

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <Notification 
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
      />

      {/* Header / Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6 p-1">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input 
            type="text" 
            placeholder="Search files..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:border-umbrella-main/50 outline-none transition-colors"
          />
        </div>
        
        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full md:w-auto bg-white text-black px-6 py-2 rounded-xl font-bold hover:bg-umbrella-main hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
        >
          {uploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
          <span>Upload New</span>
        </button>
        <input 
          ref={fileInputRef}
          type="file"
          onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
          className="hidden"
        />
      </div>

      {/* Drop Zone & Grid */}
      <div 
        className={`
          flex-1 overflow-y-auto rounded-2xl border-2 border-dashed transition-all p-4
          ${dragActive ? 'border-umbrella-main bg-umbrella-main/5' : 'border-white/5 bg-black/20'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {loading ? (
          <div className="h-full flex items-center justify-center text-gray-500 gap-2">
            <Loader2 className="animate-spin" />
            <span>Loading library...</span>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-4">
            <div className="p-4 rounded-full bg-white/5">
                <ImageIcon size={32} />
            </div>
            <p>No files found. Drag & drop to upload.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredFiles.map((file) => (
              <motion.div
                key={file.key}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="group relative aspect-square rounded-xl overflow-hidden bg-black/40 border border-white/5 hover:border-umbrella-main/50 transition-all cursor-pointer"
                onClick={() => onSelect?.(file.url)}
              >
                {isImage(file.url) ? (
                  <img src={file.url} alt={file.key} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                ) : isVideo(file.url) ? (
                  <video src={file.url} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <File size={32} />
                  </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                    <div className="flex justify-end">
                        <button 
                            onClick={(e) => handleDelete(file.key, e)}
                            className="p-2 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-colors"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                    
                    <div className="text-xs text-white/80 truncate font-mono">
                        {file.key.split('-').slice(1).join('-') || file.key}
                    </div>
                </div>

                {/* Selection Indicator (if needed) */}
                {onSelect && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                        <div className="bg-umbrella-main text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                            Select
                        </div>
                    </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
