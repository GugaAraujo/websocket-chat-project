import { Module } from "@nestjs/common";
import { AlertGateway } from "./alert.gateway";
import { AlertService } from "./alert.service";

@Module({
    controllers: [],
    providers: [AlertGateway, AlertService],
    exports: [AlertGateway, AlertService]
})

export class AlertModule {}