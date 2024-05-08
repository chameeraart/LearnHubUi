import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable, Subject, catchError, tap, throwError } from 'rxjs';
import { config } from '../config';

@Injectable({
  providedIn: 'root'
})
export class StudentregisterService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  private _refreshNeeded$ = new Subject<void>();

  get refreshNeeded$(): Observable<void> {
    return this._refreshNeeded$;
  }

  saveStudent(student: any): Observable<any> {
    const headers = this.getHeadersWithToken();
    // Make HTTP POST request with token in headers
    return this.http.post<any>(`${config.apiUrl}/Student`, student, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  getsaveStudentAll(): Observable<any> {
    const headers = this.getHeadersWithToken();
    return this.http.get<any>(`${config.apiUrl}/Student/`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  getStudent(Id: number): Observable<any> {
    const headers = this.getHeadersWithToken();
    return this.http.get<any>(`${config.apiUrl}/Student/` + Id, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  deleStudent(Id: number): Observable<any> {
    const headers = this.getHeadersWithToken();
    return this.http.get<any>(`${config.apiUrl}/Student/` + Id, { headers })
      .pipe(
        tap(() => {
          this._refreshNeeded$.next();
        }),
        catchError(this.handleError)
      );
  }


  getTaskAll(): Observable<any> {
    const headers = this.getHeadersWithToken();
    return this.http.get<any>(`${config.apiUrl}/Student/`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  private getHeadersWithToken(): HttpHeaders {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('No JWT token found');
    }
    // Set JWT token in request headers
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }



}
