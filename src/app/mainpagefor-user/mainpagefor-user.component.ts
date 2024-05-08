import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../Services/auth.service';

@Component({
  selector: 'app-mainpagefor-user',
  templateUrl: './mainpagefor-user.component.html',
  styleUrl: './mainpagefor-user.component.css'
})
export class MainpageforUserComponent {
  constructor(private fb: FormBuilder, private tostr: ToastrService,private auth: AuthService,private route: Router) { }

  logout() {
    // Call the logout method from your authentication service
    this.auth.logout();

    // Redirect the user to the login page or any other page
    this.route.navigate(['/login']); // Example: Navigate to login page
  }

}
