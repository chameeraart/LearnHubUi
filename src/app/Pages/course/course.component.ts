import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { CourseService } from '../../Services/course.service';
import { AuthService } from '../../Services/auth.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrl: './course.component.css'
})
export class CourseComponent {
  
  submitted = false;
  loading = false;
  error = '';
  Courses: any[] = [];
  editCourse: any = null;
  sortBy: string = '';
  sortDirection: number = 1;
  pageSize: number = 10; // Number of items per page
  currentPage: number = 1; // Current page number
  searchTerm: string = ''; // Search term input
  // Define task as a FormGroup
  Course: FormGroup;
  usertype: string = '';

  constructor(private fb: FormBuilder, private api: CourseService, private tostr: ToastrService, private auth :AuthService,private router: Router) { }

  ngOnInit() {
    // Initialize the form group with form controls
    this.initFormgroup();
    this.GetCourses();
    this.usertype=this.auth.getUserRole();
    console.log(this.usertype)
  }



  initFormgroup() {
    this.Course = this.fb.group({
      Id: [0],
      Title: ['', Validators.required],
      Description: ['', Validators.required],
      StartDate: ['', Validators.required],
      EndDate: ['', Validators.required],
      Instructor: ['', Validators.required],
      Language: ['', Validators.required],
      Fee: ['', Validators.required],
      Status: [true]
    });
  }

  GetCourses() {
    this.loading = true;
    this.api.getsaveGetAllCourse().subscribe(result => {
      this.Courses = Object.assign([], result);
      this.loading = false;
    });
  }

  LoadData() {
    this.Course = this.fb.group({
      Id: [this.editCourse.id],
      Title: [this.editCourse.title],
      Description: [this.editCourse.description],
      StartDate: [this.convertToDate(this.editCourse.startDate)],
      EndDate: [this.convertToDate(this.editCourse.endDate)],
      Instructor: [this.editCourse.instructor],
      Language: [this.editCourse.language],
      Fee: [this.editCourse.fee],
      Status: [this.editCourse.status]
    });
  }

  convertToDate(dateString: string): string {
    // Assuming dateString is in the format "yyyy-MM-ddTHH:mm:ss"
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Convert date to "yyyy-MM-dd" format
  }

  // Save The Course
  submitForm() {
    console.log(this.Course.value)
    this.submitted = true;
    // Check if the form is invalid
    if (this.Course.invalid) {
      this.tostr.error('Please fill out all fields.');
      return;
    }

    this.loading = true; // Set loading to true before making the API call
    this.api.saveCourse(this.Course.value).subscribe(
      result => {
        this.tostr.success("Course Details Saved Successfully");
        this.loading = false;
        this.Course.reset(); // Reset the form after successful submission
        this.GetCourses();
        this.initFormgroup();
      },
      (error: HttpErrorResponse) => {
        this.tostr.error("An error occurred while saving Course details");
        this.loading = false;
        console.error(error);
      }
    );
  }

  // Edit Selected Record
  onEdit(id: number) {
    this.loading = true;
    this.api.getSCourse(id).subscribe(result => {
      this.editCourse = Object.assign([], result);
      console.log(this.editCourse)
      this.LoadData();
      this.loading = false;
    });
  }

  // Delete the Selected Record
  onDelete(Course) {
    if (confirm('Are You Sure To Delete This Record?')) {
      this.api.deleCourse(Course).subscribe(
        result => {
          this.tostr.success("Delete Course Successfully");
          this.GetCourses();
        },
        (error: HttpErrorResponse) => {
          this.loading = false;
        }
      );
    }
  }


  get filteredCourses(): any[] {
    let filtered = this.Courses;
    if (this.searchTerm.trim() !== '') {
      const searchTermLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTermLower) ||
        course.description.toLowerCase().includes(searchTermLower) ||
        course.language.toLowerCase().includes(searchTermLower)
      );
    }

    // Calculate start and end index for pagination
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    // Return paginated results
    return filtered.slice(startIndex, endIndex);
  }

  getTotalPages(): number {
    return Math.ceil(this.filteredCourses.length / this.pageSize);
  }

  onPageChange(page: number): void {
    // Update current page
    this.currentPage = page;
  }


  // Reset the form
  clear() {
    this.Course.reset(); // Reset the form
  }

  logout() {
    // Call the logout method from your authentication service
    this.auth.logout();
  
    // Redirect the user to the login page or any other page
    this.router.navigate(['/login']); // Example: Navigate to login page
  }
  navigateToMainPage() {
    if(this.usertype =='Admin'){
      this.router.navigate(['/main']);
    }
    else{
      this.router.navigate(['/mainuser']);
    }
           
    }



}
