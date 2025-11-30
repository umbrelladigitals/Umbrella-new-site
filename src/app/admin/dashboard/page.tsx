import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { 
  LayoutGrid, 
  Layers, 
  FileText, 
  MessageSquare, 
  ArrowRight, 
  Clock, 
  Calendar,
  Sparkles,
  Activity
} from 'lucide-react'

export default async function DashboardPage() {
  const [
    projectCount, 
    serviceCount, 
    postCount, 
    messageCount,
    recentPosts,
    recentMessages
  ] = await Promise.all([
    prisma.project.count(),
    prisma.service.count(),
    prisma.post.count(),
    prisma.message.count(),
    prisma.post.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, titleEn: true, published: true, createdAt: true, slug: true }
    }),
    prisma.message.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, subject: true, createdAt: true, isRead: true }
    })
  ])

  const stats = [
    { label: 'Forged Artifacts', value: projectCount, icon: Layers, href: '/admin/projects', color: 'text-blue-400', sub: 'Active Projects' },
    { label: 'Transmutations', value: serviceCount, icon: LayoutGrid, href: '/admin/services', color: 'text-purple-400', sub: 'Services Online' },
    { label: 'Grimoire Entries', value: postCount, icon: FileText, href: '/admin/posts', color: 'text-emerald-400', sub: 'Chronicles' },
    { label: 'Ether Whispers', value: messageCount, icon: MessageSquare, href: '/admin/messages', color: 'text-amber-400', sub: 'Messages' },
  ]

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      
      <div className="relative z-10">
        <div className="flex justify-between items-end mb-12">
            <div>
                <div className="flex items-center gap-2 text-umbrella-main mb-2">
                    <Sparkles size={16} />
                    <span className="text-xs font-mono uppercase tracking-widest">Nexus Control</span>
                </div>
                <h1 className="text-5xl font-bold font-syne bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/50">Alchemist's Dashboard</h1>
            </div>
            <div className="text-right hidden md:block">
                <div className="text-2xl font-bold font-mono text-white/80">{new Date().toLocaleTimeString()}</div>
                <div className="text-sm text-gray-500 font-mono flex items-center justify-end gap-2">
                    <Activity size={12} className="text-green-500 animate-pulse" />
                    SYSTEM OPERATIONAL
                </div>
            </div>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <Link 
                key={i} 
                href={stat.href}
                className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:border-umbrella-main/50 hover:bg-white/10 transition-all group relative overflow-hidden"
            >
                <div className={`absolute -right-6 -top-6 p-8 opacity-10 group-hover:opacity-20 transition-opacity ${stat.color} blur-xl rounded-full bg-current`}></div>
                
                <div className="relative z-10">
                    <div className={`mb-4 ${stat.color} p-3 bg-white/5 rounded-xl w-fit border border-white/5 group-hover:scale-110 transition-transform duration-500`}>
                        <stat.icon size={24} />
                    </div>
                    <h2 className="text-sm font-bold text-white font-syne uppercase tracking-wide mb-1">
                        {stat.label}
                    </h2>
                    <p className="text-xs text-gray-500 font-mono mb-4 uppercase tracking-wider">{stat.sub}</p>
                    <p className="text-4xl font-bold text-white group-hover:text-umbrella-main transition-colors font-syne">{stat.value}</p>
                </div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Recent Chronicles */}
            <div className="bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden flex flex-col shadow-2xl">
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <h3 className="font-bold font-syne text-lg flex items-center gap-2 text-emerald-400">
                        <FileText size={18} />
                        Latest Grimoire Entries
                    </h3>
                    <Link href="/admin/posts" className="text-xs font-mono text-gray-400 hover:text-white flex items-center gap-1 transition-colors group">
                        VIEW ALL <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
                <div className="p-6 flex-1">
                    {recentPosts.length > 0 ? (
                        <div className="space-y-4">
                            {recentPosts.map(post => (
                                <div key={post.id} className="flex items-center justify-between group p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-2 h-2 rounded-full ${post.published ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-yellow-500'}`} />
                                        <div>
                                            <div className="font-bold text-sm text-gray-200 group-hover:text-white transition-colors line-clamp-1 font-syne">{post.titleEn}</div>
                                            <div className="text-xs text-gray-500 font-mono flex items-center gap-2">
                                                <Calendar size={10} />
                                                {new Date(post.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] font-mono px-2 py-1 rounded border ${post.published ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/10' : 'border-yellow-500/30 text-yellow-500 bg-yellow-500/10'}`}>
                                            {post.published ? 'PUBLISHED' : 'DRAFT'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-500 font-mono text-sm py-12">
                            <FileText size={32} className="mb-4 opacity-20" />
                            NO ENTRIES FOUND
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Messages */}
            <div className="bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden flex flex-col shadow-2xl">
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <h3 className="font-bold font-syne text-lg flex items-center gap-2 text-amber-400">
                        <MessageSquare size={18} />
                        Ether Whispers
                    </h3>
                    <Link href="/admin/messages" className="text-xs font-mono text-gray-400 hover:text-white flex items-center gap-1 transition-colors group">
                        VIEW ALL <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
                <div className="p-6 flex-1">
                    {recentMessages.length > 0 ? (
                        <div className="space-y-4">
                            {recentMessages.map(msg => (
                                <div key={msg.id} className="flex items-center justify-between group p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold font-syne ${msg.isRead ? 'bg-white/5 text-gray-500' : 'bg-amber-500/20 text-amber-500 border border-amber-500/50 shadow-[0_0_15px_-5px_rgba(245,158,11,0.5)]'}`}>
                                            {msg.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className={`text-sm font-syne ${msg.isRead ? 'text-gray-400' : 'text-white font-bold'} group-hover:text-umbrella-main transition-colors`}>
                                                {msg.name}
                                            </div>
                                            <div className="text-xs text-gray-500 font-mono line-clamp-1 max-w-[200px]">
                                                {msg.subject || 'No Subject'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-600 font-mono flex items-center gap-1">
                                        <Clock size={10} />
                                        {new Date(msg.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-500 font-mono text-sm py-12">
                            <MessageSquare size={32} className="mb-4 opacity-20" />
                            NO WHISPERS HEARD
                        </div>
                    )}
                </div>
            </div>

        </div>
      </div>
    </div>
  )
}
