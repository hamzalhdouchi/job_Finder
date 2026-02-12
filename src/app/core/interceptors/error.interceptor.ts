import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let message = 'An unexpected error occurred';

            if (error.status === 0) {
                message = 'Unable to connect to the server. Please check your internet connection.';
            } else if (error.status === 401) {
                message = 'Authentication failed. Please log in again.';
            } else if (error.status === 403) {
                message = 'You do not have permission to perform this action.';
            } else if (error.status === 404) {
                message = 'The requested resource was not found.';
            } else if (error.status >= 500) {
                message = 'A server error occurred. Please try again later.';
            }

            const enrichedError = {
                ...error,
                userMessage: message,
                timestamp: new Date().toISOString()
            };

            return throwError(() => enrichedError);
        })
    );
};
