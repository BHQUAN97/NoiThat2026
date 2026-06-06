import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { Logger } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

export interface FormNotification {
  id: string
  form_type: 'quote' | 'contact'
  name: string
  phone: string
  created_at: string
}

@WebSocketGateway({
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:8082'],
    credentials: true,
  },
  namespace: '/notifications',
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server

  private readonly logger = new Logger(NotificationsGateway.name)
  private adminSockets = new Set<string>()

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    // Validate JWT từ handshake auth
    const token = client.handshake.auth?.token as string | undefined
    if (!token) {
      client.disconnect()
      return
    }

    try {
      const payload = this.jwtService.verify(token)
      const role = payload?.role as string | undefined
      if (role !== 'admin' && role !== 'super_admin') {
        client.disconnect()
        return
      }
      client.join('admin-room')
      this.adminSockets.add(client.id)
      this.logger.log(`Admin connected: ${client.id} (${payload.email})`)
    } catch {
      client.disconnect()
    }
  }

  handleDisconnect(client: Socket) {
    this.adminSockets.delete(client.id)
    this.logger.log(`Client disconnected: ${client.id}`)
  }

  // Gọi từ FormsService khi có form mới
  notifyNewForm(data: FormNotification) {
    this.server.to('admin-room').emit('new-form', data)
    this.logger.log(`Notified admin-room: new ${data.form_type} from ${data.name}`)
  }

  @SubscribeMessage('ping')
  handlePing(client: Socket) {
    client.emit('pong', { time: Date.now() })
  }
}
