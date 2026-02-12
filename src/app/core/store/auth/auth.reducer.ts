import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { User } from '../../services/auth.service';

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    successMessage: string | null;
}

export const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    successMessage: null
};

export const authReducer = createReducer(
    initialState,

    on(AuthActions.login, AuthActions.register, AuthActions.updateProfile, 
       AuthActions.changePassword, AuthActions.deleteAccount, state => ({
        ...state,
        loading: true,
        error: null,
        successMessage: null
    })),

    on(AuthActions.loginSuccess, (state, { user }) => ({
        ...state,
        user,
        isAuthenticated: true,
        loading: false,
        error: null
    })),

    on(AuthActions.restoreSession, (state, { user }) => ({
        ...state,
        user,
        isAuthenticated: true,
        loading: false,
        error: null
    })),

    on(AuthActions.registerSuccess, (state) => ({
        ...state,
        loading: false,
        error: null,
        successMessage: 'Account created successfully! Please login.'
    })),

    on(AuthActions.updateProfileSuccess, (state, { user }) => ({
        ...state,
        user: { ...state.user, ...user },
        loading: false,
        error: null,
        successMessage: 'Profile updated successfully!'
    })),

    on(AuthActions.changePasswordSuccess, state => ({
        ...state,
        loading: false,
        error: null,
        successMessage: 'Password changed successfully!'
    })),

    on(AuthActions.deleteAccountSuccess, state => ({
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
        successMessage: null
    })),

    on(AuthActions.loginFailure, AuthActions.registerFailure, 
       AuthActions.updateProfileFailure, AuthActions.changePasswordFailure,
       AuthActions.deleteAccountFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
        successMessage: null
    })),

    on(AuthActions.logout, state => ({
        ...state,
        user: null,
        isAuthenticated: false,
        error: null,
        successMessage: null
    })),

    on(AuthActions.clearError, state => ({
        ...state,
        error: null,
        successMessage: null
    }))
);
