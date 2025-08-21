import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/libs/auth'
import { prisma } from '@/libs/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const session = await getServerSession(req, res, authOptions)
    if (!session?.user?.id) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const { receiverId, content, messageType = 'TEXT', listingId } = req.body
    const senderId = session.user.id

    if (!receiverId || !content) {
      return res.status(400).json({ error: 'Receiver ID and content are required' })
    }

    // Check if receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId }
    })

    if (!receiver) {
      return res.status(404).json({ error: 'Receiver not found' })
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        content,
        messageType,
        listingId,
      },
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

    // Format message for response
    const formattedMessage = {
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
      receiver: message.User_Message_receiverIdToUser,
      listing: message.listing,
    }

    res.status(201).json(formattedMessage)
  } catch (error) {
    console.error('Error sending message:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
