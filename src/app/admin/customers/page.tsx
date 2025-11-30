'use client'

import { useState, useEffect } from 'react'
import { Users, Plus, Search, Mail, Phone, Building, FileText, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  notes?: string
  proposals: any[]
  createdAt: string
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', phone: '', company: '', notes: '' })

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      const res = await fetch('/api/admin/customers')
      const data = await res.json()
      if (Array.isArray(data)) {
        setCustomers(data)
      } else {
        console.error('Invalid customers data:', data)
        setCustomers([])
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error)
      setCustomers([])
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/admin/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCustomer)
      })
      if (res.ok) {
        setIsModalOpen(false)
        setNewCustomer({ name: '', email: '', phone: '', company: '', notes: '' })
        fetchCustomers()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.company?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen text-white">
      <div className="flex justify-between items-center mb-12">
        <div>
            <h1 className="text-4xl font-bold font-syne mb-2">Customers</h1>
            <p className="text-gray-500 font-mono text-sm tracking-widest">CLIENT DATABASE</p>
        </div>
        <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-umbrella-main hover:text-white transition-all flex items-center gap-2"
        >
            <Plus size={18} /> Add Customer
        </button>
      </div>

      <div className="mb-8 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
        <input 
            type="text" 
            placeholder="Search customers..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:border-umbrella-main/50 outline-none font-mono text-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map(customer => (
            <motion.div 
                key={customer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-umbrella-main/50 transition-all group"
            >
                <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-full bg-umbrella-main/20 border border-umbrella-main/50 flex items-center justify-center text-xl font-bold text-umbrella-main">
                        {customer.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-xs font-mono text-gray-500 bg-white/5 px-2 py-1 rounded">
                        {customer.proposals.length} Projects
                    </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-1">{customer.name}</h3>
                {customer.company && <p className="text-gray-400 text-sm mb-4">{customer.company}</p>}
                
                <div className="space-y-2 text-sm text-gray-400 font-mono">
                    <div className="flex items-center gap-2">
                        <Mail size={14} /> {customer.email}
                    </div>
                    {customer.phone && (
                        <div className="flex items-center gap-2">
                            <Phone size={14} /> {customer.phone}
                        </div>
                    )}
                </div>
            </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
            <>
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsModalOpen(false)}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                />
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 pointer-events-auto"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold font-syne">Add New Customer</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-xs font-mono text-gray-500 mb-1 uppercase">Full Name</label>
                                <input 
                                    required
                                    type="text" 
                                    value={newCustomer.name}
                                    onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-umbrella-main outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-mono text-gray-500 mb-1 uppercase">Email</label>
                                <input 
                                    required
                                    type="email" 
                                    value={newCustomer.email}
                                    onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-umbrella-main outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-mono text-gray-500 mb-1 uppercase">Phone</label>
                                    <input 
                                        type="text" 
                                        value={newCustomer.phone}
                                        onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-umbrella-main outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-mono text-gray-500 mb-1 uppercase">Company</label>
                                    <input 
                                        type="text" 
                                        value={newCustomer.company}
                                        onChange={(e) => setNewCustomer({...newCustomer, company: e.target.value})}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-umbrella-main outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-mono text-gray-500 mb-1 uppercase">Notes</label>
                                <textarea 
                                    value={newCustomer.notes}
                                    onChange={(e) => setNewCustomer({...newCustomer, notes: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-umbrella-main outline-none h-24 resize-none"
                                />
                            </div>
                            
                            <button 
                                type="submit"
                                className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-umbrella-main hover:text-white transition-all mt-4"
                            >
                                Create Customer
                            </button>
                        </form>
                    </motion.div>
                </div>
            </>
        )}
      </AnimatePresence>
    </div>
  )
}
