'use client'

import { motion } from 'framer-motion'
import MediaLibrary from '@/components/admin/MediaLibrary'

export default function MediaPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-bold text-white mb-2">Media Center</h1>
          <p className="text-gray-400">Manage your digital assets and uploads.</p>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 min-h-[600px]">
        <MediaLibrary className="h-[calc(100vh-300px)]" />
      </div>
    </div>
  )
}
