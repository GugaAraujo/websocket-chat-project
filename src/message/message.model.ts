import { Global, Module } from "@nestjs/common";
import { UserModule } from "src/user/user.model";
import { MessageGateway } from "./message.gateway";
import { MessageService } from "./message.service";

@Global()
@Module({
    imports: [],
    controllers: [],
    providers: [MessageGateway, MessageService],
    exports: [MessageGateway, MessageService]
})

export class MessageModule {}