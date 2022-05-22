import { Module } from "@nestjs/common";
import { UserService } from './user.service';
import { UserGateway } from './user.gateway';
import { ScoreboardService } from "src/scoreboard/scoreboard.service";

@Module({
    imports: [],
    controllers: [],
    providers: [UserService, UserGateway],
    exports: [UserService, UserGateway]
})

export class UserModule {}