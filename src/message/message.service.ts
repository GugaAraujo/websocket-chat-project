import { Message } from "./message.entity";
import { userIsRegistered } from 'src/decorators/user-is-registered';
export class MessageService {

    public allMessages: Array<Message> = []

    @userIsRegistered("Sua mensagem não pode ser enviada. Entre novamente.")
    public insertNewMessage(message: Message): void {
        this.allMessages.push(message)
    }

    public getAllMessages(): Message[] {
        return this.allMessages
    }

    public cleanHistoryPeriodically(): void{
        setInterval(() => this.allMessages.shift(), Number(process.env.phraseRemovalRange));
    }
  
}

