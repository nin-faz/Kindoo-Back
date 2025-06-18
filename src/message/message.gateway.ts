import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
/**
 * Mise en place du webscoket permettant d'ecouter en temps reels l'ajout de nouveaux messages.
 */
export class MessageGateway implements OnGatewayConnection {
  @WebSocketServer()
  s_server: Server;

  handleConnection(p_client: any) {
    console.log(`📡 Client connecté : ${p_client.id}`);
  }

  sendNewMessage(p_message: any) {
    this.s_server.emit('newMessage', p_message);
  }
}
