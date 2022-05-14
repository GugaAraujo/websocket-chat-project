import { SubscribeMessage, WebSocketGateway, WsResponse } from '@nestjs/websockets';
import { User } from './user.entity';
import { UserService } from './user.service';
import { Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';

@Injectable()
@WebSocketGateway()
export class UserGateway {

    public user: User;

  constructor(private userService: UserService) {}

  @SubscribeMessage('enteredUser')
  enteredUser(client: Socket, text: User): WsResponse<string> {
    const newUser = new User(client.id, text.name, text.color)
    this.userService.insertNewUser(newUser)
    return { event: 'entering', data: `Hello, ${newUser.name}` };
  }

}
