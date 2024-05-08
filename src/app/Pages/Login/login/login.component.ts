import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../Services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router, // Inject Angular Routern,
    private api: AuthService,
    private tostr: ToastrService

  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      Username: ['', Validators.required],
      Password: ['', Validators.required]
    });
  }

  onSubmit() {

    const { Username, Password } = this.loginForm.value;
    console.log('Username:', Username);
    console.log('Password:', Password);

    // Check if the form is invalid
    if (this.loginForm.invalid) {
      this.tostr.error('Please fill out all  fields.');
      return;
    }

    this.api.login(this.loginForm.value).subscribe(
      (result: any) => {
        // Check if the login was successful
        if (result) {
          // Check user role
          const userRole = this.api.getUserRole();
          console.log('userRole', userRole);
          if (userRole && userRole.toLowerCase() === 'admin') {
            // Navigate to the main page regardless of the role
            this.router.navigate(['/main']);
          }
          else{
            this.router.navigate(['/mainuser']);
          }
          
          
        } else {
          // Handle invalid login attempt
          this.tostr.error("Invalid Username Or Password");
        }
      },
      (error: HttpErrorResponse) => {
        // Handle HTTP errors
        if (error.status === 401) {
          // Unauthorized - invalid credentials
          this.tostr.error("Invalid Username Or Password");
        } else {
          // Other HTTP errors
          this.tostr.error("An error occurred. Please try again later.");
        }
      }
    );
    
    

  }
}
