export class User {

    constructor(
        public id: string,
        public name: string,
        public color: string,
        public time?: string,
        public avatar?: string
    ){
    }
}