import { Injectable } from "@nestjs/common";
import { User } from "src/user/user.entity";
import { AlertGateway } from "./alert.gateway";

@Injectable()
export class AlertService {

    constructor(
        private alertGateway: AlertGateway
    ){}

    public sendWelcomeMesage(client: User): void {
        const welcomeMessage = `Olá, ${client.name}! &#128516`
        this.alertGateway.sendWelcomeMesage(client, welcomeMessage)
    }

    public newUserAlert(client: User): void{
        this.alertGateway.newUserAlert(client)  
    }

    public reconnectedUserAlert(client: User): void {
        const reconnectedUserAlert = `reconectou ao chat.`
        this.alertGateway.reconnectedUserAlert(client, reconnectedUserAlert)
    }

    public historyRemovalAlert(client: User): void{
        const phraseRemovalRange = 120000
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