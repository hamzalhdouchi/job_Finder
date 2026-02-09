import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';

export interface AuthState {
    user: any | null;
    token: string | null;
    loading: boolean;
    error: string | null;
}

export const initialState: AuthState = {
    user: null,
    token: null,
    loading: false,
    error: null
};

export const authReducer = createReducer(
    initialState,
    on(AuthActions.login, AuthActions.register, AuthActions.updateProfile, state => ({
        ...state,
        loading: true,
        error: null
    })),
    on(AuthActions.loginSuccess, AuthActions.registerSuccess, AuthActions.restoreSession, (state, { user }) => ({
        ...state,
        user,
        loading: false,
        error: null
    })),
    on(AuthActions.updateProfileSuccess, (state, { user }) => ({
        ...state,
        user: { ...state.user, ...user },
        loading: false,
        error: null
    })),
    on(AuthActions.loginFailure, AuthActions.registerFailure, AuthActions.updateProfileFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),
    on(AuthActions.logout, state => ({
        ...state,
        user: null,
        token: null
    }))
);
