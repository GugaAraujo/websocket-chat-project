import { Module } from "@nestjs/common";
import { UserService } from './user.service';
import { UserGateway } from './user.gateway';

@Module({
    controllers: [],
    providers: [UserService, UserGateway],
})

export class UserModule {}