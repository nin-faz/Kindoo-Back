import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class MessageGateway implements OnGatewayConnection {
  @WebSocketServer()
  s_server: Server;

  handleConnection(client: any) {
    console.log(`📡 Client connecté : ${client.id}`);
  }

  sendNewMessage(message: any) {
    this.s_server.emit('newMessage', message);
  }
}
