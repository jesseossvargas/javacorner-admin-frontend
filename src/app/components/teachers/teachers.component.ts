import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, catchError, config, throwError } from 'rxjs';
import { Course } from 'src/app/model/course.model';
import { Instructor } from 'src/app/model/instructor.model';
import { PageResponse } from 'src/app/model/page.response.model';
import { CoursesService } from 'src/app/services/courses.service';
import { InstructorsService } from 'src/app/services/instructors.service';
import { UsersService } from 'src/app/services/users.service';
import { EmailExistsValidator } from 'src/app/validators/emailexists.validator';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.css']
})


export class TeachersComponent implements OnInit {

    modalInstructor!:Instructor;
    pageInstructors!:Observable<PageResponse<Instructor>>;
    searchFormGroup!:FormGroup;
    currentPage:number=0;
    pageSize:number=5;
    errorMessage!:string;
    instructorFormGroup!:FormGroup;
    submitted:boolean=false;
    pageCourses$!:Observable<PageResponse<Course>>
    coursesCurrentPage:number=0;
    coursesPageSize:number=5;
    coursesErrorMessage!:string;

  constructor(private modalService: NgbModal, private fb:FormBuilder, private instructorService:InstructorsService, private userService:UsersService, 
    private courseService:CoursesService ) {}

  ngOnInit(): void {
    this.searchFormGroup = this.fb.group({
      keyword: this.fb.control('')
    })
    this.instructorFormGroup = this.fb.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      summary: ["", Validators.required],
      user: this.fb.group({
        email:["", [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9,-]+\\.[a-z]{2,4}$")], [EmailExistsValidator.validate(this.userService)]],
        password:["", Validators.required]
      })
    })
    this.handleSearchInstructors();
  }


  getModal(content: any){
    this.submitted=false;
    this.modalService.open(content, { size: 'xl' })
  }

  handleSearchInstructors(){
    let keyword = this.searchFormGroup.value.keyword;
    this.pageInstructors = this.instructorService.searchInstructors(keyword, this.currentPage, this.pageSize).pipe(
      catchError( err =>{
        this.errorMessage = err.message;
        return throwError(err)
      })
    )
  }

  gotoPage(page:number){
    this.currentPage = page;
    this.handleSearchInstructors();
  }

  handleDeleteCourse(i: Instructor){
    let conf = confirm("Are you sure?");
    if(!conf) return;
    this.instructorService.deleteInstructor(i.instructorId).subscribe({
      next:() =>{
        this.handleSearchInstructors();
      },
      error: err=>{
        alert(err.message);
        console.log(err);
      }
    })
  }

  onCloseModal(modal: any){
    modal.close();
    this.instructorFormGroup.reset();
  }

  onSaveInstructor(modal: any){
    console.log(this.instructorFormGroup)
    this.submitted=true;
    if(this.instructorFormGroup.invalid) return;
    this.instructorService.saveInstructor(this.instructorFormGroup.value).subscribe({
      next:()=>{
        alert("Success Saving Instructor");
        this.handleSearchInstructors();
        this.instructorFormGroup.reset;
        this.submitted = false;
        modal.close();
      }, error: err=> {
        alert(err.message);
        console.log(err);
      }
    })
  }

  getCoursesModal(i:Instructor, coursesContent:any){
    this.coursesCurrentPage = 0;
    this.modalInstructor = i;
    this.handleSearchCourses(i);
    this.modalService.open(coursesContent, {size : 'xl'});
  }

  handleSearchCourses(i:Instructor){
    this.pageCourses$ = this.courseService.getCoursesByInstructor(i.instructorId, this.coursesCurrentPage, this.coursesPageSize).pipe(
      catchError(err=>{
        this.coursesErrorMessage = err;
        return throwError(err);
      })
    )
  }

  gotoCoursesPage(page:number){
    this.coursesCurrentPage = page;
    this.handleSearchCourses(this.modalInstructor);
  }
}

