'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { motion } from 'framer-motion'
import { LayoutDashboard, FolderKanban, Layers, LogOut, Sparkles, MessageSquare, BookOpen, Image as ImageIcon, FileText, Activity, Users } from 'lucide-react'

export default function AdminSidebar() {
  const pathname = usePathname()

  const links = [
    { href: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/admin/projects', label: 'Projects', icon: FolderKanban },
    { href: '/admin/services', label: 'Services', icon: Layers },
    { href: '/admin/posts', label: 'Chronicles', icon: BookOpen },
    { href: '/admin/proposals', label: 'Proposals', icon: FileText },
    { href: '/admin/customers', label: 'Customers', icon: Users },
    { href: '/admin/tracker', label: 'Active Projects', icon: Activity },
    { href: '/admin/media', label: 'Media Center', icon: ImageIcon },
    { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
  ]

  return (
    <motion.aside 
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed left-0 top-0 bottom-0 w-64 bg-black/20 backdrop-blur-xl border-r border-white/5 z-50 flex flex-col"
    >
      <div className="p-8 border-b border-white/5">
        <div className="flex items-center gap-3 text-umbrella-main">
          <Sparkles className="w-6 h-6" />
          <h1 className="text-xl font-bold tracking-wider text-white font-syne">UMBRELLA<span className="text-umbrella-main">.AI</span></h1>
        </div>
        <p className="text-[10px] text-gray-500 mt-2 tracking-widest uppercase font-mono">Digital Alchemy Console</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {links.map(link => {
          const isActive = pathname.startsWith(link.href)
          const Icon = link.icon
          
          return (
            <Link 
              key={link.href} 
              href={link.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-500 group relative overflow-hidden ${
                isActive 
                  ? 'text-white' 
                  : 'text-gray-500 hover:text-white'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white/5 border border-white/10 rounded-lg"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <Icon size={18} className={`relative z-10 transition-colors ${isActive ? 'text-umbrella-main' : 'group-hover:text-white'}`} />
              <span className="font-medium relative z-10 text-sm tracking-wide">{link.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button 
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="flex items-center gap-4 px-4 py-3 w-full text-left text-gray-500 hover:text-red-400 hover:bg-red-500/5 rounded-lg transition-all duration-300 group"
        >
          <LogOut size={18} />
          <span className="font-medium text-sm tracking-wide">Sever Connection</span>
        </button>
      </div>
    </motion.aside>
  )
}
