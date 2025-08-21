import { io, Socket } from 'socket.io-client'

class SocketClient {
  private socket: Socket | null = null
  private static instance: SocketClient

  private constructor() {}

  static getInstance(): SocketClient {
    if (!SocketClient.instance) {
      SocketClient.instance = new SocketClient()
    }
    return SocketClient.instance
  }

  connect(userId: string): Socket {
    if (!this.socket || !this.socket.connected) {
      this.socket = io(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000', {
        path: '/api/socket',
        transports: ['polling'],
      })

      this.socket.on('connect', () => {
        console.log('Connected to socket server')
        this.socket?.emit('join-room', userId)
      })

      this.socket.on('disconnect', () => {
        console.log('Disconnected from socket server')
      })

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error)
      })
    }

    return this.socket
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  getSocket(): Socket | null {
    return this.socket
  }

  isConnected(): boolean {
    return this.socket ? this.socket.connected : false
  }
}

export const socketClient = SocketClient.getInstance()
