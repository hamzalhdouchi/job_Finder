import { Routes } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { authGuard } from '../../core/guards/auth.guard';
import { userResolver } from '../../core/resolvers/user.resolver';

export const profileRoutes: Routes = [
    { 
        path: '', 
        component: ProfileComponent,
        canActivate: [authGuard],
        resolve: { user: userResolver }
    }
];
