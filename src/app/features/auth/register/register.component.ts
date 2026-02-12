import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Store } from '@ngrx/store';
import { RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import * as AuthActions from '../../../core/store/auth/auth.actions';
import { selectAuthLoading, selectAuthError } from '../../../core/store/auth/auth.selectors';
import { AuthService } from '../../../core/services/auth.service';
import { PasswordStrengthComponent } from '../components/password-strength/password-strength.component';
import { AuthBrandingComponent } from '../components/auth-branding/auth-branding.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, PasswordStrengthComponent, AuthBrandingComponent],
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
  loading$;
  error$;
  showPassword = false;
  showConfirmPassword = false;
  emailChecking = false;
  emailAvailable = true;

  private destroy$ = new Subject<void>();
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private authService = inject(AuthService);

  passwordStrength = signal({
    hasMinLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecial: false
  });
  hasPasswordValue = signal(false);

  constructor() {
    this.loading$ = this.store.select(selectAuthLoading);
    this.error$ = this.store.select(selectAuthError);

    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordStrengthValidator.bind(this)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {
    this.store.dispatch(AuthActions.clearError());

    this.registerForm.get('email')?.valueChanges.pipe(
      takeUntil(this.destroy$),
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(email => {
        if (!email || this.registerForm.get('email')?.invalid) {
          return [];
        }
        this.emailChecking = true;
        return this.authService.checkEmailExists(email);
      })
    ).subscribe(exists => {
      this.emailChecking = false;
      this.emailAvailable = !exists;
    });

    this.registerForm.get('password')?.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(password => {
      this.hasPasswordValue.set(!!password);
      this.updatePasswordStrength(password || '');
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updatePasswordStrength(password: string): void {
    this.passwordStrength.set({
      hasMinLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    });
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
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      group.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    if (this.registerForm.valid && this.emailAvailable) {
      const { confirmPassword, acceptTerms, ...userData } = this.registerForm.value;
      this.store.dispatch(AuthActions.register({ user: userData }));
    } else {
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.markAsTouched();
      });
    }
  }

  get firstNameControl() { return this.registerForm.get('firstName'); }
  get lastNameControl() { return this.registerForm.get('lastName'); }
  get emailControl() { return this.registerForm.get('email'); }
  get passwordControl() { return this.registerForm.get('password'); }
  get confirmPasswordControl() { return this.registerForm.get('confirmPassword'); }
}
