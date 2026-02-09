import { Routes } from '@angular/router';
import { JobsListComponent } from './job-list/job-list.component';
import { authGuard } from '../../core/guards/auth.guard';

export const jobsRoutes: Routes = [
    {
        path: '',
        component: JobsListComponent,
        canActivate: [authGuard]
    }
];
