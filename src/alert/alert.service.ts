import { Injectable } from "@nestjs/common";
import { Socket } from 'socket.io';
import { User } from "src/user/user.entity";
import { AlertGateway } from "./alert.gateway";

@Injectable()
export class AlertService {

    constructor(
        private alertGateway: AlertGateway
    ){}

    public sendWelcomeMesage(client: Socket, userName: string): void {
        const welcomeMessage = `Olá, ${userName}! 👋`
        this.alertGateway.sendWelcomeMesage(client, welcomeMessage)
    }

    public sendScoreboard(client: Socket, scoreboard: Object): void {
        this.alertGateway.sendScoreboard(client, scoreboard)
    }

    public updateUserList(client: Socket, allUsers: User[]): void {
        this.alertGateway.updateUserList(client, allUsers)
    }

    public newUserAlert(client: Socket): void{
        this.alertGateway.newUserAlert(client)  
    }

    public reconnectedUserAlert(client: Socket, reconnectedUser: User): void {
        const reconnectedUserAlert = `reconectou ao chat.`
        this.alertGateway.reconnectedUserAlert(client, reconnectedUser, reconnectedUserAlert)
    }

    public historyRemovalAlert(client: Socket): void{
        const phraseRemovalRange = Number(process.env.phraseRemovalRange)
        const historyRemovalAlert = 
        `A cada ${phraseRemovalRange/60000} minutos, uma frase é removida no histórico do chat. 
        Nada ficará gravado por muito tempo.`  
        setTimeout(() => this.alertGateway.historyRemovalAlert(client, historyRemovalAlert))
    }
    
    public outgoingUserAlert(client: User): void {
        const outgoingUser = client
        this.alertGateway.outgoingUserAlert(outgoingUser)
    }
}