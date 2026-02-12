import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Application } from '../../../../core/services/applications.service';
import { TimeAgoPipe } from '../../../../shared/pipes/time-ago.pipe';

@Component({
  selector: 'app-application-card',
  standalone: true,
  imports: [CommonModule, FormsModule, TimeAgoPipe],
  templateUrl: './application-card.component.html'
})
export class ApplicationCardComponent {
  @Input({ required: true }) application!: Application;
  @Output() statusChange = new EventEmitter<{ id: number; status: Application['status'] }>();
  @Output() notesChange = new EventEmitter<{ id: number; notes: string }>();
  @Output() delete = new EventEmitter<number>();

  editingNotes = false;
  notesText = '';

  get statusLabel(): string {
    const labels: Record<string, string> = {
      'en_attente': 'Pending',
      'accepte': 'Accepted',
      'refuse': 'Rejected'
    };
    return labels[this.application.status] || this.application.status;
  }

  get statusClasses(): string {
    const classes: Record<string, string> = {
      'en_attente': 'bg-amber-100 text-amber-700 border-amber-200',
      'accepte': 'bg-green-100 text-green-700 border-green-200',
      'refuse': 'bg-red-100 text-red-700 border-red-200'
    };
    return classes[this.application.status] || 'bg-gray-100 text-gray-700 border-gray-200';
  }

  onStatusChange(status: Application['status']): void {
    this.statusChange.emit({ id: this.application.id!, status });
  }

  startEditNotes(): void {
    this.notesText = this.application.notes || '';
    this.editingNotes = true;
  }

  saveNotes(): void {
    this.notesChange.emit({ id: this.application.id!, notes: this.notesText });
    this.editingNotes = false;
  }

  cancelNotes(): void {
    this.editingNotes = false;
  }

  onDelete(): void {
    this.delete.emit(this.application.id!);
  }
}
