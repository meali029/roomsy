import { ChatMessage } from '@/types/chat'
import { formatDistanceToNow } from 'date-fns'
import { Check, CheckCheck, MessageCircle } from 'lucide-react'
import Image from 'next/image'

interface MessageItemProps {
  message: ChatMessage
  isOwn: boolean
  showAvatar?: boolean
}

export default function MessageItem({ message, isOwn, showAvatar = true }: MessageItemProps) {
  const formatTime = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true })
  }

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      {/* Avatar for other user's messages */}
      {!isOwn && showAvatar && (
        <div className="flex-shrink-0 mr-3">
          {message.sender.profilePicture ? (
            <Image
              src={message.sender.profilePicture}
              alt={message.sender.name}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-gray-600 text-sm font-semibold">
                {message.sender.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Message Content */}
      <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-1' : 'order-2'}`}>
        {/* Message Bubble */}
        <div
          className={`relative px-4 py-2 rounded-lg ${
            isOwn
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-800'
          }`}
        >
          {/* Listing Context */}
          {message.messageType === 'LISTING_INQUIRY' && message.listing && (
            <div className="mb-2 p-2 bg-black/10 rounded border-l-2 border-black/20">
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-4 h-4" />
                <span className="text-xs font-medium">Listing Inquiry</span>
              </div>
              <p className="text-xs mt-1 opacity-80">{message.listing.title}</p>
            </div>
          )}

          {/* Message Text */}
          <p className="text-sm">{message.content}</p>

          {/* Message Info */}
          <div className={`flex items-center justify-end mt-1 space-x-1 text-xs ${
            isOwn ? 'text-blue-100' : 'text-gray-500'
          }`}>
            <span>{formatTime(message.createdAt)}</span>
            {isOwn && (
              <div className="flex items-center">
                {message.isRead ? (
                  <CheckCheck className="w-3 h-3" />
                ) : (
                  <Check className="w-3 h-3" />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
