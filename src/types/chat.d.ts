export interface ChatMessage {
  id: string
  senderId: string
  receiverId: string
  content: string
  isRead: boolean
  messageType: 'TEXT' | 'IMAGE' | 'LISTING_INQUIRY'
  listingId?: string
  createdAt: Date
  updatedAt: Date
  sender: {
    id: string
    name: string
    profilePicture?: string
  }
  receiver: {
    id: string
    name: string
    profilePicture?: string
  }
  listing?: {
    id: string
    title: string
    imageUrls: string[]
  }
}

export interface ChatConversation {
  id: string
  participants: string[]
  lastMessageAt: Date
  createdAt: Date
  updatedAt: Date
  otherUser: {
    id: string
    name: string
    profilePicture?: string
    role: 'USER' | 'ADMIN'
  }
  lastMessage?: ChatMessage
  unreadCount: number
}

export interface SocketEvents {
  'join-room': (userId: string) => void
  'leave-room': (userId: string) => void
  'send-message': (message: {
    receiverId: string
    content: string
    messageType?: 'TEXT' | 'IMAGE' | 'LISTING_INQUIRY'
    listingId?: string
  }) => void
  'receive-message': (message: ChatMessage) => void
  'message-read': (messageId: string) => void
  'typing': (data: { receiverId: string; isTyping: boolean }) => void
  'user-typing': (data: { senderId: string; isTyping: boolean }) => void
  'user-online': (userId: string) => void
  'user-offline': (userId: string) => void
  'online-users': (userIds: string[]) => void
}

export interface OnlineUser {
  userId: string
  socketId: string
  lastSeen: Date
}
