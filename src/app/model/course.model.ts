import { Instructor } from "./instructor.model";

export interface Course{
    courseId:number;
    courseName:number;
    courseDuration:number;
    courseDescription:number;
    instructor: Instructor;
}