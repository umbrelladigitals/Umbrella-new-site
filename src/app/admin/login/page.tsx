'use client'
import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Sparkles, Lock, User, ChevronRight, AlertCircle } from "lucide-react"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    
    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    })

    if (res?.ok) {
      router.push("/admin/dashboard")
    } else {
      setError("Alchemy Failed: Invalid credentials")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Alchemy Background Elements */}
      <div className="absolute inset-0 z-0">
         {/* Central Orb */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-umbrella-main/20 rounded-full blur-[100px]"
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-black/40 backdrop-blur-2xl border border-white/10 p-12 rounded-3xl shadow-2xl relative overflow-hidden group">
          
          <div className="text-center mb-12">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-6 border border-white/10"
            >
              <Sparkles className="w-8 h-8 text-umbrella-main" />
            </motion.div>
            <h1 className="text-3xl font-bold tracking-wide text-white font-syne">UMBRELLA<span className="text-umbrella-main">.AI</span></h1>
            <p className="text-xs text-gray-400 mt-3 tracking-[0.3em] uppercase font-mono">Internal Access Only</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-white transition-colors" />
                <input 
                  type="text" 
                  placeholder="Identity"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:border-umbrella-main/50 focus:bg-white/10 outline-none transition-all font-sans text-sm"
                />
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-white transition-colors" />
                <input 
                  type="password" 
                  placeholder="Key"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:border-umbrella-main/50 focus:bg-white/10 outline-none transition-all font-sans text-sm"
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex items-center gap-2 text-red-400 text-xs font-mono bg-red-500/5 p-3 rounded-lg border border-red-500/10"
              >
                <AlertCircle size={14} />
                {error}
              </motion.div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-white text-black py-4 rounded-xl font-bold hover:bg-umbrella-main hover:text-white transition-all duration-500 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed mt-8"
            >
              {loading ? (
                <span className="animate-pulse text-xs tracking-widest uppercase">Verifying...</span>
              ) : (
                <>
                  <span className="text-sm tracking-widest uppercase">Enter Void</span>
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

