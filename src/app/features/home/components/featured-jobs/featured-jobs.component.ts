import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Job } from '../../../../core/models/job.model';

@Component({
    selector: 'app-featured-jobs',
    standalone: true,
    imports: [RouterLink],
    styles: [`
        .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        .line-clamp-3 {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
    `],
    templateUrl: './featured-jobs.component.html'
})
export class FeaturedJobsComponent {
    jobs = input.required<Job[]>();
    loading = input(false);
    jobClicked = output<Job>();

    getMonth(dateStr: string): string {
        try {
            const d = new Date(dateStr);
            return d.toLocaleDateString('en', { month: 'short' }).toUpperCase();
        } catch {
            return '';
        }
    }

    getDay(dateStr: string): string {
        try {
            const d = new Date(dateStr);
            return d.getDate().toString();
        } catch {
            return '';
        }
    }
}
