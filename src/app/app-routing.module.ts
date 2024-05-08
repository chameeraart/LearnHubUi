import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Pages/Login/login/login.component';
import { MainComponent } from './Pages/main/main.component';
import { StudentRegisterComponent } from './Pages/student-register/student-register.component';
import { CourseComponent } from './Pages/course/course.component';
import { EnrollComponent } from './Pages/enroll/enroll.component';
import { MainpageforUserComponent } from './mainpagefor-user/mainpagefor-user.component';
import { StudentComponent } from './Pages/student/student.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'main',
    component: MainComponent // MainComponent will be loaded when accessing '/main'
  },
  {
    path: 'StudentRegister',
    component: StudentRegisterComponent
  },
  {
    path: 'Course',
    component: CourseComponent
  },
  {
    path: 'Enroll',
    component: EnrollComponent
  },
  {
    path: 'mainuser',
    component: MainpageforUserComponent
  },
  {
    path: 'student',
    component: StudentComponent
  }
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
