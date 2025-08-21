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

    const { partnerId, offset = '0', limit = '20' } = req.query
    const userId = session.user.id

    if (!partnerId || typeof partnerId !== 'string') {
      return res.status(400).json({ error: 'Partner ID is required' })
    }

    const offsetNum = parseInt(offset as string, 10)
    const limitNum = parseInt(limit as string, 10)

    // Get messages between users with pagination
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: partnerId },
          { senderId: partnerId, receiverId: userId }
        ]
      },
      orderBy: { createdAt: 'desc' }, // Get newest first for pagination
      skip: offsetNum,
      take: limitNum,
      select: {
        id: true,
        senderId: true,
        receiverId: true,
        content: true,
        isRead: true,
        messageType: true,
        listingId: true, // Ensure this is present
        createdAt: true,
        updatedAt: true,
        User_Message_senderIdToUser: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
          }
        },
        receiver: {
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

    // Reverse the order for display (oldest first)
    const sortedMessages = messages.reverse()

    // Mark messages from partner as read
    await prisma.message.updateMany({
      where: {
        senderId: partnerId,
        receiverId: userId,
        isRead: false
      },
      data: {
        isRead: true
      }
    })

    // Format messages
    const formattedMessages = messages.map(message => ({
      id: message.id,
      senderId: message.senderId,
      receiverId: message.receiverId,
      content: message.content,
      isRead: message.isRead,
      messageType: message.messageType,
      listingId: message.listingId,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
      sender: message.User_Message_senderIdToUser,
      receiver: message.receiver,
      listing: message.listing,
    }))

    res.status(200).json(formattedMessages)
  } catch (error) {
    console.error('Error fetching messages:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
