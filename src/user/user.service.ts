import { Injectable } from "@nestjs/common";
import { User } from "./user.entity";

@Injectable()
export class UserService {

    public users: Array<User> = []

    public insertNewUser(user) {
        this.users.push(user)
        console.log(`New user insert: ${this.users.reverse()[0].name}`)
        return this.users
    }

}