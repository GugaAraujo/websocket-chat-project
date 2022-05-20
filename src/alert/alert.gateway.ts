import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';

@WebSocketGateway() 

export class AlertGateway {

    @WebSocketServer() server: Server; 

    constructor(
        private userService: UserService
    ){}

    public sendWelcomeMesage(client: Socket, welcomeMessage: string): void{
        client.emit('entering', welcomeMessage)
    }

    public updateUserList(client: Socket, allUsers: User[]): void {
        client.emit('sendAllUsers', allUsers)
    }

    public newUserAlert(client: Socket): void {
        const newUser = this.userService.getUser(client.id)
        client.broadcast.emit('alert_newUser', newUser)
    }

    public reconnectedUserAlert(client: Socket, reconnectedUser: User, alert: string): void {
        client.emit('entering', `Você ${alert}`)
        client.broadcast.emit('entering', `${reconnectedUser.name} ${alert}`)
    }

    public historyRemovalAlert(client: Socket, historyRemovalAlert: string): void{
        client.emit('historyRemovalAlert', historyRemovalAlert)
    }

    public outgoingUserAlert(outgoingUser: User): void {
        this.server.emit('outgoingUser', outgoingUser);
    }

}
