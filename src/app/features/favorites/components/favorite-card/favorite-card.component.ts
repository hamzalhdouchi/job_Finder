import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FavoriteOffer } from '../../../../core/services/favorites.service';

@Component({
  selector: 'app-favorite-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './favorite-card.component.html'
})
export class FavoriteCardComponent {
  @Input({ required: true }) favorite!: FavoriteOffer;
  @Output() remove = new EventEmitter<number>();
  @Output() trackApplication = new EventEmitter<FavoriteOffer>();
  @Output() notesChange = new EventEmitter<{ id: number; notes: string }>();

  editingNotes = false;
  notesText = '';

  onRemove(event: Event): void {
    event.stopPropagation();
    this.remove.emit(this.favorite.id!);
  }

  onTrack(event: Event): void {
    event.stopPropagation();
    this.trackApplication.emit(this.favorite);
  }

  startEditNotes(): void {
    this.notesText = this.favorite.notes || '';
    this.editingNotes = true;
  }

  saveNotes(): void {
    this.notesChange.emit({ id: this.favorite.id!, notes: this.notesText });
    this.editingNotes = false;
  }

  cancelNotes(): void {
    this.editingNotes = false;
  }

  getTimeAgo(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  }
}
