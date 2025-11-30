'use client'

import { usePathname } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { motion } from 'framer-motion'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'

  return (
    <div className="min-h-screen text-white font-sans">
      {!isLoginPage && <AdminSidebar />}

      <motion.main 
        layout
        className={`relative z-10 transition-all duration-300 ${!isLoginPage ? 'ml-64 p-8' : 'p-0'}`}
      >
        <div className="max-w-7xl mx-auto w-full">
          {children}
        </div>
      </motion.main>
    </div>
  )
}
