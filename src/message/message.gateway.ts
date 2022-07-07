
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AlertService } from 'src/alert/alert.service';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Message } from './message.entity';
import { MessageService } from './message.service';
import { getTime } from 'src/utils/utils';


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
        const newMessage = new Message(messageSent.name, messageSent.message, messageSent.color, getTime(), messageSent.avatar)
        const userHasId = this.userService.checkIfUserHasId(client.id)

        if(userHasId){
            client.broadcast.emit('receivedMessage', newMessage)
            this.messageService.insertNewMessage(newMessage)
        }
        else{
            this.reconnectingUser(client, messageSent)
        }
    
    }

    @SubscribeMessage('typingAlert')
    whoIsTyping(client: Socket, messageSent: Message) {
        client.broadcast.emit('typingAlert', new User(client.id, messageSent.name, messageSent.color))
    }

    private reconnectingUser(client: Socket, messageSent): void{
        const reconnectedUser = new User(client.id, messageSent.name, messageSent.color)
        this.alertService.reconnectedUserAlert(client, reconnectedUser)
        this.userService.insertNewUser(reconnectedUser)
    }

    public sendAllMessages(client: Socket): void {
        const allMessages = this.messageService.getAllMessages()
        client.emit('PreviousMessages', allMessages)
    }

}