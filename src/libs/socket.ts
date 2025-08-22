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
      console.log('Creating new socket connection for user:', userId)
      this.socket = io(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000', {
        path: '/api/socket',
        transports: ['polling'],
        timeout: 20000,
        forceNew: true,
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

      this.socket.on('reconnect', () => {
        console.log('Reconnected to socket server')
        this.socket?.emit('join-room', userId)
      })

      this.socket.on('reconnect_error', (error) => {
        console.error('Socket reconnection error:', error)
      })
    } else {
      console.log('Using existing socket connection')
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
