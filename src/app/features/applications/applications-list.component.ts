import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Application, ApplicationsService } from '../../core/services/applications.service';
import { ApplicationCardComponent } from './components/application-card/application-card.component';

@Component({
  selector: 'app-applications-list',
  standalone: true,
  imports: [CommonModule, ApplicationCardComponent],
  templateUrl: './applications-list.component.html'
})
export class ApplicationsListComponent implements OnInit, OnDestroy {
  private applicationsService = inject(ApplicationsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  applications = signal<Application[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  activeFilter = signal<'all' | 'en_attente' | 'accepte' | 'refuse'>('all');

  filteredApplications = computed(() => {
    const filter = this.activeFilter();
    const apps = this.applications();
    if (filter === 'all') return apps;
    return apps.filter(a => a.status === filter);
  });

  stats = computed(() => {
    const apps = this.applications();
    return {
      total: apps.length,
      pending: apps.filter(a => a.status === 'en_attente').length,
      accepted: apps.filter(a => a.status === 'accepte').length,
      rejected: apps.filter(a => a.status === 'refuse').length
    };
  });

  ngOnInit(): void {
    this.loadApplications();

    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      if (params['addOfferId']) {
        this.addFromParams(params);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadApplications(): void {
    this.isLoading.set(true);
    this.applicationsService.loadApplications()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: apps => {
          this.applications.set(apps);
          this.isLoading.set(false);
        },
        error: err => {
          this.errorMessage.set(err.message || 'Failed to load applications');
          this.isLoading.set(false);
        }
      });
  }

  private addFromParams(params: any): void {
    this.applicationsService.addApplication({
      offerId: params['addOfferId'],
      title: params['title'] || 'Unknown Position',
      company: params['company'] || 'Unknown Company',
      location: params['location'] || '',
      url: params['url'] || '',
      apiSource: 'adzuna',
      notes: ''
    }).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.successMessage.set('Application added to tracking!');
        this.loadApplications();
        this.router.navigate([], { queryParams: {} });
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: err => {
        this.errorMessage.set(err.message);
        this.router.navigate([], { queryParams: {} });
        setTimeout(() => this.errorMessage.set(''), 3000);
      }
    });
  }

  onStatusChange(event: { id: number; status: Application['status'] }): void {
    this.applicationsService.updateStatus(event.id, event.status)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: updated => {
          this.applications.update(apps =>
            apps.map(a => a.id === event.id ? { ...a, status: event.status } : a)
          );
        },
        error: err => this.errorMessage.set(err.message || 'Failed to update status')
      });
  }

  onNotesChange(event: { id: number; notes: string }): void {
    this.applicationsService.updateNotes(event.id, event.notes)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.applications.update(apps =>
            apps.map(a => a.id === event.id ? { ...a, notes: event.notes } : a)
          );
        },
        error: err => this.errorMessage.set(err.message || 'Failed to update notes')
      });
  }

  onDelete(id: number): void {
    this.applicationsService.deleteApplication(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.applications.update(apps => apps.filter(a => a.id !== id));
        },
        error: err => this.errorMessage.set(err.message || 'Failed to delete application')
      });
  }

  setFilter(filter: 'all' | 'en_attente' | 'accepte' | 'refuse'): void {
    this.activeFilter.set(filter);
  }

  goToSearch(): void {
    this.router.navigate(['/jobs']);
  }

  trackById(index: number, app: Application): number {
    return app.id!;
  }
}
