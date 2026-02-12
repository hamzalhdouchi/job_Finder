import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, tap, switchMap, exhaustMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
    private actions$ = inject(Actions);
    private authService = inject(AuthService);
    private router = inject(Router);

    login$ = createEffect(() => this.actions$.pipe(
        ofType(AuthActions.login),
        exhaustMap(action => this.authService.login({ 
            email: action.email, 
            password: action.password 
        }).pipe(
            map(user => AuthActions.loginSuccess({ user })),
            catchError(error => of(AuthActions.loginFailure({ 
                error: error.message || 'Login failed. Please try again.' 
            })))
        ))
    ));

    loginSuccess$ = createEffect(() => this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ user }) => {
            this.authService.setSession(user);
            this.router.navigate(['/jobs']);
        })
    ), { dispatch: false });

    register$ = createEffect(() => this.actions$.pipe(
        ofType(AuthActions.register),
        exhaustMap(action => this.authService.register(action.user).pipe(
            map(user => AuthActions.registerSuccess({ user })),
            catchError(error => of(AuthActions.registerFailure({ 
                error: error.message || 'Registration failed. Please try again.' 
            })))
        ))
    ));

    registerSuccess$ = createEffect(() => this.actions$.pipe(
        ofType(AuthActions.registerSuccess),
        tap(() => {
            this.router.navigate(['/auth/login']);
        })
    ), { dispatch: false });

    updateProfile$ = createEffect(() => this.actions$.pipe(
        ofType(AuthActions.updateProfile),
        switchMap(action => this.authService.updateProfile(action.id, action.data).pipe(
            map(user => AuthActions.updateProfileSuccess({ user })),
            catchError(error => of(AuthActions.updateProfileFailure({ 
                error: error.message || 'Profile update failed.' 
            })))
        ))
    ));

    changePassword$ = createEffect(() => this.actions$.pipe(
        ofType(AuthActions.changePassword),
        switchMap(action => this.authService.changePassword(
            action.id, 
            action.currentPassword, 
            action.newPassword
        ).pipe(
            map(() => AuthActions.changePasswordSuccess()),
            catchError(error => of(AuthActions.changePasswordFailure({ 
                error: error.message || 'Password change failed.' 
            })))
        ))
    ));

    deleteAccount$ = createEffect(() => this.actions$.pipe(
        ofType(AuthActions.deleteAccount),
        switchMap(action => this.authService.deleteAccount(action.id).pipe(
            map(() => AuthActions.deleteAccountSuccess()),
            catchError(error => of(AuthActions.deleteAccountFailure({ 
                error: error.message || 'Account deletion failed.' 
            })))
        ))
    ));

    deleteAccountSuccess$ = createEffect(() => this.actions$.pipe(
        ofType(AuthActions.deleteAccountSuccess),
        tap(() => {
            this.router.navigate(['/']);
        })
    ), { dispatch: false });

    logout$ = createEffect(() => this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
            this.authService.logout();
            this.router.navigate(['/auth/login']);
        })
    ), { dispatch: false });
}
