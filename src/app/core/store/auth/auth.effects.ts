import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, tap, switchMap } from 'rxjs/operators';
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
        switchMap(action => this.authService.login({ email: action.email, password: action.password }).pipe(
            map(user => AuthActions.loginSuccess({ user })),
            catchError(error => of(AuthActions.loginFailure({ error: error.message })))
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
        switchMap(action => this.authService.register(action.user).pipe(
            map(user => AuthActions.registerSuccess({ user })),
            catchError(error => of(AuthActions.registerFailure({ error: error.message })))
        ))
    ));

    registerSuccess$ = createEffect(() => this.actions$.pipe(
        ofType(AuthActions.registerSuccess),
        tap(() => {
            this.router.navigate(['/auth/login']);
        })
    ), { dispatch: false });

    logout$ = createEffect(() => this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
            this.authService.logout();
            this.router.navigate(['/']);
        })
    ), { dispatch: false });
}
