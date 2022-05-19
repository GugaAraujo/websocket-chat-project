import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { User } from 'src/user/user.entity';

@WebSocketGateway() 

export class AlertGateway {

    @WebSocketServer() server: Server; 

    public sendWelcomeMesage(client: User,welcomeMessage: string): void{
        this.sendToSpecificClient(client, 'entering', welcomeMessage)
    }

    public newUserAlert(client: User): void {
        this.dontSendToSpecificClient( client, 'alert_newUser', client)  
    }

    public reconnectedUserAlert(client: User, alert: string): void {
        this.sendToSpecificClient(client, 'entering', `Você ${alert}`)
        this.dontSendToSpecificClient(client, 'entering', `${client.name} ${alert}`)
    }

    public historyRemovalAlert(client: User, historyRemovalAlert: string): void{
        this.sendToSpecificClient(client, 'historyRemovalAlert', historyRemovalAlert)
    }

    public outgoingUserAlert(outgoingUser: User): void {
        this.server.emit('outgoingUser', outgoingUser);
    }

    private sendToSpecificClient(client: User, event: string, data: string): void {
        const allSockets = this.server.sockets.sockets
        allSockets.forEach(socket => {  
            if(socket.id === client.id){
                socket.emit(event, data);
            }
        })
    }

    private dontSendToSpecificClient(client: User, event: string, data: string | object): void {
        const allSockets = this.server.sockets.sockets
        allSockets.forEach(socket => {  
            if(socket.id !== client.id){
                socket.emit(event, data);
            }
        })
    }
    



}
