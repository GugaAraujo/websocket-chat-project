import { Module } from '@nestjs/common';
import { AppGateway } from './app.gateway';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UserService } from './user/user.service';
import { MessageService } from './message/message.service';
import { AlertService } from './alert/alert.service';
import { UserGateway } from './user/user.gateway';
import { MessageGateway } from './message/message.gateway';
import { AlertGateway } from './alert/alert.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { ScoreboardModule } from './scoreboard/scoreboard.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    MongooseModule.forRoot(process.env.mongoCNSTRING),
    ScoreboardModule,
      ServeStaticModule.forRoot({
        rootPath: join(__dirname, '..', 'src/public'),
      }),
    ],
  controllers: [],
  providers: [AppGateway, UserService, UserGateway, MessageService, MessageGateway, AlertService, AlertGateway],
})
export class AppModule {}
