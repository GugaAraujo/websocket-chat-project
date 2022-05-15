import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { User } from './user.entity';
import { UserService } from './user.service';
import { Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { AlertService } from 'src/alert/alert.service';

@Injectable()
@WebSocketGateway()
export class UserGateway {

    public user: User;

  constructor(
      private userService: UserService,
      private alertService: AlertService,
      ) {}

    public getTime(): string {
        return new Date().toLocaleTimeString('pt-BR', {timeZone: 'America/Sao_Paulo'})
    }
        
  @SubscribeMessage('enteredUser')
  enteredUser(client: Socket, text: User): void {
    const newUser = new User(client.id, text.name, text.color, this.getTime())
    this.userService.insertNewUser(newUser)
    this.alertService.newUserAlert(newUser)
    this.alertService.sendWelcomeMesage(newUser)
    this.alertService.historyRemovalAlert(newUser)
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
