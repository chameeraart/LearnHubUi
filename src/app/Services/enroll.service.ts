import { Injectable } from '@angular/core';
import { config } from '../config';
import { Observable, Subject, catchError, tap, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EnrollService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  private _refreshNeeded$ = new Subject<void>();

  get refreshNeeded$(): Observable<void> {
    return this._refreshNeeded$;
  }

  saveEnroll(enroll: any): Observable<any> {
    const headers = this.getHeadersWithToken();
    // Make HTTP POST request with token in headers
    return this.http.post<any>(`${config.apiUrl}/Enroll`, enroll, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  getsaveGetAllEnroll(): Observable<any> {
    const headers = this.getHeadersWithToken();
    return this.http.get<any>(`${config.apiUrl}/Enroll/`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  getEnroll(Id: number): Observable<any> {
    const headers = this.getHeadersWithToken();
    return this.http.get<any>(`${config.apiUrl}/Enroll/` + Id, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  getEnrollUser(Id: number): Observable<any> {
    const headers = this.getHeadersWithToken();
    return this.http.get<any>(`${config.apiUrl}/Enroll/enroll/` + Id, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  deleEnroll(Id: number): Observable<any> {
    const headers = this.getHeadersWithToken();
    return this.http.get<any>(`${config.apiUrl}/Enroll/` + Id, { headers })
      .pipe(
        tap(() => {
          this._refreshNeeded$.next();
        }),
        catchError(this.handleError)
      );
  }


  getEnrolAll(): Observable<any> {
    const headers = this.getHeadersWithToken();
    return this.http.get<any>(`${config.apiUrl}/Enroll/`, { headers })
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
