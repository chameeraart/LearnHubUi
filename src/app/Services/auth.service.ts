import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, map } from 'rxjs';
import { config } from '../config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  private _refreshNeeded$ = new Subject<void>();

  get refreshNeeded$(){
    return this._refreshNeeded$;
  }

  login(loginDto: any): Observable<any> {
    return this.http.post<any>(`${config.apiUrl}/Auth/Login`, loginDto)
      .pipe(
        map(response => {
          // login successful if there's a jwt token in the response
          if (response) {
            // store username and jwt token in local storage to keep user logged in between page refreshes
            console.log(response)
            localStorage.setItem('currentUser', JSON.stringify({ response}));
            this. getUserRole();
            this.getUserId();
          }
          return response;
        })
      );
  }

  logout(): void {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
  }

  getToken(): string | null {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return currentUser.response.jwt || null;

  }

  getUsername(): string | null {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return currentUser.username || null;
  }

  getUserRole(): string | null {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return currentUser.response.userrole || null;
  }

  getUserId(): string | null {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    console.log('currentUser.response.studentId',currentUser.response.studentId)
    return currentUser.response.studentId || null;
  }

  isLoggedIn(): boolean {
    // check if user is logged in based on the presence of token in local storage
    return !!this.getToken();
  }

}
