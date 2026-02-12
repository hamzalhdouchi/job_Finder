import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectUser, selectIsAuthenticated } from '../../../core/store/auth/auth.selectors';
import * as AuthActions from '../../../core/store/auth/auth.actions';
import { User } from '../../../core/services/auth.service';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterLinkActive],
    templateUrl: './header.component.html'
})
export class HeaderComponent {
    private store = inject(Store);
    @Input() transparent = false;

    user$: Observable<User | null> = this.store.select(selectUser);
    isAuthenticated$: Observable<boolean> = this.store.select(selectIsAuthenticated);
    mobileMenuOpen = false;

    logout(): void {
        this.store.dispatch(AuthActions.logout());
    }
}
