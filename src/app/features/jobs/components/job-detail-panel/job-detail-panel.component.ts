import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Job } from '../../../../core/models/job.model';
import { TimeAgoPipe } from '../../../../shared/pipes/time-ago.pipe';

@Component({
    selector: 'app-job-detail-panel',
    standalone: true,
    imports: [CommonModule, TimeAgoPipe],
    styles: [`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
    `],
    templateUrl: './job-detail-panel.component.html'
})
export class JobDetailPanelComponent {
    job = input<Job | null>(null);
    isAuthenticated = input(false);
    isFavorite = input(false);
    isTracked = input(false);
    trackApplication = output<Job>();
    addToFavorites = output<Job>();
}
