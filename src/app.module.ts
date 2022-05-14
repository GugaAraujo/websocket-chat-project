import { Module } from '@nestjs/common';
import { AppGateway } from './app.gateway';
import { UserModule } from './user/user.model';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';


@Module({
  imports: [
      UserModule,
      ServeStaticModule.forRoot({
        rootPath: join(__dirname, '..', 'src/public'),
      }),
    ],
  controllers: [],
  providers: [AppGateway],
})
export class AppModule {}
