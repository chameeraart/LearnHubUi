import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EnrollService } from '../../Services/enroll.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { CourseService } from '../../Services/course.service';
import { StudentregisterService } from '../../Services/studentregister.service';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-enroll',
  templateUrl: './enroll.component.html',
  styleUrl: './enroll.component.css'
})
export class EnrollComponent {
  submitted = false;
  loading = false;
  error = '';
  Courses: any[] = [];
  Students: any[] = [];
  Enrolls : any[] = [];
  editEnroll: any = null;
  searchTerm: string = '';
  sortBy: string = '';
  sortDirection: number = 1;
  pageSize: number = 5; // Number of items per page
  currentPage: number = 1; // Current page number
  // Define task as a FormGroup
  Enroll: FormGroup;
  usertype: string = '';
  userid: any =null;

  constructor(private fb: FormBuilder, private api: EnrollService, private tostr: ToastrService,private course: CourseService,private student: StudentregisterService,private auth: AuthService,private route: Router) { }

  ngOnInit() {
    // Initialize the form group with form controls
    this.initFormgroup();
    this.usertype=this.auth.getUserRole();
    this.GetStudent();
    this.GetCourses();
    if(this.usertype =='Admin'){
      this.GetEnroll();
    }
    else{
      this.GetEnrollUsers();
    }

  }


  initFormgroup() {
    this.Enroll = this.fb.group({
      Id: [0],
      StudentId: ['', Validators.required],
      CourseId: ['', Validators.required],
      Created_datetime: [''],
      Status: ['']
    });
  }

  GetCourses() {
    this.loading = true;
    this.course.getsaveGetAllCourse().subscribe(result => {
      this.Courses = Object.assign([], result);
      this.loading = false;
    });
  }

  GetStudent() {
    this.loading = true;
    this.student.getsaveStudentAll().subscribe(result => {
      this.Students = Object.assign([], result);
      this.loading = false;
      this.userid = this.auth.getUserId();
      const userIdNumber = parseInt(this.userid);

      if(this.usertype !='Admin'){
      this.Students = this.Students.filter(student => student.id === userIdNumber);
      }

    });
  }

  GetEnroll() {
    this.loading = true;
    this.api.getsaveGetAllEnroll().subscribe(result => {
      this.Enrolls = Object.assign([], result);
      this.loading = false;
    });
  }

GetEnrollUsers() {
  this.userid = this.auth.getUserId();
  // Ensure that userid is a valid number
  const userIdNumber = parseInt(this.userid);
  this.api.getEnrollUser(userIdNumber).subscribe(result => {
    this.Enrolls = Object.assign([], result);
    this.loading = false;
  });

 
}




  LoadData() {
    this.Enroll = this.fb.group({
      Id: [this.editEnroll.id],
      StudentId: [this.editEnroll.studentId],
      CourseId: [this.editEnroll.courseId],
      Created_datetime: [this.convertToDatetime(this.editEnroll.created_datetime)],
      Status: [this.editEnroll.status]
      
      
    });
  }

  convertToDatetime(datetimeString: string): Date | null {
    if (!datetimeString) {
      return null; // Return null if datetimeString is undefined or null
    }
  
    // Example datetime string: "2022-05-12T08:30:00"
    const [datePart, timePart] = datetimeString.split('T'); // Split date and time parts
    
    // Date part format: "yyyy-mm-dd"
    const [year, month, day] = datePart.split('-').map(Number); // Extract year, month, and day
    
    // Time part format: "hh:mm:ss"
    const [hours, minutes, seconds] = timePart.split(':').map(Number); // Extract hours, minutes, and seconds
  
    // Create a new Date object with the extracted date and time parts
    return new Date(year, month - 1, day, hours, minutes, seconds);
  }
  
  

  getStudentName(studentId: number): string {
    const student = this.Students.find(s => s.id === studentId);
    return student ? student.name : 'Unknown';
  }
  
  getCourseTitle(courseId: number): string {
    const course = this.Courses.find(c => c.id === courseId);
    return course ? course.title : 'Unknown';
  }
  

  convertToDate(dateString: string): string {
    // Assuming dateString is in the format "yyyy-MM-ddTHH:mm:ss"
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Convert date to "yyyy-MM-dd" format
  }

  // Save The Enroll
  submitForm() {
    this.submitted = true;
    // Check if the form is invalid
    if (this.Enroll.invalid) {
      this.tostr.error('Please fill out all fields.');
      return;
    }

    this.loading = true; // Set loading to true before making the API call
    this.api.saveEnroll(this.Enroll.value).subscribe(
      result => {
        this.tostr.success("Enroll Details Saved Successfully");
        this.loading = false;
        this.Enroll.reset(); // Reset the form after successful submission
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
    this.api.getEnroll(id).subscribe(result => {
      this.editEnroll = Object.assign([], result);
      this.LoadData();
      this.loading = false;
    });
  }

  // Delete the Selected Record
  onDelete(id: number) {
    if (confirm('Are You Sure To Delete This Record?')) {
      this.api.deleEnroll(id).subscribe(
        result => {
          this.tostr.success("Delete Enroll Successfully");
          this.GetCourses();
        },
        (error: HttpErrorResponse) => {
          this.loading = false;
        }
      );
    }
  }

  // Reset the form
  clear() {
    this.Enroll.reset(); // Reset the form
  }

  
  getTotalPages(): number {
    // Calculate total pages for pagination
    return Math.ceil(this.Enrolls.length / this.pageSize);
  }

  onPageChange(page: number): void {
    // Update current page
    this.currentPage = page;
  }

  filterEnrolls() : any[] {
       
    if (!this.searchTerm.trim()) {
      if(this.usertype =='Admin'){
        this.GetEnroll();
      }
      else{
        this.GetEnrollUsers();
      }
    }

    // Filter enrollments based on search term
    const searchTermLower = this.searchTerm.toLowerCase().trim();

    return this.Enrolls = this.Enrolls.filter(enrollment =>
      this.getStudentName(enrollment.studentId).toLowerCase().includes(searchTermLower) ||
      this.getCourseTitle(enrollment.courseId).toLowerCase().includes(searchTermLower) 

    );
  }

  logout() {
    // Call the logout method from your authentication service
    this.auth.logout();

    // Redirect the user to the login page or any other page
    this.route.navigate(['/login']); // Example: Navigate to login page
  }

  navigateToMainPage() {
    console.log('this.usertype',this.usertype)

    if(this.usertype =='Admin'){
      this.route.navigate(['/main']);
    }
    else{
      this.route.navigate(['/mainuser']);
    }
           
    }

}
