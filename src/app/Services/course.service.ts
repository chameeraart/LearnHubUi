import { Injectable } from '@angular/core';
import { config } from '../config';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Subject, Observable, catchError, tap, throwError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  private _refreshNeeded$ = new Subject<void>();

  get refreshNeeded$(): Observable<void> {
    return this._refreshNeeded$;
  }

  saveCourse(course: any): Observable<any> {
    const headers = this.getHeadersWithToken();
    // Make HTTP POST request with token in headers
    return this.http.post<any>(`${config.apiUrl}/Course`, course, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  getsaveGetAllCourse(): Observable<any> {
    const headers = this.getHeadersWithToken();
    return this.http.get<any>(`${config.apiUrl}/Course/`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  getSCourse(Id: number): Observable<any> {
    const headers = this.getHeadersWithToken();
    return this.http.get<any>(`${config.apiUrl}/Course/` + Id, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  

  deleCourse(Id: number): Observable<any> {
    const headers = this.getHeadersWithToken();
    return this.http.delete<any>(`${config.apiUrl}/Course/` + Id, { headers })
      .pipe(
        tap(() => {
          this._refreshNeeded$.next();
        }),
        catchError(this.handleError)
      );
  }


  getTaskAll(): Observable<any> {
    const headers = this.getHeadersWithToken();
    return this.http.get<any>(`${config.apiUrl}/Course/`, { headers })
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
