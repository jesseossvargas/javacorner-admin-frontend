import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, catchError, throwError } from 'rxjs';
import { Course } from 'src/app/model/course.model';
import { PageResponse } from 'src/app/model/page.response.model';
import { CoursesService } from 'src/app/services/courses.service';

@Component({
  selector: 'app-courses-student',
  templateUrl: './courses-student.component.html',
  styleUrls: ['./courses-student.component.css']
})
export class CoursesStudentComponent implements OnInit {
  studentId!: number;
  pageCourses!: Observable<PageResponse<Course>>;
  currentPage:number=0;
  pageSize:number=5;
  errorMessage!:string;
  coursesFormGroup!: FormGroup;
  submitted:boolean=false;
  updateCourseFormGroup!:FormGroup;
  pageOtherCourses!:Observable<PageResponse<Course>>;
  otherCoursesCurrentPage:number=0;
  otherCoursesPageSize:number=5;
  otherCoursesErrorMessage!: string;

  constructor(private route : ActivatedRoute, private coursesService:CoursesService, private fb:FormBuilder, private modalService:NgbModal) { }

  ngOnInit(): void {
    this.studentId = this.route.snapshot.params['id'];
    this.handleSearchStudentCourses();
    this.handleSearchNonEnrolledInCourses();
  }

  private handleSearchStudentCourses(){
    this.pageCourses = this.coursesService.getCoursesByStudent(this.studentId, this.currentPage, this.pageSize).pipe(
      catchError (err => {
        this.errorMessage = err.message;
        return throwError(err);
      })
    )
  }

  gotoPage(page : number){
    this.currentPage = page;
    this.handleSearchStudentCourses();
  }


  onCloseModal(modal : any){
    modal.close();
    this.coursesFormGroup.reset();
  }

  onSaveCourse(modal : any){
    this.submitted=true;
    if(this.coursesFormGroup.invalid)return;
    this.coursesService.saveCourse(this.coursesFormGroup.value).subscribe({
      next: () =>{
        alert("Success Saving Course");
        this.handleSearchStudentCourses();
        this.coursesFormGroup.reset();
        this.submitted=false;
        modal.close();
      }, error: err => {
        alert(err.message);
        console.log(err);
      }
    })
  }

  onCloseUpdateModal(updateModal : any){
    updateModal.close();
    this.updateCourseFormGroup.reset();
  }

  handleSearchNonEnrolledInCourses(){
    this.pageOtherCourses = this.coursesService.
      getNonEnrolledInCoursesByStudent(this.studentId, this.otherCoursesCurrentPage, this.otherCoursesPageSize).
      pipe(catchError(err =>{
        this.otherCoursesErrorMessage = err.message;  
        return throwError(err);
      })
    )
  }

  gotoPageForOtherCourses(page : number){
    this.otherCoursesCurrentPage = page;
    this.handleSearchNonEnrolledInCourses();  
  }

  enrollIn(c:Course){
    this.coursesService.enrollStudentInCourse(c.courseId,this.studentId).subscribe({
      next:()=>{
        this.handleSearchStudentCourses();
        this.handleSearchNonEnrolledInCourses();
      }, error: err=> {
        alert(err.message);
        console.log(err);
      }

    })
  }

}
