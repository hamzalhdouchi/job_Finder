import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { JobService } from '../../core/services/job.service';
import { Job } from '../../core/models/job.model';
import { FeaturedJobsComponent } from './components/featured-jobs/featured-jobs.component';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule, FeaturedJobsComponent],
    templateUrl: './home.component.html',
    styles: [`
        @keyframes marquee {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
        }
        .animate-marquee {
            animation: marquee 25s linear infinite;
        }
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
    `]
})
export class HomeComponent implements OnInit {
    private router = inject(Router);
    private jobService = inject(JobService);

    searchKeywords = '';
    featuredJobs = signal<Job[]>([]);
    loadingFeatured = signal(true);

    categories = [
        { tag: 'it-jobs', label: 'IT & Technology' },
        { tag: 'engineering-jobs', label: 'Engineering' },
        { tag: 'healthcare-nursing-jobs', label: 'Healthcare' },
        { tag: 'accounting-finance-jobs', label: 'Finance' },
        { tag: 'teaching-jobs', label: 'Education' },
        { tag: 'sales-jobs', label: 'Sales' },
        { tag: 'legal-jobs', label: 'Legal' },
        { tag: 'creative-design-jobs', label: 'Creative & Design' },
    ];

    ngOnInit(): void {
        this.loadFeaturedJobs();
    }

    loadFeaturedJobs(): void {
        this.loadingFeatured.set(true);
        this.jobService.searchJobs({
            keywords: '',
            location: '',
            country: 'gb',
            page: 1,
            resultsPerPage: 4,
            sortBy: 'date'
        }).subscribe({
            next: (result) => {
                this.featuredJobs.set(result.jobs);
                this.loadingFeatured.set(false);
            },
            error: () => {
                this.loadingFeatured.set(false);
            }
        });
    }

    goToSearch(): void {
        if (this.searchKeywords.trim()) {
            this.router.navigate(['/jobs'], { queryParams: { q: this.searchKeywords.trim() } });
        } else {
            this.router.navigate(['/jobs']);
        }
    }

    openJob(job: Job): void {
        if (job.landingPageUrl) {
            window.open(job.landingPageUrl, '_blank');
        }
    }
}
