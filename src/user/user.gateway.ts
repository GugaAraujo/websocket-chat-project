import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { User } from './user.entity';
import { UserService } from './user.service';
import { Socket } from 'socket.io';
import { AlertService } from 'src/alert/alert.service';
import { MessageGateway } from 'src/message/message.gateway';

@WebSocketGateway()
export class UserGateway {

    public user: User;

  constructor(
      private userService: UserService,
      private alertService: AlertService,
      private messageGateway : MessageGateway
 
      ) {}

    public getTime(): string {
        return new Date().toLocaleTimeString('pt-BR', {timeZone: 'America/Sao_Paulo'})
    }
        
    @SubscribeMessage('enteredUser')
    enteredUser(client: Socket, text: User): void {
        const newUser = new User(client.id, text.name, text.color, this.getTime())
        this.userService.insertNewUser(newUser)
        this.messageGateway.sendAllMessages(client)
        this.alertService.newUserAlert(client)
        this.alertService.sendWelcomeMesage(client, newUser.name)
        this.alertService.historyRemovalAlert(client)
    }

  public userExit(client: Socket): void{
    const outgoingUser = this.userService.getUser(client.id)
    if(outgoingUser){
        outgoingUser.time = this.getTime()
        this.userService.userExit(client.id)
        this.alertService.outgoingUserAlert(outgoingUser)
    }
  }
}
