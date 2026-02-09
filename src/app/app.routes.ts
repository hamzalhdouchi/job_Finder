import { Routes } from '@angular/router';

export const routes: Routes = [
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
        loadChildren: () => import('./features/favorites/favorites.routes').then(m => m.favoritesRoutes)
    },
    {
        path: 'applications',
        loadChildren: () => import('./features/applications/applications.routes').then(m => m.applicationsRoutes)
    },
    {
        path: 'profile',
        loadChildren: () => import('./features/profile/profile.routes').then(m => m.profileRoutes)
    },
    {
        path: 'login',
        redirectTo: 'auth/login',
        pathMatch: 'full'
    },
    {
        path: '',
        redirectTo: 'jobs',
        pathMatch: 'full'
    }
];
