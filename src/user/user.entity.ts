export class User {

    constructor(
        public id: string,
        public name: string,
        public color: string,
        public time?: Date,
        public avatar?: string
    ){
    }
}