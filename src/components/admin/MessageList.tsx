'use client'

import { useState, useMemo } from 'react'
import { Message } from '@prisma/client'
import { Trash2, Phone, User, Calendar, Mail, X, MessageSquare, Clock, Globe, Search, Filter, Inbox, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface MessageListProps {
  messages: Message[]
  onDelete: (id: number) => Promise<void>
}

type FilterType = 'all' | 'unread' | 'read'

export default function MessageList({ messages, onDelete }: MessageListProps) {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [filter, setFilter] = useState<FilterType>('all')
  const [search, setSearch] = useState('')

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    if (confirm('Are you sure you want to delete this transmission?')) {
        setDeletingId(id)
        await onDelete(id)
        setDeletingId(null)
        if (selectedMessage?.id === id) setSelectedMessage(null)
    }
  }

  const filteredMessages = useMemo(() => {
    return messages.filter(msg => {
      const matchesSearch = 
        msg.name.toLowerCase().includes(search.toLowerCase()) ||
        msg.email?.toLowerCase().includes(search.toLowerCase()) ||
        msg.subject?.toLowerCase().includes(search.toLowerCase()) ||
        msg.summary.toLowerCase().includes(search.toLowerCase())
      
      const matchesFilter = 
        filter === 'all' ? true :
        filter === 'unread' ? !msg.isRead :
        msg.isRead

      return matchesSearch && matchesFilter
    })
  }, [messages, search, filter])

  const groupedMessages = useMemo(() => {
    const groups: { [key: string]: Message[] } = {
      'Today': [],
      'Yesterday': [],
      'This Week': [],
      'Older': []
    }

    filteredMessages.forEach(msg => {
      const date = new Date(msg.createdAt)
      const now = new Date()
      const diffTime = Math.abs(now.getTime() - date.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays <= 1) groups['Today'].push(msg)
      else if (diffDays <= 2) groups['Yesterday'].push(msg)
      else if (diffDays <= 7) groups['This Week'].push(msg)
      else groups['Older'].push(msg)
    })

    return groups
  }, [filteredMessages])

  return (
    <>
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Search transmissions..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:border-umbrella-main/50 outline-none font-mono text-sm transition-all"
          />
        </div>
        
        <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 gap-1">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${filter === 'all' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
          >
            <Inbox size={14} /> All
          </button>
          <button 
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${filter === 'unread' ? 'bg-umbrella-main text-white' : 'text-gray-400 hover:text-white'}`}
          >
            <div className="w-2 h-2 rounded-full bg-umbrella-main" /> Unread
          </button>
          <button 
            onClick={() => setFilter('read')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${filter === 'read' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            <CheckCircle2 size={14} /> Read
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {Object.entries(groupedMessages).map(([group, msgs]) => (
          msgs.length > 0 && (
            <div key={group}>
              <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-gray-500" />
                {group}
                <span className="text-gray-700">({msgs.length})</span>
              </h3>
              <div className="grid gap-4">
                {msgs.map(msg => (
                  <motion.div 
                    layoutId={`message-${msg.id}`}
                    key={msg.id} 
                    onClick={() => setSelectedMessage(msg)}
                    className={`
                      relative rounded-2xl border p-6 transition-all group cursor-pointer overflow-hidden
                      ${msg.isRead 
                        ? 'bg-white/5 border-white/5 hover:border-white/20' 
                        : 'bg-white/10 border-umbrella-main/30 hover:border-umbrella-main hover:shadow-[0_0_30px_-10px_rgba(var(--umbrella-main-rgb),0.3)]'
                      }
                    `}
                  >
                      {/* Unread Indicator */}
                      {!msg.isRead && (
                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-umbrella-main/20 to-transparent rounded-bl-full -mr-8 -mt-8" />
                      )}

                      <div className="flex justify-between items-start mb-4 relative z-10">
                          <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold border shrink-0 ${msg.isRead ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-umbrella-main/20 border-umbrella-main/50 text-umbrella-main'}`}>
                                  {msg.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                  <h3 className={`font-syne text-lg ${msg.isRead ? 'font-medium text-gray-300' : 'font-bold text-white'}`}>{msg.name}</h3>
                                  <div className="flex items-center gap-3 text-xs text-gray-400 font-mono mt-1">
                                      {msg.email && (
                                          <span className="flex items-center gap-1">
                                              <Mail size={10} />
                                              {msg.email}
                                          </span>
                                      )}
                                      <span className="w-1 h-1 rounded-full bg-gray-600" />
                                      <span className="flex items-center gap-1">
                                          <Clock size={10} />
                                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                      </span>
                                  </div>
                              </div>
                          </div>
                          <button 
                            onClick={(e) => handleDelete(e, msg.id)}
                            disabled={deletingId === msg.id}
                            className="p-2 rounded-full hover:bg-red-500/20 text-gray-400 hover:text-red-500 transition-colors z-20 opacity-0 group-hover:opacity-100"
                          >
                              {deletingId === msg.id ? <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" /> : <Trash2 size={18} />}
                          </button>
                      </div>
                      
                      <div className="pl-16 relative z-10">
                        {msg.subject && (
                            <div className={`mb-2 text-sm font-syne ${msg.isRead ? 'text-gray-400' : 'text-white font-bold'}`}>
                                {msg.subject}
                            </div>
                        )}
                        <p className={`text-sm line-clamp-2 font-light ${msg.isRead ? 'text-gray-500' : 'text-gray-300'}`}>{msg.summary}</p>
                      </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )
        ))}
        
        {filteredMessages.length === 0 && (
          <div className="p-12 text-center text-gray-500 font-mono bg-white/5 rounded-3xl border border-white/10 flex flex-col items-center gap-4">
            <MessageSquare size={48} className="opacity-20" />
            NO TRANSMISSIONS FOUND
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedMessage && (
            <>
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSelectedMessage(null)}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                />
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                    <motion.div 
                        layoutId={`message-${selectedMessage.id}`}
                        className="w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl pointer-events-auto flex flex-col max-h-[90vh]"
                    >
                        {/* Header */}
                        <div className="p-8 border-b border-white/10 bg-white/5 relative">
                            <button 
                                onClick={() => setSelectedMessage(null)}
                                className="absolute top-6 right-6 p-2 rounded-full bg-black/20 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 rounded-full bg-umbrella-main/20 border border-umbrella-main/50 flex items-center justify-center text-3xl font-bold text-umbrella-main shadow-[0_0_30px_-10px_rgba(var(--umbrella-main-rgb),0.5)]">
                                    {selectedMessage.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <div className="text-xs font-mono text-umbrella-main mb-2 uppercase tracking-widest">Incoming Transmission</div>
                                    <h2 className="text-3xl font-bold font-syne text-white mb-2">{selectedMessage.name}</h2>
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-400 font-mono">
                                        <span className="flex items-center gap-2">
                                            <Calendar size={14} />
                                            {new Date(selectedMessage.createdAt).toLocaleDateString()}
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <Clock size={14} />
                                            {new Date(selectedMessage.createdAt).toLocaleTimeString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="p-8 overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                {selectedMessage.email && (
                                    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-2">
                                            <Mail size={12} /> Email
                                        </div>
                                        <a href={`mailto:${selectedMessage.email}`} className="text-white hover:text-umbrella-main transition-colors font-mono text-sm break-all">
                                            {selectedMessage.email}
                                        </a>
                                    </div>
                                )}
                                {selectedMessage.phone && (
                                    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-2">
                                            <Phone size={12} /> Phone
                                        </div>
                                        <a href={`tel:${selectedMessage.phone}`} className="text-white hover:text-umbrella-main transition-colors font-mono text-sm">
                                            {selectedMessage.phone}
                                        </a>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                {selectedMessage.subject && (
                                    <div>
                                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Subject</div>
                                        <div className="text-xl font-bold text-white font-syne">{selectedMessage.subject}</div>
                                    </div>
                                )}
                                
                                <div className="bg-white/5 rounded-2xl p-6 border border-white/10 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-umbrella-main" />
                                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-4">Message Content</div>
                                    <p className="text-gray-200 leading-relaxed whitespace-pre-wrap font-light text-lg">
                                        {selectedMessage.summary}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-white/10 bg-white/5 flex justify-between items-center">
                            <div className="text-xs font-mono text-gray-500">
                                ID: #{selectedMessage.id.toString().padStart(6, '0')}
                            </div>
                            <div className="flex gap-3">
                                <a 
                                    href={`mailto:${selectedMessage.email}`}
                                    className="px-6 py-3 rounded-full bg-white text-black font-bold hover:bg-umbrella-main hover:text-white transition-all flex items-center gap-2 text-sm"
                                >
                                    <Mail size={16} />
                                    Reply via Email
                                </a>
                                <button 
                                    onClick={(e) => handleDelete(e, selectedMessage.id)}
                                    className="px-4 py-3 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all flex items-center gap-2 text-sm font-bold"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </>
        )}
      </AnimatePresence>
    </>
  )
}
