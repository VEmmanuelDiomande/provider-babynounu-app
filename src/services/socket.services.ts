import { io, Socket } from 'socket.io-client'

const SOCKET_URL =
  import.meta.env.MODE === 'development' ? 'http://localhost:3000' : 'https://api.babynounu.com'

export interface PaymentStatusPayload {
  transactionId: string
  status: string
  isPayment: boolean
  hasActiveSubscription: boolean
}

export class PaymentSocketService {
  private socket: Socket | null = null
  private listeners: Map<string, Set<(data: any) => void>> = new Map()

  connect(userId: string, transactionId: string): Socket {
    if (this.socket?.connected) {
      return this.socket
    }

    this.socket = io(`${SOCKET_URL}/payment`, {
      query: { userId, transactionId },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
    })

    this.socket.on('connect', () => {
      console.log('[PaymentSocket] Connected for', userId, transactionId)
    })

    this.socket.on('disconnect', (reason) => {
      console.log('[PaymentSocket] Disconnected:', reason)
    })

    this.socket.on('connect_error', (error) => {
      console.error('[PaymentSocket] Connection error:', error.message)
    })

    this.socket.on('connect', () => {
      this.restoreListeners()
    })

    return this.socket
  }

  on(event: string, callback: (data: any) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(callback)

    if (this.socket) {
      this.socket.on(event, callback)
    }
  }

  off(event: string, callback?: (data: any) => void): void {
    if (callback) {
      this.listeners.get(event)?.delete(callback)
      this.socket?.off(event, callback)
    } else {
      this.listeners.delete(event)
      this.socket?.off(event)
    }
  }

  emit(event: string, data?: any): void {
    this.socket?.emit(event, data)
  }

  private restoreListeners(): void {
    if (!this.socket) return
    this.listeners.forEach((callbacks, event) => {
      callbacks.forEach((callback) => {
        this.socket?.off(event, callback)
        this.socket?.on(event, callback)
      })
    })
  }

  disconnect(): void {
    this.listeners.clear()
    this.socket?.removeAllListeners()
    this.socket?.disconnect()
    this.socket = null
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false
  }
}

export const paymentSocketService = new PaymentSocketService()
