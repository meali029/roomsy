"use client"

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import ChatInterface from '@/components/chat/ChatInterface'
import { ChatConversation } from '@/types/chat'

function ChatContent() {
  const { status } = useSession()
  const searchParams = useSearchParams()
  const [conversations, setConversations] = useState<ChatConversation[]>([])
  const [loading, setLoading] = useState(true)

  // Get partner ID and listing ID from URL params
  const partnerId = searchParams?.get('partner')
  const listingId = searchParams?.get('listing')

  console.log('Chat page URL params:', { partnerId, listingId })

  useEffect(() => {
    if (status === 'authenticated') {
      fetchConversations()
    } else if (status === 'unauthenticated') {
      setLoading(false)
    }
  }, [status, partnerId]) // Add partnerId to dependencies

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/chat/conversations')
      if (response.ok) {
        const data = await response.json()
        setConversations(data)
      }
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You need to be logged in to access the chat feature.</p>
          <a
            href="/login"
            className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Login to Continue
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="mt-2 text-gray-600">
            Chat with listing owners and get instant responses
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <ChatInterface
            initialConversations={conversations}
            initialPartnerId={partnerId || undefined}
            listingId={listingId || undefined}
          />
        </div>
      </div>
    </div>
  )
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    }>
      <ChatContent />
    </Suspense>
  )
}
