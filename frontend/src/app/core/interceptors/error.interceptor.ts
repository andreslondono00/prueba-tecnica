import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private toastr: ToastrService) { }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                let errorMessage = 'An error occurred';

                if (error.status === 0) {
                    errorMessage = 'Cannot connect to server';
                } else if (error.status === 400) {
                    errorMessage = error.error?.message || 'Bad request';
                } else if (error.status === 401) {
                    errorMessage = 'Unauthorized access';
                } else if (error.status === 403) {
                    errorMessage = 'Access forbidden';
                } else if (error.status === 404) {
                    errorMessage = 'Resource not found';
                } else if (error.status === 409) {
                    errorMessage = 'Conflict: Resource already exists';
                } else if (error.status === 422) {
                    errorMessage = 'Validation error';
                } else if (error.status === 429) {
                    errorMessage = 'Too many requests';
                } else if (error.status >= 500) {
                    errorMessage = 'Server error';
                }

                this.toastr.error(errorMessage, 'Error', {
                    timeOut: 5000,
                    positionClass: 'toast-top-right'
                });

                return throwError(() => error);
            })
        );
    }
}