import { ChatConversation } from '@/types/chat'
import { formatDistanceToNow } from 'date-fns'
import { MessageCircle, Users } from 'lucide-react'
import Image from 'next/image'

interface ConversationItemProps {
  conversation: ChatConversation
  isActive: boolean
  onClick: () => void
}

export default function ConversationItem({ conversation, isActive, onClick }: ConversationItemProps) {
  const { otherUser, lastMessage, unreadCount, lastMessageAt } = conversation

  const formatTime = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true })
  }

  const truncateMessage = (message: string, maxLength: number = 50) => {
    return message.length > maxLength ? `${message.substring(0, maxLength)}...` : message
  }

  return (
    <div
      onClick={onClick}
      className={`p-4 border-b border-gray-200 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
        isActive ? 'bg-blue-50 border-blue-200' : ''
      }`}
    >
      <div className="flex items-center space-x-3">
        {/* Profile Picture */}
        <div className="flex-shrink-0">
          {otherUser.profilePicture ? (
            <Image
              src={otherUser.profilePicture}
              alt={otherUser.name}
              width={48}
              height={48}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
              {otherUser.role === 'ADMIN' ? (
                <Users className="w-6 h-6 text-gray-600" />
              ) : (
                <span className="text-gray-600 font-semibold text-lg">
                  {otherUser.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Conversation Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {otherUser.role === 'ADMIN' ? '👑 Admin' : otherUser.name}
            </h3>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
              <span className="text-xs text-gray-500">
                {formatTime(lastMessageAt)}
              </span>
            </div>
          </div>
          
          {lastMessage && (
            <div className="mt-1">
              <p className={`text-sm ${unreadCount > 0 ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                {lastMessage.messageType === 'LISTING_INQUIRY' && (
                  <MessageCircle className="w-4 h-4 inline mr-1" />
                )}
                {lastMessage.senderId === conversation.participants.find(p => p !== otherUser.id) 
                  ? 'You: ' 
                  : ''
                }
                {truncateMessage(lastMessage.content)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
