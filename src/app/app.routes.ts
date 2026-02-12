import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { HomeComponent } from './features/home/home.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        pathMatch: 'full'
    },
    {
        path: 'auth',
        loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes)
    },
    {
        path: 'jobs',
        loadChildren: () => import('./features/jobs/jobs.routes').then(m => m.jobsRoutes)
    },
    {
        path: 'favorites',
        loadChildren: () => import('./features/favorites/favorites.routes').then(m => m.favoritesRoutes),
        canActivate: [authGuard]
    },
    {
        path: 'applications',
        loadChildren: () => import('./features/applications/applications.routes').then(m => m.applicationsRoutes),
        canActivate: [authGuard]
    },
    {
        path: 'profile',
        loadChildren: () => import('./features/profile/profile.routes').then(m => m.profileRoutes),
        canActivate: [authGuard]
    },
    {
        path: 'login',
        redirectTo: 'auth/login',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: ''
    }
];
