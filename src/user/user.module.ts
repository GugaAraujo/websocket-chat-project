import { Module } from "@nestjs/common";
import { UserService } from './user.service';
import { UserGateway } from './user.gateway';

@Module({
    imports: [],
    controllers: [],
    providers: [UserService, UserGateway],
    exports: [UserService, UserGateway]
})

export class UserModule {}