import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../enviroments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    get<T>(endpoint: string, params?: any): Observable<T> {
        let httpParams = new HttpParams();

        if (params) {
            Object.keys(params).forEach(key => {
                if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
                    httpParams = httpParams.set(key, params[key].toString());
                }
            });
        }

        return this.http.get<T>(`${this.apiUrl}${endpoint}`, { params: httpParams })
            .pipe(catchError(this.handleError));
    }

    post<T>(endpoint: string, data: any): Observable<T> {
        return this.http.post<T>(`${this.apiUrl}${endpoint}`, data)
            .pipe(catchError(this.handleError));
    }

    patch<T>(endpoint: string, data: any): Observable<T> {
        return this.http.patch<T>(`${this.apiUrl}${endpoint}`, data)
            .pipe(catchError(this.handleError));
    }

    put<T>(endpoint: string, data: any): Observable<T> {
        return this.http.put<T>(`${this.apiUrl}${endpoint}`, data)
            .pipe(catchError(this.handleError));
    }

    delete<T>(endpoint: string): Observable<T> {
        return this.http.delete<T>(`${this.apiUrl}${endpoint}`)
            .pipe(catchError(this.handleError));
    }

    private handleError(error: HttpErrorResponse) {
        let errorMessage = 'An unknown error occurred';

        if (error.error instanceof ErrorEvent) {
            // Client-side error
            errorMessage = error.error.message;
        } else {
            // Server-side error
            if (error.error && error.error.message) {
                errorMessage = error.error.message;
            } else {
                errorMessage = `Error ${error.status}: ${error.statusText}`;
            }
        }

        console.error('API Error:', error);
        return throwError(() => new Error(errorMessage));
    }
}