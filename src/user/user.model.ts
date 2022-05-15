import { Module } from "@nestjs/common";
import { UserService } from './user.service';
import { UserGateway } from './user.gateway';
import { AlertModule } from "src/alert/alert.model";

@Module({
    imports: [AlertModule],
    controllers: [],
    providers: [UserService, UserGateway],
    exports: [UserGateway]
})

export class UserModule {}