import { Server as NetServer } from 'http'
import { NextApiRequest, NextApiResponse } from 'next'
import { Server as ServerIO } from 'socket.io'
import { prisma } from '@/libs/prisma'

export const config = {
  api: {
    bodyParser: false,
  },
}

interface SocketServer extends NetServer {
  io?: ServerIO
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: NextApiResponse['socket'] & {
    server: SocketServer
  }
}

const SocketHandler = (req: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (res.socket.server.io) {
    console.log('Socket is already running')
  } else {
    console.log('Socket is initializing')
    const httpServer: NetServer = res.socket.server
    const io = new ServerIO(httpServer, {
      path: '/api/socket',
      cors: {
        origin: process.env.NEXTAUTH_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    })

    const onlineUsers = new Map<string, string>() // userId -> socketId
    const socketToUser = new Map<string, string>() // socketId -> userId

    io.on('connection', (socket) => {
      console.log('User connected:', socket.id)

      // User joins their room
      socket.on('join-room', (userId: string) => {
        socket.join(userId)
        onlineUsers.set(userId, socket.id)
        socketToUser.set(socket.id, userId)
        socket.broadcast.emit('user-online', userId)
        
        // Send current online users to the newly connected user
        const onlineUserIds = Array.from(onlineUsers.keys())
        socket.emit('online-users', onlineUserIds)
      })

      // User leaves room
      socket.on('leave-room', (userId: string) => {
        socket.leave(userId)
        onlineUsers.delete(userId)
        socketToUser.delete(socket.id)
        socket.broadcast.emit('user-offline', userId)
      })

      // Send message
      socket.on('send-message', async (data: {
        senderId: string
        receiverId: string
        content: string
        messageType?: 'TEXT' | 'IMAGE' | 'LISTING_INQUIRY'
        listingId?: string
      }) => {
        console.log('Received send-message event:', data)
        try {
          // Save message to database
          const message = await prisma.message.create({
            data: {
              senderId: data.senderId,
              receiverId: data.receiverId,
              content: data.content,
              messageType: data.messageType || 'TEXT',
              listingId: data.listingId,
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

          console.log('Message saved to database:', message.id)

          // Format message for client
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

          console.log('Sending message to rooms:', data.senderId, data.receiverId)
          // Send to both sender and receiver
          io.to(data.senderId).emit('receive-message', formattedMessage)
          io.to(data.receiverId).emit('receive-message', formattedMessage)

        } catch (error) {
          console.error('Error sending message:', error)
          socket.emit('error', 'Failed to send message')
        }
      })

      // Mark message as read
      socket.on('message-read', async (messageId: string) => {
        try {
          await prisma.message.update({
            where: { id: messageId },
            data: { isRead: true }
          })
        } catch (error) {
          console.error('Error marking message as read:', error)
        }
      })

      // Typing indicator
      socket.on('typing', (data: { receiverId: string; isTyping: boolean }) => {
        const senderId = socketToUser.get(socket.id)
        if (senderId) {
          socket.to(data.receiverId).emit('user-typing', {
            senderId: senderId,
            isTyping: data.isTyping
          })
        }
      })

      // Handle disconnect
      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id)
        // Find and remove user from online users
        const userId = socketToUser.get(socket.id)
        if (userId) {
          onlineUsers.delete(userId)
          socketToUser.delete(socket.id)
          socket.broadcast.emit('user-offline', userId)
        }
      })
    })

    res.socket.server.io = io
  }
  res.end()
}

export default SocketHandler
