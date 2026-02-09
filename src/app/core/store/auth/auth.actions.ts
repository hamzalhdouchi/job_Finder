import { createAction, props } from '@ngrx/store';

export const login = createAction('[Auth] Login', props<{ email: string; password: string }>());
export const loginSuccess = createAction('[Auth] Login Success', props<{ user: any }>());
export const restoreSession = createAction('[Auth] Restore Session', props<{ user: any }>());
export const loginFailure = createAction('[Auth] Login Failure', props<{ error: string }>());

export const register = createAction('[Auth] Register', props<{ user: any }>());
export const registerSuccess = createAction('[Auth] Register Success', props<{ user: any }>());
export const registerFailure = createAction('[Auth] Register Failure', props<{ error: string }>());

export const logout = createAction('[Auth] Logout');

export const updateProfile = createAction('[Auth] Update Profile', props<{ id: number; data: any }>());
export const updateProfileSuccess = createAction('[Auth] Update Profile Success', props<{ user: any }>());
export const updateProfileFailure = createAction('[Auth] Update Profile Failure', props<{ error: string }>());

export const checkAuth = createAction('[Auth] Check Auth');
