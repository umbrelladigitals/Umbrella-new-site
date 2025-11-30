'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Activity, ArrowRight, Clock, CheckCircle, AlertCircle, DollarSign, Archive, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Tracker {
  id: string
  slug: string
  status: string
  progress: number
  updatedAt: string
  proposal: {
    clientName: string
    projectTitle: string
    content: string
  }
}

export default function TrackerListPage() {
  const [trackers, setTrackers] = useState<Tracker[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active')

  useEffect(() => {
    fetch('/api/admin/tracker')
      .then(res => res.json())
      .then(data => {
        setTrackers(data)
        setLoading(false)
      })
  }, [])

  const getProjectRevenue = (tracker: Tracker) => {
      try {
          const content = JSON.parse(tracker.proposal.content);
          return {
              amount: content.totalPrice || 0,
              currency: content.currency || 'USD'
          }
      } catch (e) {
          return { amount: 0, currency: 'USD' }
      }
  }

  const totalRevenue = trackers.reduce((acc, curr) => {
      const rev = getProjectRevenue(curr);
      // Simple currency conversion assumption or just summing same currency for now
      // Ideally we'd handle currency conversion
      return acc + (rev.currency === 'USD' ? rev.amount : 0); 
  }, 0);

  const activeRevenue = trackers
    .filter(t => t.status === 'ACTIVE')
    .reduce((acc, curr) => acc + getProjectRevenue(curr).amount, 0);

  const completedRevenue = trackers
    .filter(t => t.status === 'COMPLETED')
    .reduce((acc, curr) => acc + getProjectRevenue(curr).amount, 0);

  const filteredTrackers = trackers.filter(t => 
      activeTab === 'active' ? t.status !== 'COMPLETED' : t.status === 'COMPLETED'
  );

  if (loading) return <div className="text-white p-8 font-mono animate-pulse">INITIALIZING TRACKING SYSTEMS...</div>

  return (
    <div className="min-h-screen text-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
            <h1 className="text-4xl font-bold font-syne mb-2">Project Nexus</h1>
            <p className="text-gray-500 font-mono text-sm tracking-widest">LIVE TRACKING & REVENUE SYSTEM</p>
        </div>
        
        {/* Revenue Stats */}
        <div className="flex gap-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 min-w-[160px]">
                <div className="text-xs text-gray-500 font-mono mb-1 uppercase">Total Pipeline</div>
                <div className="text-2xl font-bold font-display text-white">${totalRevenue.toLocaleString()}</div>
            </div>
            <div className="bg-umbrella-main/10 border border-umbrella-main/20 rounded-xl p-4 min-w-[160px]">
                <div className="text-xs text-umbrella-main/70 font-mono mb-1 uppercase">Active Value</div>
                <div className="text-2xl font-bold font-display text-umbrella-main">${activeRevenue.toLocaleString()}</div>
            </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-8 border-b border-white/10 pb-1">
          <button 
            onClick={() => setActiveTab('active')}
            className={`px-6 py-3 text-sm font-mono font-bold uppercase tracking-wider transition-all relative ${
                activeTab === 'active' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
              <div className="flex items-center gap-2">
                  <Zap size={16} className={activeTab === 'active' ? 'text-umbrella-main' : ''} />
                  Active Protocols
              </div>
              {activeTab === 'active' && (
                  <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-umbrella-main" />
              )}
          </button>
          <button 
            onClick={() => setActiveTab('completed')}
            className={`px-6 py-3 text-sm font-mono font-bold uppercase tracking-wider transition-all relative ${
                activeTab === 'completed' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
              <div className="flex items-center gap-2">
                  <Archive size={16} className={activeTab === 'completed' ? 'text-green-500' : ''} />
                  Archived / Completed
              </div>
              {activeTab === 'completed' && (
                  <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500" />
              )}
          </button>
      </div>

      <div className="grid gap-4">
        <AnimatePresence mode="popLayout">
            {filteredTrackers.map(tracker => {
                const revenue = getProjectRevenue(tracker);
                return (
                    <motion.div
                        key={tracker.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Link 
                            href={`/admin/tracker/${tracker.id}`}
                            className="block bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-umbrella-main/50 transition-all group relative overflow-hidden"
                        >
                            {/* Background Glow for High Value Projects */}
                            {revenue.amount > 10000 && (
                                <div className="absolute -right-20 -top-20 w-64 h-64 bg-umbrella-main/5 rounded-full blur-3xl group-hover:bg-umbrella-main/10 transition-all" />
                            )}

                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                                <div className="flex items-center gap-6">
                                    <div className={`
                                        w-12 h-12 rounded-full flex items-center justify-center border shrink-0
                                        ${tracker.status === 'ACTIVE' ? 'bg-umbrella-main/20 border-umbrella-main text-umbrella-main' : 
                                        tracker.status === 'COMPLETED' ? 'bg-green-500/20 border-green-500 text-green-500' : 
                                        'bg-gray-500/20 border-gray-500 text-gray-500'}
                                    `}>
                                        {tracker.status === 'COMPLETED' ? <CheckCircle size={20} /> : <Activity size={20} />}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white group-hover:text-umbrella-main transition-colors">{tracker.proposal.projectTitle}</h3>
                                        <p className="text-gray-400 text-sm font-mono">{tracker.proposal.clientName}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                                    <div className="text-right">
                                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1 flex items-center justify-end gap-1">
                                            <DollarSign size={10} /> Value
                                        </div>
                                        <div className="text-lg font-bold font-mono text-white/80">
                                            {revenue.amount.toLocaleString()} {revenue.currency}
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Progress</div>
                                        <div className="text-2xl font-bold font-display">{tracker.progress}%</div>
                                    </div>
                                    
                                    <div className="text-right hidden lg:block">
                                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Last Update</div>
                                        <div className="text-sm font-mono">{new Date(tracker.updatedAt).toLocaleDateString()}</div>
                                    </div>
                                    
                                    <ArrowRight className="text-gray-600 group-hover:text-white transition-colors" />
                                </div>
                            </div>
                            
                            {/* Progress Bar */}
                            <div className="mt-6 w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full transition-all duration-1000 ${
                                        tracker.status === 'COMPLETED' ? 'bg-green-500' : 'bg-umbrella-main'
                                    }`} 
                                    style={{ width: `${tracker.progress}%` }} 
                                />
                            </div>
                        </Link>
                    </motion.div>
                );
            })}
        </AnimatePresence>

        {filteredTrackers.length === 0 && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-12 text-center text-gray-500 font-mono bg-white/5 rounded-3xl border border-white/10"
            >
                NO {activeTab === 'active' ? 'ACTIVE' : 'COMPLETED'} PROTOCOLS FOUND
            </motion.div>
        )}
      </div>
    </div>
  )
}
