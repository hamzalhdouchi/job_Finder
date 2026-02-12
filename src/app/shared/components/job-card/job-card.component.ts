import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Job } from '../../../core/models/job.model';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-job-card',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './job-card.component.html'
})
export class JobCardComponent {
    @Input({ required: true }) job!: Job;
    @Input() isAuthenticated = false;
    @Output() addToFavorites = new EventEmitter<Job>();
    @Output() dismiss = new EventEmitter<Job>();
    @Output() trackApplication = new EventEmitter<Job>();

    onSave(event: Event): void {
        event.stopPropagation();
        event.preventDefault();
        this.addToFavorites.emit(this.job);
    }

    onDismiss(event: Event): void {
        event.stopPropagation();
        event.preventDefault();
        this.dismiss.emit(this.job);
    }

    onTitleClick(event: Event): void {
        this.trackApplication.emit(this.job);
    }
}
