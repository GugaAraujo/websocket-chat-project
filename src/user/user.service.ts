import { Injectable } from "@nestjs/common";
import { User } from "./user.entity";
import { getTime, log } from 'src/utils/utils';
import { ScoreboardService } from "src/scoreboard/scoreboard.service";

@Injectable()
export class UserService {
    constructor(
        private scoreboardService: ScoreboardService
    ){}

    public users: Array<User> = []

    public insertNewUser(user: User): void {
        this.users.push(user)
    }

    public userExit(clientId: string): void {
        this.users = this.users.filter(user => user.id !== clientId)
    }

    public getUser(clientId: string): User {
        const client = this.users.filter(user => user.id === clientId)[0]
        return client
    }
    
    public checkIfUserHasId(clientId: string): boolean {
        return this.getUser(clientId)
        ? true : false
    }

    public getAllUsers(): User[] {
        return this.users
    }

    public async getScoreboard(): Promise<Object> {

        return await this.scoreboardService.getRecord()
            .then(record => {
                const numberOfUsersOnline = this.getNumberOfUsers()

                return this.checkRecordAndUptade(numberOfUsersOnline, record)
                    .then(checkedRecord =>{
                        const scoreboard = {
                            total: numberOfUsersOnline,
                            record: checkedRecord,
                        }
         
                        return scoreboard
                    })              
            })
    }

    private async checkRecordAndUptade(numberOfUsersOnline: Number, record: Number): Promise<Number> {
        if(this.isANewRecord(numberOfUsersOnline, record)){
            return await this.scoreboardService.saveNewRecord(numberOfUsersOnline)
        }
        else{
            return record
        }    
    }

    private isANewRecord(numberOfUsersOnline: Number, record: Number): boolean {
        return numberOfUsersOnline > record   
    }
  
    private getNumberOfUsers(): Number {
        return this.users.length
    }

}