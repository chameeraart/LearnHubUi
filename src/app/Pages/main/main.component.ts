import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../Services/auth.service';
import { CourseService } from '../../Services/course.service';
import { EnrollService } from '../../Services/enroll.service';
import { StudentregisterService } from '../../Services/studentregister.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  constructor(private fb: FormBuilder, private tostr: ToastrService,private auth: AuthService,private route: Router) { }

  logout() {
    // Call the logout method from your authentication service
    this.auth.logout();

    // Redirect the user to the login page or any other page
    this.route.navigate(['/login']); // Example: Navigate to login page
  }

}
