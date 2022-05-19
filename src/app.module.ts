import { Module } from '@nestjs/common';
import { AppGateway } from './app.gateway';
import { UserModule } from './user/user.model';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AlertModule } from './alert/alert.model';
import { MessageModule } from './message/message.model';
import { UserService } from './user/user.service';
import { MessageService } from './message/message.service';
import { AlertService } from './alert/alert.service';
import { UserGateway } from './user/user.gateway';
import { MessageGateway } from './message/message.gateway';
import { AlertGateway } from './alert/alert.gateway';

@Module({
  imports: [
      ServeStaticModule.forRoot({
        rootPath: join(__dirname, '..', 'src/public'),
      }),
    ],
  controllers: [],
  providers: [AppGateway, UserService, UserGateway, MessageService, MessageGateway, AlertService, AlertGateway],
})
export class AppModule {}
