import { User } from "./user.model";

export interface Instructor{
    instructorId:number;
    firstName:String;
    lastName:String;
    summary:String;
    user: User;
}