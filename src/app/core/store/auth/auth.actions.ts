import { createAction, props } from '@ngrx/store';
import { User } from '../../services/auth.service';

export const login = createAction('[Auth] Login', props<{ email: string; password: string }>());
export const loginSuccess = createAction('[Auth] Login Success', props<{ user: User }>());
export const loginFailure = createAction('[Auth] Login Failure', props<{ error: string }>());

export const restoreSession = createAction('[Auth] Restore Session', props<{ user: User }>());

export const register = createAction('[Auth] Register', props<{ user: any }>());
export const registerSuccess = createAction('[Auth] Register Success', props<{ user: User }>());
export const registerFailure = createAction('[Auth] Register Failure', props<{ error: string }>());

export const logout = createAction('[Auth] Logout');

export const updateProfile = createAction('[Auth] Update Profile', props<{ id: number; data: Partial<User> }>());
export const updateProfileSuccess = createAction('[Auth] Update Profile Success', props<{ user: User }>());
export const updateProfileFailure = createAction('[Auth] Update Profile Failure', props<{ error: string }>());

export const changePassword = createAction(
    '[Auth] Change Password', 
    props<{ id: number; currentPassword: string; newPassword: string }>()
);
export const changePasswordSuccess = createAction('[Auth] Change Password Success');
export const changePasswordFailure = createAction('[Auth] Change Password Failure', props<{ error: string }>());

export const deleteAccount = createAction('[Auth] Delete Account', props<{ id: number }>());
export const deleteAccountSuccess = createAction('[Auth] Delete Account Success');
export const deleteAccountFailure = createAction('[Auth] Delete Account Failure', props<{ error: string }>());

export const checkAuth = createAction('[Auth] Check Auth');

export const clearError = createAction('[Auth] Clear Error');
