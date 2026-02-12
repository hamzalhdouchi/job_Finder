import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as AuthActions from '../../core/store/auth/auth.actions';
import { selectUser, selectAuthLoading, selectAuthError, selectSuccessMessage } from '../../core/store/auth/auth.selectors';
import { User } from '../../core/services/auth.service';
import { DangerZoneComponent } from './components/danger-zone/danger-zone.component';

type ProfileTab = 'profile' | 'security' | 'danger';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, DangerZoneComponent],
    templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit, OnDestroy {
    profileForm: FormGroup;
    passwordForm: FormGroup;
    user$: Observable<User | null>;
    loading$: Observable<boolean>;
    error$: Observable<string | null>;
    successMessage$: Observable<string | null>;

    activeTab: ProfileTab = 'profile';
    showCurrentPassword = false;
    showNewPassword = false;
    showConfirmPassword = false;

    passwordStrength = {
        hasMinLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        hasSpecial: false
    };

    private destroy$ = new Subject<void>();
    private store = inject(Store);
    private fb = inject(FormBuilder);

    constructor() {
        this.user$ = this.store.select(selectUser);
        this.loading$ = this.store.select(selectAuthLoading);
        this.error$ = this.store.select(selectAuthError);
        this.successMessage$ = this.store.select(selectSuccessMessage);

        this.profileForm = this.fb.group({
            id: [''],
            firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
            lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
            email: ['', [Validators.required, Validators.email]]
        });

        this.passwordForm = this.fb.group({
            currentPassword: ['', [Validators.required]],
            newPassword: ['', [Validators.required, Validators.minLength(8), this.passwordStrengthValidator.bind(this)]],
            confirmPassword: ['', [Validators.required]]
        }, {
            validators: this.passwordMatchValidator
        });
    }

    ngOnInit(): void {
        this.user$.pipe(takeUntil(this.destroy$)).subscribe(user => {
            if (user) {
                this.profileForm.patchValue({
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email
                });
            }
        });

        this.passwordForm.get('newPassword')?.valueChanges.pipe(
            takeUntil(this.destroy$)
        ).subscribe(password => {
            this.updatePasswordStrength(password || '');
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private updatePasswordStrength(password: string): void {
        this.passwordStrength = {
            hasMinLength: password.length >= 8,
            hasUppercase: /[A-Z]/.test(password),
            hasLowercase: /[a-z]/.test(password),
            hasNumber: /[0-9]/.test(password),
            hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };
    }

    private passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
        const password = control.value;
        if (!password) return null;

        const errors: ValidationErrors = {};

        if (!/[A-Z]/.test(password)) errors['noUppercase'] = true;
        if (!/[a-z]/.test(password)) errors['noLowercase'] = true;
        if (!/[0-9]/.test(password)) errors['noNumber'] = true;
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors['noSpecial'] = true;

        return Object.keys(errors).length ? errors : null;
    }

    private passwordMatchValidator(group: FormGroup): ValidationErrors | null {
        const password = group.get('newPassword')?.value;
        const confirmPassword = group.get('confirmPassword')?.value;

        if (password && confirmPassword && password !== confirmPassword) {
            group.get('confirmPassword')?.setErrors({ passwordMismatch: true });
            return { passwordMismatch: true };
        }
        return null;
    }

    get strengthPercentage(): number {
        const checks = Object.values(this.passwordStrength);
        return (checks.filter(Boolean).length / checks.length) * 100;
    }

    get strengthLabel(): string {
        const percentage = this.strengthPercentage;
        if (percentage <= 20) return 'Very Weak';
        if (percentage <= 40) return 'Weak';
        if (percentage <= 60) return 'Fair';
        if (percentage <= 80) return 'Good';
        return 'Strong';
    }

    get strengthColor(): string {
        const percentage = this.strengthPercentage;
        if (percentage <= 20) return 'bg-red-500';
        if (percentage <= 40) return 'bg-orange-500';
        if (percentage <= 60) return 'bg-yellow-500';
        if (percentage <= 80) return 'bg-lime-500';
        return 'bg-green-600';
    }

    setTab(tab: ProfileTab): void {
        this.activeTab = tab;
        this.store.dispatch(AuthActions.clearError());
    }

    onProfileSubmit(): void {
        if (this.profileForm.valid) {
            const { id, role, ...data } = this.profileForm.value;
            this.store.dispatch(AuthActions.updateProfile({ id, data }));
        } else {
            Object.keys(this.profileForm.controls).forEach(key => {
                this.profileForm.get(key)?.markAsTouched();
            });
        }
    }

    onPasswordSubmit(): void {
        if (this.passwordForm.valid) {
            const { currentPassword, newPassword } = this.passwordForm.value;
            const id = this.profileForm.get('id')?.value;

            this.store.dispatch(AuthActions.changePassword({ 
                id, 
                currentPassword, 
                newPassword 
            }));

            this.passwordForm.reset();
        } else {
            Object.keys(this.passwordForm.controls).forEach(key => {
                this.passwordForm.get(key)?.markAsTouched();
            });
        }
    }

    onDeleteAccount(): void {
        const id = this.profileForm.get('id')?.value;
        this.store.dispatch(AuthActions.deleteAccount({ id }));
    }

    logout(): void {
        this.store.dispatch(AuthActions.logout());
    }

    get firstNameControl() { return this.profileForm.get('firstName'); }
    get lastNameControl() { return this.profileForm.get('lastName'); }
    get emailControl() { return this.profileForm.get('email'); }
    get currentPasswordControl() { return this.passwordForm.get('currentPassword'); }
    get newPasswordControl() { return this.passwordForm.get('newPassword'); }
    get confirmPasswordControl() { return this.passwordForm.get('confirmPassword'); }
}
