'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

export default function AdminNav() {
  const pathname = usePathname()

  const links = [
    { href: '/admin/dashboard', label: 'Dashboard' },
    { href: '/admin/projects', label: 'Projects' },
    { href: '/admin/services', label: 'Services' },
  ]

  return (
    <nav className="bg-neutral-900 border-b border-white/10 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-bold text-white">Umbrella Admin</h1>
          <div className="flex gap-4">
            {links.map(link => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href ? 'text-umbrella-main' : 'text-gray-400 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <button 
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="text-sm text-gray-400 hover:text-white"
        >
          Sign Out
        </button>
      </div>
    </nav>
  )
}
