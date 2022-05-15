import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { UserGateway } from './user/user.gateway';

@WebSocketGateway({ cors: true })

export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    constructor(private userGateway: UserGateway){}

  private logger: Logger = new Logger('AppGateway');

  afterInit(server: Server): void  {
    this.logger.log('Websocket-chat initialized');
  }

  handleConnection(client: Socket, ...args: any[]): void {
    this.logger.log(`Client connected: ${client.id}`)
  }
  
  handleDisconnect(client: Socket): void {
    this.logger.log(`Client disconnected: ${client.id}`)
    this.userGateway.userExit(client)
  }

}
