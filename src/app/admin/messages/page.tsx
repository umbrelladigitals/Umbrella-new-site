import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import MessageList from '@/components/admin/MessageList'

export default async function MessagesPage() {
  const messages = await prisma.message.findMany({
    orderBy: { createdAt: 'desc' }
  })

  async function deleteMessage(id: number) {
    'use server'
    await prisma.message.delete({ where: { id } })
    revalidatePath('/admin/messages')
  }

  return (
    <div className="min-h-screen text-white">
      <div>
        <div className="flex justify-between items-center mb-12">
          <div>
             <h1 className="text-4xl font-bold font-syne mb-2">Messages</h1>
             <p className="text-gray-500 font-mono text-sm tracking-widest">INCOMING TRANSMISSIONS</p>
          </div>
        </div>

        <MessageList messages={messages} onDelete={deleteMessage} />
      </div>
    </div>
  )
}
