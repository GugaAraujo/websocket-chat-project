
import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { ScoreboardSchema } from './scoreboard.model';
import { ScoreboardService } from './scoreboard.service';


@Module({
  imports: [
    MongooseModule.forFeature([{
      name: 'record', schema: ScoreboardSchema,
    }]),
  ],
  providers: [ScoreboardService],
  controllers: [],
  exports: [ScoreboardService]
})
export class ScoreboardModule {
}
