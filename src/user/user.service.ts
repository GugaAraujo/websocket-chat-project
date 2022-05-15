import { Injectable } from "@nestjs/common";
import { User } from "./user.entity";

@Injectable()
export class UserService {

    public users: Array<User> = []

    public insertNewUser(user): void {
        this.users.push(user)
    }

    public userExit(clientId: string): void {
        this.users = this.users.filter(user => user.id !== clientId)
    }

    public getUser(clientId: string): User {
        const client = this.users.filter(user => user.id === clientId)[0]
        return client
    }

}