export class Message {
    constructor(
        public name : string,
        public message : string,
        public color : string,
        public time: Date,
        public avatar?: string
    ){}
}