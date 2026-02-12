import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot
) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.hasValidSession()) {
        authService.refreshSession();
        return true;
    }

    const returnUrl = state.url;

    return router.createUrlTree(['/auth/login'], { 
        queryParams: { returnUrl } 
    });
};

export const guestGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.hasValidSession()) {
        return true;
    }

    return router.createUrlTree(['/jobs']);
};

export function roleGuard(allowedRoles: string | string[]): CanActivateFn {
    return (route, state) => {
        const authService = inject(AuthService);
        const router = inject(Router);

        const user = authService.getCurrentUser();

        if (!user) {
            return router.createUrlTree(['/auth/login']);
        }

        return true;
    };
}
