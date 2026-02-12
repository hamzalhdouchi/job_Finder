import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectUser } from '../store/auth/auth.selectors';
import { take, map, tap } from 'rxjs/operators';
import { User } from '../services/auth.service';

export const userResolver: ResolveFn<User | null> = () => {
    const store = inject(Store);
    const router = inject(Router);

    return store.select(selectUser).pipe(
        take(1),
        tap(user => {
            if (!user) {
                router.navigate(['/auth/login']);
            }
        }),
        map(user => user ?? null)
    );
};
