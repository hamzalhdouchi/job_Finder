import { HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    return next(req).pipe(
        catchError(error => {
            console.error('Error Interceptor:', error);
            // Can add toast notification logic here
            return throwError(() => error);
        })
    );
};
