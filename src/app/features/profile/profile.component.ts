import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as AuthActions from '../../core/store/auth/auth.actions';
import { selectUser, selectAuthLoading } from '../../core/store/auth/auth.selectors';
import { take } from 'rxjs/operators';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
    profileForm: FormGroup;
    user$: Observable<any>;
    loading$: Observable<boolean>;
    private store = inject(Store);
    private fb = inject(FormBuilder);

    constructor() {
        this.user$ = this.store.select(selectUser);
        this.loading$ = this.store.select(selectAuthLoading);

        this.profileForm = this.fb.group({
            id: [''],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            role: ['']
        });
    }

    ngOnInit() {
        this.user$.pipe(take(1)).subscribe(user => {
            if (user) {
                this.profileForm.patchValue(user);
            }
        });
    }

    onSubmit() {
        if (this.profileForm.valid) {
            const { id, ...data } = this.profileForm.value;
            this.store.dispatch(AuthActions.updateProfile({ id, data }));
        }
    }

    logout() {
        this.store.dispatch(AuthActions.logout());
    }
}
