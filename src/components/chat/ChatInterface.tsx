import { useState, useEffect, useRef, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { ChatMessage, ChatConversation } from '@/types/chat'
import { socketClient } from '@/libs/socket'
import ConversationItem from './ConversationItem'
import MessageItem from './MessageItem'
import MessageInput from './MessageInput'
import { Search, MessageCircle, Users, ArrowLeft, Phone, Video, MoreVertical } from 'lucide-react'
import Image from 'next/image'

interface ChatInterfaceProps {
  initialConversations?: ChatConversation[]
  initialPartnerId?: string
  listingId?: string
}

export default function ChatInterface({ 
  initialConversations = [], 
  initialPartnerId,
  listingId 
}: ChatInterfaceProps) {
  const { data: session } = useSession()
  const [conversations, setConversations] = useState<ChatConversation[]>(initialConversations)
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMoreMessages, setHasMoreMessages] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set())
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set())
  const [isMobile, setIsMobile] = useState(false)
  const [showConversations, setShowConversations] = useState(true)
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const socket = socketClient.getSocket()

  // Cast session user to include id
  const user = session?.user as { id: string; name: string; email: string; role: "USER" | "ADMIN" } | undefined

  const handleReceiveMessage = useCallback((message: ChatMessage) => {
    console.log('Received message:', message)
    
    // Only add the message if it's for the current conversation
    if (selectedConversation && 
        (message.senderId === selectedConversation.otherUser.id || 
         message.receiverId === selectedConversation.otherUser.id)) {
      setMessages(prev => {
        // Check if message already exists to prevent duplicates
        const exists = prev.some(msg => msg.id === message.id)
        if (exists) {
          console.log('Message already exists, skipping')
          return prev
        }
        console.log('Adding new message to conversation')
        return [...prev, message]
      })
    }
    
    // Update conversations list
    setConversations(prev => {
      const updated = prev.map(conv => {
        if (conv.otherUser.id === message.senderId || conv.otherUser.id === message.receiverId) {
          return {
            ...conv,
            lastMessage: message,
            lastMessageAt: message.createdAt,
            unreadCount: message.receiverId === user?.id ? conv.unreadCount + 1 : conv.unreadCount
          }
        }
        return conv
      })
      
      // Sort by last message time
      return updated.sort((a, b) => 
        new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
      )
    })
  }, [user?.id, selectedConversation])

  const selectConversation = useCallback((conversation: ChatConversation) => {
    setSelectedConversation(conversation)
    setMessages([]) // Clear messages first
    setHasMoreMessages(true)
    setShouldAutoScroll(true) // Reset auto-scroll for new conversation
    fetchMessages(conversation.otherUser.id, 0)
    
    if (isMobile) {
      setShowConversations(false)
    }
  }, [isMobile])

  const fetchMessages = async (partnerId: string, offset = 0) => {
    try {
      setLoading(offset === 0)
      setLoadingMore(offset > 0)
      
      const response = await fetch(`/api/chat/messages/${partnerId}?offset=${offset}&limit=20`)
      if (response.ok) {
        const data = await response.json()
        
        if (offset === 0) {
          setMessages(data)
          setHasMoreMessages(data.length === 20)
        } else {
          setMessages(prev => [...data, ...prev])
          setHasMoreMessages(data.length === 20)
        }
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setShowConversations(true)
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (user?.id) {
      console.log('Connecting to socket for user:', user.id)
      // Connect to socket
      socketClient.connect(user.id)
      fetchConversations()
      
      // Check socket connection status
      setTimeout(() => {
        const socketStatus = socketClient.isConnected()
        console.log('Socket connection status:', socketStatus)
        if (!socketStatus) {
          console.warn('Socket not connected after timeout')
        }
      }, 2000)
    }
  }, [user?.id])

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/chat/conversations')
      if (response.ok) {
        const data = await response.json()
        setConversations(data)
      }
    } catch (error) {
      console.error('Error fetching conversations:', error)
    }
  }

  useEffect(() => {
    if (socket && user?.id) {
      console.log('Setting up socket event listeners')
      
      // Socket event listeners
      const handleUserOnline = (userId: string) => {
        console.log('User came online:', userId)
        setOnlineUsers(prev => new Set([...prev, userId]))
      }

      const handleUserOffline = (userId: string) => {
        console.log('User went offline:', userId)
        setOnlineUsers(prev => {
          const updated = new Set(prev)
          updated.delete(userId)
          return updated
        })
      }

      const handleOnlineUsers = (userIds: string[]) => {
        console.log('Online users updated:', userIds)
        setOnlineUsers(new Set(userIds))
      }

      const handleUserTyping = ({ senderId, isTyping }: { senderId: string; isTyping: boolean }) => {
        console.log('User typing event:', { senderId, isTyping })
        setTypingUsers(prev => {
          const updated = new Set(prev)
          if (isTyping) {
            updated.add(senderId)
          } else {
            updated.delete(senderId)
          }
          return updated
        })
      }

      const handleSocketError = (error: Error | string) => {
        console.error('Socket error:', error)
      }

      // Add event listeners
      socket.on('receive-message', handleReceiveMessage)
      socket.on('user-online', handleUserOnline)
      socket.on('user-offline', handleUserOffline)
      socket.on('online-users', handleOnlineUsers)
      socket.on('user-typing', handleUserTyping)
      socket.on('error', handleSocketError)

      return () => {
        console.log('Cleaning up socket event listeners')
        socket.off('receive-message', handleReceiveMessage)
        socket.off('user-online', handleUserOnline)
        socket.off('user-offline', handleUserOffline)
        socket.off('online-users', handleOnlineUsers)
        socket.off('user-typing', handleUserTyping)
        socket.off('error', handleSocketError)
      }
    }
  }, [socket, user?.id, handleReceiveMessage])

  const createNewConversation = useCallback(async (partnerId: string) => {
    try {
      console.log('Creating new conversation with partner:', partnerId)
      // Fetch partner details
      const response = await fetch(`/api/chat/user/${partnerId}`)
      if (response.ok) {
        const partnerData = await response.json()
        console.log('Fetched partner data:', partnerData)
        
        // Create a temporary conversation object
        const newConversation: ChatConversation = {
          id: `${user?.id}-${partnerId}`,
          participants: [user?.id || '', partnerId],
          lastMessageAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
          otherUser: {
            id: partnerData.id,
            name: partnerData.name,
            profilePicture: partnerData.profilePicture,
            role: partnerData.role
          },
          unreadCount: 0
        }
        
        console.log('Created new conversation:', newConversation)
        // Add to conversations list
        setConversations(prev => [newConversation, ...prev])
        selectConversation(newConversation)
      } else {
        console.error('Failed to fetch partner data:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('Error creating new conversation:', error)
    }
  }, [user?.id, selectConversation])

  useEffect(() => {
    // Auto-select conversation if partnerId is provided
    if (initialPartnerId && user?.id) {
      console.log('Trying to open conversation with partner:', initialPartnerId)
      const conversation = conversations.find(conv => 
        conv.otherUser.id === initialPartnerId
      )
      if (conversation) {
        console.log('Found existing conversation:', conversation.id)
        selectConversation(conversation)
      } else {
        console.log('No existing conversation found, creating new one')
        // Create a new conversation with the partner
        createNewConversation(initialPartnerId)
      }
    }
  }, [initialPartnerId, conversations, selectConversation, createNewConversation, user?.id])

  useEffect(() => {
    // Only auto-scroll if user is near the bottom or if it's their own message
    if (shouldAutoScroll && messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.senderId === user?.id || shouldAutoScroll) {
        // Use a small timeout to ensure DOM is updated
        setTimeout(() => {
          scrollToBottom()
        }, 10)
      }
    }
  }, [messages, shouldAutoScroll, user?.id])

  // Handle scroll for loading more messages and auto-scroll detection
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    
    // Load more messages when scrolled to top
    if (scrollTop === 0 && hasMoreMessages && !loadingMore && selectedConversation) {
      fetchMessages(selectedConversation.otherUser.id, messages.length)
    }
    
    // Check if user is near the bottom (within 100px)
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100
    setShouldAutoScroll(isNearBottom)
  }, [hasMoreMessages, loadingMore, selectedConversation, messages.length])

  const handleSendMessage = async (content: string) => {
    if (!selectedConversation || !user?.id) {
      console.error('Cannot send message: missing conversation or user')
      return
    }

    const messageData = {
      senderId: user.id,
      receiverId: selectedConversation.otherUser.id,
      content,
      messageType: listingId ? 'LISTING_INQUIRY' as const : 'TEXT' as const,
      listingId
    }

    console.log('Sending message:', messageData)

    // Enable auto-scroll since user is sending a message
    setShouldAutoScroll(true)

    // Send via socket
    if (socket) {
      console.log('Socket is available, emitting message')
      socket.emit('send-message', messageData)
    } else {
      console.error('Socket not available, falling back to API')
      // Fallback to API if socket is not available
      try {
        const response = await fetch('/api/chat/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(messageData),
        })

        if (response.ok) {
          const newMessage = await response.json()
          console.log('Message sent via API:', newMessage)
          setMessages(prev => [...prev, newMessage])
        } else {
          console.error('Failed to send message via API:', response.status)
        }
      } catch (error) {
        console.error('Error sending message via API:', error)
      }
    }
  }

  const handleTyping = (isTyping: boolean) => {
    if (!selectedConversation || !socket) return
    
    socket.emit('typing', {
      receiverId: selectedConversation.otherUser.id,
      isTyping
    })
  }

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current
      
      // Prevent any body/window scrolling by using requestAnimationFrame
      requestAnimationFrame(() => {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth'
        })
      })
    }
  }

  const filteredConversations = conversations.filter(conv =>
    conv.otherUser.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const backToConversations = () => {
    setShowConversations(true)
    setSelectedConversation(null)
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Please log in to access chat</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[600px] bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Conversations Sidebar */}
      <div className={`${
        isMobile 
          ? showConversations ? 'w-full' : 'hidden' 
          : 'w-1/3 border-r border-gray-200'
      }`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Messages</h2>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="overflow-y-auto" style={{ height: 'calc(100% - 140px)' }}>
          {filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-500">
              <Users className="w-12 h-12 mb-2" />
              <p>No conversations yet</p>
              <p className="text-sm">Start a conversation by contacting a listing owner!</p>
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isActive={selectedConversation?.id === conversation.id}
                onClick={() => selectConversation(conversation)}
              />
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col ${
        isMobile && showConversations ? 'hidden' : ''
      }`}>
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {isMobile && (
                    <button
                      onClick={backToConversations}
                      className="p-1 text-gray-600 hover:text-gray-800"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                  )}
                  
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      {selectedConversation.otherUser.profilePicture ? (
                        <Image
                          src={selectedConversation.otherUser.profilePicture}
                          alt={selectedConversation.otherUser.name}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-gray-600 font-semibold">
                            {selectedConversation.otherUser.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      
                      {/* Online Indicator */}
                      {onlineUsers.has(selectedConversation.otherUser.id) && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {selectedConversation.otherUser.role === 'ADMIN' 
                          ? '👑 Admin Support' 
                          : selectedConversation.otherUser.name
                        }
                      </h3>
                      <p className="text-xs text-gray-500">
                        {onlineUsers.has(selectedConversation.otherUser.id) 
                          ? 'Online' 
                          : 'Offline'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Chat Actions */}
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg">
                    <Phone className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg">
                    <Video className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div 
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4"
              style={{ 
                height: 'calc(100% - 140px)', // Fixed height relative to parent
                overflowAnchor: 'none' // Prevent scroll anchoring interference
              }}
              onScroll={handleScroll}
            >
              {loadingMore && (
                <div className="flex justify-center items-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  <span className="ml-2 text-sm text-gray-500">Loading more messages...</span>
                </div>
              )}
              
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <>
                  {messages.map((message) => (
                    <MessageItem
                      key={message.id}
                      message={message}
                      isOwn={message.senderId === user.id}
                    />
                  ))}
                  
                  {/* Typing Indicator */}
                  {typingUsers.has(selectedConversation.otherUser.id) && (
                    <div className="flex items-center space-x-2 text-gray-500">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-sm">{selectedConversation.otherUser.name} is typing...</span>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} className="h-1" />
                </>
              )}
            </div>

            {/* Message Input */}
            <div className="flex-shrink-0">
              <MessageInput
                onSendMessage={handleSendMessage}
                onTyping={handleTyping}
                placeholder={`Message ${selectedConversation.otherUser.name}...`}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MessageCircle className="w-16 h-16 mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">Select a conversation</p>
              <p>Choose a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
