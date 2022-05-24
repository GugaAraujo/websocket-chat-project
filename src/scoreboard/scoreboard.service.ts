
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Scoreboard } from './scoreboard.model';
import { Model } from 'mongoose';
import { getTime, log } from 'src/utils/utils'

@Injectable()
export class ScoreboardService {
 
    constructor(
        @InjectModel('record') private readonly scoreboardModel: Model<Scoreboard>,    
      ) {
      }
    
      async create(): Promise<Number> {
            const firstRecord = {"record":1}
            this.scoreboardModel.create(firstRecord)
            return firstRecord.record
      }

      async getRecord(): Promise<Number>{

        try {
            return await this.scoreboardModel.findOne()
                .then(record => {
                    if(!record){
                        return this.create()
                    }
                    return record.record
                })

        } catch (error) {
            throw new Error("Erro ao conectar com o banco");
        }
      }
    
      async saveNewRecord(newRecord: Number): Promise<Number> {
          try {
            return this.scoreboardModel.findOneAndUpdate({"record":newRecord})
                .then(()=>{
                    return this.getRecord()
                })
          } catch (error) {
            throw new Error("Erro ao conectar com o banco");
          }
      }

}
