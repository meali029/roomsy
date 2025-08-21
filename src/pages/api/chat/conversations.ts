import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/libs/auth'
import { prisma } from '@/libs/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const session = await getServerSession(req, res, authOptions)
    if (!session?.user?.id) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const userId = session.user.id

    // Get all conversations for the user
    const conversations = await prisma.message.groupBy({
      by: ['senderId', 'receiverId'],
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId }
        ]
      },
      _max: {
        createdAt: true
      }
    })

    // Get unique conversation partners
    const conversationPartners = new Set<string>()
    conversations.forEach(conv => {
      if (conv.senderId !== userId) conversationPartners.add(conv.senderId)
      if (conv.receiverId !== userId) conversationPartners.add(conv.receiverId)
    })

    // Fetch conversation details with last message and unread count
    const conversationDetails = await Promise.all(
      Array.from(conversationPartners).map(async (partnerId) => {
        // Get last message
        const lastMessage = await prisma.message.findFirst({
          where: {
            OR: [
              { senderId: userId, receiverId: partnerId },
              { senderId: partnerId, receiverId: userId }
            ]
          },
          orderBy: { createdAt: 'desc' },
          include: {
            User_Message_senderIdToUser: {
              select: {
                id: true,
                name: true,
                profilePicture: true,
              }
            },
            User_Message_receiverIdToUser: {
              select: {
                id: true,
                name: true,
                profilePicture: true,
              }
            },
            listing: {
              select: {
                id: true,
                title: true,
                imageUrls: true,
              }
            }
          }
        })

        // Get unread count
        const unreadCount = await prisma.message.count({
          where: {
            senderId: partnerId,
            receiverId: userId,
            isRead: false
          }
        })

        // Get partner details
        const partner = await prisma.user.findUnique({
          where: { id: partnerId },
          select: {
            id: true,
            name: true,
            profilePicture: true,
            role: true,
          }
        })

        return {
          id: `${userId}-${partnerId}`,
          participants: [userId, partnerId],
          lastMessageAt: lastMessage?.createdAt || new Date(),
          createdAt: lastMessage?.createdAt || new Date(),
          updatedAt: lastMessage?.updatedAt || new Date(),
          otherUser: partner,
          lastMessage: lastMessage ? {
            id: lastMessage.id,
            senderId: lastMessage.senderId,
            receiverId: lastMessage.receiverId,
            content: lastMessage.content,
            isRead: lastMessage.isRead,
            messageType: lastMessage.messageType,
            listingId: lastMessage.listingId,
            createdAt: lastMessage.createdAt,
            updatedAt: lastMessage.updatedAt,
            sender: lastMessage.User_Message_senderIdToUser,
            receiver: lastMessage.User_Message_receiverIdToUser,
            listing: lastMessage.listing,
          } : undefined,
          unreadCount
        }
      })
    )

    // Sort by last message time
    conversationDetails.sort((a, b) => 
      new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
    )

    res.status(200).json(conversationDetails)
  } catch (error) {
    console.error('Error fetching conversations:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
