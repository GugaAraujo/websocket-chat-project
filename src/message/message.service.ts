import { Message } from "./message.entity";
import { MessageGateway } from "./message.gateway";

export class MessageService {

    public allMessages: Array<Message> = []

    public insertNewMessage(message: Message): void {
        this.allMessages.push(message)
    }

    public getAllMessages(): Message[] {
        return this.allMessages
    }

    public cleanHistoryPeriodically(): void{
        setInterval(() => this.allMessages.shift(), (1000 * 60 * 2));
    }
  
}

