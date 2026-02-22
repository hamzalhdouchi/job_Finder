import { Component, OnInit, OnDestroy, ElementRef, ViewChild, ViewChildren, QueryList, AfterViewInit, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { JobService } from '../../../core/services/job.service';
import { Job, JobSearchParams, JobSearchResult } from '../../../core/models/job.model';
import { selectIsAuthenticated } from '../../../core/store/auth/auth.selectors';
import { AuthService } from '../../../core/services/auth.service';
import * as FavoritesActions from '../../favorites/store/favorites.actions';
import { selectAllFavorites } from '../../favorites/store/favorites.selectors';
import { FavoriteOffer } from '../../../core/services/favorites.service';
import { ApplicationsService } from '../../../core/services/applications.service';
import { JobDetailPanelComponent } from '../components/job-detail-panel/job-detail-panel.component';

@Component({
  selector: 'app-job-search',
  standalone: true,
  imports: [CommonModule, FormsModule, JobDetailPanelComponent],
  templateUrl: './job-search.component.html',
  styles: [`
      :host { display: block; }

      select {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 0.75rem center;
        background-size: 1.25rem;
        padding-right: 2.5rem;
      }

      .custom-scrollbar::-webkit-scrollbar { width: 6px; }
      .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      .custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px; }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #9ca3af; }

      .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
      .line-clamp-6 { display: -webkit-box; -webkit-line-clamp: 6; -webkit-box-orient: vertical; overflow: hidden; }
    `]
})
export class JobSearchComponent implements OnInit, OnDestroy, AfterViewInit {
  private store = inject(Store);
  private jobService = inject(JobService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private applicationsService = inject(ApplicationsService);
  private elementRef = inject(ElementRef);
  private destroy$ = new Subject<void>();
  private mobileObserver?: IntersectionObserver;
  private desktopObserver?: IntersectionObserver;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.countryDropdownOpen && !this.elementRef.nativeElement.querySelector('.relative')?.contains(event.target)) {
      this.countryDropdownOpen = false;
    }
  }

  @ViewChildren('scrollSentinel') scrollSentinels?: QueryList<ElementRef<HTMLDivElement>>;
  @ViewChild('desktopScrollContainer') desktopScrollContainer?: ElementRef<HTMLDivElement>;

  searchKeywords = '';
  searchLocation = '';
  searchCountry = 'us';
  countryDropdownOpen = false;

  allJobs = signal<Job[]>([]);
  totalResults = signal(0);
  currentPage = 1;
  resultsPerPage = 10;
  hasMorePages = signal(true);

  isLoading = signal(false);
  hasSearched = signal(false);
  errorMessage = signal('');
  isAuthenticated = signal(false);
  selectedJob = signal<Job | null>(null);
  favoriteOfferIds = signal<Set<string>>(new Set());
  trackedJobIds = signal<Set<string>>(new Set());
  toastMessage = signal('');

  countries = [
    { code: 'us', name: 'United States', flag: '🇺🇸' },
    { code: 'gb', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'ca', name: 'Canada', flag: '🇨🇦' },
    { code: 'au', name: 'Australia', flag: '🇦🇺' },
    { code: 'de', name: 'Germany', flag: '🇩🇪' },
    { code: 'fr', name: 'France', flag: '🇫🇷' },
    { code: 'in', name: 'India', flag: '🇮🇳' },
    { code: 'nl', name: 'Netherlands', flag: '🇳🇱' },
    { code: 'nz', name: 'New Zealand', flag: '🇳🇿' },
    { code: 'sg', name: 'Singapore', flag: '🇸🇬' },
    { code: 'za', name: 'South Africa', flag: '🇿🇦' },
    { code: 'br', name: 'Brazil', flag: '🇧🇷' },
    { code: 'mx', name: 'Mexico', flag: '🇲🇽' },
    { code: 'it', name: 'Italy', flag: '🇮🇹' },
    { code: 'es', name: 'Spain', flag: '🇪🇸' },
    { code: 'pl', name: 'Poland', flag: '🇵🇱' },
    { code: 'at', name: 'Austria', flag: '🇦🇹' },
    { code: 'ch', name: 'Switzerland', flag: '🇨🇭' },
    { code: 'be', name: 'Belgium', flag: '🇧🇪' },
    { code: 'ru', name: 'Russia', flag: '🇷🇺' }
  ];

  ngOnInit(): void {
    this.isAuthenticated.set(this.authService.hasValidSession());
    this.authService.isAuthenticated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isAuth => {
        this.isAuthenticated.set(isAuth);
        if (isAuth) {
          this.store.dispatch(FavoritesActions.loadFavorites());
        }
      });

    if (this.authService.hasValidSession()) {
      this.applicationsService.loadApplications()
        .pipe(takeUntil(this.destroy$))
        .subscribe(apps => {
          this.trackedJobIds.set(new Set(apps.map(a => a.offerId)));
        });
    }

    this.store.select(selectAllFavorites)
      .pipe(takeUntil(this.destroy$))
      .subscribe(favs => {
        this.favoriteOfferIds.set(new Set(favs.map(f => f.offerId)));
      });

    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        if (params['q']) this.searchKeywords = params['q'];
        if (params['location']) this.searchLocation = params['location'];
        if (params['country']) this.searchCountry = params['country'];

        this.onSearch();
      });
  }

  ngAfterViewInit(): void {
    this.scrollSentinels?.changes
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.setupIntersectionObserver());
    this.setupIntersectionObserver();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.mobileObserver?.disconnect();
    this.desktopObserver?.disconnect();
  }

  private setupIntersectionObserver(): void {
    this.mobileObserver?.disconnect();
    this.desktopObserver?.disconnect();

    if (!this.scrollSentinels || this.scrollSentinels.length === 0) return;

    const callback: IntersectionObserverCallback = (entries) => {
      if (entries.some(e => e.isIntersecting) && !this.isLoading() && this.hasMorePages() && this.allJobs().length > 0) {
        this.loadMoreJobs();
      }
    };

    const sentinelArray = this.scrollSentinels.toArray();

    if (sentinelArray[0]) {
      this.mobileObserver = new IntersectionObserver(callback, { threshold: 0.1 });
      this.mobileObserver.observe(sentinelArray[0].nativeElement);
    }

    if (sentinelArray[1]) {
      this.desktopObserver = new IntersectionObserver(callback, {
        root: this.desktopScrollContainer?.nativeElement ?? null,
        threshold: 0.1,
      });
      this.desktopObserver.observe(sentinelArray[1].nativeElement);
    }
  }

  onKeywordChange(_value: string): void {
  }

  resetSearch(): void {
    this.searchKeywords = '';
    this.searchLocation = '';
    this.allJobs.set([]);
    this.totalResults.set(0);
    this.currentPage = 1;
    this.hasMorePages.set(true);
    this.errorMessage.set('');
    this.selectedJob.set(null);
    this.toastMessage.set('');
    this.onSearch();
  }

  onSearch(): void {
    this.currentPage = 1;
    this.allJobs.set([]);
    this.selectedJob.set(null);
    this.hasMorePages.set(true);
    this.errorMessage.set('');
    this.hasSearched.set(true);
    this.loadJobs();
  }

  private loadJobs(): void {
    if (this.isLoading()) return;

    this.isLoading.set(true);

    const params: JobSearchParams = {
      keywords: this.searchKeywords || '',
      location: this.searchLocation || '',
      country: this.searchCountry,
      resultsPerPage: this.resultsPerPage,
      page: this.currentPage
    };

    this.jobService.searchJobs(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result: JobSearchResult) => {
          const newJobs = [...this.allJobs(), ...result.jobs];
          this.allJobs.set(newJobs);
          this.totalResults.set(result.totalResults);
          this.hasMorePages.set(newJobs.length < result.totalResults);
          this.isLoading.set(false);
          if (!this.selectedJob() && newJobs.length > 0) {
            this.selectedJob.set(newJobs[0]);
          }
        },
        error: (error) => {
          this.errorMessage.set(error.message || 'Failed to load jobs. Please try again.');
          this.isLoading.set(false);
        }
      });
  }

  private loadMoreJobs(): void {
    this.currentPage++;
    this.loadJobs();
  }

  getCountryName(code: string): string {
    const country = this.countries.find(c => c.code === code);
    return country ? country.name : code.toUpperCase();
  }

  trackByJobId(index: number, job: Job): string {
    return job.id;
  }

  getSelectedCountryName(): string {
    return this.countries.find(c => c.code === this.searchCountry)?.name ?? 'Select country';
  }

  selectJob(job: Job): void {
    this.selectedJob.set(job);
  }

  getMonth(dateStr: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleString('en', { month: 'short' }).toUpperCase();
  }

  getDay(dateStr: string): string {
    if (!dateStr) return '';
    return new Date(dateStr).getDate().toString();
  }

  onAddToFavorites(job: Job): void {
    if (!this.authService.hasValidSession()) {
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: '/jobs' } });
      return;
    }

    const offer: Omit<FavoriteOffer, 'id' | 'userId' | 'savedAt'> = {
      offerId: job.id,
      title: job.title,
      company: job.company.name,
      location: job.location,
      salary: job.salary || undefined,
      url: job.landingPageUrl || undefined
    };

    this.store.dispatch(FavoritesActions.addFavorite({ offer }));
    this.favoriteOfferIds.update(ids => new Set([...ids, job.id]));
    this.showToast('Added to favorites!');
  }

  onTrackApplication(job: Job): void {
    if (!this.authService.hasValidSession()) {
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: '/jobs' } });
      return;
    }

    this.applicationsService.addApplication({
      offerId: job.id,
      title: job.title,
      company: job.company.name,
      location: job.location,
      url: job.landingPageUrl || '',
      apiSource: 'adzuna',
      notes: ''
    }).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.trackedJobIds.update(ids => new Set([...ids, job.id]));
        this.showToast('Application tracking started!');
      },
      error: err => this.showToast(err.message || 'Failed to track application')
    });
  }

  isFavorite(jobId: string): boolean {
    return this.favoriteOfferIds().has(jobId);
  }

  isTracked(jobId: string): boolean {
    return this.trackedJobIds().has(jobId);
  }

  private showToast(message: string): void {
    this.toastMessage.set(message);
    setTimeout(() => this.toastMessage.set(''), 3000);
  }
}
