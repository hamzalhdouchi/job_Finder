import { Routes } from '@angular/router';
import { JobSearchComponent } from './job-search/job-search.component';

export const jobsRoutes: Routes = [
    {
        path: '',
        component: JobSearchComponent
    }
];
