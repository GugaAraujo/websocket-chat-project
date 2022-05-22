import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { MessageService } from './message/message.service';
import { UserGateway } from './user/user.gateway';
import { getTime, log } from 'src/utils/utils'

@WebSocketGateway({ cors: true })

export class AppGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    constructor(
        private userGateway: UserGateway,
        private messageService: MessageService
    ){}

    private logger: Logger = new Logger('AppGateway');

    afterInit(server: Server): void  {
        this.logger.log('Websocket-chat initialized');
        this.messageService.cleanHistoryPeriodically()
    }

    handleConnection(client: Socket, ...args: any[]): void {
        this.logger.log(`Client connected: ${client.id}`)
    }
  
    handleDisconnect(client: Socket): void {
        this.logger.log(`Client disconnected: ${client.id}`)
        this.userGateway.userExit(client)
    }

}
