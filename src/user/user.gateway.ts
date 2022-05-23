import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { User } from './user.entity';
import { UserService } from './user.service';
import { Socket } from 'socket.io';
import { AlertService } from 'src/alert/alert.service';
import { MessageGateway } from 'src/message/message.gateway';
import { getTime, log } from 'src/utils/utils'
import { ScoreboardService } from 'src/scoreboard/scoreboard.service';


@WebSocketGateway()
export class UserGateway {

    private user: User;

    constructor(
        private userService: UserService,
        private alertService: AlertService,
        private messageGateway : MessageGateway,
    
        ) {}
        
    @SubscribeMessage('enteredUser')
    enteredUser(client: Socket, text: User): void {
        const newUser = new User(client.id, text.name, text.color, getTime())
        this.userService.insertNewUser(newUser)
        this.updateUserList(client)
        this.messageGateway.sendAllMessages(client)
        this.alertService.newUserAlert(client)
        this.alertService.sendWelcomeMesage(client, newUser.name)
        this.alertService.historyRemovalAlert(client)
        this.sendScoreboard(client)     
    }

    private sendScoreboard(client: Socket): void {
        const scoreboard = this.userService.getScoreboard()

        Promise.resolve(scoreboard)
            .then(scoreboard => {
                this.alertService.sendScoreboard(client, scoreboard)
            })
    }

    public userExit(client: Socket): void{
        const outgoingUser = this.userService.getUser(client.id)
        if(outgoingUser){
            outgoingUser.time = getTime()
            this.userService.userExit(client.id)
            this.alertService.outgoingUserAlert(outgoingUser)
            this.updateUserList(client)
        }
    }

    private updateUserList(client: Socket) {
        const allUsers = this.userService.getAllUsers()
        this.alertService.updateUserList(client, allUsers)
        this.sendScoreboard(client)  
    }
}
