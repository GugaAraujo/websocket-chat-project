
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AlertService } from 'src/alert/alert.service';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Message } from './message.entity';
import { MessageService } from './message.service';



@WebSocketGateway()
export class MessageGateway {
    @WebSocketServer() 
    server: Server; 
    socket: Socket; 

    constructor(     
        private userService: UserService,
        private alertService: AlertService,
        private messageService : MessageService,
    ){}

    @SubscribeMessage('sendMessage')
    sendMessage(client: Socket, messageSent: Message): void {
        const newMessage = new Message(messageSent.name, messageSent.message, messageSent.color, this.getTime())
        const userHasId = this.userService.checkIfUserHasId(client.id)

        if(!userHasId){
            const reconnectedUser = new User(client.id, messageSent.name, messageSent.color)
            this.alertService.reconnectedUserAlert(client, reconnectedUser)
            this.userService.insertNewUser(reconnectedUser)
        }
        client.broadcast.emit('receivedMessage', newMessage)
        this.messageService.insertNewMessage(newMessage)
    }

    public sendAllMessages(client: Socket): void {
        const allMessages = this.messageService.getAllMessages()
        client.emit('PreviousMessages', allMessages)
    }


    // MELHORAR O GET TIME

    // MElhorar Mensagens emit para um unico user e para todos, excluindo o client








    private sendToSpecificClient(client: User, event: string, data: string | Array<any>): void {
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
    public getTime(): string {
        return new Date().toLocaleTimeString('pt-BR', {timeZone: 'America/Sao_Paulo'})
    }




    
}